import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Truck, CheckCircle, ArrowLeft, ArrowRight, AlertCircle, Shield, Globe, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { districts, getThanas } from "@/data/bangladeshLocations";
import { toast } from "sonner";
import { validateBangladeshPhone, isPhoneValidForCOD } from "@/lib/phoneValidation";

type PaymentMethod = "cod" | "online";

interface AppliedCoupon {
  code: string;
  discount_type: string;
  discount_value: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Address form
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  
  // Promo code from cart
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Load applied coupon from session storage (set in Cart page)
  useEffect(() => {
    const storedCoupon = sessionStorage.getItem("appliedCoupon");
    if (storedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(storedCoupon));
      } catch {
        sessionStorage.removeItem("appliedCoupon");
      }
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setDistrict(profile.shipping_address?.district || "");
      setThana(profile.shipping_address?.thana || "");
      setArea(profile.shipping_address?.area || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const subtotal = getTotalPrice();
  
  // Calculate discount amount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === "percentage") {
      discountAmount = Math.round((subtotal * appliedCoupon.discount_value) / 100);
    } else {
      discountAmount = appliedCoupon.discount_value;
    }
  }
  
  const discountedSubtotal = subtotal - discountAmount;
  
  // Intelligent delivery charge logic based on district
  const FREE_SHIPPING_THRESHOLD = 2500;
  
  const calculateShippingFee = () => {
    // Free delivery for orders over ৳2500 (based on discounted subtotal)
    if (discountedSubtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    
    // District-based shipping: Dhaka = ৳70, Others = ৳120
    if (!district) return 0; // Will be calculated once district is selected
    
    const isDhaka = district.toLowerCase() === "dhaka";
    return isDhaka ? 70 : 120;
  };
  
  const shippingFee = calculateShippingFee();
  // CRITICAL: Final total = Subtotal - Discount + Shipping
  const total = discountedSubtotal + shippingFee;

  // Check if phone is valid for COD
  const phoneValidForCOD = isPhoneValidForCOD(phone);
  const showPhoneWarning = paymentMethod === "cod" && !phoneValidForCOD;

  const handlePlaceOrder = async () => {
    if (!user) return;
    
    if (!district || !thana || !area || !phone) {
      toast.error("Please fill in all address fields");
      return;
    }

    // Validate phone number format
    if (!validateBangladeshPhone(phone)) {
      toast.error("Please enter a valid Bangladesh phone number");
      return;
    }

    // Block COD if phone is not valid
    if (paymentMethod === "cod" && !phoneValidForCOD) {
      toast.error("A valid phone number is required for Cash on Delivery");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // For online payment, create a pending order first (order will be created after successful payment)
      if (paymentMethod === "online") {
        // Create pending order with discount info
        const { data: pendingOrder, error: pendingError } = await supabase
          .from("pending_orders")
          .insert({
            user_id: user.id,
            total_price: total, // Already includes discount
            payment_method: "card",
            shipping_address: { district, thana, area },
            shipping_fee: shippingFee,
            notes,
            promo_code_used: appliedCoupon?.code || null,
            discount_amount: discountAmount,
            cart_items: cartItems.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image
            })),
          })
          .select()
          .single();

        if (pendingError) throw pendingError;

        const productDetails = cartItems.map(item => `${item.name} x${item.quantity}`).join(", ");
        
        // CRITICAL: Send the DISCOUNTED total to payment gateway
        const { data: sslData, error: sslError } = await supabase.functions.invoke('sslcommerz-init', {
          body: {
            pendingOrderId: pendingOrder.id,
            amount: total, // This is the discounted total
            customerName: profile?.name || user.email?.split('@')[0] || 'Customer',
            customerEmail: user.email || '',
            customerPhone: phone,
            shippingAddress: { district, thana, area },
            productDetails: productDetails.slice(0, 250),
          }
        });

        if (sslError) throw sslError;

        if (sslData?.gatewayUrl) {
          // Clear the coupon from session storage after successful order creation
          sessionStorage.removeItem("appliedCoupon");
          // Redirect to SSLCommerz payment gateway
          window.location.href = sslData.gatewayUrl;
          return;
        } else {
          // Delete the pending order if SSLCommerz fails
          await supabase.from("pending_orders").delete().eq("id", pendingOrder.id);
          throw new Error(sslData?.error || 'Failed to initiate online payment');
        }
      }

      // For COD, create order directly with discount info
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_price: total, // Discounted total
          status: "pending",
          payment_method: "cod",
          shipping_address: { district, thana, area },
          shipping_fee: shippingFee,
          notes,
          payment_status: "pending",
          promo_code_used: appliedCoupon?.code || null,
          discount_amount: discountAmount,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Increment coupon usage if applied
      if (appliedCoupon) {
        await supabase
          .from("coupons")
          .update({ used_count: supabase.rpc ? undefined : undefined }) // handled below
          .eq("code", appliedCoupon.code);
        
        // Increment used_count
        const { data: couponData } = await supabase
          .from("coupons")
          .select("used_count")
          .eq("code", appliedCoupon.code)
          .single();
        
        if (couponData) {
          await supabase
            .from("coupons")
            .update({ used_count: (couponData.used_count || 0) + 1 })
            .eq("code", appliedCoupon.code);
        }
      }

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update stock for each product
      for (const item of cartItems) {
        const { data } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();
          
        if (data) {
          await supabase
            .from("products")
            .update({ stock: Math.max(0, data.stock - item.quantity) })
            .eq("id", item.id);
        }
      }

      // Clear coupon from session storage
      sessionStorage.removeItem("appliedCoupon");
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/profile");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to place order";
      toast.error(message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const availableThanas = getThanas(district);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "gradient-primary text-white" : "bg-muted"}`}>
                {step > 1 ? <CheckCircle className="h-5 w-5" /> : <MapPin className="h-4 w-4" />}
              </div>
              <span className="hidden sm:inline font-medium">Shipping</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "gradient-primary text-white" : "bg-muted"}`}>
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription>Where should we deliver your order?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        District <span className="text-destructive">*</span>
                      </Label>
                      <Select value={district} onValueChange={(v) => { setDistrict(v); setThana(""); }}>
                        <SelectTrigger className={!district ? "border-destructive/50" : ""}>
                          <SelectValue placeholder="Select district (required)" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {district && (
                        <p className="text-xs text-muted-foreground">
                          Delivery: {district.toLowerCase() === "dhaka" ? "৳70" : "৳120"} 
                          {discountedSubtotal >= FREE_SHIPPING_THRESHOLD && " (Free over ৳2,500)"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Thana *</Label>
                      <Select value={thana} onValueChange={setThana} disabled={!district}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select thana" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableThanas.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Detailed Address *</Label>
                    <Input
                      id="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="House, Road, Area"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                    />
                    {phone && !validateBangladeshPhone(phone) && (
                      <p className="text-sm text-destructive">
                        Please enter a valid Bangladesh number (e.g., 01712345678)
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions for delivery?"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    className="w-full gradient-primary"
                    disabled={!district || !thana || !area || !phone}
                  >
                    Continue to Payment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose how you want to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                    <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"} ${!phoneValidForCOD ? "opacity-75" : ""}`}>
                      <RadioGroupItem value="cod" id="cod" disabled={!phoneValidForCOD} />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Truck className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">Pay when you receive</p>
                          </div>
                        </div>
                        {paymentMethod === "cod" && phoneValidForCOD && (
                          <span className="ml-auto text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </Label>
                    </div>

                    {!phoneValidForCOD && (
                      <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Cash on Delivery requires a valid Bangladesh phone number. Please update your phone number in Step 1 or choose a different payment method.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "online" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}>
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Globe className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium">Online Payment</p>
                            <p className="text-sm text-muted-foreground">Cards, bKash, Nagad & more</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    {paymentMethod === "online" && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-2">
                        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          You'll be redirected to SSLCommerz secure payment gateway to complete your payment.
                        </p>
                      </div>
                    )}
                  </RadioGroup>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 gradient-primary"
                      disabled={isPlacingOrder}
                    >
                      {isPlacingOrder ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          {paymentMethod === "online" ? "Redirecting to Payment..." : "Placing Order..."}
                        </span>
                      ) : (
                        <>
                          {paymentMethod === "online" ? "Pay Now" : "Place Order"}
                          <CheckCircle className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Secure payment note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                    <Shield className="h-3 w-3" />
                    <span>Online payments are processed securely via SSLCOMMERZ</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">৳{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {/* Show discount as separate line item */}
                  {appliedCoupon && discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Discount ({appliedCoupon.code})
                      </span>
                      <span>-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingFee === 0 ? <span className="text-green-600">FREE</span> : `৳${shippingFee}`}</span>
                  </div>
                  {shippingFee > 0 && discountedSubtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-muted-foreground">
                      Add ৳{(FREE_SHIPPING_THRESHOLD - discountedSubtotal).toLocaleString()} more for free shipping
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">৳{total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;