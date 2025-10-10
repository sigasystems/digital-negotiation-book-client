import { apiClient } from "@/utils/apiClient";

export const forgotPassword = async (data) => {
  try {
    const response = await apiClient.post("/auth/request-reset", data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to send reset email";
  }
};

export const resetPasswordWithOtp = async (data) => {
  try {
    const response = await apiClient.post("/auth/reset-password-otp", data);
    return response.data;
  } catch (error) {
    console.error("Reset Password Error:", error);
    throw error.response?.data?.message || "Failed to reset password. Please try again.";
  }
};
