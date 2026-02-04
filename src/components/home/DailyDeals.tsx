import { Sparkles, ArrowRight, RefreshCw, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  images_url: string[];
  rating: number;
  review_count: number;
  is_featured: boolean;
  created_at: string;
}

const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, original_price, images_url, rating, review_count, is_featured, created_at")
    .eq("is_featured", true)
    .limit(4);

  if (error) throw error;
  return data || [];
};

const fetchNewArrivals = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, original_price, images_url, rating, review_count, is_featured, created_at")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) throw error;
  return data || [];
};

export const DailyDeals = () => {
  const navigate = useNavigate();
  
  const { data: featuredProducts = [], isLoading: loadingFeatured, refetch: refetchFeatured, isFetching: fetchingFeatured } = useQuery({
    queryKey: ["featured-products"],
    queryFn: fetchFeaturedProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const { data: newArrivals = [], isLoading: loadingNew } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: fetchNewArrivals,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-10 py-6">
      {/* Deal of the Day */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl gradient-gold">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">Deal of the Day</h2>
              <p className="text-sm text-muted-foreground font-bengali">আজকের সেরা অফার</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => refetchFeatured()}
              disabled={fetchingFeatured}
              className="text-muted-foreground hover:text-primary"
            >
              <RefreshCw className={`h-4 w-4 ${fetchingFeatured ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/80 gap-1"
              onClick={() => navigate("/products")}
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loadingFeatured ? renderSkeleton() : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.original_price || undefined}
                  image={product.images_url[0] || "/placeholder.svg"}
                  rating={product.rating}
                  reviews={product.review_count}
                  badge="Featured"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No featured products available
          </div>
        )}
      </motion.section>

      {/* New Arrivals */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">New Arrivals</h2>
              <p className="text-sm text-muted-foreground font-bengali">নতুন পণ্য সমূহ</p>
            </div>
          </div>

          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary/80 gap-1"
            onClick={() => navigate("/products")}
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {loadingNew ? renderSkeleton() : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.original_price || undefined}
                  image={product.images_url[0] || "/placeholder.svg"}
                  rating={product.rating}
                  reviews={product.review_count}
                  badge="New"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No new arrivals yet
          </div>
        )}
      </motion.section>

      {/* Why Choose Us Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="gradient-primary rounded-2xl p-8 md:p-12 text-primary-foreground text-center"
      >
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
          Why Choose Khatidana?
        </h2>
        <p className="text-primary-foreground/80 font-bengali mb-8">
          কেন খাঁটিদানা বেছে নেবেন?
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <motion.div 
            className="flex flex-col items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-3xl">🌾</span>
            <span className="text-sm font-medium">100% Organic</span>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-3xl">🚚</span>
            <span className="text-sm font-medium">Fast Delivery</span>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-3xl">✓</span>
            <span className="text-sm font-medium">Quality Assured</span>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-3xl">💰</span>
            <span className="text-sm font-medium">Best Prices</span>
          </motion.div>
        </div>
        <Button 
          size="lg" 
          onClick={() => navigate("/products")}
          className="mt-8 bg-card text-foreground hover:bg-card/90 font-semibold"
        >
          Start Shopping
        </Button>
      </motion.section>
    </div>
  );
};
