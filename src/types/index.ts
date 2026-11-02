export type UserRole = 'farmer' | 'customer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  state: string;
  city: string;
  address: string;
  isVerified?: boolean;
  profileImage?: string;
  farmerProfile?: FarmerProfile;
  customerProfile?: CustomerProfile;
}

export interface FarmerProfile {
  id?: number;
  userId?: number;
  farmName: string;
  farmLocation: string;
  availableProducts: string;
  farmingExperience: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  reviewCount: number;
  totalSalesKg: number;
  profileImage?: string;
}

export interface CustomerProfile {
  id?: number;
  userId?: number;
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  totalOrders: number;
  profileImage?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Product {
  id: number;
  farmerId: number;
  categoryId: number;
  name: string;
  description: string;
  pricePerKg: number;
  availableQuantity: number;
  unit: string;
  qualityGrade: 'Grade A (Export)' | 'Grade A' | 'Grade B' | 'Organic Certified';
  harvestDate: string;
  location: string;
  isAvailable: boolean;
  views: number;
  salesCount: number;
  rating: number;
  reviewCount: number;
  primaryImage: string;
  category?: Category;
  farmer?: {
    id: number;
    name: string;
    city: string;
    state: string;
    mobile?: string;
    farmerProfile?: FarmerProfile;
  };
  reviews?: Review[];
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  farmerId: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  paymentMethod: string;
  itemsJson: string;
  customerName: string;
  customerMobile: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'farmer' | 'customer';
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerPrice?: number;
}

export interface CropForecast {
  id: number;
  crop: string;
  hindiName: string;
  currentMandiPrice: number;
  predictedPrice7Days: number;
  directAgriSmartPrice: number;
  priceChangePercent: number;
  demandLevel: string;
  demandScore: number;
  recommendedAction: string;
  chartPoints: number[];
}

export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'welcome'
  | 'role_selection'
  | 'login'
  | 'register'
  | 'farmer_dashboard'
  | 'customer_dashboard'
  | 'marketplace'
  | 'product_details'
  | 'add_product'
  | 'ai_insights'
  | 'demand_forecast'
  | 'price_analytics'
  | 'ai_chatbot'
  | 'chat_list'
  | 'individual_chat'
  | 'orders'
  | 'order_details'
  | 'farmer_profile'
  | 'customer_profile'
  | 'notifications'
  | 'settings'
  | 'farmer_analytics'
  | 'admin_dashboard'
  | 'reports';

export interface FarmerAnalyticsData {
  timeRange: string;
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    averageOrderValue: number;
    averageRating: string;
    totalReviewsCount: number;
  };
  charts: {
    monthlyRevenue: { month: string; year: number; revenue: number; ordersCount: number }[];
    weeklySales: { day: string; date: string; revenue: number; kgSold: number; ordersCount: number }[];
    productWiseSales: {
      productId: number;
      productName: string;
      categoryName: string;
      unit: string;
      pricePerKg: number;
      kgSold: number;
      revenue: number;
      orderCount: number;
      stockRemaining: number;
      rating: number;
      primaryImage: string;
    }[];
    topSellingProducts: any[];
    orderStatusDistribution: { status: string; count: number; color: string; percentage: number }[];
    demandForecast: {
      crop: string;
      currentPrice: number;
      predicted7dPrice: number;
      priceChangePercent: number;
      demandScore: number;
      demandLevel: string;
      trajectory: number[];
      recommendedAction: string;
    }[];
  };
  reviews: {
    recentReviews: any[];
    ratingBreakdown: Record<number, number>;
  };
}

export interface AdminMetricsData {
  totalUsers: number;
  totalFarmers: number;
  totalCustomers: number;
  totalAdmins: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  completedTransactions: number;
  totalGMV: number;
  averageOrderValue: number;
  pendingVerifications: number;
  verifiedFarmers: number;
  rejectedVerifications: number;
  pendingReports: number;
  resolvedReports: number;
  topCategories: { name: string; icon: string; count: number; revenue: number }[];
  popularProducts: any[];
}

export interface VerificationRequest {
  farmerId: number;
  name: string;
  email: string;
  mobile: string;
  state: string;
  city: string;
  profileImage?: string;
  farmName: string;
  farmLocation: string;
  farmingExperience: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  totalSalesKg: number;
  documents: { name: string; verified: boolean }[];
}

export interface ModerationReportItem {
  id: number;
  reportType: 'product' | 'user' | 'order';
  targetId: number;
  targetTitle: string;
  reporterId: number;
  reporterName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  notes?: string;
  createdAt: string;
}

export interface PlatformActivityItem {
  id: number;
  type: string;
  title: string;
  description: string;
  actorName: string;
  timestamp: string;
}

export interface SalesReportData {
  reportId: string;
  generatedAt: string;
  generatedBy: string;
  role: string;
  timeRange: string;
  periodLabel: string;
  summary: {
    totalOrders: number;
    successfulOrdersCount: number;
    cancelledOrdersCount: number;
    grossRevenue: number;
    netFarmerEarnings: number;
    platformFee: number;
    mandiCessSavings: number;
    taxExemptionClause: string;
  };
  productBreakdown: { name: string; quantity: number; revenue: number; ordersCount: number }[];
  ordersAuditList: {
    orderNumber: string;
    date: string;
    customerName: string;
    amount: number;
    paymentMethod: string;
    status: string;
  }[];
}
