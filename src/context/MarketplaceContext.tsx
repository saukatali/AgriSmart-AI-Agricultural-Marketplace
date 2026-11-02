import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Order, ScreenId } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface MarketplaceContextType {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  goBack: () => void;
  products: Product[];
  categories: Category[];
  cart: any[];
  wishlist: Product[];
  orders: Order[];
  notifications: any[];
  unreadNotificationCount: number;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedOrderId: number | null;
  setSelectedOrderId: (id: number | null) => void;
  selectedConversationId: number | null;
  setSelectedConversationId: (id: number | null) => void;
  aiChatOpen: boolean;
  setAiChatOpen: (open: boolean) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | number;
  setSelectedCategory: (cat: string | number) => void;
  fetchProducts: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<{ success: boolean; message: string }>;
  updateCartQty: (cartId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<boolean>;
  checkoutWithRazorpay: (deliveryAddress: string, paymentMethod: string) => Promise<{ success: boolean; order?: Order; message: string }>;
  addProduct: (productData: any) => Promise<{ success: boolean; message: string }>;
  editProduct: (id: number, productData: any) => Promise<{ success: boolean; message: string }>;
  deleteProduct: (id: number) => Promise<{ success: boolean; message: string }>;
  fetchOrders: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: number) => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreenState] = useState<ScreenId>('welcome');
  const [history, setHistory] = useState<ScreenId[]>(['welcome']);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | number>('all');

  // Change screen and track history
  const setCurrentScreen = (screen: ScreenId) => {
    setHistory((prev) => [...prev, screen]);
    setCurrentScreenState(screen);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // current
      const prevScreen = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentScreenState(prevScreen);
    } else {
      setCurrentScreenState(user?.role === 'farmer' ? 'farmer_dashboard' : 'customer_dashboard');
    }
  };

  // Sync initial screen when user logs in or out
  useEffect(() => {
    if (user) {
      if (currentScreen === 'welcome' || currentScreen === 'login' || currentScreen === 'register') {
        setCurrentScreenState(user.role === 'farmer' ? 'farmer_dashboard' : 'customer_dashboard');
      }
    }
  }, [user]);

  // Load products and categories
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProducts({
        search: searchQuery,
        categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
      });
      if (res.success) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('agrismart_token')}` },
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.items);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const res = await api.getWishlist();
      if (res.success) {
        setWishlist(res.products);
      }
    } catch (err) {
      console.error('Error loading wishlist:', err);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await api.getOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('agrismart_token')}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
      fetchOrders();
      fetchNotifications();
    }
  }, [user]);

  // Cart operations
  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!user) {
      setCurrentScreen('login');
      return { success: false, message: 'Please login to add items to cart.' };
    }
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('agrismart_token')}`,
        },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCart();
        return { success: true, message: `Added ${product.name} to cart!` };
      }
      return { success: false, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const updateCartQty = async (cartId: number, quantity: number) => {
    try {
      await fetch(`/api/cart/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('agrismart_token')}`,
        },
        body: JSON.stringify({ quantity }),
      });
      await fetchCart();
    } catch (err) {
      console.error('Update cart error:', err);
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      await fetch(`/api/cart/${cartId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('agrismart_token')}` },
      });
      await fetchCart();
    } catch (err) {
      console.error('Remove cart error:', err);
    }
  };

  const toggleWishlist = async (productId: number) => {
    if (!user) {
      setCurrentScreen('login');
      return false;
    }
    try {
      const res = await api.toggleWishlist(productId);
      await fetchWishlist();
      return res.inWishlist;
    } catch {
      return false;
    }
  };

  // Razorpay Checkout Simulation
  const checkoutWithRazorpay = async (deliveryAddress: string, paymentMethod: string) => {
    if (!user || cart.length === 0) {
      return { success: false, message: 'Cart is empty or user not logged in.' };
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.product?.pricePerKg || 0) * item.quantity, 0);
    const farmerId = cart[0]?.product?.farmerId || 1;
    const items = cart.map((it) => ({
      productId: it.productId,
      name: it.product?.name,
      quantity: it.quantity,
      pricePerKg: it.product?.pricePerKg,
    }));

    try {
      // Step 1: Create Order
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('agrismart_token')}`,
        },
        body: JSON.stringify({
          amount: totalAmount,
          farmerId,
          deliveryAddress,
          items,
        }),
      });
      const orderData = await res.json();
      if (!orderData.success) {
        return { success: false, message: orderData.message || 'Order creation failed' };
      }

      // Step 2: Verify Payment
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('agrismart_token')}`,
        },
        body: JSON.stringify({
          orderId: orderData.order.id,
          razorpayOrderId: orderData.razorpay.orderId,
          paymentMethod,
        }),
      });
      const verifyData = await verifyRes.json();

      await fetchCart();
      await fetchOrders();
      await fetchNotifications();

      return {
        success: true,
        order: verifyData.order,
        message: 'Payment verified! Order placed directly with farmer.',
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Payment failed' };
    }
  };

  const addProduct = async (productData: any) => {
    try {
      const res = await api.addProduct(productData);
      if (res.success) {
        await fetchProducts();
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const editProduct = async (id: number, productData: any) => {
    try {
      const res = await api.editProduct(id, productData);
      if (res.success) {
        await fetchProducts();
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        await fetchProducts();
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const markNotificationAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('agrismart_token')}` },
      });
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <MarketplaceContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        goBack,
        products,
        categories,
        cart,
        wishlist,
        orders,
        notifications,
        unreadNotificationCount,
        selectedProduct,
        setSelectedProduct,
        selectedOrderId,
        setSelectedOrderId,
        selectedConversationId,
        setSelectedConversationId,
        aiChatOpen,
        setAiChatOpen,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        fetchProducts,
        addToCart,
        updateCartQty,
        removeFromCart,
        toggleWishlist,
        checkoutWithRazorpay,
        addProduct,
        editProduct,
        deleteProduct,
        fetchOrders,
        fetchNotifications,
        markNotificationAsRead,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within a MarketplaceProvider');
  return context;
};
