import { apiClient } from "@/utils/apiClient";
import { authConfig } from "@/utils/authConfig";

// Generic API wrapper
const api = {
  get: (url, params) => apiClient.get(url, authConfig({ params })),
  post: (url, data) => apiClient.post(url, data, authConfig()),
  put: (url, data) => apiClient.put(url, data, authConfig()),
  patch: (url, data = {}) => apiClient.patch(url, data, authConfig()),
  delete: (url) => apiClient.delete(url, authConfig()),
};

// Offer Draft API services
export const offerDraftServices = {
  // ✅ Create Offer Draft
  createDraft: (data) => api.post("/offer-draft/create-draft", data),

  // ✅ Get all drafts (optional if you’ll need listing)
  getAllDrafts: (params) => api.get("/offer-drafts", params),

  // ✅ Get a single draft by ID
  getDraftById: (id) => api.get(`/offer-drafts/${id}`),

  // ✅ Update a draft by ID
  updateDraft: (id, data) => api.put(`/offer-drafts/${id}`, data),

  // ✅ Delete a draft by ID
  deleteDraft: (id) => api.delete(`/offer-drafts/${id}`),
};
