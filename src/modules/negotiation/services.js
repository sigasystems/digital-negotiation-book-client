import { apiClient } from "@/utils/apiClient";

// 🔒 Helper to attach auth headers
const authConfig = (extra = {}) => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
    ...extra.headers,
  },
  withCredentials: true,
  ...extra,
});

// 🧩 Generic API methods
const api = {
  get: (url, params) => apiClient.get(url, authConfig({ params })),
  post: (url, data) => apiClient.post(url, data, authConfig()),
  put: (url, data) => apiClient.put(url, data, authConfig()),
  patch: (url, data = {}) => apiClient.patch(url, data, authConfig()),
  delete: (url) => apiClient.delete(url, authConfig()),
};

const negotiationServices = {
    getNegotiationbyId : (id) => apiClient.get(`/offer/negotiation/${id}`),
}

export default negotiationServices