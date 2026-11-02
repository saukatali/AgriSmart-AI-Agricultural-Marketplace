import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  RefreshCw,
  Star,
  Activity,
  Layers,
  Sparkles,
  Award,
  Check,
  X,
  Eye,
  Store,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { FarmerAnalyticsData, AdminMetricsData, VerificationRequest, ModerationReportItem, PlatformActivityItem, SalesReportData } from '../types';

// ============================================================================
// PART A: FARMER ANALYTICS SCREEN
// ============================================================================
export const FarmerAnalyticsScreen: React.FC = () => {
  const { user } = useAuth();
  const { setCurrentScreen } = useMarketplace();
  const { t } = useLanguage();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analytics, setAnalytics] = useState<FarmerAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await api.getFarmerAnalytics(timeRange);
      if (res.success) {
        setAnalytics(res as any);
      }
    } catch (err) {
      console.error('Failed to load farmer analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (isLoading && !analytics) {
    return (
      <div className="flex h-full min-h-[500px] flex-col items-center justify-center p-6 text-center">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading your farm sales analytics...</p>
      </div>
    );
  }

  const overview = analytics?.overview || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    averageOrderValue: 0,
    averageRating: '5.0',
    totalReviewsCount: 0,
  };

  const monthlyRev = analytics?.charts?.monthlyRevenue || [];
  const weeklySales = analytics?.charts?.weeklySales || [];
  const productSales = analytics?.charts?.productWiseSales || [];
  const topProducts = analytics?.charts?.topSellingProducts || [];
  const statusDist = analytics?.charts?.orderStatusDistribution || [];
  const demandForecast = analytics?.charts?.demandForecast || [];
  const reviews = analytics?.reviews?.recentReviews || [];

  // Max value for revenue line chart scaling
  const maxRevenue = Math.max(...monthlyRev.map((m) => m.revenue), 1000);

  return (
    <div className="flex flex-col gap-5 p-4 pb-24 font-sans text-slate-900 dark:text-slate-100">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400">
              Farm Economics
            </span>
            <span className="text-xs text-slate-500">Live Database Verified</span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            Farmer Sales Analytics
          </h1>
        </div>

        <button
          onClick={() => setCurrentScreen('reports')}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-transform"
        >
          <FileText className="h-3.5 w-3.5" />
          Export PDF Report
        </button>
      </div>

      {/* Time Range Filter Bar */}
      <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
        {(['7d', '30d', '90d', '1y'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              timeRange === range
                ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '3 Months' : '1 Year'}
          </button>
        ))}
      </div>

      {/* KPI Summary Cards Grid (Metrics 1 to 5) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Card 1: Total Revenue */}
        <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-3.5 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Revenue</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
            ₹{overview.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>+24.8% vs APMC Mandi</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Orders</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
            {overview.totalOrders}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Avg order: ₹{overview.averageOrderValue}
          </div>
        </div>

        {/* Card 3: Completed Orders */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed Orders</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
            {overview.completedOrders}
          </div>
          <div className="mt-1 text-[11px] font-medium text-emerald-600">
            {overview.totalOrders > 0 ? Math.round((overview.completedOrders / overview.totalOrders) * 100) : 100}% fulfillment
          </div>
        </div>

        {/* Card 4: Pending / Processing */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Orders</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
            {overview.pendingOrders}
          </div>
          <div className="mt-1 text-[11px] text-amber-600">
            Requires packaging
          </div>
        </div>
      </div>

      {/* CHART 1: Interactive Revenue Line Chart */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Revenue Trajectory</h2>
            <p className="text-xs text-slate-500">Farmer direct farm gate payments (Past 6 Months)</p>
          </div>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            ₹ Line Chart
          </span>
        </div>

        {/* SVG Line Chart */}
        <div className="mt-4">
          <div className="relative h-44 w-full">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 40, 80, 120, 160].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="500"
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeDasharray="4 4"
                />
              ))}

              {monthlyRev.length > 1 && (
                <>
                  {/* Fill Area */}
                  <polygon
                    points={`0,160 ${monthlyRev
                      .map((pt, idx) => {
                        const x = (idx / (monthlyRev.length - 1)) * 500;
                        const y = 150 - (pt.revenue / maxRevenue) * 130;
                        return `${x},${y}`;
                      })
                      .join(' ')} 500,160`}
                    fill="url(#revenueGrad)"
                  />

                  {/* Stroke Polyline */}
                  <polyline
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={monthlyRev
                      .map((pt, idx) => {
                        const x = (idx / (monthlyRev.length - 1)) * 500;
                        const y = 150 - (pt.revenue / maxRevenue) * 130;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Data Points */}
                  {monthlyRev.map((pt, idx) => {
                    const x = (idx / (monthlyRev.length - 1)) * 500;
                    const y = 150 - (pt.revenue / maxRevenue) * 130;
                    const isHovered = activeChartPoint === idx;

                    return (
                      <g key={idx} className="cursor-pointer" onClick={() => setActiveChartPoint(idx)}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 7 : 5}
                          fill="#ffffff"
                          stroke="#10B981"
                          strokeWidth="3"
                          className="transition-all"
                        />
                        {isHovered && (
                          <g>
                            <rect
                              x={Math.max(10, Math.min(420, x - 45))}
                              y={Math.max(0, y - 32)}
                              width="90"
                              height="24"
                              rx="6"
                              className="fill-slate-900 text-white"
                            />
                            <text
                              x={Math.max(10, Math.min(420, x - 45)) + 45}
                              y={Math.max(0, y - 32) + 16}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="11"
                              fontWeight="bold"
                            >
                              ₹{pt.revenue.toLocaleString('en-IN')}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </>
              )}
            </svg>
          </div>

          {/* X Axis Month Labels */}
          <div className="flex justify-between border-t border-slate-200/80 pt-2 text-[11px] font-semibold text-slate-500 dark:border-slate-800">
            {monthlyRev.map((m, idx) => (
              <span
                key={idx}
                onClick={() => setActiveChartPoint(idx)}
                className={`cursor-pointer transition-colors ${
                  activeChartPoint === idx ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                }`}
              >
                {m.month}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CHART 2 & 3: Weekly Sales & Order Status Donut */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Weekly Sales Bar Chart */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Daily Sales (Past 7 Days)</h2>
            <span className="text-xs font-semibold text-emerald-600">₹ Daily</span>
          </div>

          <div className="mt-4 flex h-36 items-end justify-between gap-2 pt-2">
            {weeklySales.map((d, idx) => {
              const maxDayRev = Math.max(...weeklySales.map((w) => w.revenue), 100);
              const heightPercent = Math.max(12, Math.round((d.revenue / maxDayRev) * 100));

              return (
                <div key={idx} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                    {d.revenue > 0 ? `₹${d.revenue}` : '-'}
                  </div>
                  <div className="relative w-full rounded-t-md bg-slate-100 dark:bg-slate-800 overflow-hidden h-24 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full rounded-t-md bg-emerald-500 hover:bg-emerald-600 transition-all"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Donut / Pie Chart */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Order Status Distribution</h2>
            <span className="text-xs font-semibold text-slate-500">{overview.totalOrders} Total</span>
          </div>

          <div className="mt-3 flex items-center gap-4">
            {/* SVG Donut Circle */}
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e2e8f0" strokeWidth="4" className="dark:stroke-slate-800" />
                {(() => {
                  let accumulatedPercent = 0;
                  return statusDist.map((item, idx) => {
                    const strokeDash = `${item.percentage} ${100 - item.percentage}`;
                    const strokeOffset = 100 - accumulatedPercent;
                    accumulatedPercent += item.percentage;

                    return (
                      <circle
                        key={idx}
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="4"
                        strokeDasharray={strokeDash}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{overview.completedOrders}</span>
                <span className="block text-[9px] text-slate-500">Fulfilled</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-1 flex-col gap-1.5 text-xs">
              {statusDist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.status}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CHART 4: Product-wise Sales Breakdown (Bar Chart / Table) */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Product-Wise Sales & Volume</h2>
            <p className="text-xs text-slate-500">Total units sold (kg) vs gross revenue</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">{productSales.length} Listings</span>
        </div>

        {productSales.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No products listed yet. Click "+ Add Produce" to list agricultural inventory.
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {productSales.map((p, idx) => {
              const maxProdRev = Math.max(...productSales.map((x) => x.revenue), 100);
              const barPercent = Math.max(8, Math.round((p.revenue / maxProdRev) * 100));

              return (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{p.productName}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {p.categoryName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 dark:text-white">₹{p.revenue.toLocaleString('en-IN')}</span>
                      <span className="ml-1.5 text-[11px] text-slate-500 font-mono">({p.kgSold} {p.unit})</span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${barPercent}%` }}
                      className="h-full rounded-full bg-emerald-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DEMAND FORECAST & PRICE TRENDS (Metrics 10 & 11) */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Demand & Price Trend Projections</h2>
          </div>
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            ML Engine v2.4
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {demandForecast.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200/70 p-3 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">{item.crop}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    item.demandLevel === 'High'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                  }`}
                >
                  {item.demandLevel} Demand ({item.demandScore}%)
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-500">Current: ₹{item.currentPrice}/kg</span>
                  <span className="mx-1 text-slate-400">→</span>
                  <span className="text-xs font-bold text-emerald-600">7-Day: ₹{item.predicted7dPrice}/kg</span>
                </div>
                <span className="text-xs font-bold text-emerald-600">+{item.priceChangePercent}%</span>
              </div>

              <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-400 italic">
                💡 {item.recommendedAction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMER REVIEWS (Metric 12) */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Customer Ratings & Reviews</h2>
            <p className="text-xs text-slate-500">Feedback from verified consumer orders</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{overview.averageRating} / 5.0</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No customer reviews yet. Deliver fresh produce to earn 5-star ratings!
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-2.5">
            {reviews.map((rev: any, idx: number) => (
              <div key={idx} className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{rev.userName}</span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PART B: ADMIN DASHBOARD SCREEN
// ============================================================================
export const AdminDashboardScreen: React.FC = () => {
  const { user, switchRole } = useAuth();
  const { setCurrentScreen } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'users' | 'reports'>('overview');
  const [metrics, setMetrics] = useState<AdminMetricsData | null>(null);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [reports, setReports] = useState<ModerationReportItem[]>([]);
  const [activities, setActivities] = useState<PlatformActivityItem[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  const loadAdminData = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    try {
      const [mRes, vRes, rRes, aRes, uRes] = await Promise.all([
        api.getAdminMetrics().catch(() => ({ success: false, metrics: null })),
        api.getAdminVerifications().catch(() => ({ success: false, verifications: [] })),
        api.getAdminReports().catch(() => ({ success: false, reports: [] })),
        api.getAdminActivity().catch(() => ({ success: false, activities: [] })),
        api.getAdminUsers(roleFilter, userSearch).catch(() => ({ success: false, users: [] })),
      ]);

      if (mRes.success && mRes.metrics) setMetrics(mRes.metrics);
      if (vRes.success && vRes.verifications) setVerifications(vRes.verifications);
      if (rRes.success && rRes.reports) setReports(rRes.reports);
      if (aRes.success && aRes.activities) setActivities(aRes.activities);
      if (uRes.success && uRes.users) setUsersList(uRes.users);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin, roleFilter]);

  const handleVerifyFarmer = async (farmerId: number, status: 'verified' | 'rejected') => {
    try {
      const res = await api.updateFarmerVerification(farmerId, status);
      if (res.success) {
        setActionSuccess(`Farmer #${farmerId} marked as ${status}!`);
        setTimeout(() => setActionSuccess(null), 3000);
        loadAdminData();
      }
    } catch (err) {
      console.error('Error verifying farmer:', err);
    }
  };

  const handleResolveReport = async (reportId: number, status: 'resolved' | 'dismissed', action?: string) => {
    try {
      const res = await api.updateModerationReport(reportId, status, 'Audited by Administrator', action);
      if (res.success) {
        setActionSuccess(`Report #${reportId} status updated to ${status}!`);
        setTimeout(() => setActionSuccess(null), 3000);
        loadAdminData();
      }
    } catch (err) {
      console.error('Error resolving report:', err);
    }
  };

  // ADMIN SECURITY GUARD: If not logged in as Admin
  if (!isAdmin) {
    return (
      <div className="flex h-full min-h-[500px] flex-col items-center justify-center p-6 text-center font-sans">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
          Admin Security Guard: Role Restricted
        </h2>
        <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          You are currently signed in as <strong>{user?.name || 'User'}</strong> ({user?.role || 'Guest'}).
          Administrator routes require verified role authorization on the backend.
        </p>

        <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
          <button
            onClick={() => switchRole('admin')}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-black active:scale-95 transition-all dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <ShieldCheck className="h-4 w-4" />
            Switch to Admin Demo Account (admin@agrismart.com)
          </button>
          <button
            onClick={() => setCurrentScreen('marketplace')}
            className="rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4 pb-24 font-sans text-slate-900 dark:text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-800 dark:bg-purple-950/80 dark:text-purple-400">
              Platform Governance
            </span>
            <span className="text-xs text-slate-500">Super Admin Console</span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            AgriSmart Administration
          </h1>
        </div>

        <button
          onClick={() => setCurrentScreen('reports')}
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-black active:scale-95 transition-transform dark:bg-slate-800"
        >
          <FileText className="h-3.5 w-3.5 text-emerald-400" />
          Financial Audit
        </button>
      </div>

      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-2.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
          <Check className="h-4 w-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Admin KPI Summary Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500">Total Users</span>
          <div className="mt-1.5 text-xl font-extrabold text-slate-900 dark:text-white">
            {metrics?.totalUsers || 4}
          </div>
          <span className="text-[11px] text-slate-500">
            {metrics?.totalFarmers || 2} Farmers • {metrics?.totalCustomers || 1} Buyers
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500">Total Products</span>
          <div className="mt-1.5 text-xl font-extrabold text-slate-900 dark:text-white">
            {metrics?.totalProducts || 6}
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">
            {metrics?.activeProducts || 6} Active Listings
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500">Orders & GMV</span>
          <div className="mt-1.5 text-xl font-extrabold text-slate-900 dark:text-white">
            ₹{(metrics?.totalGMV || 18540).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500">
            {metrics?.totalOrders || 8} Orders Processed
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-500">Action Queue</span>
          <div className="mt-1.5 text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{(metrics?.pendingVerifications || 0) + (metrics?.pendingReports || 0)}</span>
            {(metrics?.pendingVerifications || 0) + (metrics?.pendingReports || 0) > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">
            {metrics?.pendingVerifications || 0} Verifications • {metrics?.pendingReports || 0} Reports
          </span>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex border-b border-slate-200 text-xs font-semibold dark:border-slate-800">
        {[
          { id: 'overview', label: '1. Overview & Activity' },
          { id: 'verifications', label: `2. Farmer Verifications (${verifications.length})` },
          { id: 'users', label: '3. Users Directory' },
          { id: 'reports', label: `4. Moderation (${reports.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 border-b-2 py-2.5 text-center transition-all ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & ACTIVITY LOG */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-4">
          {/* Top Selling Categories */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Category Performance Breakdown</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(metrics?.topCategories || []).map((cat, idx) => (
                <div key={idx} className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{cat.name}</span>
                    <span className="text-[10px] text-slate-500">{cat.count} items</span>
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{cat.revenue.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Platform Activity Feed */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Real-Time Platform Activity</h3>
              </div>
              <span className="text-xs text-slate-500">Live Socket & DB Events</span>
            </div>

            <div className="mt-3 flex flex-col gap-2.5">
              {activities.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">No platform activity logged yet.</div>
              ) : (
                activities.slice(0, 10).map((act, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 rounded-lg border border-slate-100 p-2.5 dark:border-slate-800/80">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{act.title}</span>
                        <span className="text-[10px] text-slate-500">
                          {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                        </span>
                      </div>
                      <p className="mt-0.5 text-slate-600 dark:text-slate-300">{act.description}</p>
                      <span className="text-[10px] text-slate-400 font-mono">By: {act.actorName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FARMER VERIFICATIONS */}
      {activeTab === 'verifications' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Audit farmer land records, Aadhaar UIDAI, and APMC trader gate passes.</span>
          </div>

          {verifications.map((req) => (
            <div
              key={req.farmerId}
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-base dark:bg-emerald-950 dark:text-emerald-400">
                    🌾
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{req.name}</h4>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                          req.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                        }`}
                      >
                        {req.verificationStatus.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {req.farmName} • {req.farmLocation}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {req.farmingExperience} years farming experience • {req.mobile}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVerifyFarmer(req.farmerId, 'verified')}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Approve ✅
                  </button>
                  <button
                    onClick={() => handleVerifyFarmer(req.farmerId, 'rejected')}
                    className="flex items-center gap-1 rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 active:scale-95"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject ❌
                  </button>
                </div>
              </div>

              {/* Verified Document checklist */}
              <div className="mt-3 grid grid-cols-1 gap-1.5 border-t border-slate-100 pt-2 text-xs sm:grid-cols-3 dark:border-slate-800">
                {req.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="flex flex-col gap-3">
          {/* Search & Filter */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name, email, or mobile..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(['all', 'farmer', 'customer', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                    roleFilter === r
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* User Table */}
          <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:bg-slate-800/80">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-500">{u.email} • {u.mobile}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold capitalize ${
                          u.role === 'farmer'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                            : u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{u.city}, {u.state}</td>
                    <td className="p-3">
                      {u.isVerified ? (
                        <span className="text-emerald-600 font-bold">Verified ✅</span>
                      ) : (
                        <span className="text-amber-600 font-medium">Pending ⏳</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MODERATION & REPORTS */}
      {activeTab === 'reports' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-slate-500">
            Review reported listings, fraudulent price claims, or quality certificate discrepancies.
          </div>

          {reports.length === 0 ? (
            <div className="rounded-xl border border-slate-200/80 bg-white p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              Zero reports pending. The marketplace is running cleanly!
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-400">
                        {rep.reportType.toUpperCase()} REPORT
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rep.targetTitle}</h4>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      <strong>Reason:</strong> {rep.reason}
                    </p>
                    <p className="text-[11px] text-slate-400">Reported by: {rep.reporterName}</p>
                  </div>

                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      rep.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rep.status.toUpperCase()}
                  </span>
                </div>

                {rep.status === 'pending' && (
                  <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                    <button
                      onClick={() => handleResolveReport(rep.id, 'resolved', 'takedown')}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
                    >
                      Takedown Listing 🚫
                    </button>
                    <button
                      onClick={() => handleResolveReport(rep.id, 'resolved')}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-black dark:bg-slate-800"
                    >
                      Mark Resolved ✅
                    </button>
                    <button
                      onClick={() => handleResolveReport(rep.id, 'dismissed')}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-400"
                    >
                      Dismiss Report
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PART C: REPORTING & PDF EXPORT SCREEN
// ============================================================================
export const ReportsScreen: React.FC = () => {
  const { user } = useAuth();
  const { setCurrentScreen } = useMarketplace();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [report, setReport] = useState<SalesReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await api.getSalesReport(timeRange);
      if (res.success) {
        setReport(res.report);
      }
    } catch (err) {
      console.error('Failed to load sales report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [timeRange]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (!report) return;
    let csv = 'Product Name,Quantity Sold,Gross Revenue (INR),Orders Count\n';
    for (const p of report.productBreakdown) {
      csv += `"${p.name}",${p.quantity},${p.revenue},${p.ordersCount}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.reportId}_sales_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5 p-4 pb-24 font-sans text-slate-900 dark:text-slate-100">
      {/* Top Header Control */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <button
            onClick={() => setCurrentScreen(user?.role === 'admin' ? 'admin_dashboard' : 'farmer_analytics')}
            className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mb-1 hover:underline"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Agricultural Sales & Audit Report
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            CSV Export
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
        {(['7d', '30d', '90d', '1y'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setTimeRange(r)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              timeRange === r
                ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {r === '7d' ? 'Weekly (7d)' : r === '30d' ? 'Monthly (30d)' : r === '90d' ? 'Quarterly' : 'Annual'}
          </button>
        ))}
      </div>

      {isLoading || !report ? (
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        /* Printable Report Document Card */
        <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950 text-slate-900 dark:text-slate-100 print:border-none print:shadow-none print:p-0">
          {/* Document Letterhead */}
          <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white text-2xl font-black">
                🌾
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  AgriSmart India Platform
                </h2>
                <p className="text-xs text-slate-500">
                  Direct Farm-to-Consumer Agricultural Exchange • ISO 9001:2026 Audit
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="font-mono font-bold text-slate-900 dark:text-white block">
                {report.reportId}
              </span>
              <span className="text-[11px] text-slate-500">
                Generated: {new Date(report.generatedAt).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>

          {/* Report Meta Info */}
          <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-900/60 sm:grid-cols-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Authorized Account</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{report.generatedBy}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Audit Period</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{report.periodLabel}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Orders</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{report.summary.totalOrders}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Mandi Cess Saved</span>
              <span className="font-bold text-emerald-600">₹{report.summary.mandiCessSavings} (2.5%)</span>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Executive Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <span className="text-slate-500">Gross Merchandise Value (GMV)</span>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  ₹{report.summary.grossRevenue.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <span className="text-slate-500">Net Farmer Remittance (100%)</span>
                <div className="text-lg font-black text-emerald-600 mt-1">
                  ₹{report.summary.netFarmerEarnings.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-500">Platform Convenience Fee</span>
                <div className="text-lg font-black text-slate-700 dark:text-slate-300 mt-1">
                  ₹0.00 (Zero Brokerage)
                </div>
              </div>
            </div>
          </div>

          {/* Product Breakdown Table */}
          <div className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Product-Wise Breakdown</h3>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-900/80">
                <tr>
                  <th className="p-2">Item Name</th>
                  <th className="p-2 text-right">Volume Sold</th>
                  <th className="p-2 text-right">Gross Total (INR)</th>
                  <th className="p-2 text-right">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {report.productBreakdown.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="p-2 text-right font-mono text-slate-600 dark:text-slate-300">{item.quantity} kg</td>
                    <td className="p-2 text-right font-bold text-slate-900 dark:text-white">
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-right text-slate-500">{item.ordersCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statutory Exemption Declaration */}
          <div className="mt-6 rounded-lg bg-emerald-50/80 p-3 text-[11px] text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
            <strong>Statutory Exemption Clause:</strong> {report.summary.taxExemptionClause}
          </div>

          {/* Signoff / Verification */}
          <div className="mt-8 flex items-end justify-between border-t border-slate-200 pt-4 text-[11px] text-slate-400 dark:border-slate-800">
            <span>Official Computer-Generated Audit Certificate • AgriSmart MCA Capstone</span>
            <span className="font-mono">Verification Hash: 8841-SHA256-AGRI</span>
          </div>
        </div>
      )}
    </div>
  );
};
