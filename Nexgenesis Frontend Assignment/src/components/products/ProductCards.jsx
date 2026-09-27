const ProductCards = ({ products, onProductClick }) => {
  return (
    <div className="grid gap-4 md:hidden">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onProductClick(product.id)}
          className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm"
        >
          <div className="flex gap-4">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-20 w-20 rounded-lg object-cover"
            />

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-slate-800">
                {product.title}
              </h3>

              <p className="mt-1 text-sm capitalize text-slate-500">
                {product.category}
              </p>

              <div className="mt-3 flex gap-4 text-sm">
                <span className="font-semibold">
                  ${product.price}
                </span>

                <span>⭐ {product.rating}</span>

                <span>{product.stock} in stock</span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ProductCards;