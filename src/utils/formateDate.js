import { toast } from "react-hot-toast";

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};  

export const validateOfferDates = (offerValidityDate, shipmentDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validity = offerValidityDate ? new Date(offerValidityDate) : null;
  const shipment = shipmentDate ? new Date(shipmentDate) : null;

  if (validity && validity < today)
    return "Offer validity date cannot be earlier than today.";

  if (shipment && shipment < today)
    return "Shipment date cannot be earlier than today.";

  if (shipment && validity && shipment < validity)
    return "Shipment date cannot be earlier than offer validity date.";

  return null;
};  

  export const formatHeader = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
};
