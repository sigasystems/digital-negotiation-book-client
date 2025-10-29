import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PlanPurchase = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  // example: /plan-purchase?planId=123
  const planId = searchParams.get("planId");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        if (!planId) {
          setError("No payment id found");
          setLoading(false);
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/${planId}`);
        if (!res.ok) throw new Error("Failed to fetch plan details");

        const data = await res.json();
        setPlan(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  if (loading) return <div className="p-6 text-gray-600">Loading your plan details...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!plan) return <div className="p-6 text-gray-600">No plan found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Your Purchased Plan</h1>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <p className="text-lg font-medium text-gray-800">{plan.name}</p>
        <p className="text-gray-500">{plan.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-700">Duration:</span>
          <span className="font-semibold">{plan.duration}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Price:</span>
          <span className="font-semibold text-green-600">₹{plan.price}</span>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Plan ID: <span className="font-mono">{plan.id}</span>
      </div>
    </div>
  );
};

export default PlanPurchase;
