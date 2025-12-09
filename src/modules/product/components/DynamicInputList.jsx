import React, { memo, useState } from "react";
import { Plus, X } from "lucide-react";

const DynamicInputList = memo(({ label, items, onChange, onAdd, onRemove, requiredFirst = true }) => {
  const [touched, setTouched] = useState({});

  const handleBlur = (i) => setTouched((prev) => ({ ...prev, [i]: true }));

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{label}</h3>
      </div>

      {items.map((val, i) => {
        const showError = requiredFirst && i === 0 && touched[i] && !val.trim();
        return (
          <div key={i} className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <input
              type="text"
              value={val}
              onChange={(e) => onChange(i, e.target.value)}
              onBlur={() => handleBlur(i)}
              placeholder={`${label} ${i + 1}`}
              required={requiredFirst && i === 0}
              className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 outline-none bg-gray-50 hover:bg-white transition-all ${
                showError
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-red-500 hover:text-red-700 transition-all cursor-pointer p-1.5 sm:p-2 hover:bg-red-50 rounded-lg"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={onAdd}
        className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm bg-indigo-50 text-black rounded-lg hover:bg-indigo-100 transition-all font-medium flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus size={14} className="sm:w-4 sm:h-4" />
        Add Another {label}
      </button>
    </div>
  );
});

export default DynamicInputList;
