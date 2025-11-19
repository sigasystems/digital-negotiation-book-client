import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { countryServices } from "@/modules/country/service";
import toast from "react-hot-toast";
import { InputField } from "@/components/common/InputField";

const LocationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    city: "",
    state: "",
    code: "",
    countryId: "",
    countryName: "",
  });

  const [original, setOriginal] = useState({
    city: "",
    state: "",
    code: "",
    countryId: "",
  });

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const fetchCountries = async () => {
    try {
      const res = await countryServices.getAllCountries();
      const list = res?.data?.data || [];
      setCountries(list);
    } catch (err) {
      console.error("Failed to fetch countries:", err);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await countryServices.getById(id);
        const data = res?.data?.data?.location;
        if (data) {
          setForm({
            city: data.city || "",
            state: data.state || "",
            code: data.code || "",
            countryId: data.country?.id || "",
            countryName: data.country?.name || "",
          });
          setOriginal({
            city: data.city || "",
            state: data.state || "",
            code: data.code || "",
            countryId: data.country?.id || "",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load location.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchCountries();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleUpdate = async () => {
    setError("");

    if (!form.city.trim() || !form.state.trim() || !form.code.trim() || !form.countryId) {
      setError("All fields are required.");
      return;
    }

    if (
      form.city === original.city &&
      form.state === original.state &&
      form.code === original.code &&
      form.countryId === original.countryId
    ) {
      toast.error("No changes made");
      return;
    }

    try {
      setSaving(true);
      await countryServices.update(id, {
        city: form.city.trim(),
        state: form.state.trim(),
        code: form.code.trim(),
        countryId: form.countryId,
      });
      toast.success("Location updated");
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 sm:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Edit Location</h2>
            <p className="mt-2 text-blue-100 text-sm">Update location information</p>
          </div>

          <div className="px-6 py-8 sm:px-8 sm:py-10">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4">
                <div className="flex items-start">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <InputField
                label="City"
                required
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
              />

              <InputField
                label="State"
                required
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
              />

              <InputField
                label="Location Code"
                required
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Enter code"
              />

                <div className="flex flex-col">
                {!showCountryDropdown ? (
                    <>
                        <InputField
                            label="Country"
                            name="countryName"
                            value={form.countryName}
                            readOnly
                        />
                        <button
                            type="button"
                            className="text-sm text-blue-600 underline mt-1 self-start"
                            onClick={() => setShowCountryDropdown(true)}
                        >
                            Change country
                        </button>
                    </>
                ) : (
                    <>
                    <label htmlFor="countryId" className="mb-1 font-medium text-gray-700">
                        Country
                    </label>
                    <select
                        name="countryId"
                        id="countryId"
                        value={form.countryId}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {countries.length > 0 &&
                        countries.map((c) => (
                            <option key={c.id} value={c.id}>
                            {c.name} ({c.code})
                            </option>
                        ))}
                    </select>
                    </>
                )}
                </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-lg shadow-blue-500/30 cursor-pointer"
              >
                {saving ? "Updating..." : "Update Location"}
              </button>

              <button
                onClick={() => navigate(-1)}
                disabled={saving}
                className="flex-1 sm:flex-initial bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Changes will be saved immediately upon update
        </p>
      </div>
    </div>
  );
};

export default LocationPage;
