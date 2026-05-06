import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Admin route — isolated, no common Navbar/main container */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
              } />

              {/* All other routes wrapped with layout including Navbar */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <main>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/cart" element={<Cart />} />

                      {/* Protected routes — must be logged in */}
                      <Route path="/checkout" element={
                        <ProtectedRoute><Checkout /></ProtectedRoute>
                      } />
                      <Route path="/order-success" element={
                        <ProtectedRoute><OrderSuccess /></ProtectedRoute>
                      } />
                    </Routes>
                  </main>
                </>
              } />
            </Routes>

            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3000,
                style: { background: '#1e1e2e', color: '#fff', borderRadius: '12px' },
              }}
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
