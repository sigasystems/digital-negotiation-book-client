import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { formateCurrency } from "@/lib/utils";
import { getAllPlans } from "../services/planService";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await getAllPlans();
        const customeKey = ["trail", "basic", "pro"];
        const sorted = data.sort(
          (a, b) => customeKey.indexOf(a.key) - customeKey.indexOf(b.key)
        );
        setPlans(sorted);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    // Check sessionStorage for login
    const user = sessionStorage.getItem("user");
    if (user) setIsLoggedIn(true);

    fetchPlans();
  }, []);

  const handleChoosePlan = (plan) => {
    if (!isLoggedIn) {
      toast.error("Please log in to choose a plan");
      // Save current path to redirect after login
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login");
      return;
    }

    // If logged in, navigate to checkout
    navigate("/checkout", { state: { selectedPlan: plan, billingCycle } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin w-5 h-5 text-indigo-600" />
          <span>Fetching plans...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-3">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">No plans available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 cursor-pointer">
          Choose Your Plan
        </h1>
        <p className="text-gray-600 text-base">
          Select a plan that best suits your business. Upgrade, downgrade, or cancel anytime.
        </p>

        {/* Billing toggle */}
        <div className="mt-6 flex justify-center items-center gap-3">
          <span
            className={`cursor-pointer text-sm font-medium ${
              billingCycle === "monthly" ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition ${
              billingCycle === "yearly" ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                billingCycle === "yearly" ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              billingCycle === "yearly" ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            Yearly
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              plan.isDefault ? "border-indigo-600" : "border-gray-200"
            }`}
          >
            {plan.priceMonthly > 200 && plan.priceYearly > 200 && (
              <span className="absolute top-3 right-3 text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                Popular
              </span>
            )}

            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
            </CardHeader>

            <CardContent className="text-center">
              <p className="text-4xl font-extrabold text-gray-900 mb-2">
                {formateCurrency(
                  billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly,
                  plan.currency
                )}
                <span className="text-sm font-medium text-gray-500 ml-1">
                  /{billingCycle === "monthly" ? "monthly" : "yearly"}
                </span>
              </p>
              <p className="text-gray-500 mb-6">
                per {billingCycle === "monthly" ? "monthly" : "yearly"}
              </p>

              <div className="grid grid-cols-2 gap-4 text-left mb-4">
                <p className="text-gray-700 text-sm">
                  <strong>Users:</strong> {plan.maxUsers}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Products:</strong> {plan.maxProducts}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Offers:</strong> {plan.maxOffers}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Buyers:</strong> {plan.maxBuyers}
                </p>
                <p className="text-gray-700 text-sm col-span-2">
                  <strong>Trial Days:</strong> {plan.trialDays}
                </p>
              </div>

              <ul className="space-y-3 text-left mt-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle2 className="text-green-500 w-4 h-4" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="flex justify-center mt-6">
              <button
                onClick={() => handleChoosePlan(plan)}
                className={`inline-flex items-center justify-center w-full py-2 font-semibold rounded-lg ${
                  plan.isDefault
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-800 hover:bg-gray-900 text-white"
                }`}
              >
                Choose {plan.name}
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
