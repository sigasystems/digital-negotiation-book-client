import { useEffect, useState } from "react";
import { CheckCircle, Mail, FileText, Building2, ArrowRight, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

// Mock services - replace with your actual imports
const becomeBusinessOwner = async (payload) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { success: true };
};

export default function PaymentSuccess() {
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [userEmail, setUserEmail] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const handleBusinessCreation = async () => {
      // Simulate getting data from sessionStorage
      const pendingData = sessionStorage.getItem("pendingBusinessData");
      
      if (!pendingData) {
        setStatus("error");
        toast("No business data found. Please try again.");
        return;
      }

      try {
        const payload = JSON.parse(pendingData);
        setUserEmail(payload.email || "your@email.com");

        // Animate through steps
        setCurrentStep(1);
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentStep(2);
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentStep(3);

        const res = await becomeBusinessOwner(payload);
        
        if (res.success) {
          setStatus("success");
          toast("Business registration completed successfully!");
        } else {
          setStatus("error");
          toast(res.message || "Failed to create business owner.");
        }
      } catch (err) {
        console.error("Error creating business owner:", err);
        setStatus("error");
        toast(err.message || "Something went wrong.");
      }
    };

    handleBusinessCreation();
  }, []);

  const handleGoToDashboard = () => {
    sessionStorage.removeItem("pendingBusinessData");
    // In real app: navigate("/dashboard");
    window.location.href = "/dashboard";
  };

  const handleReturnToPricing = () => {
    // In real app: navigate("/pricing");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Status Icon */}
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

          {/* Processing State */}
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
                <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    {currentStep >= 1 ? (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    ) : (
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                      Verifying Payment
                    </p>
                    <p className="text-sm text-gray-600">Confirming transaction details</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <Building2 className={`w-4 h-4 ${currentStep >= 2 ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className={`font-semibold ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                      Creating Business Profile
                    </p>
                    <p className="text-sm text-gray-600">Setting up your account</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  currentStep >= 3 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <Mail className={`w-4 h-4 ${currentStep >= 3 ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className={`font-semibold ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>
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

          {/* Success State */}
          {status === "success" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
                Registration Complete!
              </h1>
              <p className="text-gray-600 text-center mb-8">
                Your business account has been successfully created
              </p>

              {/* Success Details */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Payment Confirmed</p>
                    <p className="text-sm text-gray-600">Your subscription is now active</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Building2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Business Profile Created</p>
                    <p className="text-sm text-gray-600">You can now access all premium features</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Confirmation Email Sent</p>
                    <p className="text-sm text-gray-600">
                      We've sent your account details and invoice to <strong className="text-gray-900">{userEmail}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <FileText className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Documentation Ready</p>
                    <p className="text-sm text-gray-600">Access guides and resources in your dashboard</p>
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

          {/* Error State */}
          {status === "error" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
                Something Went Wrong
              </h1>
              <p className="text-gray-600 text-center mb-8">
                We encountered an issue processing your registration
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-800 text-center mb-2">
                  <strong>Don't worry — your payment was successful</strong>
                </p>
                <p className="text-sm text-red-700 text-center">
                  Our team has been notified and will complete your registration manually. 
                  You'll receive an email at <strong className="text-red-900">{userEmail || "your registered email"}</strong> within 24 hours.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800 text-center">
                  <strong>Reference ID:</strong> {Math.random().toString(36).substr(2, 9).toUpperCase()}
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

        {/* Footer Info */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Need help? Contact us at{" "}
            <a href="mailto:support@yourbusiness.com" className="text-blue-600 hover:underline font-medium">
              support@yourbusiness.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}