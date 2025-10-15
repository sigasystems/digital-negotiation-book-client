// Users.jsx
import React, { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import { MobileCard, Pagination } from "@/utils/Pagination";
import DashboardTable from "../components/DashboardTable";
import { ActionsCell } from "@/utils/ActionsCell";

export default function Users() {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState({});
  const [emailFilter, setEmailFilter] = useState("");

  const userActions = ["view", "edit", "activate", "deactivate", "delete"];

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getAllBusinessOwners({ pageIndex, pageSize });
      const { data: rows, totalItems } = response.data.data;
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">All Business Owners</h1>
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
                    refreshData={fetchOwners}
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
            fetchOwners={fetchOwners}
            userActions={userActions}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            emailFilter={emailFilter}
            setEmailFilter={setEmailFilter}
            totalItems={totalItems}
          />
        </div>

        <div className="border-t border-gray-200 px-4 sm:px-6">
          <Pagination
            pageIndex={pageIndex}
            totalPages={Math.ceil(totalItems / pageSize)}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </div>
  );
}
