import React from "react";
import { Search, Filter } from "lucide-react";
import DashboardTable from "../components/DashboardTable";

const Users = () => {
  const stats = [
    { label: "Total Users", value: 33, color: "text-indigo-600" },
    { label: "Active Users", value: 12, color: "text-green-600" },
    { label: "Inactive Users", value: 4, color: "text-gray-600" },
    { label: "Deleted Users", value: 17, color: "text-red-600" },
  ];

  const users = [
    { name: "qwer3", email: "qwer3@gmail.com", status: "DELETED" },
    { name: "cha", email: "cha@gmail.com", status: "DELETED" },
    { name: "kranti", email: "kranti@sigasystems.com", status: "ACTIVE" },
    { name: "UserPune", email: "UserPune@gmail.com", status: "DELETED" },
  ];

  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-6 md:p-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Welcome back! Here’s a complete overview of your tenant.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white shadow rounded-xl p-6 flex flex-col items-center justify-center text-center"
          >
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <h2 className={`text-3xl font-bold mt-2 ${stat.color}`}>
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* User Management Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          User Management
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="flex items-center w-full sm:w-1/2 border border-gray-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full outline-none text-sm"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
            <Filter className="w-4 h-4" />
            All
          </button>
        </div>

        {/* Table */}
        <DashboardTable />
      </div>
    </div>
  );
};

export default Users;
