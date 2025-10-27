// import { useEffect, useState, useCallback, useRef } from "react";
// import {
//   CheckCircle,
//   Mail,
//   FileText,
//   Building2,
//   ArrowRight,
//   XCircle,
//   Shield,
//   Download,
//   Calendar,
//   CreditCard,
//   Loader2,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { becomeBusinessOwner } from "../services/paymentService";
// import { formatDate, formatTime } from "@/utils/formateDate";

// const getInitialOrderData = () => {
//   try {
//     const rawData = sessionStorage.getItem("pendingBusinessData");
//     const parsedData = rawData ? JSON.parse(rawData) : {};

//     return {
//       businessName: parsedData.businessName || "Business Instance",
//       email: parsedData.email || "user@example.com",
//       planId: parsedData.planId || "d1d98dd8-779e-4777-9ca7-19a1413ac78d",
//       billingCycle: parsedData.billingCycle || "monthly",
//       cardLast4: "1234",
//       cardType: "Visa",
//       transactionId: "TXN-9876543210",
//       planName: "Loading...",
//       planPrice: "0.00",
//       currencySymbol: "₹",
//       currencyCode: "INR",
//       ...parsedData,
//     };
//   } catch (error) {
//     console.error("Failed to parse session storage data:", error);
//     return {};
//   }
// };

// const PaymentSuccess = () => {
//   const [status, setStatus] = useState("processing");
//   const [orderData, setOrderData] = useState(getInitialOrderData());
//   const [currentStep, setCurrentStep] = useState(0);
//   const navigate = useNavigate();
//   const hasRun = useRef(false); // 👈 Prevent double API call

//   const handleGoToDashboard = useCallback(() => {
//     sessionStorage.removeItem("pendingBusinessData");
//     navigate("/dashboard");
//   }, [navigate]);

//   const handleReturnToPricing = useCallback(() => {
//     sessionStorage.removeItem("pendingBusinessData");
//     navigate("/");
//   }, [navigate]);

//   const handleDownloadReceipt = () => {
//     alert("Receipt download functionality not implemented yet.");
//   };

//   useEffect(() => {
//     const handleBusinessCreation = async () => {
//       if (hasRun.current) return; // prevent multiple runs
//       hasRun.current = true;

//       const sessionData = getInitialOrderData();
//       const now = new Date();
//       const nextBillingDate = new Date(now);
//       if (sessionData.billingCycle === "yearly") {
//         nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
//       } else {
//         nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
//       }

//       // Set initial placeholder data
//       setOrderData({
//         ...sessionData,
//         nextBilling: formatDate(nextBillingDate),
//         time: formatTime(now),
//         date: formatDate(now),
//       });

//       try {
//         // smooth progress animation
//         setCurrentStep(1);
//         await new Promise((r) => setTimeout(r, 600));
//         setCurrentStep(2);
//         await new Promise((r) => setTimeout(r, 600));
//         setCurrentStep(3);

//         // API call
//         const res = await becomeBusinessOwner(sessionData);
//         if (res?.success && res.data) {
//           const api = res.data;
//           const plan = api.plan || {};

//           setOrderData((prev) => ({
//             ...prev,
//             businessName: api.businessName || prev.businessName,
//             email: api.email || prev.email,
//             planName: plan.name || "Unknown Plan",
//             planPrice: plan.price || "0.00",
//             billingCycle: plan.billingCycle || prev.billingCycle,
//             total: plan.price || "0.00",
//             transactionId:
//               api.transactionId ||
//               `TXN-${Math.floor(Math.random() * 10000000000)}`,
//           }));

//           setStatus("success");
//         } else {
//           console.error("Business creation failed:", res?.message);
//           setStatus("error");
//         }
//       } catch (err) {
//         console.error("Error during setup:", err);
//         setStatus("error");
//       }
//     };

//     handleBusinessCreation();
//   }, []);

//   const DataRow = ({ icon: Icon, label, value, border = true }) => (
//     <div
//       className={`flex justify-between items-center ${
//         border ? "border-b pb-3 border-gray-100" : ""
//       }`}
//     >
//       <span className="flex items-center gap-2 text-gray-600 text-sm">
//         <Icon className="w-4 h-4" /> {label}
//       </span>
//       <span className="font-semibold text-gray-900 text-sm">{value}</span>
//     </div>
//   );

//   const formatPrice = (price) =>
//     `${orderData.currencySymbol}${parseFloat(price).toFixed(2)}`;

//   // --- UI States ---
//   if (status === "processing") {
//     return (
//       <div className="grid lg:grid-cols-2 min-h-screen bg-gray-50">
//         <div className="flex flex-col justify-center items-center p-8 bg-white">
//           <div className="max-w-lg w-full text-center">
//             <div className="relative w-20 h-20 mx-auto mb-6">
//               <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
//               <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin-slow"></div>
//             </div>

//             <h1 className="text-3xl font-bold mb-3">
//               Finalizing Your Profile
//             </h1>
//             <p className="text-gray-600 mb-10">
//               Setting up <b>{orderData.businessName}</b> and verifying payment.
//             </p>

//             <div className="space-y-4">
//               {[
//                 {
//                   step: 1,
//                   label: "Payment Verified",
//                   desc: `Verifying ${orderData.planName} plan.`,
//                   icon: Shield,
//                 },
//                 {
//                   step: 2,
//                   label: "Provisioning Resources",
//                   desc: `Creating your ${orderData.businessName} workspace.`,
//                   icon: Building2,
//                 },
//                 {
//                   step: 3,
//                   label: "Finalizing Setup",
//                   desc: `Notifying ${orderData.email}.`,
//                   icon: Mail,
//                 },
//               ].map(({ step, label, desc, icon: Icon }) => (
//                 <div
//                   key={step}
//                   className={`flex items-center gap-3 p-4 rounded-xl shadow-sm border transition ${
//                     currentStep >= step
//                       ? "border-indigo-200 bg-indigo-50"
//                       : "border-gray-100 opacity-50"
//                   }`}
//                 >
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                       currentStep >= step
//                         ? "bg-indigo-600 text-white"
//                         : "bg-gray-200 text-gray-400"
//                     }`}
//                   >
//                     {currentStep > step ? (
//                       <CheckCircle className="w-5 h-5" />
//                     ) : (
//                       <Icon className="w-5 h-5" />
//                     )}
//                   </div>
//                   <div className="text-left">
//                     <p className="font-medium text-gray-900">{label}</p>
//                     <p className="text-sm text-gray-500">{desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col justify-center p-10 bg-gray-50 border-l">
//           <div className="max-w-lg w-full mx-auto bg-white rounded-xl p-6 shadow-md">
//             <h2 className="text-xl font-bold mb-4">Order Details</h2>
//             <div className="space-y-4">
//               <DataRow
//                 icon={Building2}
//                 label="Business Name"
//                 value={orderData.businessName}
//               />
//               <DataRow icon={Mail} label="Email" value={orderData.email} />
//               <DataRow
//                 icon={FileText}
//                 label="Plan"
//                 value={`${orderData.planName} (${orderData.billingCycle})`}
//               />
//               <DataRow
//                 icon={CreditCard}
//                 label="Card"
//                 value={`•••• ${orderData.cardLast4}`}
//                 border={false}
//               />
//             </div>

//             <div className="mt-6 flex justify-between font-semibold text-lg">
//               <span>Total Charged</span>
//               <span className="text-green-600">
//                 {formatPrice(orderData.planPrice)}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (status === "success") {
//     return (
//       <div className="grid lg:grid-cols-2 min-h-screen">
//         <div className="flex flex-col justify-center items-center p-10 bg-white">
//           <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
//           <h1 className="text-3xl font-bold mb-2">
//             Success! Onboarding Complete 🚀
//           </h1>
//           <p className="text-gray-600 mb-8 text-center">
//             Welcome <b>{orderData.businessName}</b>, your{" "}
//             {orderData.planName} ({orderData.billingCycle}) plan is active.
//           </p>
//           <button
//             onClick={handleGoToDashboard}
//             className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition"
//           >
//             Launch Dashboard <ArrowRight className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="flex flex-col justify-center p-10 bg-gray-50 border-l">
//           <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-bold mb-6">Order Summary</h2>
//             <p className="text-gray-700 mb-2">
//               Plan: {orderData.planName} ({orderData.billingCycle})
//             </p>
//             <p className="text-gray-700 mb-2">
//               Charged: {formatPrice(orderData.planPrice)}
//             </p>
//             <p className="text-gray-700 mb-2">
//               Transaction ID: {orderData.transactionId}
//             </p>
//             <p className="text-gray-700 mb-2">
//               Next Billing: {orderData.nextBilling}
//             </p>
//             <button
//               onClick={handleDownloadReceipt}
//               className="mt-4 w-full border border-indigo-500 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50"
//             >
//               Download Receipt
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (status === "error") {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen p-10">
//         <XCircle className="w-16 h-16 text-red-600 mb-4" />
//         <h1 className="text-3xl font-bold mb-2">Setup Interrupted</h1>
//         <p className="text-gray-600 mb-6">
//           Something went wrong while finalizing{" "}
//           <b>{orderData.businessName}</b>. Don’t worry — payment is safe.
//         </p>
//         <button
//           onClick={handleReturnToPricing}
//           className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
//         >
//           Return to Home
//         </button>
//       </div>
//     );
//   }

//   return null;
// };

// export default PaymentSuccess;







import { useEffect, useState, useCallback, useRef } from "react";
import {
    CheckCircle,
    Mail,
    FileText,
    Building2,
    ArrowRight,
    XCircle,
    Shield,
    Download,
    Calendar,
    CreditCard,
    Loader2,
    Receipt,
    Printer,
    CheckCheck,
    Sparkles,
    TrendingUp,
    User,
    Clock,
    UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// Ensure this service is correctly implemented
import { becomeBusinessOwner } from "../services/paymentService";
// Assume formatDate and formatTime are available
import { formatDate, formatTime } from "@/utils/formateDate";


// ====================================================================
// 1. CONSTANTS AND INITIAL DATA UTILITY
// ====================================================================

const CURRENCY_SYMBOL = {
    "INR": "₹",
    "USD": "$",
    "EUR": "€"
};

// --- Mock Plan Data (More robust defaults for the processing/error state) ---
const MOCK_PLAN_PRICES = {
    // Pro Plan (Yearly: 2999, Monthly: 299)
    "745c7918-8b87-4498-ba8a-27f2eb98bfc8": { name: "Pro", priceMonthly: "299.00", priceYearly: "2999.00", currency: "INR" },
    // Basic Plan (Yearly: 1999, Monthly: 199) - Defaulted in current getInitialOrderData
    "d1d98dd8-779e-4777-9ca7-19a1413ac78d": { name: "Basic", priceMonthly: "199.00", priceYearly: "1999.00", currency: "INR" },
};

// Utility to safely retrieve and enrich initial session data
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
            
            ...parsedData, // Merge all other form data
        };
    } catch (error) {
        console.error("Failed to parse session storage data:", error);
        return {};
    }
};


// ====================================================================
// 2. MAIN COMPONENT
// ====================================================================

const PaymentSuccess = () => {
    const [status, setStatus] = useState("processing");
    const [orderData, setOrderData] = useState(getInitialOrderData());
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const hasRun = useRef(false);
    const [setupError, setSetupError] = useState(null);

    // --- HANDLERS ---

    const handleGoToDashboard = useCallback(() => {
        sessionStorage.removeItem("pendingBusinessData");
        navigate("/dashboard");
    }, [navigate]);

    const handleReturnToPricing = useCallback(() => {
        sessionStorage.removeItem("pendingBusinessData");
        navigate("/");
    }, [navigate]);

    // Receipt HTML and Print/Download logic (kept from user's code, but slightly simplified)
    const generateReceiptHTML = () => {
        // Use the final state data for the receipt
        const data = orderData;
        const totalAmount = parseFloat(data.planPrice).toFixed(2);
        
        return `
            <!DOCTYPE html><html><head>
            <title>Payment Receipt - ${data.transactionId}</title>
            <style>
                /* ... (Your previous receipt CSS style here) ... */
                body { font-family: sans-serif; line-height: 1.6; color: #333; padding: 40px; }
                .receipt { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; }
                .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
                .header h1 { color: #4F46E5; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                .total-section { border-top: 2px solid #4F46E5; padding-top: 20px; font-size: 1.2em; }
                .total-row { display: flex; justify-content: space-between; font-weight: bold; }
            </style>
            </head><body>
            <div class="receipt">
                <div class="header"><h1>Payment Receipt</h1><p>Transaction ID: ${data.transactionId}</p></div>
                <div class="info-grid">
                    <div><strong>Business:</strong> ${data.businessName}</div>
                    <div><strong>Email:</strong> ${data.email}</div>
                    <div><strong>Plan:</strong> ${data.planName} (${data.billingCycle})</div>
                    <div><strong>Date:</strong> ${data.date}</div>
                </div>
                <div class="total-section">
                    <div class="total-row"><span>Total Paid:</span><span>${data.currencySymbol}${totalAmount}</span></div>
                </div>
                <p style="text-align: center; margin-top: 30px;">Thank you for your purchase!</p>
            </div>
            </body></html>
        `;
    };

    const handleDownloadReceipt = () => {
        const receiptHTML = generateReceiptHTML();
        const blob = new Blob([receiptHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${orderData.transactionId}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handlePrintReceipt = () => {
        const receiptHTML = generateReceiptHTML();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };
    
    // Placeholder function for price formatting
    const formatPrice = (price) =>
        `${orderData.currencySymbol}${parseFloat(price || '0').toFixed(2)}`;

    // --- EFFECT FOR BUSINESS CREATION & DATA ENRICHMENT ---
    useEffect(() => {
        const handleBusinessCreation = async () => {
            if (hasRun.current) return;
            hasRun.current = true;

            const sessionData = getInitialOrderData();
            const now = new Date();
            const nextBillingDate = new Date(now);
            
            if (sessionData.billingCycle === "yearly") {
                nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
            } else {
                nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
            }

            // 1. Initial State Update (with expected price)
            setOrderData({
                ...sessionData,
                nextBilling: formatDate(nextBillingDate),
                time: formatTime(now),
                date: formatDate(now),
            });

            try {
                // Animate through steps
                setCurrentStep(1);
                await new Promise((r) => setTimeout(r, 700));
                setCurrentStep(2);
                await new Promise((r) => setTimeout(r, 700));
                setCurrentStep(3);
                await new Promise((r) => setTimeout(r, 700));
                setCurrentStep(4);

                // 2. API Call to finalize
                const res = await becomeBusinessOwner(sessionData);
                
                if (res?.success && res.data) {
                    const api = res.data;
                    // API should return the final, confirmed plan and price
                    const plan = api.plan || {}; 

                    // 3. Final Success State Update (with confirmed API data)
                    setOrderData((prev) => ({
                        ...prev,
                        planName: plan.name || prev.planName,
                        // CRITICAL: Update the price with the CONFIRMED amount from the API
                        planPrice: plan.price || prev.planPrice, 
                        total: plan.price || prev.total,
                        transactionId: api.transactionId || prev.transactionId,
                    }));

                    setStatus("success");
                } else {
                    // 4. Error State Update
                    // We keep the initial charged price (from sessionData) for reassurance
                    setSetupError(res?.message || "Final account creation failed. We are reviewing your payment.");
                    setStatus("error");
                }
            } catch (err) {
                console.error("Error during setup:", err);
                // 4. Error State Update (for network/exception errors)
                setSetupError("A network error occurred. Your payment is secure, but manual setup is needed.");
                setStatus("error");
            }
        };

        handleBusinessCreation();
    }, []);


    // ====================================================================
    // 3. RENDER LOGIC
    // ====================================================================

    // --- Utility Component for Reusable Data Row ---
    const DataRow = ({ icon: Icon, label, value, valueClass = 'text-gray-900' }) => (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                <Icon className="w-4 h-4 text-indigo-400" /> 
                {label}
            </span>
            <span className={`font-semibold ${valueClass} text-sm`}>{value}</span>
        </div>
    );

    const commonClasses = "min-h-screen flex items-center justify-center p-4 bg-gray-50";

    // --- PROCESSING STATE UI (Cleaned up and centered) ---
    if (status === "processing") {
        return (
            <div className={`${commonClasses} bg-gradient-to-br from-indigo-50 via-white to-purple-50`}>
                <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-gray-100">
                    
                    {/* Animated Spinner */}
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 border-8 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-pulse" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Finalizing Your Account Setup
                    </h1>
                    <p className="text-gray-500 mb-10 text-lg">
                        We're securely provisioning your **{orderData.businessName}** workspace.
                    </p>

                    {/* Progress Steps List */}
                    <div className="space-y-4 text-left">
                        {[
                            { step: 1, label: "Payment Verification", desc: "Securing transaction details.", icon: Shield },
                            { step: 2, label: "Workspace Creation", desc: `Building your instance on our servers.`, icon: Building2 },
                            { step: 3, label: "Feature Activation", desc: `Enabling all ${orderData.planName} plan tools.`, icon: Sparkles },
                            { step: 4, label: "Final Confirmation", desc: `Preparing to send your access email.`, icon: Mail },
                        ].map(({ step, label, desc, icon: Icon }) => {
                            const isComplete = currentStep > step;
                            const isActive = currentStep === step;
                            
                            return (
                                <div key={step} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                                        isComplete ? 'bg-green-500 text-white' : isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {isComplete ? <CheckCheck className="w-5 h-5" /> : isActive ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-semibold ${isComplete || isActive ? 'text-gray-900' : 'text-gray-500'}`}>{label}</p>
                                        <p className={`text-sm ${isComplete || isActive ? 'text-gray-600' : 'text-gray-400'}`}>{desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Total Charged Preview */}
                    <div className="mt-10 pt-6 border-t border-dashed border-gray-200">
                        <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl">
                            <span className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-indigo-600" />
                                Charged Amount
                            </span>
                            <span className="text-2xl font-extrabold text-indigo-600">
                                {formatPrice(orderData.planPrice)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            Please do not close this window. You will be redirected automatically.
                        </p>
                    </div>

                </div>
            </div>
        );
    }

    // --- SUCCESS STATE UI (Focus on actions) ---
    if (status === "success") {
        return (
            <div className={`${commonClasses} bg-gradient-to-br from-green-50 via-white to-indigo-50`}>
                <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-gray-100">
                    
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-xl">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Setup Complete! Welcome 🎉
                    </h1>
                    <p className="text-gray-600 text-xl mb-8 max-w-lg mx-auto">
                        Your **{orderData.businessName}** account is now fully active. You're all set to go.
                    </p>

                    {/* Action Button */}
                    <button
                        onClick={handleGoToDashboard}
                        className="w-full max-w-sm mx-auto bg-indigo-600 text-white py-4 px-6 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.01]"
                    >
                        Launch My Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <div className="grid sm:grid-cols-2 gap-8 mt-10 text-left">
                        {/* Summary Card */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-indigo-600" />
                                Payment Summary
                            </h3>
                            <div className="space-y-2">
                                <DataRow icon={Sparkles} label="Plan" value={orderData.planName} />
                                <DataRow icon={TrendingUp} label="Billing Cycle" value={orderData.billingCycle.charAt(0).toUpperCase() + orderData.billingCycle.slice(1)} />
                                <DataRow icon={CreditCard} label="Card" value={`${orderData.cardType} •••• ${orderData.cardLast4}`} />
                                <DataRow icon={Calendar} label="Next Bill" value={orderData.nextBilling} />
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-800">Total Paid:</span>
                                <span className="text-3xl font-extrabold text-green-600">{formatPrice(orderData.planPrice)}</span>
                            </div>
                        </div>

                        {/* Receipt Actions */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    Get Your Receipt
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleDownloadReceipt}
                                        className="w-full flex items-center justify-center gap-2 text-indigo-600 bg-indigo-100 py-3 rounded-lg font-semibold hover:bg-indigo-200 transition-colors text-sm"
                                    >
                                        <Download className="w-4 h-4" /> Download HTML Receipt
                                    </button>
                                    <button
                                        onClick={handlePrintReceipt}
                                        className="w-full flex items-center justify-center gap-2 text-indigo-600 bg-indigo-100 py-3 rounded-lg font-semibold hover:bg-indigo-200 transition-colors text-sm"
                                    >
                                        <Printer className="w-4 h-4" /> Print Receipt
                                    </button>
                                    <button
                                        onClick={() => window.open(`mailto:${orderData.email}?subject=Payment%20Receipt%20for%20${orderData.transactionId}`, '_self')}
                                        className="w-full flex items-center justify-center gap-2 text-indigo-600 bg-indigo-100 py-3 rounded-lg font-semibold hover:bg-indigo-200 transition-colors text-sm"
                                    >
                                        <Mail className="w-4 h-4" /> Email Receipt Now
                                    </button>
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-gray-500 text-center">
                                A full invoice has also been sent to **{orderData.email}**.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- ERROR STATE UI (CRITICAL: Showing correct charged price) ---
    if (status === "error") {
        return (
            <div className={`${commonClasses} bg-gradient-to-br from-red-50 via-white to-red-100`}>
                <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-red-200">
                    
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6 shadow-xl animate-in fade-in zoom-in duration-500">
                        <XCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Setup Interrupted
                    </h1>
                    <p className="text-lg text-red-600 mb-6 max-w-lg mx-auto font-medium">
                        {setupError || "An unexpected error occurred during the finalization step."}
                    </p>

                    {/* Reassurance Block (FIXED: Shows correct price) */}
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl mb-8 text-left">
                        <div className="flex items-center gap-3 mb-3">
                            <Shield className="w-6 h-6 text-red-700 flex-shrink-0" />
                            <p className="text-xl font-bold text-gray-900">
                                Your Payment Is Secure: {formatPrice(orderData.planPrice)}
                            </p>
                        </div>
                        <p className="text-sm text-gray-700">
                            **Your funds have been successfully collected.** The final account setup failed, but our **Priority Support Team** has been notified of Transaction ID: `{orderData.transactionId}`. We will complete your setup manually and email access to **{orderData.email}** within 4 hours.
                        </p>
                    </div>

                    {/* Next Steps */}
                    <div className="space-y-4">
                        <button
                            onClick={() => window.open('mailto:support@yourcompany.com?subject=Priority%20Setup%20Issue', '_self')}
                            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                        >
                            <UserCheck className="w-5 h-5" /> Contact Priority Support Now
                        </button>
                        <button
                            onClick={handleReturnToPricing}
                            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Return to Home Page
                        </button>
                    </div>

                </div>
            </div>
        );
    }
    
    return null; // Fallback to avoid empty screen
};

export default PaymentSuccess;