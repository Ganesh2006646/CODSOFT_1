import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { CompareContext } from '../context/CompareContext';
import { toast } from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { compareList, addToCompare, removeFromCompare } = useContext(CompareContext);
  const isChecked = compareList.some((p) => p._id === product._id);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
      <Link to={`/product/${product._id}`}>
        <div className="h-56 overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4 flex-grow flex flex-col">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit mb-2">
          {product.category}
        </span>
        <Link to={`/product/${product._id}`}>
          <h3 className="text-base font-bold text-gray-900 line-clamp-1 hover:text-indigo-600">{product.name}</h3>
        </Link>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-3 border-t border-gray-50 mt-3">
          <label className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => (isChecked ? removeFromCompare(product._id) : addToCompare(product))}
              className="accent-indigo-600"
            />
            Compare
          </label>

          <div className="flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
