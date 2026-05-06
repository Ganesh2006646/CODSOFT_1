const FilterSidebar = ({ categories, selectedCategory, onCategoryChange, sortOrder, onSortChange }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === '' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Sort By Price</h3>
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">Newest First</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar;
