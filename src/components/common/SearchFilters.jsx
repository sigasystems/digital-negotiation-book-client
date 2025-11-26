import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, XCircle, Filter, ChevronDown } from "lucide-react";

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

  const hasActiveFilters = Object.values(filters).some(val => val !== "" && val !== undefined);

  return (
   
    <>
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Search Filters</h3>
              <p className="text-xs text-gray-500 mt-0.5">Refine your search results</p>
            </div>
          </div>
          

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-200 shadow-sm"
        >
          <Filter className="w-4 h-4" />
          {isMobileOpen ? "Hide" : "Show"}
        </button>
        </div>
      </div>

      <div
        className={`${
          isMobileOpen ? "block" : "hidden md:block"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="p-6 space-y-6">
          {/* Filter Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {fields.map((field) => {
        if (field.type === "select") {
          return (
              <div key={field.name} className="group">
                <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2.5 transition-colors duration-200 group-hover:text-blue-600">
                  {field.label}
                </label>
                  <div className="relative">
            <select
              name={field.name}
              value={filters[field.name]}
              onChange={handleChange}
              className="w-full h-[44px] appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              <option value="">{field.placeholder || `All ${field.label}`}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                        <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                    </div>
                  </div>
              </div>
          );
        }

        return (
            <div key={field.name} className="group">
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2.5 transition-colors duration-200 group-hover:text-blue-600">
                {field.label}
              </label>
          <Input
            type={field.type || "text"}
            name={field.name}
            placeholder={field.placeholder || field.label}
            value={filters[field.name]}
            onChange={handleChange}
                className="h-[44px] rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md px-4 text-sm font-medium"
          />
            </div>
        )      })}
        </div>

        {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-100">
      <button
        onClick={handleSearch}
        className="group relative flex-1 sm:flex-none bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
      >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <Search className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Search Results</span>
      </button>

      <button
        onClick={handleReset}
        className={`group relative flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer border-2 transform hover:scale-[1.02] active:scale-[0.98]bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
              }`}
      >
        <XCircle className={`w-5 h-5 transition-colors duration-200 ${hasActiveFilters ? "group-hover:text-red-500" : ""}`} />
            <span>Clear All</span>
      </button>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">
                {Object.values(filters).filter(v => v !== "" && v !== undefined).length} filter(s) active
              </span>
            </div>
          )}
    </div>
  </div>

    </>

  );
};

export default SearchFilters;