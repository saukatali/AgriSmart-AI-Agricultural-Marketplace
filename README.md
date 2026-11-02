# AgriSmart – AI-Powered Agricultural Marketplace & Android Mobile Application

> **MCA Capstone Project**  
> *An End-to-End Direct Farmer-to-Consumer Digital Marketplace with APMC Mandi Price Analytics, Machine Learning Demand Forecasting, Socket.IO Real-Time Chat, and Multilingual Gemini AI Advisor.*

---

## 1. Project Introduction
**AgriSmart** is a production-grade, full-stack agricultural platform designed for Indian smallholder farmers and retail consumers. The application operates as an interactive Android mobile application (Expo / React Native) supported by a robust Node.js/TypeScript backend, persistent relational database architecture, a specialized Python AI/ML microservice, and Google Gemini Generative AI integration (`gemini-3.8-flash`).

By providing direct farm-to-table transactions, AgriSmart eliminates multi-tier commission brokers, ensures fair price discovery based on live APMC mandi benchmarks, and provides actionable crop demand intelligence.

---

## 2. Problem Statement
In traditional Indian agricultural supply chains:
1. **Middlemen Exploitation:** Smallholder farmers receive as little as 25%–35% of the retail price paid by urban consumers due to a cascade of middlemen and wholesale commission agents (*arhtiyas*).
2. **Information Asymmetry:** Farmers lack reliable, real-time demand forecasts and APMC modal price trends, leading to distress selling during post-harvest gluts.
3. **Digital & Language Barriers:** Most digital platforms are English-only and desktop-centric, alienating rural farmers who require intuitive mobile interfaces and regional language voice/text assistance (Hindi and Gujarati).
4. **Logistics & Counterparty Risk:** Direct transactions suffer from lack of verified buyer identities, trust deficits in grading/quality, and absent payment escrow mechanisms.

---

## 3. Project Objectives
- **Empower Farmers:** Enable farmers to list produce with quality grades, set fair farm-gate prices, and negotiate with buyers without intermediary deductions.
- **Consumer Direct Access:** Allow urban consumers and bulk cooperative societies to browse fresh farm produce, view farmer profiles, track orders, and transact securely.
- **Predictive AI Insights:** Deliver 7-day and 30-day crop demand forecasts and price fluctuation trajectories using time-aware machine learning models.
- **Multilingual Generative AI Advisor:** Integrate Google Gemini 3.8 Flash to answer agronomy, pest control, APMC mandi trend, and personalized sales strategy questions in English, Hindi, and Gujarati.
- **Mobile First Android Distribution:** Deliver an Android mobile application configured with Expo Application Services (EAS) for direct APK sideloading and Play Store distribution.

---

## 4. Technology Stack

| Layer | Technologies |
|---|---|
| **Mobile Client** | React Native, Expo SDK 52, TypeScript, Tailwind CSS / NativeWind, Lucide Icons |
| **Simulator & Web** | React 19, Vite 6, Custom Android Phone Simulator with Frameless/Framed Modes |
| **Backend API** | Node.js (v20+), Express.js, TypeScript (`tsx`), Socket.IO v4 (WebSockets) |
| **Database & ORM** | MySQL 8.0, Sequelize ORM (with zero-native pure TS JSON persistence engine) |
| **Authentication** | JWT (JSON Web Tokens), `bcryptjs` password hashing, Role-Based Access Control (RBAC) |
| **AI / Machine Learning** | Python 3.10, Scikit-learn, Moving Average Baselines, Time-Aware Chronological Validation |
| **Generative AI** | `@google/genai` TypeScript SDK, Model: `models/gemini-3.8-flash` |
| **Mobile Build & Release** | Expo Application Services (EAS), Package: `com.agrismart.mobile`, Android SDK 34 |

---

## 5. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ANDROID MOBILE CLIENT                           │
│     Expo Router (v4) • 26 Screens • NativeWind • Socket.IO Client      │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ HTTP REST / WebSocket
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   NODE.JS EXPRESS BACKEND SERVER                       │
│  - JWT & RBAC Middleware (/api/auth, /api/admin, /api/analytics)       │
│  - Socket.IO Real-Time Chat & Negotiation Engine                       │
│  - Simulated Razorpay / UPI Payment Escrow Verification                │
│  - Gemini AI Contextual Personalization Bridge                         │
└──────────────────────┬─────────────────────────┬───────────────────────┘
                       │                         │
                       ▼                         ▼
┌─────────────────────────────────┐   ┌──────────────────────────────────┐
│      DATABASE ARCHITECTURE      │   │     PYTHON ML MICROSERVICE       │
│  - 20 Models & Associations     │   │  - 1,800 Synthetic Mandi Records │
│  - Sequelize ORM Interface      │   │  - Time-Aware Demand Forecaster  │
│  - Zero-Native JSON Persistence │   │  - Elastic Price Regressor       │
│    (agrismart_db.json)          │   │  - Port 8000 (Dynamic Fallback)  │
└─────────────────────────────────┘   └──────────────────────────────────┘
```

---

## 6. Database Schema (20 Tables)

1. **`users`**: User credentials, email, 10-digit mobile, hashed password, role (`farmer`, `customer`, `admin`), state, city, address, verification status.
2. **`farmer_profiles`**: Farm name, location, experience, verification status, rating, total sales (kg).
3. **`customer_profiles`**: Delivery addresses, order history, default payment preferences.
4. **`categories`**: Vegetables, Fruits, Grains, Pulses, Spices, Organic, Others.
5. **`products`**: Farmer foreign key, category, name, price per kg, stock quantity, quality grade, harvest date, availability.
6. **`product_images`**: Multi-image attachments per produce listing.
7. **`orders`**: Order number, customer/farmer FKs, total amount, status (8 stages: Pending, Accepted, Processing, Ready for Pickup, Shipped, Delivered, Cancelled, Rejected).
8. **`order_items`**: Line items with unit price, ordered quantity, subtotal.
9. **`payments`**: Payment ID, currency, status (`captured`), method (`UPI`, `Cash on Delivery`, `Card`), transaction signature.
10. **`cart_items`**: Shopping cart persistence with quantity limits.
11. **`wishlist`**: Saved items per consumer account.
12. **`reviews`**: Ratings (1 to 5 stars) and comments linked to products and buyers.
13. **`conversations`**: Direct chat threads between farmer and customer.
14. **`messages`**: Text, timestamps, read receipts, and live price negotiation offers.
15. **`notifications`**: Order dispatches, mandi price alerts, verification updates.
16. **`sales_history`**: Historical daily sales records for time-series analysis.
17. **`market_prices`**: Real-time APMC Mandi benchmark rates across Indian states.
18. **`demand_predictions`**: Crop-wise demand scores and momentum indicators.
19. **`price_predictions`**: 7-day predicted mandi rates and farmer margin advice.
20. **`ai_chat_history`**: Contextual logging of questions asked to the Gemini assistant.
21. **`moderation_reports`**: Reported listings and user moderation logs.
22. **`platform_activities`**: Chronological platform event stream.

---

## 7. Key Features

- **Farmer Marketplace Management:** Instant produce publishing, stock management, harvest date tagging, quality certification badges.
- **Consumer Discovery:** Full catalog with search by produce name, category filter chips, location radius, and sorting by price or popularity.
- **Cart & Order Lifecycle:** Stock reservation checks preventing over-ordering, 8-stage fulfillment status transitions, simulated UPI/Razorpay payment verification.
- **Interactive Analytics Dashboards:**
  - Revenue line chart with month-by-month trajectory and hover points.
  - Product sales horizontal/vertical bar chart showing kg sold vs revenue.
  - Order status donut/pie chart with percentage breakdowns.
  - Demand forecast and price trend comparison curves.
  - Customer review star breakdown (5-star to 1-star).
- **Admin Governance & Moderation:**
  - Platform-wide GMV, user split, and order counts.
  - Farmer verification queue with document approval/rejection actions.
  - User directory with role filtering and account statuses.
  - Listing moderation with takedown capabilities.
- **Formal Audit Reporting & PDF Export:**
  - Date range filters (7d, 30d, 90d, 1y).
  - Itemized product performance table.
  - Direct PDF export / Print action formatted with letterhead styling.
  - Section 10(1) Agricultural Income Tax exemption clause declaration.
- **Real-Time Direct Chat:** Socket.IO messaging with live typing indicator, read receipts, and in-chat price bargaining offers.
- **Multilingual Gemini AI Assistant:** Integrated with `@google/genai` (`gemini-3.8-flash`) supporting English, Hindi, and Gujarati with speech audio synthesis.

---

## 8. Installation Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or bun
- Python 3.10+ (for ML microservice)
- Android Studio & SDK (for local Android emulator testing)
- EAS CLI: `npm install -g eas-cli`

### Setup Steps
```bash
# Clone the repository
git clone https://github.com/agrismart/agrismart-mobile.git
cd agrismart-mobile

# Install Node.js dependencies
npm install

# Configure environment variables
cp .env.example .env
```

---

## 9. Backend Execution

```bash
# Launch Node.js + Express + Socket.IO server (with Vite mounted)
npm run dev
# The backend initializes database tables, seeds demo data, and runs on port 3000
```

---

## 10. Frontend Execution

The frontend is served in tandem with the Express backend on `http://localhost:3000`.  
- For Expo mobile development:
```bash
npx expo start
```
- Press `a` in the terminal to launch the Android emulator.

---

## 11. Python AI Service Execution

The Python ML microservice starts automatically in the background when `server.ts` launches.  
To run it independently:
```bash
python3 ai_service/main.py
# Microservice listens on http://localhost:8000
```
- Evaluates 1,800 synthetic agricultural records without lookahead bias.
- Exposes `/api/forecast/demand`, `/api/forecast/price`, and `/api/forecast/model-performance`.

---

## 12. Gemini API Configuration

1. Obtain an API key from Google AI Studio (`https://aistudio.google.com/`).
2. Add your key to `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
3. The server securely communicates with `gemini-3.8-flash` on the backend (`/api/ai/chat`), keeping API keys hidden from the client browser.

---

## 13. Environment Variable Configuration

Create a `.env` file based on `.env.example`:
```env
# Application Server
PORT=3000
NODE_ENV=development

# JWT Secret Key
JWT_SECRET=agrismart_super_secret_jwt_key_2026_mca

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Python AI Service Port
PYTHON_SERVICE_PORT=8000
```

---

## 14. Android Build Instructions (EAS Build)

### 1. Build Android APK for Physical Device Testing (Preview Profile)
```bash
# Login to your Expo account
eas login

# Build standalone APK
eas build --platform android --profile preview
```
*This produces a direct `.apk` file that can be downloaded and installed on any Android phone (Android 8.0+ / SDK 34).*

### 2. Build Android App Bundle (AAB) for Google Play Release (Production Profile)
```bash
eas build --platform android --profile production
```
*Generates an optimized `.aab` ready for upload to Google Play Console.*

---

## 15. Default Test & Demonstration Accounts

| Role | Email | Password | Pre-seeded Context |
|---|---|---|---|
| **Farmer (Nashik)** | `rajesh.farmer@agrismart.com` | `Farmer@123` | Vine Tomatoes, Red Onions, Sharbati Wheat, A2 Desi Ghee |
| **Farmer (Surat)** | `suresh.patel@agrismart.com` | `Farmer@123` | Alphonso Mangoes, Whole Green Cardamom |
| **Customer** | `priya.customer@agrismart.com` | `Customer@123` | Order history, Cart items, Verified Mumbai delivery address |
| **Administrator** | `admin@agrismart.com` | `Admin@123` | Full governance console, verification approvals, audit reports |

---

## 16. Future Enhancements

1. **IoT Soil Sensor Telemetry:** Direct Bluetooth Low Energy (BLE) integration with soil moisture and NPK sensors.
2. **Cold Chain Logistics Tracking:** GPS-enabled temperature monitoring during transit of perishable farm products.
3. **Smart Contract Escrow:** On-chain multi-signature milestone escrow for inter-state agricultural consignments.
4. **Computer Vision Disease Detection:** Camera-based crop leaf scanning using TensorFlow Lite mobile models.

---

*AgriSmart – Bridging the Gap Between Indian Farmers and Consumers.*
