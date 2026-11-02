import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../agrismart_db.json');

// Persistent JSON Storage Engine
interface DBStore {
  users: any[];
  farmer_profiles: any[];
  customer_profiles: any[];
  categories: any[];
  products: any[];
  product_images: any[];
  orders: any[];
  order_items: any[];
  payments: any[];
  cart_items: any[];
  wishlist: any[];
  reviews: any[];
  conversations: any[];
  messages: any[];
  notifications: any[];
  sales_history: any[];
  market_prices: any[];
  demand_predictions: any[];
  price_predictions: any[];
  ai_chat_history: any[];
  moderation_reports: any[];
  platform_activities: any[];
}

function loadDB(): DBStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (!parsed.moderation_reports) parsed.moderation_reports = [];
      if (!parsed.platform_activities) parsed.platform_activities = [];
      return parsed;
    }
  } catch (err) {
    console.warn('Error reading database file, initializing clean store:', err);
  }
  return {
    users: [],
    farmer_profiles: [],
    customer_profiles: [],
    categories: [],
    products: [],
    product_images: [],
    orders: [],
    order_items: [],
    payments: [],
    cart_items: [],
    wishlist: [],
    reviews: [],
    conversations: [],
    messages: [],
    notifications: [],
    sales_history: [],
    market_prices: [],
    demand_predictions: [],
    price_predictions: [],
    ai_chat_history: [],
    moderation_reports: [],
    platform_activities: [],
  };
}

let dbCache: DBStore = loadDB();

function saveDB(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// Generic Model Base Class
function matchesWhere(item: any, where: any): boolean {
  if (!where) return true;
  
  // Handle Symbol keys like Op.or
  const symbols = Object.getOwnPropertySymbols(where);
  for (const sym of symbols) {
    if (sym.toString().includes('or') && Array.isArray(where[sym])) {
      const orConditions: any[] = where[sym];
      const anyMatch = orConditions.some((cond) => matchesWhere(item, cond));
      if (!anyMatch) return false;
    }
  }

  // Handle standard string keys
  for (const key of Object.keys(where)) {
    if (where[key] !== undefined && item[key] !== where[key]) {
      return false;
    }
  }
  return true;
}

// Generic Model Base Class
class ModelBase {
  static tableName: keyof DBStore;

  static async count(options?: any): Promise<number> {
    const list = dbCache[this.tableName] || [];
    return list.length;
  }

  static async findAll(options?: any): Promise<any[]> {
    let list = [...(dbCache[this.tableName] || [])];
    if (options?.where) {
      list = list.filter((item) => matchesWhere(item, options.where));
    }
    if (options?.order) {
      // simple order support
      const [col, dir] = options.order[0] || ['id', 'ASC'];
      list.sort((a, b) => {
        if (dir?.toUpperCase() === 'DESC') {
          return a[col] < b[col] ? 1 : -1;
        }
        return a[col] > b[col] ? 1 : -1;
      });
    }
    if (options?.limit) {
      list = list.slice(0, options.limit);
    }
    return list.map((item) => new (this as any)(item));
  }

  static async findAndCountAll(options?: any): Promise<{ count: number; rows: any[] }> {
    let list = [...(dbCache[this.tableName] || [])];
    const page = options?.offset ? Math.floor(options.offset / (options.limit || 20)) + 1 : 1;
    const limit = options?.limit || 20;

    if (options?.where) {
      list = list.filter((item) => matchesWhere(item, options.where));
    }

    const count = list.length;
    const offset = (page - 1) * limit;
    const rows = list.slice(offset, offset + limit).map((it) => new (this as any)(it));
    return { count, rows };
  }

  static async findByPk(id: number | string, options?: any): Promise<any | null> {
    const list = dbCache[this.tableName] || [];
    const found = list.find((it) => String(it.id) === String(id));
    return found ? new (this as any)(found) : null;
  }

  static async findOne(options?: any): Promise<any | null> {
    const list = dbCache[this.tableName] || [];
    const found = list.find((item) => matchesWhere(item, options?.where));
    return found ? new (this as any)(found) : null;
  }

  static async create(data: any): Promise<any> {
    const list = dbCache[this.tableName] || [];
    const maxId = list.reduce((m, it) => Math.max(m, it.id || 0), 0);
    const newRecord = {
      ...data,
      id: data.id || maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.push(newRecord);
    dbCache[this.tableName] = list;
    saveDB();
    return new (this as any)(newRecord);
  }

  static async bulkCreate(records: any[]): Promise<any[]> {
    const results = [];
    for (const r of records) {
      results.push(await this.create(r));
    }
    return results;
  }

  static async update(values: any, options: any): Promise<[number]> {
    const list = dbCache[this.tableName] || [];
    let count = 0;
    list.forEach((item, idx) => {
      if (options?.where) {
        let match = true;
        for (const key of Object.keys(options.where)) {
          if (item[key] !== options.where[key]) match = false;
        }
        if (match) {
          list[idx] = { ...item, ...values, updatedAt: new Date().toISOString() };
          count++;
        }
      }
    });
    dbCache[this.tableName] = list;
    saveDB();
    return [count];
  }

  static async destroy(options: any): Promise<number> {
    const list = dbCache[this.tableName] || [];
    const origLen = list.length;
    dbCache[this.tableName] = list.filter((item) => {
      if (options?.where) {
        for (const key of Object.keys(options.where)) {
          if (item[key] === options.where[key]) return false;
        }
      }
      return true;
    });
    saveDB();
    return origLen - dbCache[this.tableName].length;
  }

  constructor(data: any) {
    Object.assign(this, data);
  }

  async save(): Promise<this> {
    const table = (this.constructor as any).tableName as keyof DBStore;
    const list = dbCache[table] || [];
    const idx = list.findIndex((it) => it.id === (this as any).id);
    if (idx >= 0) {
      list[idx] = { ...this, updatedAt: new Date().toISOString() };
      dbCache[table] = list;
      saveDB();
    }
    return this;
  }

  async destroy(): Promise<void> {
    const table = (this.constructor as any).tableName as keyof DBStore;
    const list = dbCache[table] || [];
    dbCache[table] = list.filter((it) => it.id !== (this as any).id);
    saveDB();
  }

  toJSON(): any {
    return { ...this };
  }
}

// 20 Models
export class User extends ModelBase {
  static override tableName: keyof DBStore = 'users';
  id!: number;
  name!: string;
  email!: string;
  mobile!: string;
  password!: string;
  role!: 'farmer' | 'customer' | 'admin';
  state!: string;
  city!: string;
  address!: string;
  isVerified!: boolean;
  profileImage!: string;
  farmerProfile?: any;
  customerProfile?: any;
}

export class FarmerProfile extends ModelBase {
  static override tableName: keyof DBStore = 'farmer_profiles';
  id!: number;
  userId!: number;
  farmName!: string;
  farmLocation!: string;
  availableProducts!: string;
  farmingExperience!: number;
  verificationStatus!: string;
  rating!: number;
  reviewCount!: number;
  totalSalesKg!: number;
}

export class CustomerProfile extends ModelBase {
  static override tableName: keyof DBStore = 'customer_profiles';
  id!: number;
  userId!: number;
  name!: string;
  mobile!: string;
  email!: string;
  address!: string;
  city!: string;
  state!: string;
  totalOrders!: number;
}

export class Category extends ModelBase {
  static override tableName: keyof DBStore = 'categories';
  id!: number;
  name!: string;
  slug!: string;
  icon!: string;
  description!: string;
}

export class Product extends ModelBase {
  static override tableName: keyof DBStore = 'products';
  id!: number;
  farmerId!: number;
  categoryId!: number;
  name!: string;
  description!: string;
  pricePerKg!: number;
  availableQuantity!: number;
  unit!: string;
  qualityGrade!: string;
  harvestDate!: string;
  location!: string;
  isAvailable!: boolean;
  views!: number;
  salesCount!: number;
  rating!: number;
  reviewCount!: number;
  primaryImage!: string;
}

export class ProductImage extends ModelBase {
  static override tableName: keyof DBStore = 'product_images';
  id!: number;
  productId!: number;
  imageUrl!: string;
  isPrimary!: boolean;
}

export class Order extends ModelBase {
  static override tableName: keyof DBStore = 'orders';
  id!: number;
  orderNumber!: string;
  customerId!: number;
  farmerId!: number;
  totalAmount!: number;
  status!: string;
  deliveryAddress!: string;
  paymentMethod!: string;
  paymentStatus!: string;
  itemsJson!: string;
  customerName!: string;
  customerMobile!: string;
}

export class OrderItem extends ModelBase {
  static override tableName: keyof DBStore = 'order_items';
  id!: number;
  orderId!: number;
  productId!: number;
  productName!: string;
  quantity!: number;
  unitPrice!: number;
  subtotal!: number;
}

export class Payment extends ModelBase {
  static override tableName: keyof DBStore = 'payments';
  id!: number;
  orderId!: number;
  paymentId!: string;
  amount!: number;
  currency!: string;
  status!: string;
  method!: string;
  razorpayOrderId!: string;
  signature!: string;
}

export class CartItem extends ModelBase {
  static override tableName: keyof DBStore = 'cart_items';
  id!: number;
  userId!: number;
  productId!: number;
  quantity!: number;
  product?: any;
}

export class Wishlist extends ModelBase {
  static override tableName: keyof DBStore = 'wishlist';
  id!: number;
  userId!: number;
  productId!: number;
  product?: any;
}

export class Review extends ModelBase {
  static override tableName: keyof DBStore = 'reviews';
  id!: number;
  productId!: number;
  userId!: number;
  userName!: string;
  rating!: number;
  comment!: string;
}

export class Conversation extends ModelBase {
  static override tableName: keyof DBStore = 'conversations';
  id!: number;
  farmerId!: number;
  customerId!: number;
  productId!: number;
  lastMessage!: string;
  lastMessageAt!: any;
}

export class Message extends ModelBase {
  static override tableName: keyof DBStore = 'messages';
  id!: number;
  conversationId!: number;
  senderId!: number;
  text!: string;
  isOffer!: boolean;
  offerPrice!: number;
  isRead!: boolean;
}

export class Notification extends ModelBase {
  static override tableName: keyof DBStore = 'notifications';
  id!: number;
  userId!: number;
  title!: string;
  message!: string;
  type!: string;
  isRead!: boolean;
}

export class SalesHistory extends ModelBase {
  static override tableName: keyof DBStore = 'sales_history';
  id!: number;
  farmerId!: number;
  productId!: number;
  quantityKg!: number;
  totalRevenue!: number;
  saleDate!: string;
}

export class MarketPrice extends ModelBase {
  static override tableName: keyof DBStore = 'market_prices';
  id!: number;
  cropName!: string;
  mandiName!: string;
  state!: string;
  minPrice!: number;
  maxPrice!: number;
  modalPrice!: number;
  reportDate!: string;
}

export class DemandPrediction extends ModelBase {
  static override tableName: keyof DBStore = 'demand_predictions';
  id!: number;
  cropName!: string;
  region!: string;
  demandScore!: number;
  demandLevel!: string;
  predictedTrend!: string;
}

export class PricePrediction extends ModelBase {
  static override tableName: keyof DBStore = 'price_predictions';
  id!: number;
  cropName!: string;
  currentMandi!: number;
  predicted7d!: number;
  priceDeltaPercent!: number;
  confidenceScore!: number;
  recommendedWindow!: string;
}

export class AIChatHistory extends ModelBase {
  static override tableName: keyof DBStore = 'ai_chat_history';
  id!: number;
  userId!: number;
  userRole!: string;
  userMessage!: string;
  aiResponse!: string;
  language!: string;
}

export class ModerationReport extends ModelBase {
  static override tableName: keyof DBStore = 'moderation_reports';
  id!: number;
  reportType!: 'product' | 'user' | 'order';
  targetId!: number;
  targetTitle!: string;
  reporterId!: number;
  reporterName!: string;
  reason!: string;
  status!: 'pending' | 'resolved' | 'dismissed';
  notes?: string;
  createdAt!: string;
}

export class PlatformActivity extends ModelBase {
  static override tableName: keyof DBStore = 'platform_activities';
  id!: number;
  type!: 'order_placed' | 'user_registered' | 'verification_request' | 'product_listed' | 'payment_captured' | 'report_filed';
  title!: string;
  description!: string;
  actorName!: string;
  timestamp!: string;
}

// Database Seeder
export async function initDatabase(): Promise<void> {
  const catCount = await Category.count();
  if (catCount === 0) {
    console.log('🌱 Seeding AgriSmart database tables with realistic agricultural records...');

    await Category.bulkCreate([
      { name: 'Vegetables', slug: 'vegetables', icon: 'Carrot', description: 'Fresh seasonal farm vegetables' },
      { name: 'Fruits', slug: 'fruits', icon: 'Apple', description: 'Orchard-picked fresh sweet fruits' },
      { name: 'Grains', slug: 'grains', icon: 'Wheat', description: 'Paddy, Wheat, Millets, and Maize' },
      { name: 'Pulses', slug: 'pulses', icon: 'Layers', description: 'High-protein lentils, dal, and beans' },
      { name: 'Spices', slug: 'spices', icon: 'Flame', description: 'Authentic Indian whole spices and herbs' },
      { name: 'Organic Products', slug: 'organic', icon: 'Leaf', description: 'Certified chemical-free bio produce' },
      { name: 'Other Agricultural Products', slug: 'others', icon: 'Boxes', description: 'Honey, Jaggery, Seeds, and Compost' },
    ]);

    const farmerPassword = await bcrypt.hash('Farmer@123', 10);
    const customerPassword = await bcrypt.hash('Customer@123', 10);
    const adminPassword = await bcrypt.hash('Admin@123', 10);

    const farmer1 = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh.farmer@agrismart.com',
      mobile: '9876543210',
      password: farmerPassword,
      role: 'farmer',
      state: 'Maharashtra',
      city: 'Nashik',
      address: 'Plot 42, Dindori Farm Road, Nashik',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop',
    });

    await FarmerProfile.create({
      userId: farmer1.id,
      farmName: 'Annapurna Organic Farms',
      farmLocation: 'Dindori, Nashik (Maharashtra)',
      availableProducts: 'Tomatoes, Red Onions, Seedless Grapes, Wheat',
      farmingExperience: 14,
      verificationStatus: 'verified',
      rating: 4.9,
      reviewCount: 38,
      totalSalesKg: 3200,
    });

    const farmer2 = await User.create({
      name: 'Suresh Patel',
      email: 'suresh.patel@agrismart.com',
      mobile: '9822334455',
      password: farmerPassword,
      role: 'farmer',
      state: 'Gujarat',
      city: 'Surat',
      address: 'Village Olpad, Surat District',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    });

    await FarmerProfile.create({
      userId: farmer2.id,
      farmName: 'Surat Agro Greens',
      farmLocation: 'Olpad, Surat (Gujarat)',
      availableProducts: 'Alphonso Mangoes, Organic Jaggery, Cumin',
      farmingExperience: 9,
      verificationStatus: 'verified',
      rating: 4.8,
      reviewCount: 22,
      totalSalesKg: 1850,
    });

    const customer1 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.customer@agrismart.com',
      mobile: '9123456789',
      password: customerPassword,
      role: 'customer',
      state: 'Maharashtra',
      city: 'Mumbai',
      address: 'Flat 402, Green Heights, Andheri West, Mumbai',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    });

    await CustomerProfile.create({
      userId: customer1.id,
      name: 'Priya Sharma',
      mobile: '9123456789',
      email: 'priya.customer@agrismart.com',
      address: 'Flat 402, Green Heights, Andheri West, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      totalOrders: 6,
    });

    await User.create({
      name: 'System Administrator',
      email: 'admin@agrismart.com',
      mobile: '9999988888',
      password: adminPassword,
      role: 'admin',
      state: 'Delhi',
      city: 'New Delhi',
      address: 'Krishi Bhavan, New Delhi',
      isVerified: true,
    });

    const p1 = await Product.create({
      farmerId: farmer1.id,
      categoryId: 1,
      name: 'Fresh Farm Vine Tomatoes',
      description: 'Naturally ripened, pesticide-free fresh red vine tomatoes. Rich in Lycopene and vitamin C, harvested directly from Dindori fields.',
      pricePerKg: 32,
      availableQuantity: 450,
      unit: 'kg',
      qualityGrade: 'Grade A',
      harvestDate: '2026-11-01',
      location: 'Nashik, Maharashtra',
      isAvailable: true,
      views: 340,
      salesCount: 120,
      rating: 4.8,
      reviewCount: 16,
      primaryImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=400&fit=crop',
    });

    const p2 = await Product.create({
      farmerId: farmer1.id,
      categoryId: 1,
      name: 'Nashik Red Onions (Export Quality)',
      description: 'Crisp, pungent Grade A export-quality red onions from the onion capital of India. Long shelf life of over 90 days with dry husk.',
      pricePerKg: 28,
      availableQuantity: 1200,
      unit: 'kg',
      qualityGrade: 'Grade A (Export)',
      harvestDate: '2026-10-28',
      location: 'Nashik, Maharashtra',
      isAvailable: true,
      views: 520,
      salesCount: 380,
      rating: 4.9,
      reviewCount: 24,
      primaryImage: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&h=400&fit=crop',
    });

    const p3 = await Product.create({
      farmerId: farmer2.id,
      categoryId: 2,
      name: 'Fresh Alphonso Mangoes (Carbide Free)',
      description: 'Hand-picked GI tagged Alphonso mangoes. Naturally tree-ripened with zero chemical ripening agents. Incomparable sweetness and aroma.',
      pricePerKg: 180,
      availableQuantity: 280,
      unit: 'kg',
      qualityGrade: 'Organic Certified',
      harvestDate: '2026-10-31',
      location: 'Surat, Gujarat',
      isAvailable: true,
      views: 710,
      salesCount: 210,
      rating: 5.0,
      reviewCount: 31,
      primaryImage: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&h=400&fit=crop',
    });

    const p4 = await Product.create({
      farmerId: farmer1.id,
      categoryId: 3,
      name: 'Traditional Sharbati Golden Wheat',
      description: 'Premium Sehore Sharbati wheat grains, naturally heavy and golden textured. Makes exceptionally soft rotis with high dietary fiber.',
      pricePerKg: 42,
      availableQuantity: 2500,
      unit: 'kg',
      qualityGrade: 'Grade A',
      harvestDate: '2026-10-15',
      location: 'Nashik, Maharashtra',
      isAvailable: true,
      views: 290,
      salesCount: 650,
      rating: 4.7,
      reviewCount: 19,
      primaryImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=400&fit=crop',
    });

    const p5 = await Product.create({
      farmerId: farmer2.id,
      categoryId: 5,
      name: 'Whole Green Cardamom (8mm Bold)',
      description: 'Single-origin green cardamom pods grown with organic composting. High essential oil concentration with intense natural fragrance.',
      pricePerKg: 1650,
      availableQuantity: 45,
      unit: 'kg',
      qualityGrade: 'Organic Certified',
      harvestDate: '2026-10-20',
      location: 'Surat, Gujarat',
      isAvailable: true,
      views: 410,
      salesCount: 28,
      rating: 4.9,
      reviewCount: 14,
      primaryImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=400&fit=crop',
    });

    const p6 = await Product.create({
      farmerId: farmer1.id,
      categoryId: 6,
      name: 'Organic Desi Cow Ghee (A2 Bilona)',
      description: 'Artisanal clarified butter prepared via Vedic Bilona method from free-grazing Gir cows. Unadulterated, granular texture, rich in vitamins.',
      pricePerKg: 1200,
      availableQuantity: 80,
      unit: 'kg',
      qualityGrade: 'Organic Certified',
      harvestDate: '2026-10-29',
      location: 'Nashik, Maharashtra',
      isAvailable: true,
      views: 630,
      salesCount: 95,
      rating: 5.0,
      reviewCount: 22,
      primaryImage: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&h=400&fit=crop',
    });

    await Review.create({
      productId: p1.id,
      userId: customer1.id,
      userName: 'Priya Sharma',
      rating: 5,
      comment: 'Super fresh tomatoes! Delivered directly from Rajesh Ji’s farm in Nashik within 24 hours. The flavor is ten times better than supermarket stock.',
    });

    const order1 = await Order.create({
      orderNumber: 'AGRI-2026-8841',
      customerId: customer1.id,
      farmerId: farmer1.id,
      totalAmount: 480,
      status: 'confirmed',
      deliveryAddress: 'Flat 402, Green Heights, Andheri West, Mumbai',
      paymentMethod: 'Simulated Razorpay / UPI',
      paymentStatus: 'paid',
      itemsJson: JSON.stringify([
        { productId: p1.id, name: 'Fresh Farm Vine Tomatoes', quantity: 5, pricePerKg: 32 },
        { productId: p2.id, name: 'Nashik Red Onions', quantity: 10, pricePerKg: 28 },
      ]),
      customerName: 'Priya Sharma',
      customerMobile: '9123456789',
    });

    await OrderItem.create({
      orderId: order1.id,
      productId: p1.id,
      productName: 'Fresh Farm Vine Tomatoes',
      quantity: 5,
      unitPrice: 32,
      subtotal: 160,
    });

    await OrderItem.create({
      orderId: order1.id,
      productId: p2.id,
      productName: 'Nashik Red Onions',
      quantity: 10,
      unitPrice: 28,
      subtotal: 280,
    });

    await Payment.create({
      orderId: order1.id,
      paymentId: 'pay_rzp_mock_8841',
      amount: 480,
      currency: 'INR',
      status: 'captured',
      method: 'UPI (GPay / PhonePe)',
      razorpayOrderId: 'order_rzp_mock_8841',
      signature: 'mock_sig_9921_valid',
    });

    await Notification.bulkCreate([
      { userId: farmer1.id, title: 'Price Spike Alert!', message: 'Vine tomato prices in Mumbai APMC increased by +18% today. Good time to list harvest.', type: 'price_alert', isRead: false },
      { userId: customer1.id, title: 'Order Confirmed', message: 'Your farm order #AGRI-2026-8841 is confirmed by Rajesh Kumar and packed for dispatch.', type: 'order_update', isRead: false },
      { userId: farmer1.id, title: 'New Customer Order', message: 'Priya Sharma placed an order for 5kg Tomatoes & 10kg Onions.', type: 'order_update', isRead: true },
    ]);

    const conv = await Conversation.create({
      farmerId: farmer1.id,
      customerId: customer1.id,
      productId: p1.id,
      lastMessage: 'Sure Priya Ji, I will pack freshly picked tomatoes tomorrow morning!',
      lastMessageAt: new Date(),
    });

    await Message.bulkCreate([
      { conversationId: conv.id, senderId: customer1.id, text: 'Namaste Rajesh Ji! Are these vine tomatoes fully ripe or semi-ripe?', isOffer: false, isRead: true },
      { conversationId: conv.id, senderId: farmer1.id, text: 'Namaste! They are vine-ripened with natural sunlight, perfect firmness for 5-6 days storage.', isOffer: false, isRead: true },
      { conversationId: conv.id, senderId: customer1.id, text: 'Can you give 20kg at ₹29/kg for our family society?', isOffer: true, offerPrice: 29, isRead: true },
      { conversationId: conv.id, senderId: farmer1.id, text: 'Sure Priya Ji, offer accepted! I will pack freshly picked tomatoes tomorrow morning!', isOffer: false, isRead: true },
    ]);

    console.log('✅ Persistent database initialized and populated with all 20 tables & seed data!');
  }

  // Ensure Admin Moderation Reports & Historical Orders for Analytics
  await seedAnalyticsAndAdminRecords();
}

async function seedAnalyticsAndAdminRecords(): Promise<void> {
  const reportCount = await ModerationReport.count();
  if (reportCount === 0) {
    console.log('📊 Seeding Platform Activities & Moderation Reports for Admin Dashboard...');
    await ModerationReport.bulkCreate([
      {
        reportType: 'product',
        targetId: 4,
        targetTitle: 'Traditional Sharbati Golden Wheat',
        reporterId: 3,
        reporterName: 'Priya Sharma',
        reason: 'Requested verification of organic moisture content certificate and APMC lab tag.',
        status: 'pending',
        notes: '',
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
      {
        reportType: 'user',
        targetId: 2,
        targetTitle: 'Suresh Patel (Surat Organic Farm)',
        reporterId: 3,
        reporterName: 'Green Society Mumbai',
        reason: 'Inquiry regarding organic certification validity date for bulk wholesale shipment.',
        status: 'resolved',
        notes: 'Certificate audited and verified valid with Gujarat State Organic Certification Agency (GSOCA) until 2028.',
        createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
      },
    ]);
  }

  const activityCount = await PlatformActivity.count();
  if (activityCount === 0) {
    await PlatformActivity.bulkCreate([
      {
        type: 'order_placed',
        title: 'New Order #AGRI-2026-8922',
        description: 'Priya Sharma placed an order for 10kg Vine Tomatoes (₹320)',
        actorName: 'Priya Sharma',
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
      },
      {
        type: 'payment_captured',
        title: 'UPI Payment Confirmed',
        description: 'Payment of ₹480 captured for Order #AGRI-2026-8841 via simulated Razorpay',
        actorName: 'Razorpay Gateway',
        timestamp: new Date(Date.now() - 140 * 60000).toISOString(),
      },
      {
        type: 'verification_request',
        title: 'Farmer Verification Application',
        description: 'Suresh Patel submitted Land 7/12 extract and FSSAI certificate for organic Alphonso orchard',
        actorName: 'Suresh Patel',
        timestamp: new Date(Date.now() - 18 * 3600000).toISOString(),
      },
      {
        type: 'product_listed',
        title: 'New Listing Published',
        description: 'Rajesh Kumar listed 450kg of Fresh Farm Vine Tomatoes at ₹32/kg',
        actorName: 'Rajesh Kumar',
        timestamp: new Date(Date.now() - 28 * 3600000).toISOString(),
      },
      {
        type: 'user_registered',
        title: 'New Farmer Onboarded',
        description: 'Vikas Shinde registered from Sangli, Maharashtra (Sugarcane & Grapes)',
        actorName: 'Vikas Shinde',
        timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
      },
    ]);
  }

  // Ensure rich orders history for realistic farmer revenue, product-wise sales, and status distribution
  const orderCount = await Order.count();
  if (orderCount < 4) {
    console.log('📈 Seeding historical orders across dates for realistic Analytics charts...');
    const now = Date.now();
    const dayMs = 86400000;

    const historicalOrders = [
      {
        orderNumber: 'AGRI-2026-8790',
        customerId: 3,
        farmerId: 1,
        totalAmount: 1260,
        status: 'delivered',
        deliveryAddress: 'Flat 402, Green Heights, Andheri West, Mumbai',
        paymentMethod: 'Simulated Razorpay / UPI',
        paymentStatus: 'paid',
        itemsJson: JSON.stringify([
          { productId: 4, name: 'Traditional Sharbati Golden Wheat', quantity: 30, pricePerKg: 42 },
        ]),
        customerName: 'Priya Sharma',
        customerMobile: '9123456789',
        createdAt: new Date(now - 3 * dayMs).toISOString(),
      },
      {
        orderNumber: 'AGRI-2026-8742',
        customerId: 3,
        farmerId: 1,
        totalAmount: 2400,
        status: 'delivered',
        deliveryAddress: 'Flat 402, Green Heights, Andheri West, Mumbai',
        paymentMethod: 'Simulated Razorpay / UPI',
        paymentStatus: 'paid',
        itemsJson: JSON.stringify([
          { productId: 6, name: 'Organic Desi Cow Ghee (A2 Bilona)', quantity: 2, pricePerKg: 1200 },
        ]),
        customerName: 'Priya Sharma',
        customerMobile: '9123456789',
        createdAt: new Date(now - 6 * dayMs).toISOString(),
      },
      {
        orderNumber: 'AGRI-2026-8680',
        customerId: 3,
        farmerId: 1,
        totalAmount: 896,
        status: 'delivered',
        deliveryAddress: 'Flat 402, Green Heights, Andheri West, Mumbai',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'paid',
        itemsJson: JSON.stringify([
          { productId: 1, name: 'Fresh Farm Vine Tomatoes', quantity: 28, pricePerKg: 32 },
        ]),
        customerName: 'Priya Sharma',
        customerMobile: '9123456789',
        createdAt: new Date(now - 14 * dayMs).toISOString(),
      },
      {
        orderNumber: 'AGRI-2026-8550',
        customerId: 3,
        farmerId: 1,
        totalAmount: 1680,
        status: 'delivered',
        deliveryAddress: 'Flat 402, Green Heights, Andheri West, Mumbai',
        paymentMethod: 'Simulated Razorpay / UPI',
        paymentStatus: 'paid',
        itemsJson: JSON.stringify([
          { productId: 2, name: 'Nashik Red Onions (Export Quality)', quantity: 60, pricePerKg: 28 },
        ]),
        customerName: 'Priya Sharma',
        customerMobile: '9123456789',
        createdAt: new Date(now - 28 * dayMs).toISOString(),
      },
      {
        orderNumber: 'AGRI-2026-8902',
        customerId: 3,
        farmerId: 1,
        totalAmount: 760,
        status: 'processing',
        deliveryAddress: 'B-12, Palm Grove, Bandra, Mumbai',
        paymentMethod: 'Simulated Razorpay / UPI',
        paymentStatus: 'paid',
        itemsJson: JSON.stringify([
          { productId: 1, name: 'Fresh Farm Vine Tomatoes', quantity: 15, pricePerKg: 32 },
          { productId: 2, name: 'Nashik Red Onions (Export Quality)', quantity: 10, pricePerKg: 28 },
        ]),
        customerName: 'Priya Sharma',
        customerMobile: '9123456789',
        createdAt: new Date(now - 8 * 3600000).toISOString(),
      },
      {
        orderNumber: 'AGRI-2026-8922',
        customerId: 3,
        farmerId: 1,
        totalAmount: 320,
        status: 'pending',
        deliveryAddress: 'Flat 402, Green Heights, Andheri West, Mumbai',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'pending',
        itemsJson: JSON.stringify([
          { productId: 1, name: 'Fresh Farm Vine Tomatoes', quantity: 10, pricePerKg: 32 },
        ]),
        customerName: 'Priya Sharma',
        customerMobile: '9123456789',
        createdAt: new Date(now - 35 * 60000).toISOString(),
      },
      {
        orderNumber: 'AGRI-2026-8705',
        customerId: 3,
        farmerId: 1,
        totalAmount: 560,
        status: 'cancelled',
        deliveryAddress: 'Flat 402, Green Heights, Andheri West, Mumbai',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'refunded',
        itemsJson: JSON.stringify([
          { productId: 2, name: 'Nashik Red Onions (Export Quality)', quantity: 20, pricePerKg: 28 },
        ]),
        customerName: 'Priya Sharma',
        customerMobile: '9123456789',
        createdAt: new Date(now - 18 * dayMs).toISOString(),
      },
      {
        orderNumber: 'AGRI-2026-8855',
        customerId: 3,
        farmerId: 2,
        totalAmount: 3600,
        status: 'delivered',
        deliveryAddress: 'Flat 402, Green Heights, Andheri West, Mumbai',
        paymentMethod: 'Simulated Razorpay / UPI',
        paymentStatus: 'paid',
        itemsJson: JSON.stringify([
          { productId: 3, name: 'Fresh Alphonso Mangoes (Carbide Free)', quantity: 20, pricePerKg: 180 },
        ]),
        customerName: 'Priya Sharma',
        customerMobile: '9123456789',
        createdAt: new Date(now - 2 * dayMs).toISOString(),
      },
      {
        orderNumber: 'AGRI-2026-8890',
        customerId: 3,
        farmerId: 2,
        totalAmount: 4950,
        status: 'shipped',
        deliveryAddress: 'Flat 402, Green Heights, Andheri West, Mumbai',
        paymentMethod: 'Simulated Razorpay / UPI',
        paymentStatus: 'paid',
        itemsJson: JSON.stringify([
          { productId: 5, name: 'Whole Green Cardamom (8mm Bold)', quantity: 3, pricePerKg: 1650 },
        ]),
        customerName: 'Priya Sharma',
        customerMobile: '9123456789',
        createdAt: new Date(now - 1 * dayMs).toISOString(),
      },
    ];

    for (const ord of historicalOrders) {
      const createdOrd = await Order.create(ord);
      const items = JSON.parse(ord.itemsJson);
      for (const item of items) {
        await OrderItem.create({
          orderId: createdOrd.id,
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.pricePerKg,
          subtotal: item.quantity * item.pricePerKg,
        });
      }
      if (ord.paymentStatus === 'paid') {
        await Payment.create({
          orderId: createdOrd.id,
          paymentId: `pay_rzp_mock_${createdOrd.id}`,
          amount: ord.totalAmount,
          currency: 'INR',
          status: 'captured',
          method: ord.paymentMethod,
          razorpayOrderId: `order_rzp_mock_${createdOrd.id}`,
          signature: `mock_sig_${createdOrd.id}_valid`,
        });
      }
    }

    // Add extra reviews for rich customer feedback statistics
    await Review.create({
      productId: 2,
      userId: 3,
      userName: 'Priya Sharma',
      rating: 5,
      comment: 'Excellent export-grade Nashik onions. Very dry and properly cured, zero rotten pieces. Highly recommend Rajesh Ji.',
    });
    await Review.create({
      productId: 4,
      userId: 3,
      userName: 'Dr. Anand Verma',
      rating: 4,
      comment: 'Pure Sharbati wheat, great natural aroma and roti puffiness. Prompt delivery.',
    });
  }
}

