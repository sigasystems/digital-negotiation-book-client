import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  dashboardService
} from "@/modules/dashboard/services/dashboardService";
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
  first_name: "First Name",
  last_name: "Last Name",
  email: "Email",
  phoneNumber: "Phone Number",
  businessName: "Business Name",
  registrationNumber: "Registration Number",
  country: "Country",
  state: "State",
  city: "City",
  address: "Address",
  postalCode: "Postal Code",
  status: "Status",
  is_deleted: "Deleted",
  is_verified: "Verified",
  is_approved: "Approved",
  createdAt: "Created At",
  updatedAt: "Updated At",
};

const HIDDEN_FIELDS = [
  "id",
  "userId",
  "createdAt",
  "updatedAt",
  "is_deleted",
  "is_verified",
  "is_approved",
];

// Field sections for better organization
const FIELD_SECTIONS = {
  personal: {
    title: "Personal Information",
    icon: User,
    fields: ["first_name", "last_name", "email", "phoneNumber"],
  },
  business: {
    title: "Business Details",
    icon: Building2,
    fields: ["businessName", "registrationNumber"],
  },
  location: {
    title: "Location",
    icon: MapPin,
    fields: ["address", "city", "state", "country", "postalCode"],
  }
};

const UserPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);

  useEffect(() => {
    if (!user) fetchUser();
    else setOriginalUser(user);
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getBusinessOwnerById(id);
      setUser(res.data);
      setOriginalUser(res.data);
    } catch (err) {
      toast.error("Failed to fetch user");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await dashboardService.updateBusinessOwner(id, user);
      toast.success("User updated successfully");
      setHasChanges(false);
      setOriginalUser(user);
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading user details...</p>
        </div>
      </div>
    );
  }

  const renderStatusBadge = () => {
    if (!user.status) return null;
    const isActive = user.status.toLowerCase() === "active";
    return (
      <Badge
        variant={isActive ? "default" : "destructive"}
        className={`${
          isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        } flex items-center gap-1`}
      >
        {isActive ? (
          <CheckCircle2 className="w-3 h-3" />
        ) : (
          <XCircle className="w-3 h-3" />
        )}
        {user.status}
      </Badge>
    );
  };

  const renderField = (key) => {
    const value = user[key] ?? "";
    const isStatus = key === "status";

    return (
      <div key={key} className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {FIELD_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1)}
          {key === "email" && <Mail className="w-4 h-4 text-gray-400" />}
          {key === "phoneNumber" && <Phone className="w-4 h-4 text-gray-400" />}
        </label>
        
        {isStatus ? (
          <select
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        ) : (
          <Input
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="transition-all focus:ring-2 focus:ring-indigo-500"
            placeholder={`Enter ${FIELD_LABELS[key]?.toLowerCase() || key}`}
            type={key === "email" ? "email" : key === "phoneNumber" ? "tel" : "text"}
          />
        )}
      </div>
    );
  };

  const renderSection = (sectionKey, isLast = false) => {
    const section = FIELD_SECTIONS[sectionKey];
    const Icon = section.icon;
    const visibleFields = section.fields.filter(
      (field) => user.hasOwnProperty(field) && !HIDDEN_FIELDS.includes(field)
    );

    if (visibleFields.length === 0) return null;

    return (
      <div key={sectionKey}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {visibleFields.map(renderField)}
        </div>
        {!isLast && (
          <div className="border-b border-gray-200 mb-8"></div>
        )}
      </div>
    );
  };

  const sectionKeys = Object.keys(FIELD_SECTIONS);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button & Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="hover:bg-white cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Edit User Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Update user information and preferences
            </p>
          </div>
          <div className="flex items-center gap-3">
            {renderStatusBadge()}
            {hasChanges && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hidden sm:flex">
                Unsaved Changes
              </Badge>
            )}
          </div>
        </div>

        {/* Main Card - Everything in one unified card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* User Header inside card */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold truncate">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-indigo-100 flex items-center gap-2 mt-1 truncate">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Form Content - All sections in one flow */}
          <div className="p-8">
            {sectionKeys.map((key, index) => 
              renderSection(key, index === sectionKeys.length - 1)
            )}
          </div>

          {/* Action Buttons inside card */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="w-full sm:w-auto border-gray-300 hover:bg-white cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2 cursor-pointer" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;