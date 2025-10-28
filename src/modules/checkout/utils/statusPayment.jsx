import { useEffect, useState, useCallback, useRef } from "react";
import {
  CheckCircle, Mail, FileText, Building2, ArrowRight, XCircle,
  Shield, Download, Calendar, CreditCard, Loader2, Receipt,
  Printer, CheckCheck, Sparkles, TrendingUp, Clock, UserCheck,
} from "lucide-react";

// --- Reusable UI Component for Data Rows ---
const DataRow = ({ icon: Icon, label, value, valueClass = "text-gray-900" }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <span className="flex items-center gap-2 text-gray-600 text-sm font-medium">
      <Icon className="w-4 h-4 text-indigo-400" /> {label}
    </span>
    <span className={`font-semibold ${valueClass} text-sm`}>{value}</span>
  </div>
);

// --- SINGLE COMPONENT TO HANDLE STATUS UI ---
export const PaymentStatusView = ({
  status, orderData, currentStep, setupError,
  handleGoToDashboard, handleReturnToPricing, handlePrintReceipt, formatPrice,
}) => {
  const commonClasses = "min-h-screen flex items-center justify-center p-4";

  if (status === "processing") {
    return (
      <div className={`${commonClasses} bg-gradient-to-br from-indigo-50 via-white to-purple-50`}>
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-gray-100">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-8 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Finalizing Your Account Setup</h1>
          <p className="text-gray-500 mb-10 text-lg">
            We're securely provisioning your {orderData.businessName} workspace.
          </p>
          <div className="space-y-4 text-left">
            {[
              { step: 1, label: "Payment Verification", desc: "Securing transaction details.", icon: Shield },
              { step: 2, label: "Workspace Creation", desc: "Building your instance on our servers.", icon: Building2 },
              { step: 3, label: "Feature Activation", desc: `Enabling ${orderData.planName} plan tools.`, icon: Sparkles },
              { step: 4, label: "Final Confirmation", desc: "Preparing to send your access email.", icon: Mail },
            ].map(({ step, label, desc, icon: Icon }) => {
              const isComplete = currentStep > step;
              const isActive = currentStep === step;
              return (
                <div key={step} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                      isComplete
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCheck className="w-5 h-5" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isComplete || isActive ? "text-gray-900" : "text-gray-500"}`}>{label}</p>
                    <p className={`text-sm ${isComplete || isActive ? "text-gray-600" : "text-gray-400"}`}>{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 pt-6 border-t border-dashed border-gray-200">
            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl">
              <span className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" /> Charged Amount
              </span>
              <span className="text-2xl font-extrabold text-indigo-600">{formatPrice(orderData.planPrice)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">Please do not close this window.</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={`${commonClasses} bg-gradient-to-br from-green-50 via-white to-indigo-50`}>
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-xl">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Setup Complete! Welcome 🎉</h1>
          <p className="text-gray-600 text-xl mb-8">Your {orderData.businessName} account is now active.</p>
          <button
            onClick={handleGoToDashboard}
            className="w-full max-w-sm mx-auto bg-indigo-600 text-white py-4 px-6 rounded-xl text-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-3 shadow-lg"
          >
            Launch My Dashboard <ArrowRight className="w-5 h-5" />
          </button>

          <div className="grid sm:grid-cols-2 gap-8 mt-10 text-left">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" /> Payment Summary
              </h3>
              <DataRow icon={Sparkles} label="Plan" value={orderData.planName} />
              <DataRow icon={TrendingUp} label="Billing Cycle" value={orderData.billingCycle} />
              <DataRow icon={CreditCard} label="Card" value={`${orderData.cardType} •••• ${orderData.cardLast4}`} />
              <DataRow icon={Calendar} label="Next Bill" value={orderData.nextBilling} />
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xl font-bold">Total Paid:</span>
                <span className="text-3xl font-extrabold text-green-600">{formatPrice(orderData.planPrice)}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Get Your Receipt
              </h3>
              <div className="space-y-3">
                {orderData.invoicePdf ? (
                  <button
                    onClick={() => window.open(orderData.invoicePdf, "_blank")}
                    className="w-full flex items-center justify-center gap-2 text-indigo-600 bg-indigo-100 py-3 rounded-lg font-semibold hover:bg-indigo-200"
                  >
                    <Download className="w-4 h-4" /> View Official Invoice (PDF)
                  </button>
                ) : (
                  <button disabled className="w-full bg-gray-200 py-3 rounded-lg text-gray-400 text-sm">
                    Invoice not yet available
                  </button>
                )}
                <button
                  onClick={handlePrintReceipt}
                  className="w-full flex items-center justify-center gap-2 text-indigo-600 bg-indigo-100 py-3 rounded-lg font-semibold hover:bg-indigo-200"
                >
                  <Printer className="w-4 h-4" /> Print Receipt
                </button>
              </div>
              <p className="mt-4 text-xs text-gray-500 text-center">
                A full invoice has also been sent to {orderData.email}.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={`${commonClasses} bg-gradient-to-br from-red-50 via-white to-red-100`}>
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-red-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6 shadow-xl">
            <XCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Setup Interrupted</h1>
          <p className="text-lg text-red-600 mb-6">{setupError}</p>
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl mb-8 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-red-700" />
              <p className="text-xl font-bold text-gray-900">
                Your Payment Is Secure: {formatPrice(orderData.planPrice)}
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Your funds were collected successfully. The setup failed, but support has been notified of Transaction ID:{" "}
              {orderData.transactionId}. You’ll receive access at {orderData.email} soon.
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() =>
                window.open("mailto:support@yourcompany.com?subject=Priority%20Setup%20Issue", "_self")
              }
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-5 h-5" /> Contact Priority Support
            </button>
            <button
              onClick={handleReturnToPricing}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300"
            >
              Return to Home Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export default { PaymentStatusView  };
