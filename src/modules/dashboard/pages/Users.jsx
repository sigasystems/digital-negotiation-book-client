// Users.jsx
import React, { useState, useEffect } from "react";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import DashboardTable from "../components/DashboardTable";

export default function Users({ userRole }) {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState({});
  const [filters, setFilters] = useState({});
  const [totalPages , setTotalPages] = useState(1);

  const userActions = ["view", "edit", "activate", "deactivate", "delete"];

  const fetchUsers = async () => {
    setLoading(true);
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

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    setPageIndex(0);
  };

  useEffect(() => {
    fetchUsers();
  }, [pageIndex, pageSize, filters]);

  if (loading) {
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
          { value: "", label: "All" },
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
          { value: "", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
      },
    ];
  }

  return (
  <div className="w-full px-4">
    <div className="px-5">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        {userRole === "super_admin" ? "All Business Owners" : "All Buyers"}
      </h1>
    </div>

    <div className=" rounded-lg overflow-hidden">
      {/* Table visible on all screens */}
      <div className="p-4">
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
          onSearch={handleSearch}
          searchFields={searchFields}
        />
      </div>
    </div>
  </div>
);

}
