import { useNavigate } from "react-router-dom";


export const navigateToEditPage = () => {
const navigate = useNavigate()
  switch (role) {
    case "business_owner":
      navigate(`/business-owner/${record.id}`, { state: record });
      break;

    case "buyer":
      navigate(`/buyer/${record.id}`, { state: record });
      break;

    case "super_admin":
      // If super_admin is editing another role's record
      if (record.type === "buyer" || record.buyer_id) {
        navigate(`/buyer/${record.id}`, { state: record });
      } else if (record.type === "business_owner" || record.owner_id) {
        navigate(`/business-owner/${record.id}`, { state: record });
      } else {
        toast.error("Unknown record type for super_adminqqqq");
      }
      break;

    default:
      toast.error("Unsupported role for editing");
      break;
  }
};
