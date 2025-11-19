import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Check, ArrowLeft } from "lucide-react";
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
  const [remainingProducts, setRemainingProducts] = useState(0);

  // Fetch plan usage on mount
  useEffect(() => {
    const fetchPlanUsage = async () => {
      try {
        await planUsageService.fetchUsage(user.id);
        const remaining = planUsageService.getRemainingCredits("products");
        setRemainingProducts(remaining);
      } catch (err) {
        console.error("Failed to fetch plan usage:", err);
        showToast("error", "Failed to load plan info.");
      }
    };
    fetchPlanUsage();
  }, [user.id]);

  // Input change handlers
  const handleChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [name]: value } : p))
    );
  }, []);

  const updateFieldArray = useCallback((productIndex, field, index, value) => {
    setProducts((prev) =>
      prev.map((p, i) => {
        if (i !== productIndex) return p;
        return {
          ...p,
          [field]: p[field].map((v, j) => (j === index ? value : v)),
        };
      })
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

  // Add/remove product
  const addProduct = () => {
    const currentTotal = products.length;
    if (currentTotal >= remainingProducts)
      return showToast(
        "error",
        `You can only add up to ${remainingProducts} products based on your plan.`
      );

    setProducts((prev) => [
      ...prev,
      { code: "", productName: "", species: [""], size: [""] },
    ]);
  };

  const removeProduct = (index) =>
    setProducts((prev) => prev.filter((_, i) => i !== index));

  // Form submission
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
      // Refresh remaining credits
      await planUsageService.fetchUsage(user.id, true);
      const remaining = planUsageService.getRemainingCredits("products");
      setRemainingProducts(remaining);
    } catch (err) {
      if (err?.response?.status === 403 && err.response.data?.type) {
        const { type, used, max } = err.response.data;
        showToast(
          "error",
          `You have reached your ${type} limit: ${used}/${max}. Please upgrade your plan.`
        );
      } else {
        showToast(
          "error",
          err?.response?.data?.message || "Failed to add products."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Toasts */}
      <div className="fixed top-4 right-3 sm:right-4 z-50 space-y-2 max-w-[calc(100vw-1.5rem)] sm:max-w-md">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} message={t.message} />
        ))}
      </div>

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSubmit}
        title="Confirm Product Addition"
        description="Are you sure you want to add these products?"
        confirmText="Yes, Add Products"
        cancelText="Cancel"
        confirmButtonColor="bg-indigo-600 hover:bg-indigo-700"
      />

      <div className="max-w-5xl mx-auto w-full">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium mb-4 cursor-pointer"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Remaining credits info */}
        <div className="mb-4 px-4 py-2 bg-blue-50 text-blue-800 rounded-lg font-medium">
          Credits Remaining:{" "}
          <strong>{remainingProducts}</strong>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
        >
          {products.map((p, i) => (
            <ProductCard
              key={i}
              index={i}
              product={p}
              onChange={handleChange}
              onRemove={removeProduct}
              onSpeciesChange={(productIndex, speciesIndex, value) =>
                updateFieldArray(productIndex, "species", speciesIndex, value)
              }
              onAddSpecies={(productIndex) => addFieldArray(productIndex, "species")}
              onRemoveSpecies={(productIndex, speciesIndex) =>
                removeFieldArray(productIndex, "species", speciesIndex)
              }
              onSizeChange={(productIndex, sizeIndex, value) =>
                updateFieldArray(productIndex, "size", sizeIndex, value)
              }
              onAddSize={(productIndex) => addFieldArray(productIndex, "size")}
              onRemoveSize={(productIndex, sizeIndex) =>
                removeFieldArray(productIndex, "size", sizeIndex)
              }
            />
          ))}

          {/* Footer */}
          <div className="px-6 py-6 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={addProduct}
              disabled={products.length >= remainingProducts}
              className="px-5 py-2 text-indigo-600 font-medium hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
            >
              <Plus size={16} /> Add Another Product ({products.length}/{remainingProducts})
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Spinner size="sm" variant="light" /> : <Check size={16} />}
              {loading ? "Adding..." : "Add Products"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
