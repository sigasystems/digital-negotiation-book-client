import { apiClient } from "@/utils/apiClient";

/**
 * Fetch business owners with pagination
 * @param {number} pageIndex - Zero-based page index
 * @param {number} pageSize - Number of rows per page
 * @param {boolean} withBuyers - Include buyers or not
 */
export const getAllBusinessOwners = async ({ pageIndex = 0, pageSize = 10, withBuyers = false } = {}) => {
  try {
    const token = sessionStorage.getItem("authToken");

    const response = await apiClient.get("/superadmin/business-owners", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      params: {
        pageIndex,
        pageSize,
        withBuyers,
      },
    });

    // Response will have { data, totalItems, totalPages, pageIndex, pageSize }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch business owners";
  }
};

// export default apiClient;
