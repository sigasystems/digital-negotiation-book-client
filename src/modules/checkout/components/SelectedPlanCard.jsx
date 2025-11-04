import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard } from "lucide-react";

export default function SelectedPlanCard({ selectedPlan, billingCycle = "monthly" }) {
  if (!selectedPlan) {
    return (
      <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-500">
        No plan selected yet.
      </div>
    );
  }

  const {
    name,
    description,
    currency,
    priceMonthly,
    priceYearly,
    features = [],
    maxUsers,
    maxProducts,
    maxOffers,
    maxBuyers,
    trialDays,
  } = selectedPlan;

  const price =
    billingCycle === "yearly" ? priceYearly || 0 : priceMonthly || 0;

  return (
    <Card className="shadow-md border-slate-200 mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">{name}</CardTitle>
            <CardDescription className="text-sm text-slate-600 mt-1">
              {description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            {billingCycle} Billing
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Price Section */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">Price</p>
              <p className="text-lg font-semibold text-slate-900">
                {currency} {price}
                <span className="text-sm text-slate-500 ml-1">
                  / {billingCycle === "yearly" ? "year" : "month"}
                </span>
              </p>
            </div>
          </div>

          {/* {trialDays > 0 && (
            <Badge className="bg-green-100 text-green-700 border-green-300">
              🎉 {trialDays}-day Trial
            </Badge>
          )} */}
        </div>

        <Separator />

        {/* Features Section */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">
            Plan Includes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {features.length > 0 ? (
              features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic text-sm">No features listed.</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Usage Limits */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-slate-700">
          <div>
            <p className="font-medium">Users</p>
            <p>{maxUsers || "—"}</p>
          </div>
          <div>
            <p className="font-medium">Products</p>
            <p>{maxProducts || "—"}</p>
          </div>
          <div>
            <p className="font-medium">Offers</p>
            <p>{maxOffers || "—"}</p>
          </div>
          <div>
            <p className="font-medium">Buyers</p>
            <p>{maxBuyers || "—"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
