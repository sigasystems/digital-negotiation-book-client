import React, { useEffect, useState } from "react";
import { Flag, Check, X, Plus, Edit3, MapPin, ArrowLeft } from "lucide-react";
import { countryServices } from "@/modules/country/service";
import planUsageService from "@/services/planUsageService";

const AddLocation = () => {
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
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});


  
      const [ remainingLocations, setRemainingLocations] = useState(0);
    
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

    

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadCountries = async () => {
    try {
      const res = await countryServices.getAll();
      const list = res?.data?.data?.data ?? [];
      setCountries(list);
    } catch {
      showToast("Failed to fetch countries", "error");
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const handleChange = (i, field, value) => {
    const updated = [...form];
    updated[i][field] = value;
    setForm(updated);
  };

  const toggleManualCountry = (i) => {
    const updated = [...form];
    updated[i].manualCountry = !updated[i].manualCountry;
    updated[i].countryId = "";
    updated[i].countryName = "";
    updated[i].countryCode = "";
    setForm(updated);
  };

  const addLocation = () => {
    if (form.length >= 5) {
      showToast("You can add a maximum of 5 locations", "error");
      return;
    }
    setForm([
      ...form,
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
  };

  const removeLocation = (i) => {
    const newForm = form.filter((_, idx) => idx !== i);
    setForm(newForm);
  };

  const validate = () => {
    const e = {};
    form.forEach((loc, i) => {
      if (!loc.city.trim()) e[`city-${i}`] = "City is required";
      if (!loc.state.trim()) e[`state-${i}`] = "State is required";
      if (!loc.code.trim()) e[`code-${i}`] = "Code is required";

      if (loc.manualCountry) {
        if (!loc.countryName.trim()) e[`countryName-${i}`] = "Country name required";
        if (!loc.countryCode.trim()) e[`countryCode-${i}`] = "Country code required";
      } else {
        if (!loc.countryId) e[`countryId-${i}`] = "Select a country";
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

const handleSubmit = async () => {
  if (!validate()) {
    showToast("Please fix errors before submitting", "error");
    return;
  }

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
      }
      if (!loc.manualCountry && loc.countryId) {
        const selected = countries.find((c) => c.id === loc.countryId);
        if (selected) {
          trimmed.countryName = selected.name;
          trimmed.countryCode = selected.code;
        }
      }

      return trimmed;
    });


    await countryServices.create(payload);
    showToast("Locations added successfully!", "success");

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

    setErrors({});
    loadCountries();
  } catch (err) {
    const backend = err?.response?.data;
    const msg =
      backend?.error?.length
        ? backend.error.join(", ")
        : backend?.message || "Failed to add locations";
    showToast(msg, "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-8 px-[34.5px]">

      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top">
          <div
            className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm ${
              toast.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-rose-500 text-white"
            }`}
          >
            {toast.type === "success" ? <Check size={20} /> : <X size={20} />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className=" mx-auto">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 rounded-xl text-gray-700 font-medium shadow-sm border border-gray-200 transition-all hover:shadow-md cursor-pointer group mb-6"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <MapPin size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add Locations</h1>
              <p className="text-gray-600 mt-1">
                Add up to 5 locations including country, city, state and location code
              </p>
            </div>
        </div>
      </div>

        {/* Location Cards */}
      <div className="space-y-6">
        {form.map((loc, i) => (
          <div 
            key={i}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="max-w-sm rounded-lg text-l mb-3 text-red-700 font-bold">
           Remaining Credits : {remainingLocations}
        </div>
            <div className="flex items-center justify-between mb-6">
             
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Flag size={20} className="text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold text-gray-800">
                    Location {i + 1}
                  </span>
                </div>

              {form.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(i)}
                  className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-xl transition-all duration-200 cursor-pointer hover:scale-105"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* City */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                    City <span className="text-rose-500">*</span>
                  </label>
                <input
                  type="text"
                  value={loc.city}
                  onChange={(e) => handleChange(i, "city", e.target.value)}
                  placeholder="Enter city"
                  className={`w-full border-2 rounded-xl px-4 py-3 transition-all ${
                    errors[`city-${i}`]
                      ? "border-rose-400 bg-rose-50 focus:ring-rose-300"
                      : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-200"
                  } focus:ring-2 focus:outline-none`}
                />
                {errors[`city-${i}`] && (
                  <p className="text-rose-600 text-xs font-medium flex items-center gap-1">
                      <X size={12} /> {errors[`city-${i}`]}
                  </p>
                )}
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                    State <span className="text-rose-500">*</span>
                  </label>
                <input
                  type="text"
                  value={loc.state}
                  onChange={(e) => handleChange(i, "state", e.target.value)}
                  placeholder="Enter state"
                  className={`w-full border-2 rounded-xl px-4 py-3 transition-all ${
                    errors[`state-${i}`]
                      ? "border-rose-400 bg-rose-50 focus:ring-rose-300"
                      : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-200"
                  } focus:ring-2 focus:outline-none`}
                />
                {errors[`state-${i}`] && (
                  <p className="text-rose-600 text-xs font-medium flex items-center gap-1">
                      <X size={12} /> {errors[`state-${i}`]}
                  </p>
                )}
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Country <span className="text-rose-500">*</span>
                </label>

                {!loc.manualCountry ? (
                  <>
                    <select
                    value={loc.countryId}
                    onChange={(e) => handleChange(i, "countryId", e.target.value)}
                    className={`w-full border-2 rounded-xl px-4 py-3 bg-white appearance-none cursor-pointer transition-all ${
                        errors[`countryId-${i}`]
                        ? "border-rose-400 bg-rose-50 focus:ring-rose-300"
                        : "border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                    } focus:ring-2 focus:outline-none`}
                    >
                    <option value="">Select country</option>
                    {countries.length > 0 &&
                        countries.map((c) => (
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
                      className={`w-full border-2 rounded-xl px-4 py-3 mb-2 transition-all ${
                        errors[`countryName-${i}`]
                          ? "border-rose-400 bg-rose-50 focus:ring-rose-300"
                          : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-200"
                      } focus:ring-2 focus:outline-none`}
                    />

                    <input
                      type="text"
                      value={loc.countryCode}
                      onChange={(e) =>
                        handleChange(
                          i,
                          "countryCode",
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="Code (US)"
                        maxLength={3}
                      className={`w-full border-2 rounded-xl px-4 py-3 font-bold text-lg text-center tracking-wider transition-all ${
                        errors[`countryCode-${i}`]
                          ? "border-rose-400 bg-rose-50 focus:ring-rose-300"
                          : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-200"
                      } focus:ring-2 focus:outline-none`}
                    />

                    <button
                      type="button"
                      onClick={() => toggleManualCountry(i)}
                      className="text-xs text-gray-600 hover:text-gray-800 mt-2 cursor-pointer font-medium"
                    >
                      ← Back to country list
                    </button>
                  </>
                )}

                {errors[`countryId-${i}`] && (
                  <p className="text-rose-600 text-xs font-medium flex items-center gap-1">
                      <X size={12} /> {errors[`countryId-${i}`]}
                  </p>
                )}
                {errors[`countryName-${i}`] && (
                  <p className="text-rose-600 text-xs font-medium flex items-center gap-1">
                      <X size={12} /> {errors[`countryName-${i}`]}
                  </p>
                )}
                {errors[`countryCode-${i}`] && (
                  <p className="text-rose-600 text-xs font-medium flex items-center gap-1">
                      <X size={12} /> {errors[`countryCode-${i}`]}
                  </p>
                )}
              </div>

              {/* Location Code */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
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
                  className={`w-full border-2 rounded-xl px-4 py-3 text-lg font-bold text-center tracking-widest transition-all ${
                    errors[`code-${i}`]
                      ? "border-rose-400 bg-rose-50 focus:ring-rose-300"
                      : "border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-200"
                  } focus:ring-2 focus:outline-none`}
                />

                {errors[`code-${i}`] && (
                  <p className="text-rose-600 text-xs font-medium flex items-center gap-1">
                      <X size={12} /> {errors[`code-${i}`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        {form.length < 5 && (
          <button
            onClick={addLocation}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus size={20} strokeWidth={2.5} />
              <span>Add Another Location</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                {form.length}/5
              </span>
          </button>
        )} 

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
            </>
          ) : (
            <>
              <Check size={20} strokeWidth={2.5} />
                <span>Submit Locations</span>
            </>
          )}
        </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            All fields marked with <span className="text-rose-500">*</span> are required. Location codes must be 4 characters or less.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddLocation;
