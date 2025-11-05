import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  CreditCard,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import dashboardService from "../services/dashboardService";
import { usePagination } from "@/app/hooks/usePagination";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const { pageIndex, pageSize, totalPages, setPageIndex } = usePagination({
    totalItems,
    initialPageSize: 6,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getAllPayments({
          pageIndex: pageIndex + 1,
          pageSize,
        });

        const data = res?.data?.data;
        setPayments(data?.payments || []);
        setTotalItems(data?.totalCount || data?.payments?.length || 0);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [pageIndex, pageSize]);

  const getStatusBadge = (status) => {
    const color =
      status === "success"
        ? "bg-green-100 text-green-800"
        : status === "failed"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800";

    return (
      <Badge className={`${color} capitalize px-3 py-1 rounded-full text-xs`}>
        {status}
      </Badge>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );

  if (payments.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
        <CreditCard className="h-12 w-12 mb-3 text-gray-400" />
        <p>No payments found</p>
      </div>
    );

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-800">
          Payment History
        </h2>
        <span className="text-sm text-gray-500">
          Showing {pageIndex * pageSize + 1}-
          {Math.min((pageIndex + 1) * pageSize, totalItems)} of {totalItems}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {payments.map((payment) => (
          <Card
            key={payment.id}
            className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl"
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800">
                  {payment?.Plan?.name || "N/A"}
                </span>
                {getStatusBadge(payment?.status)}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-gray-600">
              <Separator />
              <div className="grid grid-cols-2 gap-y-2">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium text-gray-900 text-right">
                  ₹{payment.amount}
                </span>

                <span className="text-gray-500">Plan Type:</span>
                <span className="text-right">
                  {payment?.Plan?.billingCycle || "-"}
                </span>

                <span className="text-gray-500">Currency:</span>
                <span className="text-right">{payment.currency}</span>

                <span className="text-gray-500">Transaction ID:</span>
                <span
                  className="text-right truncate max-w-[150px]"
                  title={payment.transactionId}
                >
                  {payment.transactionId}
                </span>

                <span className="text-gray-500">Date:</span>
                <span className="text-right">
                  {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center pt-3">
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-medium text-gray-800">
                    {payment?.User?.first_name} {payment?.User?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {payment?.User?.email}
                  </p>
                </div>
                {payment?.status === "success" ? (
                  <CheckCircle2 className="text-green-500 h-6 w-6" />
                ) : (
                  <XCircle className="text-red-500 h-6 w-6" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-800 disabled:opacity-40 cursor-pointer"
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>

        <span className="text-sm text-gray-700">
          Page {pageIndex + 1} of {totalPages || 1}
        </span>

        <button
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-800 disabled:opacity-40 cursor-pointer"
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={pageIndex + 1 >= totalPages}
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PaymentList;
