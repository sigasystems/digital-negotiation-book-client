import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardTable from "@/modules/dashboard/components/DashboardTable";
import { productService } from "../services";
import { roleBasedDataService } from "@/services/roleBasedDataService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [filters, setFilters] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;

      if (filters && Object.keys(filters).length > 0) {
        response = await productService.searchProducts(filters, pageIndex, pageSize);
      } else {
        response = await productService.getAllProducts({ pageIndex, pageSize });
      }

      const { products, totalItems } = response?.data?.data || {};
      setProducts(products || []);
      setTotalItems(totalItems || 0);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (queryFilters) => {
    setFilters(queryFilters);
    setPageIndex(0);
  };

  const handleView = async (productId) => {
    try {
      const product = await roleBasedDataService.getById("business_owner", {
        id: productId,
        type: "product",
      });
      navigate(`/dashboard/products/${productId}`, { state: { product } });
    } catch (err) {
      console.error("Failed to fetch product details:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageIndex, pageSize, filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="px-[25.6px]">
      {/* Header + Add Product */}
      <div className="pb-4 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">All Products</h1>

        <div className="mt-[24PX]">
          <button
            onClick={() => navigate("/add-product")}
            className="button-styling"
          >
            Add Product
          </button>
        </div>
      </div>

      <DashboardTable
        data={products}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        fetchOwners={fetchProducts}
        userActions={["view", "edit", "delete"]}
        onView={(row) => handleView(row.id)}
        onSearch={handleSearch}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalItems={totalItems}
        searchFields={[
          { name: "productName", label: "Product Name", type: "text" },
          { name: "species", label: "Species", type: "text" },
          { name: "size", label: "Size", type: "text", placeholder: "50kg" },
        ]}
      />
    </div>
  );
}