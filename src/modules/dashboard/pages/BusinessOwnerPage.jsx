import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Save, X, Building2 } from "lucide-react";
import { FIELD_LABELS, ROLE_CONFIG, HIDDEN_FIELDS } from "@/app/config/roleConfig";
import { useUserProfile } from "@/hooks/useUserProfile";

const BusinessOwnerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, saving, hasChanges, handleChange, handleSubmit } =
    useUserProfile(id, "super_admin", ROLE_CONFIG, HIDDEN_FIELDS);

  const config = ROLE_CONFIG.super_admin;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
          <p className="text-slate-600 font-medium">Loading business owner details...</p>
        </div>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center text-gray-500 mt-20">
        No business owner data found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="sticky top-0 bg-white border-b border-slate-200 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="h-8 w-px bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Business Owner Profile
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">Owner ID: {id}</p>
              </div>
            </div>
          </div>

          {hasChanges && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-300 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Changes
            </Badge>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {Object.entries(config.sections).map(([sectionKey, section]) => (
            <div
              key={sectionKey}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Section Header */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-5 py-4 border-b border-slate-200">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  {section.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {section.fields.length} field
                  {section.fields.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Fields */}
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
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
                            className="bg-slate-50 hover:bg-white transition-all duration-150 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        {/* Action Buttons */}
        <div className="sticky bottom-0 sm:static bg-white border-t border-slate-200 mt-10 py-4 px-4 sm:px-0 shadow-lg sm:shadow-none z-30">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="w-full sm:w-auto hover:bg-slate-100"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !hasChanges}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
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

        {/* Spacer for mobile sticky button */}
        <div className="h-20 sm:hidden" />
      </main>
    </div>
  );
};

export default BusinessOwnerPage;
