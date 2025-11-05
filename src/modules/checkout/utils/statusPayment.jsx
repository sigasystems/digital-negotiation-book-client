import { Button } from "@headlessui/react";
import {
  CheckCircle, Mail, Building2, ArrowRight, XCircle,
  Shield, Download, Calendar, CreditCard, Loader2,
  Printer, Sparkles, UserCheck, Clock, Receipt, FileCheck,
  ArrowDown,
} from "lucide-react";

export const PaymentStatusView = ({
  status, orderData, currentStep, setupError,
  handleGoToDashboard, handleReturnToPricing, handlePrintReceipt, formatPrice, }) => 
{
  

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-7xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-white text-xl sm:text-2xl mb-1">Setting Up Your Account</h1>
                  <p className="text-blue-100 text-sm">{orderData.businessName}</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-0">
              <div className="lg:col-span-3 p-6 sm:p-10 bg-white">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm mb-4">
                    <Clock className="w-4 h-4" />
                    <span>Estimated time: 30 seconds</span>
                  </div>
                  <h2 className="text-lg text-gray-800 mb-2">Account Setup Progress</h2>
                  <p className="text-sm text-gray-500">Please wait while we configure your workspace</p>
                </div>

                <div className="space-y-5">
                  {[
                    { 
                      step: 1, 
                      label: "Payment Verification", 
                      desc: "Confirming your transaction with our secure payment gateway", 
                      icon: Shield 
                    },
                    { 
                      step: 2, 
                      label: "Workspace Provisioning", 
                      desc: "Creating your dedicated cloud environment and database", 
                      icon: Building2 
                    },
                    { 
                      step: 3, 
                      label: "Feature Activation", 
                      desc: "Enabling your plan features and configuring permissions", 
                      icon: Sparkles 
                    },
                    { 
                      step: 4, 
                      label: "Account Credentials", 
                      desc: "Generating secure access keys and sending confirmation", 
                      icon: Mail 
                    },
                  ].map(({ step, label, desc, icon: Icon }) => {
                    const isComplete = currentStep > step;
                    const isActive = currentStep === step;
                    return (
                      <div key={step} className="relative">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                                isComplete
                                  ? "bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-200"
                                  : isActive
                                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200"
                                  : "bg-gray-100 border-2 border-gray-200"
                              }`}
                            >
                              {isComplete ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                              ) : isActive ? (
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                              ) : (
                                <Icon className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            {step < 4 && (
                              <div 
                                className={`absolute left-1/2 top-12 w-0.5 h-8 -ml-px transition-colors duration-500 ${
                                  isComplete ? "bg-green-400" : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex-1 pt-2">
                            <p className={`text-base mb-1 transition-colors duration-300 ${
                              isComplete || isActive ? "text-gray-900" : "text-gray-500"
                            }`}>
                              {label}
                            </p>
                            <p className={`text-sm transition-colors duration-300 ${
                              isComplete || isActive ? "text-gray-600" : "text-gray-400"
                            }`}>
                              {desc}
                            </p>
                            {isActive && (
                              <div className="mt-3">
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse w-2/3" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>Your data is encrypted and secure. Do not close this window.</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-10 border-l border-gray-200">
                <div className="sticky top-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 text-base">Payment Summary</h3>
                        <p className="text-xs text-gray-500">Transaction details</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Selected Plan</p>
                          <p className="text-sm text-gray-900">{orderData.planName}</p>
                        </div>
                        <div className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                          Active
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Billing Cycle</p>
                          <p className="text-sm text-gray-900 capitalize">{orderData.billingCycle}</p>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Payment Method</p>
                          <p className="text-sm text-gray-900">{orderData.cardType || 'Card'} •••• {orderData.cardLast4 || 'XXXX'}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Transaction ID</p>
                        <p className="text-xs text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                          {orderData.transactionId || 'Processing...'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm text-gray-600">Amount Charged</span>
                        <span className="text-2xl text-gray-900">{formatPrice(orderData.planPrice)}</span>
                      </div>
                      <p className="text-xs text-gray-500 text-right">Including all applicable taxes</p>
                    </div>

                    <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 mb-1">Processing Payment</p>
                          <p className="text-xs text-gray-600">Your payment was successful. We're setting up your account now.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br mt-19 mb-10 m-4 from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center sm:p-6">
        <div className="w-full max-w-7xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 sm:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-white text-xl sm:text-2xl mb-1">Setup Complete</h1>
                  <p className="text-green-100 text-sm">Your account is ready to use</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-0">
              <div className="lg:col-span-3 p-6 sm:p-10 bg-white">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm mb-4">
                    <CheckCircle className="w-4 h-4" />
                    <span>All systems operational</span>
                  </div>
                  <h2 className="text-lg text-gray-800 mb-2">Welcome to {orderData.businessName}</h2>
                  <p className="text-sm text-gray-500">Your workspace has been successfully configured</p>
                </div>

                <div className="space-y-5">
                  {[
                    { 
                      label: "Payment Verified", 
                      desc: "Transaction confirmed and payment processed successfully", 
                      icon: Shield 
                    },
                    { 
                      label: "Workspace Ready", 
                      desc: "Your dedicated environment is fully provisioned", 
                      icon: Building2 
                    },
                    { 
                      label: "Features Activated", 
                      desc: "All plan features are enabled and ready to use", 
                      icon: Sparkles 
                    },
                    { 
                      label: "Access Granted", 
                      desc: `Email sent to ${orderData.email} with account credentials`, 
                      icon: Mail 
                    },
                  ].map(({ label, desc, icon: Icon }, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-200">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          {idx < 3 && (
                            <div className="absolute left-1/2 top-12 w-0.5 h-8 -ml-px bg-green-300" />
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <p className="text-base text-gray-900 mb-1">{label}</p>
                          <p className="text-sm text-gray-600">{desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleGoToDashboard}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl text-base hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 group"
                  >
                    <span>Access Your Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-10 border-l border-gray-200">
                <div className="sticky top-6 space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 text-base">Order Confirmation</h3>
                        <p className="text-xs text-gray-500">Payment successful</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Plan</p>
                          <p className="text-sm text-gray-900">{orderData.planName}</p>
                        </div>
                        <div className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full">
                          Active
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Billing</p>
                          <p className="text-sm text-gray-900 capitalize">{orderData.billingCycle}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Next Billing</p>
                          <p className="text-sm text-gray-900">{orderData.nextBilling}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Payment Method</p>
                        <p className="text-sm text-gray-900">{orderData.cardType || 'Card'} •••• {orderData.cardLast4 || 'XXXX'}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Transaction ID</p>
                        <p className="text-xs text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                          {orderData.transactionId || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm text-gray-600">Total Paid</span>
                        <span className="text-2xl text-gray-900">{formatPrice(orderData.planPrice)}</span>
                      </div>
                      <p className="text-xs text-gray-500 text-right">Receipt sent to your email</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h4 className="text-sm text-gray-900 mb-4">Download Documents</h4>
                    <div className="space-y-2">
                      {orderData.invoicePdf ? (
                        <button
                          onClick={() => window.open(orderData.invoicePdf, "_blank")}
                          className="w-full flex items-center justify-between gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 py-3 px-4 rounded-lg text-sm transition-colors group"
                        >
                          <span className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            <span>Invoice PDF</span>
                          </span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ) : (                   
                        <Button>
                          Click for Download Invoice
                        </Button>              
                      )}
                      <button
                        onClick={handlePrintReceipt}
                        className="w-full flex items-center justify-between gap-2 text-gray-700 bg-gray-50 hover:bg-gray-100 py-3 px-4 rounded-lg text-sm transition-colors group"
                      >
                        <span className="flex items-center gap-2">
                          <Printer className="w-4 h-4" />
                          <span>Print Receipt</span>
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 mb-1">Email Confirmation Sent</p>
                        <p className="text-xs text-gray-600">Check {orderData.email} for your access details and receipt</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 mt-14 mb-10 m-4  via-orange-50 to-yellow-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-7xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 sm:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-white text-xl sm:text-2xl mb-1">Setup Interrupted</h1>
                  <p className="text-red-100 text-sm">Action required</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-0">
              <div className="lg:col-span-3 p-6 sm:p-10 bg-white">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm mb-4">
                    <XCircle className="w-4 h-4" />
                    <span>Setup incomplete</span>
                  </div>
                  <h2 className="text-lg text-gray-800 mb-2">An Error Occurred</h2>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-red-800">{setupError}</p>
                  </div>
                  <p className="text-sm text-gray-500">Don't worry - your payment is secure and our team has been notified</p>
                </div>

                <div className="space-y-5">
                  {[
                    { 
                      label: "Payment Verified", 
                      desc: "Transaction confirmed - your payment is secure", 
                      icon: Shield,
                      status: "complete"
                    },
                    { 
                      label: "Workspace Creation", 
                      desc: "Environment provisioned successfully", 
                      icon: Building2,
                      status: "complete"
                    },
                    { 
                      label: "Feature Configuration", 
                      desc: "Setup process was interrupted at this stage", 
                      icon: Sparkles,
                      status: "error"
                    },
                    { 
                      label: "Access Credentials", 
                      desc: "Pending - will be sent once issue is resolved", 
                      icon: Mail,
                      status: "pending"
                    },
                  ].map(({ label, desc, icon: Icon, status: itemStatus }, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            itemStatus === "complete"
                              ? "bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-200"
                              : itemStatus === "error"
                              ? "bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-200"
                              : "bg-gray-100 border-2 border-gray-200"
                          }`}>
                            {itemStatus === "complete" ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : itemStatus === "error" ? (
                              <XCircle className="w-6 h-6 text-white" />
                            ) : (
                              <Icon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          {idx < 3 && (
                            <div className={`absolute left-1/2 top-12 w-0.5 h-8 -ml-px ${
                              itemStatus === "complete" ? "bg-green-300" : itemStatus === "error" ? "bg-red-300" : "bg-gray-200"
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <p className={`text-base mb-1 ${
                            itemStatus === "complete" || itemStatus === "error" ? "text-gray-900" : "text-gray-500"
                          }`}>
                            {label}
                          </p>
                          <p className="text-sm text-gray-600">{desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 space-y-3">
                  <button
                    onClick={() => window.open("mailto:support@yourcompany.com?subject=Setup%20Issue%20-%20" + orderData.transactionId, "_self")}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl text-base hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3"
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>Contact Priority Support</span>
                  </button>
                  <button
                    onClick={handleReturnToPricing}
                    className="w-full bg-white text-gray-700 border-2 border-gray-200 py-4 px-6 rounded-xl text-base hover:bg-gray-50 transition-colors"
                  >
                    Return to Home
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-10 border-l border-gray-200">
                <div className="sticky top-6 space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 text-base">Payment Status</h3>
                        <p className="text-xs text-gray-500">Your transaction</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Selected Plan</p>
                          <p className="text-sm text-gray-900">{orderData.planName}</p>
                        </div>
                        <div className="bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-full">
                          Pending
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Billing</p>
                          <p className="text-sm text-gray-900 capitalize">{orderData.billingCycle}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Payment</p>
                          <p className="text-sm text-gray-900">{orderData.cardType || 'Card'} ••{orderData.cardLast4 || 'XX'}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Transaction ID</p>
                        <p className="text-xs text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                          {orderData.transactionId || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm text-gray-600">Amount Charged</span>
                        <span className="text-2xl text-gray-900">{formatPrice(orderData.planPrice)}</span>
                      </div>
                      <p className="text-xs text-gray-500 text-right">Payment secured</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 mb-1">Payment Secured</p>
                        <p className="text-xs text-gray-600">Your payment was processed successfully. No additional charges will be made.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 mb-1">Support Team Notified</p>
                        <p className="text-xs text-gray-600">Our technical team is resolving the issue. You'll receive access at {orderData.email} shortly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default { PaymentStatusView };