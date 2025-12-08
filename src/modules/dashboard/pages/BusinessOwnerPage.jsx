import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Save, X, Building2 } from "lucide-react";
import { FIELD_LABELS, ROLE_CONFIG, HIDDEN_FIELDS } from "@/app/config/roleConfig";
import { useUserProfile } from "@/hooks/useUserProfile";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const BusinessOwnerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, saving, hasChanges, handleChange, handleSubmit } =
    useUserProfile(id, "super_admin", "business_owner", ROLE_CONFIG, HIDDEN_FIELDS);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const config = ROLE_CONFIG.business_owner;

  const READ_ONLY_FIELDS = ["status", "isVerified", "isDeleted", "isApproved"];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative">
          <div className="w-10 h-10 border-2 border-slate-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin duration-700"></div>
        </div>
        <p className="text-slate-600 font-medium mt-3">Loading business owner details...</p>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No Business Owner Data</h3>
          <p className="text-slate-600 mb-4">The business owner you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(-1)} variant="outline" size="sm">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveClick = () => {
    if (!hasChanges) return;
    setIsConfirmOpen(true);
  };

  const confirmSave = async () => {
    setIsConfirmOpen(false);
    await handleSubmit();
  };

  return (
    <div className="relative min-h-screen px-[24.5px] bg-slate-50">
      {saving && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-all duration-300">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin duration-700"></div>
          </div>
          <p className="text-slate-700 font-medium mt-2 animate-pulse duration-1000">Saving changes...</p>
          <p className="text-sm text-slate-500">Please don't close the window</p>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-17 bg-white border-b border-slate-200 shadow-sm z-20 rounded-lg mb-6 transition-all duration-200">
        <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-slate-100 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-all duration-200" /> Back
            </Button>

            <div className="flex items-center gap-3 ml-3">
            <div className="h-8 w-px bg-slate-200 hidden sm:block transition-all duration-300" />
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900 transition-all duration-200">
                  Business Owner Profile
                </h1>
                </div>
              </div>
            </div>
          </div>

          {hasChanges && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 text-sm font-normal transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse duration-1000"></span>
              Unsaved Changes
            </Badge>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto">
        <div className="space-y-6">
          {Object.entries(config.sections).map(([sectionKey, section]) => (
            <div
              key={sectionKey}
              className="bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {/* Section Header */}
              <div className="border-b border-slate-100 px-6 py-4 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 transition-all duration-200">
                  {section.title}
                </h2>
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {section.fields.map(
                    (key) =>
                      data?.[key] !== undefined && (
                        <div key={key} className="space-y-2">
                          <label className="block text-sm font-medium text-slate-700 transition-all duration-200">
                            {FIELD_LABELS[key] || key}
                          </label>
                          <Input
                            value={data[key] ?? ""}
                            onChange={(e) =>
                              !READ_ONLY_FIELDS.includes(key) &&
                              handleChange(key, e.target.value)
                            }
                            disabled={READ_ONLY_FIELDS.includes(key)}
                            className={`
                              h-9 py-2 text-sm transition-all duration-200
                              ${
                              READ_ONLY_FIELDS.includes(key)
                                ? "bg-slate-100 text-slate-600 cursor-not-allowed border-slate-200"
                                : "bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-slate-300 hover:border-slate-400"
                            }`}
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

        {hasChanges && !saving && (
          <div className="mt-6 transition-all duration-300">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse duration-1000"></div>
                <div className="transition-all duration-200">
                  <p className="text-sm font-medium text-blue-800">
                    You have unsaved changes
                  </p>
                  <p className="text-xs text-blue-600">
                    Review your changes before saving
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 mt-10 py-4 px-4 shadow-lg z-30 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 cursor-pointer"
            >
              <X className="w-4 h-4 mr-2 transition-all duration-200" /> Cancel
            </Button>
            <Button
              onClick={handleSaveClick}
              disabled={saving || !hasChanges}
              className="button-styling shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin duration-700" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2 transition-all duration-200" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Spacer for mobile sticky button */}
        <div className="h-20 sm:hidden" />
      </main>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSave}
        title="Confirm Save"
        description="Are you sure you want to save these changes? This will update the business owner's profile."
        confirmText="Save Changes"
        cancelText="Cancel"
        confirmButtonColor="bg-[#16a34a] hover:bg-green-700"
      />
    </div>
  );
};

export default BusinessOwnerPage;
