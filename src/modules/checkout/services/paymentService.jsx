import { apiClient } from "@/utils/apiClient";

export const createPayment = async (payload) => {
  try {
    const response = await apiClient.post("/payments/create-payment", payload, {
      withCredentials: true,
    });
    return response.data.data; // <-- returns { checkoutUrl, payment }
  } catch (err) {
    console.error("Payment Error:", err);
    throw err.response?.data?.message || "Failed to create payment";
  }
};


export const becomeBusinessOwner = async (payload) => {
  try {

    const response = await apiClient.post(
      "/business-owner/become-business-owner",
      payload,
      { withCredentials: true }
    );
    return response.data; // ✅ should contain { success, message, data }
  } catch (err) {
    console.error("Error in becomeBusinessOwner service:", err);
    throw err.response?.data?.message || "Failed to create business owner";
  }
};
