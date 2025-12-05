import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Loader2,
  Crown,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Download,
  Shield,
  Zap,
  Users,
  Package,
  Tag,
  ShoppingCart,
  Headphones,
  BarChart3,
  FileText,
  CheckCircle,
  X,
} from "lucide-react";
import { formateCurrency } from "@/lib/utils";
import { getPaymentById } from "@/modules/checkout/services/paymentService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllPlans } from "@/modules/landing/services/planService";

export default function UpgradePlanPage() {
  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const navigate = useNavigate();

  // 🔹 Fetch current user subscription
  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);
      if (parsedUser?.paymentId) {
        fetchCurrentSubscription(parsedUser.paymentId);
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
  }, [navigate]);

  const fetchCurrentSubscription = async (paymentId) => {
    try {
      const response = await getPaymentById(paymentId);
      if (response?.data?.success && response.data.data) {
        setCurrentSubscription(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
      toast.error("Failed to load current subscription");
    }
  };

  // 🔹 Fetch all available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        const order = ["basic", "pro", "advanced"];
        const sortedPlans = data.sort(
          (a, b) => order.indexOf(a.key) - order.indexOf(b.key)
        );
        setPlans(sortedPlans);
      } catch (err) {
        console.error("Error loading plans:", err);
        setError("Failed to load plans");
        toast.error("Could not load plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // 🔹 Upgrade handler
  const handleUpgrade = (plan) => {
    if (currentSubscription?.Plan?.id === plan.id) {
      toast.info("This is your current plan");
      return;
    }

    const currentPlanIndex = plans.findIndex(
      (p) => p.id === currentSubscription?.Plan?.id
    );
    const newPlanIndex = plans.findIndex((p) => p.id === plan.id);

    if (currentPlanIndex !== -1 && newPlanIndex <= currentPlanIndex) {
      toast.error("Please select a higher plan to upgrade");
      return;
    }

    navigate("/checkout", {
      state: { selectedPlan: plan, billingCycle, isUpgrade: true },
    });
  };

  const isActivePlan = (planId) =>
    currentSubscription?.Plan?.id === planId;

  const canUpgradeToPlan = (planId) => {
    if (!currentSubscription?.Plan?.id) return true;
    const currentIndex = plans.findIndex(
      (p) => p.id === currentSubscription.Plan.id
    );
    const targetIndex = plans.findIndex((p) => p.id === planId);
    return targetIndex > currentIndex;
  };

  const calculateSavings = (monthly, yearly) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - yearly;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  // 🔹 Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin w-10 h-10 text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  // 🔹 Error State
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Failed to load plans
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // 🔹 Main UI
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose the right plan for your business
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upgrade to unlock more features and grow your business without limits.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span
              className={`text-sm font-medium ${
                billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Monthly billing
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly"
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                billingCycle === "yearly" ? "bg-[#16a34a]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 bg-white rounded-full transition ${
                  billingCycle === "yearly"
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  billingCycle === "yearly" ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Annual billing
              </span>
              {billingCycle === "yearly" && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  Save up to 20%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Current Plan */}
        {currentSubscription && (
          <div className="mb-10">
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-2.5 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Current Plan: {currentSubscription.Plan?.name}
                        </h3>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {currentSubscription.Plan?.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>
                          <span className="font-medium text-gray-900">
                            {formateCurrency(
                              currentSubscription.amount,
                              currentSubscription.currency
                            )}
                          </span>
                          /
                          {currentSubscription.Plan?.billingCycle === "monthly"
                            ? "month"
                            : "year"}
                        </span>
                        <span>•</span>
                        <span className="capitalize">
                          {currentSubscription.Plan?.billingCycle} billing
                        </span>
                      </div>
                    </div>
                  </div>
                  {currentSubscription.invoicePdf && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(currentSubscription.invoicePdf, "_blank")
                      }
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Invoice
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const isActive = isActivePlan(plan.id);
            const canUpgrade = canUpgradeToPlan(plan.id);
            const price =
              billingCycle === "monthly"
                ? plan.priceMonthly
                : plan.priceYearly;
            const savings =
              billingCycle === "yearly"
                ? calculateSavings(plan.priceMonthly, plan.priceYearly)
                : null;
            const isPopular = plan.key === "pro";

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  isActive
                    ? "border-2 border-green-500 shadow-lg"
                    : isPopular
                    ? "border-2 border-blue-600 shadow-lg"
                    : "border border-gray-200 shadow-sm"
                } bg-white`}
              >
                {isPopular && !isActive && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#16a34a] text-white text-xs px-3 py-1 rounded-full font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                {isActive && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Your Current Plan
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pt-8 pb-4">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h2>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {formateCurrency(price, plan.currency).split(".")[0]}
                      </span>
                      <span className="text-xl text-gray-600 ml-1">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>
                    {savings && (
                      <p className="text-sm text-green-600 mt-1">
                        Save {formateCurrency(savings.amount, plan.currency)} per year
                      </p>
                    )}
                  </div>

                  {/* Plan Limits */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                      <Metric icon={Users} label="Users" value={plan.maxUsers} />
                      <Metric icon={Package} label="Products" value={plan.maxProducts} />
                      <Metric icon={Tag} label="Offers" value={plan.maxOffers} />
                      <Metric icon={ShoppingCart} label="Buyers" value={plan.maxBuyers} />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-900">What's included:</p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-6">
                  <Button
                    onClick={() => handleUpgrade(plan)}
                    disabled={isActive || !canUpgrade}
                    className={`w-full cursor-pointer ${
                      isActive
                        ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                        : !canUpgrade
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : isPopular
                        ? "bg-[#16a34a] hover:bg-green-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    {isActive
                      ? "Current Plan"
                      : !canUpgrade
                      ? "Lower Tier"
                      : `Upgrade to ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Compare & FAQ sections omitted here for brevity — same as before */}
      </div>
    </div>
  );
}

// Small helper component
const Metric = ({ icon: Icon, label, value }) => (
  <div>
    <div className="flex items-center gap-1.5 text-gray-600 mb-1">
      <Icon className="w-4 h-4" />
      <span className="text-xs">{label}</span>
    </div>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
  </div>
);
