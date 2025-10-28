import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";
import { FIELD_LABELS, ROLE_CONFIG, HIDDEN_FIELDS } from "@/app/config/roleConfig";
import { useUserProfile } from "@/hooks/useUserProfile";

const BusinessOwnerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Use the correct role config to fetch and map data
  const { data, loading, saving, hasChanges, handleChange, handleSubmit } =
    useUserProfile(id, "super_admin", ROLE_CONFIG, HIDDEN_FIELDS);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" />
      </div>
    );

  const config = ROLE_CONFIG.business_owner;
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No business owner data found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2" /> Back
        </Button>
        {hasChanges && <Badge variant="outline">Unsaved Changes</Badge>}
      </div>

      {Object.entries(config.sections).map(([sectionKey, section]) => (
        <div key={sectionKey} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map(
              (key) =>
                data?.[key] !== undefined && (
                  <div key={key}>
                    <label className="block text-sm text-gray-600 mb-1">
                      {FIELD_LABELS[key] || key}
                    </label>
                    <Input
                      value={data[key] ?? ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  </div>
                )
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default BusinessOwnerPage;
