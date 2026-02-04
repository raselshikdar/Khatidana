import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  return (
    <Layout className="container py-8">
      <SEOHead 
        title="About Us"
        description="Learn about Khatidana (খাঁটিদানা), Bangladesh's premium destination for organic foods and grains. Pure, authentic, and naturally sourced products."
        url="https://khatidana.lovable.app/about"
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-foreground">
          About <span className="text-primary">Khatidana</span>
        </h1>
        <p className="text-accent font-bengali mb-6">খাঁটিদানা সম্পর্কে</p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-8">
            Khatidana (খাঁটিদানা) is Bangladesh's premium destination for organic foods and grains. 
            We source the purest, most authentic organic products directly from trusted farmers 
            and deliver them fresh to your doorstep.
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
          
          <h2 className="text-2xl font-bold mt-10 mb-6 text-foreground">Why Choose Khatidana?</h2>
          
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
              Started in 2024, Khatidana began as a small initiative to connect local organic farmers with 
              health-conscious buyers across Bangladesh. Named after the Bangla word for "pure grains", we've grown into a comprehensive 
              marketplace offering everything from rice and spices to honey and dry fruits. 
              Our commitment to quality and customer satisfaction remains at the heart of everything we do.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
