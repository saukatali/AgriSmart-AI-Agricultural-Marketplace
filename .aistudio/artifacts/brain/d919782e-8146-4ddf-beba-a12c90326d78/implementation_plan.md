# AgriSmart – Phase 4: Backend Completion, Database & Architecture Plan

This phase delivers a robust, production-grade enterprise backend for AgriSmart using Node.js, Express, TypeScript, Sequelize ORM with dual MySQL / persistent SQLite auto-fallback, simulated Razorpay / UPI payments, Socket.IO real-time chat, and seamless client integration across all 23 screens.

### User Review & Critical Decisions

> [!IMPORTANT]
> - **Database Strategy**: Dual-dialect Sequelize configuration supporting MySQL (production credentials via env) with zero-config auto-fallback to persistent SQLite file (`agrismart.sqlite`). This guarantees zero connection crash in local environments while remaining 100% MySQL migration ready.
> - **Payment Gateway**: Simulated Razorpay & UPI checkout with server-side order generation (`order_id`), mock UPI QR/VPA validation, and payment signature verification stored in the `payments` table.
> - **Real-Time Communication**: Socket.IO server with room-based farmer-customer messaging, coupled with HTTP REST polling fallback for reliable mobile connectivity.

---

### 1. Overview & Database Architecture

#### Complete 20-Table Database Schema
```
┌────────────────────────────────────────────────────────────────────────┐
│                        AGRISMART DATABASE SCHEMA                       │
├────────────────────────────────────────────────────────────────────────┤
│ USER & PROFILE SUBSYSTEM                                               │
│ ├─ users (id, name, email, mobile, password, role, state, city)        │
│ ├─ farmer_profiles (id, userId, farmName, experience, verified, stats) │
│ └─ customer_profiles (id, userId, name, mobile, address, totalOrders)  │
├────────────────────────────────────────────────────────────────────────┤
│ CATALOG & PRODUCE SUBSYSTEM                                            │
│ ├─ product_categories (id, name, slug, icon, description)              │
│ ├─ products (id, farmerId, categoryId, name, price, qty, grade, stats) │
│ ├─ product_images (id, productId, imageUrl, isPrimary)                 │
│ └─ reviews (id, productId, userId, userName, rating, comment)          │
├────────────────────────────────────────────────────────────────────────┤
│ COMMERCE & ORDER SUBSYSTEM                                             │
│ ├─ cart_items (id, userId, productId, quantity)                        │
│ ├─ wishlist (id, userId, productId)                                    │
│ ├─ orders (id, orderNumber, customerId, farmerId, totalAmount, status) │
│ ├─ order_items (id, orderId, productId, name, quantity, unitPrice)    │
│ └─ payments (id, orderId, paymentId, amount, status, method, sign)    │
├────────────────────────────────────────────────────────────────────────┤
│ REAL-TIME CHAT & NOTIFICATIONS                                         │
│ ├─ conversations (id, farmerId, customerId, lastMessageAt)             │
│ ├─ messages (id, conversationId, senderId, text, isOffer, offerPrice)  │
│ └─ notifications (id, userId, title, message, type, isRead)            │
├────────────────────────────────────────────────────────────────────────┤
│ ANALYTICS & AI PREDICTIONS                                             │
│ ├─ sales_history (id, farmerId, productId, quantityKg, revenue, date)  │
│ ├─ market_prices (id, cropName, mandiName, minPrice, maxPrice, modal)  │
│ ├─ demand_predictions (id, cropName, region, demandScore, trend)       │
│ ├─ price_predictions (id, cropName, currentMandi, predicted7d, delta)  │
│ └─ ai_chat_history (id, userId, role, prompt, response, language)      │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2. API Endpoints Architecture

Organized modular Express routers under `/api`:
- **Auth & Users (`/api/auth`, `/api/users`)**: Register, Login, Logout, Forgot Password, Refresh/Me, Profile update.
- **Produce & Catalog (`/api/products`, `/api/categories`)**: Search, filter by price/location, sort, pagination, add product, farmer product management.
- **Cart & Wishlist (`/api/cart`, `/api/wishlist`)**: Sync cart, add/remove, quantity increment, toggle wishlist.
- **Orders & Payments (`/api/orders`, `/api/payments`)**: Place multi-item order, generate Razorpay order ID, verify mock UPI/card signature, track status timeline.
- **Live Chat (`/api/chat`)**: List conversations, load thread history, negotiate produce prices.
- **Notifications (`/api/notifications`)**: Fetch alerts, mark as read, receive mandi price spikes.
- **Analytics & Mandi Prices (`/api/analytics`)**: Real sales history, top-selling produce, mandi price benchmarks.
- **AI Predictions & Gemini Chat (`/api/ai`)**: Multi-turn bilingual Gemini agricultural advisor, 7-day crop demand curve, price forecast.

---

### 3. Key Technical Decisions & Trade-Offs

- **Decision 1: Dual-Dialect Sequelize (MySQL + SQLite Fallback)**:
  - *Chosen Approach*: Checks for valid MySQL environment variables (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`). If not configured or connection fails, seamlessly falls back to persistent SQLite file `agrismart.sqlite`.
  - *Why*: Prevents fatal Node process aborts while maintaining identical ORM models, relations, indexes, and migrations.
- **Decision 2: Simulated Razorpay & UPI Gateway**:
  - *Chosen Approach*: Implements standard Razorpay signature hashing protocol (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`) allowing students and evaluators to test full end-to-end checkout with success receipts.
- **Decision 3: Complete Mobile Screen Integration**:
  - *Chosen Approach*: Every screen in the Android Phone Simulator connects to real API endpoints with loading indicators, validation errors, and state reflection (e.g. buying a product updates the orders screen, adding a product shows immediately in the marketplace).

---

### 4. Implementation Steps
1. Install `socket.io` and `socket.io-client` for real-time chat.
2. Expand `server/db.ts` to include all 20 tables with associations, foreign keys, and indexes.
3. Organize modular routers or unified controller in `server.ts` with error handling middleware.
4. Wire frontend API calls in `src/services/api.ts` and React contexts (`AuthContext`, `MarketplaceContext`, `LanguageContext`).
5. Build all 23 mobile screens and the interactive Android Simulator shell.
6. Verify applet compilation and runtime stability.
