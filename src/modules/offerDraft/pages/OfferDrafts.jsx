import React, { useEffect, useState, useCallback } from "react";
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
  const [isSearching, setIsSearching] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOfferDrafts = useCallback(async () => {
    try {
      let response;

      if (filters && Object.keys(filters).length > 0) {
        response = await offerDraftService.searchOfferDrafts(filters, pageIndex, pageSize);
      } else {
        response = await offerDraftService.getAllOfferDrafts({ pageIndex, pageSize });
      }

      let draftsData = [];
      let items = 0;
      
      if (response && response.data) {
        if (response.data.data && response.data.data.drafts) {
          draftsData = response.data.data.drafts || [];
          items = response.data.data.totalItems || 0;
        } 
        else if (response.data.drafts) {
          draftsData = response.data.drafts || [];
          items = response.data.totalItems || 0;
        }
        else if (Array.isArray(response.data)) {
          draftsData = response.data || [];
          items = response.totalItems || response.data.length || 0;
        }
        else {
          draftsData = response.data.rows || response.data.data || [];
          items = response.data.totalItems || response.data.total || draftsData.length || 0;
        }
      }
      const normalized = (draftsData || []).map(d => ({
        ...d,
        id: d.draftNo || d.id,
      }));

      setDrafts(normalized);
      setTotalItems(items);
    } catch (err) {
      console.error("Failed to fetch offer drafts:", err);
      setDrafts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
      setIsSearching(false);
      setIsPaginationLoading(false);
    }
  }, [filters, pageIndex, pageSize]);

  const handlePageChange = useCallback((newPageIndex) => {
    setIsPaginationLoading(true);
    setPageIndex(newPageIndex);
  }, []);

  const handleSearch = useCallback((params) => {
    setIsSearching(true);
    setFilters(params);
    setPageIndex(0);
  }, []);

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
    if (loading || isSearching) {
      fetchOfferDrafts();
    }
  }, [loading, isSearching, fetchOfferDrafts]);

  useEffect(() => {
    if (!loading && !isSearching) {
      fetchOfferDrafts();
    }
  }, [pageIndex, pageSize]);

  const showFullPageLoading = loading && !isSearching && pageIndex === 0;

  if (showFullPageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading offer drafts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[22.5px]">
      <div  className="px-1 flex items-center justify-between">
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
        setPageIndex={handlePageChange}
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
        isLoading={isPaginationLoading || loading || isSearching}
        isSearching={isSearching}
      />
    </div>
  );
}
