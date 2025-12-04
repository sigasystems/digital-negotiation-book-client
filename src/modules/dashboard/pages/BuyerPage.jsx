import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Save, X } from "lucide-react";
import { FIELD_LABELS, ROLE_CONFIG, HIDDEN_FIELDS } from "@/app/config/roleConfig";
import { useUserProfile } from "@/hooks/useUserProfile";
import ConfirmationModal from "@/components/common/ConfirmationModal"; // ✅ Import modal

const BuyerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Use correct mapping between buyer <-> business_owner
  const {
    data,
    loading,
    saving,
    hasChanges,
    handleChange,
    handleSubmit,
  } = useUserProfile(id, "business_owner", "super_admin", ROLE_CONFIG, HIDDEN_FIELDS);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // ✅ Modal state
  const config = ROLE_CONFIG.super_admin;

  const READ_ONLY_FIELDS = ["status", "isVerified", "isDeleted", "isApproved"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
          <p className="text-slate-600 font-medium">Loading buyer details...</p>
        </div>
      </div>
    );
  }

  if (!config || !config.sections) {
    console.error("ROLE_CONFIG.super_admin.sections missing");
    return (
      <div className="text-center text-red-600 mt-20 font-medium">
        Configuration missing for Buyer role.
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center text-gray-500 mt-20">
        No buyer data found.
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
    <div className="min-h-screen px-[24.5px]">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-20 shadow-sm rounded-xl">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="h-8 w-px bg-slate-300 hidden sm:block" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                Buyer Profile
              </h1>
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
      <main className="mx-auto py-4">
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
                            onChange={(e) =>
                              !READ_ONLY_FIELDS.includes(key) &&
                              handleChange(key, e.target.value)
                            }
                            disabled={READ_ONLY_FIELDS.includes(key)}
                            className={`${
                              READ_ONLY_FIELDS.includes(key)
                                ? "bg-slate-100 text-slate-600 cursor-not-allowed border-slate-200"
                                : "bg-slate-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            } transition-all duration-150`}
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

        {/* Actions */}
        <div className="sticky bottom-0 sm:static bg-white border-t border-slate-200 mt-10 py-4 px-4 sm:px-0 shadow-lg sm:shadow-none z-30">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="w-full sm:w-auto hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveClick}
              disabled={saving || !hasChanges}
              className=" button-styling"
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
      </main>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSave}
        title="Confirm Save"
        description="Are you sure you want to save these changes? This will update the buyer’s profile information."
        confirmText="Save Changes"
        cancelText="Cancel"
        confirmButtonColor="bg-blue-600 hover:bg-blue-700"
      />
    </div>
  );
};

export default BuyerPage;
