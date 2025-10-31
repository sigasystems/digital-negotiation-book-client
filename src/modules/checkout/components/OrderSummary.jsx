import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Check, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createPayment } from "../services/paymentService";
import { apiClient } from "@/utils/apiClient";
import { login } from "@/modules/auth/services/authService";
import { showError, showSuccess } from "@/utils/toastService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function OrderSummary({
  selectedPlan,
  billingCycle,
  calculateTotal,
  formData = {},
  loading = false,
}) {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!selectedPlan) {
    return (
      <div className="text-center text-slate-500 p-6 border border-dashed rounded-lg">
        No plan selected.
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name?.trim()) newErrors.first_name = "First name required";
    if (!formData.last_name?.trim()) newErrors.last_name = "Last name required";
    if (!formData.email?.trim()) newErrors.email = "Email required";
    if (!formData.password?.trim()) newErrors.password = "Password required";
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = "Phone number required";
    if (!formData.businessName?.trim()) newErrors.businessName = "Business name required";
    if (!formData.country?.trim()) newErrors.country = "Country required";
    if (!formData.city?.trim()) newErrors.city = "City required";
    if (!formData.address?.trim()) newErrors.address = "Address required";

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      // :one: Register user
      const registerRes = await apiClient.post("/auth/login", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });

      if (!registerRes.data?.success) {
        showError(registerRes.data?.message || "Registration failed");
        return;
      }

      // :two: Login user automatically
      const data = await login({
        email: formData.email,
        password: formData.password,
      });

      const tokenPayload = data?.data?.tokenPayload;
      const token = data?.data?.accessToken;

      if (data?.statusCode === 200 && data?.success === true && token) {
        sessionStorage.removeItem("user");
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("user", JSON.stringify(tokenPayload));
        // toast.success("Logged in successfully!");
      } else {
        const message =
          data?.data?.message || "Something went wrong! Please try again later.";
        toast.error(message);
        return;
      }

      const user = tokenPayload;
      if (!user) throw new Error("Auto login failed");
      // :three: Create Stripe checkout session
      const paymentPayload = {
        userId: user.id,
        planId: selectedPlan.id,
        billingCycle,
      };
      const paymentRes = await createPayment(paymentPayload);

      if (paymentRes?.url) {
        showSuccess("Redirecting to Stripe checkout...");

        sessionStorage.setItem(
          "pendingBusinessData",
          JSON.stringify({
            planId: selectedPlan.id,
            billingCycle,
            userId: user.id,
            ...formData,
          })
        );

        window.location.href = paymentRes.url;
      const ownerPayload = {
        planId: selectedPlan.id,
        billingCycle,
        userId: user.id,
        ...formData,
      };
      const ownerRes = await becomeBusinessOwner(ownerPayload);
      if (!ownerRes?.success) {
        showError(ownerRes?.message || "Failed to create business owner.");
        return;
      }
        console.log("All done ....!!!")
      } else {
        showError("Checkout URL not received from server.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const planFeatures = [
    { label: "Users", value: selectedPlan.maxUsers },
    { label: "Products", value: selectedPlan.maxProducts },
    { label: "Offers", value: selectedPlan.maxOffers },
    { label: "Buyers", value: selectedPlan.maxBuyers },
  ];

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-6">
        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{selectedPlan.name}</h3>
                <p className="text-sm text-slate-600">{selectedPlan.description}</p>
              </div>
              <Badge variant="outline" className="capitalize">
                {billingCycle} Billing
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-2">
              {planFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  {f.value} {f.label}
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>
                  {calculateTotal()} {selectedPlan.currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900">Total</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">
  {selectedPlan.price === 0 ? (
    <>You’re starting your <span className="text-green-600">trial plan</span> 🎉</>
  ) : (
    <>
      {calculateTotal()} {selectedPlan.currency}
    </>
  )}
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
                  Your payment info is encrypted and never stored.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
