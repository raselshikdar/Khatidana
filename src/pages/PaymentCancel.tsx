import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingId = searchParams.get("pending_id");
  const orderId = searchParams.get("order_id"); // Backward compatibility

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        <div className="max-w-lg mx-auto text-center">
          <Card className="border-amber-200 dark:border-amber-900">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-400" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  Payment Cancelled
                </h1>
                <p className="text-muted-foreground">
                  You cancelled the payment process. No order has been placed.
                </p>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-left">
                <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
                  💡 Your cart items are still saved. You can complete your order later or choose Cash on Delivery.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => navigate("/checkout")} 
                  className="gradient-primary w-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Complete Order
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentCancel;
