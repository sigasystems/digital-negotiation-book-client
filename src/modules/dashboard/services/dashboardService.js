import { apiClient } from "@/utils/apiClient";

// 🔒 Helper to attach auth headers to every request
const authConfig = (extra = {}) => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
    ...extra.headers,
  },
  withCredentials: true,
  ...extra,
});

// 🧩 Generic API methods for reusability
const api = {
  get: (url, params) => apiClient.get(url, authConfig({ params })),
  post: (url, data) => apiClient.post(url, data, authConfig()),
  put: (url, data) => apiClient.put(url, data, authConfig()),
  patch: (url, data = {}) => apiClient.patch(url, data, authConfig()),
  delete: (url) => apiClient.delete(url, authConfig()),
};

// 🧠 Business Owner API services
export const dashboardService = {
  createBusinessOwner: (payload) => api.post("/superadmin/create-business-owner", payload),

  getAllBusinessOwners: ({ pageIndex = 0, pageSize = 10, withBuyers = false } = {}) =>
    api.get("/superadmin/business-owners", { pageIndex, pageSize, withBuyers }),

  getBusinessOwnerById: (id) => api.get(`/superadmin/business-owner/${id}`),

  updateBusinessOwner: (id, payload) => api.patch(`/superadmin/business-owner/${id}`, payload),

  activateBusinessOwner: (id) => api.patch(`/superadmin/business-owner/${id}/activate`),

  deactivateBusinessOwner: (id) => api.patch(`/superadmin/business-owner/${id}/deactivate`),

  softDeleteBusinessOwner: (id) => api.delete(`/superadmin/business-owner/${id}`),

  reviewBusinessOwner: (id, payload) => api.patch(`/superadmin/business-owner/${id}/review`, payload),
};
