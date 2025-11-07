import { Eye, Edit, Trash2, CheckCircle, XCircle, Save } from "lucide-react";

export const ACTION_ICONS = {
  view: { icon: Eye, color: "text-blue-600 hover:bg-blue-50" },
  edit: { icon: Edit, color: "text-indigo-600 hover:bg-indigo-50" },
  activate: { icon: CheckCircle, color: "text-green-600 hover:bg-green-50" },
  deactivate: { icon: XCircle, color: "text-yellow-600 hover:bg-yellow-50" },
  delete: { icon: Trash2, color: "text-red-600 hover:bg-red-50" },
  update: { icon: Save, color: "text-emerald-600 hover:bg-emerald-50" },
};

export const ACTION_LOADING_MESSAGES = {
  activate: "Activating...",
  deactivate: "Deactivating...",
  delete: "Deleting...",
  update: "Updating...",
  edit: "Opening editor...",
  view: "Loading...",
};
