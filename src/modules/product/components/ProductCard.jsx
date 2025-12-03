import React, { memo } from "react";
import { Package, X } from "lucide-react";
import { InputField } from "@/components/common/InputField";
import DynamicInputList from "./DynamicInputList";

const ProductCard = memo(({ index, product, onChange, onRemove, onSpeciesChange, onAddSpecies, onRemoveSpecies, onSizeChange, onAddSize, onRemoveSize }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div className="flex items-center justify-between px-9 py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <Package size={18} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
            Product {index + 1}
          </h2>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 transition-all cursor-pointer p-1.5 sm:p-2 hover:bg-red-50 rounded-lg"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        )}
      </div>

      <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-8 space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <InputField
            label="Product Code"
            name="code"
            value={product.code}
            onChange={(e) => onChange(index, e)}
            required
            placeholder="Enter unique code"
          />
          <InputField
            label="Product Name"
            name="productName"
            value={product.productName}
            onChange={(e) => onChange(index, e)}
            required
            placeholder="Enter product name"
          />
        </div>

        <DynamicInputList
          label="Species"
          items={product.species}
          onChange={(i, val) => onSpeciesChange(index, i, val)}
          onAdd={() => onAddSpecies(index)}
          onRemove={(i) => onRemoveSpecies(index, i)}
        />

        <DynamicInputList
          label="Size"
          items={product.size}
          onChange={(i, val) => onSizeChange(index, i, val)}
          onAdd={() => onAddSize(index)}
          onRemove={(i) => onRemoveSize(index, i)}
        />
      </div>
    </div>
  );
});

export default ProductCard;
