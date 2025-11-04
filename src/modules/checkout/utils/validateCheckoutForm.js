// ✅ Full form validation (on submit)
export const validateCheckoutForm = (formData) => {
  const errors = {};
  const requiredFields = [
    "first_name",
    "last_name",
    "email",
    "password",
    "phoneNumber",
    "businessName",
    "address",
    "city",
    "country",
  ];

  requiredFields.forEach((field) => {
    if (!formData[field]?.trim()) {
      errors[field] = "This field is required";
    }
  });

  if (formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (formData.phoneNumber && !/^[0-9]{10}$/.test(formData.phoneNumber)) {
    errors.phoneNumber = "Enter a valid 10-digit phone number";
  }

  return errors;
};

// ✅ Single-field validation (for instant feedback)
export const validateSingleField = (name, value) => {
  if (!value?.trim()) return "This field is required";

  if (name === "email" && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return "Invalid email format";
  }

  if (name === "phoneNumber" && !/^[0-9]{10}$/.test(value)) {
    return "Enter a valid 10-digit phone number";
  }

  return "";
};
