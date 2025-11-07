import { apiClient } from "@/utils/apiClient";
import { authConfig } from "@/utils/authConfig";

const api = {
  get: (url, params) => apiClient.get(url, authConfig({ params })),
  post: (url, data) => apiClient.post(url, data, authConfig()),
  put: (url, data) => apiClient.put(url, data, authConfig()),
  patch: (url, data = {}) => apiClient.patch(url, data, authConfig()),
  delete: (url) => apiClient.delete(url, authConfig()),
};

export const offerService = {
  createOffer: (draftId, offerName) =>
    api.post(`/offer/create-offer/${draftId}`, { offerName }),

  getOfferById: (id) => api.get(`/offer/get/${id}`),

  getAllOffers: (params = {}) => api.get("/offer/get-all", params),

  updateOffer: (id, data) => api.patch(`/offer/update/${id}`, data),

  deleteOffer: (id) => api.delete(`/offer/delete/${id}`),

  searchOffers: (query) => api.get("/offer/search", query),
};
