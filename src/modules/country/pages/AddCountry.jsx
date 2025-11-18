import React, { useState, useEffect } from "react";
import { Flag, Check, X, Plus, Edit3 } from "lucide-react";

const countryServices = {
  getAll: async () => ({
    data: {
      data: [
        { code: "US", country: "United States" },
        { code: "UK", country: "United Kingdom" },
        { code: "CA", country: "Canada" },
        { code: "IN", country: "India" },
        { code: "AU", country: "Australia" }
      ]
    }
  }),
  create: async (data) => {
    return { success: true };
  }
};

const AddCountry = () => {
  const [locations, setLocations] = useState([
    { city: "", state: "", code: "", country: "", manualCountry: false }
  ]);
  const [countriesList, setCountriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await countryServices.getAll();
        setCountriesList(res?.data?.data || []);
      } catch (err) {
        console.error(err);
        showToast("Failed to fetch countries", "error");
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...locations];
    updated[index][field] = value;
    setLocations(updated);
  };

  const handleAddField = () => {
    if (locations.length >= 5) {
      showToast("You can add a maximum of 5 locations", "error");
      return;
    }
    setLocations([...locations, { city: "", state: "", code: "", country: "", manualCountry: false }]);
  };

  const handleRemoveField = (index) => {
    const updated = locations.filter((_, i) => i !== index);
    setLocations(updated);
  };

  const toggleManualCountry = (index) => {
    const updated = [...locations];
    updated[index].manualCountry = !updated[index].manualCountry;
    updated[index].country = "";
    setLocations(updated);
  };

  const validateForm = () => {
    const newErrors = {};
    locations.forEach((loc, index) => {
      if (!loc.city.trim()) newErrors[`city-${index}`] = "City is required";
      if (!loc.state.trim()) newErrors[`state-${index}`] = "State is required";
      if (!loc.code.trim()) newErrors[`code-${index}`] = "Code is required";
      if (!loc.country.trim()) newErrors[`country-${index}`] = "Country is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      setLoading(true);
      await countryServices.create(
        locations.map((loc) => ({
          city: loc.city.trim(),
          state: loc.state.trim(),
          code: loc.code.trim(),
          country: loc.country.trim(),
        }))
      );
      showToast("Locations added successfully!", "success");
      setLocations([{ city: "", state: "", code: "", country: "", manualCountry: false }]);
      setErrors({});
    } catch (error) {
      console.error(error);
      const backend = error?.response?.data;
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
    <div className="min-h-screen p-6">
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

      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl">
            <Flag size={24} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Add Locations</h2>
        </div>
        <p className="text-gray-500 mb-8 ml-14">
          Add up to 5 locations with city, state, code, and country information.
        </p>

        <div className="space-y-6">
          {locations.map((loc, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700 bg-white px-3 py-1 rounded-full border border-gray-200">
                  Location {index + 1}
                </span>
                {locations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={loc.city}
                    onChange={(e) => handleChange(index, "city", e.target.value)}
                    className={`w-full border-2 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all ${
                      errors[`city-${index}`] ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-white"
                    }`}
                  />
                  {errors[`city-${index}`] && (
                    <p className="text-rose-600 text-xs font-medium">{errors[`city-${index}`]}</p>
                  )}
                </div>

              
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    placeholder="Enter state"
                    value={loc.state}
                    onChange={(e) => handleChange(index, "state", e.target.value)}
                    className={`w-full border-2 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all ${
                      errors[`state-${index}`] ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-white"
                    }`}
                  />
                  {errors[`state-${index}`] && (
                    <p className="text-rose-600 text-xs font-medium">{errors[`state-${index}`]}</p>
                  )}
                </div>

              
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  {!loc.manualCountry ? (
                    <>
                      <select
                        value={loc.country}
                        onChange={(e) => handleChange(index, "country", e.target.value)}
                        className={`w-full border-2 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all appearance-none bg-white cursor-pointer ${
                          errors[`country-${index}`] ? "border-rose-400 bg-rose-50" : "border-gray-200"
                        }`}
                      >
                        <option value="">Select country</option>
                        {countriesList.map((c) => (
                          <option key={c.code} value={c.country}>
                            {c.country}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => toggleManualCountry(index)}
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors mt-1.5 group cursor-pointer"
                      >
                        <Edit3 size={13} className="group-hover:rotate-12 transition-transform" />
                        <span>Country not in list? Add manually</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Enter country name"
                        value={loc.country}
                        onChange={(e) => handleChange(index, "country", e.target.value)}
                        className={`w-full border-2 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all ${
                          errors[`country-${index}`] ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleManualCountry(index)}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors mt-1.5 cursor-pointer"
                      >
                        <span>← Back to country list</span>
                      </button>
                    </>
                  )}
                  {errors[`country-${index}`] && (
                    <p className="text-rose-600 text-xs font-medium">{errors[`country-${index}`]}</p>
                  )}
                </div>

              
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Code</label>
                  <input
                    type="text"
                    placeholder="e.g., US"
                    value={loc.code}
                    onChange={(e) => handleChange(index, "code", e.target.value.toUpperCase())}
                    maxLength={3}
                    className={`w-full border-2 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-center font-bold text-lg tracking-wider transition-all ${
                      errors[`code-${index}`] ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-white"
                    }`}
                  />
                  {errors[`code-${index}`] && (
                    <p className="text-rose-600 text-xs font-medium">{errors[`code-${index}`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {locations.length < 5 && (
            <button
              type="button"
              onClick={handleAddField}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 cursor-pointer"
            >
              <Plus size={20} />
              Add Another Location
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check size={20} />
                Submit Locations
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCountry;