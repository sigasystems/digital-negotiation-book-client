import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import {
  ArrowLeft,
  Save,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FIELD_LABELS = {
  buyersCompanyName: "Company Name",
  registrationNumber: "Registration Number",
  taxId: "Tax ID",
  contactName: "Contact Name",
  contactEmail: "Contact Email",
  countryCode: "Country Code",
  contactPhone: "Contact Phone",
  country: "Country",
  state: "State",
  city: "City",
  address: "Address",
  postalCode: "Postal Code",
  status: "Status",
  isVerified: "Verified",
  isDeleted: "Deleted",
  createdAt: "Created At",
  updatedAt: "Updated At",
};

const HIDDEN_FIELDS = ["id", "ownerId", "createdAt", "updatedAt"];

const FIELD_SECTIONS = {
  business: {
    title: "Business Details",
    icon: Building2,
    fields: [
      "buyersCompanyName",
      "registrationNumber",
      "taxId",
      "contactName",
      "contactEmail",
      "countryCode",
      "contactPhone",
    ],
  },
  location: {
    title: "Location",
    icon: MapPin,
    fields: ["address", "city", "state", "country", "postalCode"],
  },
  statusSection: {
    title: "Status",
    icon: User,
    fields: ["status", "isVerified", "isDeleted"],
  },
};

const UserPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalBuyer, setOriginalBuyer] = useState(null);

  const userRole = JSON.parse(sessionStorage.getItem("user") || "{}")?.userRole || "guest";

  useEffect(() => {
    if (!buyer) fetchBuyer();
    else setOriginalBuyer(buyer);
  }, [id]);

  const fetchBuyer = async () => {
    setLoading(true);
    try {
      const data = await roleBasedDataService.getById(userRole, { id, ownerId: buyer?.ownerId });
      setBuyer(data);
      setOriginalBuyer(data);
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch buyer");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setBuyer((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const changedData = Object.keys(buyer).reduce((acc, key) => {
        const newValue = buyer[key];
        const oldValue = originalBuyer[key];
        if (newValue !== oldValue && newValue !== undefined && newValue !== null) {
          acc[key] = newValue;
        }
        return acc;
      }, {});

      await roleBasedDataService.update(userRole, { id, ownerId: buyer.ownerId }, changedData);
      toast.success("Buyer Updated Successfully!");
      setHasChanges(false);
      setOriginalBuyer(buyer);
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update buyer");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Leave anyway?")) navigate(-1);
    } else {
      navigate(-1);
    }
  };

  if (loading || !buyer) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 text-lg">Loading buyer details...</p>
        </div>
      </div>
    );
  }

  const renderStatusBadge = (key) => {
    if (key === "status") {
      const isActive = buyer.status === "active";
      return (
        <Badge variant={isActive ? "default" : "destructive"} className="flex items-center gap-1">
          {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {buyer.status}
        </Badge>
      );
    }
    if (key === "isVerified" || key === "isDeleted") {
      const value = buyer[key];
      return (
        <Badge
          variant={value ? "default" : "destructive"}
          className="flex items-center gap-1"
        >
          {value ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {FIELD_LABELS[key]}: {value ? "Yes" : "No"}
        </Badge>
      );
    }
    return null;
  };

  const renderField = (key) => {
    const value = buyer[key] ?? "";
    const isEditable = !["id", "ownerId", "createdAt", "updatedAt"].includes(key);

    return (
      <div key={key} className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{FIELD_LABELS[key] || key}</label>
        {["status", "isVerified", "isDeleted"].includes(key) ? (
          renderStatusBadge(key)
        ) : isEditable ? (
          <Input
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={`Enter ${FIELD_LABELS[key]}`}
          />
        ) : (
          <p className="text-gray-700">{value}</p>
        )}
      </div>
    );
  };

  const renderSection = (sectionKey) => {
    const section = FIELD_SECTIONS[sectionKey];
    const Icon = section.icon;
    const visibleFields = section.fields.filter((f) => buyer.hasOwnProperty(f));
    if (!visibleFields.length) return null;

    return (
      <div key={sectionKey} className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleFields.map(renderField)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sticky top-17">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel} className={`cursor-pointer`}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Buyer Profile</h1>
            <p className="text-sm text-gray-500 mt-1">View or edit buyer details</p>
          </div>
          {hasChanges && <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Unsaved</Badge>}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8 space-y-8">
          {Object.keys(FIELD_SECTIONS).map(renderSection)}

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button variant="outline" className={`cursor-pointer`} onClick={handleCancel} disabled={saving}>Cancel</Button>
            <Button className={`cursor-pointer`} onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
