import React, { useEffect, useState } from "react";
import dashboardService from "../services/dashboardService";
import { Loader2 } from "lucide-react";
import DashboardTable from "../components/DashboardTable";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [rowSelection, setRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    transactionId: "",
    status: "",
    currency: "",
    planName: "",
  });

  // Fetch payments from API
  const fetchPayments = async (extraFilters = {}) => {
    try {
      setLoading(true);
      const res = await dashboardService.getAllPayments({
        pageIndex: pageIndex + 1,
        pageSize,
        ...extraFilters,
      });

      const data = res?.data?.data;
      setPayments(data?.payments || []);
      setTotalItems(data?.totalCount || data?.payments?.length || 0);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(filters);
  }, [pageIndex, pageSize]);

  // Handle search input
  const handleInputChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Trigger search
  const handleSearch = () => {
    setPageIndex(0);
    fetchPayments(filters);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Payment History
        </h2>
        <span className="text-sm text-gray-500">
          Total Records: {totalItems}
        </span>
      </div>

      {/* Search Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: "transactionId", label: "Transaction ID", placeholder: "Enter transaction ID" },
            { key: "status", label: "Status", placeholder: "success / failed / pending" },
            { key: "currency", label: "Currency", placeholder: "INR / USD" },
            { key: "planName", label: "Plan Name", placeholder: "Enter plan name" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={filters[field.key]}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <DashboardTable
        data={payments}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        fetchOwners={() => fetchPayments(filters)}
        userActions={[]}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalItems={totalItems}
        onSearch={handleSearch}
        searchFields={[]} // disable old internal SearchFilters
      />
    </div>
  );
};

export default PaymentList;
