import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import CountdownTimer from '../components/CountdownTimer';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { cart, getTotal, removeFromCart } = useContext(CartContext);
  const total = getTotal();

  const handleExpire = (item) => {
    toast.error('Reservation expired, item removed');
    removeFromCart(item._id);
  };

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-6 rounded-full">
            <ShoppingBag className="h-14 w-14 text-gray-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700">
          Start Shopping <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Shopping Cart <span className="text-base font-normal text-gray-400">({cart.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="space-y-2">
              <CartItem item={item} />
              {item.expiresAt && (
                <div className="bg-white border border-gray-100 rounded-xl p-3">
                  <CountdownTimer expiresAt={item.expiresAt} onExpire={() => handleExpire(item)} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t mb-6">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-indigo-600">${total.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
