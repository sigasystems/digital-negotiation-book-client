import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getAllPlans, upgradePlan } from "../services/planService";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const safeJSONParse = (value) => {try { return JSON.parse(value || "{}");} catch { return {}; }};

export default function Plans() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();

  const storedUser = useMemo(() => {
    return safeJSONParse(sessionStorage.getItem("user"));
  }, []);

  const currentPlanId = storedUser?.planId || null;
  const userId = storedUser?.id;
  const userRole = storedUser?.userRole;

  // Fetch plans safely
  const {
    data: plans = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const data = await getAllPlans();
      if (!Array.isArray(data)) return [];

      const order = ["basic", "advanced", "pro"];
      return data
        .filter((p) => p && p.key)
        .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const formatCurrency = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const handlePlanSelect = async (plan) => {
    const billingCycle = "monthly";

    if (!userId) {
      navigate("/checkout", { state: { selectedPlan: plan } });
      return;
    }

    if (userRole === "business_owner") {
      try {
        toast.loading("Creating payment session...");
        sessionStorage.setItem(
          "pendingBusinessData",
          JSON.stringify({
            planId: plan.id,
            billingCycle,
            isUpgrade: true,
          })
        );

        const res = await upgradePlan({ userId, planId: plan.id });
        toast.dismiss();
        const checkoutUrl = res?.message?.url;

        if (res?.success && checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          toast.error("Unable to start payment. Try again.");
        }
      } catch (err) {
        toast.dismiss();
        console.error(err);
        toast.error("Upgrade failed. Try again.");
      }
      return;
    }

    sessionStorage.setItem(
      "pendingBusinessData",
      JSON.stringify({
        planId: plan.id,
        planName: plan.name,
        billingCycle,
        isUpgrade: false,
      })
    );

    navigate("/register");
  };


  const isActivePlan = (planId) => planId === currentPlanId;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading plans...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">
          Unable to load plans. Please refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="space-y-10">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-2 text-gray-800">
            Choose Your Plan
          </h2>

          <p className="text-gray-700">
            Simple pricing for businesses of all sizes
          </p>

          <div className="flex justify-center mb-10 mt-4">
            <div className="bg-gray-100 border border-gray-200 rounded-full p-1 flex">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-full text-sm font-medium 
                ${billingCycle === "monthly" ? "bg-blue-600 text-white" : "text-gray-700 hover:text-blue-600"}
              `}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-full text-sm font-medium ${billingCycle === "yearly" ? "bg-blue-600 text-white" : "text-gray-700 hover:text-blue-600"}
              `}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.isArray(plans) && plans.length > 0 ? (
              plans.map((plan) => {
                const isActive = isActivePlan(plan.id);
                const price =
                  billingCycle === "monthly"
                    ? plan.priceMonthly
                    : plan.priceYearly;

                return (
                  <Card
                    key={plan.id}
                    className={`relative hover:shadow-lg transition-all ${
                      isActive ? "ring-2 ring-green-500" : "border"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                          Active Plan
                        </span>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>
                      <p className="text-sm text-gray-700">
                        {plan.description || "Ideal for scaling your business."}
                      </p>
                    </CardHeader>

                    <CardContent className="text-center pb-4">
                      <div className="mb-6">
                        <span className="text-4xl font-semibold">
                          {formatCurrency(price, plan.currency || "INR")}
                        </span>
                        <span className="text-gray-700 ml-1">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      </div>

                      <div className="space-y-4 text-left">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-700">Locations: </span>
                            <span className="font-medium"> {plan.maxLocations} </span>
                          </div>
                          <div>
                            <span className="text-gray-700">Products: </span>
                            <span className="font-medium">
                              {plan.maxProducts}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-700">Offers: </span>
                            <span className="font-medium">{plan.maxOffers}</span>
                          </div>
                          <div>
                            <span className="text-gray-700">Buyers: </span>
                            <span className="font-medium">{plan.maxBuyers}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <ul className="space-y-2">
                            {plan.features?.length > 0 ? (
                              plan.features.map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                  <span className="text-gray-700"> {feature} </span>
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-400 text-sm">
                                No features listed.
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Button
                        onClick={() => handlePlanSelect(plan)}
                        disabled={isActive}
                        className={`w-full ${
                          isActive
                            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        }`}
                      >
                        {isActive ? "Current Plan" : `Choose ${plan.name} Plan`}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              }) ) : ( <p>No plans found.</p>)}</div>
        </div>
      </div>
    </div>
  );
}
