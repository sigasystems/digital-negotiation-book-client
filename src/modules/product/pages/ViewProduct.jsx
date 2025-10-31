import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Save, X, Package, Ruler } from "lucide-react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { productService } from "../services";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

const READ_ONLY_FIELDS = ["id", "ownerId", "createdAt", "updatedAt"];
const FIELD_LABELS = {
  code: "Product Code",
  productName: "Product Name",
  species: "Species",
  size: "Available Sizes",
  createdAt: "Created At",
  updatedAt: "Updated At",
};

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ✅ Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productService.getProductById(id);
        setData(response?.data?.data || {});
      } catch (err) {
        console.error("Failed to fetch product:", err);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSizeChange = (index, value) => {
    setData((prev) => {
      const updatedSizes = [...(prev.size || [])];
      updatedSizes[index] = value;
      return { ...prev, size: updatedSizes };
    });
    setHasChanges(true);
  };

  const handleAddSize = () => {
    setData((prev) => ({ ...prev, size: [...(prev.size || []), ""] }));
    setHasChanges(true);
  };

  const handleRemoveSize = (index) => {
    setData((prev) => ({
      ...prev,
      size: prev.size.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  };

  const handleSaveClick = () => {
    if (!hasChanges) return;
    setIsConfirmOpen(true);
  };

  const confirmSave = async () => {
    setIsConfirmOpen(false);
    setSaving(true);
    try {
      const updatedData = {
        code: data.code,
        productName: data.productName,
        species: data.species,
        size: data.size.filter((s) => s.trim()),
      };

      await productService.updateProduct(id, updatedData);
      toast.success("Product updated successfully ✅");
      setHasChanges(false);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err?.response?.data?.message || "Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // 🔄 Loader overlay for API states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center">
          <Spinner className="w-10 h-10 text-indigo-600 mb-3" />
          <p className="text-slate-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-500 mt-20">
        No product data found.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      {/* 🔒 Saving overlay */}
      {saving && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Spinner className="w-8 h-8 text-indigo-600 mb-3" />
          <p className="text-slate-700 font-medium">Saving changes...</p>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-8 w-px bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Product Details
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Product ID: {id}
                </p>
              </div>
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Product Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-slate-50 px-5 py-4 border-b border-slate-200 flex items-center gap-3">
            <Package className="text-indigo-600 w-5 h-5" />
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Product Information
            </h2>
          </div>

          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {Object.entries(data)
              .filter(
                ([key]) =>
                  key !== "size" && !["id", "ownerId"].includes(key)
              )
              .map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    {FIELD_LABELS[key] || key}
                  </label>
                  <Input
                    value={value ?? ""}
                    onChange={(e) =>
                      !READ_ONLY_FIELDS.includes(key) &&
                      handleChange(key, e.target.value)
                    }
                    disabled={READ_ONLY_FIELDS.includes(key)}
                    className={`${
                      READ_ONLY_FIELDS.includes(key)
                        ? "bg-slate-100 text-slate-600 cursor-not-allowed border-slate-200"
                        : "bg-slate-50 hover:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    } transition-all duration-150`}
                    placeholder={`Enter ${FIELD_LABELS[key] || key}`}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Product Sizes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-slate-50 px-5 py-4 border-b border-slate-200 flex items-center gap-3">
            <Ruler className="text-indigo-600 w-5 h-5" />
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Product Sizes
            </h2>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            {(data.size || []).map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <Input
                  value={s}
                  onChange={(e) => handleSizeChange(i, e.target.value)}
                  className="flex-1 bg-slate-50 hover:bg-white focus:ring-2 focus:ring-indigo-500"
                />
                {data.size.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(i)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer px-2 py-1 hover:bg-red-50 rounded-md"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={handleAddSize}
              className="text-indigo-600 border-indigo-300 hover:bg-indigo-50 cursor-pointer"
            >
              + Add Another Size
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={saving}
            className="hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            disabled={saving || !hasChanges}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
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
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSave}
        title="Confirm Save"
        description="Are you sure you want to save these product changes? This will update the product details in the system."
        confirmText="Save Changes"
        cancelText="Cancel"
        confirmButtonColor="bg-indigo-600 hover:bg-indigo-700"
      />
    </div>
  );
};

export default ViewProduct;
