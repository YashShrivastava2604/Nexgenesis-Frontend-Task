import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api/productsApi";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");
      setNotFound(false);

      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Failed to load product.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">Loading product...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
        <h1 className="text-4xl font-bold text-slate-900">
          Product Not Found
        </h1>

        <p className="mt-2 text-slate-500">
          The product you're looking for doesn't exist.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
        <p className="mb-4 text-red-600">{error}</p>

        <button
          onClick={() => navigate("/products")}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => navigate("/products")}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Products
          </button>

          <button
            onClick={() => navigate(`/products/${id}/edit`)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit Product
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
            <div>
              <img
                src={product.images?.[0] || product.thumbnail}
                alt={product.title}
                className="aspect-square w-full rounded-xl object-cover"
              />

              {product.images?.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {product.images.map((image) => (
                    <img
                      key={image}
                      src={image}
                      alt=""
                      className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-600">
                {product.category}
              </span>

              <h1 className="mt-4 text-3xl font-bold text-slate-900">
                {product.title}
              </h1>

              <p className="mt-4 text-slate-600">
                {product.description}
              </p>

              <div className="mt-6 flex items-center gap-6">
                <span className="text-3xl font-bold">
                  ${product.price}
                </span>

                <span className="text-slate-600">
                  ⭐ {product.rating}
                </span>

                <span className="text-slate-600">
                  {product.stock} in stock
                </span>
              </div>

              {product.brand && (
                <p className="mt-6 text-sm text-slate-500">
                  Brand:{" "}
                  <span className="font-medium text-slate-800">
                    {product.brand}
                  </span>
                </p>
              )}

              {product.reviews?.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold">
                    Reviews
                  </h2>

                  <div className="mt-4 space-y-4">
                    {product.reviews.map((review, index) => (
                      <div
                        key={`${review.reviewerEmail}-${index}`}
                        className="rounded-xl bg-slate-50 p-4"
                      >
                        <div className="flex justify-between gap-4">
                          <span className="font-medium">
                            {review.reviewerName}
                          </span>

                          <span>
                            ⭐ {review.rating}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;