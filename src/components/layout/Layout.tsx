import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { BackToTop } from "@/components/ui/BackToTop";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  className?: string;
}

export const Layout = ({ children, showFooter = true, className = "" }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background organic-pattern">
      <Header />
      
      <motion.main 
        className={`pb-20 md:pb-0 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>

      {showFooter && <Footer />}
      <BackToTop />
      <MobileBottomNav />
    </div>
  );
};
