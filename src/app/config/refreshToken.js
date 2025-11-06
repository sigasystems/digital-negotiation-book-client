import { apiClient } from "@/utils/apiClient";

export const refreshToken = async () => {
  const refreshToken = sessionStorage.getItem("refreshToken");

  const response = await apiClient.post("/auth/refresh-token", {
    refreshToken,
  });

    return response.data;
};
