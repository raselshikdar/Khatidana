import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";
import { Truck, Clock, MapPin, Gift, Package, CheckCircle } from "lucide-react";

const Shipping = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Shipping <span className="text-primary">Information</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Everything you need to know about our delivery services across Bangladesh.
          </p>
          
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Gift className="h-8 w-8 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Free Shipping Offer!</h2>
            </div>
            <p className="text-muted-foreground">
              Enjoy <strong className="text-foreground">FREE SHIPPING</strong> on all orders 
              over <strong className="text-primary">৳2,500</strong>. No coupon needed!
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Inside Dhaka</h3>
                  <p className="text-sm text-muted-foreground">Dhaka City & Metropolitan</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Time</span>
                  <span className="font-semibold text-foreground">2-3 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping Cost</span>
                  <span className="font-semibold text-foreground">৳60</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Express Available</span>
                  <span className="font-semibold text-primary">Yes</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Truck className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Outside Dhaka</h3>
                  <p className="text-sm text-muted-foreground">All Districts of Bangladesh</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Time</span>
                  <span className="font-semibold text-foreground">5-7 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping Cost</span>
                  <span className="font-semibold text-foreground">৳120</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Express Available</span>
                  <span className="font-semibold text-muted-foreground">Selected Areas</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Order Processing
              </h2>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                  Orders placed before 2 PM are processed the same day
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                  Orders placed after 2 PM are processed the next business day
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                  You'll receive SMS and email notifications at each stage
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                  Track your order in real-time from your account
                </li>
              </ul>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Delivery Schedule
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Business Days</h4>
                  <p className="text-sm text-muted-foreground">Saturday - Thursday: 9 AM - 9 PM</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Friday Delivery</h4>
                  <p className="text-sm text-muted-foreground">Limited delivery: 3 PM - 9 PM</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Delivery times may vary during holidays and special occasions.
              </p>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Partners</h2>
              <p className="text-muted-foreground mb-4">
                We work with trusted delivery partners to ensure your packages reach you safely:
              </p>
              <div className="flex flex-wrap gap-3">
                {["Pathao", "RedX", "Paperfly", "Sundarban Courier"].map((partner) => (
                  <span
                    key={partner}
                    className="px-4 py-2 bg-muted rounded-lg text-sm font-medium text-foreground"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Important Notes</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Please ensure someone is available to receive the package at the delivery address</li>
                <li>Our delivery partner will call before delivery</li>
                <li>For Cash on Delivery orders, please keep exact change ready</li>
                <li>Delivery to remote areas may take additional 1-2 days</li>
                <li>Large or heavy items may require special shipping arrangements</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default Shipping;
