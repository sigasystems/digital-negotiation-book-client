import { apiClient } from "@/utils/apiClient";

const authConfig = (extra = {}) => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
    ...extra.headers,
  },
  withCredentials: true,
  ...extra,
});

const api = {
  get: (url, params) => apiClient.get(url, authConfig({ params })),
  post: (url, data) => apiClient.post(url, data, authConfig()),
  put: (url, data) => apiClient.put(url, data, authConfig()),
  patch: (url, data = {}) => apiClient.patch(url, data, authConfig()),
  delete: (url) => apiClient.delete(url, authConfig()),
};

export const countryServices = {
    create: (data) => {
    if (!data) throw new Error("Data is required to create country");
    return api.post("/country", data);
  },

  getAll: (params = {}) => api.get("/country", params),

  search: (query = {}) => api.get("/country/search", { query }),

  getById: (id) => {
    if (!id) throw new Error("Country ID is required");
    return api.get(`/country/${id}`);
  },

  update: (id, data) => {
    if (!id) throw new Error("Country ID is required");
    if (!data) throw new Error("Data is required to update country");
    return api.put(`/country/${id}`, data);
  },

  remove: (id) => {
    if (!id) throw new Error("Country ID is required");
    return api.delete(`/country/${id}`);
  },
}