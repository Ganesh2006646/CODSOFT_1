import { createContext, useState } from 'react';
import { toast } from 'react-hot-toast';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (product) => {
    if (compareList.find((p) => p._id === product._id)) return;
    if (compareList.length >= 3) {
      toast.error('Max 3 products for compare');
      return;
    }
    setCompareList((prev) => [...prev, product]);
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => prev.filter((p) => p._id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};
