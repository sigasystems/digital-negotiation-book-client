import React, { useState } from "react";
import { Input } from "@/components/ui/input";

export const SearchFilters = ({ fields = [], onSearch }) => {
  const initialState = fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});
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

  return (
    <div className="mb-4 grid grid-cols-5 gap-3 items-end">
      {fields.map((field) => {
        if (field.type === "select") {
          return (
            <select
              key={field.name}
              name={field.name}
              value={filters[field.name]}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{field.placeholder || `All ${field.label}`}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        }

        return (
          <Input
            key={field.name}
            type={field.type || "text"}
            name={field.name}
            placeholder={field.placeholder || field.label}
            value={filters[field.name]}
            onChange={handleChange}
          />
        );
      })}

      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
      >
        Search
      </button>
    </div>
  );
};
