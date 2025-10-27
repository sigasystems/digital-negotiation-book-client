export const validateField = {
  email: (value) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Enter a valid email";
    return true;
  },

  password: (value) => {
    if (!value) return "Password is required";
    // Minimum 8 chars, 1 uppercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}<>?/|~`])[A-Za-z\d!@#$%^&*()[\]{}<>?/|~`]{8,}$/;

    if (!passwordRegex.test(value)) {
      return "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character";
    }
    return true;
  },

  required: (fieldName) => (value) => {
    if (!value) return `${fieldName} is required`;
    return true;
  },

  minLength: (fieldName, length) => (value) => {
    if (!value || value.length < length)
      return `${fieldName} must be at least ${length} characters`;
    return true;
  },

  maxLength: (fieldName, length) => (value) => {
    if (value && value.length > length)
      return `${fieldName} must be less than ${length} characters`;
    return true;
  },
};
