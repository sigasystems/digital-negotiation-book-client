export const BUYER_FORM_FIELDS = {
  company: [
    { name: "buyersCompanyName", label: "Company Name", required: true },
    { name: "registrationNumber", label: "Registration Number" },
    { name: "taxId", label: "Tax ID" },
    { name: "country", label: "Country", required: true },
  ],
  contact: [
    { name: "contactName", label: "Contact Name", required: true },
    { name: "contactEmail", label: "Email Address", required: true, type: "email" },
    { name: "countryCode", label: "Country Code", required: true },
    { name: "contactPhone", label: "Phone Number" },
  ],
  address: [
    { name: "state", label: "State/Province" },
    { name: "city", label: "City" },
    { name: "postalCode", label: "Postal Code" },
  ],
};
