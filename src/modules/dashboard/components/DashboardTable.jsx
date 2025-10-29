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
  filterKey = "email",
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  totalItems,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const HIDDEN_KEYS = ["id", "ownerId", "isDeleted"];

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Selection column
    const selectColumn = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
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

    // Dynamic columns
    const dynamicColumns = Object.keys(data[0])
      .filter((key) => !HIDDEN_KEYS.includes(key))
      .map((key) => {
        if (key === "status") {
          return {
            id: key,
            accessorKey: key,
            header: "Status",
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

        if (key === "isVerified") {
          return {
            id: key,
            accessorKey: key,
            header: "Verified",
            cell: ({ row }) =>
              row.getValue(key) ? (
                <span className="text-green-600 font-medium">Yes</span>
              ) : (
                <span className="text-red-600 font-medium">No</span>
              ),
          };
        }

        return {
          id: key,
          accessorKey: key,
          header: key.charAt(0).toUpperCase() + key.slice(1),
        };
      });

    const actionsColumn = Array.isArray(userActions) && userActions.length > 0
    ? {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionsCell row={row} refreshData={fetchOwners} userActions={userActions} />
      ),
    }
    : null;

return actionsColumn
  ? [selectColumn, ...dynamicColumns, actionsColumn]
  : [selectColumn, ...dynamicColumns];

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
        {table.getAllColumns().some(col => col.id === filterKey) && (
          <div className="mb-4">
            <Input
              placeholder={`Filter by ${filterKey
                .replace(/([A-Z])/g, " $1") // adds space before capital letters
                .replace(/^./, (str) => str.toUpperCase()) // capitalize first letter
              }...`}
              value={table.getColumn(filterKey)?.getFilterValue() || ""}
              onChange={(e) =>
                table.getColumn(filterKey)?.setFilterValue(e.target.value)
              }
              className="max-w-md"
            />
          </div>
        )}

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
