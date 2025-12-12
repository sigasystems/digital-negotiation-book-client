import React from "react";
import { Minus } from "lucide-react";

const EMPTY_BREAKUP = { size: "", breakup: "", price: "", condition: "" };
const EMPTY_PRODUCT = {
  productId: "",
  productName: "",
  species: "",
  packing: "",
  sizeBreakups: [{ ...EMPTY_BREAKUP }],
  sizeDetails: "",
  breakupDetails: "",
  priceDetails: "",
};

const ProductSection = ({
  productsData = [],
  setFormData,
  productsList = [],
  speciesMap = {},
  onProductSelect,
}) => {
  const updateProductField = (pIndex, field, value) => {
    setFormData((prev) => {
      const products = prev.products.map((p, i) =>
        i === pIndex ? { ...p, [field]: value } : p,
      );
      return { ...prev, products };
    });
  };

  const updateBreakup = (pIndex, rIndex, field, value) => {
    setFormData((prev) => {
      const products = prev.products.map((p, i) => {
        if (i !== pIndex) return p;
        const sizeBreakups = p.sizeBreakups.map((sb, j) =>
          j === rIndex ? { ...sb, [field]: value } : sb,
        );
        return { ...p, sizeBreakups };
      });
      return { ...prev, products };
    });
  };

  const handleNumberInput = (pIndex, rIndex, field, value) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
    if (sanitizedValue.startsWith("-")) return;
    if (sanitizedValue.split(".").length > 2) return;
    updateBreakup(pIndex, rIndex, field, sanitizedValue);
  };

  const addBreakupRow = (pIndex) => {
    setFormData((prev) => {
      const products = prev.products.map((p, i) =>
        i === pIndex
          ? { ...p, sizeBreakups: [...p.sizeBreakups, { ...EMPTY_BREAKUP }] }
          : p,
      );
      return { ...prev, products };
    });
  };

  const removeBreakupRow = (pIndex, rIndex) => {
    setFormData((prev) => {
      const products = prev.products.map((p, i) => {
        if (i !== pIndex) return p;
        let rows = p.sizeBreakups.filter((_, j) => j !== rIndex);
        if (rows.length === 0) rows = [{ ...EMPTY_BREAKUP }];
        return { ...p, sizeBreakups: rows };
      });
      return { ...prev, products };
    });
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { ...EMPTY_PRODUCT }],
    }));
  };

  const removeProduct = (pIndex) => {
    setFormData((prev) => {
      const products = prev.products.filter((_, i) => i !== pIndex);
      return {
        ...prev,
        products: products.length ? products : [{ ...EMPTY_PRODUCT }],
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={addProduct}
          className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
        >
          + Add Product
        </button>
      </div>

      {productsData.map((product, pIndex) => {
        const speciesList =
          speciesMap[product.productId] ||
          (product.species ? [product.species] : []);

        const totalBreakup = product.sizeBreakups.reduce(
          (sum, s) => sum + (parseFloat(s.breakup) || 0),
          0,
        );

        const totalValue = totalBreakup;

        return (
          <div
            key={pIndex}
            className="border p-6 rounded-xl bg-gray-50 shadow relative"
          >
            <Minus
              className="absolute top-4 right-4 w-5 h-5 text-red-600 cursor-pointer hover:text-red-800"
              onClick={() => removeProduct(pIndex)}
            />

            <h3 className="text-lg font-semibold mb-4">
              Product #{pIndex + 1}
            </h3>

            {/* Product Header Fields */}
            <div className="grid sm:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-sm font-semibold">Product Name</label>
                <select
                  value={product.productId}
                  onChange={(e) => {
                    const selected = productsList.find(
                      (p) => p.id === e.target.value,
                    );
                    updateProductField(pIndex, "productId", e.target.value);
                    updateProductField(
                      pIndex,
                      "productName",
                      selected?.productName || "",
                    );
                    onProductSelect(pIndex, e.target.value);
                  }}
                  className="border rounded px-3 py-2 w-full cursor-pointer"
                >
                  <option value="">-- Select Product --</option>
                  {productsList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.productName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">Species</label>
                <select
                  value={product.species || ""}
                  disabled={!product.productId}
                  onChange={(e) =>
                    updateProductField(pIndex, "species", e.target.value)
                  }
                  className="border rounded px-3 py-2 w-full cursor-pointer"
                >
                  <option value="">-- Select Species --</option>
                  {speciesList.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">Packing</label>
                <input
                  type="text"
                  value={product.packing || ""}
                  onChange={(e) =>
                    updateProductField(pIndex, "packing", e.target.value)
                  }
                  placeholder="Enter packing info"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>

            {/* Desktop Table */}
            <div className="mt-6 hidden sm:block">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Size Breakups</h4>
                <button
                  type="button"
                  onClick={() => addBreakupRow(pIndex)}
                  className="px-2 py-1 bg-[#16a34a] text-white rounded"
                >
                  + Add Row
                </button>
              </div>

              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Size</th>
                    <th className="px-3 py-2 text-left">Condition</th>
                    <th className="px-3 py-2 text-left">Breakup</th>
                    <th className="px-3 py-2 text-left">Price</th>
                    <th />
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={product.sizeDetails}
                        onChange={(e) =>
                          updateProductField(
                            pIndex,
                            "sizeDetails",
                            e.target.value,
                          )
                        }
                        placeholder="Units / Remarks"
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td />
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={product.breakupDetails}
                        onChange={(e) =>
                          updateProductField(
                            pIndex,
                            "breakupDetails",
                            e.target.value,
                          )
                        }
                        placeholder="Breakup Details"
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={product.priceDetails}
                        onChange={(e) =>
                          updateProductField(
                            pIndex,
                            "priceDetails",
                            e.target.value,
                          )
                        }
                        placeholder="₹, $, £"
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td />
                  </tr>
                </thead>

                <tbody>
                  {product.sizeBreakups.map((row, rIndex) => (
                    <tr key={rIndex} className="border-t">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={row.size}
                          onChange={(e) =>
                            updateBreakup(
                              pIndex,
                              rIndex,
                              "size",
                              e.target.value,
                            )
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>

                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={row.condition}
                          onChange={(e) =>
                            updateBreakup(
                              pIndex,
                              rIndex,
                              "condition",
                              e.target.value,
                            )
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>

                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.breakup}
                          onChange={(e) =>
                            handleNumberInput(
                              pIndex,
                              rIndex,
                              "breakup",
                              e.target.value,
                            )
                          }
                          onKeyDown={(e) => e.key === "-" && e.preventDefault()}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>

                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.price}
                          onChange={(e) =>
                            handleNumberInput(
                              pIndex,
                              rIndex,
                              "price",
                              e.target.value,
                            )
                          }
                          onKeyDown={(e) => e.key === "-" && e.preventDefault()}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>

                      <td className="px-3 py-2 text-right">
                        <Minus
                          size={16}
                          className="text-red-600 cursor-pointer"
                          onClick={() => removeBreakupRow(pIndex, rIndex)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Total Row - aligned perfectly under Breakup & Price columns */}
                <tfoot className="bg-gray-100 border-t">
                  <tr>
                    <td />
                    <td />
                    <td className="px-3 py-2 font-semibold">
                      Total Breakup: {totalBreakup}
                    </td>

                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mobile Stacked View */}
            <div className="sm:hidden space-y-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Size Breakups</h4>
                <button
                  type="button"
                  onClick={() => addBreakupRow(pIndex)}
                  className="px-2 py-1 bg-blue-600 text-white rounded"
                >
                  + Add Row
                </button>
              </div>

              {product.sizeBreakups.map((row, rIndex) => (
                <div
                  key={rIndex}
                  className="border rounded p-3 bg-white shadow-sm"
                >
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      value={row.size}
                      placeholder="Size"
                      onChange={(e) =>
                        updateBreakup(pIndex, rIndex, "size", e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                    <input
                      type="text"
                      value={row.condition}
                      placeholder="Condition"
                      onChange={(e) =>
                        updateBreakup(
                          pIndex,
                          rIndex,
                          "condition",
                          e.target.value,
                        )
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                    <input
                      type="number"
                      value={row.breakup}
                      placeholder="Breakup"
                      onChange={(e) =>
                        handleNumberInput(
                          pIndex,
                          rIndex,
                          "breakup",
                          e.target.value,
                        )
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                    <input
                      type="number"
                      value={row.price}
                      placeholder="Price"
                      onChange={(e) =>
                        handleNumberInput(
                          pIndex,
                          rIndex,
                          "price",
                          e.target.value,
                        )
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>

                  <div className="text-right mt-2">
                    <Minus
                      size={18}
                      className="text-red-600 cursor-pointer"
                      onClick={() => removeBreakupRow(pIndex, rIndex)}
                    />
                  </div>
                </div>
              ))}

              {/* MOBILE TOTAL SECTION */}
              <div className="bg-gray-100 p-3 rounded mt-3 text-sm font-semibold">
                Total Breakup: {totalBreakup}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductSection;
