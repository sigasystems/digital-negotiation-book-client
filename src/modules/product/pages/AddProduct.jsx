import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Check, ArrowLeft, Package } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Toast } from "@/components/common/Toast";
import { useToast } from "@/app/hooks/useToast";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ProductCard from "../components/ProductCard";
import { productService } from "../services";
import planUsageService from "@/services/planUsageService";

const AddProduct = () => {
  const navigate = useNavigate();
  const { toasts, showToast } = useToast();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [products, setProducts] = useState([
    { code: "", productName: "", species: [""], size: [""] },
  ]);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [remainingProducts, setRemainingProducts] = useState(null);

  useEffect(() => {
    const fetchPlanUsage = async () => {
      try {
        await planUsageService.fetchUsage(user.id);
        const remaining = planUsageService.getRemainingCredits("products");
        setRemainingProducts(remaining);
      } catch {
        showToast("error", "Failed to load plan info.");
      }
    };
    fetchPlanUsage();
  }, [user.id]);

  const handleChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [name]: value } : p))
    );
  }, []);

  const updateFieldArray = useCallback((productIndex, field, index, value) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === productIndex
          ? { ...p, [field]: p[field].map((v, j) => (j === index ? value : v)) }
          : p
      )
    );
  }, []);

  const addFieldArray = useCallback((productIndex, field) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === productIndex ? { ...p, [field]: [...p[field], ""] } : p
      )
    );
  }, []);

  const removeFieldArray = useCallback((productIndex, field, index) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === productIndex
          ? { ...p, [field]: p[field].filter((_, j) => j !== index) }
          : p
      )
    );
  }, []);

  const addProduct = () => {    if (remainingProducts !== null && products.length >= remainingProducts) {
      return showToast(
        "error",
        `You can only add up to ${remainingProducts} products based on your plan.`
      );
    }

    setProducts((prev) => [
      ...prev,
      { code: "", productName: "", species: [""], size: [""] },
    ]);
  };

  const removeProduct = (index) =>
    setProducts((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const [i, p] of products.entries()) {
      if (!p.code.trim() || !p.productName.trim())
        return showToast("error", `Product ${i + 1}: All fields required.`);
      if (!p.species[0]?.trim())
        return showToast(
          "error",
          `Product ${i + 1}: At least one species required.`
        );
      if (!p.size[0]?.trim())
        return showToast("error", `Product ${i + 1}: At least one size required.`);
    }
    setIsConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    setIsConfirmOpen(false);
    const payload = products.map((p) => ({
      code: p.code.trim(),
      productName: p.productName.trim(),
      species: p.species.filter((s) => s.trim()),
      size: p.size.filter((s) => s.trim()),
    }));

    try {
      setLoading(true);
      await productService.createProducts(payload);
      showToast("success", "Products added successfully!");
      setProducts([{ code: "", productName: "", species: [""], size: [""] }]);
    } catch (err) {
      if (err?.response?.status === 403 && err.response.data?.type) {
        const { type, used, max } = err.response.data;
        return showToast(
          "error",
          `You have reached your ${type} limit: ${used}/${max}. Please upgrade your plan.`
        );
      }
      showToast("error", err?.response?.data?.message || "Failed to add products.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Spinner className="w-8 h-8 text-indigo-600 mb-3" />
          <p className="text-slate-700 font-medium">Adding products...</p>
        </div>
      )}

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} message={t.message} />
        ))}
      </div>

      <header className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer inline-flex items-center text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>

          <div className="flex items-center gap-3 ml-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Add Products
                </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                  Create new product entries
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto py-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="divide-y divide-slate-200">
            {products.map((p, i) => (
              <ProductCard
                key={i}
                index={i}
                product={p}
                onChange={handleChange}
                onRemove={removeProduct}
                onSpeciesChange={(pi, si, val) =>
                  updateFieldArray(pi, "species", si, val)
                }
                onAddSpecies={(pi) => addFieldArray(pi, "species")}
                onRemoveSpecies={(pi, si) =>
                  removeFieldArray(pi, "species", si)
                }
                onSizeChange={(pi, si, val) =>
                  updateFieldArray(pi, "size", si, val)
                }
                onAddSize={(pi) => addFieldArray(pi, "size")}
                onRemoveSize={(pi, si) =>
                  removeFieldArray(pi, "size", si)
                }
              />
            ))}
          </div>

            <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={addProduct}
                disabled={products.length >= 5}
                className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${
                  products.length >= 5
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:text-indigo-700"
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Product ({products.length}/5)
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Add Products
                  </>
                )}
              </button>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSubmit}
        title="Confirm Add"
        description="Are you sure you want to add these products?"
        confirmText="Yes, Add"
        cancelText="Cancel"
        confirmButtonColor="bg-indigo-600 hover:bg-indigo-700"
      />
    </div>
  );
};

export default AddProduct;
