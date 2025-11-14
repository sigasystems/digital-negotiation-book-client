import { apiClient } from "@/utils/apiClient";

export const createPayment = async (payload) => {
  try {
    const response = await apiClient.post("/subscription/create-checkout-session", payload, {
      withCredentials: true,
    });
    console.log('response....',response.data?.url);
    return response.data?.url; // <-- returns { checkoutUrl, payment }
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

export const getPaymentById = async (paymentId) => {
  if (!paymentId) throw new Error("Payment ID is required");
  return apiClient.get(`/payments/${paymentId}`);
}

// GET /api/payments/invoice/:userId
// export const getInvoice = async (userId) => {
//     try {
//         // Replace apiClient with your actual HTTP client logic (e.g., fetch or axios)
//         const response = await fetch(`/api/payments/invoice/${userId}`, {
//              method: 'GET',
//              headers: {
//                  'Content-Type': 'application/json',
//                  // Include any necessary authentication headers/cookies
//              },
//              // Assuming this handles cookie inclusion if needed
//              // withCredentials: true, 
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || "Failed to fetch invoice");
//         }
        
//         return await response.json(); // <-- returns { invoicePdf: '...' }
//     } catch (err) {
//         console.error("Error in getInvoice service:", err);
//         // Better error handling for the component
//         throw new Error(err.message || "Failed to get invoice due to network error"); 
//     }
// };