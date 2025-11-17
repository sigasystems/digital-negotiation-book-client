import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { countryServices } from "../service";
import toast from "react-hot-toast";

const CountryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    country: ""
  });

  const [original, setOriginal] = useState({
    code: "",
    country: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await countryServices.getById(id);
        const data = res?.data?.data;

        if (data) {
        const originalData = {
            code: data.code || "",
            country: data.country || "",
        };

        setForm(originalData);
        setOriginal(originalData);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load country.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleUpdate = async () => {
  setError("");

  // Required fields
  if (!form.code.trim() || !form.country.trim()) {
    setError("All fields are required.");
    return;
  }

  // Detect unchanged form (no modifications)
  if (
    form.code === original.code &&
    form.country === original.country
  ) {
    toast.error("No changes made");
    return;
  }

  try {
    setSaving(true);

    await countryServices.update(id, {
      code: form.code.trim(),
      country: form.country.trim(),
    });

    toast.success("Country updated");
    navigate(-1);
  } catch (err) {
    console.error(err);
    setError("Update failed.");
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg text-slate-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 sm:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Edit Country</h2>
            <p className="mt-2 text-blue-100 text-sm">Update country information</p>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Code Field */}
              <div>
                <label htmlFor="code" className="block text-sm font-semibold text-slate-700 mb-2">
                  Country Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="e.g., US, IN, GB"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-900 placeholder-slate-400"
                />
              </div>

              {/* Country Field */}
              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-slate-700 mb-2">
                  Country Name
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="e.g., United States, India"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-lg shadow-blue-500/30 cursor-pointer"
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Country"
                )}
              </button>

              <button
                onClick={() => navigate(-1)}
                disabled={saving}
                className="flex-1 sm:flex-initial bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Changes will be saved immediately upon update
        </p>
      </div>
    </div>
  );
};

export default CountryPage;