const ProductFilters = ({
  search,
  onSearchChange,
}) => {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="max-w-md">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Search products
        </label>

        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by product name..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>
  );
};

export default ProductFilters;