import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useContext(CartContext);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />

      <div className="flex-grow">
        <h3 className="font-bold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-400">{item.category}</p>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border">
        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1 hover:text-indigo-600">
          <Minus className="h-4 w-4" />
        </button>
        <span className="font-bold w-6 text-center">{item.quantity}</span>
        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1 hover:text-indigo-600">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="text-right min-w-[80px]">
        <p className="font-extrabold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</p>
      </div>

      <button onClick={() => removeFromCart(item._id)} className="text-gray-300 hover:text-red-500 p-2">
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CartItem;
