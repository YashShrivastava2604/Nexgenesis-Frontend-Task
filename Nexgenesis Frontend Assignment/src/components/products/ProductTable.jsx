const ProductTable = ({ products, onProductClick }) => {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Rating</th>
            <th className="px-6 py-4">Stock</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => onProductClick(product.id)}
              className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />

                  <span className="font-medium text-slate-800">
                    {product.title}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 capitalize text-slate-600">
                {product.category}
              </td>

              <td className="px-6 py-4 font-medium">
                ${product.price}
              </td>

              <td className="px-6 py-4">
                ⭐ {product.rating}
              </td>

              <td className="px-6 py-4">
                {product.stock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;