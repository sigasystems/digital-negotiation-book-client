import React, { useEffect, useState } from "react";
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
  const navigate = useNavigate();

  const fetchOffers = async () => {
    setLoading(true);
    try {
      let response;

      if (filters && Object.keys(filters).length > 0) {
        response = await offerService.searchOffers(filters, pageIndex, pageSize);
      } else {
        response = await offerService.getAllOffers({ pageIndex, pageSize });
      }

      const { data, totalItems } = response?.data?.data || {};
      setOffers(data || []);
      setTotalItems(totalItems || 0);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
      setOffers([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (queryFilters) => {
    setFilters(queryFilters);
    setPageIndex(0);
  };

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
    fetchOffers();
  }, [pageIndex, pageSize, filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading offers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">All Offers</h1>

      <DashboardTable
        data={offers}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        fetchOwners={fetchOffers}
        userActions={["view", "edit", "delete"]}
        onView={(row) => handleView(row.id)}
        onSearch={handleSearch}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalItems={totalItems}
        searchFields={[
          { name: "offerName", label: "Offer Name", type: "text", placeholder: "Enter offer name" },
          { name: "businessName", label: "Business Name", type: "text" },
          { name: "productName", label: "Product Name", type: "text" },
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
