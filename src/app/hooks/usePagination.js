import { useState, useEffect } from "react";

// Hook to handle pagination state and logic
export function usePagination({ totalItems = 0, initialPageSize = 10 }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);

  // Update total pages whenever totalItems or pageSize changes
  useEffect(() => {
    setTotalPages(totalPages || Math.ceil((totalItems || 0) / pageSize) || 1);
  }, [totalItems, pageSize]);

  const handlePageChange = (page) => {
    setPageIndex(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPageIndex(0); // Reset to first page
  };

  return {
    pageIndex,
    pageSize,
    totalPages,
    setPageIndex: handlePageChange,
    setPageSize: handlePageSizeChange,
  };
}
