import React, { useState, useEffect, useMemo } from "react";
import { getAllBusinessOwners } from "../services/dashboardService";
import { MobileCard, Pagination } from "@/utils/Pagination";
import DashboardTable from "./DashboardTable";
import { ActionsCell } from "@/utils/ActionsCell";

export default function ResponsiveDashboard() {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState({});
  const [emailFilter, setEmailFilter] = useState("");

  const totalPages = Math.ceil(totalItems / pageSize);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await getAllBusinessOwners({ pageIndex, pageSize });
      const { data: rows, totalItems } = response.data;
      setData(rows);
      setTotalItems(totalItems);
    } catch (err) {
      console.error("Failed to fetch business owners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [pageIndex, pageSize]);

  const filteredData = useMemo(() => {
    if (!emailFilter) return data;
    return data.filter((item) =>
      item.email.toLowerCase().includes(emailFilter.toLowerCase())
    );
  }, [data, emailFilter]);

  const stats = [
    { label: "Total Users", value: 33, color: "text-indigo-600" },
    { label: "Active Users", value: 12, color: "text-green-600" },
    { label: "Inactive Users", value: 4, color: "text-gray-600" },
    { label: "Deleted Users", value: 17, color: "text-red-600" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-2">
          Welcome back! Here's an overview of your tenant.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white shadow-sm rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center"
          >
            <p className="text-gray-500 text-xs sm:text-sm">{stat.label}</p>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 ${stat.color}`}>
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* User Management Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="lg:hidden p-4 space-y-4">
          {data.length > 0 ? (
            data.map((item) => (
              <MobileCard
                key={item.id}
                item={item}
                isSelected={rowSelection[item.id]}
                onSelect={(checked) =>
                  setRowSelection((prev) => ({ ...prev, [item.id]: checked }))
                }
                actions={<ActionsCell row={{ original: item }} refreshData={fetchOwners} />}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm font-medium">No results found</p>
              <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <DashboardTable
            data={filteredData}
            pageIndex={pageIndex}
            pageSize={pageSize}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-4 sm:px-6">
          <Pagination
            pageIndex={pageIndex}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </div>
  );
}
