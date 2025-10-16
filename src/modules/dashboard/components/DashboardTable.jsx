import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
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
import { Pagination } from "@/utils/Pagination";

export default function DashboardTable({
  data = [],
  rowSelection,
  setRowSelection,
  fetchOwners,
  userActions = [],
  filterKey = "email", // optional: key to filter by default
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  totalItems,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  // Keys to hide from table
  const HIDDEN_KEYS = ["id", "userId"];

  // Map keys to human-readable labels (extendable)
  const COLUMN_LABELS = {
    first_name: "First Name",
    last_name: "Last Name",
    email: "Email",
    phoneNumber: "Phone Number",
    businessName: "Business Name",
    registrationNumber: "Registration Number",
    country: "Country",
    state: "State",
    city: "City",
    address: "Address",
    postalCode: "Postal Code",
    status: "Status",
    is_deleted: "Deleted",
    is_verified: "Verified",
    is_approved: "Approved",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Selection column
    const selectColumn = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
        />
      ),
      enableSorting: false,
    };

    // Name column if first_name/last_name exist
    const nameColumn =
      data[0].first_name && data[0].last_name
        ? {
            id: "name",
            header: "Name",
            cell: ({ row }) =>
              `${row.original.first_name || ""} ${row.original.last_name || ""}`.trim(),
          }
        : null;

    // Dynamic columns
    const dynamicColumns = Object.keys(data[0])
      .filter(
        (key) =>
          !HIDDEN_KEYS.includes(key) &&
          key !== "first_name" &&
          key !== "last_name"
      )
      .map((key) => {
        // Special rendering for status
        if (key === "status") {
          return {
            accessorKey: key,
            header: COLUMN_LABELS[key] || key,
            cell: ({ row }) => {
              const status = row.getValue(key);
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
            },
          };
        }

        return {
          accessorKey: key,
          header: COLUMN_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1),
        };
      });

    // Actions column
    const actionsColumn = {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionsCell row={row} refreshData={fetchOwners} userActions={userActions} />
      ),
    };

    return [selectColumn, ...(nameColumn ? [nameColumn] : []), ...dynamicColumns, actionsColumn];
  }, [data, userActions]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-x-auto">
      {/* Optional filter */}
      {table.getColumn(filterKey) && (
        <div className="mb-4">
          <Input
            placeholder={`Filter by ${filterKey}...`}
            value={table.getColumn(filterKey)?.getFilterValue() || ""}
            onChange={(e) => table.getColumn(filterKey)?.setFilterValue(e.target.value)}
            className="max-w-md"
          />
        </div>
      )}

      <Table className="min-w-[800px]">
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
                className={`transition-colors ${
                  row.getIsSelected() ? "bg-blue-50" : ""
                } ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-gray-100`}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-nowrap text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="font-medium">No results found</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination
        pageIndex={pageIndex}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
