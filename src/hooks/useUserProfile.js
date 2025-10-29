import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import { normalizeData, denormalizeData } from "@/utils/normalizeUtils";

export const useUserProfile = (id, apiRole, uiRole, config, hiddenFields) => {
  const [data, setData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sessionUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      const payload = { id };

      if (apiRole === "business_owner" && sessionUser?.id) {
        payload.ownerId = sessionUser.id;
      }

      const res = await roleBasedDataService.getById(apiRole, payload);
      let record = res?.data?.data || res?.data || res;

      // Handle nested objects
      if (record?.buyer) record = record.buyer;
      if (record?.businessOwner) record = record.businessOwner;

      const normalized = normalizeData(record, uiRole, config, hiddenFields);
      setData(normalized);
      setOriginalData(JSON.parse(JSON.stringify(normalized)));
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const changedFields = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== originalData[key]) acc[key] = data[key];
        return acc;
      }, {});

      if (!Object.keys(changedFields).length) {
        toast("No changes detected");
        setSaving(false);
        return;
      }

      const payload = denormalizeData(changedFields, uiRole, config, hiddenFields);
      await roleBasedDataService.update(apiRole, { id }, payload);

      toast.success("Profile updated successfully");
      setOriginalData(JSON.parse(JSON.stringify(data)));
      setHasChanges(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return { data, loading, saving, hasChanges, handleChange, handleSubmit };
};
