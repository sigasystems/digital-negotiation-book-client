import React, { useState, useEffect, useMemo } from "react";
import { BarChart3, TrendingUp, Users, Activity, Search } from "lucide-react";
import { useReloadOncePerSession } from "@/hooks/useReloadOncePerSession";
import DashboardTable from "./DashboardTable";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import { useQuery } from "@tanstack/react-query";

// Mock service (replace with your actual service)

const MobileCard = ({ item }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 ">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{item.email}</p>
      </div>
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === "active"
            ? "bg-green-100 text-green-700"
            : item.status === "inactive"
              ? "bg-gray-100 text-gray-700"
              : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {item.status}
      </span>
    </div>
    <div className="text-sm text-gray-600">
      <p>
        <span className="font-medium">Business:</span> {item.businessName}
      </p>
    </div>
  </div>
);

export default function ResponsiveDashboard() {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState({});
  const [emailFilter, setEmailFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [deletedUsers, setDeletedUsers] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);
  const [revenueGrowth, setRevenueGrowth] = useState(0);
  const [userGrowth, setUserGrowth] = useState(0);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userRole = user?.userRole || "guest";
  const userActions = [];

  useReloadOncePerSession("landingPageReloaded");

  const { data: dashboardResponse, isLoading } = useQuery({
    queryKey: ["dashboardData", userRole, pageIndex, pageSize],
    queryFn: () =>
      roleBasedDataService.getDashboardData(userRole, { pageIndex, pageSize }),
  });

  useEffect(() => {
    if (!dashboardResponse) return;

    const {
      data: fetchedData,
      totalItems,
      totalPages,
      totalDeleted,
      totalInactive,
      totalActive,
      totalPending,
      revenueGrowth,
      userGrowth,
    } = dashboardResponse;

    setData(fetchedData || []);
    setTotalItems(totalItems || 0);
    setTotalPages(totalPages || 1);
    setActiveUsers(totalActive || 0);
    setInactiveUsers(totalInactive || 0);
    setDeletedUsers(totalDeleted || 0);
    setPendingUsers(totalPending || 0);
    setRevenueGrowth(revenueGrowth || 0);
    setUserGrowth(userGrowth || 0);
  }, [dashboardResponse]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const filteredData = useMemo(() => {
    if (!emailFilter) return data;
    return data.filter((item) =>
      (item.email || item.contactEmail)
        ?.toLowerCase()
        .includes(emailFilter.toLowerCase()),
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

  const userLabel =
    userRole === "super_admin"
      ? "Businesses"
      : userRole === "business_owner"
        ? "Buyers"
        : "Users";

  const stats = [
    {
      label: `Total ${userLabel}`,
      value: totalItems,
      color: "bg-orange-200",
      icon: Users,
      changeType: "positive",
    },
    {
      label: `Active ${userLabel}`,
      value: activeUsers,
      color: "bg-green-200",
      icon: Activity,
      changeType: "positive",
    },
    {
      label: `Pending Approvals`,
      value: pendingUsers,
      color: "bg-yellow-200",
      icon: TrendingUp,
      changeType: "positive",
    },
    {
      label: `Inactive ${userLabel}`,
      value: inactiveUsers,
      color: "bg-red-200",
      icon: BarChart3,
      changeType: "negative",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-gray-700 font-medium mt-4">
            Loading your dashboard...
          </p>
          <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className=" mx-auto px-4 sm:px-2 lg:px-[23px] py-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border-2 border-gray-300 shadow-md  overflow-hidden group"
              >
                <div className={`${stat.color} p-4 sm:p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-black mb-1">
                    {stat.value?.toLocaleString() || 0}
                  </h3>
                  <p className="text-black/90 text-sm font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden p-4">
          <div className="py-2 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {userLabel}
              </h3>
            </div>
          </div>
          <div className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden"></div>
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
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">
                  No {userLabel.toLowerCase()} found
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block">
            <DashboardTable
              data={tableData}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              // fetchOwners={fetchData}
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

        {/* Activity Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New user registered
                    </p>
                    <p className="text-xs text-gray-500">
                      {i} hour{i > 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Growth Rate
              </h3>
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">User Growth</span>
                  <span className="font-semibold text-green-600">
                    +{userGrowth}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${userGrowth * 5}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Revenue Growth</span>
                  <span className="font-semibold text-indigo-600">
                    +{revenueGrowth}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${revenueGrowth * 5}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Stats
              </h3>
              <Activity className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-sm font-semibold text-gray-900">
                  24.8%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Session Time</span>
                <span className="text-sm font-semibold text-gray-900">
                  4m 32s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <span className="text-sm font-semibold text-gray-900">
                  32.5%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
