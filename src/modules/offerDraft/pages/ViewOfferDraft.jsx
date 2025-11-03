import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { offerDraftService } from "../services";
import { useOfferDraftForm } from "@/app/hooks/useOfferDraftForm";
import { validateOfferDates } from "@/utils/formateDate";
import { InputField } from "@/components/common/InputField";
import Section from "../components/Section";
import ReadOnlyField from "../components/ReadOnlyField";
import ProductSection from "../components/ProductSection";
import DatePicker from "../components/DatePicker";
import FormActions from "../components/FormActions";

const ViewOfferDraft = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    originalData,
    setOriginalData,
    loading,
    total,
    isChanged,
    buildChangedFields,
  } = useOfferDraftForm(id);

  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openPicker, setOpenPicker] = useState({
    validity: false,
    shipment: false,
  });

  const handleDateSelect = (key, date) => {
    if (!date) return;
    const iso = typeof date === "string" ? new Date(date).toISOString() : date.toISOString();
    setFormData((prev) => ({ ...prev, [key]: iso }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!isChanged) {
      toast.error("No changes detected.");
      return;
    }

    const validationError = validateOfferDates(
      formData.offerValidityDate,
      formData.shipmentDate
    );
    if (validationError) return toast.error(validationError);

    setSubmitting(true);
    try {
      const changedFields = buildChangedFields(formData, originalData);

      if (changedFields.sizeBreakups) {
        changedFields.sizeBreakups = changedFields.sizeBreakups.map((i) => ({
          ...i,
          breakup: Number(i.breakup) || 0,
          price: Number(i.price) || 0,
        }));
      }

      if (changedFields.sizeBreakups || changedFields.grandTotal)
        changedFields.total = total;

      const res = await offerDraftService.updateDraft(id, changedFields);
      const err = res?.data?.data?.error || res?.data?.message;

      if (res?.data?.success === false || err) {
        toast.error(err || "Failed to update draft.");
        return;
      }

      toast.success("Offer draft updated successfully.");
      setOriginalData(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating draft.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading offer draft...
      </div>
    );

  if (!formData)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Draft not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <form className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* BUSINESS INFO */}
          <Section title="🏢 Business Information">
            <div className="grid sm:grid-cols-2 gap-6">
              <ReadOnlyField label="Draft Number" value={formData.draftNo} />
              {isEditing ? (
                <>
                  <InputField label="From Party" name="fromParty" value={formData.fromParty} onChange={handleChange} />
                  <InputField label="Origin" name="origin" value={formData.origin} onChange={handleChange} />
                  <InputField label="Processor" name="processor" value={formData.processor} onChange={handleChange} />
                  <InputField label="Plant Approval Number" name="plantApprovalNumber" value={formData.plantApprovalNumber} onChange={handleChange} />
                  <InputField label="Brand" name="brand" value={formData.brand} onChange={handleChange} />
                </>
              ) : (
                <>
                  <ReadOnlyField label="From Party" value={formData.fromParty} />
                  <ReadOnlyField label="Origin" value={formData.origin} />
                  <ReadOnlyField label="Processor" value={formData.processor} />
                  <ReadOnlyField label="Plant Approval Number" value={formData.plantApprovalNumber} />
                  <ReadOnlyField label="Brand" value={formData.brand} />
                </>
              )}
            </div>
          </Section>

          {/* DATES */}
          <Section title="📅 Dates">
            <div className="grid sm:grid-cols-2 gap-6">
              <DatePicker
                label="Offer Validity Date"
                value={formData.offerValidityDate}
                onSelect={(date) => handleDateSelect("offerValidityDate", date)}
                open={openPicker.validity}
                setOpen={(v) => setOpenPicker((p) => ({ ...p, validity: v }))}
                editable={true}
              />
              <DatePicker
                label="Shipment Date"
                value={formData.shipmentDate}
                onSelect={(date) => handleDateSelect("shipmentDate", date)}
                open={openPicker.shipment}
                setOpen={(v) => setOpenPicker((p) => ({ ...p, shipment: v }))}
                editable={true}
              />
            </div>
          </Section>

          {/* PRODUCT SECTION */}
          <Section title="📝 Product & Draft Details">
            <ProductSection
              formData={formData}
              handleChange={handleChange}
              total={total}
              readOnly={!isEditing}
            />
          </Section>

          {/* FOOTER */}
          <FormActions
            isEditing={isEditing}
            isChanged={isChanged}
            submitting={submitting}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
            onBack={() => navigate(-1)}
          />
        </form>
      </div>
    </div>
  );
};

export default ViewOfferDraft;
