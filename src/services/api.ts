import { Product, Category, User, Order, Review, CropForecast } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('agrismart_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Auth
  async register(data: any): Promise<{ success: boolean; token?: string; user?: User; message: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(identifier: string, password: string): Promise<{ success: boolean; token?: string; user?: User; message: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },

  async getMe(): Promise<{ success: boolean; user?: User; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateProfile(data: any): Promise<{ success: boolean; user?: User; message: string }> {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async forgotPassword(identifier: string): Promise<{ success: boolean; message: string; demoOtp?: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    });
    return res.json();
  },

  // Marketplace
  async getCategories(): Promise<{ success: boolean; categories: Category[] }> {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  async getProducts(params?: {
    search?: string;
    categoryId?: string | number;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    sortBy?: string;
    farmerId?: number;
  }): Promise<{ success: boolean; products: Product[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.categoryId) query.set('categoryId', String(params.categoryId));
    if (params?.minPrice) query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice) query.set('maxPrice', String(params.maxPrice));
    if (params?.location) query.set('location', params.location);
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    if (params?.farmerId) query.set('farmerId', String(params.farmerId));

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return res.json();
  },

  async getProduct(id: number | string): Promise<{ success: boolean; product: Product; related?: Product[] }> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return res.json();
  },

  async addProduct(productData: any): Promise<{ success: boolean; product?: Product; message: string }> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return res.json();
  },

  async editProduct(id: number, productData: any): Promise<{ success: boolean; product?: Product; message: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return res.json();
  },

  async deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async postReview(productId: number, rating: number, comment: string): Promise<{ success: boolean; review?: Review; message: string }> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, rating, comment }),
    });
    return res.json();
  },

  async getWishlist(): Promise<{ success: boolean; products: Product[] }> {
    const res = await fetch(`${API_BASE}/wishlist`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async toggleWishlist(productId: number): Promise<{ success: boolean; inWishlist: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/wishlist/toggle`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId }),
    });
    return res.json();
  },

  async getOrders(): Promise<{ success: boolean; orders: Order[] }> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async placeOrder(orderData: {
    farmerId: number;
    totalAmount: number;
    deliveryAddress: string;
    items: any[];
    paymentMethod?: string;
  }): Promise<{ success: boolean; order?: Order; message: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return res.json();
  },

  async getFarmers(): Promise<{ success: boolean; farmers: any[] }> {
    const res = await fetch(`${API_BASE}/farmers`);
    return res.json();
  },

  // AI
  async chatWithAI(message: string, language: string = 'en'): Promise<{ success: boolean; reply: string; source?: string }> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language }),
    });
    return res.json();
  },

  async getAIForecast(): Promise<{ success: boolean; data: { marketSummary: any; cropForecasts: CropForecast[] } }> {
    const res = await fetch(`${API_BASE}/ai/forecast`);
    return res.json();
  },

  // Analytics & Reporting (Phase 8)
  async getFarmerAnalytics(timeRange: string = '30d'): Promise<{ success: boolean; overview: any; charts: any; reviews: any }> {
    const res = await fetch(`${API_BASE}/analytics/farmer/comprehensive?timeRange=${timeRange}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getSalesReport(timeRange: string = '30d', type: string = 'comprehensive'): Promise<{ success: boolean; report: any }> {
    const res = await fetch(`${API_BASE}/reports/sales?timeRange=${timeRange}&type=${type}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Admin Management & Security (Phase 8)
  async getAdminMetrics(): Promise<{ success: boolean; metrics: any }> {
    const res = await fetch(`${API_BASE}/admin/metrics`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getAdminVerifications(): Promise<{ success: boolean; verifications: any[] }> {
    const res = await fetch(`${API_BASE}/admin/verifications`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateFarmerVerification(farmerId: number, status: 'verified' | 'rejected' | 'pending', notes?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/verifications/${farmerId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    return res.json();
  },

  async getAdminReports(): Promise<{ success: boolean; reports: any[] }> {
    const res = await fetch(`${API_BASE}/admin/reports`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateModerationReport(reportId: number, status: 'resolved' | 'dismissed', notes?: string, action?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/reports/${reportId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes, action }),
    });
    return res.json();
  },

  async getAdminActivity(): Promise<{ success: boolean; activities: any[] }> {
    const res = await fetch(`${API_BASE}/admin/activity`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getAdminUsers(role?: string, search?: string): Promise<{ success: boolean; users: any[] }> {
    const params = new URLSearchParams();
    if (role) params.set('role', role);
    if (search) params.set('search', search);
    const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};
