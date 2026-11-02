import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Star,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Tag,
  ArrowRight,
  Package,
  Calendar,
  Layers,
  Heart,
  ShoppingCart,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Check,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';

// ==========================================
// SCREEN 7: FARMER DASHBOARD
// ==========================================
export const FarmerDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { products, orders, setCurrentScreen, setSelectedProduct } = useMarketplace();
  const { t } = useLanguage();

  const myProducts = products.filter((p) => p.farmerId === user?.id || user?.id === 1);
  const myOrders = orders.filter((o) => o.farmerId === user?.id || user?.id === 1);
  const totalRevenue = myOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            🌾 {user?.farmerProfile?.farmName || 'Annapurna Organic Farm'}
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Namaste, {user?.name?.split(' ')[0] || 'Rajesh Ji'}!
          </h1>
        </div>
        <button
          onClick={() => setCurrentScreen('notifications')}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
        >
          <span className="text-base">🔔</span>
        </button>
      </div>

      {/* Live Mandi Ticker Banner */}
      <div className="mb-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 p-3 text-white shadow-md">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-amber-400" />
          <div>
            <div className="text-[10px] text-emerald-200">APMC Lasalgaon Mandi</div>
            <div className="text-xs font-bold">Tomato: ₹32/kg • Onion: ₹28/kg</div>
          </div>
        </div>
        <button
          onClick={() => setCurrentScreen('price_analytics')}
          className="rounded-lg bg-emerald-700/60 px-2.5 py-1 text-[10px] font-bold text-emerald-200 hover:bg-emerald-600"
        >
          Forecast &gt;
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Produce Sales</div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
            ₹{totalRevenue > 0 ? totalRevenue.toLocaleString() : '48,450'}
          </div>
          <div className="mt-1 flex items-center text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span>+24.6% this month</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Active Listings</div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
            {myProducts.length || 4} <span className="text-xs font-normal text-slate-400">Crops</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] font-semibold text-amber-600 dark:text-amber-400">
            <span>{myOrders.length || 2} Pending Orders</span>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="mb-5 flex gap-2">
        <button
          onClick={() => setCurrentScreen('add_product')}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2.5 px-3 text-xs font-bold text-white shadow hover:bg-emerald-600 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Harvest</span>
        </button>

        <button
          onClick={() => setCurrentScreen('demand_forecast')}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2.5 px-3 text-xs font-bold text-slate-950 shadow hover:bg-amber-400 active:scale-95 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span>Demand Forecast</span>
        </button>
      </div>

      {/* My Active Harvest Listings */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">My Farm Produce</h2>
          <button
            onClick={() => setCurrentScreen('add_product')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            + Add Crop
          </button>
        </div>

        <div className="space-y-2.5">
          {myProducts.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedProduct(item);
                setCurrentScreen('product_details');
              }}
              className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm cursor-pointer hover:border-emerald-500 transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.primaryImage}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg object-cover bg-emerald-100"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{item.pricePerKg}/kg</span>
                    <span>•</span>
                    <span>Stock: {item.availableQuantity}kg</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block rounded bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  {item.qualityGrade}
                </span>
                <div className="text-[10px] text-slate-400 mt-1">{item.views || 120} views</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Farm Orders */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Customer Orders</h2>
          <button
            onClick={() => setCurrentScreen('orders')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            View All
          </button>
        </div>

        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Priya Sharma (Mumbai)</div>
              <div className="text-[11px] text-slate-500 font-mono">Order #AGRI-2026-8841</div>
            </div>
            <span className="rounded bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
              Ready to Dispatch
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
            5kg Vine Tomatoes, 10kg Nashik Red Onions (₹480 Total)
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 8: CUSTOMER DASHBOARD
// ==========================================
export const CustomerDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const {
    products,
    categories,
    setCurrentScreen,
    setSelectedProduct,
    setSelectedCategory,
    addToCart,
    searchQuery,
    setSearchQuery,
  } = useMarketplace();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <MapPin className="h-3 w-3" />
            <span>Delivering to {user?.city || 'Mumbai, Maharashtra'}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Fresh Farm Harvest
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('chat_list')}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentScreen('notifications')}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300"
          >
            🔔
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-10 text-xs text-slate-900 dark:text-white shadow-sm focus:border-emerald-600 focus:outline-none"
        />
        <button
          onClick={() => setCurrentScreen('marketplace')}
          className="absolute right-3 top-2.5 text-slate-400 hover:text-emerald-600"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Featured Farm Banner */}
      <div className="mb-4 relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-950 p-4 text-white shadow-md">
        <div className="relative z-10 max-w-[65%]">
          <span className="inline-block rounded bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-slate-950 mb-1">
            DIRECT FROM FARM
          </span>
          <h2 className="text-base font-extrabold leading-tight">Zero Middleman Markup</h2>
          <p className="mt-1 text-[11px] text-emerald-200">
            Save up to 30% vs supermarkets while supporting organic farmers.
          </p>
          <button
            onClick={() => setCurrentScreen('marketplace')}
            className="mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
          >
            Browse Marketplace
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-emerald-600/20 blur-xl"></div>
        <span className="absolute right-3 bottom-3 text-5xl">🍅</span>
      </div>

      {/* Categories Horizontal Carousel */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Categories
          </h3>
          <button
            onClick={() => setCurrentScreen('marketplace')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            See All
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentScreen('marketplace');
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:border-emerald-500 transition-all"
            >
              <span className="text-sm">🌿</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Farm Products */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Today's Fresh Harvest
          </h3>
          <button
            onClick={() => setCurrentScreen('marketplace')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            View More
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProduct(p);
                setCurrentScreen('product_details');
              }}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 shadow-sm cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="relative mb-2 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                <img
                  src={p.primaryImage}
                  alt={p.name}
                  className="h-28 w-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 rounded bg-slate-900/80 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-bold text-white">
                  {p.qualityGrade}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                  <MapPin className="h-2.5 w-2.5" />
                  <span className="truncate">{p.location}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <div className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  ₹{p.pricePerKg}<span className="text-[10px] font-normal text-slate-400">/kg</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p, 1);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 active:scale-90 transition-all"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Rated Local Farmers */}
      <div>
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
          Verified Local Producers
        </h3>
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop"
              alt="Rajesh Kumar"
              className="h-11 w-11 rounded-full object-cover border-2 border-emerald-500"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Rajesh Kumar</span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="text-[10px] text-slate-500">Annapurna Organic Farms • Nashik</div>
              <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>4.9 (38 Reviews)</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen('marketplace')}
            className="rounded-lg border border-emerald-600 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50"
          >
            View Crops
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 9: MARKETPLACE SCREEN
// ==========================================
export const MarketplaceScreen: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedProduct,
    setCurrentScreen,
    addToCart,
    toggleWishlist,
    wishlist,
  } = useMarketplace();

  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating'>('newest');

  // Filtered & sorted products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === Number(selectedCategory);
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      {/* Top header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Marketplace Catalog
        </h1>
        <span className="text-xs font-mono text-slate-500 font-bold">
          {filteredProducts.length} Listings
        </span>
      </div>

      {/* Search & Sort Controls */}
      <div className="space-y-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search produce name, grade, location..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white shadow-sm focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* Sort and Category Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            All Crops
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === c.id
                  ? 'bg-emerald-700 text-white shadow'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredProducts.map((p) => {
          const isWishlisted = wishlist.some((w) => w.id === p.id);
          return (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProduct(p);
                setCurrentScreen('product_details');
              }}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm hover:border-emerald-500 cursor-pointer transition-all"
            >
              <img
                src={p.primaryImage}
                alt={p.name}
                className="h-24 w-24 rounded-xl object-cover bg-emerald-50 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {p.qualityGrade}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{p.name}</h3>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{p.rating || 4.8}</span>
                  </span>
                  <span>•</span>
                  <span className="truncate">{p.location}</span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="font-mono text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                    ₹{p.pricePerKg} <span className="text-[10px] font-normal text-slate-400">/kg</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p, 1);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-600 active:scale-95"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 10: PRODUCT DETAILS SCREEN
// ==========================================
export const ProductDetailsScreen: React.FC = () => {
  const { selectedProduct, addToCart, setCurrentScreen, goBack } = useMarketplace();
  const [qty, setQty] = useState(5);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="flex min-h-full items-center justify-center p-6 text-center">
        <button onClick={goBack} className="text-xs font-bold text-emerald-600">
          ← Back to Marketplace
        </button>
      </div>
    );
  }

  const handleAddToCart = async () => {
    await addToCart(selectedProduct, qty);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-slate-900 transition-colors overflow-y-auto pb-24">
      {/* Product Image Banner */}
      <div className="relative h-64 w-full bg-slate-900">
        <img
          src={selectedProduct.primaryImage}
          alt={selectedProduct.name}
          className="h-full w-full object-cover"
        />
        <button
          onClick={goBack}
          className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm"
        >
          ←
        </button>
        <span className="absolute bottom-4 left-4 rounded-lg bg-emerald-700 px-3 py-1 text-xs font-bold text-white shadow">
          {selectedProduct.qualityGrade}
        </span>
      </div>

      <div className="p-5 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedProduct.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>{selectedProduct.location}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                <Star className="h-3 w-3 fill-amber-400" />
                <span>{selectedProduct.rating || 4.8} ({selectedProduct.reviewCount || 16})</span>
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
              ₹{selectedProduct.pricePerKg}
            </div>
            <div className="text-[10px] text-slate-400">per kilogram</div>
          </div>
        </div>

        {/* Farmer Profile Card */}
        <div className="my-4 flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop"
              alt="Farmer"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Rajesh Kumar</span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="text-[10px] text-slate-500">Organic Valley Farm • 14 yrs exp</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('individual_chat')}
            className="rounded-lg bg-emerald-600/10 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/20"
          >
            Chat / Bargain
          </button>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
            Produce Details
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedProduct.description ||
              'Naturally harvested directly from organic fields. Zero chemical ripening agents or preservative sprays.'}
          </p>
        </div>

        {/* Available Stock & Harvest Details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono">
          <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2.5">
            <div className="text-[10px] text-slate-400 font-sans">Available Stock</div>
            <div className="font-bold text-slate-900 dark:text-white">{selectedProduct.availableQuantity} kg</div>
          </div>
          <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2.5">
            <div className="text-[10px] text-slate-400 font-sans">Harvest Date</div>
            <div className="font-bold text-slate-900 dark:text-white">{selectedProduct.harvestDate}</div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Order Quantity (kg):
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 font-bold"
            >
              -
            </button>
            <span className="font-mono text-sm font-bold">{qty} kg</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="sticky bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 flex items-center gap-3 backdrop-blur-md">
        <div className="min-w-[80px]">
          <div className="text-[10px] text-slate-400">Total Price</div>
          <div className="text-lg font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
            ₹{selectedProduct.pricePerKg * qty}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-600 active:scale-95"
        >
          {addedNotice ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          <span>{addedNotice ? 'Added to Cart!' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 11: ADD PRODUCT SCREEN (FARMER)
// ==========================================
export const AddProductScreen: React.FC = () => {
  const { categories, addProduct, setCurrentScreen } = useMarketplace();
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '1',
    description: '',
    pricePerKg: '',
    availableQuantity: '',
    qualityGrade: 'Grade A',
    harvestDate: new Date().toISOString().split('T')[0],
    location: 'Nashik, Maharashtra',
    primaryImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=400&fit=crop',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const sampleImages = [
    { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=400&fit=crop' },
    { label: 'Onions', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&h=400&fit=crop' },
    { label: 'Mangoes', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&h=400&fit=crop' },
    { label: 'Wheat', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=400&fit=crop' },
    { label: 'Cardamom', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=400&fit=crop' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.pricePerKg || !formData.availableQuantity) {
      setMsg('Please fill in produce name, price, and stock quantity.');
      return;
    }

    setIsLoading(true);
    const res = await addProduct(formData);
    setIsLoading(false);
    if (res.success) {
      setMsg('Product listed on AgriSmart marketplace!');
      setTimeout(() => setCurrentScreen('farmer_dashboard'), 800);
    } else {
      setMsg(res.message);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-slate-900 p-5 transition-colors overflow-y-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">List New Produce</h1>
          <p className="text-xs text-slate-500">Directly connect with 10,000+ buyers</p>
        </div>
        <button
          onClick={() => setCurrentScreen('farmer_dashboard')}
          className="text-xs font-semibold text-slate-400 hover:text-slate-200"
        >
          Cancel
        </button>
      </div>

      {msg && (
        <div className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 p-3 text-xs text-emerald-700 dark:text-emerald-300 border border-emerald-200">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Produce Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Organic Bell Peppers"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Quality Grade
            </label>
            <select
              value={formData.qualityGrade}
              onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
            >
              <option value="Grade A">Grade A</option>
              <option value="Grade A (Export)">Grade A (Export)</option>
              <option value="Organic Certified">Organic Certified</option>
              <option value="Grade B">Grade B</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Price per Kg (₹) *
            </label>
            <input
              type="number"
              value={formData.pricePerKg}
              onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
              placeholder="e.g. 45"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Available Quantity (kg) *
            </label>
            <input
              type="number"
              value={formData.availableQuantity}
              onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
              placeholder="e.g. 300"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Image Selection / Preview */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Produce Image
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {sampleImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData({ ...formData, primaryImage: img.url })}
                className={`relative shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  formData.primaryImage === img.url ? 'border-emerald-500 scale-105' : 'border-transparent opacity-70'
                }`}
              >
                <img src={img.url} alt={img.label} className="h-14 w-14 object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center">
                  {img.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Detailed Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Mention soil type, harvest freshness, packing size..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading ? 'Publishing...' : 'Publish to Marketplace'}
        </button>
      </form>
    </div>
  );
};
