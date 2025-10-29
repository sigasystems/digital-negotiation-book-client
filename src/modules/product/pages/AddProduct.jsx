import React, { useCallback, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Ruler, ArrowLeft, Plus, X, Check } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { InputField } from "@/components/common/InputField";
import { Toast } from "@/components/common/Toast";
import { productService } from "../services";
import { useToast } from "@/app/hooks/useToast";

// 🧩 Reusable size field group
const SizeFields = memo(({ sizes, onChange, onAdd, onRemove }) => {
  const [touched, setTouched] = useState({});

  const handleBlur = (i) => setTouched((prev) => ({ ...prev, [i]: true }));

  return (
    <>
      {sizes.map((s, i) => {
        const showError = i === 0 && touched[i] && !s.trim();
        return (
          <div key={i} className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <input
              type="text"
              value={s}
              onChange={(e) => onChange(i, e.target.value)}
              onBlur={() => handleBlur(i)}
              placeholder={`Size ${i + 1}`}
              required={i === 0}
              autoComplete="off"
              className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 outline-none bg-gray-50 hover:bg-white transition-all ${
                showError
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
            />
            {sizes.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-red-500 hover:text-red-700 transition-all cursor-pointer p-1.5 sm:p-2 hover:bg-red-50 rounded-lg"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={onAdd}
        className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all font-medium flex items-center justify-center sm:justify-start gap-2 cursor-pointer"
      >
        <Plus size={14} className="sm:w-4 sm:h-4" />
        Add Another Size
      </button>
    </>
  );
});

const AddProduct = () => {
  const navigate = useNavigate();
  const { toasts, showToast } = useToast();

  const [products, setProducts] = useState([
    { code: "", productName: "", species: "", size: [""] },
  ]);
  const [loading, setLoading] = useState(false);

  // ✅ Update field inside a product
  const handleChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [name]: value } : p))
    );
  }, []);

  // ✅ Update size within a specific product
  const updateSize = useCallback((productIndex, sizeIndex, value) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === productIndex
          ? { ...p, size: p.size.map((s, j) => (j === sizeIndex ? value : s)) }
          : p
      )
    );
  }, []);

  const addSizeField = useCallback((productIndex) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === productIndex ? { ...p, size: [...p.size, ""] } : p
      )
    );
  }, []);

  const removeSizeField = useCallback((productIndex, sizeIndex) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === productIndex
          ? { ...p, size: p.size.filter((_, j) => j !== sizeIndex) }
          : p
      )
    );
  }, []);

  const addProduct = useCallback(() => {
    if (products.length >= 5) {
      showToast("error", "You can only add up to 5 products at a time.");
      return;
    }
    setProducts((prev) => [
      ...prev,
      { code: "", productName: "", species: "", size: [""] },
    ]);
  }, [products]);

  const removeProduct = useCallback(
    (index) => setProducts((prev) => prev.filter((_, i) => i !== index)),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate all products
    for (const [i, p] of products.entries()) {
      if (!p.code.trim() || !p.productName.trim() || !p.species.trim()) {
        showToast("error", `All fields are required for product ${i + 1}.`);
        return;
      }
      if (!p.size[0]?.trim()) {
        showToast("error", `Product ${i + 1}: first size is required.`);
        return;
      }
    }

    const payload = products.map((p) => ({
      code: p.code,
      productName: p.productName,
      species: p.species,
      size: p.size.filter((s) => s.trim()),
    }));

    setLoading(true);
    try {
      await productService.createProducts(payload);
      showToast("success", "Products added successfully!");
      setProducts([{ code: "", productName: "", species: "", size: [""] }]);
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Failed to add products.";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10 lg:px-8">
      {/* Toasts */}
      <div className="fixed top-4 right-3 sm:right-4 z-50 space-y-2 max-w-[calc(100vw-1.5rem)] sm:max-w-md">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} message={t.message} />
        ))}
      </div>

      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 w-fit hover:translate-x-1 disabled:opacity-50 cursor-pointer text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="font-medium">Back</span>
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 flex items-center gap-2 mb-2">
              Add Products
              {loading && <Spinner className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />}
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">
              Register multiple products under your business (up to 5 at once)
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 overflow-hidden"
        >
          {products.map((p, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-10 md:py-6 bg-gray-50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-indigo-50 rounded-lg text-indigo-600">
                    <Package size={18} className="sm:w-[22px] sm:h-[22px]" />
                  </div>
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                    Product {index + 1}
                  </h2>
                </div>
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-500 hover:text-red-700 transition-all cursor-pointer p-1.5 sm:p-2 hover:bg-red-50 rounded-lg"
                  >
                    <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                )}
              </div>

              {/* Product fields */}
              <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-8 space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <InputField
                    label="Product Code"
                    name="code"
                    value={p.code}
                    onChange={(e) => handleChange(index, e)}
                    required
                    placeholder="Enter unique code"
                    autoComplete="off"
                  />
                  <InputField
                    label="Product Name"
                    name="productName"
                    value={p.productName}
                    onChange={(e) => handleChange(index, e)}
                    required
                    placeholder="Enter product name"
                    autoComplete="off"
                  />
                  <div className="sm:col-span-2">
                    <InputField
                      label="Species"
                      name="species"
                      value={p.species}
                      onChange={(e) => handleChange(index, e)}
                      required
                      placeholder="Enter species name"
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <Ruler size={18} className="sm:w-5 sm:h-5 text-indigo-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Product Sizes
                    </h3>
                  </div>
                  <SizeFields
                    sizes={p.size}
                    onChange={(i, val) => updateSize(index, i, val)}
                    onAdd={() => addSizeField(index)}
                    onRemove={(i) => removeSizeField(index, i)}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Footer Actions */}
          <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-8 bg-gray-50">
            {/* Add Another Product Button */}
            <div className="mb-4 sm:mb-5">
              <button
                type="button"
                onClick={addProduct}
                disabled={products.length >= 5 || loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50 cursor-pointer px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all text-sm sm:text-base"
              >
                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                Add Another Product ({products.length}/5)
              </button>
            </div>

            {/* Submit/Cancel Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 cursor-pointer text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Add Products</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;