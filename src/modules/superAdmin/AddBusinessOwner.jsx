import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBusinessOwnerApi } from "./services";
import { ArrowLeft, Save, UserPlus, Building2, UserCircle2, MapPin } from "lucide-react";
import { useToast } from "@/app/hooks/useToast";
import { Toast } from "@/components/common/Toast";
import { Spinner } from "@/components/ui/spinner";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const AddBusinessOwner = () => {
  const initialFormData = {
    first_name: "",
    last_name: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    registrationNumber: "",
    country: "",
    state: "",
    city: "",
    address: "",
    postalCode: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    // Validate required fields
    const requiredFields = ["first_name", "last_name", "email", "businessName", "country"];
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (missingFields.length > 0) {
      showToast("error", "Please fill in all required fields.");
      return;
    }
    
    setIsConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    setIsConfirmOpen(false);
    setLoading(true);

    try {
      const response = await addBusinessOwnerApi(formData);
      
      if (response?.success) {
        showToast("success", "Business Owner added successfully!");
        setFormData(initialFormData);
        setTimeout(() => navigate("/users"), 1000);
      } else {
        const message = response?.message || "Something went wrong! Please try again later.";
        showToast("error", message);
      }
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.response?.data?.message || err?.message || "Failed to add new business owner.";
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 px-[24.5px]">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Spinner className="w-8 h-8 text-indigo-600 mb-3" />
          <p className="text-slate-700 font-medium">Adding business owner...</p>
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
              onClick={handleBack}
              className="cursor-pointer inline-flex items-center text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <div className="h-8 w-px bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-3 ml-3">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Add Business Owner
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Create new business owner entry
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto py-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <UserCircle2 className="w-5 h-5 text-[#16a34a]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Personal Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Basic details about the business owner
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter first name"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter last name"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-[#16a34a]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Business Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Company details and registration information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Business Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      placeholder="Enter business name"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
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
                      Address Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Complete address details
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        placeholder="Enter country"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Street Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter full address"
                      rows="4"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={handleBack}
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
                  <Save className="w-4 h-4" /> Add Business Owner
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSubmit}
        title="Confirm Business Owner Creation"
        description="Are you sure you want to add this business owner? This will create a new business owner account with the information provided."
        confirmText="Add Business Owner"
        cancelText="Cancel"
        confirmButtonColor="bg-[#16a34a] hover:bg-green-700"
      />
    </div>
  );
};

export default AddBusinessOwner;