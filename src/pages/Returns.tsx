import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";
import { RotateCcw, Clock, CheckCircle, XCircle, Package, CreditCard } from "lucide-react";

const Returns = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Returns & <span className="text-primary">Refunds</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            We want you to be completely satisfied with your purchase. Here's our return policy.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <Clock className="h-10 w-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-foreground">7 Days</h3>
              <p className="text-sm text-muted-foreground">Return Window</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <RotateCcw className="h-10 w-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-foreground">Free Returns</h3>
              <p className="text-sm text-muted-foreground">On eligible items</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <CreditCard className="h-10 w-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-foreground">Quick Refund</h3>
              <p className="text-sm text-muted-foreground">5-7 business days</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Eligible for Returns
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Unused products in original packaging</li>
                <li>Products with all tags and labels attached</li>
                <li>Defective or damaged products (within 24 hours of delivery)</li>
                <li>Wrong product delivered</li>
                <li>Products not matching the description</li>
              </ul>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Not Eligible for Returns
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Used or altered products</li>
                <li>Products without original packaging or tags</li>
                <li>Perishable goods and groceries</li>
                <li>Personal care items and cosmetics (once opened)</li>
                <li>Undergarments and innerwear</li>
                <li>Digital products and gift cards</li>
              </ul>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                How to Return
              </h2>
              <ol className="list-decimal list-inside text-muted-foreground space-y-3">
                <li>
                  <strong>Initiate Return:</strong> Log in to your account, go to 'My Orders', select 
                  the order, and click 'Request Return'.
                </li>
                <li>
                  <strong>Select Reason:</strong> Choose the reason for return and upload photos if 
                  the product is damaged.
                </li>
                <li>
                  <strong>Schedule Pickup:</strong> Our delivery partner will pick up the product from 
                  your address within 2-3 days.
                </li>
                <li>
                  <strong>Quality Check:</strong> Once received, our team will inspect the product 
                  within 48 hours.
                </li>
                <li>
                  <strong>Refund Processed:</strong> Upon approval, refund will be credited within 
                  5-7 business days.
                </li>
              </ol>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Refund Methods</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Online Payment</h4>
                  <p className="text-sm">Refunded to original payment method (Card, bKash, Nagad)</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Cash on Delivery</h4>
                  <p className="text-sm">Refunded to your bKash/Nagad or bank account</p>
                </div>
              </div>
            </section>
            
            <div className="p-6 bg-primary/10 rounded-xl text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Need Help with Returns?
              </h3>
              <p className="text-muted-foreground mb-4">
                Contact our support team for assistance with your return request.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:info@rasel.work.gd"
                  className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Email Support
                </a>
                <a
                  href="tel:+8809696051484"
                  className="inline-block px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default Returns;
