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

export const businessOwnerService = {
  getAllBuyers: ({ pageIndex = 0, pageSize = 10, filters = {} } = {}) =>
    api.get("/business-owner/get-all-buyers", {
      pageIndex,
      pageSize,
      ...filters,
    }),

  getBuyersList: () => {
      return api.get("/business-owner/get-buyers-list");
    },

  getBuyerById: (id) => {
    if (!id) throw new Error("Buyer ID is required");
    return api.get(`/business-owner/get-buyer/${id}`);
  },

  searchBuyers: (ownerId, filters = {}) => {
    const query = {};
      if (filters.country) query.country = filters.country;
      if (filters.status) query.status = filters.status;
      if (filters.isVerified !== undefined) query.isVerified = filters.isVerified;
      if (filters.page !== undefined) query.page = filters.page;
    if (filters.limit !== undefined) query.limit = filters.limit;

    return api.get(`/business-owner/${ownerId}/buyers/search`, { query });
  },

  getPaymentById : (paymentId) =>
  {
    if (!paymentId) throw new Error("Payment ID is required");
    return api.get(`/payments/${paymentId}`);
  },

  
  checkRegistrationNumber: (registrationNumber) => {
    if (!registrationNumber)
      throw new Error("Registration number is required");
    return api.get(
      `/business-owner/check-registration/${registrationNumber}`
    );
  },

  addBuyer: (buyerData) => {
    if (!buyerData) throw new Error("Buyer data is required");
    return api.post("/business-owner/add-buyer", buyerData);
  },

  updateBuyer: (buyerId, buyerData) => {
    if (!buyerId) throw new Error("Buyer ID is required");
    if (!buyerData || typeof buyerData !== "object")
      throw new Error("Valid buyer data is required");

    const sanitizedData = { ...buyerData };
    delete sanitizedData.createdAt;
    delete sanitizedData.updatedAt;
    delete sanitizedData.id;
    return api.patch(`/business-owner/edit-buyer/${buyerId}/edit`, sanitizedData);
  },
  activateBuyer: (buyerId) => {
    if (!buyerId) throw new Error("Buyer ID is required");

    return api.patch(`/business-owner/activate-buyer/${buyerId}/activate`);
  },

  deactivateBuyer: (buyerId) => {
    if (!buyerId) throw new Error("Buyer ID is required");
    return api.patch(`/business-owner/deactivate-buyer/${buyerId}/deactivate`);
  },

  deleteBuyer: (buyerId) => {
    if (!buyerId) throw new Error("Buyer ID is required");
    return api.delete(`/business-owner/delete-buyer/${buyerId}`);
  },

  getProductById: (productId) => {
    if (!productId) throw new Error("Product ID is required");
    return api.get(`/product/get-product/${productId}`);
  },

  // ✅ uniqueness check (GET)
  checkUnique: async (params) => {
    try {
      const res = await api.get("/business-owner/check-unique", { params });
      return res;
    } catch (err) {
      throw err;
    }
  },
};

