import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { formateCurrency } from "@/lib/utils";
import { getAllPlans } from "../services/planService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState("monthly"); // or yearly
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ isLoggedIn , setIsLoggedIn ] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const user = sessionStorage.getItem("user");
  if (user) setIsLoggedIn(true);
}, []);


  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await getAllPlans();
        const order = ["trial", "basic", "pro"];
        const sortedPlans = data.sort(
          (a, b) => order.indexOf(a.key) - order.indexOf(b.key)
        );
        setPlans(sortedPlans);
      } catch (err) {
        setError("Failed to load subscription plans. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const handlePlanSelect = (plan) => {
    navigate("/checkout", { state: { selectedPlan: plan, billingCycle } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin w-6 h-6 text-indigo-600 mr-2" />
        <span className="text-gray-600">Loading plans...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-indigo-600 text-white">
          Retry
        </Button>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No subscription plans available right now.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="cursor-pointer  text-4xl font-bold text-gray-900">Choose a Plan</h1>
        <p className="text-gray-600 mt-2">
          Flexible pricing for all business sizes. Upgrade or cancel anytime.
        </p>

        {/* Billing cycle toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={billingCycle === "monthly" ? "text-indigo-600" : "text-gray-500"}>
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
            className={`cursor-pointer relative inline-flex h-6 w-12 items-center rounded-full transition ${
              billingCycle === "yearly" ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform bg-white rounded-full transition ${
                billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={billingCycle === "yearly" ? "text-indigo-600" : "text-gray-500"}>
            Yearly
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative border-2 transition-all hover:shadow-xl ${
              plan.isDefault ? "border-indigo-600" : "border-gray-200"
            }`}
          >
            {plan.priceMonthly > 200 && (
              <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                Popular
              </span>
            )}

            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="text-gray-500 text-sm">{plan.description}</p>
            </CardHeader>

            
            <CardContent className="text-center">
              Price
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

              {/* Plan Details */}
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

              {/* Features */}
              <ul className="space-y-3 text-left mt-2">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-700 text-sm"
                  >
                    <CheckCircle2 className="text-green-500 w-4 h-4" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-6 px-6">
              
<button
    onClick={() =>
       {
        // if (!isLoggedIn) {
        //   toast.error("Please log in to choose a plan");
        //   return;
        // }
      // If logged in, navigate to checkout
      navigate("/checkout", { state: { selectedPlan: plan, billingCycle } });
    }}
    className={`cursor-pointer inline-flex items-center justify-center w-full py-2 font-semibold rounded-lg ${
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
