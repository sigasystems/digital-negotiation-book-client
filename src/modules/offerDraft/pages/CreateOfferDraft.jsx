import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { offerDraftServices } from "../services";
import { InputField } from "@/components/common/InputField";

import Header from "../components/Header";
import Section from "../components/Section";
import ReadOnlyField from "../components/ReadOnlyField";
// import DatePicker from "../components/DatePicker";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";

const REQUIRED_FIELDS = [
  "fromParty",
  "origin",
  "plantApprovalNumber",
  "brand",
  "productName",
  "speciesName",
];

const EMPTY_BREAKUP = { size: "", breakup: "", price: "" };

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
    () =>
      formData.sizeBreakups.reduce(
        (sum, s) => sum + (parseFloat(s.breakup) || 0),
        0
      ),
    [formData.sizeBreakups]
  );

  /* ---------------- HANDLERS ---------------- */
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
      return {
        ...prev,
        sizeBreakups: updated.length ? updated : [{ ...EMPTY_BREAKUP }],
      };
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
      if (!formData[f]?.trim())
        return `${f.replace(/([A-Z])/g, " $1")} is required`;

    for (const [i, s] of formData.sizeBreakups.entries()) {
      if (!s.size || !s.breakup || !s.price)
        return `All fields required in size breakup row ${i + 1}`;
      if (isNaN(+s.breakup) || isNaN(+s.price))
        return `Breakup/Price must be numeric in row ${i + 1}`;
    }

    const grand = +formData.grandTotal;
    if (isNaN(grand)) return "Grand total must be numeric.";
    if (grand !== total)
      return `Grand Total (${grand}) must equal Total (${total}).`;

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
        shipmentDate: formData.shipmentDate
          ? new Date(formData.shipmentDate)
          : null,
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

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Header onBack={() => (window.location.href = "/dashboard")} />

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* BUSINESS INFORMATION */}
          <Section title="🏢 Business Information">
            <div className="grid sm:grid-cols-2 gap-6">
              <ReadOnlyField
                label="From Party"
                value={formData.fromParty}
                placeholder="e.g. Arctic Seafood Ltd (auto-filled)"
              />
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
                placeholder="e.g. Oceanic Foods Pvt. Ltd."
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

          {/* DRAFT DETAILS + PRODUCT SECTION */}
          <Section title="📝 Draft Details">
            <ProductSection
              formData={formData}
              handleChange={handleChange}
              handleBreakupChange={handleBreakupChange}
              addBreakupRow={addBreakupRow}
              removeBreakupRow={removeBreakupRow}
              total={total}
              handleDateSelect={handleDateSelect}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
            />
          </Section>

          {/* FOOTER */}
          <Footer loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default CreateOfferDraft;
