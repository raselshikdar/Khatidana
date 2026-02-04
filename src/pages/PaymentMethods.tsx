import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";
import { CreditCard, Wallet, Banknote, Shield, Lock, CheckCircle } from "lucide-react";

const PaymentMethods = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Payment <span className="text-primary">Methods</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            We offer multiple secure payment options for your convenience.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Banknote, title: "Cash on Delivery", color: "text-green-500" },
              { icon: Wallet, title: "bKash", color: "text-pink-500" },
              { icon: Wallet, title: "Nagad", color: "text-orange-500" },
              { icon: CreditCard, title: "Card Payment", color: "text-blue-500" },
            ].map((method, idx) => (
              <div key={idx} className="text-center p-6 bg-card rounded-xl border border-border">
                <method.icon className={`h-10 w-10 mx-auto mb-3 ${method.color}`} />
                <h3 className="font-semibold text-foreground">{method.title}</h3>
              </div>
            ))}
          </div>
          
          <div className="space-y-6">
            <section className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <Banknote className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Cash on Delivery (COD)</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Pay in cash when your order is delivered to your doorstep. Available across all 
                districts of Bangladesh.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>No advance payment required</li>
                <li>Pay only after inspecting your order</li>
                <li>Available for orders up to ৳50,000</li>
                <li>Please keep exact change ready for smooth transaction</li>
              </ul>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-pink-500/10">
                  <Wallet className="h-6 w-6 text-pink-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">bKash</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Bangladesh's leading mobile financial service. Fast, secure, and convenient.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Instant payment confirmation</li>
                <li>Secure OTP verification</li>
                <li>Pay from any bKash account</li>
                <li>Transaction fees: Free for customers</li>
              </ul>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <Wallet className="h-6 w-6 text-orange-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Nagad</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Digital financial service by Bangladesh Post Office. Quick and reliable payments.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Fast checkout process</li>
                <li>Secure PIN verification</li>
                <li>Wide accessibility across Bangladesh</li>
                <li>No additional charges</li>
              </ul>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <CreditCard className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Credit/Debit Cards</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                We accept all major credit and debit cards issued in Bangladesh and internationally.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                {["Visa", "Mastercard", "American Express", "UnionPay"].map((card) => (
                  <span
                    key={card}
                    className="px-3 py-1 bg-muted rounded-lg text-sm font-medium text-foreground"
                  >
                    {card}
                  </span>
                ))}
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>256-bit SSL encryption</li>
                <li>3D Secure authentication</li>
                <li>PCI DSS compliant</li>
                <li>EMI options available on select banks</li>
              </ul>
            </section>
            
            <section className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Payment Security</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">SSL Encryption</h4>
                    <p className="text-sm text-muted-foreground">All data is encrypted in transit</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Secure Gateway</h4>
                    <p className="text-sm text-muted-foreground">Trusted payment processors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">No Data Storage</h4>
                    <p className="text-sm text-muted-foreground">Card details never stored</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Fraud Protection</h4>
                    <p className="text-sm text-muted-foreground">Advanced fraud detection</p>
                  </div>
                </div>
              </div>
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

export default PaymentMethods;
