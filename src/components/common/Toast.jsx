import { Info, AlertCircle, Check } from "lucide-react"

export const Toast = ({ type, message }) => {
  const colors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const Icon =
    type === "success"
      ? Check
      : type === "error"
      ? AlertCircle
      : Info;

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white z-50 ${colors[type] || colors.info}`}
    >
      <Icon size={18} />
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};