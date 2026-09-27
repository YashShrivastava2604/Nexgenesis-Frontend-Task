const ProductFilters = ({
  search,
  onSearchChange,
  category,
  categories,
  sortBy,
  order,
  onCategoryChange,
  onSortChange,
}) => {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Search
          </label>

          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={Boolean(search.trim())}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">All categories</option>

            {categories.map((item) => (
              <option
                key={typeof item === "string" ? item : item.slug}
                value={typeof item === "string" ? item : item.slug}
              >
                {typeof item === "string" ? item : item.name}
              </option>
            ))}
          </select>

          {search.trim() && (
            <p className="mt-1 text-xs text-slate-400">
              Category filtering is disabled while searching.
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Sort
          </label>

          <select
            value={sortBy ? `${sortBy}-${order}` : ""}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
          >
            <option value="">Default</option>
            <option value="title-asc">Title A–Z</option>
            <option value="title-desc">Title Z–A</option>
            <option value="price-asc">Price Low–High</option>
            <option value="price-desc">Price High–Low</option>
            <option value="rating-desc">Rating High–Low</option>
            <option value="rating-asc">Rating Low–High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;