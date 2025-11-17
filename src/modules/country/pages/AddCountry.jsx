import React, { useState } from "react";
import { Flag, Check, X } from "lucide-react";
import { countryServices } from "../service";

const AddCountry = () => {
  const [countries, setCountries] = useState([{ country: "", code: "" }]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (index, field, value) => {
    const updated = [...countries];
    updated[index][field] = value;
    setCountries(updated);
  };

  const handleAddField = () => {
    if (countries.length >= 5) {
      showToast("You can add a maximum of 5 countries", "error");
      return;
    }
    setCountries([...countries, { country: "", code: "" }]);
  };

  const handleRemoveField = (index) => {
    const updated = countries.filter((_, i) => i !== index);
    setCountries(updated);
  };

  const handleSubmit = async () => {
    const validCountries = countries.filter(
      (c) => c?.country?.trim() && c?.code?.trim()
    );

    if (validCountries.length === 0) {
      showToast("Please fill in at least one country with code", "error");
      return;
    }

    try {
      setLoading(true);
      await countryServices.create(
        validCountries.map((c) => ({
          country: c.country.trim(),
          code: c.code.trim(),
        }))
      );
      showToast("Countries added successfully!", "success");
      setCountries([{ country: "", code: "" }]);
    } catch (error) {
      console.error(error);
      const backend = error?.response?.data;
      const msg =
        backend?.error?.length
          ? backend.error.join(", ")
          : backend?.message || "Failed to add countries";

      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Flag size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Add Countries</h2>
        </div>
        <p className="text-gray-500 mb-6">
          Add up to 5 countries with name and 2-letter code.
        </p>

        {/* Country Inputs */}
        <div className="space-y-3">
          {countries.map((country, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 items-center"
            >
              <input
                type="text"
                placeholder="Country Name"
                value={country.country}
                onChange={(e) => handleChange(index, "country", e.target.value)}
                className="col-span-12 sm:col-span-7 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Code"
                value={country.code}
                onChange={(e) =>
                  handleChange(index, "code", e.target.value.toUpperCase())
                }
                className="col-span-12 sm:col-span-3 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center font-semibold uppercase"
              />
              {countries.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(index)}
                  className="col-span-12 sm:col-span-2 bg-red-500 hover:bg-red-600 text-white rounded-lg p-2.5 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {countries.length < 5 && (
            <button
              type="button"
              onClick={handleAddField}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition cursor-pointer"
            >
              + Add Another
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Submitting..." : <><Check size={18} /> Submit</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCountry;
