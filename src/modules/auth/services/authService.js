import { apiClient } from "@/utils/apiClient";

export const login = async (data) => {
  try {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Something went wrong";
  }
};

export default apiClient;
