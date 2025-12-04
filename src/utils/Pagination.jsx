// src/utils/Pagination.jsx
import React from "react";
import { ChevronDown  } from "lucide-react";

/**
 * Pagination (named export)
 */
export const Pagination = ({
  pageIndex,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const getPageNumbers = (current, total) => {
    if (total <= 1) return [0];
    const delta = 1;
    const range = [];
    const left = Math.max(0, current - delta);
    const right = Math.min(total - 1, current + delta);

    for (let i = left; i <= right; i++) range.push(i);

    if (left > 1) range.unshift("...");
    if (left > 0) range.unshift(0);
    if (right < total - 2) range.push("...");
    if (right < total - 1) range.push(total - 1);

    return range.filter((p, idx, arr) => idx === 0 || p !== "..." || arr[idx - 1] !== "...");
  };

  const pages = getPageNumbers(pageIndex, totalPages || 1);

  const handlePageClick = (page) => {
    if (!isLoading) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2 w-full">
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm text-gray-700 font-medium">
          Rows per page:
        </span>
      <div className="relative inline-block">
        <select
          value={pageSize}
          onChange={(e) => !isLoading && onPageSizeChange(Number(e.target.value))}
            disabled={isLoading}
          className={`appearance-none border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-xs sm:text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
              isLoading ? "text-gray-400" : "text-gray-700"
            }`}
        />
      </div>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 w-full sm:w-auto ml-auto">

      <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-right">
        Page <span className="font-semibold text-gray-900">{pageIndex + 1}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1 justify-end">
        <button
          disabled={pageIndex <= 0 || totalPages <= 1 || isLoading}
          onClick={() => handlePageClick(pageIndex - 1)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-normal transition-all ${
            pageIndex <= 0 || totalPages <= 1 || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
          }`}
        >
          Prev
        </button>

        <div className="hidden sm:flex items-center gap-1 mx-1">
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="px-2 text-gray-400 text-sm">
                ...
              </span>
            ) : (
              <button
                key={idx}
                  onClick={() => handlePageClick(p)}
                  disabled={isLoading || p === pageIndex}
                className={`min-w-[36px] sm:min-w-[40px] h-8 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                  } ${
                  p === pageIndex
                    ? "button-styling"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95"
                }`}
              >
                {p + 1}
              </button>
            )
          )}
        </div>

        <div className="sm:hidden px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
          {pageIndex + 1}/{totalPages}
        </div>

        <button
          disabled={pageIndex >= totalPages - 1 || totalPages <= 1 || isLoading}
          onClick={() => handlePageClick(pageIndex + 1)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-normal transition-all ${
            pageIndex >= totalPages - 1 || totalPages <= 1 || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
          }`}
        >
          Next
        </button>
      </div>
      </div>
    </div>
  );
};