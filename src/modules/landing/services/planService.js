import { apiClient } from "@/utils/apiClient";

export const getAllPlans = async () => {
  try {
    const response = await apiClient.get("/plans/getall-plans", {
      withCredentials: true, // if your backend uses cookies
    });
    return response.data.data; // assuming your backend response is { success: true, data: [...] }
  } catch (err) {
    console.error("Error fetching plans:", err);
    throw err.response?.data?.message || "Failed to fetch plans";
  }
};
