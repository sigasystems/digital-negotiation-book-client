import { apiClient } from "@/utils/apiClient";

export const getAllBusinessOwners = async () => {
  try {
    // Get token from sessionStorage
    const token = sessionStorage.getItem("authToken");

    const response = await apiClient.get("/superadmin/business-owners", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch business owners";
  }
};

export default apiClient;
