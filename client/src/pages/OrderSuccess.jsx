import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-14 w-14 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Order Placed!</h1>
        <p className="text-gray-500 mb-2">Thank you for your purchase. Your order is being processed.</p>

        {orderId && (
          <p className="text-sm text-gray-400 mb-8">
            Order ID: <span className="font-mono font-bold text-gray-600">{orderId}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700"
          >
            <Home className="h-5 w-5" /> Go Home
          </Link>
          <Link
            to="/products"
            className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold hover:bg-gray-50"
          >
            <ShoppingBag className="h-5 w-5" /> Shop More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
