import React from 'react';
import { Sparkles } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';

export const FloatingAIAssistant: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useMarketplace();
  const { language } = useLanguage();

  // Hide on auth, onboarding, and already on chat screen
  const hiddenScreens = ['splash', 'onboarding', 'welcome', 'role_selection', 'login', 'register', 'ai_chatbot'];
  if (hiddenScreens.includes(currentScreen)) return null;

  return (
    <button
      onClick={() => setCurrentScreen('ai_chatbot')}
      aria-label="Open AgriSmart AI Assistant"
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-500 px-4 py-3 text-white shadow-xl shadow-emerald-900/30 active:scale-95 transition-all hover:shadow-emerald-700/40"
    >
      <div className="relative flex items-center justify-center">
        <Sparkles className="h-5 w-5 animate-pulse text-amber-200" />
      </div>
      <span className="text-xs font-bold tracking-tight">
        {language === 'hi' ? 'एआई सलाहकार' : 'AgriAI'}
      </span>
    </button>
  );
};
