export const validateBuyer = (data) => {
  if (!data.buyersCompanyName.trim()) return "Company name is required";
  if (!data.contactName.trim()) return "Contact name is required";

  if (!data.contactEmail.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.contactEmail)) return "Enter a valid email";

  if (!data.country.trim()) return "Country is required";
  if (!data.countryCode.trim()) return "Country code is required";

  return null;
};
