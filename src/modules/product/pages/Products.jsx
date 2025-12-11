import React, { useEffect, useState, useCallback } from "react";
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
  const [isSearching, setIsSearching] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false); // NEW: Separate state for pagination loading
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      let response;

      if (filters && Object.keys(filters).length > 0) {
        response = await productService.searchProducts(filters, pageIndex, pageSize);
      } else {
        response = await productService.getAllProducts({ pageIndex, pageSize });
      }

      let productsData = [];
      let items = 0;
      
      if (response && response.data) {
        if (response.data.data && response.data.data.products) {
          productsData = response.data.data.products || [];
          items = response.data.data.totalItems || 0;
        } 
        else if (response.data.products) {
          productsData = response.data.products || [];
          items = response.data.totalItems || 0;
        }
        else if (Array.isArray(response.data)) {
          productsData = response.data || [];
          items = response.totalItems || response.data.length || 0;
        }
        else {
          productsData = response.data.rows || response.data.data || [];
          items = response.data.totalItems || response.data.total || productsData.length || 0;
        }
      }

      setProducts(productsData);
      setTotalItems(items);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
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
    if (loading || isSearching) {
      fetchProducts();
    }
  }, [loading, isSearching, fetchProducts]);

  useEffect(() => {
    if (!loading && !isSearching) {
      fetchProducts();
    }
  }, [pageIndex, pageSize]);

  const showFullPageLoading = loading && !isSearching && pageIndex === 0;

  if (showFullPageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[25.6px]">
      {/* Header + Add Product */}
      <div className=" flex items-center justify-between flex-wrap gap-3">
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
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={handlePageChange}
        setPageSize={setPageSize}
        totalItems={totalItems}
        onSearch={handleSearch}
        searchFields={[
          { name: "productName", label: "Product Name", type: "text" },
          { name: "code", label: "Product code", type: "text" },
          // { name: "species", label: "Species", type: "text" },
          // { name: "size", label: "Size", type: "text", placeholder: "50kg" },
        ]}
        isLoading={isPaginationLoading || loading || isSearching}
        isSearching={isSearching}
      />
    </div>
  );
}