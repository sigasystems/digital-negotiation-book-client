export const createHandleProductSelect = (setFormData, fetchProductDetails) => {
  return async (pIndex, productId) => {
    setFormData(prev => {
      const products = [...prev.products];
      products[pIndex] = {
        ...products[pIndex],
        productId,
        species: "",
        sizeBreakups: products[pIndex].sizeBreakups || [],
      };

      return { ...prev, products };
    });

    if (productId) {
      await fetchProductDetails(productId);
    }
  };
};
