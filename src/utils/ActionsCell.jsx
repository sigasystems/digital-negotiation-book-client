import { Eye, Edit, Trash2, CheckCircle, XCircle, Save } from "lucide-react";
import { Button } from "@headlessui/react";
import { useState, useMemo } from "react";
import ViewContent from "@/components/common/ViewContent";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import { productService } from "@/modules/product/services";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Spinner } from "@/components/ui/spinner";

export const ActionsCell = ({ row, refreshData, userActions = [] }) => {
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [details, setDetails] = useState(null);

const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role = userInfo?.userRole

  const record = row?.original || {};
  const isActive = record.status === "active";

  const getErrorMessage = (err, fallback = "Something went wrong") =>
    err?.response?.data?.message || err?.message || fallback;

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
      setPendingAction(null);
    }
  };

  const navigateToEditPage = () => {
    if (!record?.id) {
      toast.error("Invalid record");
      return;
    }

    const entityType =
      record?.type ||
      (record.productName ? "product" : null) ||
      (record.businessName ? "business_owner" : null) ||
      (record.buyersCompanyName ? "buyer" : null);

    switch (entityType) {
      case "product":
        navigate(`/product/${record.id}`, { state: record });
        break;
      case "business_owner":
        navigate(`/business-owner/${record.id}`, { state: record });
        break;
      case "buyer":
        navigate(`/buyer/${record.id}`, { state: record });
        break;
      default:
        toast.error(`Unsupported entity type: ${entityType || "unknown"}`);
        break;
    }
  };

  const getRecordDisplayName = (record) =>
    record.businessName ||
    record.buyersCompanyName ||
    `${record.first_name || ""} ${record.last_name || ""}`.trim() ||
    record.productName ||
    record.name ||
    "this record";

  const actionHandlers = {
    view: async () => {
      if (record.productName || record.type === "product") {
        navigate(`/product/${record.id}`, { state: record });
        return;
      }

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

    edit: () => {
      setLoadingAction("edit");
      navigateToEditPage();
      setTimeout(() => setLoadingAction(null), 300); // small UX delay
    },

    activate: () => {
      const name = getRecordDisplayName(record);
      setPendingAction({
        key: "activate",
        title: "Activate Record",
        description: `Are you sure you want to activate ${name}?`,
        fn: () =>
          runAction(
            "activate",
            () => roleBasedDataService.activate(role, record.id),
            `${name} activated successfully`,
            `Failed to activate ${name}`
          ),
      });
    },

    deactivate: () => {
      const name = getRecordDisplayName(record);
      setPendingAction({
        key: "deactivate",
        title: "Deactivate Record",
        description: `Are you sure you want to deactivate ${name}?`,
        fn: () =>
          runAction(
            "deactivate",
            () => roleBasedDataService.deactivate(role, record.id),
            `${name} deactivated successfully`,
            `Failed to deactivate ${name}`
          ),
      });
    },

    delete: () => {
      const name = getRecordDisplayName(record);
      const isProduct = record.productName || record.type === "product";

      setPendingAction({
        key: "delete",
        title: "Delete Record",
        description: `Are you sure you want to delete ${name}? This action cannot be undone.`,
        fn: () =>
          runAction(
            "delete",
            async () => {
              if (isProduct) {
                await productService.deleteProduct(record.id); // ✅ direct API
              } else {
                await roleBasedDataService.softDelete(role, record.id);
              }
            },
            `${name} deleted successfully`,
            `Failed to delete ${name}`
          ),
      });
    },

    update: () => {
      setLoadingAction("update");
      navigateToEditPage();
      setTimeout(() => setLoadingAction(null), 300);
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
              loadingAction === key ? "opacity-70 cursor-wait" : "cursor-pointer"
            }`}
          >
            {loadingAction === key ? (
              <Spinner className="size-4" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
          </Button>
        ))}
      </div>

      {pendingAction && (
        <ConfirmationModal
          isOpen={!!pendingAction}
          onClose={() => setPendingAction(null)}
          onConfirm={pendingAction.fn}
          title={pendingAction.title}
          description={pendingAction.description}
          confirmText="Yes"
          cancelText="No"
          confirmButtonColor={
            pendingAction.key === "delete"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }
        />
      )}

      <ViewContent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        owner={details}
      />
    </>
  );
};
