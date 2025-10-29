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
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts({
        pageIndex,
        pageSize,
      });

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
  }, [pageIndex, pageSize]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">All Products</h1>

      <DashboardTable
        data={products}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        fetchOwners={fetchProducts}
        userActions={["view", "edit", "delete"]}
        onView={(row) => handleView(row.id)}
        filterKey="productName"
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalItems={totalItems}
      />
    </div>
  );
}