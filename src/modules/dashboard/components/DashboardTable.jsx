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
import { Checkbox } from "../../../components/ui/checkbox";
import { ActionsCell } from "@/utils/actionsUtil/ActionsCell";
import { Circle } from "lucide-react";
import { Pagination } from "@/utils/Pagination";
import { SearchFilters } from "@/components/common/SearchFilters";
import { formatHeader } from "@/utils/formateDate";

export default function DashboardTable({
  data = [],
  rowSelection,
  setRowSelection,
  fetchOwners,
  userActions = [],
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  totalItems,
  onSearch,
  searchFields = [],
  columnsOverride = null,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const HIDDEN_KEYS = [
    "id",
    "code",
    "ownerId",
    "ownerid",
    "isDeleted",
    "deletedAt",
    "businessOwnerId",
    "userId",
    "paymentId",
    "phoneNumber",
    "registrationNumber",
    "address",
    "is_approved",
    "is_verified",
    "planCode",
    "planId",
    "postalCode",
    "createdAt",
    "updatedAt",
    "is_deleted",
    "state",
    "city",
    "taxId",
    "contactPhone",
    "countryCode",
    "origin",
    "processor",
    "plantApprovalNumber",
    "quantity",
    "tolerance",
    "paymentTerms",
    "remark",
    "packing",
    "total",
    "grandTotal",
    "offerValidityDate",
    "shipmentDate",
    "brand",
    "offerDraftId",
    "buyerId",
  ];

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    const selectColumn = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          className="cursor-pointer"
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          className="cursor-pointer"
          aria-label={`Select row ${row.id}`}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 40,
    };

    if (columnsOverride) {
      const mapped = columnsOverride.map((col) => ({
        id: col.key,
        accessorKey: col.key,
        header: col.label,
        cell: ({ row }) => (
          <span className="select-none">{String(row.getValue(col.key) ?? "")}</span>
        ),
      }));

      const actionsColumn =
        Array.isArray(userActions) && userActions.length > 0
          ? {
              id: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <ActionsCell
                  row={row}
                  refreshData={fetchOwners}
                  userActions={userActions}
                  className="cursor-pointer"
                />
              ),
              size: 120,
              enableSorting: false,
              enableColumnFilter: false,
            }
          : null;

      return actionsColumn ? [selectColumn, ...mapped, actionsColumn] : [selectColumn, ...mapped];
    }

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

              const STATUS_COLORS = {
                "open": {
                  text: "text-green-600",
                  dot: "fill-green-500"
                },
                "close": {
                  text: "text-gray-600",
                  dot: "fill-gray-500"
                },
                "Business Owner Accepted": {
                  text: "text-blue-600",
                  dot: "fill-blue-500"
                },
                "Business Owner Rejected": {
                  text: "text-red-600",
                  dot: "fill-red-500"
                },
                "Buyer Accepted": {
                  text: "text-emerald-600",
                  dot: "fill-emerald-500"
                },
                "Buyer Rejected": {
                  text: "text-orange-600",
                  dot: "fill-orange-500"
                }
              };

              const color = STATUS_COLORS[status] || {
                text: "text-gray-600",
                dot: "fill-gray-500"
              };

              return (
                <span
                  className={`flex items-center gap-2 font-semibold select-none ${color.text}`}
                >
                  <Circle
                    className={`w-3 h-3 ${color.dot}`}
                    aria-hidden="true"
                  />
                  {String(status).charAt(0).toUpperCase() + String(status).slice(1)}
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
                <span className="text-green-600 font-semibold select-none">Yes</span>
              ) : (
                <span className="text-red-600 font-semibold select-none">No</span>
              ),
          };
        }

        return {
          id: key,
          accessorKey: key,
          header: formatHeader(key),
          cell: ({ row }) => {
            const value = row.getValue(key);
            if (Array.isArray(value))
              return <span className="select-none">{value.length} item(s)</span>;
            if (typeof value === "object" && value !== null)
              return <span className="select-none">{JSON.stringify(value)}</span>;
            return <span className="select-none">{String(value ?? "")}</span>;
          },
        };
      });

    const actionsColumn =
      Array.isArray(userActions) && userActions.length > 0
        ? {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <ActionsCell
                row={row}
                refreshData={fetchOwners}
                userActions={userActions}
                className="cursor-pointer"
              />
            ),
            size: 120,
            enableSorting: false,
            enableColumnFilter: false,
          }
        : null;

    return actionsColumn ? [selectColumn, ...dynamicColumns, actionsColumn] : [selectColumn, ...dynamicColumns];
  }, [data, userActions, columnsOverride, fetchOwners]);

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
    debugTable: false,
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="overflow-x-auto bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl">
      {searchFields.length > 0 && (
        <SearchFilters fields={searchFields} onSearch={onSearch} />
      )}

          <div className="px-6">
      <Table containerClassName="rounded-[5px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-indigo-50"
            >
              {headerGroup.headers.slice(1).map((header) => (
                <TableHead
                  key={header.id}
                  className="border border-gray-300 px-4 py-2 text-left select-none font-semibold text-gray-700"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="even:bg-gray-50 hover:bg-indigo-50 transition-colors cursor-default"
              >
                {row.getAllCells().slice(1).map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="border border-gray-300 px-4 py-2 select-text"
                    style={{ userSelect: "text" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length - 1} className="text-center py-6 text-gray-500">
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
          </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Pagination
          pageIndex={pageIndex}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}