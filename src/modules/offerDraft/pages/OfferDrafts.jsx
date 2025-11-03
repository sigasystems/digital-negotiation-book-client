import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardTable from "@/modules/dashboard/components/DashboardTable";
import { offerDraftService } from "../services";
import { roleBasedDataService } from "@/services/roleBasedDataService";

export default function OfferDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();

  const fetchOfferDrafts = async () => {
    setLoading(true);
    try {
      const response = await offerDraftService.getAllOfferDrafts({
        pageIndex,
        pageSize,
      });

      const { drafts, totalItems } = response?.data?.data || {};
      setDrafts(drafts || []);
      setTotalItems(totalItems || 0);
    } catch (err) {
      console.error("Failed to fetch offer drafts:", err);
      setDrafts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (offerId) => {
    try {
      const offer = await roleBasedDataService.getById("business_owner", {
        id: offerId,
        type: "offer",
      });
      navigate(`/dashboard/offers/${offerId}`, { state: { offer } });
    } catch (err) {
      console.error("Failed to fetch offer details:", err);
    }
  };

  useEffect(() => {
    fetchOfferDrafts();
  }, [pageIndex, pageSize]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading offer drafts...</p>
      </div>
    );
  }

const generateColumns = (data) => {
  if (!data || !data.length) return [];

  const HIDDEN_KEYS = [
    "id",
    "ownerId",
    "businessOwnerId",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "isDeleted",
  ];

  return Object.keys(data[0])
    .filter((key) => !HIDDEN_KEYS.includes(key))
    .map((key) => {
      if (key === "isVerified" || key === "status") {
        return {
          id: key,
          accessorKey: key,
          header: key === "isVerified" ? "Verified" : "Status",
          cell: ({ row }) => {
            const value = row.getValue(key);
            const isActive =
              value === true ||
              value === "true" ||
              value === "active" ||
              value === "yes" ||
              value === 1;
            const displayText =
              key === "status"
                ? value?.toString().charAt(0).toUpperCase() +
                  value?.toString().slice(1)
                : isActive
                ? "Yes"
                : "No";

            return (
              <span
                className={`font-medium ${
                  isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {displayText}
              </span>
            );
          },
        };
      }

     if (key === "sizeBreakups") {
        return {
          id: key,
          accessorKey: key,
          header: "Size Breakups",
          cell: ({ row }) => {
            const breakups = row.original.sizeBreakups;
            if (!Array.isArray(breakups) || !breakups.length) return "-";

            return (
              <div className="flex flex-wrap gap-2 max-w-full">
                {breakups.map((b, i) => (
                  <div
                    key={i}
                    className="text-xs border border-gray-200 rounded-lg p-2 bg-gray-50 text-gray-700 leading-snug min-w-[120px]"
                  >
                    <div>
                      <strong>Size:</strong> {b.size ?? "-"}
                    </div>
                    <div>
                      <strong>Breakup:</strong> {b.breakup ?? "-"}
                    </div>
                    <div>
                      <strong>Price:</strong> ${b.price ?? "-"}
                    </div>
                  </div>
                ))}
              </div>
            );
          },
        };
      }

      return {
        id: key,
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
        cell: ({ row }) => {
          const value = row.getValue(key);

          if (Array.isArray(value)) {
            return (
              <div className="flex flex-col gap-1">
                {value.map((v, i) => (
                  <span key={i} className="text-gray-700 text-sm">
                    {typeof v === "object"
                      ? Object.entries(v)
                          .map(([k, val]) => `${k}: ${val}`)
                          .join(", ")
                      : String(v ?? "")}
                  </span>
                ))}
              </div>
            );
          }

          if (typeof value === "object" && value !== null) {
            return (
              <span className="text-gray-700 text-sm">
                {Object.entries(value)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")}
              </span>
            );
          }

          return <span className="text-gray-700">{String(value ?? "")}</span>;
        },
      };
    });
};

  const columns = generateColumns(drafts);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Offer Drafts</h1>

      <DashboardTable
        data={drafts}
        columns={columns}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        fetchOwners={fetchOfferDrafts}
        userActions={["view", "edit", "delete"]}
        onView={(row) => handleView(row.id)}
        filterKey="draftName"
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalItems={totalItems}
      />
    </div>
  );
}
