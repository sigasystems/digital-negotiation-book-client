// src/modules/offerDraft/components/ReadOnlyField.jsx
import React from "react";

const ReadOnlyField = ({ label, value, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        value={value || ""}
        readOnly
        placeholder={placeholder || "N/A"}
        className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 cursor-not-allowed"
      />
    </div>
  );
};

export default ReadOnlyField;
