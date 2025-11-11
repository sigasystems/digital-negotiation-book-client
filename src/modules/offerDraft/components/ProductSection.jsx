import React from "react";
import { X } from "lucide-react";

const EMPTY_BREAKUP = { size: "", breakup: "", price: "", condition: "" };
const EMPTY_PRODUCT = { productId: "", productName: "", species: "", sizeBreakups: [{ ...EMPTY_BREAKUP }] };

const ProductSection = ({
  productsData= [],
  setFormData,
  productsList = [],
  speciesMap = {},
  onProductSelect,
}) => {
  const updateProductField = (pIndex, field, value) => {
    setFormData(prev => {
      const copy = { ...prev };
      copy.products[pIndex][field] = value;
      return copy;
    });
  };

  const updateBreakup = (pIndex, rIndex, field, value) => {
    setFormData(prev => {
      const copy = { ...prev };
      copy.products[pIndex].sizeBreakups[rIndex][field] = value;
      return copy;
    });
  };

  const addBreakupRow = (pIndex) => {
    setFormData(prev => {
      const copy = { ...prev };
      copy.products[pIndex].sizeBreakups.push({ ...EMPTY_BREAKUP });
      return copy;
    });
  };

  const removeBreakupRow = (pIndex, rIndex) => {
    setFormData(prev => {
      const copy = { ...prev };
      let rows = copy.products[pIndex].sizeBreakups.filter((_, i) => i !== rIndex);
      if (rows.length === 0) rows = [{ ...EMPTY_BREAKUP }];
      copy.products[pIndex].sizeBreakups = rows;
      return copy;
    });
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { ...EMPTY_PRODUCT }],
    }));
  };

  const removeProduct = (pIndex) => {
    setFormData(prev => {
      const copy = { ...prev };
      const products = copy.products.filter((_, i) => i !== pIndex);
      copy.products = products.length > 0 ? products : [{ ...EMPTY_PRODUCT }];
      return copy;
    });
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={addProduct}
          className="px-3 py-1 bg-green-600 text-white rounded-lg cursor-pointer"
        >
          + Add Product
        </button>
      </div>

      {productsData.map((product, pIndex) => {
        const speciesList = speciesMap[product.productId] || (product.species ? [product.species] : []);

        return (
          <div key={pIndex} className="border p-6 rounded-xl bg-gray-50 shadow relative">
            {/* Remove Product Button */}
            <X
              className="absolute top-4 right-4 w-5 h-5 text-red-600 cursor-pointer hover:text-red-800"
                  onClick={() => removeProduct(pIndex)}
            />
            <h3 className="text-lg font-semibold mb-4">Product #{pIndex + 1}</h3>

            {/* Product & Species */}
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-semibold">Product Name</label>
                <select
                  value={product.productId}
                  onChange={(e) => onProductSelect(pIndex, e.target.value)}
                  className="border rounded px-3 py-2 w-full cursor-pointer"
                >
                  <option value="">-- Select Product --</option>
                  {productsList.map((p) => (
                    <option key={p.id} value={p.id}>{p.productName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">Species</label>
                <select
                  value={product.species || ""}
                  disabled={!product.productId}
                  onChange={(e) => updateProductField(pIndex, "species", e.target.value)}
                  className="border rounded px-3 py-2 w-full cursor-pointer"
                >
                  <option value="">-- Select Species --</option>
                  {speciesList.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Size Breakups</h4>
                  <button
                    type="button"
                    onClick={() => addBreakupRow(pIndex)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg"
                  >
                    + Add Row
                  </button>
      </div>

      {/* Desktop Table */}
          <table className="min-w-full border border-gray-200 text-sm hidden sm:table">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Size</th>
              <th className="px-3 py-2 text-left">Condition</th>
              <th className="px-3 py-2 text-left">Breakup</th>
              <th className="px-3 py-2 text-left">Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {product.sizeBreakups.map((row, rIndex) => (
              <tr key={rIndex} className="border-t">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.size}
                    onChange={(e) => updateBreakup(pIndex, rIndex, "size", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
            </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={row.condition}
                    onChange={(e) => updateBreakup(pIndex, rIndex, "condition", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.breakup}
              onChange={(e) => updateBreakup(pIndex, rIndex, "breakup", e.target.value)}
              className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.price}
              onChange={(e) => updateBreakup(pIndex, rIndex, "price", e.target.value)}
              className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                onClick={() => removeBreakupRow(pIndex, rIndex)}
                className="text-red-600 text-sm cursor-pointer"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

  <div className="space-y-3 sm:hidden">
    {product.sizeBreakups.map((row, rIndex) => (
      <div key={rIndex} className="border rounded-lg p-3 bg-white shadow">
            {["size", "condition", "breakup", "price"].map((field) => (
        <div key={field} className="grid grid-cols-2 gap-2 mb-2">
          <label className="text-xs font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            type={field === "breakup" || field === "price" ? "number" : "text"}
            value={row[field]}
                        onChange={(e) => updateBreakup(pIndex, rIndex, field, e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
                    ))}
          <div className="text-right">
            <button
              type="button"
              onClick={() => removeBreakupRow(pIndex, rIndex)}
              className="text-red-600 text-sm cursor-pointer"
            >
              Remove
            </button>
          </div>
          </div>
        ))}

        </div>

      <div className="text-right mt-3 font-semibold">
        Total Breakup:{" "} {product.sizeBreakups.reduce((sum, s) => sum + (parseFloat(s.breakup) || 0), 0)}
      </div>
    </div>

          </div>
        );
      })}

  </div>
);
};

export default ProductSection;
