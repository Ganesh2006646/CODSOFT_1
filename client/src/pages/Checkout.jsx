import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { CreditCard, MapPin } from 'lucide-react';
import CouponInput from '../components/CouponInput';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Shipping address form fields
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const total = getTotal();
  const finalTotal = Math.max(0, total - discountAmount);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Check all address fields are filled
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }

    setPlacing(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      // Step 1: Process mock payment
      await axios.post('/api/payment/create-intent', { amount: finalTotal }, config);

      // Step 2: Create the order
      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: address,
        totalAmount: finalTotal,
        couponCode: appliedCoupon || undefined,
      };

      const { data } = await axios.post('/api/orders', orderData, config);

      // Step 3: Clear cart and redirect
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-success', { state: { orderId: data._id } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
    setPlacing(false);
  };

  const handleApplyCoupon = async (code) => {
    setApplyingCoupon(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post('/api/coupons/validate', { code, cartTotal: total }, config);
      setDiscountAmount(data.discountAmount || 0);
      setAppliedCoupon(data.code || code.toUpperCase());
      toast.success(`Coupon applied! You saved $${Number(data.discountAmount).toFixed(2)}`);
    } catch (error) {
      setDiscountAmount(0);
      setAppliedCoupon('');
      toast.error(error.response?.data?.message || 'Invalid coupon');
    }
    setApplyingCoupon(false);
  };

  // Redirect if cart is empty
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Shipping Address */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" /> Shipping Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    placeholder="400001"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-600" /> Order Summary
              </h2>

              <div className="mb-4">
                <CouponInput onApply={handleApplyCoupon} appliedCoupon={appliedCoupon} />
                {applyingCoupon && (
                  <p className="text-xs text-gray-400 mt-2">Checking coupon...</p>
                )}
              </div>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 mb-6">
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 mb-1">
                    <span>Discount</span>
                    <span>- ${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-indigo-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-60 active:scale-95"
              >
                {placing ? 'Processing...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Payment is simulated for demo purposes.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
