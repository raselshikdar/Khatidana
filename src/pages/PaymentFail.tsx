import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, RefreshCw, ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PaymentFail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingId = searchParams.get("pending_id");
  const orderId = searchParams.get("order_id"); // Backward compatibility

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        <div className="max-w-lg mx-auto text-center">
          <Card className="border-destructive/30">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Payment Failed
                </h1>
                <p className="text-muted-foreground">
                  We couldn't process your payment. Please try again or choose Cash on Delivery.
                </p>
              </div>

              <Alert className="bg-destructive/10 border-destructive/30 text-left">
                <AlertDescription className="text-sm">
                  Don't worry! Your cart items are still saved. No order was placed and no payment was charged.
                </AlertDescription>
              </Alert>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-left">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Common reasons for payment failure:
                </p>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                  <li>Insufficient balance</li>
                  <li>Incorrect PIN or OTP</li>
                  <li>Network connectivity issues</li>
                  <li>Daily transaction limit exceeded</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => navigate("/checkout")} 
                  className="gradient-primary w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/cart")}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cart
                </Button>
                <a 
                  href="tel:+8809696051484" 
                  className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  Need help? Call us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentFail;
