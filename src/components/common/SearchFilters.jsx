import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, XCircle } from "lucide-react";

export const SearchFilters = ({ fields = [], onSearch }) => {
  const initialState = useMemo(
    () => fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {}),
    [fields]
  );

  const [filters, setFilters] = useState(initialState);

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
    onSearch?.({}); // triggers a fetch without filters
  };

  return (
    <div className="w-full shadow-sm border border-gray-200 p-6">
      <div className="flex flex-wrap items-end gap-4">
      {fields.map((field) => {
        if (field.type === "select") {
          return (
              <div key={field.name} className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
            <select
              name={field.name}
              value={filters[field.name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
            >
              <option value="">{field.placeholder || `All ${field.label}`}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
              </div>
          );
        }

        return (
            <div key={field.name} className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
          <Input
            type={field.type || "text"}
            name={field.name}
            placeholder={field.placeholder || field.label}
            value={filters[field.name]}
            onChange={handleChange}
                className="rounded-lg border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
            </div>
        );
      })}

    <div className="flex items-center gap-3">
      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer"
      >
        <Search className="w-4 h-4" />
        Search
      </button>

      <button
        onClick={handleReset}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer"
      >
        <XCircle className="w-4 h-4" />
        Clear All
      </button>
    </div>
  </div>
    </div>
  );
};
