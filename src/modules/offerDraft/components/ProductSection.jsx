import React from "react";
const EMPTY_BREAKUP = { size: "", breakup: "", price: "" };

const ProductSection = ({
  productsData= [],
  setFormData,
  productsList = [],
  speciesMap = {},
  onProductSelect,
  readOnly,
}) => {

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        {
          productId: "",
          species: "",
          sizeBreakups: [{ ...EMPTY_BREAKUP }],
        }
      ]
    }));
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const updateProductField = (pIndex, field, value) => {
    setFormData(prev => {
      const copy = [...prev.products];
      copy[pIndex][field] = value;
      return { ...prev, products: copy };
    });
  };

  const addBreakupRow = (pIndex) => {
    setFormData(prev => {
      const copy = [...prev.products];
      copy[pIndex].sizeBreakups.push({ ...EMPTY_BREAKUP });
      return { ...prev, products: copy };
    });
  };

  const removeBreakupRow = (pIndex, rIndex) => {
    setFormData(prev => {
      const copy = [...prev.products];
      const updated = copy[pIndex].sizeBreakups.filter((_, i) => i !== rIndex);
      copy[pIndex].sizeBreakups = updated.length ? updated : [{ ...EMPTY_BREAKUP }];
      return { ...prev, products: copy };
    });
  };

  const updateBreakup = (pIndex, rIndex, field, value) => {
    setFormData(prev => {
      const copy = [...prev.products];
      copy[pIndex].sizeBreakups[rIndex][field] = value;
      return { ...prev, products: copy };
    });
  };

  return (
    <div className="space-y-10">

      {!readOnly && (
        <button
          type="button"
          onClick={addProduct}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          + Add Product
        </button>
      )}

      {productsData.map((product, pIndex) => {
        const speciesList = speciesMap[product.productId] || [];

        return (
          <div key={pIndex} className="border p-6 rounded-xl bg-gray-50 shadow">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Product #{pIndex + 1}</h3>

              {!readOnly && pIndex > 0 && (
                <button
                  type="button"
                  onClick={() => removeProduct(pIndex)}
                  className="text-red-600 hover:underline cursor-pointer"
                >
                  Remove Product
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">

              <div>
                <label className="text-sm font-medium">Select Product</label>
                <select
                  value={product.productId}
                  disabled={readOnly}
                  onChange={(e) => onProductSelect(pIndex, e.target.value)}
                  className="w-full mt-1 border rounded-lg px-3 py-2 cursor-pointer"
                >
                  <option value="">-- Select Product --</option>
                  {productsList.map((p) => (
                    <option key={p.id} value={p.id} className="cursor-pointer">{p.productName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Select Species</label>
                <select
                  value={product.species}
                  disabled={!product.productId || readOnly}
                  onChange={(e) => updateProductField(pIndex, "species", e.target.value)}
                  className="w-full mt-1 border rounded-lg px-3 py-2 cursor-pointer "
                >
                  <option value="">-- Select Species --</option>
                  {speciesList.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>

            </div>
                  <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Size Breakups</h4>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => addBreakupRow(pIndex)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg cursor-pointer"
                  >
                    + Add Row
                  </button>
                )}
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
                    disabled={readOnly}
                    onChange={(e) => updateBreakup(pIndex, rIndex, "size", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
            </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={row.condition || ""}
                    disabled={readOnly}
                    onChange={(e) => updateBreakup(pIndex, rIndex, "condition", e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.breakup}
              disabled={readOnly}
              onChange={(e) => updateBreakup(pIndex, rIndex, "breakup", e.target.value)}
              className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.price}
              disabled={readOnly}
              onChange={(e) => updateBreakup(pIndex, rIndex, "price", e.target.value)}
              className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                <td className="px-3 py-2 text-right">
                    {!readOnly && (
                  <button
                    type="button"
                onClick={() => removeBreakupRow(pIndex, rIndex)}
                className="text-red-600 text-sm cursor-pointer"
                  >
                    Remove
                  </button>
                )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

  <div className="space-y-3 sm:hidden">
    {product.sizeBreakups.map((row, rIndex) => (
      <div key={rIndex} className="border rounded-lg p-3 bg-white shadow">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <label className="text-xs font-semibold">Size</label>
          <input
            type="text"
            value={row.size}
            disabled={readOnly}
            onChange={(e) => updateBreakup(pIndex, rIndex, "size", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
          <label className="text-xs font-semibold">Condition</label>
              <input
                type="text"
                value={row.condition || ""}
            disabled={readOnly}
            onChange={(e) => updateBreakup(pIndex, rIndex, "condition", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <label className="text-xs font-semibold">Breakup</label>
              <input
                type="number"
                value={row.breakup}
            disabled={readOnly}
            onChange={(e) => updateBreakup(pIndex, rIndex, "breakup", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <label className="text-xs font-semibold">Price</label>
              <input
                type="number"
                value={row.price}
            disabled={readOnly}
            onChange={(e) => updateBreakup(pIndex, rIndex, "price", e.target.value)}
            className="border rounded px-2 py-1 w-full"
              />
            </div>
        {!readOnly && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => removeBreakupRow(pIndex, rIndex)}
              className="text-red-600 text-sm cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
          </div>
        ))}

        </div>

      <div className="text-right mt-3 font-semibold">
        Total: {product.sizeBreakups.reduce((sum, s) => sum + (parseFloat(s.breakup) || 0), 0)}
      </div>
    </div>

          </div>
        );
      })}

  </div>
);
};

export default ProductSection;
