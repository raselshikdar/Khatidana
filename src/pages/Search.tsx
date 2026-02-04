import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  images_url: string[];
  rating: number;
  review_count: number;
  stock: number;
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      if (!query.trim()) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, price, original_price, images_url, rating, review_count, stock")
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Search error:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      
      setIsLoading(false);
    };

    fetchProducts();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <Layout className="container py-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Search Products
        </h1>
        
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for products..."
              className="pl-10 h-11"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-11 gradient-primary">
            Search
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>
      </div>

      {/* Results */}
      {query && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {isLoading ? "Searching..." : `${products.length} results for "${query}"`}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : !query ? (
        <div className="text-center py-16">
          <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Start your search</h2>
          <p className="text-muted-foreground">
            Enter a product name or keyword to find what you're looking for
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any products matching "{query}"
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Browse All Products
          </Button>
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

export default Search;
