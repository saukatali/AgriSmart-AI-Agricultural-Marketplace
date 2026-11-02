import React, { useState } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Globe,
  Wifi,
  Battery,
  Signal,
  FolderTree,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { ScreenId } from '../types';
import { BottomNavigation } from './BottomNavigation';
import { FloatingAIAssistant } from './FloatingAIAssistant';
import {
  SplashScreen,
  OnboardingScreen,
  WelcomeScreen,
  RoleSelectionScreen,
  LoginScreen,
  RegistrationScreen,
} from '../screens/AuthScreens';
import {
  FarmerDashboardScreen,
  CustomerDashboardScreen,
  MarketplaceScreen,
  ProductDetailsScreen,
  AddProductScreen,
} from '../screens/MarketplaceScreens';
import {
  AIInsightsScreen,
  DemandForecastScreen,
  PriceAnalyticsScreen,
  AIChatbotScreen,
} from '../screens/AIScreens';
import {
  ChatListScreen,
  IndividualChatScreen,
  OrdersScreen,
  OrderDetailsScreen,
  FarmerProfileScreen,
  CustomerProfileScreen,
  NotificationsScreen,
  SettingsScreen,
} from '../screens/OrderAndChatScreens';
import {
  FarmerAnalyticsScreen,
  AdminDashboardScreen,
  ReportsScreen,
} from '../screens/AnalyticsAndAdminScreens';

interface PhoneSimulatorProps {
  onOpenExport: () => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ onOpenExport }) => {
  const { user, switchRole } = useAuth();
  const { currentScreen, setCurrentScreen } = useMarketplace();
  const { language, setLanguage } = useLanguage();

  const [isFrameless, setIsFrameless] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode on document element
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Screen Router mapping
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'role_selection':
        return <RoleSelectionScreen />;
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegistrationScreen />;
      case 'farmer_dashboard':
        return <FarmerDashboardScreen />;
      case 'customer_dashboard':
        return <CustomerDashboardScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'product_details':
        return <ProductDetailsScreen />;
      case 'add_product':
        return <AddProductScreen />;
      case 'ai_insights':
        return <AIInsightsScreen />;
      case 'demand_forecast':
        return <DemandForecastScreen />;
      case 'price_analytics':
        return <PriceAnalyticsScreen />;
      case 'ai_chatbot':
        return <AIChatbotScreen />;
      case 'chat_list':
        return <ChatListScreen />;
      case 'individual_chat':
        return <IndividualChatScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'order_details':
        return <OrderDetailsScreen />;
      case 'farmer_profile':
        return <FarmerProfileScreen />;
      case 'customer_profile':
        return <CustomerProfileScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'settings':
        return <SettingsScreen onOpenExport={onOpenExport} />;
      case 'farmer_analytics':
        return <FarmerAnalyticsScreen />;
      case 'admin_dashboard':
        return <AdminDashboardScreen />;
      case 'reports':
        return <ReportsScreen />;
      default:
        return <CustomerDashboardScreen />;
    }
  };

  const screenOptions: { id: ScreenId; label: string }[] = [
    { id: 'splash', label: '1. Splash Screen' },
    { id: 'onboarding', label: '2. Onboarding (3 slides)' },
    { id: 'welcome', label: '3. Welcome Screen' },
    { id: 'role_selection', label: '4. Role Selection' },
    { id: 'login', label: '5. Login Screen' },
    { id: 'register', label: '6. Registration Screen' },
    { id: 'farmer_dashboard', label: '7. Farmer Dashboard' },
    { id: 'customer_dashboard', label: '8. Customer Dashboard' },
    { id: 'marketplace', label: '9. Marketplace Catalog' },
    { id: 'product_details', label: '10. Product Details' },
    { id: 'add_product', label: '11. Add Produce (Farmer)' },
    { id: 'ai_insights', label: '12. AI Insights' },
    { id: 'demand_forecast', label: '13. Demand Forecast (Chart)' },
    { id: 'price_analytics', label: '14. Price Analytics (Mandi)' },
    { id: 'ai_chatbot', label: '15. AI Chatbot (Gemini)' },
    { id: 'chat_list', label: '16. Chat List' },
    { id: 'individual_chat', label: '17. Individual Chat' },
    { id: 'orders', label: '18. Orders Screen' },
    { id: 'order_details', label: '19. Order Details & Timeline' },
    { id: 'farmer_profile', label: '20. Farmer Profile' },
    { id: 'customer_profile', label: '21. Customer Profile' },
    { id: 'notifications', label: '22. Notifications' },
    { id: 'settings', label: '23. Settings' },
    { id: 'farmer_analytics', label: '24. Farmer Sales Analytics (Charts)' },
    { id: 'admin_dashboard', label: '25. Admin Governance Dashboard' },
    { id: 'reports', label: '26. Sales Audit & PDF Export' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500">
      {/* Top Simulator Control Bar */}
      <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white shadow-sm">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">AgriSmart Mobile</span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                Android SDK 34
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              React Native Expo • Sequelize ORM • Gemini AI
            </div>
          </div>
        </div>

        {/* Quick Screen Jump Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={currentScreen}
              onChange={(e) => setCurrentScreen(e.target.value as ScreenId)}
              className="appearance-none rounded-lg border border-slate-700 bg-slate-800 py-1.5 pl-3 pr-8 text-xs font-semibold text-emerald-300 focus:border-emerald-500 focus:outline-none"
            >
              {screenOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Quick Role Switcher */}
          <div className="hidden sm:flex items-center rounded-lg border border-slate-700 bg-slate-800 p-0.5">
            <button
              onClick={() => {
                switchRole('farmer');
                setCurrentScreen('farmer_dashboard');
              }}
              className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                user?.role === 'farmer' ? 'bg-emerald-700 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🧑‍🌾 Farmer
            </button>
            <button
              onClick={() => {
                switchRole('customer');
                setCurrentScreen('customer_dashboard');
              }}
              className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                user?.role === 'customer' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🛒 Customer
            </button>
            <button
              onClick={() => {
                switchRole('admin');
                setCurrentScreen('admin_dashboard');
              }}
              className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                user?.role === 'admin' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🛡️ Admin
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            <span>{language === 'en' ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-300" />}
          </button>

          {/* Frame Toggle */}
          <button
            onClick={() => setIsFrameless(!isFrameless)}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            title="Toggle Device Frame"
          >
            {isFrameless ? <Smartphone className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Export Expo Code */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-500 active:scale-95 transition-all"
          >
            <FolderTree className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Expo Code</span>
          </button>
        </div>
      </header>

      {/* Main Simulator Viewport Canvas */}
      <main className="flex flex-1 items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        <div
          className={`relative transition-all duration-300 ${
            isFrameless
              ? 'h-[92vh] w-full max-w-md shadow-2xl'
              : 'h-[852px] w-[393px] rounded-[50px] border-[10px] border-slate-800/95 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-slate-700/50'
          }`}
        >
          {/* Hardware Details (When Frame is Active) */}
          {!isFrameless && (
            <>
              {/* Speaker Bar & Camera Punch Hole */}
              <div className="absolute top-2 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-slate-900 border border-slate-800"></div>
                <div className="h-1 w-10 rounded-full bg-slate-800"></div>
              </div>
            </>
          )}

          {/* Phone Display Canvas */}
          <div
            className={`relative flex h-full w-full flex-col overflow-hidden bg-white dark:bg-slate-900 ${
              isFrameless ? 'rounded-2xl' : 'rounded-[40px]'
            }`}
          >
            {/* Android Dynamic Status Bar */}
            <div className="relative z-50 flex h-9 shrink-0 items-center justify-between px-6 text-xs font-semibold text-slate-700 dark:text-slate-300 select-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
              <span className="font-mono text-[11px] font-bold">09:41</span>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="text-[10px] font-bold font-mono">5G</span>
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <div className="flex items-center gap-0.5 font-mono text-[10px]">
                  <span>98%</span>
                  <Battery className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Screen Content Viewport */}
            <div className="relative flex-1 overflow-hidden">{renderScreen()}</div>

            {/* Floating Gemini AI Assistant Button */}
            <FloatingAIAssistant />

            {/* Bottom 5-Tab Navigation Bar */}
            <BottomNavigation />

            {/* Android System Navigation Gesture Bar */}
            <div className="relative z-40 flex h-4 shrink-0 items-center justify-center bg-white/90 dark:bg-slate-900/90 pb-1">
              <div className="h-1 w-28 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
