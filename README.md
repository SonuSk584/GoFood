# 🍔 GoFood

A full-stack food ordering platform — browse a menu, order food, pay online or cash-on-delivery, track orders, and manage everything from an admin panel.

Built with React (frontend) and Node/Express + MongoDB (backend), with Razorpay for payments and Google OAuth for social login.

---

## ✨ Features

**Customer**
- Browse and search the menu, filter by category, sort by price
- Add to cart, adjust quantities, persistent cart (survives a refresh)
- Two checkout paths: **online payment** (Razorpay) or **cash on delivery**
- Email-verified signup, plus Google Sign-In
- Order history and detailed order view with live status
- Editable profile with a map-based delivery location picker

**Admin**
- Add/edit/delete menu items with image upload (Cloudinary)
- Toggle item availability (in stock / out of stock)
- View all orders with customer details, update order status
- Revenue and order stats at a glance

---

## 🛠️ Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Framer Motion, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, Google OAuth (`@react-oauth/google`, `google-auth-library`) |
| Payments | Razorpay |
| Email | Nodemailer (Gmail SMTP) |
| Image storage | Cloudinary |
| File uploads | Multer |

---

## 🔒 Security & correctness

A few things worth calling out beyond "it works":

- **Idempotent payment verification** — retrying or duplicating a payment-verification request returns the existing order instead of creating a duplicate. A payment can't accidentally get recorded twice.
- **Server-side price validation** — order totals are recomputed from the database's actual food prices on every order, never trusted from the client. Tampering with cart prices client-side has no effect.
- **Razorpay signature verification** uses a timing-safe comparison (`crypto.timingSafeEqual`), and the amount actually paid is independently verified against Razorpay's own order record before an order is marked "Paid."
- **No IDOR** — order lookups are scoped to the authenticated user (or admins); one user cannot view another user's order by guessing/incrementing an ID.
- **Rate limiting** on auth endpoints (login/signup/Google login) to blunt brute-force and signup-spam attempts.
- **No sensitive data leaks** — password hashes are excluded from every API response by default (`select: false` at the schema level), and raw JWTs are never written to server or client logs.
- **`helmet` + scoped CORS** — security headers on by default, cross-origin requests restricted to the actual frontend origin rather than left open.

---

## 📁 Project structure

```
goFood/
├─ frontend/
│  └─ src/
│     ├─ animations/       # shared Framer Motion variants + custom animation hooks
│     ├─ api/               # central axios instance (auth header, base URL)
│     ├─ components/
│     │  └─ motion/         # reusable animated UI pieces (cards, dividers, badges…)
│     ├─ context/           # Auth + Cart context providers
│     ├─ pages/              # route-level pages (Home, Cart, Admin, Orders, …)
│     └─ styles/             # shared keyframes + font imports
│
└─ backend/
   ├─ config/                # DB connection, Cloudinary config
   ├─ controllers/           # route logic (auth, admin, orders, payments, users)
   ├─ middleware/            # JWT auth, admin guard, rate limiter, file upload
   ├─ models/                # Mongoose schemas (User, Food, Order)
   ├─ routes/                # Express routers, one per resource
   ├─ utils/                 # shared helpers (asyncHandler, Razorpay client)
   └─ server.js               # app entry point
```

---

## 🚀 Getting started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB connection (local or Atlas)
- A Razorpay account (test mode is fine)
- A Google Cloud OAuth client ID
- A Gmail account with an **App Password** (regular passwords no longer work for SMTP — see below)
- A Cloudinary account

### 1. Clone and install
```bash
git clone https://github.com/SonuSk584/GoFood.git
cd GoFood

cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment variables

**`backend/.env`**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=some_long_random_string

EMAIL=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_gmail_app_password   # NOT your regular password

GOOGLE_CLIENT_ID=your_google_oauth_client_id

RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_key_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
PORT=5000
```

> **Gmail note:** as of recent Google policy changes, regular account passwords are rejected for SMTP. Enable 2-Step Verification on the sending account, then generate an [App Password](https://myaccount.google.com/apppasswords) and use that instead.

**`frontend/.env`**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run it
```bash
# terminal 1
cd backend
npm start

# terminal 2
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

### 4. Google OAuth setup
In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), add your dev URL (`http://localhost:5173`) under **Authorized JavaScript origins** on your OAuth Client ID.

---

## 🧭 API overview

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create account, sends verification email |
| GET | `/api/auth/verify/:token` | Verify email from the link |
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/google-login` | Google OAuth login |
| GET | `/api/food` | Public menu listing |
| POST | `/api/payment/create` | Create a Razorpay order (auth required) |
| POST | `/api/payment/verify` | Verify payment, create order (auth required) |
| POST | `/api/order/place` | Place a cash-on-delivery order (auth required) |
| GET | `/api/order/myorders` | Current user's orders (auth required) |
| GET | `/api/order/:id` | Single order detail (owner or admin only) |
| PUT | `/api/user/update` | Update profile name (auth required) |
| PUT | `/api/user/update-location` | Update delivery location (auth required) |
| * | `/api/admin/*` | Menu + order management (admin only) |

---

## 🗺️ Possible next steps

- Stock quantity tracking (currently a simple available/unavailable toggle)
- Automated tests around the payment-verification and order-total logic
- CI pipeline (lint + tests on push)
- Deployed live demo (Vercel + Render/Railway + MongoDB Atlas)

---

## 📄 License

This project was built for learning purposes.
