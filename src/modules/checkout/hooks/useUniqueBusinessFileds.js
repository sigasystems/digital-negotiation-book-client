import { useState, useCallback, useRef } from "react";
import { businessOwnerService } from "@/modules/businessOwner/services/businessOwner";

export default function useUniqueBusinessField() {
  const [checking, setChecking] = useState({
    email: false,
    businessName: false,
    registrationNumber: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    businessName: "",
    registrationNumber: "",
  });
  const lastCheckedValues = useRef({
    email: "",
    businessName: "",
    registrationNumber: "",
  });
  const timeoutRefs = useRef({});
  const checkUniqueField = useCallback(async (field, value) => {
    if (timeoutRefs.current[field]) clearTimeout(timeoutRefs.current[field]);
    const trimmedValue = value?.trim();
    if (!trimmedValue) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    // skip duplicate checks
    if (lastCheckedValues.current[field] === trimmedValue) return;
    timeoutRefs.current[field] = setTimeout(async () => {
      setChecking((prev) => ({ ...prev, [field]: true }));

      try {
        const res = await businessOwnerService.checkUnique({ [field]: trimmedValue });
        const { data } = res;
        lastCheckedValues.current[field] = trimmedValue;

        if (data?.data?.exists) {
          setErrors((prev) => ({ ...prev, [field]: "Already exists. Please use another.", }));
        } else {
          setErrors((prev) => ({ ...prev, [field]: "" }));
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Server error while checking. Please try again.";
        setErrors((prev) => ({ ...prev, [field]: msg }));
      } finally {
        setChecking((prev) => ({ ...prev, [field]: false }));
      }
    }, 600); // debounce: 600ms
  }, []);

  return { checking, errors, setErrors, checkUniqueField };
}
