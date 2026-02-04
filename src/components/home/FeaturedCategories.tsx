import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const categories = [
  { 
    name: "Rice & Grains", 
    nameBn: "চাল ও শস্য", 
    slug: "rice-grains",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop&q=80",
    color: "from-amber-500/20 to-amber-600/30"
  },
  { 
    name: "Pulses", 
    nameBn: "ডাল", 
    slug: "pulses-lentils",
    image: "https://images.unsplash.com/photo-1613758947307-f3b8f5d80711?w=200&h=200&fit=crop&q=80",
    color: "from-orange-500/20 to-orange-600/30"
  },
  { 
    name: "Spices", 
    nameBn: "মসলা", 
    slug: "spices",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop&q=80",
    color: "from-red-500/20 to-red-600/30"
  },
  { 
    name: "Oils & Ghee", 
    nameBn: "তেল ও ঘি", 
    slug: "oils-ghee",
    image: "https://images.unsplash.com/photo-1631164463540-c4f7e0c26eb6?w=200&h=200&fit=crop&q=80",
    color: "from-yellow-500/20 to-yellow-600/30"
  },
  { 
    name: "Honey", 
    nameBn: "মধু", 
    slug: "honey-sweeteners",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop&q=80",
    color: "from-amber-400/20 to-amber-500/30"
  },
  { 
    name: "Dry Fruits", 
    nameBn: "শুকনো ফল", 
    slug: "dry-fruits",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200&h=200&fit=crop&q=80",
    color: "from-orange-700/20 to-orange-800/30"
  },
  { 
    name: "Flour & Atta", 
    nameBn: "আটা", 
    slug: "flour-atta",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop&q=80",
    color: "from-stone-400/20 to-stone-500/30"
  },
  { 
    name: "Snacks", 
    nameBn: "স্ন্যাকস", 
    slug: "organic-snacks",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop&q=80",
    color: "from-green-500/20 to-green-600/30"
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const FeaturedCategories = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
            Shop by Category
          </h2>
          <p className="text-sm text-muted-foreground font-bengali mt-1">
            ক্যাটাগরি অনুযায়ী কেনাকাটা করুন
          </p>
        </div>
        <button 
          onClick={() => navigate("/products")}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View All →
        </button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4"
      >
        {categories.map((category) => (
          <motion.button
            key={category.slug}
            variants={item}
            onClick={() => navigate(`/category/${category.slug}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={cn(
              "relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-border shadow-md transition-all group-hover:border-primary group-hover:shadow-lg",
              "bg-gradient-to-br",
              category.color
            )}>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="text-center">
              <p className="text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </p>
              <p className="text-[10px] text-muted-foreground font-bengali hidden md:block">
                {category.nameBn}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
};
