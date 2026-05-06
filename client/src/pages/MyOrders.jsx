import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import OrderTimeline from '../components/OrderTimeline';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user?.token}` },
        };
        const { data } = await axios.get('/api/orders/my', config);
        setOrders(data);
      } catch (error) {
        setOrders([]);
      }
      setLoading(false);
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">No orders yet</h2>
        <p className="text-gray-500 mt-2">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <p className="text-sm text-gray-400">Order ID</p>
                <p className="font-mono text-xs text-gray-600">{order._id}</p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
              <span className="text-sm px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                {order.status}
              </span>
            </div>

            <OrderTimeline statusHistory={order.statusHistory || []} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
