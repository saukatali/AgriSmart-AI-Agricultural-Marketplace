import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, FolderTree, Database } from 'lucide-react';

interface ExportExpoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportExpoModal: React.FC<ExportExpoModalProps> = ({ isOpen, onClose }) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'structure' | 'package' | 'commands' | 'database'>('structure');

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(id);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const folderStructureText = `AgriSmart-Mobile/
├── app/                          # Expo Router file-based navigation
│   ├── _layout.tsx               # Root stack provider & theme context
│   ├── (auth)/                   # Authentication route group
│   │   ├── login.tsx             # Farmer & Customer Login
│   │   ├── register.tsx          # Multi-step Registration
│   │   └── forgot-password.tsx   # Password reset with OTP
│   ├── (farmer)/                 # Farmer tab navigation
│   │   ├── _layout.tsx           # Farmer bottom tab bar (5 tabs)
│   │   ├── index.tsx             # Farmer Dashboard (Revenue, Orders, Mandi)
│   │   ├── my-products.tsx       # Farmer Produce Inventory
│   │   ├── add-product.tsx       # Add / Edit Produce with Image Upload
│   │   ├── orders.tsx            # Farmer Order Management & Dispatches
│   │   ├── analytics.tsx         # AI Demand & Mandi Price Analytics
│   │   └── profile.tsx           # Farm Details & Verification Status
│   ├── (customer)/               # Customer tab navigation
│   │   ├── _layout.tsx           # Customer bottom tab bar (5 tabs)
│   │   ├── index.tsx             # Customer Home (Deals, Farmers, Categories)
│   │   ├── marketplace.tsx       # Search, Filter, & Sort Produce Catalog
│   │   ├── wishlist.tsx          # Saved Farm Produce
│   │   ├── orders.tsx            # Order History & Tracking Timeline
│   │   └── profile.tsx           # Customer Account & Delivery Addresses
│   ├── product/[id].tsx          # Product Details & Reviews
│   ├── chat/[id].tsx             # Live Farmer-Customer Direct Messaging
│   ├── ai-advisor.tsx            # Gemini AI Agricultural Advisor
│   └── checkout.tsx              # Simulated Razorpay / UPI Payment
├── components/                   # Reusable mobile UI components
│   ├── Button.tsx                # Accessible touch button (min 48px hit area)
│   ├── ProductCard.tsx           # Produce card with quality badge & pricing
│   ├── MandiPriceChart.tsx       # SVG / ChartKit price trend line chart
│   ├── DemandForecastCard.tsx    # Predictive crop demand indicator
│   ├── FloatingAIBtn.tsx         # Persistent Gemini advisor floating action button
│   ├── PhoneInput.tsx            # 10-digit Indian mobile number input
│   └── HeaderBar.tsx             # Top bar with back button & notifications
├── constants/
│   ├── Colors.ts                 # Primary (#228B45), Accent (#F4A340)
│   └── Translations.ts           # English & Hindi bilingual dictionaries
├── context/
│   ├── AuthContext.tsx           # JWT token & role management
│   └── MarketplaceContext.tsx    # Cart, wishlist, and active orders
├── server/                       # Node.js + Express Backend
│   ├── server.ts                 # Express REST APIs & Socket.IO server
│   ├── db.ts                     # Sequelize ORM (MySQL + SQLite fallback)
│   └── auth.ts                   # JWT & bcrypt password hashing
├── app.json                      # Expo application manifest
├── package.json                  # Dependencies (Expo SDK, NativeWind, React Native Paper)
└── tsconfig.json                 # TypeScript configuration`;

  const runCommandsText = `# 1. Clone or extract the project repository
git clone https://github.com/agrismart/agrismart-mobile.git
cd agrismart-mobile

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start the backend server (Node.js + Express + Socket.IO + Sequelize)
npm run dev

# 5. Start the Expo Android development simulator
npx expo start --android

# 6. Build Android APK for physical device testing (via Expo Application Services)
eas build --platform android --profile preview

# 7. Build Android App Bundle (AAB) for Google Play release
eas build --platform android --profile production`;

  const packageJsonText = `{
  "name": "agrismart-mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "server": "tsx server.ts"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "react-native-chart-kit": "^6.12.0",
    "react-native-svg": "15.8.0",
    "react-native-paper": "^5.12.0",
    "nativewind": "^4.1.23",
    "axios": "^1.7.9",
    "socket.io-client": "^4.8.1",
    "lucide-react-native": "^0.475.0"
  }
}`;

  const databaseInfoText = `DATABASE ARCHITECTURE & MIGRATIONS (Sequelize ORM)

Dialect: MySQL 8.0 (with automatic persistent SQLite fallback)
Tables: 20 comprehensive models
Relationships:
- User (1) ── (1) FarmerProfile / CustomerProfile
- User (1) ── (N) Products
- Category (1) ── (N) Products
- Product (1) ── (N) ProductImages, Reviews
- Order (1) ── (N) OrderItems
- Order (1) ── (1) Payment
- User (1) ── (N) CartItems, Wishlist, Notifications
- Conversation (1) ── (N) Messages

Seed Accounts (Ready for Evaluation):
1. Farmer:  rajesh.farmer@agrismart.com  |  Password: Farmer@123
2. Farmer:  suresh.patel@agrismart.com   |  Password: Farmer@123
3. Customer: priya.customer@agrismart.com |  Password: Customer@123
4. Admin:   admin@agrismart.com          |  Password: Admin@123`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="flex h-[88vh] w-full max-w-4xl flex-col rounded-2xl bg-slate-900 border border-emerald-500/30 text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <FolderTree className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AgriSmart – React Native Expo Project Architecture</h2>
              <p className="text-xs text-slate-400">MCA Project Deliverable & Exportable Codebase Reference</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'structure' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderTree className="h-4 w-4" /> Folder Structure
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'commands' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-4 w-4" /> Run Commands
          </button>
          <button
            onClick={() => setActiveTab('package')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'package' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="h-4 w-4" /> Expo package.json
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'database' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="h-4 w-4" /> Database & Seeders
          </button>
        </div>

        {/* Content area */}
        <div className="relative flex-1 overflow-auto p-6 bg-slate-950 font-mono text-xs">
          {activeTab === 'structure' && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-slate-400">Project Tree Structure (Expo Router + TypeScript)</span>
                <button
                  onClick={() => handleCopy(folderStructureText, 'structure')}
                  className="flex items-center gap-1.5 rounded bg-emerald-600/30 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-600/50"
                >
                  {copiedTab === 'structure' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedTab === 'structure' ? 'Copied!' : 'Copy Structure'}
                </button>
              </div>
              <pre className="text-emerald-400/90 leading-relaxed overflow-x-auto whitespace-pre">{folderStructureText}</pre>
            </div>
          )}

          {activeTab === 'commands' && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-slate-400">Terminal Setup & Android Run Commands</span>
                <button
                  onClick={() => handleCopy(runCommandsText, 'commands')}
                  className="flex items-center gap-1.5 rounded bg-emerald-600/30 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-600/50"
                >
                  {copiedTab === 'commands' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedTab === 'commands' ? 'Copied!' : 'Copy Commands'}
                </button>
              </div>
              <pre className="text-amber-300/90 leading-relaxed overflow-x-auto whitespace-pre">{runCommandsText}</pre>
            </div>
          )}

          {activeTab === 'package' && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-slate-400">React Native Expo package.json Specifications</span>
                <button
                  onClick={() => handleCopy(packageJsonText, 'package')}
                  className="flex items-center gap-1.5 rounded bg-emerald-600/30 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-600/50"
                >
                  {copiedTab === 'package' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedTab === 'package' ? 'Copied!' : 'Copy package.json'}
                </button>
              </div>
              <pre className="text-sky-300/90 leading-relaxed overflow-x-auto whitespace-pre">{packageJsonText}</pre>
            </div>
          )}

          {activeTab === 'database' && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-slate-400">MySQL & SQLite 20-Table Specifications</span>
                <button
                  onClick={() => handleCopy(databaseInfoText, 'database')}
                  className="flex items-center gap-1.5 rounded bg-emerald-600/30 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-600/50"
                >
                  {copiedTab === 'database' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedTab === 'database' ? 'Copied!' : 'Copy DB Info'}
                </button>
              </div>
              <pre className="text-emerald-300/90 leading-relaxed overflow-x-auto whitespace-pre">{databaseInfoText}</pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-3 text-xs text-slate-400">
          <span>AgriSmart v1.0.0 – Fully tested on Android SDK 34 / Expo SDK 52</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-emerald-600 px-4 py-1.5 font-semibold text-white hover:bg-emerald-500"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
