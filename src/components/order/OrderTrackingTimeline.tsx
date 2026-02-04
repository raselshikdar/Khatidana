import { CheckCircle, Circle, Package, Truck, Home, XCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTrackingTimelineProps {
  status: string;
  createdAt: string;
  trackingNumber?: string | null;
  district?: string;
}

const ORDER_STEPS = [
  { key: "pending", label: "Order Placed", icon: Package, description: "Your order has been received" },
  { key: "processing", label: "Processing", icon: Package, description: "Preparing your order" },
  { key: "shipped", label: "Shipped", icon: Truck, description: "On the way to you" },
  { key: "delivered", label: "Delivered", icon: Home, description: "Order completed" },
];

const getStatusIndex = (status: string) => {
  if (status === "cancelled") return -1;
  return ORDER_STEPS.findIndex(step => step.key === status);
};

const getEstimatedDelivery = (createdAt: string, district?: string, status?: string): string | null => {
  if (status === "delivered" || status === "cancelled") {
    return null;
  }
  
  const isDhaka = district?.toLowerCase() === "dhaka";
  const orderDate = new Date(createdAt);
  
  let minDays = isDhaka ? 2 : 5;
  let maxDays = isDhaka ? 3 : 7;
  
  const minDate = new Date(orderDate);
  minDate.setDate(orderDate.getDate() + minDays);
  
  const maxDate = new Date(orderDate);
  maxDate.setDate(orderDate.getDate() + maxDays);
  
  const formatDate = (date: Date) => date.toLocaleDateString("en-BD", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
  
  return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
};

export const OrderTrackingTimeline = ({ status, createdAt, trackingNumber, district }: OrderTrackingTimelineProps) => {
  const currentIndex = getStatusIndex(status);
  const isCancelled = status === "cancelled";
  const estimatedDelivery = getEstimatedDelivery(createdAt, district, status);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Order Status</h3>
        {trackingNumber && (
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
            {trackingNumber}
          </span>
        )}
      </div>

      {/* Estimated Delivery Banner */}
      {estimatedDelivery && (
        <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-sm text-primary">Estimated Delivery</p>
            <p className="text-sm text-foreground">{estimatedDelivery}</p>
          </div>
        </div>
      )}

      {isCancelled ? (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <XCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Order Cancelled</p>
            <p className="text-sm text-muted-foreground">This order has been cancelled</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-muted" />
          <div 
            className="absolute left-4 top-8 w-0.5 bg-primary transition-all duration-500"
            style={{ 
              height: currentIndex >= 0 ? `${Math.min((currentIndex / (ORDER_STEPS.length - 1)) * 100, 100)}%` : "0%" 
            }}
          />

          <div className="space-y-6">
            {ORDER_STEPS.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;
              const Icon = step.icon;

              return (
                <div key={step.key} className="relative flex items-start gap-4 pl-1">
                  <div 
                    className={cn(
                      "relative z-10 flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all",
                      isCompleted 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "bg-background border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "font-medium text-sm",
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full animate-pulse">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                    {index === 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(createdAt).toLocaleDateString("en-BD", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};