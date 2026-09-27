import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getCategories } from "../api/productsApi";

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

  // --------------------------------------------------
  // URL STATE
  // --------------------------------------------------

  const rawPage = Number(searchParams.get("page"));
  const rawLimit = Number(searchParams.get("limit"));

  const page =
    Number.isInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const limit = [10, 20, 50].includes(rawLimit)
    ? rawLimit
    : 10;

  const urlSearch = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "";

  // --------------------------------------------------
  // LOCAL SEARCH STATE
  // --------------------------------------------------

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [categories, setCategories] = useState([]);

  const debouncedSearch = useDebounce(searchInput, 500);

  // --------------------------------------------------
  // LOAD CATEGORIES
  // --------------------------------------------------

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        // Product list can still work without categories.
      }
    };

    loadCategories();
  }, []);

  // --------------------------------------------------
  // SYNC INPUT WHEN URL CHANGES
  // --------------------------------------------------

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // --------------------------------------------------
  // DEBOUNCED SEARCH
  // --------------------------------------------------

  useEffect(() => {
    const value = debouncedSearch.trim();

    // Nothing changed.
    if (value === urlSearch) {
      return;
    }

    setSearchParams((currentParams) => {
      const params = new URLSearchParams(currentParams);

      if (value) {
        // Search products.
        params.set("search", value);

        // DummyJSON does not support
        // search + category together.
        params.delete("category");
      } else {
        // Empty search -> remove search parameter.
        params.delete("search");
      }

      // Every new search starts from page 1.
      params.set("page", "1");

      return params;
    });
  }, [debouncedSearch, urlSearch, setSearchParams]);

  // --------------------------------------------------
  // FETCH PRODUCTS
  // --------------------------------------------------

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
    category,
    sortBy,
    order,
  });

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const updatePage = (newPage) => {
    setSearchParams((currentParams) => {
      const params = new URLSearchParams(currentParams);

      params.set("page", String(newPage));

      return params;
    });
  };

  const updateLimit = (newLimit) => {
    setSearchParams((currentParams) => {
      const params = new URLSearchParams(currentParams);

      params.set("limit", String(newLimit));
      params.set("page", "1");

      return params;
    });
  };

  // --------------------------------------------------
  // CATEGORY
  // --------------------------------------------------

  const updateCategory = (newCategory) => {
    setSearchParams((currentParams) => {
      const params = new URLSearchParams(currentParams);

      if (newCategory) {
        params.set("category", newCategory);

        // Search and category cannot be used together.
        params.delete("search");
      } else {
        params.delete("category");
      }

      params.set("page", "1");

      return params;
    });
  };

  // --------------------------------------------------
  // SORT
  // --------------------------------------------------

  const updateSort = (value) => {
    setSearchParams((currentParams) => {
      const params = new URLSearchParams(currentParams);

      if (!value) {
        params.delete("sortBy");
        params.delete("order");
      } else {
        const [newSortBy, newOrder] = value.split("-");

        params.set("sortBy", newSortBy);
        params.set("order", newOrder);
      }

      params.set("page", "1");

      return params;
    });
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <nav className="border-b bg-white px-4 py-4 sm:px-6">
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
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6">

        {/* PAGE HEADER */}
        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your product catalog
            </p>
          </div>

          <button
            onClick={() => navigate("/products/new")}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Add Product
          </button>

        </div>

        {/* FILTERS */}
        <ProductFilters
          search={searchInput}
          onSearchChange={setSearchInput}
          category={category}
          categories={categories}
          sortBy={sortBy}
          order={order}
          onCategoryChange={updateCategory}
          onSortChange={updateSort}
        />

        {/* LOADING */}
        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-500">
              Loading products...
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div className="rounded-xl border border-red-100 bg-white p-10 text-center">

            <p className="mb-4 text-red-600">
              {error}
            </p>

            <button
              onClick={retry}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Retry
            </button>

          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">

              <p className="text-slate-500">
                No products found.
              </p>

            </div>
          )}

        {/* PRODUCTS */}
        {!loading &&
          !error &&
          products.length > 0 && (
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