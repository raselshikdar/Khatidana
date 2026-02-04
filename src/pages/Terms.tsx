import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Terms & <span className="text-primary">Conditions</span>
          </h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Bongshai, you accept and agree to be bound by the terms and 
                provisions of this agreement. If you do not agree to these terms, please do not use 
                our services.
              </p>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">2. Use of Service</h2>
              <p className="text-muted-foreground mb-3">
                You agree to use Bongshai only for lawful purposes. You are prohibited from:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Using the service for any illegal activities</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Interfering with other users' enjoyment of the service</li>
                <li>Posting false or misleading information</li>
              </ul>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">3. Account Registration</h2>
              <p className="text-muted-foreground">
                To make purchases, you may need to create an account. You are responsible for maintaining 
                the confidentiality of your account credentials and for all activities under your account. 
                You must provide accurate and complete information during registration.
              </p>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">4. Products and Pricing</h2>
              <p className="text-muted-foreground">
                All prices are in Bangladeshi Taka (৳) and include applicable taxes unless stated otherwise. 
                We reserve the right to modify prices at any time. Product descriptions and images are as 
                accurate as possible, but we do not guarantee they are error-free.
              </p>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">5. Orders and Payment</h2>
              <p className="text-muted-foreground">
                By placing an order, you make an offer to purchase. We reserve the right to refuse or 
                cancel orders for any reason. Payment must be made through our accepted payment methods. 
                Cash on Delivery is subject to verification.
              </p>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">6. Shipping and Delivery</h2>
              <p className="text-muted-foreground">
                Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery. 
                We are not responsible for delays caused by carriers or circumstances beyond our control.
              </p>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">7. Returns and Refunds</h2>
              <p className="text-muted-foreground">
                Please refer to our Returns & Refunds policy for detailed information about returning 
                products and obtaining refunds. Not all products are eligible for returns.
              </p>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Bongshai shall not be liable for any indirect, incidental, or consequential damages 
                arising from your use of our services. Our total liability shall not exceed the amount 
                paid for the specific product or service in question.
              </p>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">9. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms & Conditions, please contact us at{" "}
                <a href="mailto:info@rasel.work.gd" className="text-primary hover:underline">
                  info@rasel.work.gd
                </a>
                .
              </p>
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

export default Terms;
