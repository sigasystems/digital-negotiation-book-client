import React, { useState, useMemo, useCallback } from "react";
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

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const query = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== "" && val !== undefined) query[key] = val;
    });
    onSearch?.(query);
  }, [filters, onSearch]);

  const handleReset = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    setFilters(initialState);
    onSearch?.({});
  }, [initialState, onSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSearchSubmit(e);
    }
  }, [handleSearchSubmit]);

  const hasActiveFilters = Object.values(filters).some(val => val !== "" && val !== undefined);

  return (
    <div className="w-full">
   
        <div className="flex items-center justify-between mb-4 md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-200 shadow-sm"
        >
          <Filter className="w-4 h-4" />
          {isMobileOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div
        className={`${
          isMobileOpen ? "block" : "hidden md:block"
        } transition-all duration-300 ease-in-out`}
      >
        <div onKeyDown={handleKeyDown} className="pb-4 space-y-6">
          {/* Filter Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {fields.map((field) => {
        if (field.type === "select") {
          return (
              <div key={field.name} className="group">
                <label  htmlFor={`filter-${field.name}`} className="block text-xs font-bold text-gray-700 tracking-wider mb-1 transition-colors duration-200 group-hover:text-[#16a34a]">
                  {field.label}
                </label>
                  <div className="relative">
            <select
                        id={`filter-${field.name}`}
              name={field.name}
              value={filters[field.name]}
              onChange={handleChange}
              className="w-full h-[44px] appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#16a34a] focus:outline-none focus:ring-4 focus:ring-[#16a34a] focus:border-[#16a34a] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              <option value="">{field.placeholder || `All ${field.label}`}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                        <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-[#16a34a] transition-colors duration-200" />
                    </div>
                  </div>
              </div>
          );
        }

        return (
            <div key={field.name} className="group">
              <label htmlFor={`filter-${field.name}`} className="block text-xs font-bold text-gray-700 tracking-wider mb-1 transition-colors duration-200 group-hover:text-[#16a34a]">
                {field.label}
              </label>
          <Input
                    id={`filter-${field.name}`}
            type={field.type || "text"}
            name={field.name}
            placeholder={field.placeholder || field.label}
            value={filters[field.name]}
            onChange={handleChange}
                    onKeyDown={handleKeyDown}
                className="h-[44px] rounded-xl border-2 border-gray-200 hover:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a] focus:border-[#16a34a] transition-all duration-200 shadow-sm hover:shadow-md px-4 text-sm font-medium"
          />
            </div>
        )      })}
        </div>

        {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <button
              type="button"
        onClick={handleSearchSubmit}
        className="flex items-center justify-center gap-2.5 button-styling"
      >
        <Search className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Search Results</span>
      </button>

      <button
          type="button"
        onClick={handleReset}
        className="px-4 py-2 rounded-xl flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 active:scale-[0.98] shadow-md hover:shadow-lg transition-all duration-200"
      >
        <XCircle className={`w-5 h-5 text-gray-500 hover:text-gray-600 transition-colors duration-200`} />
            <span>Reset</span>
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

    </div>

  );
};

export default SearchFilters;