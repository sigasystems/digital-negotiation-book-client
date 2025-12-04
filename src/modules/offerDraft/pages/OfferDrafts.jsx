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
  const [filters, setFilters] = useState(null);
  const navigate = useNavigate();

  const fetchOfferDrafts = async () => {
    setLoading(true);
    try {
      let response;

      if (filters && Object.keys(filters).length > 0) {
        response = await offerDraftService.searchOfferDrafts(filters, pageIndex, pageSize);
      } else {
        response = await offerDraftService.getAllOfferDrafts({ pageIndex, pageSize });
      }

      const { drafts, totalItems } = response?.data?.data || {};

      const normalized = (drafts || []).map(d => ({
        ...d,
        id: d.draftNo,
      }));

      setDrafts(normalized);
      setTotalItems(totalItems || 0);
    } catch (err) {
      console.error("Failed to fetch offer drafts:", err);
      setDrafts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (params) => {
    setFilters(params);
    setPageIndex(0);
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
  }, [pageIndex, pageSize, filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading offer drafts...</p>
      </div>
    );
  }

  return (
    <div className="px-[22.5px]">
      <div  className="px-1 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Offer Drafts</h1>
          <button className="button-styling mt-[22px]" onClick={() => navigate("/create-offer-draft")}>
            Create Offer Draft
          </button>
      </div>

      <DashboardTable
        data={drafts}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        fetchOwners={fetchOfferDrafts}
        userActions={["view", "edit", "delete"]}
        onView={(row) => handleView(row.id)}
        onSearch={handleSearch}
        filterKey="draftName"
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalItems={totalItems}
        searchFields={[
          { name: "draftNo", label: "Draft No", type: "number", placeholder: "Enter draft number" },
          { name: "draftName", label: "Draft Name", type: "text", placeholder: "Enter draft name" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Open", value: "open" },
              { label: "Close", value: "close" },
            ],
          },
        ]}
      />
    </div>
  );
}
