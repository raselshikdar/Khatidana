import { useEffect, useState } from "react";
import { Package, MapPin, Phone, User, CreditCard, Calendar, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { OrderTrackingTimeline } from "./OrderTrackingTimeline";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  product_id: string | null;
}

interface OrderDetail {
  id: string;
  total_price: number;
  status: string;
  payment_method: string;
  payment_status: string | null;
  payment_transaction_id: string | null;
  shipping_address: {
    district: string;
    thana: string;
    area: string;
  };
  tracking_number: string | null;
  notes: string | null;
  shipping_fee: number | null;
  promo_code_used: string | null;
  discount_amount: number | null;
  created_at: string;
  user_id: string;
  customer_name?: string;
  customer_phone?: string;
}

const getPaymentStatusLabel = (order: OrderDetail) => {
  if (order.payment_status === "paid") return "✓ Paid";
  if (order.payment_status === "failed") return "Failed";
  if (order.payment_status === "cancelled") return "Cancelled";
  // For COD orders not yet delivered
  if (order.payment_method === "cod" && order.status !== "delivered") {
    return "Pending (Cash on Delivery)";
  }
  return "Pending";
};

interface OrderDetailModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "processing": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "shipped": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case "cod": return "Cash on Delivery";
    case "bkash": return "bKash";
    case "nagad": return "Nagad";
    case "card": return "Card Payment";
    default: return method;
  }
};

const getPaymentStatusColor = (status: string | null) => {
  switch (status) {
    case "paid": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "failed": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "cancelled": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  }
};

export const OrderDetailModal = ({ orderId, isOpen, onClose, isAdmin = false }: OrderDetailModalProps) => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !isOpen) return;

      setIsLoading(true);

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError || !orderData) {
        console.error("Failed to fetch order:", orderError);
        setIsLoading(false);
        return;
      }

      // Fetch profile for customer info
      const { data: profileData } = await supabase
        .from("profiles")
        .select("name, phone")
        .eq("id", orderData.user_id)
        .single();

      // Fetch order items
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      setOrder({
        ...orderData,
        shipping_address: orderData.shipping_address as OrderDetail["shipping_address"],
        customer_name: profileData?.name || "N/A",
        customer_phone: profileData?.phone || "N/A",
      });

      setItems(itemsData || []);
      setIsLoading(false);
    };

    fetchOrderDetails();
  }, [orderId, isOpen]);

  if (!orderId) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order #{order?.id.slice(0, 8).toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading order details...
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Status & Date */}
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(order.created_at).toLocaleDateString("en-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <Separator />

            {/* Customer Info (Admin only) */}
            {isAdmin && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </h3>
                  <div className="grid gap-2 text-sm">
                    <p><strong>Name:</strong> {order.customer_name}</p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {order.customer_phone}
                    </p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Shipping Address */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </h3>
              <div className="text-sm p-3 bg-muted/50 rounded-lg">
                <p>{order.shipping_address?.area}</p>
                <p>{order.shipping_address?.thana}, {order.shipping_address?.district}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Items ({items.length})
              </h3>
              <div className="border rounded-lg divide-y">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                {/* Show discount as separate line item */}
                {order.promo_code_used && order.discount_amount && order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Discount ({order.promo_code_used})
                    </span>
                    <span>-৳{order.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span>{order.shipping_fee === 0 ? <span className="text-green-600">FREE</span> : `৳${(order.shipping_fee || 0).toLocaleString()}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">৳{order.total_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Payment Method</span>
                  <Badge variant="outline">{getPaymentMethodLabel(order.payment_method)}</Badge>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge className={getPaymentStatusColor(order.payment_status)}>
                    {getPaymentStatusLabel(order)}
                  </Badge>
                </div>
                {order.payment_transaction_id && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono text-xs">{order.payment_transaction_id}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Tracking Timeline */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <OrderTrackingTimeline 
                status={order.status} 
                createdAt={order.created_at}
                trackingNumber={order.tracking_number}
                district={order.shipping_address?.district}
              />
            </div>

            {/* Customer Notes */}
            {order.notes && (
              <div className="space-y-2">
                <h3 className="font-semibold">Order Notes</h3>
                <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                  {order.notes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Order not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
