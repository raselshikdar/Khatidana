import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/hooks/useCart";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingId = searchParams.get("pending_id");
  const orderId = searchParams.get("order_id"); // For backward compatibility
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
    
    // Give IPN some time to process
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [clearCart]);

  const displayId = pendingId || orderId;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        <div className="max-w-lg mx-auto text-center">
          <Card className="border-green-200 dark:border-green-900">
            <CardContent className="pt-8 pb-8 space-y-6">
              {isProcessing ? (
                <>
                  <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                  <div className="space-y-2">
                    <h1 className="text-xl font-bold">Processing your payment...</h1>
                    <p className="text-muted-foreground">Please wait while we confirm your order.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
                      Payment Successful!
                    </h1>
                    <p className="text-muted-foreground">
                      Thank you for your order. Your payment has been processed successfully.
                    </p>
                  </div>

                  {displayId && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Transaction Reference</p>
                      <p className="font-mono text-sm font-medium">{displayId.slice(0, 8).toUpperCase()}...</p>
                    </div>
                  )}

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      ✓ Your order has been confirmed and is being processed. You'll receive an email confirmation shortly.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => navigate("/profile")} 
                      className="gradient-primary w-full"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      View My Orders
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/")}
                      className="w-full"
                    >
                      Continue Shopping
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
