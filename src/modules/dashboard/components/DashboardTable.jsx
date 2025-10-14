import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import { ActionsCell } from "@/utils/ActionsCell";
import { Circle } from "lucide-react";
import { getAllBusinessOwners } from "../services/dashboardService";
import { usePagination } from "@/app/hooks/usePagination";
import { Pagination } from "@/utils/Pagination";

export default function DashboardTable() {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const { pageIndex, pageSize, totalPages, setPageIndex, setPageSize } =
    usePagination({ totalItems, initialPageSize: 10 });

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await getAllBusinessOwners({ pageIndex, pageSize });
      const { data: rows, totalItems } = response.data;

      setData(rows);
      setTotalItems(totalItems);
    } catch (err) {
      console.error("Failed to fetch business owners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [pageIndex, pageSize]);

const columns = useMemo(() => {
  const SelectColumn = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
  };

  const StatusCell = ({ row }) => {
    const status = row.getValue("status");
    return (
      <span
        className={`flex items-center gap-2 font-medium ${
          status === "active" ? "text-green-600" : "text-red-600"
        }`}
      >
        <Circle
          className={`w-3 h-3 ${
            status === "active" ? "fill-green-500" : "fill-red-500"
          }`}
        />
        {status}
      </span>
    );
  };

  return [
    SelectColumn,
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "status", header: "Status", cell: StatusCell },
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
    { id: "actions", cell: ({ row }) => <ActionsCell row={row} refreshData={fetchOwners}/> },
  ];
}, []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, rowSelection, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading)
    return <div className="p-6 text-center">Loading business owners...</div>;

return (
  <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
    <div className="max-w-full mx-auto space-y-4">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() || ""}
          onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap bg-gray-50 font-semibold text-gray-700 border-b-2 border-gray-200"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className={`
                      transition-colors
                      ${row.getIsSelected() ? "bg-blue-50" : ""}
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      hover:bg-gray-100
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length} 
                    className="h-32 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <p className="font-medium">No results found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <Pagination
          pageIndex={pageIndex}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  </div>
);
}
