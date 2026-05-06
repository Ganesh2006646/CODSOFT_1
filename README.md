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
| **Product Catalog** | 10 real products across 4 categories with images |
| **Product Detail Page** | Full product view with quantity selector and related products |
| **Search & Filter** | Search by name, filter by category, sort by price (low/high) |
| **Shopping Cart** | Add/remove items, update quantity, persisted in localStorage |
| **Checkout** | Shipping address form with order summary and mock payment |
| **Order Confirmation** | Success page with order ID after checkout |
| **Admin Dashboard** | Add/delete products and view all customer orders |
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
| DELETE | `/api/products/:id` | Delete product (admin only) |

### Orders (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place new order |
| GET | `/api/orders/my` | Get logged-in user's orders |
| GET | `/api/orders` | Get all orders (admin only) |

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
- **15 products** across 4 categories
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
  stock:       Number
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
  status:          'processing' | 'shipped' | 'delivered'
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
- Login with `admin@test.com` / `Admin@123`
- Click **Admin** in the navbar
- Add new products or delete existing ones
- View all customer orders

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
