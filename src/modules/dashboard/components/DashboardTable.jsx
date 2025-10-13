import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../../components/ui/dropdown-menu";
import { Circle, MoreHorizontal } from "lucide-react";
import { getAllBusinessOwners } from "../services/dashboardService";

// Helper to create page numbers with ellipsis
const getPageNumbers = (current, total) => {
  const delta = 2;
  const range = [];
  const left = Math.max(0, current - delta);
  const right = Math.min(total - 1, current + delta);

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (left > 1) range.unshift("...");
  if (left > 0) range.unshift(0); // first page

  if (right < total - 2) range.push("...");
  if (right < total - 1) range.push(total - 1); // last page

  return range;
};

// Custom Pagination component
const Pagination = ({ pageIndex, totalPages, onPageChange, pageSize, onPageSizeChange }) => {
  // Ensure totalPages >= 1
  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    // show first, last, current ±1
    if (i === 0 || i === totalPages - 1 || (i >= pageIndex - 1 && i <= pageIndex + 1)) {
      pages.push(i);
    } else if (i === pageIndex - 2 || i === pageIndex + 2) {
      pages.push("...");
    }
  }

  // Remove consecutive "..."
  const uniquePages = pages.filter((p, idx) => idx === 0 || p !== "..." || pages[idx - 1] !== "...");

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
        </select>
      </div>

      <div className="flex gap-1 flex-wrap justify-center sm:justify-end">
        <button
          disabled={pageIndex <= 0}
          onClick={() => onPageChange(pageIndex - 1)}
          className={`px-3 py-1 rounded border ${pageIndex <= 0 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
        >
          Previous
        </button>

       {uniquePages.map((p, idx) => (
  p === "..." ? (
    <span key={idx} className="px-2 py-1">...</span>
  ) : (
    <Button
      key={idx}
      onClick={() => onPageChange(Number(p))}
      className={p === pageIndex ? "bg-blue-500 text-white" : ""}
    >
      {p + 1}
    </Button>
  )
))}
        <button
          disabled={pageIndex >= totalPages - 1}
          onClick={() => onPageChange(pageIndex + 1)}
          className={`px-3 py-1 rounded border ${pageIndex >= totalPages - 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default function DashboardTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetch paginated data
  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await getAllBusinessOwners({
        pageIndex: Number(pagination.pageIndex) || 0,
        pageSize: Number(pagination.pageSize) || 10,
      });
      setData(response.data.data);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Failed to fetch business owners:", err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchOwners();
}, [pagination.pageIndex, pagination.pageSize]);

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span className={`flex items-center gap-2 font-medium ${status === "ACTIVE" ? "text-green-600" : "text-red-600"}`}>
            <Circle className={`w-3 h-3 ${status === "ACTIVE" ? "fill-green-500" : "fill-red-500"}`} />
            {status}
          </span>
        );
      },
    },
    { accessorKey: "businessName", header: "Business Name" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "state", header: "State" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "registrationNumber", header: "Registration No." },
    { accessorKey: "postalCode", header: "Postal Code" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "createdAt", header: "Created At" },
    { accessorKey: "updatedAt", header: "Updated At" },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.email)}>
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Owner</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
  data,
  columns,
  state: { sorting, columnFilters, rowSelection, pagination },
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  onRowSelectionChange: setRowSelection,
  manualPagination: true, // <--- important
  pageCount: totalPages,  // <--- important
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

  if (loading) return <div className="p-6 text-center">Loading business owners...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() || ""}
          onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <Table className="min-w-[1200px] md:min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Custom Pagination */}
      <Pagination
  pageIndex={pagination.pageIndex}
  totalPages={totalPages}
  pageSize={pagination.pageSize}
  onPageChange={(page) => {
    console.log("Changing page to", page);
    setPagination(prev => ({ ...prev, pageIndex: page }));
  }}
  onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size, pageIndex: 0 }))}
/>

    </div>
  );
}
