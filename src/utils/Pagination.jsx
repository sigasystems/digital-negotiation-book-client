export const Pagination = ({ pageIndex, totalPages, pageSize, onPageChange, onPageSizeChange }) => {
  const getPageNumbers = (current, total) => {
    if (total <= 1) return [0];
    const delta = 2;
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

 return (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
    {/* Rows per page selector */}
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 font-medium">Rows per page:</span>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
      >
        {[10, 20, 50].map((size) => (
          <option key={size} value={size} className="cursor-pointer">{size}</option>
        ))}
      </select>
    </div>

    {/* Page info - hidden on mobile, shown on larger screens */}
    <div className="hidden sm:block text-sm text-gray-600">
      Page <span className="font-semibold text-gray-900">{pageIndex + 1}</span> of{" "}
      <span className="font-semibold text-gray-900">{totalPages}</span>
    </div>

    {/* Pagination buttons */}
    <div className="flex items-center gap-1">
      <button
        disabled={pageIndex <= 0 || totalPages <= 1}
        onClick={() => onPageChange(pageIndex - 1)}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
          ${pageIndex <= 0 || totalPages <= 1 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-95"
          }
        `}
      >
        Previous
      </button>

      <div className="hidden sm:flex items-center gap-1 mx-1">
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 py-2 text-gray-400 text-sm">...</span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(p)}
              className={`
                min-w-[40px] h-10 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${p === pageIndex 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-95"
                }
              `}
            >
              {p + 1}
            </button>
          )
        )}
      </div>

      {/* Mobile page indicator */}
      <div className="sm:hidden px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
        {pageIndex + 1} / {totalPages}
      </div>

      <button
        disabled={pageIndex >= totalPages - 1 || totalPages <= 1}
        onClick={() => onPageChange(pageIndex + 1)}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
          ${pageIndex >= totalPages - 1 || totalPages <= 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-95"
          }
        `}
      >
        Next
      </button>
    </div>
  </div>
);
};
