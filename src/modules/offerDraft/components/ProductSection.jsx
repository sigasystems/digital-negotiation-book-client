import React from "react";
import { InputField } from "@/components/common/InputField";

const ProductSection = ({
  formData,
  handleChange,
  handleBreakupChange,
  addBreakupRow,
  removeBreakupRow,
  total,
}) => (
  <>
    {/* --- Product Info Section --- */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <InputField
        label="Product Name"
        name="productName"
        value={formData.productName}
        onChange={handleChange}
        placeholder="e.g. Atlantic Salmon Fillet"
        required
      />
      <InputField
        label="Species Name"
        name="speciesName"
        value={formData.speciesName}
        onChange={handleChange}
        placeholder="e.g. Salmo salar"
        required
      />
      <InputField
        label="Packing"
        name="packing"
        value={formData.packing}
        onChange={handleChange}
        placeholder="e.g. 10kg box, vacuum packed"
      />
      <InputField
        label="Draft Name"
        name="draftName"
        value={formData.draftName}
        onChange={handleChange}
        placeholder="e.g. Summer Salmon Offer 2025"
      />
      <InputField
        label="Quantity (MT)"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="e.g. 2000"
      />
      <InputField
        label="Tolerance (%)"
        name="tolerance"
        value={formData.tolerance}
        onChange={handleChange}
        placeholder="e.g. ±5%"
      />
      <InputField
        label="Payment Terms"
        name="paymentTerms"
        value={formData.paymentTerms}
        onChange={handleChange}
        placeholder="e.g. 30% advance, 70% before shipment"
      />
      <InputField
        label="Remarks"
        name="remark"
        value={formData.remark}
        onChange={handleChange}
        placeholder="e.g. Subject to final quality check"
      />
      <InputField
        label="Grand Total (USD)"
        name="grandTotal"
        value={formData.grandTotal}
        onChange={handleChange}
        placeholder="e.g. 50000"
      />
    </div>

    {/* --- Size Breakups Section --- */}
    <div className="mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 text-center sm:text-left">
          Size Breakups
        </h3>
        <button
          type="button"
          onClick={addBreakupRow}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition cursor-pointer"
        >
          + Add Row
        </button>
      </div>

      {/* --- Desktop Table Layout --- */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Size</th>
              <th className="px-3 py-2 text-left">Breakup</th>
              <th className="px-3 py-2 text-left">Price (USD/kg)</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {formData.sizeBreakups.map((sb, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                {["size", "breakup", "price"].map((field) => (
                  <td key={field} className="px-3 py-2">
                    <input
                      type={field === "size" ? "text" : "number"}
                      value={sb[field]}
                      onChange={(e) =>
                        handleBreakupChange(idx, field, e.target.value)
                      }
                      placeholder={
                        field === "size"
                          ? "e.g. 2–3 kg"
                          : field === "breakup"
                          ? "e.g. 10"
                          : "e.g. 6.5"
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>
                ))}
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => removeBreakupRow(idx)}
                    type="button"
                    className="text-red-600 hover:underline cursor-pointer text-sm"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-4 font-semibold text-sm sm:text-base">
          Total: <span className="text-indigo-600">{total.toFixed(2)}</span>
        </div>
      </div>

      {/* --- Mobile Card Layout --- */}
      <div className="block sm:hidden mt-6 space-y-4">
        {formData.sizeBreakups.map((sb, idx) => (
          <div
            key={`mobile-${idx}`}
            className="border rounded-xl p-4 bg-white shadow-sm"
          >
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={sb.size}
                onChange={(e) => handleBreakupChange(idx, "size", e.target.value)}
                placeholder="Size (e.g. 2–3 kg)"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm"
              />
              <input
                type="number"
                value={sb.breakup}
                onChange={(e) =>
                  handleBreakupChange(idx, "breakup", e.target.value)
                }
                placeholder="Breakup (e.g. 10)"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm"
              />
              <input
                type="number"
                value={sb.price}
                onChange={(e) =>
                  handleBreakupChange(idx, "price", e.target.value)
                }
                placeholder="Price (e.g. 6.5)"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm"
              />
            </div>
            <button
              onClick={() => removeBreakupRow(idx)}
              type="button"
              className="text-red-600 mt-3 text-sm hover:underline cursor-pointer"
            >
              Remove Row
            </button>
          </div>
        ))}

        {/* ✅ Total visible in mobile view */}
        <div className="text-right mt-4 font-semibold text-sm">
          Total: <span className="text-indigo-600">{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </>
);

export default ProductSection;
