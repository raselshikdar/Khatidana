import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const TrackOrder = () => {
  const { user } = useAuth();
  const [orderId, setOrderId] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to profile orders section with order ID
    if (user) {
      window.location.href = `/profile?order=${orderId}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-foreground">
            Track Your <span className="text-primary">Order</span>
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Enter your order ID to see the current status of your delivery.
          </p>
          
          <div className="bg-card p-8 rounded-xl border border-border shadow-card">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Package className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            {user ? (
              <>
                <form onSubmit={handleTrack} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Order ID
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Enter your order ID (e.g., abc123-def456)"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Track Order
                  </Button>
                </form>
                
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-muted-foreground mb-3">
                    Or view all your orders in your profile
                  </p>
                  <Link to="/profile">
                    <Button variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      Go to My Orders
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Please sign in to track your orders and view order history.
                </p>
                <Link to="/auth">
                  <Button className="w-full">
                    Sign In to Track Orders
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Order Placed", desc: "We've received your order" },
              { step: "2", title: "Processing", desc: "Preparing for shipment" },
              { step: "3", title: "Delivered", desc: "Package at your doorstep" },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default TrackOrder;
