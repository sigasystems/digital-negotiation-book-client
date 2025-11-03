import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { offerDraftService } from "@/modules/offerDraft/services";

const EMPTY_BREAKUP = { size: "", breakup: "", price: "" };

export const useOfferDraftForm = (id) => {
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await offerDraftService.getDraftById(id);
        const draft = res?.data?.data?.draft;
        if (!draft) throw new Error("No draft found");

        const normalized = {
          ...draft,
          offerValidityDate: draft.offerValidityDate
            ? format(new Date(draft.offerValidityDate), "yyyy-MM-dd")
            : "",
          shipmentDate: draft.shipmentDate
            ? format(new Date(draft.shipmentDate), "yyyy-MM-dd")
            : "",
          sizeBreakups: Array.isArray(draft.sizeBreakups)
            ? draft.sizeBreakups
            : [EMPTY_BREAKUP],
        };

        setFormData(normalized);
        setOriginalData(normalized);
      } catch (err) {
        console.error("Error fetching draft:", err);
        toast.error("Failed to load offer draft.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const total = useMemo(
    () =>
      formData?.sizeBreakups?.reduce(
        (sum, s) => sum + (parseFloat(s.breakup) || 0),
        0
      ) || 0,
    [formData]
  );

  const isChanged = useMemo(() => {
    if (!formData || !originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const buildChangedFields = (newData, oldData) => {
    const diff = {};
    for (const key in newData) {
      if (JSON.stringify(newData[key]) !== JSON.stringify(oldData[key])) {
        diff[key] = newData[key];
      }
    }
    return diff;
  };

  return {
    formData,
    setFormData,
    originalData,
    setOriginalData,
    loading,
    total,
    isChanged,
    buildChangedFields,
  };
};
