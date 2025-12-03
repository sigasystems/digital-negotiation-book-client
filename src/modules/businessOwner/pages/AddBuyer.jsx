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
import {InputField} from "@/components/common/InputField";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import planUsageService from "@/services/planUsageService";

export default function AddBuyerForm() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [  remainingBuyers  , setRemainingBuyers] = useState(0);

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
      toast.success("Buyer added successfully!");
      setFormData(initialData);
        setTimeout(() => navigate("/users"), 1000);
    } else {
        toast.error(res?.message || "Failed to add buyer");
    }
  } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add buyer");
  } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-8 px-[24.5px]">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl text-white shadow-2xl backdrop-blur-sm transition-all transform ${
              t.type === "success" 
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600" 
                : "bg-gradient-to-r from-red-500 to-red-600"
            } animate-slide-in`}
          >
            <div className="flex items-center gap-2">
              {t.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span className="text-lg">❌</span>
              )}
              <span className="font-medium">{t.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm z-20 rounded-xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)} 
                className="cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg">
                  <UserPlus className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Add New Buyer</h1>
                  <p className="text-xs sm:text-sm text-slate-500">Register a new buyer to your business network</p>
                </div>
              </div>
            </div>

      
          </div>
        </div>
      </header>

      <main className="mx-auto pt-4">
       
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          
          {/* Company Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow p-5 sm:p-6 lg:p-6">
            <div className="max-w-sm rounded-lg text-l mb-3 text-red-700 font-bold">
                    Remaining Credits : {remainingBuyers}
            </div>
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-semibold text-base sm:text-lg text-slate-900">Company Information</h2>
                <p className="text-xs sm:text-sm text-slate-500">Basic details about the buyer's company</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {BUYER_FORM_FIELDS.company.map((field) => (
                <div key={field.name} className="space-y-2">
                <InputField
                  {...field}
                  value={formData[field.name]}
                  onChange={updateField}
                  placeholder={field.placeholder || field.label}
                    className="cursor-pointer bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500 border-slate-300 transition-all h-11 sm:h-12 text-sm sm:text-base"
                />
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow p-5 sm:p-6 lg:p-6">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <UserCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-base sm:text-lg text-slate-900">Contact Information</h2>
                <p className="text-xs sm:text-sm text-slate-500">Primary contact details for communication</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {BUYER_FORM_FIELDS.contact.map((field) => (
                <div key={field.name} className="space-y-2">
                <InputField
                  {...field}
                  value={formData[field.name]}
                  onChange={updateField}
                    className="cursor-pointer bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500 border-slate-300 transition-all h-11 sm:h-12 text-sm sm:text-base"
                />
                </div>
              ))}
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow p-5 sm:p-6 lg:p-6">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-base sm:text-lg text-slate-900">Address Details</h2>
                <p className="text-xs sm:text-sm text-slate-500">Complete address information</p>
              </div>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {BUYER_FORM_FIELDS.address.map((field) => (
                  <div key={field.name} className="space-y-2">
                <InputField
                  {...field}
                  value={formData[field.name]}
                  onChange={updateField}
                      className="cursor-pointer bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500 border-slate-300 transition-all h-11 sm:h-12 text-sm sm:text-base"
                />
                  </div>
              ))}
            </div>

              <div className="space-y-2">
            <label className="block text-sm sm:text-base font-semibold text-slate-700">
              Street Address <span className="text-red-500">*</span>
            </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={updateField}
                rows="4"
                  placeholder="Enter complete street address..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer text-sm sm:text-base resize-none"
                />
              </div>
            </div>
            
          </div>

          
        </form>
        

          <div className="flex flex-col sm:flex-row justify-start gap-3 m-3">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => navigate(-1)} 
              disabled={loading}
              className="w-full sm:w-auto cursor-pointer hover:bg-slate-100 border-slate-300 transition-colors h-11 sm:h-12 text-sm sm:text-base font-medium"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white cursor-pointer shadow-lg hover:shadow-xl transition-all h-11 sm:h-12 text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                  Adding Buyer...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Add Buyer
                </>
              )}
            </Button>
          </div>
  
      </main>

     
    </div>
  );
}
