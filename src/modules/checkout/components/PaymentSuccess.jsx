import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { becomeBusinessOwner } from "../services/paymentService";
import { formatDate, formatTime } from "@/utils/formateDate";
import { PaymentStatusView } from "../utils/statusPayment";

const CURRENCY_SYMBOL = {
    "INR": "₹",
    "USD": "$",
    "EUR": "€"
};

const MOCK_PLAN_PRICES = {
    // Pro Plan (Yearly: 2999, Monthly: 299)
    "745c7918-8b87-4498-ba8a-27f2eb98bfc8": { name: "Pro", priceMonthly: "299.00", priceYearly: "2999.00", currency: "INR" },
    // Basic Plan (Yearly: 1999, Monthly: 199) - Defaulted in current getInitialOrderData
    "d1d98dd8-779e-4777-9ca7-19a1413ac78d": { name: "Basic", priceMonthly: "199.00", priceYearly: "1999.00", currency: "INR" },
};

const getInitialOrderData = () => {
    try {
        const rawData = sessionStorage.getItem("pendingBusinessData");
        const parsedData = rawData ? JSON.parse(rawData) : {};
        
        const planId = parsedData.planId || 'd1d98dd8-779e-4777-9ca7-19a1413ac78d';
        const billingCycle = parsedData.billingCycle || 'monthly';
        
        const planDetails = MOCK_PLAN_PRICES[planId] || MOCK_PLAN_PRICES['d1d98dd8-779e-4777-9ca7-19a1413ac78d'];
        const mockPriceKey = billingCycle === 'yearly' ? 'priceYearly' : 'priceMonthly';
        
        // This ensures the processing/error screen shows the expected charged amount
        const initialPrice = planDetails[mockPriceKey] || '199.00'; 
        const currencyCode = planDetails.currency || 'INR';

        return {
            businessName: parsedData.businessName || 'Your Business',
            email: parsedData.email || 'user@example.com',
            planId: planId,
            billingCycle: billingCycle,
            
            // Initial price and plan set from mock data
            planName: planDetails.name || 'Basic Plan',
            planPrice: initialPrice, 
            total: initialPrice,
            currencySymbol: CURRENCY_SYMBOL[currencyCode] || '₹', 
            currencyCode: currencyCode,
            
            // Mocked/Placeholder payment details
            cardLast4: '1234', 
            cardType: 'Visa', 
            transactionId: 'TXN-9876543210', 
            invoicePdf: null, // Initialize invoicePdf to null
            
            ...parsedData, // Merge all other form data
        };
    } catch (error) {
        console.error("Failed to parse session storage data:", error);
        return {};
    }
};

export default function PaymentSuccess() {
  const [status, setStatus] = useState("processing");
  const [orderData, setOrderData] = useState(getInitialOrderData());
  const [currentStep, setCurrentStep] = useState(0);
  const [setupError, setSetupError] = useState(null);
  const hasRun = useRef(false);
  const navigate = useNavigate();

  const handleGoToDashboard = useCallback(() => {
    sessionStorage.removeItem("pendingBusinessData");
    navigate("/dashboard");
  }, [navigate]);

  const handleReturnToPricing = useCallback(() => {
    sessionStorage.removeItem("pendingBusinessData");
    navigate("/");
  }, [navigate]);

  const formatPrice = (price) => `${orderData.currencySymbol}${parseFloat(price || "0").toFixed(2)}`;

  const handlePrintReceipt = () => {
    const w = window.open("", "_blank");
    w.document.write(`<h1>Receipt</h1><p>Total: ${formatPrice(orderData.planPrice)}</p>`);
    w.document.close();
    w.print();
  };

  useEffect(() => {
    const handleBusinessCreation = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      const sessionData = getInitialOrderData();
      const now = new Date();
      const nextBillingDate = new Date(now);
      sessionData.billingCycle === "yearly"
        ? nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
        : nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      setOrderData((prev) => ({
        ...prev,
        ...sessionData,
        nextBilling: formatDate(nextBillingDate),
        time: formatTime(now),
        date: formatDate(now),
      }));

      try {
        for (let i = 1; i <= 4; i++) {
          setCurrentStep(i);
          await new Promise((r) => setTimeout(r, 600));
        }

        const res = await becomeBusinessOwner(sessionData);
        if (res?.success && res.data) {
          setOrderData((prev) => ({
            ...prev,
            planPrice: res.data.plan?.price || prev.planPrice,
            transactionId: res.data.transactionId || prev.transactionId,
          }));
          setStatus("success");
        } else {
          setSetupError(res?.message || "Account creation failed.");
          setStatus("error");
        }
      } catch {
        setSetupError("Network error. Payment is safe, setup pending.");
        setStatus("error");
      }
    };

    handleBusinessCreation();
  }, []);

  return (
    <PaymentStatusView
      status={status}
      orderData={orderData}
      currentStep={currentStep}
      setupError={setupError}
      handleGoToDashboard={handleGoToDashboard}
      handleReturnToPricing={handleReturnToPricing}
      handlePrintReceipt={handlePrintReceipt}
      formatPrice={formatPrice}
    />
  );
}                             












// import { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { becomeBusinessOwner } from "../services/paymentService";
// import { formatDate, formatTime } from "@/utils/formateDate";
// import { PaymentStatusView } from "../utils/statusPayment";

// const CURRENCY_SYMBOL = {
//   "INR": "₹",
//   "USD": "$",
//   "EUR": "€",
//   "GBP": "£",
//   "JPY": "¥",
//   "AUD": "A$",
//   "CAD": "C$"
// };

// const MOCK_PLAN_PRICES = {
//   // Pro Plan (Yearly: 2999, Monthly: 299)
//   "745c7918-8b87-4498-ba8a-27f2eb98bfc8": { 
//     name: "Pro", 
//     priceMonthly: "299.00", 
//     priceYearly: "2999.00", 
//     currency: "INR",
//     features: ["Unlimited Projects", "Advanced Analytics", "Priority Support", "Custom Integrations"]
//   },
//   // Basic Plan (Yearly: 1999, Monthly: 199)
//   "d1d98dd8-779e-4777-9ca7-19a1413ac78d": { 
//     name: "Basic", 
//     priceMonthly: "199.00", 
//     priceYearly: "1999.00", 
//     currency: "INR",
//     features: ["5 Projects", "Basic Analytics", "Email Support", "Standard Features"]
//   },
//   // Enterprise Plan (Custom pricing)
//   "e3f45a21-9c12-4d67-a5b6-28f3ed89cfa9": { 
//     name: "Enterprise", 
//     priceMonthly: "999.00", 
//     priceYearly: "9999.00", 
//     currency: "INR",
//     features: ["Unlimited Everything", "Dedicated Support", "Custom Solutions", "SLA Guarantee"]
//   },
// };

// const getInitialOrderData = () => {
//   try {
//     const rawData = sessionStorage.getItem("pendingBusinessData");
//     const parsedData = rawData ? JSON.parse(rawData) : {};
    
//     const planId = parsedData.planId || 'd1d98dd8-779e-4777-9ca7-19a1413ac78d';
//     const billingCycle = parsedData.billingCycle || 'monthly';
    
//     const planDetails = MOCK_PLAN_PRICES[planId] || MOCK_PLAN_PRICES['d1d98dd8-779e-4777-9ca7-19a1413ac78d'];
//     const mockPriceKey = billingCycle === 'yearly' ? 'priceYearly' : 'priceMonthly';
    
//     const initialPrice = planDetails[mockPriceKey] || '199.00'; 
//     const currencyCode = planDetails.currency || 'INR';

//     return {
//       businessName: parsedData.businessName || 'Your Business',
//       email: parsedData.email || 'user@example.com',
//       planId: planId,
//       billingCycle: billingCycle,
      
//       // Plan details
//       planName: planDetails.name || 'Basic Plan',
//       planPrice: initialPrice, 
//       total: initialPrice,
//       currencySymbol: CURRENCY_SYMBOL[currencyCode] || '₹', 
//       currencyCode: currencyCode,
//       planFeatures: planDetails.features || [],
      
//       // Payment details (mocked)
//       cardLast4: parsedData.cardLast4 || '1234', 
//       cardType: parsedData.cardType || 'Visa', 
//       transactionId: parsedData.transactionId || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 
//       invoicePdf: null, // Will be populated after successful setup
      
//       // Merge all other form data
//       ...parsedData,
//     };
//   } catch (error) {
//     console.error("Failed to parse session storage data:", error);
//     return {
//       businessName: 'Your Business',
//       email: 'user@example.com',
//       planName: 'Basic Plan',
//       planPrice: '199.00',
//       currencySymbol: '₹',
//       currencyCode: 'INR',
//       billingCycle: 'monthly',
//       cardLast4: '1234',
//       cardType: 'Visa',
//       transactionId: `TXN-${Date.now()}`,
//       planFeatures: []
//     };
//   }
// };

// export default function PaymentSuccess() {
//   const [status, setStatus] = useState("processing");
//   const [orderData, setOrderData] = useState(getInitialOrderData());
//   const [currentStep, setCurrentStep] = useState(0);
//   const [setupError, setSetupError] = useState(null);
//   const hasRun = useRef(false);
//   const navigate = useNavigate();

//   // Navigation handlers
//   const handleGoToDashboard = useCallback(() => {
//     sessionStorage.removeItem("pendingBusinessData");
//     // Store success flag for dashboard
//     sessionStorage.setItem("setupCompleted", "true");
//     navigate("/dashboard");
//   }, [navigate]);

//   const handleReturnToPricing = useCallback(() => {
//     sessionStorage.removeItem("pendingBusinessData");
//     navigate("/");
//   }, [navigate]);

//   // Price formatting
//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || "0");
//     return `${orderData.currencySymbol}${numPrice.toFixed(2)}`;
//   }, [orderData.currencySymbol]);

//   // Print receipt handler
//   const handlePrintReceipt = useCallback(() => {
//     const printWindow = window.open("", "_blank");
    
//     const receiptHTML = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Payment Receipt - ${orderData.transactionId}</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               max-width: 800px;
//               margin: 40px auto;
//               padding: 20px;
//               line-height: 1.6;
//             }
//             .header {
//               text-align: center;
//               border-bottom: 3px solid #4F46E5;
//               padding-bottom: 20px;
//               margin-bottom: 30px;
//             }
//             .header h1 {
//               color: #4F46E5;
//               margin: 0;
//             }
//             .section {
//               margin: 20px 0;
//               padding: 15px;
//               background: #f9fafb;
//               border-radius: 8px;
//             }
//             .section h2 {
//               color: #374151;
//               margin-top: 0;
//               font-size: 18px;
//             }
//             .row {
//               display: flex;
//               justify-content: space-between;
//               padding: 8px 0;
//               border-bottom: 1px solid #e5e7eb;
//             }
//             .row:last-child {
//               border-bottom: none;
//             }
//             .label {
//               font-weight: 600;
//               color: #6b7280;
//             }
//             .value {
//               color: #111827;
//             }
//             .total {
//               font-size: 24px;
//               font-weight: bold;
//               color: #10b981;
//               text-align: right;
//               margin-top: 20px;
//               padding-top: 20px;
//               border-top: 2px solid #4F46E5;
//             }
//             .footer {
//               text-align: center;
//               margin-top: 40px;
//               padding-top: 20px;
//               border-top: 1px solid #e5e7eb;
//               color: #6b7280;
//               font-size: 12px;
//             }
//             @media print {
//               body { margin: 0; }
//               .no-print { display: none; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>PAYMENT RECEIPT</h1>
//             <p style="color: #10b981; font-weight: bold; font-size: 18px;">✓ PAYMENT SUCCESSFUL</p>
//           </div>
          
//           <div class="section">
//             <h2>Transaction Details</h2>
//             <div class="row">
//               <span class="label">Transaction ID:</span>
//               <span class="value">${orderData.transactionId}</span>
//             </div>
//             <div class="row">
//               <span class="label">Date:</span>
//               <span class="value">${orderData.date || formatDate(new Date())}</span>
//             </div>
//             <div class="row">
//               <span class="label">Time:</span>
//               <span class="value">${orderData.time || formatTime(new Date())}</span>
//             </div>
//             <div class="row">
//               <span class="label">Payment Method:</span>
//               <span class="value">${orderData.cardType} ending in ${orderData.cardLast4}</span>
//             </div>
//           </div>

//           <div class="section">
//             <h2>Customer Information</h2>
//             <div class="row">
//               <span class="label">Business Name:</span>
//               <span class="value">${orderData.businessName}</span>
//             </div>
//             <div class="row">
//               <span class="label">Email:</span>
//               <span class="value">${orderData.email}</span>
//             </div>
//           </div>

//           <div class="section">
//             <h2>Subscription Details</h2>
//             <div class="row">
//               <span class="label">Plan:</span>
//               <span class="value">${orderData.planName} Plan</span>
//             </div>
//             <div class="row">
//               <span class="label">Billing Cycle:</span>
//               <span class="value">${orderData.billingCycle.charAt(0).toUpperCase() + orderData.billingCycle.slice(1)}</span>
//             </div>
//             <div class="row">
//               <span class="label">Next Billing Date:</span>
//               <span class="value">${orderData.nextBilling || 'N/A'}</span>
//             </div>
//           </div>

//           <div class="total">
//             Total Paid: ${formatPrice(orderData.planPrice)}
//           </div>

//           <div class="footer">
//             <p><strong>Thank you for your business!</strong></p>
//             <p>This is an automated receipt. For support, contact support@yourcompany.com</p>
//             <p style="margin-top: 10px;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
//           </div>

//           <div class="no-print" style="text-align: center; margin-top: 30px;">
//             <button onclick="window.print()" style="
//               background: #4F46E5;
//               color: white;
//               padding: 12px 24px;
//               border: none;
//               border-radius: 8px;
//               font-size: 16px;
//               cursor: pointer;
//               font-weight: 600;
//             ">Print Receipt</button>
//             <button onclick="window.close()" style="
//               background: #6b7280;
//               color: white;
//               padding: 12px 24px;
//               border: none;
//               border-radius: 8px;
//               font-size: 16px;
//               cursor: pointer;
//               font-weight: 600;
//               margin-left: 10px;
//             ">Close</button>
//           </div>
//         </body>
//       </html>
//     `;
    
//     printWindow.document.write(receiptHTML);
//     printWindow.document.close();
//   }, [orderData, formatPrice]);

//   // Main business creation effect
//   useEffect(() => {
//     const handleBusinessCreation = async () => {
//       // Prevent double execution
//       if (hasRun.current) return;
//       hasRun.current = true;

//       // Get fresh session data
//       const sessionData = getInitialOrderData();
      
//       // Calculate next billing date
//       const now = new Date();
//       const nextBillingDate = new Date(now);
      
//       if (sessionData.billingCycle === "yearly") {
//         nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
//       } else {
//         nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
//       }

//       // Update order data with calculated dates
//       setOrderData((prev) => ({
//         ...prev,
//         ...sessionData,
//         nextBilling: formatDate(nextBillingDate),
//         time: formatTime(now),
//         date: formatDate(now),
//       }));

//       try {
//         // Simulate progress steps with delays
//         const steps = [1, 2, 3, 4];
//         for (const step of steps) {
//           setCurrentStep(step);
//           // Random delay between 500-800ms for realistic feel
//           await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300));
//         }

//         // Call the actual API
//         const response = await becomeBusinessOwner(sessionData);
        
//         if (response?.success && response.data) {
//           // Update with real data from API
//           setOrderData((prev) => ({
//             ...prev,
//             planPrice: response.data.plan?.price || prev.planPrice,
//             transactionId: response.data.transactionId || prev.transactionId,
//             invoicePdf: response.data.invoicePdf || null,
//             businessId: response.data.businessId,
//             userId: response.data.userId,
//             subscriptionId: response.data.subscriptionId,
//           }));
          
//           // Mark as success
//           setStatus("success");
          
//           // Store success data in session for dashboard
//           sessionStorage.setItem("lastTransaction", JSON.stringify({
//             transactionId: response.data.transactionId,
//             amount: response.data.plan?.price || sessionData.planPrice,
//             date: formatDate(now)
//           }));
          
//         } else {
//           // Handle API failure
//           const errorMessage = response?.message || "Account creation failed. Please try again.";
//           setSetupError(errorMessage);
//           setStatus("error");
          
//           // Log error for debugging
//           console.error("Business creation failed:", response);
//         }
        
//       } catch (error) {
//         // Handle network/unexpected errors
//         console.error("Business creation error:", error);
        
//         const errorMessage = error.message || "Network error occurred. Your payment is safe, but setup is pending.";
//         setSetupError(errorMessage);
//         setStatus("error");
        
//         // Log to error tracking service (if available)
//         if (window.errorTracker) {
//           window.errorTracker.logError(error, {
//             context: "payment_success",
//             transactionId: orderData.transactionId,
//             email: orderData.email
//           });
//         }
//       }
//     };

//     handleBusinessCreation();
//   }, []); // Empty dependency array - runs once on mount

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       // Cleanup if needed
//       if (status === "processing") {
//         console.log("Component unmounting during processing");
//       }
//     };
//   }, [status]);

//   return (
//     <PaymentStatusView
//       status={status}
//       orderData={orderData}
//       currentStep={currentStep}
//       setupError={setupError}
//       handleGoToDashboard={handleGoToDashboard}
//       handleReturnToPricing={handleReturnToPricing}
//       handlePrintReceipt={handlePrintReceipt}
//       formatPrice={formatPrice}
//     />
//   );
// }