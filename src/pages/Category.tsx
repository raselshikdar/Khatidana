import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  images_url: string[];
  rating: number;
  review_count: number;
  stock: number;
  category: string;
}

const categoryDisplayNames: Record<string, { name: string; nameBn: string }> = {
  "rice-grains": { name: "Rice & Grains", nameBn: "চাল ও শস্য" },
  "pulses-lentils": { name: "Pulses & Lentils", nameBn: "ডাল" },
  "spices": { name: "Spices", nameBn: "মসলা" },
  "oils-ghee": { name: "Oils & Ghee", nameBn: "তেল ও ঘি" },
  "honey-sweeteners": { name: "Honey & Sweeteners", nameBn: "মধু" },
  "dry-fruits": { name: "Dry Fruits", nameBn: "শুকনো ফল" },
  "flour-atta": { name: "Flour & Atta", nameBn: "আটা" },
  "organic-snacks": { name: "Organic Snacks", nameBn: "স্ন্যাকস" },
};

// Map slug to database category value
const slugToCategoryMap: Record<string, string> = {
  "rice-grains": "Rice & Grains",
  "pulses-lentils": "Pulses & Lentils",
  "spices": "Spices",
  "oils-ghee": "Oils & Ghee",
  "honey-sweeteners": "Honey & Sweeteners",
  "dry-fruits": "Dry Fruits",
  "flour-atta": "Flour & Atta",
  "organic-snacks": "Organic Snacks",
};

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  const categoryName = slug ? slugToCategoryMap[slug.toLowerCase()] : null;
  const displayInfo = slug ? categoryDisplayNames[slug.toLowerCase()] : null;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryName) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      let query = supabase
        .from("products")
        .select("id, name, price, original_price, images_url, rating, review_count, stock, category")
        .ilike("category", categoryName);

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          query = query.order("price", { ascending: true });
          break;
        case "price-high":
          query = query.order("price", { ascending: false });
          break;
        case "rating":
          query = query.order("rating", { ascending: false, nullsFirst: false });
          break;
        case "newest":
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching category products:", error);
      } else {
        setProducts(data || []);
      }

      setIsLoading(false);
    };

    fetchProducts();
  }, [categoryName, sortBy]);

  if (!slug || !categoryName) {
    return (
      <Layout className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </Layout>
    );
  }

  return (
    <Layout className="container py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button onClick={() => navigate("/")} className="hover:text-primary">
          Home
        </button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{displayInfo?.name || categoryName}</span>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {displayInfo?.name || categoryName}
        </h1>
        {displayInfo?.nameBn && (
          <p className="text-muted-foreground font-bengali mt-1">{displayInfo.nameBn}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          {isLoading ? "Loading..." : `${products.length} products found`}
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-4">No products found in this category</p>
          <p className="text-sm text-muted-foreground mb-6">
            Check back later for new arrivals!
          </p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.original_price || undefined}
              image={product.images_url?.[0] || "/placeholder.svg"}
              rating={product.rating || 0}
              reviews={product.review_count || 0}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Category;
