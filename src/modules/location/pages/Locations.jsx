import React, { useEffect, useState } from "react";
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
  const navigate = useNavigate()

  const fetchLocations = async () => {
    setLoading(true);
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

      const payload = response?.data?.data;
      const items = payload?.data || [];
      const total = payload?.totalItems || 0;

      setLocations(items);
      setTotalItems(total);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
      setLocations([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setFilters(query);
    setPageIndex(0);
  };

  useEffect(() => {
    fetchLocations();
  }, [pageIndex, pageSize, filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="px-[24.5px]">
      <div className="pb-3 flex">
      <h1 className="text-2xl font-bold text-gray-800">Locations
      </h1>
      <div className="ml-auto">
        <button className="button-styling" onClick={() => navigate("/add-location")}>
          Add Location
        </button>
      </div>
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
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalItems={totalItems}
        searchFields={[
          { name: "city", label: "City", type: "text" },
          { name: "state", label: "State", type: "text" },
          { name: "country", label: "Country", type: "text" },
        ]}
        columnsOverride={[
          { key: "city", label: "City" },
          { key: "state", label: "State" },
          { key: "country.name", label: "Country" }
        ]}
      />
    </div>
  );
};

export default Locations;
