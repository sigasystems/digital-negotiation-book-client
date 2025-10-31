import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { offerDraftServices } from "../services";
import { Spinner } from "@/components/ui/spinner";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

/* ---------------------- CONSTANTS ---------------------- */
const REQUIRED_FIELDS = ["fromParty", "origin", "plantApprovalNumber", "brand", "productName", "speciesName"];
const EMPTY_BREAKUP = { size: "", breakup: "", price: "" };

/* ---------------------- COMPONENT ---------------------- */
const CreateOfferDraft = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const initialForm = useMemo(
    () => ({
      businessOwnerId: user?.businessOwnerId || "",
      fromParty: user?.businessName || "",
      origin: "",
      processor: "",
      plantApprovalNumber: "",
      brand: "",
      draftName: "",
      offerValidityDate: "",
      shipmentDate: "",
      grandTotal: "",
      quantity: "",
      tolerance: "",
      paymentTerms: "",
      remark: "",
      productName: "",
      speciesName: "",
      packing: "",
      sizeBreakups: [EMPTY_BREAKUP],
    }),
    [user]
  );

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [openPicker, setOpenPicker] = useState({ validity: false, shipment: false });

  const total = useMemo(
    () => formData.sizeBreakups.reduce((sum, s) => sum + (parseFloat(s.breakup) || 0), 0),
    [formData.sizeBreakups]
  );

  /* ---------------------- HANDLERS ---------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBreakupChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.sizeBreakups];
      if (!updated[index]) return prev;
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sizeBreakups: updated };
    });
  };

  const addBreakupRow = () =>
    setFormData((prev) => ({
      ...prev,
      sizeBreakups: [...prev.sizeBreakups, { ...EMPTY_BREAKUP }],
    }));

  const removeBreakupRow = (index) =>
    setFormData((prev) => {
      const updated = prev.sizeBreakups.filter((_, i) => i !== index);
      return { ...prev, sizeBreakups: updated.length ? updated : [{ ...EMPTY_BREAKUP }] };
    });

  const handleDateSelect = (key, date) => {
    if (!date) return;
    setFormData((prev) => ({ ...prev, [key]: format(date, "yyyy-MM-dd") }));
    setOpenPicker((prev) => ({
      ...prev,
      [key === "offerValidityDate" ? "validity" : "shipment"]: false,
    }));
  };

  const validateForm = () => {
    for (const f of REQUIRED_FIELDS)
      if (!formData[f]?.trim()) return `${f.replace(/([A-Z])/g, " $1")} is required`;
    for (const [i, s] of formData.sizeBreakups.entries()) {
      if (!s.size || !s.breakup || !s.price)
        return `All fields required in size breakup row ${i + 1}`;
      if (isNaN(+s.breakup) || isNaN(+s.price))
        return `Breakup/Price must be numeric in row ${i + 1}`;
    }
    const grand = +formData.grandTotal;
    if (isNaN(grand)) return "Grand total must be numeric.";
    if (grand !== total) return `Grand Total (${grand}) must equal Total (${total}).`;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return toast.error(error);

    setLoading(true);
    try {
      const payload = {
        ...formData,
        total,
        grandTotal: +formData.grandTotal,
        offerValidityDate: formData.offerValidityDate
          ? new Date(formData.offerValidityDate)
          : null,
        shipmentDate: formData.shipmentDate ? new Date(formData.shipmentDate) : null,
        sizeBreakups: formData.sizeBreakups.map((s) => ({
          size: s.size,
          breakup: +s.breakup,
          price: +s.price,
        })),
      };

      const res = await offerDraftServices.createDraft(payload);
      if (res?.status === 201 || res?.data?.success) {
        toast.success("Offer draft created successfully!");
        setFormData(initialForm);
      } else {
        toast.error(res?.data?.message || "Failed to create draft.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating draft.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Header onBack={() => (window.location.href = "/dashboard")} />
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <Section title="🏢 Business Information">
            <div className="grid sm:grid-cols-2 gap-6">
              <ReadOnlyField label="From Party" value={formData.fromParty} />
              <InputField
                label="Origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g. Norway"
                required
              />
              <InputField
                label="Processor"
                name="processor"
                value={formData.processor}
                onChange={handleChange}
                placeholder="e.g. Oceanic Foods Ltd"
              />
              <InputField
                label="Plant Approval Number"
                name="plantApprovalNumber"
                value={formData.plantApprovalNumber}
                onChange={handleChange}
                placeholder="e.g. PL-10234"
                required
              />
              <InputField
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. ArcticFresh"
                required
              />
            </div>
          </Section>

          <Section title="📝 Draft Details">
            <div className="grid sm:grid-cols-2 gap-6">
              <InputField
                label="Draft Name"
                name="draftName"
                value={formData.draftName}
                onChange={handleChange}
                placeholder="e.g. Summer Salmon Offer 2025"
              />
              <DatePicker
                label="Offer Validity Date"
                value={formData.offerValidityDate}
                onSelect={(d) => handleDateSelect("offerValidityDate", d)}
                open={openPicker.validity}
                setOpen={(v) => setOpenPicker({ ...openPicker, validity: v })}
              />
              <DatePicker
                label="Shipment Date"
                value={formData.shipmentDate}
                onSelect={(d) => handleDateSelect("shipmentDate", d)}
                open={openPicker.shipment}
                setOpen={(v) => setOpenPicker({ ...openPicker, shipment: v })}
              />
              <InputField
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 2000 MT"
              />
              <InputField
                label="Tolerance"
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
                placeholder="e.g. 30% advance, 70% on delivery"
              />
              <InputField
                label="Remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                placeholder="e.g. Subject to final quality check"
              />
              <InputField
                label="Grand Total"
                name="grandTotal"
                value={formData.grandTotal}
                onChange={handleChange}
                placeholder="e.g. 50000"
                required
              />
            </div>
          </Section>

          <Section title="📦 Product Information">
            <ProductSection
              formData={formData}
              handleChange={handleChange}
              handleBreakupChange={handleBreakupChange}
              addBreakupRow={addBreakupRow}
              removeBreakupRow={removeBreakupRow}
              total={total}
            />
          </Section>

          <Footer loading={loading} />
        </form>
      </div>
    </div>
  );
};

/* ---------------------- SUB COMPONENTS ---------------------- */
const Header = ({ onBack }) => (
  <div className="flex flex-col gap-4 mb-8">
    <button
      onClick={onBack}
      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg w-fit text-gray-800 cursor-pointer"
    >
      ← Back
    </button>
    <h1 className="text-3xl font-bold text-gray-900">Create Offer Draft</h1>
    <p className="text-gray-700 text-sm">
      Fill in the details to create a new offer draft.
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="px-6 py-8 border-b border-gray-200">
    <h2 className="text-xl font-bold mb-6 text-gray-900">{title}</h2>
    {children}
  </div>
);

const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      value={value}
      readOnly
      className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
    />
  </div>
);

const DatePicker = ({ label, value, onSelect, open, setOpen }) => (
  <div className="flex flex-col">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal cursor-pointer"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPP") : "Select a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  </div>
);

const ProductSection = ({
  formData,
  handleChange,
  handleBreakupChange,
  addBreakupRow,
  removeBreakupRow,
  total,
}) => (
  <>
    <div className="grid sm:grid-cols-2 gap-6">
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
    </div>

    <div className="mt-8">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Size Breakups</h3>
        <button
          type="button"
          onClick={addBreakupRow}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
        >
          + Add Row
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Size</th>
              <th className="px-4 py-2 text-left">Breakup</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {formData.sizeBreakups.map((sb, idx) => (
              <tr key={idx} className="border-t">
                {["size", "breakup", "price"].map((field) => (
                  <td key={field} className="px-4 py-2">
                    <input
                      type={field === "size" ? "text" : "number"}
                      value={sb[field]}
                      onChange={(e) =>
                        handleBreakupChange(idx, field, e.target.value)
                      }
                      placeholder={
                        field === "size"
                          ? "e.g. 2-3 kg"
                          : field === "breakup"
                          ? "e.g. 10"
                          : "e.g. 6.5"
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </td>
                ))}
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => removeBreakupRow(idx)}
                    type="button"
                    className="text-red-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right mt-4 font-semibold">
          Total: <span className="text-indigo-600">{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </>
);

const Footer = ({ loading }) => (
  <div className="px-6 py-6 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3">
    <button
      type="button"
      onClick={() => (window.location.href = "/dashboard")}
      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={loading}
      className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-70 cursor-pointer"
    >
      {loading ? (
        <>
          <Spinner className="size-4" /> Saving...
        </>
      ) : (
        "✓ Create Draft"
      )}
    </button>
  </div>
);

export default CreateOfferDraft;
