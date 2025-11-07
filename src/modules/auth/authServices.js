import { apiClient } from "@/utils/apiClient";

export const login = async (data) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
};