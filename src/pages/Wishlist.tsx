import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";

const Wishlist = () => {
  const { wishlistItems, isLoading } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="flex flex-col items-center justify-center text-center py-16">
            <Heart className="h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold mb-2">Please login to view your wishlist</h1>
            <p className="text-muted-foreground mb-6">
              Sign in to save and access your favorite products
            </p>
            <Button asChild className="gradient-primary">
              <Link to="/auth">Login / Sign Up</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="flex items-center justify-center py-16">
            <div className="animate-pulse text-muted-foreground">Loading wishlist...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="flex flex-col items-center justify-center text-center py-16">
            <Heart className="h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-6">
              Browse products and add your favorites to the wishlist
            </p>
            <Button asChild className="gradient-primary">
              <Link to="/">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          <h1 className="text-2xl font-bold">My Wishlist ({wishlistItems.length} items)</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlistItems.map((item) => (
            item.product && (
              <ProductCard
                key={item.id}
                id={item.product.id}
                name={item.product.name}
                price={item.product.price}
                originalPrice={item.product.original_price || undefined}
                image={item.product.images_url?.[0] || "/placeholder.svg"}
                rating={item.product.rating || 0}
                reviews={item.product.review_count || 0}
              />
            )
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;