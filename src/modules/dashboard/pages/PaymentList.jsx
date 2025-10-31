"use client";
import React, { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  CreditCard,
  Search,
} from "lucide-react";
import dashboardService from "../services/dashboardService";
import { Pagination } from "@/utils/Pagination";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getAllPayments({
        pageIndex: pageIndex + 1, // backend is 1-based
        pageSize,
        status: statusFilter,
        search,
      });

      const data = res?.data?.data || {};
      setPayments(data.payments || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [pageIndex, pageSize, statusFilter]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" /> Payment Management
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, email, plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchPayments()}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          <button
            onClick={() => {
              setPageIndex(0);
              fetchPayments();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
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
                <th className="p-3 border-b">User Info</th>
                <th className="p-3 border-b">Plan Details</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Method</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Transaction ID</th>
                <th className="p-3 border-b">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => {
                const isTrial = p.amount === 0;
                return (
                  <tr
                    key={p.id || idx}
                    className={`hover:bg-gray-50 transition-colors ${
                      isTrial ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td className="p-3 border-b text-gray-600">
                      {pageIndex * pageSize + idx + 1}
                    </td>
                    <td className="p-3 border-b text-gray-900">
                      <div className="font-medium">
                        {p.User
                          ? `${p.User.first_name} ${p.User.last_name}`
                          : "Unknown User"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {p.User?.email || "No email"}
                      </div>
                    </td>
                    <td className="p-3 border-b text-gray-800">
                      <div className="font-semibold">
                        {p.Plan?.name || (isTrial ? "Trial Plan" : "—")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {p.Plan?.billingCycle || (isTrial ? "Trial Period" : "N/A")}
                      </div>
                    </td>
                    <td
                      className={`p-3 border-b font-medium ${
                        isTrial ? "text-amber-600" : "text-gray-900"
                      }`}
                    >
                      {isTrial ? "Trial Plan" : `₹${p.amount}`}
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
                    <td className="p-3 border-b text-gray-700">
                      {p.paymentMethod || (isTrial ? "Trial Access" : "—")}
                    </td>
                    <td className="p-3 border-b text-gray-600">
                      {new Date(p.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="p-3 border-b text-gray-600 text-xs font-mono">
                      {p.transactionId || (isTrial ? "Trial Session" : "—")}
                    </td>
                    <td className="p-3 border-b">
                      {p.invoicePdf ? (
                        <a
                          href={p.invoicePdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          {isTrial ? "N/A" : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
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
          onPageChange={(page) => setPageIndex(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPageIndex(0);
          }}
        />
      )}
    </div>
  );
};

export default PaymentList;
