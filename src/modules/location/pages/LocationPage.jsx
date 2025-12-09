import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { countryServices } from "@/modules/country/service";
import toast from "react-hot-toast";
import { InputField } from "@/components/common/InputField";
import { ArrowLeft, MapPin, Save, X, Loader2 } from "lucide-react";

const Button = ({ variant = 'default', size = 'md', children, className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    default: 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700',
    ghost: 'hover:bg-slate-100 text-slate-700'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm'
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

const Spinner = ({ className = '' }) => (
  <Loader2 className={`animate-spin ${className}`} />
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, description, confirmText, cancelText, confirmButtonColor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            {cancelText}
          </Button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all duration-200 ${confirmButtonColor} cursor-pointer`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const hasChanges = 
    form.city !== original.city ||
    form.state !== original.state ||
    form.code !== original.code ||
    form.countryId !== original.countryId;

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
      setIsConfirmOpen(false);
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
      setIsConfirmOpen(false);
      navigate(-1);
    } catch (err) {
      console.error(err);
      setError("Update failed.");
      setIsConfirmOpen(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600 font-medium text-base sm:text-lg">Loading location details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8 px-[24.5px] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {saving && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Spinner className="w-8 h-8 text-indigo-600 mb-3" />
          <p className="text-slate-700 font-medium">Updating location...</p>
        </div>
      )}

      <header className="sticky top-17 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm z-20 rounded-lg">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="cursor-pointer hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="h-8 w-px bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                  Edit Location
                </h1>
              </div>
            </div>
          </div>

            <div className="flex items-center gap-3">
          {hasChanges && (
            <Badge className="bg-amber-50 text-amber-700 border-amber-300 px-3 py-1.5 text-xs sm:text-sm font-medium animate-pulse">
                  <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Changes
                  </div>
            </Badge>
          )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto py-4">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow p-5 sm:p-6 lg:p-8">
          
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <InputField
                label="City"
                required
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="cursor-pointer"
              />

              <InputField
                label="State"
                required
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="cursor-pointer"
              />

              <InputField
                label="Location Code"
                required
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Enter code"
                className="cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                <div className="flex flex-col">
                {!showCountryDropdown ? (
                    <>
                        <InputField
                            label="Country"
                            name="countryName"
                            value={form.countryName}
                            readOnly
                          className="cursor-pointer"
                        />
                        <button
                            type="button"
                            className="text-sm text-indigo-600 hover:text-indigo-700 underline mt-1.5 self-start transition-colors cursor-pointer"
                            onClick={() => setShowCountryDropdown(true)}
                        >
                            Change country
                        </button>
                    </>
                ) : (
                    <>
                    <label className="mb-1.5 font-medium text-slate-700 text-sm">
                        Country <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="countryId"
                        value={form.countryId}
                        onChange={handleChange}
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                    >
                        {countries.map((c) => (
                            <option key={c.id} value={c.id}>
                            {c.name} ({c.code})
                            </option>
                        ))}
                    </select>
                    </>
                )}
                </div>
            </div>
          </div>
        </div>
      </main>

      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-sm z-20 mt-10 rounded-lg">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              {hasChanges ? (
                <div className="flex items-center gap-2 text-amber-600">
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
                  <span className="font-medium">You have unsaved changes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <span className="font-medium">All changes saved</span>
                </div>
              )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={saving}
            className="cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <button
            onClick={() => setIsConfirmOpen(true)}
            disabled={saving || !hasChanges}
            className="cursor-pointer text-white shadow-md hover:shadow-lg bg-[#16a34a] flex justify-center items-center px-4 py-2 rounded-lg"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </>
            )}
          </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleUpdate}
        title="Confirm Update"
        description="Are you sure you want to save these location changes?"
        confirmText="Update Location"
        cancelText="Cancel"
        confirmButtonColor="bg-[#16a34a] hover:bg-green-700"
      />
    </div>
  );
};

export default LocationPage;
