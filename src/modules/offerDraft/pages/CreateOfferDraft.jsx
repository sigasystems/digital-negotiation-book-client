import React, { useState, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { offerDraftService } from "../services";

import Header from "../components/Header";
import Section from "../components/Section";
import ReadOnlyField from "../components/ReadOnlyField";
import { InputField } from "@/components/common/InputField";
import DatePicker from "../components/DatePicker";
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

  const validateForm = (formData, total) => {
    for (const field of REQUIRED_FIELDS) {
      if (!formData[field]?.trim())
        return `${field.replace(/([A-Z])/g, " $1")} is required`;
    }

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

  const validateDates = (offerValidityDate, shipmentDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (offerValidityDate && offerValidityDate < today)
      return "Offer validity date cannot be earlier than today.";

    if (shipmentDate && shipmentDate < today)
      return "Shipment date cannot be earlier than today.";

    if (shipmentDate && offerValidityDate && shipmentDate < offerValidityDate)
      return "Shipment date cannot be earlier than the offer validity date.";

    return null;
  };

  const formatPayload = (formData, total) => ({
    ...formData,
    total,
    grandTotal: +formData.grandTotal,
    offerValidityDate: formData.offerValidityDate
      ? format(new Date(formData.offerValidityDate), "yyyy-MM-dd")
      : null,
    shipmentDate: formData.shipmentDate
      ? format(new Date(formData.shipmentDate), "yyyy-MM-dd")
      : null,
    sizeBreakups: formData.sizeBreakups.map((s) => ({
      size: s.size,
      breakup: +s.breakup,
      price: +s.price,
    })),
  });

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
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBreakupChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.sizeBreakups];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sizeBreakups: updated };
    });
  }, []);

  const handleAddRow = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      sizeBreakups: [...prev.sizeBreakups, { ...EMPTY_BREAKUP }],
    }));
  }, []);

  const handleRemoveRow = useCallback((index) => {
    setFormData((prev) => {
      const updated = prev.sizeBreakups.filter((_, i) => i !== index);
      return {
        ...prev,
        sizeBreakups: updated.length ? updated : [{ ...EMPTY_BREAKUP }],
      };
    });
  }, []);

  const handleDateSelect = useCallback((key, date) => {
    if (!date) return;
    setFormData((prev) => ({ ...prev, [key]: format(date, "yyyy-MM-dd") }));
    setOpenPicker((prev) => ({
      ...prev,
      [key === "offerValidityDate" ? "validity" : "shipment"]: false,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formError = validateForm(formData, total);
    if (formError) return toast.error(formError);

    const offerDate = formData.offerValidityDate
      ? new Date(formData.offerValidityDate)
      : null;
    const shipDate = formData.shipmentDate
      ? new Date(formData.shipmentDate)
      : null;

    const dateError = validateDates(offerDate, shipDate);
    if (dateError) return toast.error(dateError);

    setLoading(true);
    try {
      const payload = formatPayload(formData, total);
      const res = await offerDraftService.createDraft(payload);
      console.log("res",res)
      if (res?.data?.data?.error) {
        toast.error(res.data.data?.error);
        return;
      }

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

          <Section title="📅 Dates">
            <div className="grid sm:grid-cols-2 gap-6">
              <DatePicker
                label="Offer Validity Date"
                value={formData.offerValidityDate}
                onSelect={(date) => handleDateSelect("offerValidityDate", date)}
                open={openPicker.validity}
                setOpen={(val) =>
                  setOpenPicker((p) => ({ ...p, validity: val }))
                }
              />
              <DatePicker
                label="Shipment Date"
                value={formData.shipmentDate}
                onSelect={(date) => handleDateSelect("shipmentDate", date)}
                open={openPicker.shipment}
                setOpen={(val) =>
                  setOpenPicker((p) => ({ ...p, shipment: val }))
                }
              />
            </div>
          </Section>

          <Section title="📝 Draft Details">
            <ProductSection
              formData={formData}
              handleChange={handleChange}
              handleBreakupChange={handleBreakupChange}
              addBreakupRow={handleAddRow}
              removeBreakupRow={handleRemoveRow}
              total={total}
              readOnly={false}
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
