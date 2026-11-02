import React, { useState } from 'react';
import {
  Sprout,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Truck,
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';

// ==========================================
// SCREEN 1: SPLASH SCREEN
// ==========================================
export const SplashScreen: React.FC = () => {
  const { setCurrentScreen } = useMarketplace();
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div
      onClick={() => {
        if (user) {
          setCurrentScreen(user.role === 'farmer' ? 'farmer_dashboard' : 'customer_dashboard');
        } else {
          setCurrentScreen('onboarding');
        }
      }}
      className="relative flex min-h-full flex-col items-center justify-between bg-gradient-to-b from-emerald-800 via-emerald-900 to-slate-950 p-8 text-white cursor-pointer select-none"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-700/50 border border-emerald-400/30 shadow-2xl backdrop-blur-md">
          <Sprout className="h-14 w-14 text-emerald-300 animate-bounce" />
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-md">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          {t('appName')}
        </h1>
        <p className="text-sm font-medium text-emerald-200/90 max-w-xs">
          {t('tagline')}
        </p>
      </div>

      <div className="w-full text-center pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-800/40 px-4 py-2 text-xs font-semibold text-emerald-300 border border-emerald-500/20">
          <span>Tap anywhere to launch</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
        <p className="mt-4 text-[10px] text-emerald-400/60 font-mono">
          Powered by Gemini AI • Direct APMC Mandi Link
        </p>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 2: ONBOARDING SCREEN (3 SLIDES)
// ==========================================
export const OnboardingScreen: React.FC = () => {
  const { setCurrentScreen } = useMarketplace();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      icon: <TrendingUp className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />,
      title: 'AI Price & Demand Forecast',
      titleHi: 'एआई मूल्य व मांग पूर्वानुमान',
      desc: 'Predict crop demand and APMC mandi rates using Google Gemini to get fair prices and maximize harvest revenue.',
      descHi: 'गूगल जेमिनी एआई की सहायता से फसल की मांग और सटीक मंडी भाव का पूर्वानुमान लगाएं।',
    },
    {
      icon: <Truck className="h-16 w-16 text-amber-500" />,
      title: 'Zero Middlemen Marketplace',
      titleHi: 'बिना बिचौलियों का सीधा बाज़ार',
      desc: 'Connect farmers directly with consumers, restaurants, and wholesale bulk buyers with transparent farm pricing.',
      descHi: 'किसान सीधे ग्राहकों और थोक खरीदारों से जुड़ें और 35% अधिक मुनाफा कमाएं।',
    },
    {
      icon: <ShieldCheck className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />,
      title: 'Verified Quality & Secure Escrow',
      titleHi: 'सत्यापित गुणवत्ता व सुरक्षित भुगतान',
      desc: 'Grade A export quality produce, instant UPI / Razorpay checkout, and live order tracking from farm to doorstep.',
      descHi: 'ग्रेड-ए प्रमाणित उपज, आसान यूपीआई भुगतान और खेत से घर तक सुरक्षित डिलीवरी।',
    },
  ];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      setCurrentScreen('welcome');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-between bg-white dark:bg-slate-900 p-6 transition-colors">
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setCurrentScreen('welcome')}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-col items-center text-center my-auto px-4">
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800/40 shadow-inner">
          {slides[slide].icon}
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          {slides[slide].title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs">
          {slides[slide].desc}
        </p>

        {/* Slide Indicators */}
        <div className="mt-8 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                slide === idx ? 'w-8 bg-emerald-600' : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="pb-6">
        <button
          onClick={handleNext}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition-all hover:bg-emerald-600"
        >
          <span>{slide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 3: WELCOME SCREEN
// ==========================================
export const WelcomeScreen: React.FC = () => {
  const { setCurrentScreen } = useMarketplace();
  const { switchRole } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-full flex-col justify-between bg-white dark:bg-slate-900 p-6 transition-colors">
      <div className="pt-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
          <Sprout className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Welcome to {t('appName')}
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Direct farm-to-table commerce with AI intelligence
        </p>
      </div>

      <div className="space-y-3 px-2">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
          <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2">
            Instant Demo Access:
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={async () => {
                await switchRole('farmer');
                setCurrentScreen('farmer_dashboard');
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-2.5 px-3 text-xs font-bold text-white shadow hover:bg-emerald-600 active:scale-95"
            >
              <span>Enter as Farmer</span>
            </button>
            <button
              onClick={async () => {
                await switchRole('customer');
                setCurrentScreen('customer_dashboard');
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 py-2.5 px-3 text-xs font-bold text-white shadow hover:bg-amber-500 active:scale-95"
            >
              <span>Enter as Customer</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('login')}
          className="flex w-full items-center justify-center rounded-xl bg-slate-900 dark:bg-white py-3.5 text-sm font-bold text-white dark:text-slate-900 shadow hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Sign In to Account
        </button>

        <button
          onClick={() => setCurrentScreen('role_selection')}
          className="flex w-full items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          Create New Account
        </button>
      </div>

      <div className="pb-4 text-center">
        <p className="text-[11px] text-slate-400">
          By continuing you agree to AgriSmart Terms & Mandi Guidelines.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 4: ROLE SELECTION SCREEN
// ==========================================
export const RoleSelectionScreen: React.FC = () => {
  const { setCurrentScreen } = useMarketplace();
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'customer'>('farmer');

  return (
    <div className="flex min-h-full flex-col justify-between bg-white dark:bg-slate-900 p-6 transition-colors">
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Select Your Account Type
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose how you will participate in the AgriSmart marketplace
        </p>
      </div>

      <div className="space-y-4 my-auto">
        {/* Farmer Card */}
        <div
          onClick={() => setSelectedRole('farmer')}
          className={`flex items-start gap-4 rounded-2xl border p-5 cursor-pointer transition-all ${
            selectedRole === 'farmer'
              ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
            <Sprout className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">I am a Farmer / Producer</h3>
              <input
                type="radio"
                checked={selectedRole === 'farmer'}
                onChange={() => setSelectedRole('farmer')}
                className="h-4 w-4 text-emerald-600 accent-emerald-600"
              />
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Sell crops directly, access AI mandi price predictions, manage produce stock, and receive guaranteed digital payments.
            </p>
          </div>
        </div>

        {/* Customer Card */}
        <div
          onClick={() => setSelectedRole('customer')}
          className={`flex items-start gap-4 rounded-2xl border p-5 cursor-pointer transition-all ${
            selectedRole === 'customer'
              ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md">
            <User className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">I am a Customer / Buyer</h3>
              <input
                type="radio"
                checked={selectedRole === 'customer'}
                onChange={() => setSelectedRole('customer')}
                className="h-4 w-4 text-emerald-600 accent-emerald-600"
              />
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Buy fresh organic produce direct from local farms, chat with farmers for bulk bargains, and track farm dispatches.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 pb-4">
        <button
          onClick={() => setCurrentScreen('register')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow hover:bg-emerald-600 active:scale-[0.98] transition-all"
        >
          <span>Continue as {selectedRole === 'farmer' ? 'Farmer' : 'Customer'}</span>
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => setCurrentScreen('login')}
          className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 py-2"
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 5: LOGIN SCREEN
// ==========================================
export const LoginScreen: React.FC = () => {
  const { login, switchRole, isLoading } = useAuth();
  const { setCurrentScreen } = useMarketplace();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier || !password) {
      setErrorMsg('Please enter email/mobile and password.');
      return;
    }

    const res = await login(identifier, password);
    if (res.success) {
      setSuccessMsg(res.message);
      // Wait briefly then router redirects via AuthContext
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-between bg-white dark:bg-slate-900 p-6 transition-colors overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign In</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Welcome back to AgriSmart</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Demo Fast Login Buttons */}
        <div className="mb-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Auto-fill Test Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setIdentifier('rajesh.farmer@agrismart.com');
                setPassword('Farmer@123');
              }}
              className="rounded-lg bg-emerald-600/10 dark:bg-emerald-500/20 border border-emerald-600/30 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/20 text-left"
            >
              🧑‍🌾 Farmer Account
            </button>
            <button
              type="button"
              onClick={() => {
                setIdentifier('priya.customer@agrismart.com');
                setPassword('Customer@123');
              }}
              className="rounded-lg bg-amber-600/10 dark:bg-amber-500/20 border border-amber-600/30 px-2.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-600/20 text-left"
            >
              🛒 Customer Account
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email or Mobile Number
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="rajesh.farmer@agrismart.com"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-600 accent-emerald-600"
              />
              <span>Remember session</span>
            </label>

            <button
              type="button"
              onClick={() => alert('Demo Reset OTP: 123456 has been dispatched.')}
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>

      <div className="pt-6 pb-2 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentScreen('role_selection')}
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 6: REGISTRATION SCREEN
// ==========================================
export const RegistrationScreen: React.FC = () => {
  const { register, isLoading } = useAuth();
  const { setCurrentScreen } = useMarketplace();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    state: 'Maharashtra',
    city: 'Nashik',
    address: '',
    farmName: '',
    farmLocation: '',
    farmingExperience: 5,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const res = await register(formData);
    if (res.success) {
      setSuccessMsg('Account registered successfully! Redirecting...');
      setTimeout(() => {
        setCurrentScreen(formData.role === 'farmer' ? 'farmer_dashboard' : 'customer_dashboard');
      }, 800);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-between bg-white dark:bg-slate-900 p-6 transition-colors overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Account</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Join India's AI-Powered Farm Marketplace</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-700 dark:text-emerald-300 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Role selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'farmer' })}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  formData.role === 'farmer'
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'customer' })}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  formData.role === 'customer'
                    ? 'border-amber-500 bg-amber-500 text-white'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Customer
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Patil"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 px-3 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ramesh@gmail.com"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 px-3 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 px-3 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 chars"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 px-3 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 px-3 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Farmer Specific Fields */}
          {formData.role === 'farmer' && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5 space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 mb-0.5">
                  Farm / Enterprise Name
                </label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="e.g. Patil Organic Farms"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 px-3 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 mb-0.5">
                    Farming Experience
                  </label>
                  <input
                    type="number"
                    name="farmingExperience"
                    value={formData.farmingExperience}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 px-3 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 mb-0.5">
                    City / District
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Nashik"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 px-3 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
              Delivery / Farm Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Plot No / Village / Street"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 px-3 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>
      </div>

      <div className="pt-4 pb-2 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <button
            onClick={() => setCurrentScreen('login')}
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
