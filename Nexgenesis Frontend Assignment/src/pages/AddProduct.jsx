import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../api/productsApi";
import ProductForm from "../components/products/ProductForm";

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (product) => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const createdProduct = await addProduct(product);

      /*
       * DummyJSON doesn't persist the new product.
       * We navigate to the returned product so the user
       * can see the simulated result.
       */
      navigate(`/products/${createdProduct.id}`);
    } catch {
      setError("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate("/products")}
          className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Products
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Add Product
          </h1>

          <p className="mt-1 mb-6 text-sm text-slate-500">
            Create a new product.
          </p>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <ProductForm
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;