import { Home, ShoppingBag, ShoppingCart, BarChart3, User, Heart, Package, PlusCircle, Shield, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';

export const BottomNavigation: React.FC = () => {
  const { user } = useAuth();
  const { currentScreen, setCurrentScreen, cart } = useMarketplace();
  const { t } = useLanguage();

  const isFarmer = user?.role === 'farmer';
  const isAdmin = user?.role === 'admin';

  // Do not render bottom nav on auth / splash / onboarding screens
  const authScreens = ['splash', 'onboarding', 'welcome', 'role_selection', 'login', 'register'];
  if (authScreens.includes(currentScreen)) return null;

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200/80 bg-white/95 px-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      {isAdmin ? (
        // Admin 5-Tab Navigation
        <>
          <button
            onClick={() => setCurrentScreen('admin_dashboard')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'admin_dashboard'
                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Shield className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Admin</span>
          </button>

          <button
            onClick={() => setCurrentScreen('marketplace')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'marketplace'
                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Catalog</span>
          </button>

          <button
            onClick={() => setCurrentScreen('orders')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'orders'
                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Orders</span>
          </button>

          <button
            onClick={() => setCurrentScreen('reports')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'reports'
                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Reports</span>
          </button>

          <button
            onClick={() => setCurrentScreen('settings')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'settings'
                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('profile')}</span>
          </button>
        </>
      ) : isFarmer ? (
        // Farmer 5-Tab Navigation
        <>
          <button
            onClick={() => setCurrentScreen('farmer_dashboard')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'farmer_dashboard'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('home')}</span>
          </button>

          <button
            onClick={() => setCurrentScreen('add_product')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'add_product'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('myProducts')}</span>
          </button>

          <button
            onClick={() => setCurrentScreen('orders')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'orders'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('orders')}</span>
          </button>

          <button
            onClick={() => setCurrentScreen('farmer_analytics')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'farmer_analytics' || currentScreen === 'ai_insights' || currentScreen === 'demand_forecast'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('analytics')}</span>
          </button>

          <button
            onClick={() => setCurrentScreen('farmer_profile')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'farmer_profile'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('profile')}</span>
          </button>
        </>
      ) : (
        // Customer 5-Tab Navigation
        <>
          <button
            onClick={() => setCurrentScreen('customer_dashboard')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'customer_dashboard'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('home')}</span>
          </button>

          <button
            onClick={() => setCurrentScreen('marketplace')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'marketplace'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('marketplace')}</span>
          </button>

          <button
            onClick={() => setCurrentScreen('orders')}
            className={`relative flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'orders'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-0.5 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                {totalCartCount}
              </span>
            )}
            <span className="text-[10px] mt-0.5 tracking-tight">{t('orders')}</span>
          </button>

          <button
            onClick={() => setCurrentScreen('demand_forecast')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'demand_forecast' || currentScreen === 'ai_insights'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Heart className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('wishlist')}</span>
          </button>

          <button
            onClick={() => setCurrentScreen('customer_profile')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              currentScreen === 'customer_profile'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">{t('profile')}</span>
          </button>
        </>
      )}
    </div>
  );
};
