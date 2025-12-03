import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Save, Package, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ProductCard from "../components/ProductCard";
import { productService } from "../services";
import toast from "react-hot-toast";

const READ_ONLY_FIELDS = ["id", "ownerId", "createdAt", "updatedAt"];

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
    (async () => {
      try {
        setLoading(true);
          const { data: res } = await productService.getProductById(id);
        const product = res?.data ?? {};
        setData({
          ...product,
          size: product.size?.length ? product.size : [""],
          species: product.species?.length ? product.species : [""],
        });
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const updateField = useCallback((field, value) => {
    if (READ_ONLY_FIELDS.includes(field)) return;
    setData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, []);

  const handleArrayUpdate = useCallback((field, action, index, value) => {
    setData((prev) => {
      const arr = [...(prev[field] || [])];
      if (action === "add") arr.push("");
      if (action === "remove") arr.splice(index, 1);
      if (action === "update") arr[index] = value;
      return { ...prev, [field]: arr };
    });
    setHasChanges(true);
  }, []);
  const confirmSave = useCallback(async () => {
    setIsConfirmOpen(false);
    setSaving(true);
    try {
      const payload = {
        code: data.code.trim(),
        productName: data.productName.trim(),
        species: data.species.filter((s) => s.trim()),
        size: data.size.filter((s) => s.trim()),
      };

      await productService.updateProduct(id, payload);
      toast.success("Product updated successfully ✅");
      setHasChanges(false);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err?.response?.data?.message || "Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  }, [data, id]);

    if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <Spinner className="w-10 h-10 text-indigo-600 mb-3" />
          <p className="text-slate-600 font-medium">Loading product details...</p>
      </div>
    );

  if (!data)
    return (
      <div className="text-center text-gray-500 mt-20">
        No product data found.
      </div>
    );

  return (
    <div className="relative min-h-screen px-[24.5px]">
      {/* Saving Overlay */}
      {saving && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Spinner className="w-8 h-8 text-indigo-600 mb-3" />
          <p className="text-slate-700 font-medium">Saving changes...</p>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className={`cursor-pointer`}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="flex items-center gap-3 ml-3">
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
      <main className="mx-auto py-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <ProductCard
            index={0}
            product={data}
            onChange={(i, e) => updateField(e.target.name, e.target.value)}
            onSpeciesChange={(i, si, val) =>
              handleArrayUpdate("species", "update", si, val)
            }
            onAddSpecies={() => handleArrayUpdate("species", "add")}
            onRemoveSpecies={(i, si) =>
              handleArrayUpdate("species", "remove", si)
            }
            onSizeChange={(i, si, val) =>
              handleArrayUpdate("size", "update", si, val)
            }
            onAddSize={() => handleArrayUpdate("size", "add")}
            onRemoveSize={(i, si) => handleArrayUpdate("size", "remove", si)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={saving}
            className={`cursor-pointer`}
          >
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <Button
            onClick={() => setIsConfirmOpen(true)}
            disabled={saving || !hasChanges}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSave}
        title="Confirm Save"
        description="Are you sure you want to save these product changes?"
        confirmText="Save Changes"
        cancelText="Cancel"
        confirmButtonColor="bg-indigo-600 hover:bg-indigo-700"
      />
    </div>
  );
};

export default ViewProduct;
