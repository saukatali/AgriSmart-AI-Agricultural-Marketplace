import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'gu';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    gu?: string;
  };
}

export const translations: Translations = {
  appName: { en: 'AgriSmart', hi: 'एग्रीस्मार्ट' },
  tagline: { en: 'AI-Powered Agricultural Marketplace', hi: 'एआई-संचालित कृषि बाज़ार' },
  home: { en: 'Home', hi: 'होम' },
  marketplace: { en: 'Marketplace', hi: 'मंडी/बाज़ार' },
  orders: { en: 'Orders', hi: 'ऑर्डर्स' },
  myProducts: { en: 'My Products', hi: 'मेरी फसलें' },
  analytics: { en: 'Analytics', hi: 'एनालिटिक्स' },
  wishlist: { en: 'Wishlist', hi: 'पसंदीदा' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल' },
  aiAdvisor: { en: 'AI Agri-Advisor', hi: 'एआई कृषि सलाहकार' },
  login: { en: 'Login', hi: 'लॉग इन' },
  register: { en: 'Register', hi: 'पंजीकरण' },
  logout: { en: 'Logout', hi: 'लॉग आउट' },
  farmer: { en: 'Farmer', hi: 'किसान' },
  customer: { en: 'Customer', hi: 'ग्राहक' },
  admin: { en: 'Admin', hi: 'प्रशासक' },
  freshProduce: { en: 'Fresh Farm Produce', hi: 'खेत से ताज़ा उपज' },
  mandiPrice: { en: 'APMC Mandi Rate', hi: 'मंडी भाव' },
  directPrice: { en: 'Direct Farm Price', hi: 'खेत का सीधा भाव' },
  perKg: { en: '/ kg', hi: '/ किलो' },
  addToCart: { en: 'Add to Cart', hi: 'कार्ट में जोड़ें' },
  buyNow: { en: 'Buy Direct', hi: 'सीधे खरीदें' },
  addProduct: { en: 'List New Produce', hi: 'नई फसल जोड़ें' },
  demandForecast: { en: 'Demand Forecast', hi: 'मांग का पूर्वानुमान' },
  priceAnalytics: { en: 'Price Analytics', hi: 'मूल्य विश्लेषण' },
  searchPlaceholder: { en: 'Search tomatoes, wheat, mangoes...', hi: 'टमाटर, गेहूं, आम खोजें...' },
  qualityGrade: { en: 'Quality Grade', hi: 'गुणवत्ता ग्रेड' },
  availableQty: { en: 'Available Stock', hi: 'उपलब्ध मात्रा' },
  harvestDate: { en: 'Harvest Date', hi: 'कटाई की तिथि' },
  farmLocation: { en: 'Farm Location', hi: 'खेत का स्थान' },
  verifiedFarmer: { en: 'Verified Producer', hi: 'प्रमाणित किसान' },
  contactFarmer: { en: 'Chat with Farmer', hi: 'किसान से बात करें' },
  submitReview: { en: 'Write a Review', hi: 'समीक्षा लिखें' },
  highDemand: { en: 'High Demand', hi: 'भारी मांग' },
  recommendedAction: { en: 'AI Recommendation', hi: 'एआई सलाह' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  speakText: (text: string) => void;
  isSpeaking: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('agrismart_lang') as Language) || 'en';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agrismart_lang', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'gu' ? 'gu-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, speakText, isSpeaking }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
