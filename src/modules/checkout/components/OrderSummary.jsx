import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {  becomeBusinessOwner, createPayment } from "../services/paymentService";
import { showError, showSuccess } from "@/utils/toastService";


export default function OrderSummary({
  selectedPlan,
  billingCycle = "monthly",
  calculateTotal,
  formData = {}, // ✅ default to empty object
  userId : userId,
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


const handleSubmit = async () => {
  if (!validateForm()) {
    showSuccess("Please fill in all required fields.");
    return;
  }

  setSubmitting(true);

  try {
    // 1️⃣ Create Stripe payment session
    const paymentPayload = {
      isStripe: true,
      userId,
      planId: selectedPlan.id,
    };
    const paymentRes = await createPayment(paymentPayload);
    if (paymentRes?.checkoutUrl) {
      showSuccess("Redirecting to Stripe checkout...");

      // 2️⃣ Store pending data for after checkout
      sessionStorage.setItem(
        "pendingBusinessData",
        JSON.stringify({
          planId: selectedPlan.id,
          billingCycle,
          userId,
          ...formData,
        })
      );

      // 3️⃣ Redirect to Stripe checkout page
      window.location.href = paymentRes.checkoutUrl;
    } else {
      showError("Checkout URL not received from server.");
    }
  } catch (err) {
    console.error("Error during payment creation:", err);
    showError(err.response?.data?.message || err.message || "Something went wrong");
  } finally {
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
