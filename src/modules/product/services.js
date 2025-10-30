// services/productService.js
import { apiClient } from "@/utils/apiClient";
import { authConfig } from "@/utils/authConfig";

const api = {
  get: (url, params) => apiClient.get(url, authConfig({ params })),
  post: (url, data) => apiClient.post(url, data, authConfig()),
  put: (url, data) => apiClient.put(url, data, authConfig()),
  patch: (url, data = {}) => apiClient.patch(url, data, authConfig()),
  delete: (url) => apiClient.delete(url, authConfig()),
};

export const productService = {
  createProducts: (payload) => api.post("/product/add-product", payload),

  getAllProducts: (page, limit) =>
    api.get("/product/getall-products", { page, limit }),

  getProductById: (id) => api.get(`/product/get-product/${id}`),
  updateProduct: (id, payload) => api.put(`/product/update-product/${id}`, payload),
  deleteProduct: (id) => api.delete(`/product/delete-product/${id}`),
};
