import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CompareBar from './components/CompareBar';
import AdminRedirect from './components/AdminRedirect';

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
import MyOrders from './pages/MyOrders';
import ComparePage from './pages/ComparePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <CompareProvider>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Admin route — isolated, no common Navbar/main container */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
                } />

                {/* All other routes wrapped with layout including Navbar */}
                <Route path="/*" element={
                  <AdminRedirect>
                    <>
                      <Navbar />
                      <CompareBar />
                      <main>
                        <Routes>
                          {/* Public routes */}
                          <Route path="/" element={<Home />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/compare" element={<ComparePage />} />

                          {/* Protected routes — must be logged in */}
                          <Route path="/checkout" element={
                            <ProtectedRoute userOnly><Checkout /></ProtectedRoute>
                          } />
                          <Route path="/order-success" element={
                            <ProtectedRoute userOnly><OrderSuccess /></ProtectedRoute>
                          } />
                          <Route path="/my-orders" element={
                            <ProtectedRoute userOnly><MyOrders /></ProtectedRoute>
                          } />
                        </Routes>
                      </main>
                    </>
                  </AdminRedirect>
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
          </CompareProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
