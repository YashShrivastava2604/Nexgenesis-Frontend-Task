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

  if (search.trim()) {
    endpoint = `/products/search?q=${encodeURIComponent(
      search.trim()
    )}`;
  } else if (category) {
    endpoint = `/products/category/${encodeURIComponent(
      category
    )}`;
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

  const response = await api.get(
    `${endpoint}?${params.toString()}`,
    {
      signal,
    }
  );

  const localProducts = JSON.parse(
    localStorage.getItem("product-mutations") ||
      '{"added":[],"updated":{},"deleted":[]}'
  );

  let products = response.data.products
    .filter(
      (product) =>
        !localProducts.deleted.includes(
          String(product.id)
        )
    )
    .map(
      (product) =>
        localProducts.updated[String(product.id)] ||
        product
    );

  /*
   * Locally-created products are included in the
   * normal product listing.
   */
  if (!search.trim() && !category) {
    products = [
      ...localProducts.added,
      ...products,
    ];
  }

  /*
   * Prevent duplicate IDs from ever reaching React.
   */
  products = Array.from(
    new Map(
      products.map((product) => [
        String(product.id),
        product,
      ])
    ).values()
  );

  return {
    ...response.data,
    products,
    total:
      response.data.total -
      localProducts.deleted.filter(
        (id) =>
          !String(id).startsWith("local-")
      ).length +
      localProducts.added.length,
  };
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