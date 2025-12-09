import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  UserCircle2, 
  MapPin, 
  ArrowLeft, 
  Save, 
  Loader2,
  UserPlus,
  CheckCircle2
} from "lucide-react";
import { businessOwnerService } from "../services/businessOwner";
import { useToast } from "@/app/hooks/useToast";
import { validateBuyer } from "@/app/config/buyerValidation";
import { BUYER_FORM_FIELDS } from "@/app/config/buyerFormConfig";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import planUsageService from "@/services/planUsageService";
import { Toast } from "@/components/common/Toast";
import { Spinner } from "@/components/ui/spinner";

export default function AddBuyerForm() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [remainingBuyers, setRemainingBuyers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

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

  // Fetch plan usage on mount
  useEffect(() => {
    const fetchPlanUsage = async () => {
      try {
        await planUsageService.fetchUsage(user.id);
        const remaining = planUsageService.getRemainingCredits("buyers");
        setRemainingBuyers(remaining);
      } catch (err) {
        console.error("Failed to fetch plan usage:", err);
        showToast("error", "Failed to load plan info.");
      }
    };
    fetchPlanUsage();
  }, [user.id]);

  const updateField = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const error = validateBuyer(formData);
    if (error) return showToast("error", error);
    
    setIsConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    setIsConfirmOpen(false);
    setLoading(true);

    try {
      const res = await businessOwnerService.addBuyer(formData);

      if (res?.status === 201) {
        showToast("success", "Buyer added successfully!");
        setFormData(initialData);
        setTimeout(() => navigate("/users"), 1000);
      } else {
        showToast("error", res?.message || "Failed to add buyer");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to add buyer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 px-[24.5px]">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Spinner className="w-8 h-8 text-indigo-600 mb-3" />
          <p className="text-slate-700 font-medium">Adding buyer...</p>
        </div>
      )}

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} message={t.message} />
        ))}
      </div>

      <header className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-20 rounded-xl">
        <div className="mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer inline-flex items-center text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <div className="h-8 w-px bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-3 ml-3">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Add Buyer
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Create new buyer entry
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto py-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 space-y-6">
            {/* Remaining Credits */}
            <div className="text-l text-red-700 font-bold">
              Remaining Credits : {remainingBuyers}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-[#16a34a]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Company Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Basic details about the buyer's company
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {BUYER_FORM_FIELDS.company.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        placeholder={field.placeholder || field.label}
                        value={formData[field.name]}
                        onChange={updateField}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <UserCircle2 className="w-5 h-5 text-[#16a34a]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Contact Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Primary contact details for communication
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {BUYER_FORM_FIELDS.contact.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        placeholder={field.placeholder || field.label}
                        value={formData[field.name]}
                        onChange={updateField}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Information */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Address Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Complete address information
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BUYER_FORM_FIELDS.address.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </label>
                        <input
                          type={field.type || "text"}
                          name={field.name}
                          placeholder={field.placeholder || field.label}
                          value={formData[field.name]}
                          onChange={updateField}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Street Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={updateField}
                      rows="4"
                      placeholder="Enter complete street address..."
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={() => navigate(-1)}
              disabled={loading}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 button-styling"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Add Buyer
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}