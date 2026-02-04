import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  product_id: string;
  product?: {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    images_url: string[];
    rating: number;
    review_count: number;
  };
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  isLoading: boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("wishlists")
      .select(`
        id,
        product_id,
        products (
          id,
          name,
          price,
          original_price,
          images_url,
          rating,
          review_count
        )
      `)
      .eq("user_id", user.id);

    if (!error && data) {
      setWishlistItems(data.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product: item.products,
      })));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some((item) => item.product_id === productId);
  }, [wishlistItems]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    const existing = wishlistItems.find((item) => item.product_id === productId);

    if (existing) {
      // Remove from wishlist
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", existing.id);

      if (error) {
        toast.error("Failed to remove from wishlist");
      } else {
        setWishlistItems((prev) => prev.filter((item) => item.id !== existing.id));
        toast.success("Removed from wishlist");
      }
    } else {
      // Add to wishlist
      const { data, error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, product_id: productId })
        .select()
        .single();

      if (error) {
        toast.error("Failed to add to wishlist");
      } else {
        setWishlistItems((prev) => [...prev, { id: data.id, product_id: productId }]);
        toast.success("Added to wishlist");
      }
    }
  };

  const refreshWishlist = async () => {
    await fetchWishlist();
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        isLoading,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};