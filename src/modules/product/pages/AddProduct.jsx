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
          <div key={i} className="flex items-center gap-3 mb-4">
            <input
              type="text"
              value={s}
              onChange={(e) => onChange(i, e.target.value)}
              onBlur={() => handleBlur(i)}
              placeholder={`Size ${i + 1}`}
              required={i === 0}
              autoComplete="off"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none bg-gray-50 hover:bg-white transition-all ${
                showError
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
            />
            {sizes.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-red-500 hover:text-red-700 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={onAdd}
        className="px-4 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all font-medium flex items-center gap-2 cursor-pointer"
      >
        <Plus size={16} />
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
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} message={t.message} />
        ))}
      </div>

      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 w-fit hover:translate-x-1 disabled:opacity-50 cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="font-medium hidden sm:inline">Back to Dashboard</span>
            <span className="font-medium sm:hidden">Back</span>
          </button>

          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 flex items-center gap-2">
            Add Products (up to 5)
            {loading && <Spinner className="w-5 h-5 text-indigo-600" />}
          </h1>
          <p className="text-gray-600 text-sm">Register multiple products under your business.</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
        >
          {products.map((p, index) => (
            <div key={index} className="border-b border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between px-6 sm:px-10 py-6 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                    <Package size={22} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Product {index + 1}
                  </h2>
                </div>
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-500 hover:text-red-700 transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Product fields */}
              <div className="px-6 sm:px-10 py-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    label="Product Code"
                    name="code"
                    value={p.code}
                    onChange={(e) => handleChange(index, e)}
                    required
                    placeholder="Enter unique product code"
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

                {/* Sizes */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Ruler size={20} className="text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
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

          {/* Add Another Product */}
          <div className="px-6 sm:px-10 py-8 flex justify-between items-center bg-gray-50">
            <button
              type="button"
              onClick={addProduct}
              disabled={products.length >= 5 || loading}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50 cursor-pointer"
            >
              <Plus size={18} />
              Add Another Product
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
