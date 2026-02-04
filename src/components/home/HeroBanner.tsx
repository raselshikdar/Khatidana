import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Leaf, Truck, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const banners = [
  {
    id: 1,
    title: "Pure Organic Grains",
    titleBn: "খাঁটি জৈব শস্য",
    subtitle: "Farm-fresh rice, wheat & pulses delivered to your doorstep",
    cta: "Shop Now",
    gradient: "gradient-primary",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&h=500&fit=crop",
  },
  {
    id: 2,
    title: "Premium Spices",
    titleBn: "উন্নত মসলা",
    subtitle: "Authentic Bangladeshi spices - Starting ৳99",
    cta: "Explore",
    gradient: "gradient-gold",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=500&fit=crop",
  },
  {
    id: 3,
    title: "Natural Honey",
    titleBn: "প্রাকৃতিক মধু",
    subtitle: "100% Pure Sundarbans honey - Free delivery on ৳1000+",
    cta: "Order Now",
    gradient: "gradient-organic",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&h=500&fit=crop",
  },
];

const features = [
  { icon: Leaf, text: "100% Organic" },
  { icon: Truck, text: "Free Delivery" },
  { icon: Shield, text: "Quality Assured" },
  { icon: Award, text: "Best Prices" },
];

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);

  return (
    <div className="space-y-4">
      {/* Main Hero Slider */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative h-48 sm:h-64 md:h-80 lg:h-96"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={banners[currentSlide].image}
                alt={banners[currentSlide].title}
                className="h-full w-full object-cover"
              />
              <div className={cn("absolute inset-0 opacity-85", banners[currentSlide].gradient)} />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-16">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm md:text-base text-primary-foreground/80 font-bengali mb-2"
              >
                {banners[currentSlide].titleBn}
              </motion.p>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-3"
              >
                {banners[currentSlide].title}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm md:text-lg text-primary-foreground/90 mb-6 max-w-md"
              >
                {banners[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => navigate("/products")}
                  className="w-fit bg-card text-foreground hover:bg-card/90 font-semibold shadow-lg"
                >
                  {banners[currentSlide].cta}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/30 backdrop-blur-sm hover:bg-card/50 text-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/30 backdrop-blur-sm hover:bg-card/50 text-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentSlide === index 
                  ? "bg-card w-8" 
                  : "bg-card/50 hover:bg-card/80 w-2"
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Features Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-sm"
          >
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shrink-0">
              <feature.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">{feature.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
