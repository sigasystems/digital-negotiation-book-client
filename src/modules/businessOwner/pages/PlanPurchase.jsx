import React, { useEffect, useState } from "react";

const PlanPurchase = () => {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paymentId =localStorage.getItem("paymentId");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        if (!paymentId) {
          setError("No payment ID found in session.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/${paymentId}`);
        if (!res.ok) throw new Error("Failed to fetch plan details");

        const data = await res.json();
        setPlanData(data?.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [paymentId]);

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading your plan details...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
  if (!planData)
    return <div className="p-8 text-center text-gray-500">No plan found.</div>;

  const { Plan, User } = planData;

  return (
    <div className="max-w-4xl mx-auto my-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Plan Summary</h1>
        <p className="text-gray-500 mt-2">Here’s everything about your active subscription</p>
      </div>

      {/* Plan Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="bg-gray-900 text-white px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">{Plan?.name}</h2>
            <p className="text-gray-300 text-sm">{Plan?.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹{Plan?.priceMonthly}</div>
            <div className="text-sm text-gray-300">{Plan?.billingCycle?.toUpperCase()}</div>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-gray-800 font-semibold mb-3">Plan Details</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Max Users: <span className="font-medium">{Plan?.maxUsers}</span></li>
              <li>Max Products: <span className="font-medium">{Plan?.maxProducts}</span></li>
              <li>Max Offers: <span className="font-medium">{Plan?.maxOffers}</span></li>
              <li>Max Buyers: <span className="font-medium">{Plan?.maxBuyers}</span></li>
              <li>Trial Period: <span className="font-medium">{Plan?.trialDays} days</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 font-semibold mb-3">Included Features</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {Plan?.features?.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment + User info grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Payment Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p><span className="font-medium">Payment ID:</span> {planData.id}</p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`${
                  planData.status === "success" ? "text-green-600 font-semibold" : "text-red-600"
                }`}
              >
                {planData.status}
              </span>
            </p>
            <p><span className="font-medium">Method:</span> {planData.paymentMethod}</p>
            {/* <p><span className="font-medium">Transaction:</span> <span className="font-mono text-xs">{planData.transactionId}</span></p> */}
            <p><span className="font-medium">Amount Paid:</span> ₹{planData.amount} {planData.currency}</p>
            <p><span className="font-medium">Date:</span> {new Date(planData.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Info</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p><span className="font-medium">Name:</span> {User?.first_name} {User?.last_name}</p>
            <p><span className="font-medium">Email:</span> {User?.email}</p>
            <p><span className="font-medium">Business:</span> {User?.businessName || "—"}</p>
            <p><span className="font-medium">User ID:</span> <span className="font-mono text-xs">{User?.id}</span></p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} DNB Platform — Subscription Portal
      </div>
    </div>
  );
};

export default PlanPurchase;
