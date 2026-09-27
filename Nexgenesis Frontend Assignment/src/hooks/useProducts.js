import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts } from "../api/productsApi";

const useProducts = ({
  page,
  limit,
  search,
  category,
  sortBy,
  order,
}) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const abortControllerRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const data = await getProducts({
        limit,
        skip: (page - 1) * limit,
        search,
        category,
        sortBy,
        order,
        signal: controller.signal,
      });

      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        return;
      }

      setError("Failed to load products.");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [page, limit, search, category, sortBy, order]);

  useEffect(() => {
    fetchProducts();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchProducts]);

  return {
    products,
    total,
    loading,
    error,
    retry: fetchProducts,
  };
};

export default useProducts;