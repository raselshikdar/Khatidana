import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";
import { Shield, Eye, Lock, UserCheck } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Shield, title: "Data Protection", desc: "Your data is encrypted" },
              { icon: Eye, title: "Transparency", desc: "Clear data practices" },
              { icon: Lock, title: "Secure Storage", desc: "Industry-standard security" },
              { icon: UserCheck, title: "Your Control", desc: "Manage your data" },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-4 bg-card rounded-lg border border-border">
                <item.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-3">We collect the following types of information:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Personal Information:</strong> Name, email, phone number, shipping address</li>
                <li><strong>Payment Information:</strong> Processed securely through payment gateways</li>
                <li><strong>Usage Data:</strong> Browsing history, product views, search queries</li>
                <li><strong>Device Information:</strong> Browser type, IP address, device identifiers</li>
              </ul>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Provide customer support</li>
                <li>Improve our products and services</li>
                <li>Send promotional offers (with your consent)</li>
                <li>Prevent fraud and maintain security</li>
              </ul>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">3. Information Sharing</h2>
              <p className="text-muted-foreground mb-3">
                We do not sell your personal information. We may share data with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Shipping partners to deliver your orders</li>
                <li>Payment processors to complete transactions</li>
                <li>Service providers who assist our operations</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures including SSL encryption, secure servers, 
                and regular security audits. However, no method of transmission over the Internet is 100% 
                secure, and we cannot guarantee absolute security.
              </p>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">5. Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance your browsing experience, remember your 
                preferences, and analyze site traffic. You can manage cookie preferences through your 
                browser settings.
              </p>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">6. Your Rights</h2>
              <p className="text-muted-foreground mb-3">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">7. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not directed to children under 13. We do not knowingly collect personal 
                information from children. If you believe a child has provided us with personal information, 
                please contact us immediately.
              </p>
            </section>
            
            <section className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3 text-foreground">8. Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related inquiries, contact us at{" "}
                <a href="mailto:info@rasel.work.gd" className="text-primary hover:underline">
                  info@rasel.work.gd
                </a>
                {" "}or call{" "}
                <a href="tel:+8809696051484" className="text-primary hover:underline">
                  +880 9696 051484
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

export default Privacy;
