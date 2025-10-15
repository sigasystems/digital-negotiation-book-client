import { useEffect, useState } from "react";
import { CheckCircle, Mail, FileText, Building2, ArrowRight, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { becomeBusinessOwner } from "../services/paymentService";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("processing");
  const [currentStep, setCurrentStep] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  // ✅ Call once when component mounts
  useEffect(() => {
     // ✅ Step-by-step animation sequence
  const simulateProgress = async () => {
    const steps = [1, 2, 3];
    for (const step of steps) {
      setCurrentStep(step);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  };
  // ✅ Function moved outside of useEffect
  const handleBusinessCreation = async () => {
    try {
      const pendingData = JSON.parse(sessionStorage.getItem("pendingBusinessData"));
      if (!pendingData) {
        toast.error("No pending business data found.");
        setStatus("error");
        return;
      }

      const alreadyProcessed = sessionStorage.getItem("businessProcessed");
      if (alreadyProcessed) {
        toast("Business registration already completed.");
        console.log("Buesiness registration already completed.....")
        setStatus("success");
        return;
      }
      await simulateProgress();
      const response = await becomeBusinessOwner(pendingData);
      if (response?.success) {
        sessionStorage.removeItem("pendingBusinessData");
        sessionStorage.setItem("businessProcessed", "true");
        toast.success("Business registration complete d successfully!");
        console.log("Business registration completed successfully!!")
        setStatus("success");
      } else {
        toast.error(response?.message || "Failed to register business.");
        setStatus("error");
      }
    } catch (err) {
      console.error("Error during business creation:", err);
      toast.error(err.message || "Something went wrong");
      setStatus("error");
    }
  };
    handleBusinessCreation();
  }, []);

  const handleGoToDashboard = () => {
    window.location.href = "/";
  };

  const handleReturnToPricing = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* ===== Status Icon ===== */}
          <div className="flex justify-center mb-6">
            {status === "processing" && (
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
            )}
            {status === "success" && (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            )}
          </div>

          {/* ===== Processing State ===== */}
          {status === "processing" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
                Processing Your Registration
              </h1>
              <p className="text-gray-600 text-center mb-8">
                We're setting up your business account. This will only take a moment...
              </p>

              {/* Progress Steps */}
              <div className="space-y-4 mb-8">
                {/* Step 1 */}
                <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  currentStep >= 1 ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? "bg-blue-600" : "bg-gray-300"
                  }`}>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className={`font-semibold ${currentStep >= 1 ? "text-gray-900" : "text-gray-500"}`}>
                      Verifying Payment
                    </p>
                    <p className="text-sm text-gray-600">Confirming transaction details</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  currentStep >= 2 ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
                  }`}>
                    <Building2 className={`w-4 h-4 ${currentStep >= 2 ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div>
                    <p className={`font-semibold ${currentStep >= 2 ? "text-gray-900" : "text-gray-500"}`}>
                      Creating Business Profile
                    </p>
                    <p className="text-sm text-gray-600">Setting up your account</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  currentStep >= 3 ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"
                  }`}>
                    <Mail className={`w-4 h-4 ${currentStep >= 3 ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div>
                    <p className={`font-semibold ${currentStep >= 3 ? "text-gray-900" : "text-gray-500"}`}>
                      Sending Confirmation
                    </p>
                    <p className="text-sm text-gray-600">Email with details on the way</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 text-center">
                  <strong>Please don't close this page</strong> — We're finalizing your registration
                </p>
              </div>
            </>
          )}

          {/* ===== Success State ===== */}
          {status === "success" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
                Registration Complete!
              </h1>
              <p className="text-gray-600 text-center mb-8">
                Your business account has been successfully created
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Payment Confirmed</p>
                    <p className="text-sm text-gray-600">Your subscription is now active</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Building2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Business Profile Created</p>
                    <p className="text-sm text-gray-600">You can now access all premium features</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Confirmation Email Sent</p>
                    <p className="text-sm text-gray-600">
                      We've sent details to <strong className="text-gray-900">{userEmail}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Documentation Ready</p>
                    <p className="text-sm text-gray-600">Access guides in your dashboard</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 text-center mb-4">
                <p className="font-semibold mb-1">Welcome aboard! 🎉</p>
                <p className="text-sm text-blue-100">Get ready to explore your new features</p>
              </div>

              <button
                onClick={handleGoToDashboard}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* ===== Error State ===== */}
          {status === "error" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
                Something Went Wrong
              </h1>
              <p className="text-gray-600 text-center mb-8">
                We encountered an issue processing your registration
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-800 text-center mb-2 font-medium">
                  Don't worry — your payment was successful
                </p>
                <p className="text-sm text-red-700 text-center">
                  Our team will manually complete your registration and email you at{" "}
                  <strong className="text-red-900">{userEmail || "your registered email"}</strong> within 24 hours.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800 text-center">
                  <strong>Reference ID:</strong>{" "}
                  {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
                <p className="text-xs text-yellow-700 text-center mt-1">
                  Please save this ID for your records
                </p>
              </div>

              <button
                onClick={handleReturnToPricing}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Return to Pricing
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Need help? Contact{" "}
            <a href="mailto:support@yourbusiness.com" className="text-blue-600 hover:underline font-medium">
              support@yourbusiness.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
































// import { useEffect, useState } from "react";
// import { CheckCircle, Mail, FileText, Building2, ArrowRight, XCircle, Shield, Download, Calendar, CreditCard, Loader2 } from "lucide-react";
// import { Navigate, useNavigate } from "react-router-dom";
// const formatDate = (date) => {
//   return date.toLocaleDateString('en-US', { 
//     month: 'long', 
//     day: 'numeric', 
//     year: 'numeric' 
//   });
// };
// const formatTime = (date) => {
//   return date.toLocaleTimeString('en-US', { 
//     hour: '2-digit', 
//     minute: '2-digit',
//     hour12: true
//   });
// };
// const becomeBusinessOwner = async (payload) => {
//   // Simulate API call delay
//   await new Promise(resolve => setTimeout(resolve, 2000));
  
//   // To test the success state, ensure the line below is commented out:
//   // return { success: false, message: "Server timeout during profile creation." };
  
//   return { success: true };
// };
// const getInitialOrderData = () => {
//   try {
//     const rawData = sessionStorage.getItem("pendingBusinessData");
//     return rawData ? JSON.parse(rawData) : {};
//   } catch (error) {
//     console.error("Failed to parse session storage data:", error);
//     return {};
//   }
// };
// const PaymentSuccess = () => {
//   // status: "processing", "success", or "error"
//   const [status, setStatus] = useState("processing"); 
//     const [orderData, setOrderData] = useState(getInitialOrderData());
//   const navigate = useNavigate();
//   // currentStep: 0=init, 1=payment, 2=provisioning, 3=notification
//   const [currentStep, setCurrentStep] = useState(0); 

//   useEffect(() => {
//     const handleBusinessCreation = async () => {
//       const rawData = sessionStorage.getItem("pendingBusinessData");

//       if (!rawData) {
//         console.error("CRITICAL: No pending business data found in session.");
//         setStatus("error");
//         return;
//       }

//       const sessionData = getInitialOrderData();
      
//       // Calculate derived/time-sensitive fields
//       const now = new Date();
//       const nextMonth = new Date(now);
//       nextMonth.setMonth(nextMonth.getMonth() + 1);

//       // Create the final, enriched data object
//       const finalOrderData = {
//         ...sessionData,
//         nextBilling: formatDate(nextMonth),
//         time: formatTime(now), // Use current time for order time
//       };

//       try {
//         // Step 1: Update the state with the complete, enriched data payload
//         setOrderData(finalOrderData); 

//         // Animate through processing steps for better UX
//         setCurrentStep(1); 
//         await new Promise(resolve => setTimeout(resolve, 800));
//         setCurrentStep(2);
//         await new Promise(resolve => setTimeout(resolve, 800));
//         setCurrentStep(3);

//         // Step 2: Finalize account creation on the backend
//         const res = await becomeBusinessOwner(finalOrderData);
        
//         if (res.success) {
//           setStatus("success");
//         } else {
//           // If mock API returns failure
//           setStatus("error");
//           console.error("Business registration failed:", res.message || "Unknown API Error");
//         }
//       } catch (err) {
//         console.error("Critical Error during setup:", err);
//         setStatus("error");
//       }
//     };

//     handleBusinessCreation();
//   }, []); // Run once on component mount

//   // Handler functions (kept concise, logging navigation actions)
//   const handleGoToDashboard = () => {
//     // In a real application, this would use a router or window.location.assign
//     navigate("/dashboard");
//     console.log("Navigating to dashboard...");
//     // Clear session storage upon successful completion
//     sessionStorage.removeItem("pendingBusinessData");
//   };

//   const handleReturnToPricing = () => {
//     navigate("/")
//     console.log("Navigating to home/pricing page...");
//     // Optionally clear session storage
//     sessionStorage.removeItem("pendingBusinessData");
//   };

//   const handleDownloadReceipt = () => {
//     console.log(`Downloading receipt for business: ${orderData.businessName}`);
//   };

//   // --- Utility Component for Reusable Data Row ---
//   const DataRow = ({ icon: Icon, label, value, valueClass = 'text-gray-900', border = true }) => (
//     <div className={`flex justify-between items-center ${border ? 'border-b pb-3 border-gray-100' : ''}`}>
//       <span className="flex items-center gap-2 text-gray-600 text-sm">
//         <Icon className="w-4 h-4" /> 
//         {label}
//       </span>
//       <span className={`font-semibold ${valueClass} text-sm`}>{value}</span>
//     </div>
//   );


//   // --- MAIN RENDER LOGIC ---

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans antialiased">
//       {/* Load Tailwind CSS */}
//       <script src="https://cdn.tailwindcss.com"></script>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
//         .font-sans {
//           font-family: 'Inter', sans-serif;
//         }
//         .animate-spin-slow {
//           animation: spin 3s linear infinite;
//         }
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>

//       {/* Processing State */}
//       {status === "processing" && (
//         <div className="grid lg:grid-cols-2 min-h-screen">
//           {/* Left Side - Status Tracker */}
//           <div className="flex flex-col justify-center items-center p-8 sm:p-12 bg-white">
//             <div className="w-full max-w-lg">
//               <div className="relative w-24 h-24 mx-auto mb-8">
//                 <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
//                 <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin-slow"></div>
//               </div>
              
//               <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-4">
//                 Finalizing Your Profile
//               </h1>
//               <p className="text-gray-600 text-center text-md sm:text-lg mb-12">
//                 We're setting up your **{orderData.businessName || 'Business Instance'}** with the details secured during checkout.
//               </p>

//               <div className="space-y-6">
                
//                 {/* Step 1: Payment Verification */}
//                 <div className={`flex items-center gap-4 transition-opacity duration-500 ${
//                   currentStep >= 1 ? 'opacity-100' : 'opacity-30'
//                 } p-4 rounded-xl shadow-sm border border-gray-100`}>
//                   <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
//                     currentStep === 1 ? 'bg-indigo-600' : currentStep > 1 ? 'bg-green-600' : 'bg-gray-200'
//                   }`}>
//                     {currentStep === 1 ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : currentStep > 1 ? <CheckCircle className="w-6 h-6 text-white" /> : <Shield className="w-6 h-6 text-gray-400" />}
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-900">Payment Verified</p>
//                     <p className="text-sm text-gray-500">Securing **${orderData.total || '0.00'}** for **{orderData.plan || 'Standard'}** plan.</p>
//                   </div>
//                 </div>

//                 {/* Step 2: Resource Provisioning */}
//                 <div className={`flex items-center gap-4 transition-opacity duration-500 ${
//                   currentStep >= 2 ? 'opacity-100' : 'opacity-30'
//                 } p-4 rounded-xl shadow-sm border border-gray-100`}>
//                   <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
//                     currentStep === 2 ? 'bg-indigo-600' : currentStep > 2 ? 'bg-green-600' : 'bg-gray-200'
//                   }`}>
//                     {currentStep === 2 ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : currentStep > 2 ? <CheckCircle className="w-6 h-6 text-white" /> : <Building2 className="w-6 h-6 text-gray-400" />}
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-900">Provisioning Resources</p>
//                     <p className="text-sm text-gray-500">Creating your dedicated **{orderData.businessName || 'new'}** instance on the server.</p>
//                   </div>
//                 </div>

//                 {/* Step 3: Confirmation and Notification */}
//                 <div className={`flex items-center gap-4 transition-opacity duration-500 ${
//                   currentStep >= 3 ? 'opacity-100' : 'opacity-30'
//                 } p-4 rounded-xl shadow-sm border border-gray-100`}>
//                   <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
//                     currentStep === 3 ? 'bg-indigo-600' : currentStep > 3 ? 'bg-green-600' : 'bg-gray-200'
//                   }`}>
//                     {currentStep === 3 ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : currentStep > 3 ? <CheckCircle className="w-6 h-6 text-white" /> : <Mail className="w-6 h-6 text-gray-400" />}
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-900">Finalizing and Notifying</p>
//                     <p className="text-sm text-gray-500">Preparing confirmation email for **{orderData.email || 'your account'}**.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Session Data Preview */}
//           <div className="flex flex-col justify-center p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50">
//             <div className="w-full max-w-lg mx-auto">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
//               <p className="text-gray-600 mb-8">This data was secured post-payment and is being used to finalize your account.</p>
              
//               <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl">
                
//                 {/* Session Data Fields */}
//                 <div className="space-y-4">
//                   <DataRow icon={Building2} label="Business Name" value={orderData.businessName || 'N/A'} />
//                   <DataRow icon={Mail} label="Account Email" value={orderData.email || 'N/A'} valueClass="truncate max-w-[200px] sm:max-w-none" />
//                   <DataRow icon={FileText} label="Selected Plan" value={orderData.plan || 'N/A'} valueClass="text-indigo-600" />
//                   <DataRow icon={CreditCard} label="Card Used (Last 4)" value={`•••• ${orderData.cardLast4 || 'N/A'}`} border={false} />
//                 </div>

//                 <div className="mt-6 pt-6 border-t border-gray-200">
//                   <div className="flex justify-between font-bold text-lg">
//                     <span className="text-gray-700">Total Charged</span>
//                     <span className="text-green-600">${orderData.total || '0.00'}</span>
//                   </div>
//                 </div>
//               </div>
//               <p className="mt-6 text-sm text-gray-500 text-center">
//                 **Please do not close this window.** Automatic redirection upon completion.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success State */}
//       {status === "success" && (
//         <div className="grid lg:grid-cols-2 min-h-screen">
//           {/* Left Side - Success Message */}
//           <div className="flex flex-col justify-center items-center p-8 sm:p-12 bg-white">
//             <div className="w-full max-w-lg">
              
              
//               <CheckCircle className="w-16 h-16 text-green-500 mb-6 mx-auto" />
//                             <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
//                                 Success!
//                             </h1>
                           
//                             <p className="text-gray-600 text-center text-lg mb-12">
//                 Welcome, **{orderData.businessName || 'New User'}**. Your **{orderData.plan || 'Standard'}** account is now fully active.
//               </p>
                            
//                             {/* Transaction Details Card */}
//                             <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg shadow-md mb-8">
//                                 <div className="flex items-center">
//                                     <div className="flex-shrink-0">
//                                         <FileText className="h-5 w-5 text-indigo-500" />
//                                     </div>
//                                     <div className="ml-3">
//                                         <p className="text-sm font-medium text-indigo-800">
//                                             Transaction ID: <span className="font-mono text-xs bg-indigo-200 p-1 rounded">{orderData.transactionId}</span>
//                                         </p>
//                                         <p className="text-xs text-indigo-700 mt-1">
//                                             Charged to your {orderData.cardType} ending in {orderData.cardLast4}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
              

//               <div className="space-y-4 mb-12">
//                 <div className="border border-green-200 bg-white rounded-xl p-5 shadow-sm">
//                   <div className="flex items-center gap-3 mb-3">
//                     <CheckCircle className="w-5 h-5 text-green-600" />
//                     <p className="font-medium text-gray-900">Confirmation Sent</p>
//                   </div>
//                   <p className="text-sm text-gray-600 pl-8">Invoice and initial login credentials have been delivered to **{orderData.email || 'your email'}**.</p>
//                 </div>
//               </div>

//               <button
//                 onClick={handleGoToDashboard}
//                 className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition duration-200"
//               >
//                 Launch Dashboard
//                 <ArrowRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Right Side - Order Summary */}
//           <div className="flex flex-col justify-center p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50">
//             <div className="w-full max-w-lg mx-auto">
//               <h2 className="text-2xl font-bold text-gray-900 mb-8">Detailed Order Summary</h2>
              
//               <div className="border border-gray-200 rounded-xl overflow-hidden mb-8 shadow-2xl">
//                 <div className="bg-gray-900 px-6 py-4 border-b border-gray-700 text-white">
//                   <p className="text-sm font-medium text-gray-300">Initial Charge ({orderData.time || 'N/A'})</p>
//                   <p className="text-3xl font-extrabold mt-1">${orderData.total || '0.00'}</p>
//                 </div>

//                 <div className="p-6 space-y-4 bg-white">
//                   <div className="flex justify-between text-base">
//                     <span className="text-gray-600">Plan Subscription ({orderData.plan || 'N/A'})</span>
//                     <span className="text-gray-900 font-medium">${orderData.subtotal || '0.00'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Taxes & Fees</span>
//                     <span className="text-gray-900 font-medium">${orderData.tax || '0.00'}</span>
//                   </div>
//                   <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between">
//                     <span className="font-bold text-gray-900 text-xl">Total Paid</span>
//                     <span className="text-2xl font-extrabold text-green-600">${orderData.total || '0.00'}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <div className="flex items-start gap-3 text-sm">
//                   <CreditCard className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="text-gray-900 font-medium">Payment Method</p>
//                     <p className="text-gray-600">Card ending in •••• **{orderData.cardLast4 || 'N/A'}**</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3 text-sm">
//                   <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="text-gray-900 font-medium">Next Billing Date</p>
//                     <p className="text-gray-600">Scheduled for **{orderData.nextBilling || 'N/A'}**</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3 text-sm">
//                   <FileText className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="text-gray-900 font-medium">Download Documentation</p>
//                     <button 
//                       onClick={handleDownloadReceipt}
//                       className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-1 border border-indigo-300 bg-indigo-50 rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition-colors shadow-sm"
//                     >
//                       Download Receipt PDF
//                       <Download className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Error State */}
//       {status === "error" && (
//         <div className="grid lg:grid-cols-2 min-h-screen">
//           {/* Left Side - Error Message */}
//           <div className="flex flex-col justify-center items-center p-8 sm:p-12 bg-white">
//             <div className="w-full max-w-lg">
//               <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-in fade-in zoom-in duration-500">
//                 <XCircle className="w-14 h-14 text-white" strokeWidth={2} />
//               </div>
              
//               <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-4">
//                 Setup Interrupted
//               </h1>
//               <p className="text-gray-600 text-center text-lg mb-12">
//                 We encountered an issue during the final automation of your **{orderData.businessName || 'new'}** registration.
//               </p>

//               <div className="bg-white border border-red-300 rounded-xl p-6 mb-8 shadow-xl">
//                 <div className="flex items-start gap-4 mb-4">
//                   <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-bold text-gray-900 mb-2">Your Payment is Secure: ${orderData.total || '0.00'}</p>
//                     <p className="text-sm text-gray-700">
//                       **Our support team has been notified** and is manually reviewing your session data to complete the setup. You will receive full account access via **{orderData.email || 'email'}** within 24 hours.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-100 rounded-xl p-6 mb-8 shadow-sm">
//                 <p className="text-sm font-medium text-gray-700 mb-2 text-center">Reference Account Details</p>
//                 <div className="space-y-2 text-center">
//                     <p className="text-lg font-bold text-gray-900">{orderData.businessName || 'N/A'}</p>
//                     <p className="text-sm text-gray-500 font-medium">{orderData.email || 'N/A'}</p>
//                 </div>
//                 <p className="text-xs text-gray-500 text-center mt-3">
//                   Please mention these details if you contact support for faster resolution.
//                 </p>
//               </div>

//               <button
//                 onClick={handleReturnToPricing}
//                 className="w-full bg-red-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
//               >
//                 Return to Home Page
//               </button>
//             </div>
//           </div>

//           {/* Right Side - Immediate Next Steps */}
//           <div className="flex flex-col justify-center p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50">
//             <div className="w-full max-w-lg mx-auto">
//               <h2 className="text-2xl font-bold text-gray-900 mb-8">Immediate Next Steps</h2>
              
//               <div className="space-y-6">
//                 <div className="flex gap-4">
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-sm font-bold text-white">1</div>
//                   <div>
//                     <p className="font-medium text-gray-900 mb-1">Check Email for Status Updates</p>
//                     <p className="text-sm text-gray-600">We are actively working on your account, and updates will be sent to **{orderData.email || 'your email'}**.</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-sm font-bold text-white">2</div>
//                   <div>
//                     <p className="font-medium text-gray-900 mb-1">Reach out to Priority Support</p>
//                     <p className="text-sm text-gray-600">
//                       Email us at <a href="mailto:support@business.com" className="text-indigo-600 hover:underline font-medium">support@business.com</a> with your business name if you have questions.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-sm font-bold text-white">3</div>
//                   <div>
//                     <p className="font-medium text-gray-900 mb-1">Don't Attempt Re-purchase</p>
//                     <p className="text-sm text-gray-600">Since your payment was successful, please wait for manual confirmation to avoid duplicate charges.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentSuccess;
