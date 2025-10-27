import { apiClient } from "@/utils/apiClient";

export const createPayment = async (payload) => {
  try {
    const response = await apiClient.post("/subscription/create-checkout-session", payload, {
      withCredentials: true,
    });
    return response.data; // <-- returns { checkoutUrl, payment }
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
    console.log("Become business owner succcesfully done !!!...Onboard succesfully......",payload)
    return response.data; 
  } catch (err) {
    console.error("Error in becomeBusinessOwner service:", err);
    throw err.response?.data?.message || "Failed to create business owner";
  }
};

export const checkRegistrationNumber = async (registrationNumber) => {
  const res = await apiClient.get(`/business-owner/check-registration/${registrationNumber}`);
  return res.data;
};