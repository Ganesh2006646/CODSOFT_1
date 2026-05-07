# 🛒 ShopEase — E-Commerce Website

> **CodSoft Internship — Level 3, Task 1**
> A full-stack E-Commerce platform with product browsing, shopping cart, checkout, and admin dashboard.

---

##  About The Project

ShopEase is a modern online shopping website built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Developed as part of the CodSoft Web Development Internship.

Users can browse products, search and filter by category, add items to their cart, and checkout with a shipping address. Admin users can manage products and view all orders through a dedicated dashboard.

---

##  Features

| **Feature | Description** |
|---------|-------------|
| **User Authentication** | Register and Login using JWT tokens with role support (user/admin) |
| **Home Page** | Hero banner, category quick-links, and featured products |
| **Product Catalog** | 30 products across 4 categories with images |
| **Product Detail Page** | Full product view with quantity selector and related products |
| **Recently Viewed** | Shows last 3 products viewed on the product detail page |
| **Compare Products** | Compare up to 3 products side-by-side |
| **Search & Filter** | Search by name, filter by category, sort by price (low/high) |
| **Cart Reservation** | Reserve stock for 15 minutes with countdown and auto-expiry |
| **Checkout** | Shipping address form with order summary and mock payment |
| **Coupons** | Apply discount codes at checkout |
| **Order Status Timeline** | Track order pipeline with timestamps |
| **Price History** | Chart of price changes (30/60/90 days) |
| **Admin Dashboard** | Add/edit/delete products, update order status, manage coupons, clear orders |
| **Responsive Design** | Works on desktop, tablet, and mobile screens |
| **Toast Notifications** | Feedback for cart actions, login, and checkout |

---

##  Tech Stack

### Frontend
| **Technology | Purpose** |
|-----------|---------|
| React.js (Vite) | UI framework |
| Tailwind CSS | Styling |
| React Router DOM | Page navigation |
| React Context API | Auth and Cart state management |
| Axios | HTTP requests |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| Recharts | Price history charts |

### Backend
| **Technology | Purpose** |
|-----------|---------|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT (jsonwebtoken) | Token authentication |
| Bcrypt.js | Password hashing |
| dotenv | Environment variables |
| cors | Cross-origin requests |

---

## 🔌 API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Login and get JWT |

### Products (Public + Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports `?search=`, `?category=`, `?sort=`) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Add product (admin only) |
| PATCH | `/api/products/:id` | Update product (admin only) |
| PATCH | `/api/products/:id/flashsale` | Update flash sale (admin only) |
| DELETE | `/api/products/:id` | Delete product (admin only) |

### Cart (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get active reservations for user |
| POST | `/api/cart/add` | Reserve product stock |
| DELETE | `/api/cart/remove` | Remove reservation |

### Orders (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place new order |
| GET | `/api/orders/my` | Get logged-in user's orders |
| GET | `/api/orders` | Get all orders (admin only) |
| PATCH | `/api/orders/:id/status` | Update order status (admin only) |
| DELETE | `/api/orders/:id` | Delete order (admin only) |
| DELETE | `/api/orders/clear` | Clear all orders (admin only) |

### Coupons (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/coupons/validate` | Validate coupon code |
| POST | `/api/coupons` | Create coupon (admin only) |
| GET | `/api/coupons` | List coupons (admin only) |
| DELETE | `/api/coupons/:id` | Delete coupon (admin only) |

### Payment (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-intent` | Mock payment processing |

---

##  Installation & Setup

### Prerequisites
- **Node.js** v16+ — [Download](https://nodejs.org)
- **MongoDB Atlas** — [Free Cluster](https://www.mongodb.com/atlas)

### Step 1: Clone
```bash
git clone https://github.com/your-username/CODSOFT.git
cd CODSOFT
```

### Step 2: Environment Variables
```bash
cd server
# Rename .env.example to .env and fill in your details
```
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shopease
JWT_SECRET=your_secret_key
```

### Step 3: Install Dependencies
```bash
# From root
npm install
cd client && npm install && cd ..
```

### Step 4: Seed Database
```bash
node server/seed.js
```
This creates:
- **30 products** across 4 categories
- **1 admin user** (email: `admin@shopease.com`, password: `admin123`)
- **1 test user** (email: `john@test.com`, password: `john123`)

### Step 5: Run
```bash
npm run dev
```

###  Port Numbers

| Service | Port | URL |
|---------|------|-----|
| **Backend** (Express API) | `5000` | http://localhost:5000 |
| **Frontend** (Vite/React) | `5173` | http://localhost:5173 |

---

##  Security Notes

- Order totals are calculated on the server from Product prices; client-supplied totals are ignored.
- Coupon validation (expiry, usage limits, min order, type) happens on the server before discounts are applied.

---

##  Deployment Notes

- Local uploads under `/uploads` are ephemeral on hosts like Render/Vercel; use Cloudinary or S3 for production.
- Hosting providers inject environment variables at runtime; ensure the app can start without a local `.env` file.

---

##  Project Metadata & Recommendations

- Server uses `express` v4 (see `server/package.json`) — update README or upgrade to Express 5 if you prefer.
- `mongoose` pinned to `^8.x` in package.json for broader compatibility; if you prefer a newer version, test thoroughly.
- Package name changed from `server` to `shopease-ecommerce` for a more professional presentation.
- Demo admin credentials are included for convenience in development; move them to `.env.example` and remove from seed logs for production safety.
- Consider adding automated tests (Jest) and a Postman collection to showcase API reliability.

---

##  Assets & Screenshots

Add screenshots in `/assets/screenshots` for: homepage, cart, checkout, admin dashboard.

---

##  How To Contribute

- Fork the repo, create a feature branch, open a pull request.
- Run `npm install` at root, then `npm run dev` to start both services locally.

---

##  Database Schemas

### User
```javascript
{
  name:      String,
  email:     String (unique),
  password:  String (hashed),
  role:      String ('user' | 'admin'),
  createdAt: Date
}
```

### Product
```javascript
{
  name:        String,
  description: String,
  price:       Number,
  image:       String (URL),
  category:    String,
  stock:       Number,
  reservedBy:  { userId, expiresAt },
  reservedUntil: Date,
  flashSale:   { isActive, discountPercent, endsAt },
  priceHistory: [{ price, changedAt }]
}
```

### Order
```javascript
{
  user:            ObjectId → User,
  items:           [{ product: ObjectId, quantity: Number, price: Number }],
  shippingAddress: { street, city, state, pincode },
  totalAmount:     Number,
  paymentStatus:   'pending' | 'paid',
  status:          'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered',
  statusHistory:   [{ status, timestamp, note? }],
  couponCode:      String
}
```

### CartReservation
```javascript
{
  userId:    ObjectId → User,
  productId: ObjectId → Product,
  quantity:  Number,
  expiresAt: Date
}
```

### Coupon
```javascript
{
  code:      String,
  type:      'percent' | 'flat',
  value:     Number,
  minOrder:  Number,
  maxUses:   Number,
  usedCount: Number,
  expiresAt: Date,
  isActive:  Boolean
}
```

---

## 🧑‍💻 How To Use

1. Open **http://localhost:5173**
2. Browse the **Home** page or go to **Products**
3. **Search** by name or **filter** by category
4. **Sort** products by price (low to high / high to low)
5. Click a product to see its **detail page**
6. **Add to Cart** and adjust quantities
7. **Sign Up / Login** to enable checkout
8. Go to **Cart → Proceed to Checkout**
9. Fill in your **shipping address** and click **Place Order**
10. See the **Order Confirmation** page with your order ID

### Admin Access
- Login with `admin@shopease.com` / `admin123`
- Click **Admin** in the navbar
- Add, edit, or delete products
- Update order status and clear orders
- Manage coupons

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend together |
| `npm run server` | Backend only (nodemon) |
| `npm run client` | Frontend only (Vite) |
| `npm start` | Production backend |
| `node server/seed.js` | Seed the database |

---

##  Author

**Ganesh** — CodSoft Web Development Intern

---

Built with ❤️ for CodSoft Internship
