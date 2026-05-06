import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Package, ShoppingBag, LogOut } from 'lucide-react';

const STATUS_FLOW = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image: '',
    stock: 10,
  });

  const [editProduct, setEditProduct] = useState(null);

  const [coupons, setCoupons] = useState([]);
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'percent',
    value: '',
    minOrder: '',
    maxUses: '',
    expiresAt: '',
    isActive: true,
  });

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` },
  };

  // Fetch data on load
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCoupons();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get('/api/coupons', config);
      setCoupons(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCouponChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCouponForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/products', {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      }, config);
      toast.success('Product added!');
      setNewProduct({ name: '', description: '', price: '', category: 'Electronics', image: '', stock: 10 });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding product');
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`, config);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const handleEditStart = (product) => {
    setEditProduct({
      _id: product._id,
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'Electronics',
      image: product.image || '',
      stock: product.stock || 0,
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    setLoading(true);
    try {
      await axios.patch(`/api/products/${editProduct._id}`, {
        name: editProduct.name,
        description: editProduct.description,
        price: Number(editProduct.price),
        category: editProduct.category,
        image: editProduct.image,
        stock: Number(editProduct.stock),
      }, config);
      toast.success('Product updated');
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating product');
    }
    setLoading(false);
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/coupons', {
        code: couponForm.code,
        type: couponForm.type,
        value: Number(couponForm.value),
        minOrder: Number(couponForm.minOrder || 0),
        maxUses: Number(couponForm.maxUses || 0),
        expiresAt: couponForm.expiresAt,
        isActive: couponForm.isActive,
      }, config);
      toast.success('Coupon created');
      setCouponForm({
        code: '',
        type: 'percent',
        value: '',
        minOrder: '',
        maxUses: '',
        expiresAt: '',
        isActive: true,
      });
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await axios.delete(`/api/coupons/${id}`, config);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting coupon');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await axios.delete(`/api/orders/${id}`, config);
      toast.success('Order deleted');
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting order');
    }
  };

  const handleClearOrders = async () => {
    if (!window.confirm('Delete all orders?')) return;
    try {
      await axios.delete('/api/orders/clear', config);
      toast.success('All orders deleted');
      setOrders([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting orders');
    }
  };

  const getNextStatus = (order) => {
    const current = order.statusHistory && order.statusHistory.length > 0
      ? order.statusHistory[order.statusHistory.length - 1].status
      : order.status;
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  const handleUpdateStatus = async (orderId, nextStatus) => {
    if (!nextStatus) return;
    try {
      const { data } = await axios.patch(`/api/orders/${orderId}/status`, { status: nextStatus }, config);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
      toast.success('Order status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium"
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-4 mb-8 border-b pb-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
            activeTab === 'products' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Package className="h-4 w-4" /> Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
            activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <ShoppingBag className="h-4 w-4" /> Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
            activeTab === 'coupons' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Coupons ({coupons.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1">
            {editProduct && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
                  <button
                    type="button"
                    onClick={() => setEditProduct(null)}
                    className="text-xs text-gray-500 hover:text-red-500"
                  >
                    Cancel
                  </button>
                </div>
                <form onSubmit={handleUpdateProduct} className="space-y-3">
                  <input
                    name="name"
                    value={editProduct.name}
                    onChange={handleEditChange}
                    placeholder="Product name"
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    name="description"
                    value={editProduct.description}
                    onChange={handleEditChange}
                    placeholder="Description"
                    rows={2}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={editProduct.price}
                    onChange={handleEditChange}
                    placeholder="Price"
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    name="category"
                    value={editProduct.category}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Electronics</option>
                    <option>Clothing</option>
                    <option>Books</option>
                    <option>Home & Kitchen</option>
                  </select>
                  <input
                    name="image"
                    value={editProduct.image}
                    onChange={handleEditChange}
                    placeholder="Image URL"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    name="stock"
                    type="number"
                    value={editProduct.stock}
                    onChange={handleEditChange}
                    placeholder="Stock"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600" /> Add Product
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-3">
                <input
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  placeholder="Product name"
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Books</option>
                  <option>Home & Kitchen</option>
                </select>
                <input
                  name="image"
                  value={newProduct.image}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  name="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  placeholder="Stock"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left p-3">Product</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-right p-3">Price</th>
                    <th className="text-right p-3">Stock</th>
                    <th className="text-right p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3 text-gray-500">{p.category}</td>
                      <td className="p-3 text-right font-bold">${p.price.toFixed(2)}</td>
                      <td className="p-3 text-right">{p.stock}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleEditStart(p)}
                          className="text-gray-500 hover:text-indigo-600 p-1 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h2 className="text-lg font-bold text-gray-900">Orders</h2>
            <button
              onClick={handleClearOrders}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear Orders
            </button>
          </div>
          {orders.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left p-3">Order ID</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-right p-3">Total</th>
                  <th className="text-center p-3">Payment</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-center p-3">Next Status</th>
                  <th className="text-center p-3">Action</th>
                  <th className="text-right p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs text-gray-500">{order._id.slice(-8)}</td>
                    <td className="p-3">{order.user?.name || 'N/A'}</td>
                    <td className="p-3 text-right font-bold">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {getNextStatus(order) ? (
                        <div className="flex items-center justify-center gap-2">
                          <select
                            value={getNextStatus(order)}
                            disabled
                            className="border rounded-md px-2 py-1 text-xs bg-gray-50 text-gray-600"
                          >
                            <option>{getNextStatus(order)}</option>
                          </select>
                          <button
                            onClick={() => handleUpdateStatus(order._id, getNextStatus(order))}
                            className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-md"
                          >
                            Update
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Completed</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="p-3 text-right text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Create Coupon</h2>
              <form onSubmit={handleCreateCoupon} className="space-y-3">
                <input
                  name="code"
                  value={couponForm.code}
                  onChange={handleCouponChange}
                  placeholder="CODE10"
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    name="type"
                    value={couponForm.type}
                    onChange={handleCouponChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="percent">Percent</option>
                    <option value="flat">Flat</option>
                  </select>
                  <input
                    name="value"
                    type="number"
                    value={couponForm.value}
                    onChange={handleCouponChange}
                    placeholder="Value"
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="minOrder"
                    type="number"
                    value={couponForm.minOrder}
                    onChange={handleCouponChange}
                    placeholder="Min order"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    name="maxUses"
                    type="number"
                    value={couponForm.maxUses}
                    onChange={handleCouponChange}
                    placeholder="Max uses"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <input
                  name="expiresAt"
                  type="datetime-local"
                  value={couponForm.expiresAt}
                  onChange={handleCouponChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={couponForm.isActive}
                    onChange={handleCouponChange}
                    className="accent-indigo-600"
                  />
                  Active
                </label>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-2 rounded-lg font-bold hover:bg-gray-800"
                >
                  Create Coupon
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {coupons.length === 0 ? (
                <p className="p-6 text-gray-500 text-center">No coupons yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left p-3">Code</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-right p-3">Value</th>
                      <th className="text-right p-3">Uses</th>
                      <th className="text-center p-3">Active</th>
                      <th className="text-right p-3">Expires</th>
                      <th className="text-right p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon._id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">{coupon.code}</td>
                        <td className="p-3 text-gray-500">{coupon.type}</td>
                        <td className="p-3 text-right">{coupon.value}</td>
                        <td className="p-3 text-right">{coupon.usedCount}/{coupon.maxUses || '∞'}</td>
                        <td className="p-3 text-center">
                          {coupon.isActive ? 'Yes' : 'No'}
                        </td>
                        <td className="p-3 text-right text-gray-500">
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(coupon._id)}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
