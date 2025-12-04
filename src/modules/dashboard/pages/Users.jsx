import React, { useState, useEffect, useCallback } from "react";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import DashboardTable from "../components/DashboardTable";
import { useNavigate } from "react-router-dom";

export default function Users({ userRole }) {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState({});
  const [filters, setFilters] = useState({});
  const [totalPages , setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);

  const userActions = ["view", "edit", "activate", "deactivate", "delete"];

  const fetchUsers = useCallback(async () => {
    try {
      const role =
        typeof userRole === "object" && userRole?.userRole
          ? userRole.userRole
          : userRole;

      let response;
      if (Object.keys(filters).length > 0) {
        response = await roleBasedDataService.search(role, {
          ...filters,
          page: pageIndex,
          limit: pageSize,
        });
      } else {
        response = await roleBasedDataService.getDashboardData(role, {
        pageIndex,
        pageSize,
      });
      }

      let rows = [];
      let items = 0;
      let pages = 1;
      if (response && response.data) {
        if (response.data.data && response.data.data.buyers) {
          rows = response.data.data.buyers || [];
          items = response.data.data.totalItems || 0;
          pages = response.data.data.totalPages || 1;
        }
        else if (response.data.buyers) {
          rows = response.data.buyers || [];
          items = response.data.totalItems || 0;
          pages = response.data.totalPages || 1;
        }
        else if (Array.isArray(response.data)) {
          rows = response.data || [];
          items = response.totalItems || response.data.length || 0;
          pages = response.totalPages || 1;
        }
        else {
          rows = response.data.rows || response.data.users || response.data.data || [];
          items = response.data.totalItems || response.data.total || rows.length || 0;
          pages = response.data.totalPages || Math.ceil(items / pageSize) || 1;
        }
      }

      setData(rows);
      setTotalItems(items);
      setTotalPages(pages);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setData([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setIsSearching(false);
      setIsPaginationLoading(false);
    }
  }, [userRole, filters, pageIndex, pageSize]);

  const handlePageChange = useCallback((newPageIndex) => {
    setIsPaginationLoading(true);
    setPageIndex(newPageIndex);
  }, []);

  const handleSearch = useCallback((searchFilters) => {
    setIsSearching(true);
    setFilters(searchFilters);
    setPageIndex(0);
  }, []);

  useEffect(() => {
    if (loading || isSearching) {
      fetchUsers();
    }
  }, [loading, isSearching, fetchUsers]);

  useEffect(() => {
    if (!loading && !isSearching) {
      fetchUsers();
    }
  }, [pageIndex, pageSize]);

  const showFullPageLoading = loading && !isSearching && pageIndex === 0;

  if (showFullPageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading users...</p>
        </div>
      </div>
    );
  }

  let searchFields = [];

  if (userRole === "business_owner") {
    searchFields = [
      { name: "country", label: "Country", type: "text", placeholder: "Enter country" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
      },
    ];
  }

  if (userRole === "super_admin") {
    searchFields = [
      { name: "first_name", label: "First Name", type: "text", placeholder: "Enter first name" },
      { name: "last_name", label: "Last Name", type: "text", placeholder: "Enter last name" },
      { name: "email", label: "Email", type: "text", placeholder: "Enter email" },
      { name: "businessName", label: "Business Name", type: "text", placeholder: "Enter business name" },
      { name: "phoneNumber", label: "Phone Number", type: "text", placeholder: "Enter phone number" },
      { name: "postalCode", label: "Postal Code", type: "text", placeholder: "Enter postal code" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
      },
    ];
  }

  const pageTitle = userRole === "super_admin" ? "All Business" : "All Buyers";

  return (
  <div className="w-full">
    <div className="px-4 sm:px-6 flex items-center justify-between flex-wrap gap-3">
      <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>

        <div className="mt-[24PX]">
          {userRole === "buyer" && (
            <button
              onClick={() => navigate("/add-business-owner")}
              className="button-styling"
            >
              Add Business Owner
            </button>
          )}

          {userRole === "business_owner" && (
            <button
              onClick={() => navigate("/add-buyer")}
              className="button-styling"
            >
              Add Buyer
            </button>
          )}
        </div>
    </div>

    <div className="rounded-lg overflow-hidden mx-[20px]">
        <DashboardTable
          data={data}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          fetchOwners={fetchUsers}
          userActions={userActions}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={handlePageChange}
          setPageSize={setPageSize}
          totalItems={totalItems}
          onSearch={handleSearch}
          searchFields={searchFields}
          isLoading={isPaginationLoading || loading || isSearching}
          isSearching={isSearching}
        />
    </div>
  </div>
);

}
