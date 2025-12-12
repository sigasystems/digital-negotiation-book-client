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
    const field = fields.find(f => f.name === name);
    
    // Handle number fields to prevent negative values
    if (field?.type === "number") {
      // Allow empty string or positive numbers
      if (value === "" || parseInt(value) >= 0) {
        setFilters((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberInput = useCallback((e) => {
    const { name, value } = e.target;
    
    // Prevent negative sign and allow only numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setFilters((prev) => ({ ...prev, [name]: numericValue }));
  }, []);

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
                    <label
                      htmlFor={`filter-${field.name}`}
                      className="block text-xs font-bold text-gray-700 tracking-wider mb-2 transition-colors duration-200 group-hover:text-[#16a34a]"
                    >
                      {field.label}
                    </label>
                    <div className="relative">
                      <select
                        id={`filter-${field.name}`}
                        name={field.name}
                        value={filters[field.name]}
                        onChange={handleChange}
                        className="w-full h-[44px] appearance-none bg-white border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#16a34a] focus:outline-none focus:ring-[#16a34a] focus:ring-opacity-50 focus:border-[#16a34a] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <option value="">
                          {field.placeholder || `All ${field.label.charAt(0).toLowerCase() + field.label.slice(1)}`}
                        </option>
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

              // For number fields, use a custom input handler
              if (field.type === "number") {
                return (
                  <div key={field.name} className="group">
                    <label
                      htmlFor={`filter-${field.name}`}
                      className="block text-xs font-bold text-gray-700 tracking-wider mb-2 transition-colors duration-200 group-hover:text-[#16a34a]"
                    >
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        id={`filter-${field.name}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name={field.name}
                        placeholder={field.placeholder || field.label}
                        value={filters[field.name]}
                        onChange={handleNumberInput}
                        onKeyDown={handleKeyDown}
                        className="w-full h-[44px] bg-white border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#16a34a] focus:outline-none focus:ring-[#16a34a] focus:ring-opacity-50 focus:border-[#16a34a] transition-all duration-200 shadow-sm hover:shadow-md"
                        min="0"
                      />
                      {field.suffix && (
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                          <span className="text-sm text-gray-500">
                            {field.suffix}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // For other field types (text, email, etc.)
              return (
                <div key={field.name} className="group">
                  <label
                    htmlFor={`filter-${field.name}`}
                    className="block text-xs font-bold text-gray-700 tracking-wider mb-2 transition-colors duration-200 group-hover:text-[#16a34a]"
                  >
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
                    className="h-[44px] rounded-xl border-2 border-gray-200 hover:border-[#16a34a] focus:ring-[#16a34a] focus:border-[#16a34a] transition-all shadow-sm hover:shadow-md px-4 text-sm font-medium"
                  />
                </div>
              );
            })}
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
              className="px-4 py-2 rounded-xl flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 active:scale-[0.98] shadow-sm hover:shadow-lg transition-all duration-200"
            >
              <XCircle
                className={`w-5 h-5 text-gray-500 hover:text-gray-600 transition-colors duration-200`}
              />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;