import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Save, X } from "lucide-react";
import { productService } from "@/modules/product/services";

// 🧩 Field labels
const PRODUCT_FIELD_LABELS = {
  code: "Product Code",
  productName: "Product Name",
  species: "Species",
  size: "Size",
  createdAt: "Created At",
  updatedAt: "Updated At",
};

// 🔒 Read-only fields
const READ_ONLY_FIELDS = ["id", "ownerId", "createdAt", "updatedAt"];

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);

  // 📡 Fetch product using service
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductById(id);
        const product = res?.data?.data;
        setData(product);
        setOriginalData(product);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(
          err.response?.data?.message || "Failed to fetch product details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✏️ Handle field change
  const handleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 💾 Save changes
  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = { ...data };

      // Convert string to array if size was edited
      if (typeof payload.size === "string") {
        payload.size = payload.size
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const res = await productService.updateProduct(id, payload);
      const updated = res?.data?.data;
      setOriginalData(updated);
      setData(updated);

      alert("✅ Product updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert(
        err.response?.data?.message ||
          "Something went wrong while updating product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
          <p className="text-slate-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-20 font-medium">{error}</div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-500 mt-20">
        No product data found.
      </div>
    );
  }

  // ✅ Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="h-8 w-px bg-slate-300 hidden sm:block" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                Product Details
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Product ID: {id}
              </p>
            </div>
          </div>

          {hasChanges && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-300 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Changes
            </Badge>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-5 py-4 border-b border-slate-200">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Product Information
            </h2>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {Object.entries(data).map(([key, value]) => {
                if (key === "id" || key === "ownerId") return null;

                const label = PRODUCT_FIELD_LABELS[key] || key;
                const isArray = Array.isArray(value);
                const isReadOnly = READ_ONLY_FIELDS.includes(key);

                return (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      {label}
                    </label>
                    <Input
                      value={isArray ? value.join(", ") : value ?? ""}
                      onChange={(e) =>
                        !isReadOnly && handleChange(key, e.target.value)
                      }
                      disabled={isReadOnly}
                      className={`${
                        isReadOnly
                          ? "bg-slate-100 text-slate-600 cursor-not-allowed border-slate-200"
                          : "bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      } transition-all duration-150`}
                      placeholder={`Enter ${label}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 sm:static bg-white border-t border-slate-200 mt-10 py-4 px-4 sm:px-0 shadow-lg sm:shadow-none z-30">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="w-full sm:w-auto hover:bg-slate-100"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !hasChanges}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product;
