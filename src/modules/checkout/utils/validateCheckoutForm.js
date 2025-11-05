

// ✅ Single-field validation (for instant feedback on change)
export const validateSingleField = (name, value) => {
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

  // Check if field is required and empty
  if (requiredFields.includes(name) && !value?.trim()) {
    return "This field is required";
  }
  // Email validation
  if (name === "email") {
    if (!value?.trim()) return "Email is required";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return "Invalid email format";
    }
  }
  // Phone number validation
  if (name === "phoneNumber") {
    if (!value?.trim()) return "Phone number is required";
    if (!/^[0-9]{10}$/.test(value.trim())) {
      return "Enter a valid 10-digit phone number";
    }
  }
  // Password validation
  if (name === "password") {
    if (!value?.trim()) return "Password is required";
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
  }
  // First name validation
  if (name === "first_name") {
    if (!value?.trim()) return "First name is required";
    if (value.trim().length < 2) {
      return "First name must be at least 2 characters";
    }
  }
  // Last name validation
  if (name === "last_name") {
    if (!value?.trim()) return "Last name is required";
    if (value.trim().length < 2) {
      return "Last name must be at least 2 characters";
    }
  }
  // Business name validation
  if (name === "businessName") {
    if (!value?.trim()) return "Business name is required";
    if (value.trim().length < 2) {
      return "Business name must be at least 2 characters";
    }
  }
  return ""; // No error
};

// ✅ Full form validation (on submit)
export const validateCheckoutForm = (formData) => {
  const errors = {};
  // Validate all required fields
  const requiredFields = [
    { name: "first_name", label: "First name" },
    { name: "last_name", label: "Last name" },
    { name: "email", label: "Email" },
    { name: "password", label: "Password" },
    { name: "phoneNumber", label: "Phone number" },
    { name: "businessName", label: "Business name" },
    { name: "address", label: "Address" },
    { name: "city", label: "City" },
    { name: "country", label: "Country" },
  ];
  requiredFields.forEach(({ name, label }) => {
    if (!formData[name]?.trim()) {
      errors[name] = `${label} is required`;
    }
  });
  // Email validation
  if (formData.email) {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = "Invalid email format";
    }
  }

  // Phone number validation
  if (formData.phoneNumber) {
    if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Enter a valid 10-digit phone number";
    }
  }
  // Password validation
  if (formData.password && formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  // First name validation
  if (formData.first_name && formData.first_name.trim().length < 2) {
    errors.first_name = "First name must be at least 2 characters";
  }
  // Last name validation
  if (formData.last_name && formData.last_name.trim().length < 2) {
    errors.last_name = "Last name must be at least 2 characters";
  }
  // Business name validation
  if (formData.businessName && formData.businessName.trim().length < 2) {
    errors.businessName = "Business name must be at least 2 characters";
  }

  return errors;
};