import api from "./axios";

import {
  getLocalProduct,
  isProductDeleted,
  saveAddedProduct,
  saveUpdatedProduct,
  saveDeletedProduct,
} from "../utils/productStorage";

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

  // Decide which DummyJSON endpoint to use
  if (search.trim()) {
    endpoint = "/products/search";
  } else if (category) {
    endpoint = `/products/category/${encodeURIComponent(category)}`;
  }

  // Build query parameters
  const params = new URLSearchParams();

  params.set("limit", String(limit));
  params.set("skip", String(skip));

  // Search query
  if (search.trim()) {
    params.set("q", search.trim());
  }

  // Sorting
  if (sortBy) {
    params.set("sortBy", sortBy);
  }

  if (order) {
    params.set("order", order);
  }

  const response = await api.get(
    `${endpoint}?${params.toString()}`,
    {
      signal,
    }
  );

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get(
    "/products/categories"
  );

  return response.data;
};

export const getProduct = async (id) => {
  const productId = String(id);

  /*
   * Check local deletion first.
   */
  if (isProductDeleted(productId)) {
    const error = new Error(
      "Product not found"
    );

    error.response = {
      status: 404,
    };

    throw error;
  }

  /*
   * Check locally-created/updated products.
   */
  const localProduct = getLocalProduct(productId);

  if (localProduct) {
    return localProduct;
  }

  /*
   * Otherwise fetch from DummyJSON.
   */
  const response = await api.get(
    `/products/${productId}`
  );

  return response.data;
};

export const addProduct = async (product) => {
  /*
   * Call DummyJSON because the assignment requires
   * the API operation, but do NOT trust its returned ID.
   */
  await api.post("/products/add", product);

  /*
   * Generate our own persistent client-side ID.
   */
  const localProduct = {
    ...product,
    id: `local-${crypto.randomUUID()}`,
  };

  saveAddedProduct(localProduct);

  return localProduct;
};

export const updateProduct = async (
  id,
  product
) => {
  const productId = String(id);

  const localProduct =
    getLocalProduct(productId);

  /*
   * Locally-created product:
   * don't call DummyJSON because it doesn't exist there.
   */
  if (
    localProduct &&
    productId.startsWith("local-")
  ) {
    const updatedProduct = {
      ...localProduct,
      ...product,
      id: productId,
    };

    saveUpdatedProduct(updatedProduct);

    return updatedProduct;
  }

  /*
   * Existing DummyJSON product.
   */
  const response = await api.put(
    `/products/${productId}`,
    product
  );

  const updatedProduct = {
    ...product,
    ...response.data,
    id: Number(productId),
  };

  saveUpdatedProduct(updatedProduct);

  return updatedProduct;
};

export const deleteProduct = async (id) => {
  const productId = String(id);

  /*
   * Locally-created product:
   * don't call DummyJSON.
   */
  if (productId.startsWith("local-")) {
    saveDeletedProduct(productId);

    return {
      id: productId,
      isDeleted: true,
    };
  }

  /*
   * Existing DummyJSON product.
   */
  const response = await api.delete(
    `/products/${productId}`
  );

  saveDeletedProduct(productId);

  return response.data;
};