// Users.jsx
import React, { useState, useEffect } from "react";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import { MobileCard, Pagination } from "@/utils/Pagination";
import DashboardTable from "../components/DashboardTable";
import { ActionsCell } from "@/utils/ActionsCell";

export default function Users({ userRole }) {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState({});
  const [emailFilter, setEmailFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const userActions = ["view", "edit", "activate", "deactivate", "delete"];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const role =
        typeof userRole === "object" && userRole?.userRole
          ? userRole.userRole
          : userRole;

      const response = await roleBasedDataService.getDashboardData(role, {
        pageIndex,
        pageSize,
        filter: emailFilter,
      });

    const { data: rows, totalItems, totalPages } = response || {};

    setData(rows || []);
      setTotalItems(totalItems || 0);
      setTotalPages(totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setData([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageIndex, pageSize, emailFilter]);

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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {userRole === "super_admin"
            ? "All Business Owners"
            : "All Buyers"}
        </h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Mobile view */}
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
                actions={
                  <ActionsCell
                    row={{ original: item }}
                    refreshData={fetchUsers}
                    userActions={userActions}
                  />
                }
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm font-medium">No results found</p>
              <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Desktop view */}
        <div className="hidden lg:block">
          <DashboardTable
            data={data}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            fetchOwners={fetchUsers}
            userActions={userActions}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            totalItems={totalItems}
          />
        </div>
      </div>
    </div>
  );
}
