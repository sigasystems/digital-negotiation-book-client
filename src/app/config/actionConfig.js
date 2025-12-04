import { Eye, Edit, Trash2, CheckCircle, XCircle, Save } from "lucide-react";

export const ACTION_ICONS = {
  view: { icon: Eye, color: "text-[#0ea5e9] hover:bg-blue-50" },
  edit: { icon: Edit, color: "text-[#6366f1] hover:bg-indigo-50" },
  activate: { icon: CheckCircle, color: "text-[#4ade80] hover:bg-green-50" },
  deactivate: { icon: XCircle, color: "text-[#eab308] hover:bg-yellow-50" },
  delete: { icon: Trash2, color: "text-[#f87171] hover:bg-red-50" },
  update: { icon: Save, color: "text-[#34d399] hover:bg-emerald-50" },
};

export const ACTION_LOADING_MESSAGES = {
  activate: "Activating...",
  deactivate: "Deactivating...",
  delete: "Deleting...",
  update: "Updating...",
  edit: "Opening editor...",
  view: "Loading...",
};
