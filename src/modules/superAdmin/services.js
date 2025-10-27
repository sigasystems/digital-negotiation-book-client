import apiClient from "@/utils/apiClient";

export const addBusinessOwnerApi = async (data) => {
  try {
    const response = await apiClient.post("/superadmin/create-business-owner", data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to add new business owner";
    throw new Error(message);
  }
};
