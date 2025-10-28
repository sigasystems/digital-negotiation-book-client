// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, ArrowLeft } from "lucide-react";
// import { FIELD_LABELS, ROLE_CONFIG, HIDDEN_FIELDS } from "@/app/config/roleConfig";
// import { useUserProfile } from "@/hooks/useUserProfile";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Save, X, User } from "lucide-react";

// Mock data and config for demonstration
const FIELD_LABELS = {
  company_name: "Company Name",
  business_email: "Business Email",
  phone: "Phone Number",
  address: "Address",
  city: "City",
  state: "State",
  zip_code: "ZIP Code",
  industry: "Industry",
  website: "Website",
  tax_id: "Tax ID",
};

const ROLE_CONFIG = {
  super_admin: {
    sections: {
      basic: {
        title: "Basic Information",
        fields: ["company_name", "business_email", "phone", "website"],
      },
      location: {
        title: "Location Details",
        fields: ["address", "city", "state", "zip_code"],
      },
      business: {
        title: "Business Information",
        fields: ["industry", "tax_id"],
      },
    },
  },
};

const BuyerPage = () => {
  const id = "12345"; // Mock ID
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [data, setData] = useState({
    company_name: "Acme Corporation",
    business_email: "contact@acme.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave",
    city: "San Francisco",
    state: "CA",
    zip_code: "94102",
    industry: "Technology",
    website: "https://acme.com",
    tax_id: "12-3456789",
  });

  const handleChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setHasChanges(false);
    alert("Changes saved successfully!");
  };

  const goBack = () => {
    alert("Navigate back");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const config = ROLE_CONFIG.super_admin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={goBack}
                className="hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="h-8 w-px bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                    Business Owner Profile
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">ID: {id}</p>
                </div>
              </div>
            </div>
            
            {hasChanges && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 self-start sm:self-center">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse" />
                Unsaved Changes
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="space-y-6 lg:space-y-8">
          {Object.entries(config.sections).map(([sectionKey, section]) => (
            <div 
              key={sectionKey} 
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Section Header */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-4 sm:px-6 py-4 border-b border-slate-200">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  {section.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {section.fields.length} field{section.fields.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Section Content */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {section.fields.map(
                    (key) =>
                      data?.[key] !== undefined && (
                        <div key={key} className="space-y-2">
                          <label className="block text-sm font-medium text-slate-700">
                            {FIELD_LABELS[key] || key}
                          </label>
                          <Input
                            value={data[key] ?? ""}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 hover:bg-white"
                            placeholder={`Enter ${FIELD_LABELS[key] || key}`}
                          />
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons - Fixed at bottom on mobile, inline on desktop */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg sm:relative sm:bg-transparent sm:border-0 sm:shadow-none sm:mt-8 sm:p-0 z-20">
          <div className="max-w-7xl mx-auto flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={goBack}
              className="w-full sm:w-auto hover:bg-slate-100 transition-colors"
              disabled={saving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={saving || !hasChanges}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Spacer for fixed buttons on mobile */}
        <div className="h-20 sm:hidden" />
      </div>
    </div>
  );
};

export default BuyerPage;
