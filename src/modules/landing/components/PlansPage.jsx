import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle2, Loader2, Check } from "lucide-react";
import { formateCurrency } from "@/lib/utils";
import { getAllPlans } from "../services/planService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getPaymentById } from "@/modules/checkout/services/paymentService";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const navigate = useNavigate();

  // Fetch user and current payment subscription
  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(userStr);
        if (parsedUser?.paymentId) {
          fetchCurrentSubscription(parsedUser.paymentId);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const parsedUser = sessionStorage.getItem("user");
  const paymentId = parsedUser ? JSON.parse(parsedUser) : null;

  const fetchCurrentSubscription = async (paymentId) => {
    try {
      const response = await getPaymentById(paymentId);
      // ✅ Correctly extract data from backend response
      if (response?.data?.success && response.data.data) {
        setCurrentSubscription(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
    }
  };

  // Fetch all available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        const order = ["basic", "pro", "advance"];
        const sortedPlans = data.sort(
          (a, b) => order.indexOf(a.key) - order.indexOf(b.key),
        );
        setPlans(sortedPlans);
      } catch (err) {
        setError("Failed to load plans");
        toast.error("Could not load plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePlanSelect = (plan) => {
    if (currentSubscription?.Plan?.id === plan.id) {
      toast.info("This is your current plan");
      return;
    }

    navigate("/checkout", { state: { selectedPlan: plan, billingCycle } });
  };

  const isActivePlan = (planId) => {
    return currentSubscription?.Plan?.id === planId;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button className={`cursor-pointer`} onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Choose Your Plan
          </h1>
          <p className="text-gray-600">
            Simple pricing for businesses of all sizes
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span
              className={
                billingCycle === "monthly"
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly",
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                billingCycle === "yearly" ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 bg-white rounded-full transition ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={
                billingCycle === "yearly"
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }
            >
              Yearly
            </span>
          </div>
        </div>

        {/* Active Plan Banner */}
        {currentSubscription && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  Active Plan: {currentSubscription.Plan?.name}
                </h2>
                <p className="text-sm text-gray-700 mt-1">
                  {currentSubscription.Plan?.description}
                </p>
                <div className="flex gap-6 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">Amount: </span>
                    <span className="font-medium">
                      {formateCurrency(
                        currentSubscription.amount,
                        currentSubscription.currency,
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Billing: </span>
                    <span className="font-medium capitalize">
                      {currentSubscription.Plan?.billingCycle}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status: </span>
                    <span
                      className={`font-medium capitalize ${
                        currentSubscription.status === "success"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {currentSubscription.status}
                    </span>
                  </div>
                </div>
              </div>
              {currentSubscription.invoicePdf && (
                <Button
                  variant="outline"
                  className={`cursor-pointer`}
                  size="sm"
                  onClick={() =>
                    window.open(currentSubscription.invoicePdf, "_blank")
                  }
                >
                  View Invoice
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isActive = isActivePlan(plan.id);
            const price =
              billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

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
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </CardHeader>

                <CardContent className="text-center pb-4">
                  <div className="mb-6">
                    <span className="text-4xl font-semibold">
                      {formateCurrency(price, plan.currency)}
                    </span>
                    <span className="text-gray-600 ml-1">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Users: </span>
                        <span className="font-medium">{plan.maxUsers}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Products: </span>
                        <span className="font-medium">{plan.maxProducts}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Offers: </span>
                        <span className="font-medium">{plan.maxOffers}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Buyers: </span>
                        <span className="font-medium">{plan.maxBuyers}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* {plan.trialDays > 0 && !isActive && (
                      <p className="text-sm text-blue-600 pt-2">
                        {plan.trialDays} days free trial
                      </p>
                    )} */}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={isActive}
                    className={`w-full cursor-pointer ${
                      isActive
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isActive ? "Current Plan" : `Choose ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
