import React, { useEffect, useState } from "react";
import DashboardTable from "@/modules/dashboard/components/DashboardTable";
import { countryServices } from "../service";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [filters, setFilters] = useState(null);

const fetchCountries = async () => {
  setLoading(true);
  try {
    let response;

    if (filters && Object.keys(filters).length > 0) {
      response = await countryServices.search(filters, pageIndex, pageSize);
    } else {
      response = await countryServices.getAll({ pageIndex, pageSize });
    }

    const payload = response?.data?.data;

    // support both backend formats
    const items = payload?.data || payload?.rows || [];
    const total = payload?.totalItems || payload?.count || 0;

    setCountries(items);
    setTotalItems(total);

  } catch (err) {
    console.error("Failed to fetch countries:", err);
    setCountries([]);
    setTotalItems(0);
  } finally {
    setLoading(false);
  }
};

  const handleSearch = (queryFilters) => {
    setFilters(queryFilters);
    setPageIndex(0);
  };

  useEffect(() => {
    fetchCountries();
  }, [pageIndex, pageSize, filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading countries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Countries</h1>

      <DashboardTable
        data={countries}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        fetchOwners={fetchCountries}
        userActions={["delete", "edit"]}
        onSearch={handleSearch}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalItems={totalItems}
        searchFields={[
          { name: "code", label: "Code", type: "text" },
          { name: "country", label: "Country Name", type: "text" },
        ]}
        columnsOverride={[
          { key: "code", label: "Code" },
          { key: "country", label: "Country" },
        ]}
      />
    </div>
  );
};

export default Country;
