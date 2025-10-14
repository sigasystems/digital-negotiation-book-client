import React from "react";
import { X, Building2, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Shield } from "lucide-react";

const ViewContent = ({ isOpen, onClose, owner }) => {
  if (!isOpen || !owner) return null;

  const sections = [
    {
      title: "Personal Information",
      icon: <Shield className="w-4 h-4" />,
      fields: [
        { label: "First Name", value: owner.first_name, icon: <Mail className="w-4 h-4" /> },
        { label: "Last Name", value: owner.last_name },
        { label: "Email", value: owner.email, icon: <Mail className="w-4 h-4" /> },
        { label: "Phone", value: owner.phoneNumber, icon: <Phone className="w-4 h-4" /> },
      ]
    },
    {
      title: "Business Details",
      icon: <Building2 className="w-4 h-4" />,
      fields: [
        { label: "Business Name", value: owner.businessName },
        { label: "Registration No", value: owner.registrationNumber },
      ]
    },
    {
      title: "Address",
      icon: <MapPin className="w-4 h-4" />,
      fields: [
        { label: "Street", value: owner.address },
        { label: "City", value: owner.city },
        { label: "State", value: owner.state },
        { label: "Country", value: owner.country },
        { label: "Postal Code", value: owner.postalCode },
      ]
    },
    {
      title: "Account Status",
      icon: <CheckCircle className="w-4 h-4" />,
      fields: [
        { label: "Status", value: owner.status, type: "status" },
        { label: "Verified", value: owner.is_verified, type: "boolean" },
        { label: "Approved", value: owner.is_approved, type: "boolean" },
        { label: "Deleted", value: owner.is_deleted, type: "boolean-negative" },
      ]
    },
    {
      title: "Timestamps",
      icon: <Calendar className="w-4 h-4" />,
      fields: [
        { label: "Created", value: new Date(owner.createdAt).toLocaleString() },
        { label: "Updated", value: new Date(owner.updatedAt).toLocaleString() },
      ]
    }
  ];

  const renderValue = (field) => {
    if (field.type === "status") {
      const isActive = field.value === "active";
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          isActive 
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
          {field.value}
        </span>
      );
    }
    
    if (field.type === "boolean" || field.type === "boolean-negative") {
      const isPositive = field.type === "boolean" ? field.value : !field.value;
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
          isPositive 
            ? "bg-emerald-50 text-emerald-700" 
            : "bg-gray-100 text-gray-600"
        }`}>
          {isPositive ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <XCircle className="w-3.5 h-3.5" />
          )}
          {field.value ? "Yes" : "No"}
        </span>
      );
    }
    
    return <span className="text-gray-900 font-medium">{field.value || "—"}</span>;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Business Owner</h2>
                <p className="text-sm text-gray-300 mt-0.5">Detailed information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 group cursor-pointer"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6 bg-gray-50">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="text-gray-600">{section.icon}</div>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  {section.title}
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {section.fields.map((field) => (
                  <div
                    key={field.label}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      {field.icon && <span className="text-gray-400">{field.icon}</span>}
                      <span className="text-sm font-medium text-gray-600">{field.label}</span>
                    </div>
                    <div className="sm:text-right">
                      {renderValue(field)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg font-medium hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewContent;