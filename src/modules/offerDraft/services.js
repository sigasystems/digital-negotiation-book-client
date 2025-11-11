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
export const offerDraftService = {
  // ✅ Create Offer Draft
  createDraft: (data) => api.post("/offer-draft/create-draft", data),

  // ✅ Get all drafts with pagination
  getAllOfferDrafts: ({ pageIndex = 0, pageSize = 10 } = {}) => api.get("/offer-draft/get-all", { pageIndex, pageSize }),

  // ✅ Get a single draft by ID
  getDraftById: (id) => api.get(`/offer-draft/get/${id}`),

  // ✅ Update a draft by ID
  updateDraft: (id, data) => api.patch(`/offer-draft/update/${id}`, data),

  // ✅ Delete a draft by ID
  deleteDraft: (id) => api.delete(`/offer-draft/delete/${id}`),

  getLatestDraftNo: () => api.get("/offer-draft/latest"),

 searchOfferDrafts: async (query) => {
  return api.get("/offer-draft/search", query);
},
};
