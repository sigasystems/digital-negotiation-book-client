import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flag, Check, X, Plus, Edit3, MapPin, ArrowLeft } from "lucide-react";
import { countryServices } from "@/modules/country/service";
import planUsageService from "@/services/planUsageService";
import { Spinner } from "@/components/ui/spinner";
import { Toast } from "@/components/common/Toast";
import { useToast } from "@/app/hooks/useToast";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const AddLocation = () => {
  const navigate = useNavigate();
  const { toasts, showToast } = useToast();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [form, setForm] = useState([
    {
      city: "",
      state: "",
      code: "",
      countryId: "",
      countryName: "",
      countryCode: "",
      manualCountry: false,
    },
  ]);

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [remainingLocations, setRemainingLocations] = useState(0);
  const MAX_LOCATIONS = 5;

  // Fetch plan usage on mount
  useEffect(() => {
    const fetchPlanUsage = async () => {
      try {
        await planUsageService.fetchUsage(user.id);
        const remaining = planUsageService.getRemainingCredits("locations");
        setRemainingLocations(remaining);
      } catch (err) {
        console.error("Failed to fetch plan usage:", err);
        showToast("error", "Failed to load plan info.");
      }
    };
    fetchPlanUsage();
  }, [user.id]);

  const loadCountries = async () => {
    try {
      const res = await countryServices.getAll();
      const list = res?.data?.data?.data ?? [];
      setCountries(list);
    } catch {
      showToast("error", "Failed to fetch countries");
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const handleChange = useCallback((i, field, value) => {
    setForm((prev) =>
      prev.map((loc, idx) => (idx === i ? { ...loc, [field]: value } : loc)),
    );
  }, []);

  const toggleManualCountry = useCallback((i) => {
    setForm((prev) =>
      prev.map((loc, idx) =>
        idx === i
          ? {
              ...loc,
              manualCountry: !loc.manualCountry,
              countryId: "",
              countryName: "",
              countryCode: "",
            }
          : loc,
      ),
    );
  }, []);

  const addLocation = useCallback(() => {
    if (form.length >= MAX_LOCATIONS) {
      return showToast(
        "error",
        `You can only add up to ${MAX_LOCATIONS} locations at once.`,
      );
    }
    setForm((prev) => [
      ...prev,
      {
        city: "",
        state: "",
        code: "",
        countryId: "",
        countryName: "",
        countryCode: "",
        manualCountry: false,
      },
    ]);
  }, [form.length]);

  const removeLocation = useCallback((i) => {
    setForm((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const validate = useCallback(() => {
    const errors = {};
    form.forEach((loc, i) => {
      if (!loc.city.trim()) errors[`city-${i}`] = "City is required";
      if (!loc.state.trim()) errors[`state-${i}`] = "State is required";
      if (!loc.code.trim()) errors[`code-${i}`] = "Code is required";

      if (loc.manualCountry) {
        if (!loc.countryName.trim())
          errors[`countryName-${i}`] = "Country name required";
        if (!loc.countryCode.trim())
          errors[`countryCode-${i}`] = "Country code required";
      } else {
        if (!loc.countryId) errors[`countryId-${i}`] = "Select a country";
      }
    });
    return errors;
  }, [form]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      // Show first error
      const firstError = Object.values(errors)[0];
      showToast("error", firstError);
      return;
    }

    setIsConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    setIsConfirmOpen(false);
    setLoading(true);

    try {
      const payload = form.map((loc) => {
        const trimmed = {
          city: loc.city.trim(),
          state: loc.state.trim(),
          code: loc.code.trim().toUpperCase(),
        };

        if (loc.manualCountry) {
          trimmed.countryName = loc.countryName.trim();
          trimmed.countryCode = loc.countryCode.trim().toUpperCase();
        } else if (loc.countryId) {
          const selected = countries.find((c) => c.id === loc.countryId);
          if (selected) {
            trimmed.countryName = selected.country.name;
            trimmed.countryCode = selected.country.code;
          }
        }

        return trimmed;
      });

      await countryServices.create(payload);
      showToast("success", "Locations added successfully!");

      // Reset form
      setForm([
        {
          city: "",
          state: "",
          code: "",
          countryId: "",
          countryName: "",
          countryCode: "",
          manualCountry: false,
        },
      ]);

      // Reload countries
      loadCountries();
    } catch (err) {
      const backend = err?.response?.data;
      const msg = backend?.error?.length
        ? backend.error.join(", ")
        : backend?.message || "Failed to add locations";
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 px-[24.5px]">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Spinner className="w-8 h-8 text-indigo-600 mb-3" />
          <p className="text-slate-700 font-medium">Adding locations...</p>
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
                  Add Locations
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Create new location entries
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto py-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 px-6 pt-4 font-bold">
              {remainingLocations > 0 ? (
                <>
                  <span className="text-[#16a34a] text-lg">
                    Remaining Credits:
                  </span>

                  <span className="text-[#16a34a] text-lg">
                    {remainingLocations}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#16a34a] text-lg">
                    Remaining Credits:
                  </span>
                  <span className="text-red-700 text-lg">
                    Plan limit for adding location is exceeded...
                  </span>
                </>
              )}
            </div>

            {form.map((loc, i) => (
              <div
                key={i}
                className="border-b border-slate-100 last:border-b-0"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Flag size={20} className="text-[#16a34a]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Location {i + 1}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Enter location details
                        </p>
                      </div>
                    </div>

                    {form.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLocation(i)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <X size={18} className="text-slate-500" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* City */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 mb-2">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={loc.city}
                        onChange={(e) =>
                          handleChange(i, "city", e.target.value)
                        }
                        placeholder="Enter city"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-[#16a34a] focus:border-[#16a34a] outline-none transition"
                      />
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 mb-2">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={loc.state}
                        onChange={(e) =>
                          handleChange(i, "state", e.target.value)
                        }
                        placeholder="Enter state"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-[#16a34a] focus:border-[#16a34a] outline-none transition"
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 mb-2">
                        Country <span className="text-rose-500">*</span>
                      </label>

                      {!loc.manualCountry ? (
                        <>
                          <select
                            value={loc.countryId}
                            onChange={(e) =>
                              handleChange(i, "countryId", e.target.value)
                            }
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-[#16a34a] focus:border-[#16a34a] outline-none transition cursor-pointer"
                          >
                            <option value="">Select country</option>
                            {countries.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.country.name} ({c.country.code})
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => toggleManualCountry(i)}
                            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors mt-2 cursor-pointer"
                          >
                            <Edit3 size={13} /> Country not listed? Add manually
                          </button>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={loc.countryName}
                            onChange={(e) =>
                              handleChange(i, "countryName", e.target.value)
                            }
                            placeholder="Country name"
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-[#16a34a] focus:border-[#16a34a] outline-none transition mb-2"
                          />

                          <input
                            type="text"
                            value={loc.countryCode}
                            onChange={(e) =>
                              handleChange(
                                i,
                                "countryCode",
                                e.target.value.toUpperCase(),
                              )
                            }
                            placeholder="Code (US)"
                            maxLength={3}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-[#16a34a] focus:border-[#16a34a] outline-none transition font-medium text-center"
                          />

                          <button
                            type="button"
                            onClick={() => toggleManualCountry(i)}
                            className="text-xs text-[#16a34a] hover:text-green-700 mt-2 cursor-pointer font-medium"
                          >
                            ← Back to country list
                          </button>
                        </>
                      )}
                    </div>

                    {/* Location Code */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 mb-2">
                        Location Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={loc.code}
                        maxLength={4}
                        onChange={(e) =>
                          handleChange(i, "code", e.target.value.toUpperCase())
                        }
                        placeholder="ABC1"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-[#16a34a] focus:border-[#16a34a] outline-none transition font-medium text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={addLocation}
              disabled={form.length >= MAX_LOCATIONS}
              className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${
                form.length >= MAX_LOCATIONS
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:text-grey-700 border-slate-300 hover:border-slate-400"
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Another Location ({form.length}/{MAX_LOCATIONS})
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
                  <Check className="w-4 h-4" /> Add Locations
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
        title="Confirm Add"
        description="Are you sure you want to add these locations?"
        confirmText="Yes, Add"
        cancelText="Cancel"
        confirmButtonColor="bg-[#16a34a] hover:bg-green-700"
      />
    </div>
  );
};

export default AddLocation;
