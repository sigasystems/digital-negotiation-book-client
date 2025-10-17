import { Eye, Edit, Trash2, CheckCircle, XCircle, Save } from "lucide-react";
import { Button } from "@headlessui/react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ViewContent from "@/components/common/ViewContent";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import { toast } from "react-hot-toast";

export const ActionsCell = ({ row, refreshData, userActions = [] }) => {
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role = userInfo?.userRole || "super_admin";
  const record = row?.original || {};
  const isActive = record.status === "active";

  const actionHandlers = {
    view: async () => {
      setLoadingAction("view");
      try {
        const data = await roleBasedDataService.getById(role, record);
        setDetails(data);
        setIsModalOpen(true);
      } catch (err) {
        console.error("Error fetching details:", err);
        toast.error(err.error);
      } finally {
        setLoadingAction(null);
      }
    },

    edit: () => {
      navigate(`/user/${record.id}`, { state: record });
    },

    activate: async () => {
      setLoadingAction("activate");
      try {
        await roleBasedDataService.activate(role, record.id);
        toast.success("Activated successfully");
        refreshData?.();
      } catch (err) {
        console.error("Activation failed:", err);
        toast.error("Failed to activate record");
      } finally {
        setLoadingAction(null);
      }
    },

    deactivate: async () => {
      setLoadingAction("deactivate");
      try {
        await roleBasedDataService.deactivate(role, record.id);
        toast.success("Deactivated successfully");
        refreshData?.();
      } catch (err) {
        console.error("Deactivation failed:", err);
        toast.error("Failed to deactivate record");
      } finally {
        setLoadingAction(null);
      }
    },

    delete: async () => {
      if (!window.confirm("Are you sure you want to delete this record?")) return;
      setLoadingAction("delete");
      try {
        await roleBasedDataService.softDelete(role, record.id);
        toast.success("Deleted successfully");
        refreshData?.();
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete record");
      } finally {
        setLoadingAction(null);
      }
    },

    update: async () => {
      setLoadingAction("update");
      try {
        await roleBasedDataService.update(role, record.id, record);
        toast.success("Updated successfully");
        refreshData?.();
      } catch (err) {
        console.error("Update failed:", err);
        toast.error("Failed to update record");
      } finally {
        setLoadingAction(null);
      }
    },
  };

  const actionIcons = {
    view: { icon: Eye, color: "text-blue-600 hover:bg-blue-50" },
    edit: { icon: Edit, color: "text-indigo-600 hover:bg-indigo-50" },
    activate: { icon: CheckCircle, color: "text-green-600 hover:bg-green-50" },
    deactivate: { icon: XCircle, color: "text-yellow-600 hover:bg-yellow-50" },
    delete: { icon: Trash2, color: "text-red-600 hover:bg-red-50" },
    update: { icon: Save, color: "text-emerald-600 hover:bg-emerald-50" },
  };

  const filteredActions = useMemo(() => {
    return userActions
      .map((key) => {
        const config = actionIcons[key];
        const handler = actionHandlers[key];
        if (!config || !handler) return null;

        if (key === "activate" && isActive) return null;
        if (key === "deactivate" && !isActive) return null;

        return {
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          icon: config.icon,
          color: config.color,
          handler,
        };
      })
      .filter(Boolean);
  }, [userActions, isActive, record]);

  return (
    <>
      <div className="flex items-center gap-2">
        {filteredActions.map(({ key, icon: Icon, color, handler }) => (
          <Button
            key={key}
            onClick={handler}
            disabled={!!loadingAction}
            className={`p-1 rounded-md transition-colors duration-150 ${color} ${
              loadingAction === key
                ? "opacity-50 cursor-wait"
                : "cursor-pointer"
            }`}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      <ViewContent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        owner={details}
      />
    </>
  );
};
