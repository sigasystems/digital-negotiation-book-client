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
    create: (data) => api.post("/country", data),

  getAll: (params = {}) => api.get("/country", params),

  getAllCountries: (params = {}) => api.get("/country/all", params),

  search: (params = {}) => api.get("/country/search", params),

  getById: (id) => api.get(`/country/${id}`),

  update: (id, data) => api.put(`/country/${id}`, data),

  remove: (id) => api.delete(`/country/${id}`),

  search: (query = "", pageIndex = 0, pageSize = 10) => {
    const params = {
      query,
      pageIndex,
      pageSize,
    };
    return api.get("/country/search", params);
  },
}