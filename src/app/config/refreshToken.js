import { apiClient } from "@/utils/apiClient";

export const refreshToken = async () => {
  try {
    const response = await apiClient.get("/auth/refresh-token", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to refresh token";
  }
};

export default apiClient;
