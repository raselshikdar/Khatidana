import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Plus,
  Edit, Trash2, Upload, X, Save, Eye, Search, Filter, Tag, FileText
} from "lucide-react";
import { OrderDetailModal } from "@/components/order/OrderDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  category: string;
  images_url: string[];
  is_featured: boolean;
  is_flash_sale: boolean;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: string;
  payment_method: string;
  payment_status: string | null;
  payment_transaction_id: string | null;
  shipping_address: {
    district: string;
    thana: string;
    area: string;
  };
  tracking_number: string | null;
  admin_notes: string | null;
  created_at: string;
  profiles?: {
    name: string;
    phone: string;
  };
}

interface UserProfile {
  id: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  email?: string;
}

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  minimum_order: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

interface Analytics {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
}

const categories = [
  "Electronics", "Fashion", "Home & Living", "Beauty", "Sports", "Groceries", "Toys", "Automotive"
];

// Extended categories for enhanced product form
const extendedCategories = [
  "Electronics", "Fashion", "Home", "Beauty", "Grocery", 
  "Home & Living", "Sports", "Toys", "Automotive"
];

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ totalSales: 0, totalOrders: 0, totalUsers: 0, pendingOrders: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Product form
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    stock: "",
    category: "",
    brand: "",
    delivery_charge: "",
    images_url: [] as string[],
    is_featured: false,
    is_flash_sale: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Coupon form
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    minimum_order: "",
    max_uses: "",
    is_active: true,
    expires_at: "",
  });

  // Order tracking dialog
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderTrackingForm, setOrderTrackingForm] = useState({
    tracking_number: "",
    admin_notes: "",
  });
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch products
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (productsData) setProducts(productsData);

    // Fetch orders - NOT filtered by current user. Admin sees ALL orders.
    // First fetch orders, then separately fetch profiles for each user_id
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Orders fetch result:", { ordersData, ordersError, count: ordersData?.length });

    if (ordersError) {
      console.error("Failed to fetch orders:", ordersError);
      toast.error("Failed to load orders: " + ordersError.message);
    }

    if (ordersData && ordersData.length > 0) {
      // Get unique user IDs
      const userIds = [...new Set(ordersData.map(o => o.user_id))];
      
      // Fetch profiles for those users
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, name, phone")
        .in("id", userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      setOrders(ordersData.map((order: any) => ({
        ...order,
        shipping_address: order.shipping_address as Order["shipping_address"],
        profiles: profilesMap.get(order.user_id) || null,
      })));
    } else {
      setOrders([]);
    }

    // Fetch users
    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersData) {
      setUsers(usersData);
    }

    // Fetch coupons
    const { data: couponsData } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (couponsData) {
      setCoupons(couponsData);
    }

    // Fetch analytics
    const { data: salesData } = await supabase
      .from("orders")
      .select("total_price, status");

    const { count: usersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (salesData) {
      const totalSales = salesData
        .filter((o: any) => o.status === "delivered")
        .reduce((sum: number, o: any) => sum + Number(o.total_price), 0);
      const pendingOrders = salesData.filter((o: any) => o.status === "pending").length;

      setAnalytics({
        totalSales,
        totalOrders: salesData.length,
        totalUsers: usersCount || 0,
        pendingOrders,
      });
    }

    setIsLoading(false);
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      original_price: "",
      stock: "",
      category: "",
      brand: "",
      delivery_charge: "",
      images_url: [],
      is_featured: false,
      is_flash_sale: false,
    });
    setEditingProduct(null);
  };

  const resetCouponForm = () => {
    setCouponForm({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      minimum_order: "",
      max_uses: "",
      is_active: true,
      expires_at: "",
    });
    setEditingCoupon(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      stock: product.stock.toString(),
      category: product.category,
      brand: (product as any).brand || "",
      delivery_charge: (product as any).delivery_charge?.toString() || "",
      images_url: product.images_url,
      is_featured: product.is_featured,
      is_flash_sale: product.is_flash_sale,
    });
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);

    const productData = {
      name: productForm.name,
      description: productForm.description || null,
      price: parseFloat(productForm.price),
      original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
      stock: parseInt(productForm.stock) || 0,
      category: productForm.category,
      images_url: productForm.images_url,
      is_featured: productForm.is_featured,
      is_flash_sale: productForm.is_flash_sale,
    };

    console.log("Saving product:", productData);

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        console.error("Product update error:", error);
        toast.error("Failed to update product: " + error.message);
      } else {
        toast.success("Product updated!");
        fetchData();
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select();

      if (error) {
        console.error("Product insert error:", error);
        toast.error("Failed to add product: " + error.message);
      } else {
        console.log("Product created successfully:", data);
        toast.success("Product added!");
        fetchData();
      }
    }

    setIsSaving(false);
    setIsProductDialogOpen(false);
    resetProductForm();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted");
      fetchData();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: "pending" | "processing" | "shipped" | "delivered" | "cancelled") => {
    const order = orders.find(o => o.id === orderId);
    
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
    } else {
      toast.success("Order status updated");
      // Update local state - for COD + delivered, also update payment_status to 'paid' (trigger handles DB)
      const shouldMarkPaid = status === "delivered" && order?.payment_method === "cod";
      setOrders(prev => prev.map(o => 
        o.id === orderId 
          ? { ...o, status, ...(shouldMarkPaid ? { payment_status: "paid" } : {}) } 
          : o
      ));
      // Update analytics for pending count
      if (status === "pending" || status === "delivered") {
        setAnalytics(prev => ({
          ...prev,
          pendingOrders: prev.pendingOrders + (status === "pending" ? 1 : -1),
          totalSales: status === "delivered" 
            ? prev.totalSales + (orders.find(o => o.id === orderId)?.total_price || 0)
            : prev.totalSales
        }));
      }

      // Send email notification via edge function
      if (order) {
        try {
          await supabase.functions.invoke('send-order-notification', {
            body: {
              orderId,
              newStatus: status,
              userId: order.user_id,
              userName: order.profiles?.name,
              trackingNumber: order.tracking_number,
              shippingAddress: order.shipping_address
            }
          });
          console.log("Email notification triggered for order:", orderId);
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Don't show error to user - status update was successful
        }
      }
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: "paid" | "pending") => {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: paymentStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update payment status");
    } else {
      toast.success(`Payment marked as ${paymentStatus}`);
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, payment_status: paymentStatus } : o
      ));
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setOrderTrackingForm({
      tracking_number: order.tracking_number || "",
      admin_notes: order.admin_notes || "",
    });
    setIsOrderDialogOpen(true);
  };

  const handleSaveOrderTracking = async () => {
    if (!editingOrder) return;

    const { error } = await supabase
      .from("orders")
      .update({
        tracking_number: orderTrackingForm.tracking_number || null,
        admin_notes: orderTrackingForm.admin_notes || null,
      })
      .eq("id", editingOrder.id);

    if (error) {
      toast.error("Failed to update order");
    } else {
      toast.success("Order updated!");
      fetchData();
    }

    setIsOrderDialogOpen(false);
    setEditingOrder(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const file = files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    // Convert file to ArrayBuffer for more reliable upload
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    console.log("Uploading image:", { fileName, fileType: file.type, size: file.size });

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image: " + error.message);
      return;
    }

    console.log("Image uploaded successfully:", data);

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    console.log("Public URL:", publicUrl);

    setProductForm((prev) => ({
      ...prev,
      images_url: [...prev.images_url, publicUrl],
    }));
    toast.success("Image uploaded!");
    
    // Reset file input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      images_url: prev.images_url.filter((_, i) => i !== index),
    }));
  };

  // Coupon handlers
  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      description: coupon.description || "",
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      minimum_order: coupon.minimum_order?.toString() || "",
      max_uses: coupon.max_uses?.toString() || "",
      is_active: coupon.is_active,
      expires_at: coupon.expires_at ? coupon.expires_at.split("T")[0] : "",
    });
    setIsCouponDialogOpen(true);
  };

  const handleSaveCoupon = async () => {
    if (!couponForm.code || !couponForm.discount_value) {
      toast.error("Please fill in code and discount value");
      return;
    }

    setIsSaving(true);

    const couponData = {
      code: couponForm.code.toUpperCase().trim(),
      description: couponForm.description || null,
      discount_type: couponForm.discount_type,
      discount_value: parseFloat(couponForm.discount_value),
      minimum_order: couponForm.minimum_order ? parseFloat(couponForm.minimum_order) : 0,
      max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses) : null,
      is_active: couponForm.is_active,
      expires_at: couponForm.expires_at ? new Date(couponForm.expires_at).toISOString() : null,
    };

    if (editingCoupon) {
      const { error } = await supabase
        .from("coupons")
        .update(couponData)
        .eq("id", editingCoupon.id);

      if (error) {
        toast.error("Failed to update coupon");
      } else {
        toast.success("Coupon updated!");
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("coupons")
        .insert(couponData);

      if (error) {
        toast.error("Failed to create coupon");
      } else {
        toast.success("Coupon created!");
        fetchData();
      }
    }

    setIsSaving(false);
    setIsCouponDialogOpen(false);
    resetCouponForm();
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete coupon");
    } else {
      toast.success("Coupon deleted");
      fetchData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "processing": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "shipped": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string | null) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "failed": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "cancelled": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === "all" || o.status === orderStatusFilter
  );

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r hidden lg:block">
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <span className="text-xl font-bold text-primary-foreground">H</span>
          </div>
          <span className="text-xl font-bold">
            Haat<span className="text-primary">Bazar</span>
          </span>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground">
            <Eye className="h-5 w-5" />
            View Store
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" asChild>
            <Link to="/">View Store</Link>
          </Button>
        </header>

        <div className="p-6">
          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Sales</CardDescription>
                <CardTitle className="text-3xl text-green-600 dark:text-green-400">
                  ৳{analytics.totalSales.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Orders</CardDescription>
                <CardTitle className="text-3xl">{analytics.totalOrders}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending Orders</CardDescription>
                <CardTitle className="text-3xl text-yellow-600 dark:text-yellow-400">{analytics.pendingOrders}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-3xl">{analytics.totalUsers}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="coupons" className="gap-2">
                <Tag className="h-4 w-4" />
                Promo Codes
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Product Inventory</CardTitle>
                    <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
                      setIsProductDialogOpen(open);
                      if (!open) resetProductForm();
                    }}>
                      <DialogTrigger asChild>
                        <Button className="gradient-primary">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                          <DialogDescription>
                            Fill in the product details below
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Name *</Label>
                              <Input
                                value={productForm.name}
                                onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                                placeholder="Product name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Category *</Label>
                              <Select
                                value={productForm.category}
                                onValueChange={(v) => setProductForm((p) => ({ ...p, category: v }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={productForm.description}
                              onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                              placeholder="Product description"
                              rows={3}
                            />
                          </div>
                          
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Brand Name</Label>
                              <Input
                                value={productForm.brand}
                                onChange={(e) => setProductForm((p) => ({ ...p, brand: e.target.value }))}
                                placeholder="e.g., Samsung, Nike"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Delivery Charge (৳)</Label>
                              <Input
                                type="number"
                                value={productForm.delivery_charge}
                                onChange={(e) => setProductForm((p) => ({ ...p, delivery_charge: e.target.value }))}
                                placeholder="0 for free delivery"
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                              <Label>Original Price (MRP)</Label>
                              <Input
                                type="number"
                                value={productForm.original_price}
                                onChange={(e) => setProductForm((p) => ({ ...p, original_price: e.target.value }))}
                                placeholder="৳0"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Sale Price *</Label>
                              <Input
                                type="number"
                                value={productForm.price}
                                onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                                placeholder="৳0"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Discount %</Label>
                              <Input
                                type="text"
                                readOnly
                                value={
                                  productForm.original_price && productForm.price && parseFloat(productForm.original_price) > 0
                                    ? `${Math.round(((parseFloat(productForm.original_price) - parseFloat(productForm.price)) / parseFloat(productForm.original_price)) * 100)}%`
                                    : "0%"
                                }
                                className="bg-muted"
                              />
                              <p className="text-xs text-muted-foreground">Auto-calculated</p>
                            </div>
                            <div className="space-y-2">
                              <Label>Stock Quantity *</Label>
                              <Input
                                type="number"
                                value={productForm.stock}
                                onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))}
                                placeholder="0"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Product Images (First image = Thumbnail, up to 5 total)</Label>
                            <p className="text-xs text-muted-foreground mb-2">
                              The first image will be used as the main thumbnail. Additional images form the product gallery.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {productForm.images_url.map((url, idx) => (
                                <div key={idx} className="relative w-20 h-20">
                                  <img src={url} alt="" className="w-full h-full object-cover rounded-lg border-2 border-muted" />
                                  {idx === 0 && (
                                    <span className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                                      Main
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                              {productForm.images_url.length < 5 && (
                                <label className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                  <Upload className="h-5 w-5 text-muted-foreground" />
                                  <span className="text-[10px] text-muted-foreground mt-1">Add</span>
                                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={productForm.is_featured}
                                onCheckedChange={(v) => setProductForm((p) => ({ ...p, is_featured: v }))}
                              />
                              <Label>Featured Product</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={productForm.is_flash_sale}
                                onCheckedChange={(v) => setProductForm((p) => ({ ...p, is_flash_sale: v }))}
                              />
                              <Label>Flash Sale</Label>
                            </div>
                          </div>

                          <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveProduct} disabled={isSaving} className="gradient-primary">
                              <Save className="h-4 w-4 mr-2" />
                              {isSaving ? "Saving..." : "Save Product"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images_url[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">৳{product.price.toLocaleString()}</span>
                              {product.original_price && (
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  ৳{product.original_price.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                              {product.stock}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {product.is_featured && <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Featured</Badge>}
                              {product.is_flash_sale && <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Flash Sale</Badge>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No products found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Order Management</CardTitle>
                    <Button 
                      variant="outline" 
                      onClick={fetchData}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <Package className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh Orders
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                      <SelectTrigger className="w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Tracking Dialog */}
                  <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Order Details & Tracking</DialogTitle>
                        <DialogDescription>
                          Update tracking information and admin notes
                        </DialogDescription>
                      </DialogHeader>
                      {editingOrder && (
                        <div className="space-y-4 py-4">
                          <div className="grid gap-2 p-3 bg-muted rounded-lg">
                            <p><strong>Order ID:</strong> #{editingOrder.id.slice(0, 8).toUpperCase()}</p>
                            <p><strong>Customer:</strong> {editingOrder.profiles?.name || "N/A"}</p>
                            <p><strong>Phone:</strong> {editingOrder.profiles?.phone || "N/A"}</p>
                            <p><strong>Address:</strong> {editingOrder.shipping_address?.area}, {editingOrder.shipping_address?.thana}, {editingOrder.shipping_address?.district}</p>
                            <p><strong>Total:</strong> ৳{editingOrder.total_price.toLocaleString()}</p>
                          </div>
                          <div className="space-y-2">
                            <Label>Tracking Number</Label>
                            <Input
                              value={orderTrackingForm.tracking_number}
                              onChange={(e) => setOrderTrackingForm(p => ({ ...p, tracking_number: e.target.value }))}
                              placeholder="Enter tracking number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Admin Notes</Label>
                            <Textarea
                              value={orderTrackingForm.admin_notes}
                              onChange={(e) => setOrderTrackingForm(p => ({ ...p, admin_notes: e.target.value }))}
                              placeholder="Internal notes about this order..."
                              rows={3}
                            />
                          </div>
                          <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveOrderTracking} className="gradient-primary">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            <div>
                              #{order.id.slice(0, 8).toUpperCase()}
                              {order.tracking_number && (
                                <p className="text-xs text-muted-foreground">Track: {order.tracking_number}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.profiles?.name || "N/A"}</p>
                              <p className="text-sm text-muted-foreground">{order.profiles?.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ৳{order.total_price.toLocaleString()}
                          </TableCell>
                          <TableCell className="capitalize">
                            {order.payment_method === "cod" ? "COD" : order.payment_method}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge className={getPaymentStatusColor(order.payment_status)}>
                                  {order.payment_status === "paid" ? "✓ Paid" : 
                                   order.payment_status === "pending" ? "Pending" : 
                                   order.payment_status === "failed" ? "Failed" : 
                                   order.payment_status === "cancelled" ? "Cancelled" : "Pending"}
                                </Badge>
                                {/* Manual payment toggle for admin */}
                                {order.payment_status !== "paid" && order.status !== "cancelled" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                    onClick={() => handleUpdatePaymentStatus(order.id, "paid")}
                                  >
                                    Mark Paid
                                  </Button>
                                )}
                                {order.payment_status === "paid" && order.payment_method === "cod" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-xs text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                                    onClick={() => handleUpdatePaymentStatus(order.id, "pending")}
                                  >
                                    Mark Unpaid
                                  </Button>
                                )}
                              </div>
                              {order.payment_transaction_id && (
                                <p className="text-xs text-muted-foreground truncate max-w-[100px]" title={order.payment_transaction_id}>
                                  ID: {order.payment_transaction_id.slice(0, 8)}...
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 flex-wrap">
                              {/* Quick action buttons based on current status */}
                              {order.status === "pending" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  onClick={() => handleUpdateOrderStatus(order.id, "processing")}
                                >
                                  Approve
                                </Button>
                              )}
                              {order.status === "processing" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-purple-600 border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                  onClick={() => handleUpdateOrderStatus(order.id, "shipped")}
                                >
                                  Ship
                                </Button>
                              )}
                              {order.status === "shipped" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                  onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                                >
                                  Deliver
                                </Button>
                              )}
                              {(order.status === "pending" || order.status === "processing") && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-destructive border-destructive hover:bg-destructive/10"
                                  onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                >
                                  Cancel
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" onClick={() => setViewOrderId(order.id)} title="View Order Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditOrder(order)} title="Edit Tracking">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8 space-y-4">
                      <p className="text-muted-foreground">No orders found</p>
                      <Button variant="outline" onClick={fetchData} disabled={isLoading}>
                        <Package className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh Orders
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Users</CardTitle>
                  <CardDescription>View all registered users on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name || "No name"}</TableCell>
                          <TableCell>{u.phone || "N/A"}</TableCell>
                          <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {users.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Coupons Tab */}
            <TabsContent value="coupons">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Promo Code Management</CardTitle>
                      <CardDescription>Create and manage discount codes</CardDescription>
                    </div>
                    <Dialog open={isCouponDialogOpen} onOpenChange={(open) => {
                      setIsCouponDialogOpen(open);
                      if (!open) resetCouponForm();
                    }}>
                      <DialogTrigger asChild>
                        <Button className="gradient-primary">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Coupon
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Code *</Label>
                              <Input
                                value={couponForm.code}
                                onChange={(e) => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                                placeholder="SUMMER20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Discount Type</Label>
                              <Select
                                value={couponForm.discount_type}
                                onValueChange={(v) => setCouponForm(p => ({ ...p, discount_type: v }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                                  <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              value={couponForm.description}
                              onChange={(e) => setCouponForm(p => ({ ...p, description: e.target.value }))}
                              placeholder="Summer sale discount"
                            />
                          </div>
                          
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Discount Value *</Label>
                              <Input
                                type="number"
                                value={couponForm.discount_value}
                                onChange={(e) => setCouponForm(p => ({ ...p, discount_value: e.target.value }))}
                                placeholder={couponForm.discount_type === "percentage" ? "20" : "100"}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Minimum Order (৳)</Label>
                              <Input
                                type="number"
                                value={couponForm.minimum_order}
                                onChange={(e) => setCouponForm(p => ({ ...p, minimum_order: e.target.value }))}
                                placeholder="500"
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Max Uses</Label>
                              <Input
                                type="number"
                                value={couponForm.max_uses}
                                onChange={(e) => setCouponForm(p => ({ ...p, max_uses: e.target.value }))}
                                placeholder="Unlimited"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Expires At</Label>
                              <Input
                                type="date"
                                value={couponForm.expires_at}
                                onChange={(e) => setCouponForm(p => ({ ...p, expires_at: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={couponForm.is_active}
                              onCheckedChange={(v) => setCouponForm(p => ({ ...p, is_active: v }))}
                            />
                            <Label>Active</Label>
                          </div>

                          <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setIsCouponDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveCoupon} disabled={isSaving} className="gradient-primary">
                              <Save className="h-4 w-4 mr-2" />
                              {isSaving ? "Saving..." : "Save Coupon"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Min Order</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coupons.map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                          <TableCell>
                            {coupon.discount_type === "percentage" 
                              ? `${coupon.discount_value}%`
                              : `৳${coupon.discount_value}`
                            }
                          </TableCell>
                          <TableCell>৳{coupon.minimum_order || 0}</TableCell>
                          <TableCell>
                            {coupon.used_count} / {coupon.max_uses || "∞"}
                          </TableCell>
                          <TableCell>
                            {coupon.expires_at 
                              ? new Date(coupon.expires_at).toLocaleDateString()
                              : "Never"
                            }
                          </TableCell>
                          <TableCell>
                            <Badge className={coupon.is_active 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }>
                              {coupon.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditCoupon(coupon)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCoupon(coupon.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {coupons.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No coupons found. Create your first promo code!
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Order Detail Modal */}
      <OrderDetailModal
        orderId={viewOrderId}
        isOpen={!!viewOrderId}
        onClose={() => setViewOrderId(null)}
        isAdmin={true}
      />
    </div>
  );
};

export default Admin;