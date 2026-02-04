import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";
import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            About <span className="text-primary">Bongshai</span>
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg mb-8">
              Bongshai (বংশাই) is Bangladesh's most trusted online shopping destination, bringing quality products 
              at unbeatable prices directly to your doorstep. Named after the beautiful Bongshai River, 
              we are committed to providing an exceptional shopping experience.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-card p-6 rounded-xl border border-border shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Our Mission</h3>
                </div>
                <p className="text-muted-foreground">
                  To make online shopping accessible, affordable, and enjoyable for every Bangladeshi 
                  household while supporting local businesses and artisans.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-secondary/10">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Our Vision</h3>
                </div>
                <p className="text-muted-foreground">
                  To become the leading e-commerce platform in Bangladesh, known for quality, 
                  reliability, and customer satisfaction.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mt-10 mb-6 text-foreground">Why Choose Bongshai?</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Award, title: "Quality Products", desc: "Curated selection of genuine products" },
                { icon: Heart, title: "Customer First", desc: "24/7 support and easy returns" },
                { icon: Target, title: "Best Prices", desc: "Competitive pricing guaranteed" },
                { icon: Users, title: "Trusted by Many", desc: "Thousands of happy customers" },
              ].map((item, idx) => (
                <div key={idx} className="text-center p-4 bg-muted/50 rounded-lg">
                  <item.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl mt-8">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Our Story</h3>
              <p className="text-muted-foreground">
                Started in 2024, Bongshai began as a small initiative to connect local sellers with 
                buyers across Bangladesh. Named after the serene Bongshai River, we've grown into a comprehensive 
                marketplace offering everything from fashion and electronics to groceries and home essentials. 
                Our commitment to quality and customer satisfaction remains at the heart of everything we do.
              </p>
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

export default About;
