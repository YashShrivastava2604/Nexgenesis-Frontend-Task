import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getProduct,
  updateProduct,
} from "../api/productsApi";

import ProductForm from "../components/products/ProductForm";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Product not found.");
        } else {
          setError("Failed to load product.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleSubmit = async (updatedProduct) => {
    if (saving) return;

    setSaving(true);
    setError("");

    try {
      await updateProduct(id, updatedProduct);

      /*
       * DummyJSON simulates the update but doesn't persist it.
       */
      navigate(`/products/${id}`);
    } catch {
      setError("Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        Loading product...
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
        <p className="mb-4 text-red-600">{error}</p>

        <button
          onClick={() => navigate("/products")}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate(`/products/${id}`)}
          className="mb-6 text-sm font-medium text-slate-600"
        >
          ← Back to Product
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-bold">
            Edit Product
          </h1>

          <p className="mt-1 mb-6 text-sm text-slate-500">
            Update the product information.
          </p>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProduct;