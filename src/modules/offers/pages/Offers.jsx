import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardTable from "@/modules/dashboard/components/DashboardTable";
import { offerService } from "../services";
import { roleBasedDataService } from "@/services/roleBasedDataService";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [filters, setFilters] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOffers = useCallback(async () => {
    try {
      let response;

      if (filters && Object.keys(filters).length > 0) {
        response = await offerService.searchOffers(filters, pageIndex, pageSize);
      } else {
        response = await offerService.getAllOffers({ pageIndex, pageSize });
      }

      let offersData = [];
      let items = 0;
      
      if (response && response.data) {
        if (response.data.data) {
          if (response.data.data.offers) {
            offersData = response.data.data.offers || [];
            items = response.data.data.totalItems || response.data.data.total || 0;
          } 
          else if (Array.isArray(response.data.data)) {
            offersData = response.data.data || [];
            items = response.data.totalItems || response.data.total || offersData.length || 0;
          }
          else {
            offersData = response.data.data.data || response.data.data.rows || [];
            items = response.data.data.totalItems || response.data.data.total || offersData.length || 0;
          }
        }
        else if (Array.isArray(response.data)) {
          offersData = response.data || [];
          items = response.totalItems || response.total || offersData.length || 0;
        }
        else {
          offersData = response.data?.offers || [];
          items = response.data?.totalItems || response.data?.total || 0;
        }
      }

      setOffers(offersData);
      setTotalItems(items);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
      setOffers([]);
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

  const handleSearch = useCallback((queryFilters) => {
    setIsSearching(true);
    setFilters(queryFilters);
    setPageIndex(0);
  }, []);

  const handleView = async (offerId) => {
    try {
      // Explicitly pass type: "offer"
      const offer = await roleBasedDataService.getById("business_owner", {
        id: offerId,
        type: "offer",
      });
      navigate(`/offer/${offerId}`, { state: { offer } });
    } catch (err) {
      console.error("Failed to fetch offer details:", err);
    }
  };

  useEffect(() => {
    if (loading || isSearching) {
      fetchOffers();
    }
  }, [loading, isSearching, fetchOffers]);

  useEffect(() => {
    if (!loading && !isSearching) {
    fetchOffers();
    }
  }, [pageIndex, pageSize]);

    const showFullPageLoading = loading && !isSearching && pageIndex === 0;

  if (showFullPageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading offers...</p>
          </div>
      </div>
    );
  }

  return (
    <div className="px-[22.5px]">
      <div className="pb-3">
      <h1 className="text-2xl font-bold text-gray-800">All Offers
      </h1>
    </div>

      <DashboardTable
        data={offers}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        fetchOwners={fetchOffers}
        userActions={["view", "delete"]}
        onView={(row) => handleView(row.id)}
        onSearch={handleSearch}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={handlePageChange}
        setPageSize={setPageSize}
        totalItems={totalItems}
        searchFields={[
          { name: "offerName", label: "Offer Name", type: "text", placeholder: "Enter offer name" },
          { name: "businessName", label: "Business Name", type: "text", placeholder: "Enter business name" },
          { name: "productName", label: "Product Name", type: "text", placeholder: "Enter product name" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Open", value: "open" },
              { label: "Close", value: "close" },
              { label: "Pending", value: "pending" },
              { label: "Accepted", value: "accepted" },
              { label: "Rejected", value: "rejected" },
            ],
          },
        ]}
        isLoading={isPaginationLoading || loading || isSearching}
        isSearching={isSearching}
      />
    </div>
  );
}
