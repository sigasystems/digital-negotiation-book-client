import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardTable from "@/modules/dashboard/components/DashboardTable";
import { countryServices } from "@/modules/country/service";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [filters, setFilters] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const navigate = useNavigate()

  const fetchLocations = useCallback(async () => {
    try {
      const hasFilters =
      filters &&
      Object.values(filters).some(
        (val) => val && val.toString().trim().length > 0
      );

      let response;

      if (hasFilters) {
        response = await countryServices.search(filters, pageIndex, pageSize);
      } else {
        response = await countryServices.getAll({ pageIndex, pageSize });
      }

      let locationsData = [];
      let items = 0;
      
      if (response && response.data) {
        if (response.data.data) {
          locationsData = response.data.data.data || response.data.data.rows || [];
          items = response.data.data.totalItems || response.data.data.total || locationsData.length || 0;
        }
        else if (Array.isArray(response.data)) {
          locationsData = response.data || [];
          items = response.totalItems || response.total || locationsData.length || 0;
        }
        else {
          const payload = response.data;
          locationsData = payload?.data || [];
          items = payload?.totalItems || payload?.total || 0;
        }
      }

      setLocations(locationsData);
      setTotalItems(items);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
      setLocations([]);
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

  const handleSearch = useCallback((query) => {
    setIsSearching(true);
    setFilters(query);
    setPageIndex(0);
  }, []);

  useEffect(() => {
    if (loading || isSearching) {
      fetchLocations();
    }
  }, [loading, isSearching, fetchLocations]);

  useEffect(() => {
    if (!loading && !isSearching) {
      fetchLocations();
    }
  }, [pageIndex, pageSize]);

  const showFullPageLoading = loading && !isSearching && pageIndex === 0;

  if (showFullPageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[24.5px]">
      <div className="px-1 flex items-center justify-between">
        <div>
      <h1 className="text-2xl font-bold text-gray-800">Locations</h1>
      </div>
        <button className="button-styling mt-[24px]" onClick={() => navigate("/create-offer-draft")}>
          Add Locations
        </button>
    </div>

      <DashboardTable
        data={locations}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        fetchOwners={fetchLocations}
        userActions={["edit", "delete"]}
        onSearch={handleSearch}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={handlePageChange}
        setPageSize={setPageSize}
        totalItems={totalItems}
        searchFields={[
          { name: "city", label: "City", type: "text", placeholder: "Enter city" },
          { name: "state", label: "State", type: "text", placeholder: "Enter state" },
          { name: "country", label: "Country", type: "text", placeholder: "Enter country" },
        ]}
        columnsOverride={[
          { key: "city", label: "City" },
          { key: "state", label: "State" },
          { key: "country.name", label: "Country" }
        ]}
        isLoading={isPaginationLoading || loading || isSearching}
        isSearching={isSearching}
      />
    </div>
  );
};

export default Locations;
