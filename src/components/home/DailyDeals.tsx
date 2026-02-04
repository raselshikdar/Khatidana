import { Tag, ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  images_url: string[];
  rating: number;
  review_count: number;
  is_featured: boolean;
}

const fetchDailyDeals = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, original_price, images_url, rating, review_count, is_featured")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) throw error;
  return data || [];
};

export const DailyDeals = () => {
  const navigate = useNavigate();
  const { data: products = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["daily-deals"],
    queryFn: fetchDailyDeals,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
  });

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-secondary">
            <Tag className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Daily Deals</h2>
            <p className="text-sm text-muted-foreground font-bengali">প্রতিদিনের বিশেষ অফার</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
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

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            originalPrice={product.original_price || undefined}
            image={product.images_url[0] || "/placeholder.svg"}
            rating={product.rating}
            reviews={product.review_count}
            badge={product.is_featured ? "Featured" : undefined}
          />
        ))}
      </div>
    </section>
  );
};
