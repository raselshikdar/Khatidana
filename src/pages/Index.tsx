import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { DailyDeals } from "@/components/home/DailyDeals";
import { BackToTop } from "@/components/ui/BackToTop";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background organic-pattern">
      <Header />
      
      <motion.main 
        className="container py-4 md:py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <HeroBanner />
        <FeaturedCategories />
        <FlashSaleSection />
        <DailyDeals />
      </motion.main>

      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
