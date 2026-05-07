import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest 6 products for the featured section
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setFeatured(data.slice(0, 6)); // Take first 6 products
      } catch (error) {
        console.error('Error loading products:', error);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen'];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1500&q=80"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent flex flex-col justify-center px-8 sm:px-16 max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">Shop the Best Deals</h1>
          <p className="text-lg text-gray-200 mb-6 max-w-md">Discover top products at unbeatable prices. Free shipping on all orders.</p>
          <Link
            to="/products"
            className="bg-indigo-600 text-white w-fit px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            Browse All Products <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Category Quick Links */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="bg-white border border-gray-100 rounded-xl p-6 text-center font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-indigo-600 font-medium flex items-center gap-1 hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck className="h-8 w-8 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Free Shipping</h3>
            <p className="text-sm text-gray-500">On all orders over $50</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Secure Payment</h3>
            <p className="text-sm text-gray-500">100% secure checkout</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap className="h-8 w-8 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Fast Delivery</h3>
            <p className="text-sm text-gray-500">Delivered within 3-5 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
