import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Contact <span className="text-primary">Us</span>
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div>
              <p className="text-muted-foreground mb-6">
                Have questions? We'd love to hear from you. Send us a message and we'll 
                respond as soon as possible.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground">Madhupur - 1996, Tangail, Bangladesh</p>
                  </div>
                </div>
                
                <a 
                  href="tel:+8809696051484" 
                  className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+880 9696 051484</p>
                  </div>
                </a>
                
                <a 
                  href="mailto:info@rasel.work.gd" 
                  className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">info@rasel.work.gd</p>
                  </div>
                </a>
                
                <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Business Hours</h3>
                    <p className="text-muted-foreground">Saturday - Thursday: 9AM - 9PM</p>
                    <p className="text-muted-foreground">Friday: 3PM - 9PM</p>
                  </div>
                </div>
                
                <a
                  href="https://wa.me/8801518755031"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-[#25D366]/10 rounded-lg border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="h-6 w-6 text-[#25D366]" />
                  <div>
                    <h3 className="font-semibold text-foreground">WhatsApp Support</h3>
                    <p className="text-sm text-muted-foreground">Chat with us instantly</p>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
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

export default Contact;
