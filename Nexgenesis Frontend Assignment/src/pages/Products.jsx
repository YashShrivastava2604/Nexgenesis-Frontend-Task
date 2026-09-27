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

  /*
   * Read pagination values from the URL.
   * Invalid values fall back to safe defaults.
   */
  const rawPage = Number(searchParams.get("page"));
  const rawLimit = Number(searchParams.get("limit"));

  const page =
    Number.isInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const limit = [10, 20, 50].includes(rawLimit)
    ? rawLimit
    : 10;

  /*
   * Read filters and sorting from the URL.
   */
  const urlSearch = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "";

  /*
   * Local search state allows the user to type
   * without making an API request on every keystroke.
   */
  const [searchInput, setSearchInput] = useState(urlSearch);

  const [categories, setCategories] = useState([]);

  const debouncedSearch = useDebounce(searchInput, 500);

  /*
   * Load product categories once when the page mounts.
   */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        // The product list can still work if categories fail.
      }
    };

    loadCategories();
  }, []);

  /*
   * Keep the search input synchronized with the URL.
   */
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  /*
   * Update URL after the user stops typing.
   * Searching always resets pagination to page 1.
   */
  useEffect(() => {
    if (debouncedSearch === urlSearch) {
      return;
    }

    const params = new URLSearchParams(searchParams);

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());

      // DummyJSON cannot search and category-filter together.
      params.delete("category");
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

  /*
   * Fetch products based on the current URL state.
   */
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

  /*
   * Change page while preserving the other URL parameters.
   */
  const updatePage = (newPage) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", String(newPage));

    setSearchParams(params);
  };

  /*
   * Changing page size resets pagination to page 1.
   */
  const updateLimit = (newLimit) => {
    const params = new URLSearchParams(searchParams);

    params.set("limit", String(newLimit));
    params.set("page", "1");

    setSearchParams(params);
  };

  /*
   * Change category and reset pagination.
   */
  const updateCategory = (newCategory) => {
    const params = new URLSearchParams(searchParams);

    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    params.set("page", "1");

    setSearchParams(params);
  };

  /*
   * Change sorting and reset pagination.
   */
  const updateSort = (value) => {
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete("sortBy");
      params.delete("order");
    } else {
      const [newSortBy, newOrder] = value.split("-");

      params.set("sortBy", newSortBy);
      params.set("order", newOrder);
    }

    params.set("page", "1");

    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
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

      {/* Main content */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6">
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

        {/* Filters */}
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

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-500">
              Loading products...
            </p>
          </div>
        )}

        {/* Error */}
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

        {/* Empty */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-slate-500">
                No products found.
              </p>
            </div>
          )}

        {/* Products */}
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
