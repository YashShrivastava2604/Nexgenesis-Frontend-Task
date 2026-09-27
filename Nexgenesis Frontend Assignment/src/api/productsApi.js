import api from "./axios";

export const getProducts = async ({
  limit = 10,
  skip = 0,
  search = "",
  category = "",
  sortBy = "",
  order = "",
  signal,
} = {}) => {
  let endpoint = "/products";

  if (search.trim()) {
    endpoint = `/products/search?q=${encodeURIComponent(search.trim())}`;
  } else if (category) {
    endpoint = `/products/category/${encodeURIComponent(category)}`;
  }

  const params = new URLSearchParams();

  params.set("limit", limit);
  params.set("skip", skip);

  if (sortBy) {
    params.set("sortBy", sortBy);
  }

  if (order) {
    params.set("order", order);
  }

  const response = await api.get(`${endpoint}?${params.toString()}`, {
    signal,
  });

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/products/categories");
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (product) => {
  const response = await api.post("/products/add", product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};