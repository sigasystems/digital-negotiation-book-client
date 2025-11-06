import React, { useState, useEffect, useMemo } from "react";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import { MobileCard } from "@/utils/Pagination";
import DashboardTable from "./DashboardTable";
import { useReloadOncePerSession } from "@/hooks/useReloadOncePerSession";

export default function ResponsiveDashboard() {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState({});
  const [emailFilter] = useState("");
   const [totalPages, setTotalPages] = useState(1);
   const [activeUsers, setActiveUsers] = useState(0)
   const [inactiveUsers, setInactiveUsers] = useState(0)
   const [deletedUsers, setDeletedUsers] = useState(0)

  const user = sessionStorage.getItem("user");
  const userRole = JSON.parse(user)?.userRole || "guest";
  const userActions = [];

  useReloadOncePerSession("landingPageReloaded");
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await roleBasedDataService.getDashboardData(userRole, {
        pageIndex,
        pageSize,
      });

      const {
        data: fetchedData,
        totalItems,
        totalPages,
        totalDeleted,
        totalInactive,
        totalActive,
      } = response || {};

      setData(fetchedData || []);
      setTotalItems(totalItems || 0);
      setTotalPages(totalPages || 1);
      setActiveUsers(totalActive || 0);
      setInactiveUsers(totalInactive || 0);
      setDeletedUsers(totalDeleted || 0);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setData([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, userRole]);

  // Filter by email
  const filteredData = useMemo(() => {
    if (!emailFilter) return data;
    return data.filter((item) =>
      (item.email || item.contactEmail)
        ?.toLowerCase()
        .includes(emailFilter.toLowerCase())
    );
  }, [data, emailFilter]);

  const tableData = filteredData?.map((item) => ({
    id: item.id,
    name:
      `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
      item.contactName,
    email: item.email || item.contactEmail,
    status: item.status,
    businessName:
      item.businessName || item.companyName || item.buyersCompanyName || "-",
  }));

  // 🔹 Determine label based on role
  const userLabel =
    userRole === "super_admin"
      ? "Businesses"
      : userRole === "business_owner"
      ? "Buyers"
      : "Users";

  // 🔹 Stats (remove deleted for both roles)
  const stats = [
    { label: `Total ${userLabel}`, value: totalItems, color: "text-indigo-600" },
    { label: `Active ${userLabel}`, value: activeUsers, color: "text-green-600" },
    { label: `Inactive ${userLabel}`, value: inactiveUsers, color: "text-gray-700" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading dashboard...</p>
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
          Welcome back! Here's an overview of your {userLabel.toLowerCase()}.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`bg-white shadow-sm rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center w-full
              ${i === 2 ? 'col-span-2 md:col-span-1 justify-self-center sm:justify-self-stretch' : ''}`}
          >
            <p className="text-gray-800 text-xs sm:text-sm font-medium">{stat.label}</p>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 ${stat.color}`}
            >
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* User/Business/Buyer Management Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Mobile cards */}
        <div className="lg:hidden p-4 space-y-4">
          {tableData.length > 0 ? (
            tableData.map((item) => (
              <MobileCard
                key={item.id}
                item={item}
                isSelected={rowSelection[item.id]}
                onSelect={(checked) =>
                  setRowSelection((prev) => ({ ...prev, [item.id]: checked }))
                }
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm font-medium">No {userLabel.toLowerCase()} found</p>
              <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block">
          <DashboardTable
            data={tableData}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            fetchOwners={fetchData}
            userActions={userActions}
            filterKey="email"
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            totalItems={totalItems}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}
