import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  category: string;
  images_url: string[];
  rating: number;
  review_count: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [canReview, setCanReview] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const isWishlisted = id ? isInWishlist(id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        navigate("/");
        return;
      }

      setProduct(data);
      setIsLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  // Separate effect for fetching reviews - re-runs whenever product_id changes
  const fetchReviews = async () => {
    if (!id) return;

    // Use left join (no !inner) to fetch reviews even if profile doesn't exist
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        user_id,
        profiles(name)
      `)
      .eq("product_id", id)
      .order("created_at", { ascending: false });

    console.log("Reviews fetch result:", { data, error });

    if (data) {
      setReviews(data.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        user_name: r.profiles?.name || "Customer",
      })));
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // Check if user can review - must have a DELIVERED order with this product
  useEffect(() => {
    const checkCanReview = async () => {
      if (!id || !user) {
        setCanReview(false);
        return;
      }

      // Check if user has a delivered order containing this product
      const { data: hasPurchased } = await supabase.rpc("has_purchased", {
        _user_id: user.id,
        _product_id: id,
      });

      // Also check if user has already reviewed this product
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      // User can review if they purchased and haven't already reviewed
      setCanReview(hasPurchased && !existingReview);
    };

    checkCanReview();
  }, [id, user]);

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.original_price || undefined,
        image: product.images_url[0] || "/placeholder.svg",
      });
    }
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleWishlist = async () => {
    if (!id) return;
    await toggleWishlist(id);
  };

  const handleSubmitReview = async () => {
    if (!user || !id) {
      toast.error("Please login to submit a review");
      return;
    }
    
    setIsSubmittingReview(true);
    
    const { error } = await supabase
      .from("reviews")
      .insert({
        product_id: id,
        user_id: user.id,
        rating,
        comment: comment || null,
      });

    if (error) {
      toast.error("Failed to submit review");
    } else {
      toast.success("Review submitted!");
      setCanReview(false);
      setComment("");
      setRating(5);
      // Immediately refresh reviews
      await fetchReviews();
    }
    
    setIsSubmittingReview(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-muted rounded-lg" />
            <div className="h-8 w-1/2 bg-muted rounded" />
            <div className="h-4 w-1/4 bg-muted rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate("/")} className="hover:text-primary">Home</button>
          <ChevronRight className="h-4 w-4" />
          <button 
            onClick={() => navigate(`/category/${product.category.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-')}`)} 
            className="hover:text-primary text-foreground"
          >
            {product.category}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 overflow-hidden">
          {/* Images */}
          <div className="space-y-4 overflow-hidden max-w-full">
            <div className="aspect-square relative overflow-hidden rounded-lg border bg-muted w-full">
              <img
                src={product.images_url[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-contain max-w-full"
                style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 gradient-flash text-white">
                  -{discount}%
                </Badge>
              )}
            </div>
            {product.images_url.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images_url.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImage === idx ? "border-primary" : "border-muted"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col w-full space-y-6 min-w-0">
            <div className="break-words">
              <h1 className="text-2xl font-bold break-words">{product.name}</h1>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                  <span className="text-sm ml-1">({product.review_count} reviews)</span>
                </div>
                {product.stock > 0 ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">৳{product.price.toLocaleString()}</span>
                {product.original_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    ৳{product.original_price.toLocaleString()}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  You save ৳{(product.original_price! - product.price).toLocaleString()} ({discount}%)
                </p>
              )}
            </div>

            <Separator />

            {product.description && (
              <div className="break-words">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground break-words whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 gradient-primary"
                  size="lg"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleWishlist}
                  className={cn(isWishlisted && "text-destructive border-destructive")}
                >
                  <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={async () => {
                    const url = window.location.href;
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: product.name,
                          text: `Check out ${product.name} on HaatBazar!`,
                          url,
                        });
                      } catch (err) {
                        // User cancelled or error
                      }
                    } else {
                      await navigator.clipboard.writeText(url);
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">On orders over ৳500</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">100% protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Customer Reviews ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Write Review */}
            {user && canReview && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-4">Write a Review</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm mb-2 block">Rating</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 transition-colors ${
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground hover:text-yellow-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={3}
                  />
                  <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview}
                    className="gradient-primary"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </div>
            )}

            {/* Login prompt for non-logged in users */}
            {!user && (
              <div className="p-4 border rounded-lg bg-muted/30 text-center">
                <p className="text-muted-foreground mb-2">Please login to write a review</p>
                <Button variant="outline" onClick={() => navigate("/auth")}>
                  Login
                </Button>
              </div>
            )}

            {/* Logged in but can't review - show appropriate message */}
            {user && !canReview && (
              <div className="p-4 border rounded-lg bg-muted/30 text-center">
                <p className="text-muted-foreground">
                  You can only review products you have purchased and received (order status: Delivered).
                </p>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{review.user_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default ProductDetail;