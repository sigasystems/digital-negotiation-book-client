import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, UserCircle2, MapPin } from "lucide-react";
import { businessOwnerService } from "../services/businessOwner";
import { useToast } from "@/app/hooks/useToast";
import { validateBuyer } from "@/app/config/buyerValidation";
import { BUYER_FORM_FIELDS } from "@/app/config/buyerFormConfig";
import {InputField} from "@/components/common/InputField";
import FormSection from "@/components/common/FormSection";

export default function AddBuyerForm() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const initialData = {
    ownerId: user?.businessOwnerId || "",
    buyersCompanyName: "",
    registrationNumber: "",
    taxId: "",
    contactName: "",
    contactEmail: "",
    countryCode: "",
    contactPhone: "",
    country: "",
    state: "",
    city: "",
    address: "",
    postalCode: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  const updateField = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

  const error = validateBuyer(formData);
  if (error) return showToast(error, "error");

    setLoading(true);

  try {
    const res = await businessOwnerService.addBuyer(formData);

    if (res?.status === 201) {
      showToast("Buyer added successfully");
      setFormData(initialData);
    } else {
        showToast(res?.message || "Failed to add buyer", "error");
    }
  } catch (err) {
      showToast(err?.response?.data?.message || "Error adding buyer", "error");
  } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg text-white shadow-lg ${
              t.type === "success" ? "bg-emerald-500" : "bg-red-500"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold mt-6 mb-1">Add New Buyer</h1>
          <p className="text-gray-600 mb-8">
            Register a new buyer to your business network
          </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* Company */}
          <FormSection icon={Building2} title="Company Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {BUYER_FORM_FIELDS.company.map((field) => (
                <InputField
                  key={field.name}
                  {...field}
                  value={formData[field.name]}
                  onChange={updateField}
                  placeholder={field.placeholder || field.label}
                />
              ))}
            </div>
          </FormSection>

          {/* Contact */}
          <FormSection icon={UserCircle2} title="Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {BUYER_FORM_FIELDS.contact.map((field) => (
                <InputField
                  key={field.name}
                  {...field}
                  value={formData[field.name]}
                  onChange={updateField}
                />
              ))}
            </div>
          </FormSection>

          {/* Address */}
          <FormSection icon={MapPin} title="Address">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              {BUYER_FORM_FIELDS.address.map((field) => (
                <InputField
                  key={field.name}
                  {...field}
                  value={formData[field.name]}
                  onChange={updateField}
                />
              ))}
            </div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Street Address
            </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={updateField}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </FormSection>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-6 bg-gray-50 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 flex gap-2 items-center"
            >
              {loading ? "Adding..." : "Add Buyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
