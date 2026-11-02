import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  MessageSquare,
  Send,
  Image as ImageIcon,
  DollarSign,
  User,
  ShieldCheck,
  Star,
  Bell,
  Settings,
  ChevronRight,
  ArrowLeft,
  FileCode,
  Download,
  CreditCard,
  Check,
  RefreshCw,
  LogOut,
  Moon,
  Sun,
  Globe,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { Order, Product } from '../types';

// ==========================================
// SCREEN 16: CHAT LIST SCREEN
// ==========================================
export const ChatListScreen: React.FC = () => {
  const { user } = useAuth();
  const { setCurrentScreen, setSelectedConversationId } = useMarketplace();

  const dummyConversations = [
    {
      id: 1,
      partnerName: user?.role === 'farmer' ? 'Priya Sharma (Buyer)' : 'Rajesh Kumar (Farmer)',
      partnerFarm: user?.role === 'farmer' ? 'Andheri West, Mumbai' : 'Annapurna Organic Farm, Nashik',
      avatar: user?.role === 'farmer'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
        : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop',
      lastMessage: 'Sure Priya Ji, I will pack freshly picked tomatoes tomorrow morning!',
      time: '10:32 AM',
      unread: 1,
      cropTag: 'Vine Tomatoes',
    },
    {
      id: 2,
      partnerName: user?.role === 'farmer' ? 'Amit Deshmukh (Wholesale)' : 'Suresh Patel (Farmer)',
      partnerFarm: user?.role === 'farmer' ? 'Vashi Wholesale Market' : 'Surat Agro Greens, Gujarat',
      avatar: user?.role === 'farmer'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      lastMessage: 'Are Alphonso mangoes carbide-free certified?',
      time: 'Yesterday',
      unread: 0,
      cropTag: 'Alphonso Mangoes',
    },
  ];

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Direct Messaging
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Farmer & Buyer Chats
          </h1>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
          <MessageSquare className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-3">
        {dummyConversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => {
              setSelectedConversationId(conv.id);
              setCurrentScreen('individual_chat');
            }}
            className="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm hover:border-emerald-500 cursor-pointer transition-all"
          >
            <div className="relative">
              <img
                src={conv.avatar}
                alt={conv.partnerName}
                className="h-12 w-12 rounded-full object-cover border-2 border-emerald-500"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {conv.partnerName}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">{conv.time}</span>
              </div>

              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {conv.partnerFarm} • <span className="font-semibold text-amber-500">{conv.cropTag}</span>
              </div>

              <p className="text-xs text-slate-500 truncate mt-1">
                {conv.lastMessage}
              </p>
            </div>

            {conv.unread > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shrink-0">
                {conv.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 17: INDIVIDUAL CHAT SCREEN (BARGAINING)
// ==========================================
export const IndividualChatScreen: React.FC = () => {
  const { user } = useAuth();
  const { goBack } = useMarketplace();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'buyer',
      text: 'Namaste Rajesh Ji! Are these vine tomatoes fully ripe or semi-ripe?',
      time: '10:14 AM',
    },
    {
      id: 2,
      sender: 'farmer',
      text: 'Namaste! They are vine-ripened with natural sunlight, perfect firmness for 5-6 days storage.',
      time: '10:18 AM',
    },
    {
      id: 3,
      sender: 'buyer',
      text: 'Can you give 20kg at ₹29/kg for our family society order?',
      time: '10:22 AM',
      isOffer: true,
      offerPrice: 29,
    },
    {
      id: 4,
      sender: 'farmer',
      text: 'Sure Priya Ji, offer accepted! I will pack freshly picked tomatoes tomorrow morning!',
      time: '10:32 AM',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.role === 'farmer' ? 'farmer' : 'buyer',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulate farmer/buyer typing reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg = {
        id: Date.now() + 1,
        sender: user?.role === 'farmer' ? 'buyer' : 'farmer',
        text: user?.role === 'farmer'
          ? 'Thank you Rajesh Ji! Please share the dispatch update once packed.'
          : 'Understood! I will include the Organic Farming Certification with the shipment box.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  const handleOfferBargain = (price: number) => {
    setInput(`Offering ₹${price}/kg for wholesale bulk quantity.`);
  };

  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-slate-900 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
        <div className="flex items-center gap-2.5">
          <button onClick={goBack} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop"
            alt="Rajesh Kumar"
            className="h-9 w-9 rounded-full object-cover border border-emerald-500"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Rajesh Kumar</span>
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
            </div>
            <div className="text-[10px] text-emerald-600">Online • Annapurna Organic Farm</div>
          </div>
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
          <Phone className="h-4 w-4" />
        </button>
      </div>

      {/* Produce Context Banner */}
      <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/60 px-4 py-2 text-xs border-b border-emerald-100 dark:border-emerald-900">
        <div className="flex items-center gap-2">
          <span>🍅</span>
          <span className="font-semibold text-emerald-900 dark:text-emerald-200">
            Fresh Vine Tomatoes (Grade A)
          </span>
        </div>
        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">₹32/kg</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
        {messages.map((m) => {
          const isMe = (user?.role === 'farmer' && m.sender === 'farmer') || (user?.role !== 'farmer' && m.sender === 'buyer');
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-sm ${
                  isMe
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                {m.isOffer && (
                  <div className="mb-1 rounded bg-amber-400/20 px-2 py-1 text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>Price Bargain Proposal: ₹{m.offerPrice}/kg</span>
                  </div>
                )}
                <div>{m.text}</div>
                <div className="mt-1 text-[9px] text-slate-400 text-right">{m.time}</div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="text-[11px] text-slate-400 italic">Farmer Rajesh is typing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Bargaining Pills */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-400 shrink-0">Bargain:</span>
        <button
          onClick={() => handleOfferBargain(28)}
          className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold hover:bg-emerald-100"
        >
          Offer ₹28/kg
        </button>
        <button
          onClick={() => handleOfferBargain(30)}
          className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold hover:bg-emerald-100"
        >
          Offer ₹30/kg
        </button>
        <button
          onClick={() => setInput('Can you dispatch via overnight cold chain transport?')}
          className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold hover:bg-emerald-100"
        >
          Cold chain?
        </button>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 pb-6 flex items-center gap-2">
        <button
          onClick={() => alert('Simulated produce photo attached.')}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type message or bargain price..."
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3.5 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow hover:bg-emerald-600 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 18: ORDERS SCREEN
// ==========================================
export const OrdersScreen: React.FC = () => {
  const { user } = useAuth();
  const { orders, setCurrentScreen, setSelectedOrderId, cart, checkoutWithRazorpay } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered'>('all');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const isFarmer = user?.role === 'farmer';

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true;
    return o.status === activeTab;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.product?.pricePerKg || 0) * item.quantity, 0);

  const handleSimulatedCheckout = async () => {
    setIsCheckingOut(true);
    const res = await checkoutWithRazorpay(
      user?.address || 'Flat 402, Green Heights, Andheri West, Mumbai',
      'Simulated Razorpay & UPI Gateway'
    );
    setIsCheckingOut(false);
    if (res.success && res.order) {
      setSelectedOrderId(res.order.id);
      setCurrentScreen('order_details');
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            {isFarmer ? 'Farm Dispatches' : 'Direct Orders'}
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {isFarmer ? 'Produce Orders' : 'My Orders & Cart'}
          </h1>
        </div>

        <button
          onClick={() => setCurrentScreen('orders')}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Cart Summary Banner (If Customer and cart has items) */}
      {!isFarmer && cart.length > 0 && (
        <div className="mb-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-slate-900 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs text-emerald-200">Pending Cart ({cart.length} items)</div>
              <div className="text-2xl font-extrabold font-mono mt-0.5">₹{cartTotal}</div>
            </div>
            <button
              onClick={handleSimulatedCheckout}
              disabled={isCheckingOut}
              className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 shadow hover:bg-amber-300 disabled:opacity-50"
            >
              {isCheckingOut ? 'Processing...' : 'Pay via Razorpay / UPI'}
            </button>
          </div>
          <div className="text-[10px] text-emerald-300/80">
            Simulated Razorpay test checkout • Escrow protected direct farm payment
          </div>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 py-1">
        {(['all', 'pending', 'confirmed', 'shipped', 'delivered'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-slate-400">
            <Package className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-2" />
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">No Orders in this category</div>
            <p className="text-[11px] text-slate-500 mt-1">Browse the marketplace to place fresh farm orders.</p>
          </div>
        ) : (
          filteredOrders.map((o) => {
            const items = JSON.parse(o.itemsJson || '[]');
            return (
              <div
                key={o.id}
                onClick={() => {
                  setSelectedOrderId(o.id);
                  setCurrentScreen('order_details');
                }}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-emerald-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      #{o.orderNumber}
                    </span>
                    <div className="text-[10px] text-slate-400">Direct Farm Delivery</div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      o.status === 'confirmed' || o.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : o.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>

                <div className="py-2.5">
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {items.map((it: any) => `${it.quantity}kg ${it.name}`).join(', ') || 'Fresh Produce'}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <MapPin className="h-3 w-3 text-emerald-600" />
                    <span className="truncate">{o.deliveryAddress}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    ₹{o.totalAmount} <span className="text-[10px] font-normal text-slate-400">({o.paymentMethod})</span>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    Track Timeline <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 19: ORDER DETAILS SCREEN
// ==========================================
export const OrderDetailsScreen: React.FC = () => {
  const { selectedOrderId, orders, goBack, setCurrentScreen } = useMarketplace();
  const { user } = useAuth();
  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="p-6 text-center">
        <button onClick={goBack} className="text-xs font-bold text-emerald-600">
          ← Back to Orders
        </button>
      </div>
    );
  }

  const items = JSON.parse(order.itemsJson || '[]');

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={goBack} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h1 className="text-base font-bold text-slate-900 dark:text-white">Order #{order.orderNumber}</h1>
          <p className="text-[10px] text-slate-400">Direct Farm-to-Consumer Escrow</p>
        </div>
        <button
          onClick={() => setCurrentScreen('individual_chat')}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
      </div>

      {/* Delivery Tracking Stepper */}
      <div className="mb-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
          Harvest & Dispatch Timeline
        </h3>

        <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
          <div className="relative">
            <span className="absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white text-[9px]">
              ✓
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Order Confirmed</div>
            <div className="text-[10px] text-slate-500">Farmer accepted order and reserved batch.</div>
          </div>

          <div className="relative">
            <span className="absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white text-[9px]">
              ✓
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Harvested & Packed</div>
            <div className="text-[10px] text-slate-500">Produce harvested fresh from Dindori fields.</div>
          </div>

          <div className="relative">
            <span className="absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white text-[9px]">
              •
            </span>
            <div className="text-xs font-bold text-amber-600">Dispatched in Agro-Van</div>
            <div className="text-[10px] text-slate-500">Expected delivery within 18-24 hours.</div>
          </div>

          <div className="relative opacity-50">
            <span className="absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-700 text-white text-[9px]">
              •
            </span>
            <div className="text-xs font-bold text-slate-400">Delivered to Doorstep</div>
          </div>
        </div>
      </div>

      {/* Produce Items Card */}
      <div className="mb-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
          Produce Items
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {items.map((it: any, idx: number) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{it.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {it.quantity}kg @ ₹{it.pricePerKg}/kg
                </div>
              </div>
              <div className="font-mono font-bold text-slate-900 dark:text-white">
                ₹{(it.quantity || 1) * (it.pricePerKg || 32)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
          <span>Total Paid</span>
          <span className="text-base font-mono text-emerald-700 dark:text-emerald-400">
            ₹{order.totalAmount}
          </span>
        </div>
      </div>

      {/* Simulated Payment Notice */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-3.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 mb-1">
          <CreditCard className="h-4 w-4" />
          <span>Simulated Razorpay & UPI Gateway</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          Transaction Reference: <span className="font-mono font-semibold">pay_rzp_mock_{order.id}</span>.
          This is an educational simulated escrow transaction for academic demonstration.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 20: FARMER PROFILE SCREEN
// ==========================================
export const FarmerProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { setCurrentScreen, products } = useMarketplace();

  const myProducts = products.filter((p) => p.farmerId === user?.id || user?.id === 1);

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center my-3">
        <div className="relative mb-3">
          <img
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop"
            alt="Farmer"
            className="h-20 w-20 rounded-full object-cover border-4 border-emerald-600 shadow-md"
          />
          <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
            ✓
          </span>
        </div>

        <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
          <span>{user?.name || 'Rajesh Kumar'}</span>
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
        </h1>
        <p className="text-xs text-slate-500">
          {user?.farmerProfile?.farmName || 'Annapurna Organic Farm'} • Nashik, Maharashtra
        </p>
        <div className="mt-1 flex items-center gap-1 text-xs text-amber-500 font-bold">
          <Star className="h-3.5 w-3.5 fill-amber-400" />
          <span>4.9 (38 Reviews) • 14 Years Experience</span>
        </div>
      </div>

      {/* Farm Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
          <div className="text-base font-extrabold font-mono text-emerald-600">3,200kg</div>
          <div className="text-[10px] text-slate-400">Total Harvest Sold</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
          <div className="text-base font-extrabold font-mono text-emerald-600">{myProducts.length || 4}</div>
          <div className="text-[10px] text-slate-400">Active Crops</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
          <div className="text-base font-extrabold font-mono text-emerald-600">100%</div>
          <div className="text-[10px] text-slate-400">Organic Tested</div>
        </div>
      </div>

      {/* Account Settings Menu */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 mb-4">
        <button
          onClick={() => setCurrentScreen('add_product')}
          className="flex w-full items-center justify-between p-3.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span>Manage My Produce Listings</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
        <button
          onClick={() => setCurrentScreen('price_analytics')}
          className="flex w-full items-center justify-between p-3.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span>Mandi Benchmark Rates & MSP</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
        <button
          onClick={() => setCurrentScreen('settings')}
          className="flex w-full items-center justify-between p-3.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span>Language, Notifications & Settings</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <button
        onClick={() => {
          logout();
          setCurrentScreen('welcome');
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 py-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 active:scale-98"
      >
        <LogOut className="h-4 w-4" />
        <span>Log Out Account</span>
      </button>
    </div>
  );
};

// ==========================================
// SCREEN 21: CUSTOMER PROFILE SCREEN
// ==========================================
export const CustomerProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { setCurrentScreen, orders } = useMarketplace();

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      <div className="flex flex-col items-center text-center my-3">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
          alt="Customer"
          className="h-20 w-20 rounded-full object-cover border-4 border-amber-500 shadow-md mb-2"
        />
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          {user?.name || 'Priya Sharma'}
        </h1>
        <p className="text-xs text-slate-500">
          {user?.email || 'priya.customer@agrismart.com'} • {user?.mobile || '9123456789'}
        </p>
      </div>

      {/* Customer Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-center">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
          <div className="text-lg font-bold font-mono text-emerald-600">{orders.length || 6}</div>
          <div className="text-[10px] text-slate-400">Total Farm Orders</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
          <div className="text-lg font-bold font-mono text-amber-500">₹3,420</div>
          <div className="text-[10px] text-slate-400">Saved vs Supermarket</div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Primary Delivery Address
          </span>
          <span className="text-[10px] font-bold text-emerald-600">Default</span>
        </div>
        <div className="text-xs font-semibold text-slate-900 dark:text-white">
          Flat 402, Green Heights, Andheri West, Mumbai
        </div>
      </div>

      {/* Navigation Options */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 mb-4">
        <button
          onClick={() => setCurrentScreen('orders')}
          className="flex w-full items-center justify-between p-3.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span>Order History & Invoices</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
        <button
          onClick={() => setCurrentScreen('chat_list')}
          className="flex w-full items-center justify-between p-3.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span>Direct Messages with Farmers</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
        <button
          onClick={() => setCurrentScreen('settings')}
          className="flex w-full items-center justify-between p-3.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span>App Preferences & Language</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <button
        onClick={() => {
          logout();
          setCurrentScreen('welcome');
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 py-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 active:scale-98"
      >
        <LogOut className="h-4 w-4" />
        <span>Log Out Account</span>
      </button>
    </div>
  );
};

// ==========================================
// SCREEN 22: NOTIFICATIONS SCREEN
// ==========================================
export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationAsRead } = useMarketplace();

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Alerts & Advisories
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Notifications
          </h1>
        </div>
        <Bell className="h-5 w-5 text-slate-400" />
      </div>

      <div className="space-y-2.5">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationAsRead(n.id)}
            className={`rounded-2xl border p-3.5 transition-all cursor-pointer ${
              n.isRead
                ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80'
                : 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h3>
              {!n.isRead && (
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {n.message}
            </p>
            <div className="mt-2 text-[10px] text-slate-400 font-mono">
              {new Date(n.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 23: SETTINGS SCREEN
// ==========================================
export const SettingsScreen: React.FC<{ onOpenExport: () => void }> = ({ onOpenExport }) => {
  const { language, setLanguage } = useLanguage();
  const { switchRole } = useAuth();
  const { setCurrentScreen } = useMarketplace();

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            System & Project
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Settings & Deliverables
          </h1>
        </div>
        <Settings className="h-5 w-5 text-slate-400" />
      </div>

      {/* MCA Project Export Button */}
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-slate-900 p-4 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <FileCode className="h-5 w-5 text-amber-300" />
          <h2 className="text-sm font-bold">MCA College Project Code Export</h2>
        </div>
        <p className="text-xs text-emerald-200/90 leading-relaxed mb-3">
          Inspect and copy the full React Native Expo project structure, package.json, terminal commands, and Sequelize migrations.
        </p>
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-slate-950 shadow hover:bg-amber-300 active:scale-95"
        >
          <Download className="h-4 w-4" />
          <span>View Exportable Expo Codebase</span>
        </button>
      </div>

      {/* Language Selector */}
      <div className="mb-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-emerald-600" />
          <span>Language / भाषा</span>
        </h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => setLanguage('en')}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
              language === 'en'
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            English (Default)
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
              language === 'hi'
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            हिंदी (Bilingual)
          </button>
        </div>
      </div>

      {/* Switch Demo Roles */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm mb-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
          Quick Switch User Journeys
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={async () => {
              await switchRole('farmer');
              setCurrentScreen('farmer_dashboard');
            }}
            className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/40 py-2.5 px-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
          >
            Switch to Farmer
          </button>
          <button
            onClick={async () => {
              await switchRole('customer');
              setCurrentScreen('customer_dashboard');
            }}
            className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/40 py-2.5 px-3 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100"
          >
            Switch to Customer
          </button>
        </div>
      </div>
    </div>
  );
};
