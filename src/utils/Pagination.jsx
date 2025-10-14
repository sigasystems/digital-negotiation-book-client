import { Circle } from "lucide-react"
export const Pagination = ({ pageIndex, totalPages, pageSize, onPageChange, onPageSizeChange }) => {
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

 return (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
    <div className="flex items-center gap-2">
      <span className="text-xs sm:text-sm text-gray-600 font-medium">Rows per page:</span>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
      >
        {[10, 20, 50].map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
    </div>

      <div className="hidden md:block text-sm text-gray-600">
      Page <span className="font-semibold text-gray-900">{pageIndex + 1}</span> of{" "}
      <span className="font-semibold text-gray-900">{totalPages}</span>
    </div>

    <div className="flex items-center gap-1">
      <button
        disabled={pageIndex <= 0 || totalPages <= 1}
        onClick={() => onPageChange(pageIndex - 1)}
        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
          pageIndex <= 0 || totalPages <= 1 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95"
          }
        `}
      >
        Prev
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
                min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                p === pageIndex 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95"
                }
              `}
            >
              {p + 1}
            </button>
          )
        )}
      </div>

        <div className="sm:hidden px-3 py-2 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
        {pageIndex + 1} / {totalPages}
      </div>

      <button
        disabled={pageIndex >= totalPages - 1 || totalPages <= 1}
        onClick={() => onPageChange(pageIndex + 1)}
        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
          pageIndex >= totalPages - 1 || totalPages <= 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95"
          }
        `}
      >
        Next
      </button>
    </div>
  </div>
);
};

export const MobileCard = ({ item, isSelected, onSelect, actions }) => {
  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">
            {item.first_name} {item.last_name}
          </h3>
          <p className="text-xs text-gray-600 mt-1">{item.email}</p>
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="mt-1"
        />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Circle
          className={`w-3 h-3 ${
            item.status === "active" ? "fill-green-500 text-green-500" : "fill-red-500 text-red-500"
          }`}
        />
        <span
          className={`text-xs font-medium ${
            item.status === "active" ? "text-green-600" : "text-red-600"
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">Business:</span>
          <span className="text-gray-900 font-medium">{item.businessName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Phone:</span>
          <span className="text-gray-900">{item.phoneNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Location:</span>
          <span className="text-gray-900">
            {item.city}, {item.state}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3">{actions}</div>
    </div>
  );
};