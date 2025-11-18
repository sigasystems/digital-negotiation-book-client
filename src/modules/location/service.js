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

export const locationServices = {
  addLocation: (payload) => api.post("/location", payload),

  getAllLocations: (params = {}) => api.get("/location", params),

  getLocationById: (id) => api.get(`/location/${id}`),

  updateLocation: (id, payload) => api.put(`/location/${id}`, payload),

  deleteLocation: (id) => api.delete(`/location/${id}`),

  searchLocations: (params = {}) => api.get("/location/search", params),
};
