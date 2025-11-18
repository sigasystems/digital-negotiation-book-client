// Clean record name
export const getRecordDisplayName = (record) => {
  if (!record) return "Record";
  return (
    record.businessName ||
    record.buyersCompanyName ||
    `${record.first_name || ""} ${record.last_name || ""}`.trim() ||
    record.productName ||
    record.name ||
    "Record"
  );
};

// Determine entity type
export const getEntityType = (record) => {
  if (!record) return null;
  const {country, code} = record
  if(country && code) return "country"
  if (record.offerName) return "offer";
  if (record.draftNo || record.type === "offer_draft") return "offer_draft";
  if (record.productName || record.type === "product") return "product";
  if (record.businessName) return "business_owner";
  if (record.buyersCompanyName) return "buyer";

  return "unknown";
};

// Resolve final route (role + entity)
export const resolveEntityRoute = (role, record) => {
  const id = record?.id || record?._id || record.draftNo;
  if (!id) return null;

  const entity = getEntityType(record);

  if (entity === "offer") {
    return `/negotiation/${record.id || id}`;
  }

  if (entity === "offer_draft") {
    return `/offer-draft/${record.draftNo || id}`;
  }

  if (entity === "product") {
    return `/product/${id}`;
  }

  if(entity === "country") {
    return `/country/${record.id || id}`
  }

  // role-based routing logic
  if (role === "super_admin") {
    return `/business-owner/${id}`;
  }

  if (role === "business_owner") {
    return `/buyer/${id}`;
  }

  return null;
};
