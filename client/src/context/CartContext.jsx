import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  const fetchCart = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('/api/cart', getAuthConfig());
      setCart(data);
    } catch (error) {
      toast.error('Failed to load cart');
      setCart([]);
    }
  };

  const mergeGuestCart = async (guestItems) => {
    if (!user || !Array.isArray(guestItems) || guestItems.length === 0) return;
    const config = getAuthConfig();
    await Promise.allSettled(
      guestItems.map((item) =>
        axios.post('/api/cart/add', { productId: item._id, quantity: item.quantity }, config)
      )
    );
  };

  // Load cart from API (if logged in) or localStorage
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        const saved = localStorage.getItem('cartItems');
        const guestItems = saved ? JSON.parse(saved) : [];
        if (guestItems.length > 0) {
          await mergeGuestCart(guestItems);
          localStorage.removeItem('cartItems');
        }
        await fetchCart();
        return;
      }

      const saved = localStorage.getItem('cartItems');
      setCart(saved ? JSON.parse(saved) : []);
    };

    syncCart();
  }, [user]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cartItems', JSON.stringify(cart));
    }
  }, [cart, user]);

  // Add a product to the cart
  const addToCart = (product) => {
    if (user) {
      axios.post('/api/cart/add', { productId: product._id, quantity: 1 }, getAuthConfig())
        .then(fetchCart)
        .catch(() => toast.error('Unable to reserve item'));
      return;
    }

    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === product._id);
      if (exists) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove a product from the cart
  const removeFromCart = (productId) => {
    if (user) {
      axios.delete('/api/cart/remove', { data: { productId }, ...getAuthConfig() })
        .then(fetchCart)
        .catch((error) => {
          if (error.response?.status !== 404) {
            toast.error('Unable to remove item');
          }
        });
      return;
    }
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // Update quantity of a specific item
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    if (user) {
      const current = cart.find((item) => item._id === productId);
      if (!current) return;
      const diff = newQuantity - current.quantity;
      if (diff > 0) {
        axios.post('/api/cart/add', { productId, quantity: diff }, getAuthConfig())
          .then(fetchCart)
          .catch(() => toast.error('Unable to update quantity'));
      } else if (diff < 0) {
        axios.delete('/api/cart/remove', { data: { productId, quantity: Math.abs(diff) }, ...getAuthConfig() })
          .then(fetchCart)
          .catch(() => toast.error('Unable to update quantity'));
      }
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    if (user) {
      Promise.all(
        cart.map((item) => axios.delete('/api/cart/remove', { data: { productId: item._id }, ...getAuthConfig() }))
      ).then(() => setCart([]));
      return;
    }
    setCart([]);
  };

  // Calculate total price
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Get total number of items
  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};
