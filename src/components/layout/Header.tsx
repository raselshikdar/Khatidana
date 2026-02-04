import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, Heart, Leaf, ChevronDown, LogOut, Package, Shield, X } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "Rice & Grains", nameBn: "চাল ও শস্য", slug: "rice-grains" },
  { name: "Pulses & Lentils", nameBn: "ডাল", slug: "pulses-lentils" },
  { name: "Spices", nameBn: "মসলা", slug: "spices" },
  { name: "Oils & Ghee", nameBn: "তেল ও ঘি", slug: "oils-ghee" },
  { name: "Honey & Sweeteners", nameBn: "মধু", slug: "honey-sweeteners" },
  { name: "Dry Fruits", nameBn: "শুকনো ফল", slug: "dry-fruits" },
  { name: "Flour & Atta", nameBn: "আটা ও ময়দা", slug: "flour-atta" },
  { name: "Organic Snacks", nameBn: "জৈব স্ন্যাকস", slug: "organic-snacks" },
];

export const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();
  const totalItems = getTotalItems();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="gradient-primary text-primary-foreground">
        <div className="container flex h-9 items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">100% Organic & Natural</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">🌾 Free Delivery on orders over ৳1000</span>
            <span className="text-accent font-semibold">খাঁটিদানা</span>
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
                  <h2 className="text-lg font-bold mb-2 font-display">Categories</h2>
                  {categories.map((cat) => (
                    <Button 
                      key={cat.slug} 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => navigate(`/category/${cat.slug}`)}
                    >
                      <span>{cat.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground font-bengali">{cat.nameBn}</span>
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
            <motion.div 
              className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-display font-bold text-foreground leading-tight">
                Khatidana
              </span>
              <span className="text-xs text-accent font-bengali font-semibold -mt-0.5">খাঁটিদানা</span>
            </div>
          </Link>

          {/* Search bar - Desktop only */}
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
                placeholder="Search organic products..."
                className="pl-10 h-11 bg-muted/50 border-border focus-visible:ring-primary rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-11 px-6 gradient-primary hover:opacity-90 transition-opacity shrink-0 rounded-full">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Actions - Always visible on right */}
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {/* Mobile Search Icon */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Wishlist - Now visible on both mobile and desktop */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </motion.div>

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
                      <Badge className="text-xs px-1.5 py-0.5 hidden lg:flex bg-accent text-accent-foreground">
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
                          <Badge className="text-xs px-1.5 py-0 bg-accent text-accent-foreground">
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
          </div>
        </div>
        
        {/* Mobile Search - Expandable */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <form 
                className="px-4 pb-3"
                onSubmit={handleMobileSearch}
              >
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search organic products..."
                      className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-primary rounded-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="h-10 px-4 gradient-primary hover:opacity-90 transition-opacity shrink-0 rounded-full">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories bar - Desktop */}
      <nav className="hidden lg:block border-b bg-card/80 backdrop-blur-sm">
        <div className="container">
          <div className="flex items-center gap-8 h-11 overflow-x-auto scrollbar-hide">
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
