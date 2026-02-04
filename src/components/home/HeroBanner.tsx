import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const banners = [
  {
    id: 1,
    title: "Mega Flash Sale",
    titleBn: "মেগা ফ্ল্যাশ সেল",
    subtitle: "Up to 70% OFF on Electronics",
    cta: "Shop Now",
    gradient: "gradient-flash",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Fashion Week",
    titleBn: "ফ্যাশন উইক",
    subtitle: "New Arrivals Starting ৳299",
    cta: "Explore",
    gradient: "gradient-trust",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Home Essentials",
    titleBn: "গৃহস্থালী সামগ্রী",
    subtitle: "Free Delivery on ৳1000+",
    cta: "Browse",
    gradient: "gradient-primary",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop",
  },
];

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);

  return (
    <div className="relative overflow-hidden rounded-lg md:rounded-xl">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="min-w-full relative h-40 sm:h-56 md:h-72 lg:h-80"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={banner.image}
                alt={banner.title}
                className="h-full w-full object-cover"
              />
              <div className={cn("absolute inset-0 opacity-80", banner.gradient)} />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-16">
              <p className="text-xs md:text-sm text-primary-foreground/80 font-bengali mb-1">
                {banner.titleBn}
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
                {banner.title}
              </h2>
              <p className="text-sm md:text-lg text-primary-foreground/90 mb-4">
                {banner.subtitle}
              </p>
              <Button 
                size="lg" 
                className="w-fit bg-card text-foreground hover:bg-card/90 font-semibold"
              >
                {banner.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/80"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/50 backdrop-blur-sm hover:bg-card/80"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentSlide === index 
                ? "bg-card w-6" 
                : "bg-card/50 hover:bg-card/80"
            )}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};
