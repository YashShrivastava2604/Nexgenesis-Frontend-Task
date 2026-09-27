import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useProducts from "../hooks/useProducts";
import ProductTable from "../components/products/ProductTable";
import ProductCards from "../components/products/ProductCards";

const Products = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const {
    products,
    total,
    loading,
    error,
    retry,
  } = useProducts({
    page: 1,
    limit: 10,
    search: "",
    category: "",
    sortBy: "",
    order: "",
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">
            Product Admin
          </h1>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:block">
              {user?.firstName} {user?.lastName}
            </span>

            <button
              onClick={logout}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your product catalog
          </p>
        </div>

        {loading && (
          <div className="rounded-xl bg-white p-10 text-center">
            <p className="text-slate-500">
              Loading products...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl bg-white p-10 text-center">
            <p className="mb-4 text-red-600">{error}</p>

            <button
              onClick={retry}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center">
            <p className="text-slate-500">
              No products found.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <ProductTable
              products={products}
              onProductClick={(id) =>
                navigate(`/products/${id}`)
              }
            />

            <ProductCards
              products={products}
              onProductClick={(id) =>
                navigate(`/products/${id}`)
              }
            />

            <p className="mt-4 text-sm text-slate-500">
              Showing {products.length} of {total} products
            </p>
          </>
        )}
      </main>
    </div>
  );
};

export default Products;