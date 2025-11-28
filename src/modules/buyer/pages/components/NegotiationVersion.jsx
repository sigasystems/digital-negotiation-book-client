import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Users, Tag, Building, DollarSign, Calendar, FileText } from "lucide-react";
import ProductSection from "@/modules/offerDraft/components/ProductSection";

export const NegotiationVersion = ({
  item,
  index,
  isActive,
  totalVersions,
  onFieldUpdate,
  onProductSelect,
  setFormData,
  productsList,
  speciesMap
}) => {
  const fieldConfigs = [
    { label: "From Party", field: "fromParty", icon: Users },
    { label: "To Party", field: "toParty", icon: Users },
    { label: "Product Name", field: "productName", icon: Package },
    { label: "Species Name", field: "speciesName", icon: Tag },
    { label: "Brand", field: "brand", icon: Building },
    { label: "Plant Approval", field: "plantApprovalNumber", icon: Building },
    { label: "Quantity", field: "quantity", icon: Package },
    { label: "Tolerance", field: "tolerance", icon: Tag },
    { label: "Payment Terms", field: "paymentTerms", icon: DollarSign },
  ];

  return (
    <Card className={`shadow-lg border-2 transition-all duration-300 ${
      isActive 
        ? "border-blue-500 ring-2 ring-blue-100" 
        : "border-slate-200 hover:border-slate-300"
    }`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                Version {item.versionNo}
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {index === totalVersions - 1 ? 'Latest' : 'Historical'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Created {new Date(item.createdAt).toLocaleString()}
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {item.grandTotal}
            </div>
            <div className="text-sm text-slate-500">Grand Total</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <FormFieldsGrid
          item={item}
          fieldConfigs={fieldConfigs}
          onFieldUpdate={onFieldUpdate}
        />

        <RemarkSection 
          value={item.remark ?? ""} 
          onChange={(value) => onFieldUpdate("remark", value)} 
        />

        <Separator />

        <ProductDetailsSection
          productsData={item.products}
          setFormData={setFormData}
          productsList={productsList}
          speciesMap={speciesMap}
          onProductSelect={onProductSelect}
        />
      </CardContent>
    </Card>
  );
};

const FormFieldsGrid = ({ item, fieldConfigs, onFieldUpdate }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {fieldConfigs.map(({ label, field, icon: Icon }) => (
      <FormField
        key={field}
        icon={Icon}
        label={label}
        value={item[field] ?? ""}
        onChange={(value) => onFieldUpdate(field, value)}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    ))}
    
    <FormField
      icon={DollarSign}
      label="Grand Total"
      value={item.grandTotal ?? ""}
      onChange={(value) => onFieldUpdate("grandTotal", value)}
      placeholder="0.00"
      isGreen
    />
    
    <FormField
      icon={Calendar}
      label="Shipment Date"
      value={(item.shipmentDate && item.shipmentDate.split?.("T")?.[0]) || ""}
      onChange={(value) => onFieldUpdate("shipmentDate", value)}
      type="date"
    />
  </div>
);

const FormField = ({ icon: Icon, label, value, onChange, placeholder, type = "text", isGreen = false }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
      <Icon className="w-4 h-4 text-slate-500" />
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        isGreen 
          ? "border-green-300 bg-green-50 font-bold text-green-700 focus:ring-green-500 focus:border-green-500" 
          : "border-slate-300 bg-white"
      }`}
      placeholder={placeholder}
    />
  </div>
);

const RemarkSection = ({ value, onChange }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
      <FileText className="w-4 h-4 text-slate-500" />
      Remark
    </label>
    <textarea
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none"
      placeholder="Add any additional remarks or notes..."
    />
  </div>
);

const ProductDetailsSection = ({ productsData, setFormData, productsList, speciesMap, onProductSelect }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Package className="w-5 h-5 text-blue-600" />
      <h3 className="text-lg font-semibold text-slate-800">Product Details</h3>
    </div>
    <ProductSection
      productsData={productsData}
      setFormData={setFormData}
      productsList={productsList}
      speciesMap={speciesMap}
      onProductSelect={onProductSelect}
    />
  </div>
);