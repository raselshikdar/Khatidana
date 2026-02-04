import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";

const Wishlist = () => {
  const { wishlistItems, isLoading } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout className="container py-12">
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
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout className="container py-12">
        <div className="flex items-center justify-center py-16">
          <div className="animate-pulse text-muted-foreground">Loading wishlist...</div>
        </div>
      </Layout>
    );
  }

  // Filter out items without product data
  const validItems = wishlistItems.filter(item => item.product);

  if (validItems.length === 0) {
    return (
      <Layout className="container py-12">
        <div className="flex flex-col items-center justify-center text-center py-16">
          <Heart className="h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-6">
            Start adding products you love to your wishlist
          </p>
          <Button asChild className="gradient-primary">
            <Link to="/">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
        <p className="text-muted-foreground">{validItems.length} items saved</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {validItems.map((item) => (
          <ProductCard
            key={item.id}
            id={item.product!.id}
            name={item.product!.name}
            price={item.product!.price}
            originalPrice={item.product!.original_price || undefined}
            image={item.product!.images_url?.[0] || "/placeholder.svg"}
            rating={item.product!.rating || 0}
            reviews={item.product!.review_count || 0}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Wishlist;
