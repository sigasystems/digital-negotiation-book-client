import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Save, Package, X } from "lucide-react";
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
      toast.success("Product Updated Successfully!");
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
        <div className="relative">
          <div className="w-10 h-10 border-2 border-slate-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin duration-700"></div>
        </div>
        <p className="text-slate-600 font-medium mt-3">Loading product details...</p>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No Product Data</h3>
          <p className="text-slate-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(-1)} variant="outline" size="sm">
            Go Back
          </Button>
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen px-[24.5px] bg-slate-50">
      {/* Saving Overlay */}
      {saving && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-all duration-300">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin duration-700"></div>
          </div>
          <p className="text-slate-700 font-medium mt-2 animate-pulse duration-1000">Saving changes...</p>
          <p className="text-sm text-slate-500">Please don't close the window</p>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-17 bg-white border-b border-slate-200 shadow-sm z-20 rounded-lg mb-6 transition-all duration-200">
        <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-slate-100 rounded-lg transition-all duration-200 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="flex items-center gap-3 ml-3">
              <div className="h-8 w-px bg-slate-200 hidden sm:block transition-all duration-300" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900 transition-all duration-200">
                  Product Details
                </h1>
                <p className="text-sm text-slate-500 hidden sm:block mt-0.5 transition-all duration-200">
                  {data?.productName || "Product Information"}
                </p>
              </div>
            </div>
          </div>

          {hasChanges && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 text-sm font-normal transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse duration-1000"></span>
              Unsaved Changes
            </Badge>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 transition-all duration-200 hover:shadow-md">
          <div className="border-b border-slate-100 px-6 py-4 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 transition-all duration-200">
                  Product Information
                </h2>
              </div>
            </div>
          </div>
          
          <div>
            <div className="[&_input]:h-9 [&_input]:py-2 [&_input]:text-sm [&_input]:transition-all [&_input]:duration-200 
                          [&_.input]:h-9 [&_.input]:py-2 [&_.input]:text-sm 
                          [&_button]:transition-all [&_button]:duration-200
                          [&_.h-10]:h-9 [&_.h-12]:h-10
                          [&_.py-2]:py-1.5 [&_.py-3]:py-2
                          [&_.text-base]:text-sm [&_.text-lg]:text-base
                          [&_.space-y-2]:gap-3 [&_.space-y-4]:gap-4
                          [&_.gap-4]:gap-3 [&_.gap-6]:gap-4">
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
          </div>
        </div>
        
        {hasChanges && !saving && (
          <div className="mb-6 transition-all duration-300">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse duration-1000"></div>
                <div className="transition-all duration-200">
                  <p className="text-sm font-medium text-blue-800">
                    You have unsaved changes
                  </p>
                  <p className="text-xs text-blue-600">
                    Review your changes before saving
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sticky bottom-0 bg-white border-t border-slate-200 mt-10 py-4 px-4 shadow-lg z-30 rounded-lg">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={saving}
            className="border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 cursor-pointer"
          >
            <X className="w-4 h-4 mr-2 transition-all duration-200" /> Cancel
          </Button>
          <Button
            onClick={() => setIsConfirmOpen(true)}
            disabled={saving || !hasChanges}
            className="button-styling"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin duration-700" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2 transition-all duration-200" /> Save Changes
              </>
            )}
          </Button>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSave}
        title="Save Product Changes"
        description="Are you sure you want to save these changes to the product?"
        confirmText="Save Changes"
        cancelText="Review Changes"
        confirmButtonColor="bg-[#16a34a] hover:bg-green-700"
      />
    </div>
  );
};

export default ViewProduct;
