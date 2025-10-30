import { Eye, Edit, Trash2, CheckCircle, XCircle, Save } from "lucide-react";
import { Button } from "@headlessui/react";
import { useState, useMemo } from "react";
import ViewContent from "@/components/common/ViewContent";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const ActionsCell = ({ row, refreshData, userActions = [] }) => {
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState(null);

const navigate = useNavigate();

  const userInfo = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role = userInfo?.userRole;
  const record = row?.original || {};
  const isActive = record.status === "active";

  const getErrorMessage = (err, fallback = "Something went wrong") =>
    err?.response?.data?.message || err?.message || fallback;

const navigateToEditPage = () => {
  if (!record?.id) {
    toast.error("Invalid record");
    return;
  }

    // Detect record type
    const isProduct =
      record?.productName !== undefined || record?.code !== undefined;
    if (isProduct) {
      navigate(`/product/${record.id}`, { state: record });
    return;
  }

  switch (role) {
    case "super_admin":
      navigate(`/business-owner/${record.id}`, { state: record });
      break;
    case "business_owner":
      navigate(`/buyer/${record.id}`, { state: record });
      break;
    default:
      toast.error(`Unsupported role: ${role}`);
      break;
  }
};

  const runAction = async (key, fn, successMsg, fallbackError) => {
    setLoadingAction(key);
    try {
      await fn();
      if (successMsg) toast.success(successMsg);
      refreshData?.();
    } catch (err) {
      console.error(`${key} failed:`, err);
      toast.error(getErrorMessage(err, fallbackError));
    } finally {
      setLoadingAction(null);
    }
  };

  const actionHandlers = {
    view: async () => {
      setLoadingAction("view");
      try {
        const data = await roleBasedDataService.getById(role, record);
        setDetails(data);
        setIsModalOpen(true);
      } catch (err) {
        console.error("Error fetching details:", err);
        toast.error(getErrorMessage(err, "Failed to fetch details"));
      } finally {
        setLoadingAction(null);
      }
    },

    edit: () => navigateToEditPage(),

    activate: () =>
      runAction(
        "activate",
        () => roleBasedDataService.activate(role, record.id),
        "Activated successfully",
        "Failed to activate record"
      ),

    deactivate: () =>
      runAction(
        "deactivate",
        () => roleBasedDataService.deactivate(role, record.id),
        "Deactivated successfully",
        "Failed to deactivate record"
      ),

    delete: () => {
      if (!window.confirm("Are you sure you want to delete this record?")) return;

      const isProduct =
        record?.productName !== undefined || record?.code !== undefined;

      const payload = isProduct
        ? { id: record.id, type: "product" }
        : record.id;

      runAction(
        "delete",
        () => roleBasedDataService.softDelete(role, payload),
        "Deleted successfully",
        "Failed to delete record"
      );
    },

    update: () => navigateToEditPage(),
  };

  /** ✅ Icon + color mapping */
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
              loadingAction === key ? "opacity-50 cursor-wait" : "cursor-pointer"
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
