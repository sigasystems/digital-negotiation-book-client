import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllPlans, upgradePlan } from "../services/planService";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Dot } from "lucide-react";
import { businessOwnerService } from "@/modules/businessOwner/services/businessOwner";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const navigate = useNavigate();

  // Load user data once
  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = storedUser?.id || null;
  const userRole = storedUser?.userRole || null;
  const paymentId = storedUser?.paymentId || null;
  const activePlanName = activePlan?.data?.Plan?.name || "No active plan";
  // ---------------------------------------------------------------------
  // Fetch active plan details
  // ---------------------------------------------------------------------
  useEffect(() => {
    async function fetchActivePlan() {
      try {
        if (!paymentId) return;
        const res = await businessOwnerService.getPaymentById(paymentId);
        setActivePlan(res?.data);
      } catch (err) {
        console.error("Error fetching active plan:", err);
      }
    }
    fetchActivePlan();
  }, [paymentId]);
  // --------------------------------------------------------------------
  // Fetch all plans
  // ---------------------------------------------------------------------
  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await getAllPlans();

        const order = ["basic", "advanced", "pro"];
        const sortedPlans = data.sort(
          (a, b) => order.indexOf(a.key) - order.indexOf(b.key),
        );
        setPlans(sortedPlans || []);
        if (storedUser?.planId) {
          setCurrentPlanId(storedUser.planId);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        toast.error("Unable to load plans.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  // ---------------------------------------------------------------------
  // Format currency
  // ---------------------------------------------------------------------
  const formatCurrency = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);

  // ---------------------------------------------------------------------
  // Handle plan selection or upgrade
  // ---------------------------------------------------------------------
  const handlePlanSelect = async (plan) => {
    const billing = "monthly";

    if (!userId) {
      navigate("/checkout", { state: { selectedPlan: plan } });
      return;
    }

    if (userRole === "business_owner") {
      try {
        toast.loading("Creating payment session...");

        // Store upgrade session
        sessionStorage.setItem(
          "pendingBusinessData",
          JSON.stringify({
            planId: plan.id,
            billingCycle: billing,
            isUpgrade: true,
          }),
        );

        const res = await upgradePlan({ userId, planId: plan.id });

        toast.dismiss();

        const checkoutUrl = res?.message?.url;

        if (res?.success && checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          toast.error("Unable to start payment. Please try again.");
        }
      } catch (err) {
        toast.dismiss();
        console.error(err);
        toast.error("Upgrade failed. Please try again.");
      }
      return;
    }

    // New registration checkout flow
    sessionStorage.setItem(
      "pendingBusinessData",
      JSON.stringify({
        planId: plan.id,
        planName: plan.name,
        billingCycle: billing,
        isUpgrade: false,
      }),
    );

    navigate("/register");
  };

  const isActivePlan = (planId) => planId === currentPlanId;

  // ---------------------------------------------------------------------
  // Loader UI
  // ---------------------------------------------------------------------
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading plans...</p>
      </div>
    );

  // ---------------------------------------------------------------------
  // Main UI
  // ---------------------------------------------------------------------
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-5xl font-bold mb-2 text-gray-800">
          Choose Your Plan
        </h2>
        <p className="text-gray-700">
          Simple pricing for businesses of all sizes
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10 mt-4">
          <div className="bg-gray-100 border border-gray-200 rounded-full p-1 flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const active = isActivePlan(plan.id);
          const price =
            billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

          return (
            <Card
              key={plan.id}
              className={`relative hover:shadow-lg transition-all ${
                active ? "ring-2 ring-green-500" : "border"
              }`}
            >
              {/* Green Dot for Active */}
              {active && (
                <div className="absolute top-4 right-4">
                  <span className="h-3 w-3 bg-blue-600 rounded-full "></span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>

                <h2 className="text-xl font-semibold mb-1">
                  {plan.name === activePlanName ? (
                    <h3>
                      <div className="absolute top-4 right-4">
                        <Dot className="bg-green-500 border-4 rounded-full"></Dot>
                      </div>
                    </h3>
                  ) : (
                    <h3></h3>
                  )}
                </h2>
                <p className="text-sm text-gray-700">
                  {plan.description || "Ideal for scaling your business."}
                </p>
              </CardHeader>

              <CardContent className="text-center pb-4">
                <div className="mb-6">
                  <span className="text-4xl font-semibold">
                    {formatCurrency(price, plan.currency || "INR")}.l
                  </span>
                  <span className="text-gray-700 ml-1">
                    /{billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </div>

                <div className="space-y-4 text-left">
                  {/* Features Meta */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-700">Locations: </span>
                      <span className="font-medium">{plan.maxLocations}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Products: </span>
                      <span className="font-medium">{plan.maxProducts}</span>
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

                  {/* Features List */}
                  <div className="pt-4 border-t">
                    <ul className="space-y-2">
                      {plan.features?.length > 0 ? (
                        plan.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
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

              <CardFooter>
                <Button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={active}
                  className={`w-full ${
                    active
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {active
                    ? "Current Plan"
                    : userRole === "business_owner"
                      ? "Upgrade Plan"
                      : `Choose ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Active Plan Info */}

      {/* <div className="container mt-10  ">
        <div className=" max-w-7xl mx-auto bg-white shadow-lg border border-gray-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 text-center">
            Your Active Plan
          </h3>

          <div className="text-center space-y-1">
            <span className="text-xl font-semibold text-blue-700">
              {activePlanName || "No Active Plan"}
            </span>

            <div className="inline-block mt-2">
              <span className="px-4 py-1 rounded-full text-sm bg-blue-100 text-blue-700 font-medium">
                {billingCycle === "monthly" ? "Monthly Plan" : "Yearly Plan"}
              </span>
            </div>
          </div>

          <div className="border-b border-gray-200"></div>

          <div className="space-y-2 text-gray-700 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Subscription ID:</span>
              <span className="font-semibold">
                {activePlan?.data?.subscriptionId || "--"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Current Billing Cycle:</span>
              <span className="font-semibold capitalize">{billingCycle}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Plan Status:</span>
              <span className="font-semibold text-green-600">Active</span>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-sm text-blue-700 font-medium">
              Enjoy all features included in your {activePlanName} plan.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
