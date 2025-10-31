"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, CreditCard } from "lucide-react";
import dashboardService from "../services/dashboardService";
import { Pagination } from "@/utils/Pagination";


const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getAllPayments();
      const data = res?.data?.data;

      // Adjust if your API returns an array directly
      const fetched = data?.payments || [];
      setPayments(fetched);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" />
          Payment Management
        </h2>
      </div>

      {/* Loader / Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : payments.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No payments found.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
              <tr>
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">User</th>
                <th className="p-3 border-b">Plan</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Method</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr key={p.id || idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border-b text-gray-600">{idx + 1}</td>
                  <td className="p-3 border-b text-gray-900">
                    <div className="font-medium">
                      {p.User
                        ? `${p.User.first_name} ${p.User.last_name}`
                        : "Unknown User"}
                    </div>
                    <div className="text-xs text-gray-500">{p.User?.email || "—"}</div>
                  </td>
                  <td className="p-3 border-b text-gray-800">
                    <div className="font-semibold">{p.Plan?.name || "—"}</div>
                    <div className="text-xs text-gray-500">{p.Plan?.billingCycle || "—"}</div>
                  </td>
                  <td className="p-3 border-b font-medium text-gray-900">
                    ₹{p.amount ?? 0}
                  </td>
                  <td className="p-3 border-b">
                    {p.status === "success" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Success
                      </span>
                    ) : p.status === "failed" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        <XCircle className="w-3 h-3" /> Failed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3 border-b text-gray-700">{p.paymentMethod || "—"}</td>
                  <td className="p-3 border-b text-gray-600">
                    {new Date(p.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="p-3 border-b text-xs font-mono text-gray-600">
                    {p.transactionId || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {payments.length > 0 && (
        <Pagination
          pageIndex={pageIndex}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
};

export default PaymentList;
