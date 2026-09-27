const STORAGE_KEY = "product-mutations";

const emptyMutations = () => ({
  added: [],
  updated: {},
  deleted: [],
});

const getMutations = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored
      ? JSON.parse(stored)
      : emptyMutations();
  } catch {
    return emptyMutations();
  }
};

const saveMutations = (mutations) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(mutations)
  );
};

const normalizeId = (id) => String(id);

export const getLocalProduct = (id) => {
  const mutations = getMutations();
  const productId = normalizeId(id);

  // Deleted products should never be returned.
  if (mutations.deleted.includes(productId)) {
    return null;
  }

  // Check locally-created products.
  const addedProduct = mutations.added.find(
    (product) => normalizeId(product.id) === productId
  );

  if (addedProduct) {
    return addedProduct;
  }

  // Check updates to existing products.
  return mutations.updated[productId] || null;
};

export const isProductDeleted = (id) => {
  const mutations = getMutations();

  return mutations.deleted.includes(
    normalizeId(id)
  );
};

export const saveAddedProduct = (product) => {
  const mutations = getMutations();

  mutations.added.push(product);

  saveMutations(mutations);
};

export const saveUpdatedProduct = (product) => {
  const mutations = getMutations();
  const productId = normalizeId(product.id);

  const addedIndex = mutations.added.findIndex(
    (item) =>
      normalizeId(item.id) === productId
  );

  /*
   * If it was created locally, update that
   * local product directly.
   */
  if (addedIndex !== -1) {
    mutations.added[addedIndex] = {
      ...mutations.added[addedIndex],
      ...product,
    };
  } else {
    /*
     * Otherwise store an override for the
     * original DummyJSON product.
     */
    mutations.updated[productId] = {
      ...mutations.updated[productId],
      ...product,
    };
  }

  saveMutations(mutations);
};

export const saveDeletedProduct = (id) => {
  const mutations = getMutations();
  const productId = normalizeId(id);

  mutations.deleted = [
    ...new Set([
      ...mutations.deleted,
      productId,
    ]),
  ];

  // Remove from locally-created products.
  mutations.added = mutations.added.filter(
    (product) =>
      normalizeId(product.id) !== productId
  );

  // Remove any local update.
  delete mutations.updated[productId];

  saveMutations(mutations);
};