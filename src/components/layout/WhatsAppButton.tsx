import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const WhatsAppButton = () => {
  const handleClick = () => {
    window.open("https://wa.me/8801700000000?text=Hello! I need help with my order from Khatidana.", "_blank");
  };

  return (
    <motion.div
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        onClick={handleClick}
        className="h-14 w-14 rounded-full bg-whatsapp hover:bg-whatsapp/90 shadow-lg p-0"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 text-whatsapp-foreground" />
      </Button>
    </motion.div>
  );
};
