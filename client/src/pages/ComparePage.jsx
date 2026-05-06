import { useContext } from 'react';
import { CompareContext } from '../context/CompareContext';

const ComparePage = () => {
  const { compareList, removeFromCompare, clearCompare } = useContext(CompareContext);

  if (compareList.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">No products to compare</h2>
        <p className="text-gray-500 mt-2">Add up to 3 products from the catalog.</p>
      </div>
    );
  }

  const prices = compareList.map((p) => p.price);
  const minPrice = Math.min(...prices);

  const rows = [
    { label: 'Name', key: 'name' },
    { label: 'Price', key: 'price' },
    { label: 'Category', key: 'category' },
    { label: 'Stock', key: 'stock' },
    { label: 'Rating', key: 'rating' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Compare Products</h1>
        <button onClick={clearCompare} className="text-sm text-gray-500 hover:text-red-500">
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto bg-white border rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Field</th>
              {compareList.map((product) => (
                <th key={product._id} className="text-left p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span>{product.name}</span>
                    <button
                      onClick={() => removeFromCompare(product._id)}
                      className="text-xs text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t">
                <td className="p-3 font-medium text-gray-600">{row.label}</td>
                {compareList.map((product) => (
                  <td key={product._id + row.key} className="p-3">
                    {row.key === 'price' ? (
                      <span className={product.price === minPrice ? 'text-green-600 font-bold' : ''}>
                        ${product.price.toFixed(2)}
                      </span>
                    ) : (
                      <span>{product[row.key] || 'N/A'}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
