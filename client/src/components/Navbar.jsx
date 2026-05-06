import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, LogOut, Menu, X, Store, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getItemCount } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = getItemCount();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Store className="h-7 w-7 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">ShopEase</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-indigo-600 font-medium">Products</Link>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-1 text-indigo-600 font-medium text-sm">
                    <Shield className="h-4 w-4" /> Admin
                  </Link>
                )}
                <Link to="/my-orders" className="text-gray-600 hover:text-indigo-600 text-sm">
                  My Orders
                </Link>
                <span className="text-sm text-gray-500">Hi, {user.name}</span>
                <button onClick={logout} className="flex items-center gap-1 text-gray-500 hover:text-red-500 text-sm">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <div className="flex items-center md:hidden gap-3">
            <Link to="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-500">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">Products</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-indigo-600 font-medium">Admin Dashboard</Link>
              )}
              <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">My Orders</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block py-2 text-red-500 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-indigo-600 font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
