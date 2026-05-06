import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CompareContext } from '../context/CompareContext';

const CompareBar = () => {
  const { compareList, clearCompare } = useContext(CompareContext);

  if (compareList.length === 0) return null;

  return (
    <div className="bg-indigo-600 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-sm">
          Compare ({compareList.length}/3): {compareList.map((p) => p.name).join(', ')}
        </div>
        <div className="flex gap-2">
          <Link to="/compare" className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-medium">
            Compare Now
          </Link>
          <button onClick={clearCompare} className="text-sm underline">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
