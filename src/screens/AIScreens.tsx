import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  TrendingUp,
  Send,
  Volume2,
  Bot,
  User,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { CropForecast } from '../types';

// ==========================================
// SCREEN 12: AI INSIGHTS SCREEN
// ==========================================
export const AIInsightsScreen: React.FC = () => {
  const { setCurrentScreen } = useMarketplace();
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            Powered by Python ML + Gemini 3.8
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            AI Agricultural Pulse
          </h1>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-400 text-white shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      {/* Opportunity Score Hero Card */}
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-200">Current Market Opportunity Score</div>
            <div className="text-3xl font-extrabold font-mono mt-1">94 / 100</div>
          </div>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-bold text-emerald-300">
            High Selling Margin
          </span>
        </div>
        <p className="mt-3 text-xs text-emerald-100/80 leading-relaxed">
          Pre-festive demand in Mumbai, Pune, and Surat metros is driving a 21.4% price premium on direct farm tomatoes and mangoes.
        </p>
      </div>

      {/* Navigation Quick Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          onClick={() => setCurrentScreen('demand_forecast')}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-emerald-500 transition-all text-left group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 mb-2">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
              Demand Forecast
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">7-Day & 30-Day ML volume curves</p>
          </div>
        </button>

        <button
          onClick={() => setCurrentScreen('price_analytics')}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-emerald-500 transition-all text-left group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-2">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
              Price Analytics
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">APMC Mandi vs Direct farm comparison</p>
          </div>
        </button>
      </div>

      {/* AI Agricultural Advisories */}
      <div>
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
          Real-Time Agricultural Advisories
        </h3>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🍅</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    Tomato Mandi Outflow Shortage
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 font-mono">+18% Spike</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  Arrivals in Lasalgaon APMC dropped by 320 quintals. Recommended retail listing: ₹36-40/kg.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-3.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🧅</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                    Onion Storage Recommendation
                  </h4>
                  <span className="text-[10px] font-bold text-amber-700 font-mono">Stable</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  Grade A red onions should be cured for 48 hours before packing to maintain export firmness.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20 p-3.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🌾</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-sky-950 dark:text-sky-200">
                    Sharbati Wheat Bulk Orders
                  </h4>
                  <span className="text-[10px] font-bold text-sky-700 font-mono">High Demand</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  Residential housing societies in Navi Mumbai are placing 100kg+ pooled orders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 13: DEMAND FORECAST SCREEN
// ==========================================
export const DemandForecastScreen: React.FC = () => {
  const [forecasts, setForecasts] = useState<CropForecast[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<CropForecast | null>(null);
  const [forecastPeriod, setForecastPeriod] = useState<'7d' | '30d'>('7d');
  const [modelPerf, setModelPerf] = useState<any>(null);
  const [showModelDetails, setShowModelDetails] = useState(false);

  useEffect(() => {
    async function loadForecast() {
      try {
        const res = await api.getAIForecast();
        if (res.success && res.data.cropForecasts) {
          setForecasts(res.data.cropForecasts);
          setSelectedCrop(res.data.cropForecasts[0]);
        }

        const perfRes = await fetch('/api/forecast/model-performance').then((r) => r.json());
        if (perfRes.success) {
          setModelPerf(perfRes.performance);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadForecast();
  }, []);

  const points7d = selectedCrop?.chartPoints || [24, 26, 25, 28, 30, 33, 34];
  const points30d = [
    24, 25, 26, 26, 25, 27, 28, 29, 30, 31, 30, 32, 33, 34, 34, 35, 36, 35, 37, 38,
    39, 38, 40, 41, 41, 42, 43, 44, 45, 46,
  ];
  const activePoints = forecastPeriod === '7d' ? points7d : points30d;

  const minVal = Math.min(...activePoints) - 2;
  const maxVal = Math.max(...activePoints) + 2;

  // SVG Chart calculation
  const svgWidth = 320;
  const svgHeight = 120;
  const pathD = activePoints
    .map((val, idx) => {
      const x = (idx / (activePoints.length - 1)) * (svgWidth - 20) + 10;
      const y = svgHeight - 20 - ((val - minVal) / (maxVal - minVal)) * (svgHeight - 40);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            Python Scikit-Learn ML Engine
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Crop Demand Forecasting
          </h1>
        </div>
        <button
          onClick={() => setShowModelDetails(!showModelDetails)}
          className="flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300"
        >
          <Cpu className="h-3.5 w-3.5 text-emerald-600" />
          <span>{showModelDetails ? 'Hide ML' : 'Model Stats'}</span>
        </button>
      </div>

      {/* Model Performance Panel */}
      {showModelDetails && modelPerf && (
        <div className="mb-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-3.5 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-emerald-400">ML Validation: {modelPerf.validation_method}</span>
            <span className="font-mono text-[10px] text-slate-400">N={modelPerf.evaluated_test_samples} test records</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono my-2">
            <div className="rounded-lg bg-slate-900/80 p-2">
              <div className="text-[10px] text-slate-400">MAE</div>
              <div className="font-bold text-emerald-400">{modelPerf.demand_forecasting_model.mae}</div>
            </div>
            <div className="rounded-lg bg-slate-900/80 p-2">
              <div className="text-[10px] text-slate-400">RMSE</div>
              <div className="font-bold text-emerald-400">{modelPerf.demand_forecasting_model.rmse}</div>
            </div>
            <div className="rounded-lg bg-slate-900/80 p-2">
              <div className="text-[10px] text-slate-400">R² Score</div>
              <div className="font-bold text-amber-400">{modelPerf.demand_forecasting_model.r2_score}</div>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-slate-400">
            <span className="font-semibold text-slate-300">Baseline comparison:</span>{' '}
            Outperforms Naive Moving Average by{' '}
            <span className="text-emerald-400 font-bold">{modelPerf.demand_forecasting_model.improvement_over_baseline}</span>.
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-amber-300/80">
            <span className="font-bold">⚠️ Data Limitations:</span> Climate volatility and unannounced export bans are non-stationary.
          </div>
        </div>
      )}

      {/* Crop Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 py-1">
        {forecasts.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedCrop(f)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedCrop?.id === f.id
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {f.crop}
          </button>
        ))}
      </div>

      {/* 7-Day vs 30-Day Period Selector */}
      <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1 mb-3">
        <button
          onClick={() => setForecastPeriod('7d')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            forecastPeriod === '7d' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow' : 'text-slate-500'
          }`}
        >
          7-Day Forecast
        </button>
        <button
          onClick={() => setForecastPeriod('30d')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            forecastPeriod === '30d' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow' : 'text-slate-500'
          }`}
        >
          30-Day Monthly Trend
        </button>
      </div>

      {/* Interactive Demand Curve Chart */}
      {selectedCrop && (
        <div className="mb-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {selectedCrop.crop} ({selectedCrop.hindiName})
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                +{selectedCrop.priceChangePercent}% Projected Volume Growth
              </div>
            </div>
            <span className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              {selectedCrop.demandLevel} Demand
            </span>
          </div>

          {/* SVG Trend Line */}
          <div className="my-3 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/40 p-2">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-32 overflow-visible">
              <line x1="0" y1="30" x2={svgWidth} y2="30" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2={svgWidth} y2="70" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <path d={pathD} fill="none" stroke="#228b45" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 px-2 pt-1">
              <span>{forecastPeriod === '7d' ? 'Today' : 'Week 1'}</span>
              <span>{forecastPeriod === '7d' ? 'Day 4' : 'Week 2'}</span>
              <span>{forecastPeriod === '7d' ? 'Day 7' : 'Month End'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-sans">Current APMC Mandi</span>
              <div className="font-bold text-slate-900 dark:text-white">₹{selectedCrop.currentMandiPrice}/kg</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-sans">ML Predicted Target</span>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">₹{selectedCrop.predictedPrice7Days}/kg</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Action Strategy */}
      {selectedCrop && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
              Recommended Selling Strategy
            </h3>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {selectedCrop.recommendedAction}. Direct buyer demand on AgriSmart offers a ₹{selectedCrop.directAgriSmartPrice - selectedCrop.currentMandiPrice}/kg net margin premium above wholesale middlemen.
          </p>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SCREEN 14: PRICE ANALYTICS SCREEN
// ==========================================
export const PriceAnalyticsScreen: React.FC = () => {
  return (
    <div className="flex min-h-full flex-col bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-y-auto pb-24">
      <div className="mb-4">
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Mandi Rate Intelligence
        </span>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Price Benchmark Analytics
        </h1>
      </div>

      <div className="mb-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">
          Direct Farm vs APMC Intermediary Price (₹/kg)
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Vine Tomatoes</span>
              <span className="text-emerald-600 font-bold">₹38 (Farm) vs ₹28 (Mandi)</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Red Onions</span>
              <span className="text-emerald-600 font-bold">₹30 (Farm) vs ₹24 (Mandi)</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Sharbati Wheat</span>
              <span className="text-emerald-600 font-bold">₹46 (Farm) vs ₹38 (Mandi)</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Alphonso Mangoes</span>
              <span className="text-emerald-600 font-bold">₹210 (Farm) vs ₹150 (Mandi)</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
          Daily Mandi Rates (Lasalgaon / Pimpalgaon APMC)
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Lasalgaon APMC</div>
              <div className="text-[10px] text-slate-400">Tomato (Nashik Red)</div>
            </div>
            <div className="font-mono text-right">
              <div className="font-bold text-slate-900 dark:text-white">₹2,800/qnt</div>
              <div className="text-[10px] text-emerald-600">+8.5% today</div>
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Pimpalgaon APMC</div>
              <div className="text-[10px] text-slate-400">Red Onion (Export grade)</div>
            </div>
            <div className="font-mono text-right">
              <div className="font-bold text-slate-900 dark:text-white">₹2,400/qnt</div>
              <div className="text-[10px] text-slate-400">Stable</div>
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Sehore Mandi</div>
              <div className="text-[10px] text-slate-400">Sharbati Wheat Heavy</div>
            </div>
            <div className="font-mono text-right">
              <div className="font-bold text-slate-900 dark:text-white">₹3,800/qnt</div>
              <div className="text-[10px] text-emerald-600">+4.2% today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 15: MULTILINGUAL GEMINI AGRI-ASSISTANT (PHASE 7)
// ==========================================
export const AIChatbotScreen: React.FC = () => {
  const { language, setLanguage, speakText } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<
    { id: string; sender: 'user' | 'assistant'; text: string; time: string }[]
  >([]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize or fetch history
  useEffect(() => {
    async function loadHistory() {
      if (user) {
        try {
          const res = await fetch('/api/ai/history', {
            headers: { Authorization: `Bearer ${localStorage.getItem('agrismart_token')}` },
          }).then((r) => r.json());

          if (res.success && res.history && res.history.length > 0) {
            const formatted = res.history.flatMap((h: any) => [
              {
                id: `u_${h.id}`,
                sender: 'user' as const,
                text: h.userMessage,
                time: new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
              {
                id: `a_${h.id}`,
                sender: 'assistant' as const,
                text: h.aiResponse,
                time: new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
            setMessages(formatted);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Default welcome message if empty
      setMessages([
        {
          id: 'welcome_1',
          sender: 'assistant',
          text:
            language === 'gu'
              ? 'નમસ્તે! હું એગ્રીસ્માર્ટ એઆઈ સહાયક છું. તમે મને ખેતી પદ્ધતિઓ, એપીએમસી બજાર ભાવો, અથવા પાકની માંગ વિશે પૂછી શકો છો.'
              : language === 'hi'
              ? 'नमस्ते! मैं एग्रीस्मार्ट एआई कृषि सलाहकार हूँ। आप मुझसे वर्तमान मंडी भाव, फसल मांग पूर्वानुमान, या जैविक खाद व कीट नियंत्रण के बारे में कुछ भी पूछ सकते हैं।'
              : 'Namaste! I am AgriSmart Assistant, your intelligent agricultural economist. Ask me anything about crop demand forecasts, APMC mandi rates, pest control, or fair pricing!',
          time: 'Just now',
        },
      ]);
    }
    loadHistory();
  }, [user, language]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleClearHistory = async () => {
    if (confirm('Clear conversation history?')) {
      if (user) {
        await fetch('/api/ai/history', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('agrismart_token')}` },
        });
      }
      setMessages([]);
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'user' as const,
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          userId: user?.id || 1,
        }),
      }).then((r) => r.json());

      const assistantMsg = {
        id: String(Date.now() + 1),
        sender: 'assistant' as const,
        text: res.reply || 'No response received from AgriSmart Assistant.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: 'Network advisory: APMC market servers busy. Please retry in a moment.',
          time: 'Now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts =
    language === 'gu'
      ? ['આ અઠવાડિયે કઈ શાકભાજી વેચવી જોઈએ?', 'ટમેટાં માટે શ્રેષ્ઠ એપીએમસી ભાવ ક્યાં છે?', 'ઓર્ગેનિક ખાતર બનાવવા માટેની પદ્ધતિ']
      : language === 'hi'
      ? ['मुझे इस सप्ताह क्या बेचना चाहिए?', 'टमाटर का मंडी भाव क्या रहेगा?', 'गेहूं में जैविक कीट नियंत्रण']
      : user?.role === 'farmer'
      ? ['What should I sell this week?', 'Best time to sell tomatoes?', 'Organic pest control for wheat']
      : ['Which vegetables are available near me?', 'How to place a direct farm order?', 'Are prices fair compared to APMC?'];

  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-slate-900 transition-colors">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-emerald-800 p-3.5 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 border border-emerald-500/40 shadow-inner">
            <Sparkles className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-sm font-bold">AgriSmart AI Assistant</h2>
            <p className="text-[10px] text-emerald-200">Multilingual Gemini 3.8 • Live APMC Link</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Multilingual Switcher: EN / HI / GU */}
          <div className="flex items-center rounded-lg bg-emerald-900/60 p-0.5 border border-emerald-700/50">
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                language === 'en' ? 'bg-white text-emerald-900' : 'text-emerald-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                language === 'hi' ? 'bg-white text-emerald-900' : 'text-emerald-200'
              }`}
            >
              हिं
            </button>
            <button
              onClick={() => setLanguage('gu' as any)}
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                language === ('gu' as any) ? 'bg-white text-emerald-900' : 'text-emerald-200'
              }`}
            >
              ગુજ
            </button>
          </div>

          <button
            onClick={handleClearHistory}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700/60 text-emerald-200 hover:text-white"
            title="Clear Chat History"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white mt-1 shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                m.sender === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none whitespace-pre-line'
              }`}
            >
              <div>{m.text}</div>
              <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400">
                <span>{m.time}</span>
                {m.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(m.text)}
                    className="hover:text-emerald-600 ml-2"
                    title="Audio Speech"
                  >
                    <Volume2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
            <span>AgriSmart Assistant querying APMC & ML forecasts...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts Pills */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/40 px-3 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 pb-6 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={
            language === 'gu'
              ? 'ખેતી અથવા બજાર ભાવો વિશે પૂછો...'
              : language === 'hi'
              ? 'अपनी फसल या भाव के बारे में पूछें...'
              : 'Ask crop prices, harvest timing, orders...'
          }
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3.5 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow hover:bg-emerald-600 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
