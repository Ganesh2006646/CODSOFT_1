import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import FlashSaleTimer from '../components/FlashSaleTimer';
import PriceHistoryChart from '../components/PriceHistoryChart';
import RecentlyViewed from '../components/RecentlyViewed';
import { toast } from 'react-hot-toast';
import { ShoppingCart, Minus, Plus, Package } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [recentKey, setRecentKey] = useState(0);
  const [daysFilter, setDaysFilter] = useState(30);

  // Fetch the product and related products
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);

        const saved = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const filteredRecent = saved.filter((item) => item._id !== data._id);
        const updatedRecent = [data, ...filteredRecent].slice(0, 3);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
        setRecentKey(Date.now());

        // Fetch related products from the same category
        const allProducts = await axios.get(`/api/products?category=${data.category}`);
        // Remove current product from related list
        const filtered = allProducts.data.filter((p) => p._id !== id);
        setRelated(filtered.slice(0, 3));
      } catch (error) {
        console.error('Error loading product:', error);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Add the product 'quantity' number of times
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} x ${product.name} to cart`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  const flashSaleActive = product.flashSale && product.flashSale.isActive && product.flashSale.endsAt
    ? new Date(product.flashSale.endsAt) > new Date()
    : false;
  const discount = flashSaleActive ? (product.price * product.flashSale.discountPercent) / 100 : 0;
  const finalPrice = product.price - discount;
  const filteredHistory = (product.priceHistory || [])
    .filter((item) => new Date(item.changedAt).getTime() >= Date.now() - daysFilter * 86400000)
    .map((item) => ({
      date: new Date(item.changedAt).toLocaleDateString(),
      price: item.price,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="bg-gray-50 rounded-2xl overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-[400px] object-cover" />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit mb-3">
            {product.category}
          </span>
          {flashSaleActive && (
            <div className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">
              Flash Sale {product.flashSale.discountPercent}% off
            </div>
          )}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{product.name}</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">{product.description}</p>
          {flashSaleActive ? (
            <div className="mb-6">
              <p className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</p>
              <p className="text-4xl font-extrabold text-red-600">${finalPrice.toFixed(2)}</p>
              <FlashSaleTimer endsAt={product.flashSale.endsAt} />
            </div>
          ) : (
            <p className="text-4xl font-extrabold text-gray-900 mb-6">${product.price.toFixed(2)}</p>
          )}

          {/* Stock Info */}
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-600">Quantity:</span>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-indigo-600">
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-bold w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-indigo-600">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 w-fit disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}

      {/* Price History */}
      <div className="mt-16 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-gray-900">Price History</h2>
          <div className="flex gap-2">
            {[30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => setDaysFilter(days)}
                className={`text-xs px-3 py-1 rounded-full ${daysFilter === days ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>
        <PriceHistoryChart data={filteredHistory} />
      </div>

      <RecentlyViewed refreshKey={recentKey} />
    </div>
  );
};

export default ProductDetail;
