import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, Heart, MapPin, ChevronDown, LogOut, Package, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home & Living", slug: "home-living" },
  { name: "Beauty", slug: "beauty" },
  { name: "Sports", slug: "sports" },
  { name: "Groceries", slug: "groceries" },
  { name: "Toys", slug: "toys" },
  { name: "Automotive", slug: "automotive" },
];

export const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { getTotalItems } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();
  const totalItems = getTotalItems();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="gradient-primary text-primary-foreground">
        <div className="container flex h-10 items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Deliver to Dhaka</span>
            <ChevronDown className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">🔥 Free Delivery on orders over ৳500</span>
            <span>Download App</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center gap-2 md:gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-card">
              <div className="flex flex-col gap-4 pt-8">
                
                <div className="border-t pt-4">
                  <h2 className="text-lg font-bold mb-2">Categories</h2>
                  {categories.map((cat) => (
                    <Button 
                      key={cat.slug} 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => navigate(`/category/${cat.slug}`)}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
                
                {user && (
                  <div className="border-t pt-4">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/profile")}>
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/profile")}>
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/admin")}>
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Button>
                    )}
                    <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="Bongshai" className="h-10 w-10 rounded-lg object-contain" />
            <span className="hidden text-xl font-bold text-foreground sm:inline">
              Bong<span className="text-primary">shai</span>
            </span>
          </Link>

          {/* Search bar - Responsive */}
          <form 
            className="flex-1 min-w-0 max-w-2xl hidden md:flex items-center gap-2 mx-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10 h-10 bg-muted border-0 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-10 px-4 gradient-primary hover:opacity-90 transition-opacity shrink-0">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Actions - Always visible on right */}
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {/* Theme Toggle - Left of Wishlist */}
            <ThemeToggle />
            
            {/* Wishlist - visible on all sizes */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center gradient-flash text-xs animate-cart-bounce"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex gap-2 px-2">
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary-foreground">
                        {profile?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="max-w-20 truncate hidden lg:inline">{profile?.name || "Account"}</span>
                    {isAdmin && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5 hidden lg:flex">
                        ADMIN
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4 hidden lg:inline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{profile?.name || "User"}</span>
                        {isAdmin && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0">
                            ADMIN
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Package className="h-4 w-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="hidden md:flex gap-2"
                onClick={() => navigate("/auth")}
              >
                <User className="h-5 w-5" />
                <span className="hidden lg:inline">Login</span>
              </Button>
            )}

            {/* Mobile user button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => navigate(user ? "/profile" : "/auth")}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Search - Own row */}
        <form 
          className="md:hidden px-4 pb-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
        >
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10 h-10 bg-muted border-0 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-10 px-3 gradient-primary hover:opacity-90 transition-opacity shrink-0">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Categories bar - Desktop */}
      <nav className="hidden lg:block border-b bg-card/80 backdrop-blur-sm">
        <div className="container">
          <div className="flex items-center gap-6 h-10 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
