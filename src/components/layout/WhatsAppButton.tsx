import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WhatsAppButton = () => {
  const handleClick = () => {
    window.open("https://wa.me/8801518755031?text=Hello! I need help with my order.", "_blank");
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-whatsapp hover:bg-whatsapp/90 shadow-lg z-50 p-0"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-whatsapp-foreground" />
    </Button>
  );
};
