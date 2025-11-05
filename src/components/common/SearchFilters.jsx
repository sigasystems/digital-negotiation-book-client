import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, XCircle, Filter } from "lucide-react";

export const SearchFilters = ({ fields = [], onSearch }) => {
  const initialState = useMemo(
    () => fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {}),
    [fields]
  );

  const [filters, setFilters] = useState(initialState);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const query = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== "" && val !== undefined) query[key] = val;
    });
    onSearch?.(query);
  };

  const handleReset = () => {
    setFilters(initialState);
    onSearch?.({});
  };

  return (
    <div className="w-full rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-4 bg-white">
      <div className="md:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 active:scale-[0.98] transition"
        >
          <Filter className="w-4 h-4 text-gray-600" />
          {isMobileOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div
        className={`space-y-4 ${
          isMobileOpen ? "block" : "hidden md:block"
        } transition-all duration-200`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {fields.map((field) => {
        if (field.type === "select") {
          return (
              <div key={field.name} className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700 tracking-wide">
                  {field.label}
                </label>
                  <div className="relative">
            <select
              name={field.name}
              value={filters[field.name]}
              onChange={handleChange}
              className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-[0.413rem] text-sm bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              <option value="">{field.placeholder || `All ${field.label}`}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
              </div>
          );
        }

        return (
            <div key={field.name} className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-gray-700 tracking-wide">
                {field.label}
              </label>
          <Input
            type={field.type || "text"}
            name={field.name}
            placeholder={field.placeholder || field.label}
            value={filters[field.name]}
            onChange={handleChange}
                className="rounded-xl border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md py-3"
          />
            </div>
        )      })}
        </div>

        {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
      <button
        onClick={handleSearch}
        className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transform hover:scale-105"
      >
        <Search className="w-5 h-5" />
            <span>Search</span>
      </button>

      <button
        onClick={handleReset}
        className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer border border-gray-200 hover:border-gray-300 transform hover:scale-105"
      >
        <XCircle className="w-5 h-5" />
            <span>Clear All</span>
      </button>
    </div>
  </div>
    </div>
  );
};
