import { businessOwnerService } from "@/modules/businessOwner/services/businessOwner";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export default function useUniqueBusinessField() {
  const [checking, setChecking] = useState({
    email: false,
    businessName: false,
    registrationNumber: false,
  });
  const [errors, setErrors] = useState({});

  const debounce = (fn, delay = 600) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const checkUniqueField = useCallback(
    debounce(async (field, value) => {
      if (!value?.trim()) return;
      setChecking((prev) => ({ ...prev, [field]: true }));

      try {
        const res = await businessOwnerService.checkUnique({ [field]: value });
        const { data } = res;

        if (!data?.success) {
          const msg = data?.message || "Validation failed";
          toast.error(msg);
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
          toast.error(msg);
        } else {
          setErrors((prev) => ({ ...prev, [field]: "" }));
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Unable to check uniqueness at the moment.";
        toast.error(msg);
      } finally {
        setChecking((prev) => ({ ...prev, [field]: false }));
      }
    }, 600),
    []
  );

  return { checking, errors, setErrors, checkUniqueField };
}
