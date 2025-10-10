// import React, { useState } from "react";
// import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
// import { Check, CreditCard, Shield } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { createPayment } from "../services/paymentService";
// import { toast } from "react-hot-toast"; // make sure react-hot-toast is installed

// export default function OrderSummary({
//   selectedPlan,
//   billingCycle = "monthly",
//   calculateTotal,
//   userId = "3893289d-0ac9-444d-9b57-34591581f58f",
//   loading = false,
//   onSuccess,
// }) {
//   const [submitting, setSubmitting] = useState(false);

//   if (!selectedPlan) {
//     return (
//       <div className="text-center text-slate-500 p-6 border border-dashed rounded-lg">
//         No plan selected.
//       </div>
//     );
//   }

//   const planFeatures = [
//     { label: "Users", value: selectedPlan.maxUsers },
//     { label: "Products", value: selectedPlan.maxProducts },
//     { label: "Offers", value: selectedPlan.maxOffers },
//     { label: "Buyers", value: selectedPlan.maxBuyers },
//   ];

//   const handleSubmit = async () => {
//     if (!userId || !selectedPlan?.id) {
//       toast.error("User or plan information is missing!");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const payload = {
//         isStripe: true,
//         userId,
//         planId: selectedPlan.id,
//       };

//       const response = await createPayment(payload);

// if (response?.checkoutUrl) {
//   toast.success("Redirecting to Stripe checkout...");
//   window.open(response.checkoutUrl, "_blank");
// } else {
//   toast.error("Checkout URL not received from server.");
// }


//       if (onSuccess) onSuccess(response.data);
//     } catch (err) {
//       console.error("Payment Error:", err);
//       toast.error(err || "Something went wrong during payment.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="lg:col-span-1">
//       <div className="sticky top-24 space-y-6">
//         {/* Order Summary Card */}
//         <Card className="shadow-lg border-slate-200">
//           <CardHeader>
//             <CardTitle className="text-lg">Order Summary</CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             {/* Plan Details */}
//             <div className="space-y-3">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="font-semibold text-slate-900">{selectedPlan.name}</h3>
//                   <p className="text-sm text-slate-600 mt-1">{selectedPlan.description}</p>
//                 </div>
//               </div>

//               <Badge variant="outline" className="capitalize">
//                 {billingCycle} Billing
//               </Badge>

//               {selectedPlan.trialDays > 0 && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//                   <p className="text-sm text-green-800 font-medium">
//                     🎉 {selectedPlan.trialDays}-day free trial included
//                   </p>
//                 </div>
//               )}
//             </div>

//             <Separator />

//             {/* Features */}
//             <div className="space-y-2">
//               <p className="text-sm font-medium text-slate-700">Plan Includes:</p>
//               <div className="grid grid-cols-2 gap-2">
//                 {planFeatures.map((feature, idx) => (
//                   <div key={idx} className="flex items-center gap-2 text-sm">
//                     <Check className="w-4 h-4 text-green-600" />
//                     <span className="text-slate-600">
//                       {feature.value} {feature.label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <Separator />

//             {/* Pricing */}
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-600">Subtotal</span>
//                 <span className="text-slate-900">
//                   {calculateTotal()} {selectedPlan.currency}
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-600">Tax</span>
//                 <span className="text-slate-900">Calculated at checkout</span>
//               </div>
//               <Separator />
//               <div className="flex justify-between items-baseline">
//                 <span className="font-semibold text-slate-900">Total</span>
//                 <div className="text-right">
//                   <p className="text-2xl font-bold text-slate-900">
//                     {calculateTotal()} {selectedPlan.currency}
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     per {billingCycle === "monthly" ? "month" : "year"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <Button
//               onClick={handleSubmit}
//               disabled={loading || submitting}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-base font-semibold"
//             >
//               {submitting ? (
//                 "Processing..."
//               ) : (
//                 <>
//                   <CreditCard className="w-4 h-4 mr-2" />
//                   Complete Purchase
//                 </>
//               )}
//             </Button>

//             <p className="text-xs text-center text-slate-500">
//               By completing this purchase, you agree to our Terms of Service and Privacy Policy
//             </p>
//           </CardContent>
//         </Card>

//         {/* Security Badge */}
//         <Card className="shadow-md border-slate-200 bg-slate-50">
//           <CardContent className="pt-6">
//             <div className="flex items-start gap-3">
//               <Shield className="w-5 h-5 text-green-600 mt-0.5" />
//               <div>
//                 <h4 className="text-sm font-semibold text-slate-900 mb-1">
//                   Secure Payment
//                 </h4>
//                 <p className="text-xs text-slate-600">
//                   Your payment information is encrypted and secure. We never store your card details.
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { becomeBusinessOwner, createPayment } from "../services/paymentService";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function OrderSummary({
  selectedPlan,
  billingCycle = "monthly",
  calculateTotal,
  formData = {}, // ✅ default to empty object
  userId = "c3cd498b-b986-42f5-9f88-e10b28cdd437",
  loading = false,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!selectedPlan) {
    return (
      <div className="text-center text-slate-500 p-6 border border-dashed rounded-lg">
        No plan selected.
      </div>
    );
  }

  const planFeatures = [
    { label: "Users", value: selectedPlan.maxUsers },
    { label: "Products", value: selectedPlan.maxProducts },
    { label: "Offers", value: selectedPlan.maxOffers },
    { label: "Buyers", value: selectedPlan.maxBuyers },
  ];

  
  // Validate form fields
 const validateForm = () => {
  if (!formData) {
    console.error("formData is undefined!");
    return false;
  }

  const newErrors = {};
  if (!formData.first_name?.trim()) newErrors.first_name = "First name is required";
  if (!formData.last_name?.trim()) newErrors.last_name = "Last name is required";
  if (!formData.email?.trim()) newErrors.email = "Email is required";
  if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = "Phone number is required";
  if (!formData.businessName?.trim()) newErrors.businessName = "Business name is required";
  if (!formData.country?.trim()) newErrors.country = "Country is required";
  if (!formData.city?.trim()) newErrors.city = "City is required";
  if (!formData.address?.trim()) newErrors.address = "Address is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    newErrors.email = "Please enter a valid email";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // const handleSubmit = async () => {
  //   if (!validateForm()) {
  //     toast.error("Please fix form errors before proceeding.");
  //     return;
  //   }

  //   setSubmitting(true);
  //   try {
  //     // 1️⃣ Submit user/business info
  //     const payload = {
  //       planId: selectedPlan.id,
  //       billingCycle,
  //        userId : "46893fc7-ef43-4d8a-8099-5c815ea3ab2b",
  //       ...formData,
  //     };


  //     console.log("full payload user id:", userId);
  //     console.log("payload:", payload);
  //     const res = await becomeBusinessOwner(payload); 
       

  //     if (!res.data.success) {
  //       toast.error(res.data.message || "Failed to save business info");
  //       setSubmitting(false);
  //       return;
  //     }

  //     // 2️⃣ Create payment
  //     const paymentPayload = {
  //       isStripe: true,
  //       userId,
  //       planId: selectedPlan.id,
  //     };

  //     const paymentRes = await createPayment(paymentPayload);

  //     if (paymentRes?.checkoutUrl) {
  //       toast.success("Redirecting to Stripe checkout...");
  //       window.open(paymentRes.checkoutUrl, "_blank");
  //     } else {
  //       toast.error("Checkout URL not received from server.");
  //     }
  //   } catch (err) {
  //     console.error("Error during checkout:", err);
  //     toast.error(err.response?.data?.message || err.message || "Something went wrong");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  
  const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error("Please fix form errors before proceeding.");
    return;
  }

  setSubmitting(true);

  try {
    // 1️⃣ Create Stripe payment first
    const paymentPayload = {
      isStripe: true,
      userId,
      planId: selectedPlan.id,
    };

    console.log("Creating payment with:", paymentPayload);
    const paymentRes = await createPayment(paymentPayload);
console.log("url processing",paymentRes?.checkoutUrl)
    if (paymentRes?.checkoutUrl) {
      toast.success("Redirecting to Stripe checkout...");
      // Open Stripe checkout in new tab
      window.open(paymentRes.checkoutUrl, "_blank");

      // Optional: you can store the payload locally or in sessionStorage
      // to submit to backend later after webhook
      sessionStorage.setItem(
        "pendingBusinessData",
        JSON.stringify({
          planId: selectedPlan.id,
          billingCycle,
          userId,
          ...formData,
        })
      );

    } else {
      toast.error("Checkout URL not received from server.");
      setSubmitting(false);
    }
  } catch (err) {
    console.error("Error during payment creation:", err);
    toast.error(err.response?.data?.message || err.message || "Something went wrong");
    setSubmitting(false);
  }
};

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-6">
        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedPlan.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{selectedPlan.description}</p>
                </div>
              </div>

              <Badge variant="outline" className="capitalize">{billingCycle} Billing</Badge>

              {selectedPlan.trialDays > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-medium">
                    🎉 {selectedPlan.trialDays}-day free trial included
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Plan Includes:</p>
              <div className="grid grid-cols-2 gap-2">
                {planFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-slate-600">{feature.value} {feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="text-slate-900">{calculateTotal()} {selectedPlan.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax</span>
                <span className="text-slate-900">Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900">Total</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {calculateTotal()} {selectedPlan.currency}
                  </p>
                  <p className="text-xs text-slate-500">
                    per {billingCycle === "monthly" ? "month" : "year"}
                  </p>
                </div>
              </div>
            </div>

            <Button
  onClick={handleSubmit}
  disabled={loading || submitting}
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-base font-semibold"
>
  {submitting ? "Processing..." : "Complete Purchase"}
</Button>


            <p className="text-xs text-center text-slate-500">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200 bg-slate-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">
                  Secure Payment
                </h4>
                <p className="text-xs text-slate-600">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
