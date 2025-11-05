import { useState, useCallback, useRef } from "react";
import { businessOwnerService } from "@/modules/businessOwner/services/businessOwner";
import toast from "react-hot-toast";

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
  // store previous checked values to prevent redundant API calls
  const lastCheckedValues = useRef({
    email: "",
    businessName: "",
    registrationNumber: "",
  });
  // store timeout IDs for debounce
  const timeoutRefs = useRef({});
  const checkUniqueField = useCallback(async (field, value) => {
    // cancel old debounce
    if (timeoutRefs.current[field]) clearTimeout(timeoutRefs.current[field]);
    // if empty, reset error
    if (!value?.trim()) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    // skip if value same as last checked (avoid repeating)
    if (lastCheckedValues.current[field] === value) return;
    timeoutRefs.current[field] = setTimeout(async () => {
      setChecking((prev) => ({ ...prev, [field]: true }));

      try {
        const res = await businessOwnerService.checkUnique({ [field]: value });
        const { data } = res;
        lastCheckedValues.current[field] = value;

        if (!data?.success) {
          const msg = data?.message || "Validation failed.";
          setErrors((prev) => ({ ...prev, [field]: msg }));
          return;
        }

        if (data?.data?.exists) {
          const msg =
            field === "email"
              ? "Email already exists"
              : field === "businessName"
              ? "Business name already exists"
              : "Registration number already exists";
          setErrors((prev) => ({ ...prev, [field]: msg }));
        } else {
          setErrors((prev) => ({ ...prev, [field]: "" }));
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Unable to verify this field right now.";
        setErrors((prev) => ({ ...prev, [field]: msg }));
      } finally {
        setChecking((prev) => ({ ...prev, [field]: false }));
      }
    }, 600); // debounce: 600ms
  }, []);

  return { checking, errors, setErrors, checkUniqueField };
}
