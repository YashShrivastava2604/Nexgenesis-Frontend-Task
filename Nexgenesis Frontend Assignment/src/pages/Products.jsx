import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import useProducts from "../hooks/useProducts";
import useDebounce from "../hooks/useDebounce";

import ProductTable from "../components/products/ProductTable";
import ProductCards from "../components/products/ProductCards";
import ProductFilters from "../components/products/ProductFilters";
import Pagination from "../components/products/Pagination";

const Products = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * Read values from URL.
   * Invalid values are replaced with safe defaults.
   */
  const rawPage = Number(searchParams.get("page"));
  const rawLimit = Number(searchParams.get("limit"));

  const page =
    Number.isInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const limit =
    [10, 20, 50].includes(rawLimit)
      ? rawLimit
      : 10;

  const urlSearch = searchParams.get("search") || "";

  /*
   * Local input state lets the user type freely.
   * The debounced value is what actually triggers the API.
   */
  const [searchInput, setSearchInput] = useState(urlSearch);

  const debouncedSearch = useDebounce(searchInput, 500);

  /*
   * Keep local search input synchronized with URL.
   */
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  /*
   * Once the user stops typing, update the URL.
   * Search always goes back to page 1.
   */
  useEffect(() => {
    if (debouncedSearch === urlSearch) {
      return;
    }

    const params = new URLSearchParams(searchParams);

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    setSearchParams(params);
  }, [
    debouncedSearch,
    urlSearch,
    searchParams,
    setSearchParams,
  ]);

  const {
    products,
    total,
    loading,
    error,
    retry,
  } = useProducts({
    page,
    limit,
    search: urlSearch,
    category: "",
    sortBy: "",
    order: "",
  });

  const updatePage = (newPage) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", String(newPage));

    setSearchParams(params);
  };

  const updateLimit = (newLimit) => {
    const params = new URLSearchParams(searchParams);

    params.set("limit", String(newLimit));
    params.set("page", "1");

    setSearchParams(params);
  };

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

        <ProductFilters
          search={searchInput}
          onSearchChange={setSearchInput}
        />

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

            <Pagination
              page={page}
              total={total}
              limit={limit}
              onPageChange={updatePage}
              onLimitChange={updateLimit}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Products;