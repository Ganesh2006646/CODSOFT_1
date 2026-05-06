import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const RecentlyViewed = ({ refreshKey }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentlyViewed');
    const parsed = saved ? JSON.parse(saved) : [];
    setItems(parsed.slice(0, 3));
  }, [refreshKey]);

  const clearAll = () => {
    localStorage.removeItem('recentlyViewed');
    setItems([]);
  };

  if (items.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
        <button onClick={clearAll} className="text-sm text-gray-500 hover:text-red-500">
          Clear
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
