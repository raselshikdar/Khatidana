import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
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

      // Search in both name and description using OR with ilike
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
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10 h-12 text-lg"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="gradient-primary px-6">
              <SearchIcon className="h-5 w-5" />
            </Button>
          </div>
        </form>

        {/* Results Header */}
        {query && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {isLoading ? "Searching..." : (
                products.length > 0 
                  ? `${products.length} result${products.length !== 1 ? 's' : ''} for "${query}"`
                  : `No products found for "${query}"`
              )}
            </h1>
          </div>
        )}

        {!query && (
          <div className="text-center py-16">
            <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Search for products</h2>
            <p className="text-muted-foreground">Enter a search term above to find products</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && query && (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-2" />
                <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.original_price || undefined}
                image={product.images_url?.[0] || "/placeholder.svg"}
                rating={product.rating}
                reviews={product.review_count}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && query && products.length === 0 && (
          <div className="text-center py-16">
            <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any products matching "{query}"
            </p>
            <Button onClick={() => navigate("/products")} className="gradient-primary">
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Search;
