import { Eye, Edit, Trash2, CheckCircle, XCircle, Save } from "lucide-react";
import { Button } from "@headlessui/react";
import { useState, useMemo } from "react";
import ViewContent from "@/components/common/ViewContent";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import { productService } from "@/modules/product/services";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { offerDraftService } from "@/modules/offerDraft/services";
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

  const actionLoadingMessages = {
    activate: "Activating...",
    deactivate: "Deactivating...",
    delete: "Deleting...",
    update: "Updating...",
    edit: "Opening editor...",
    view: "Loading...",
  };

  const runAction = async (key, fn, successMsg, fallbackError) => {
    setLoadingAction(key);
    const toastId = toast.loading(actionLoadingMessages[key] || "Processing...");
    try {
      await new Promise((res) => setTimeout(res, 2000));

      await fn();
      toast.success(successMsg || "Action completed", { id: toastId });
      refreshData?.();
    } catch (err) {
      console.error(`${key} failed:`, err);
      toast.error(getErrorMessage(err, fallbackError), { id: toastId });
    } finally {
      setLoadingAction(null);
      setPendingAction(null);
    }
  };

  const navigateToEditPage = () => {
    if (!record?.id && !record?.draftNo) {
      toast.error("Invalid record");
      return;
    }

    const entityType =
      record?.type ||
      (record.draftNo ? "offer_draft" : null) ||
      (record.productName ? "product" : null) ||
      (record.businessName ? "business_owner" : null) ||
      (record.buyersCompanyName ? "buyer" : null);

    switch (entityType) {
      case "offer_draft":
        navigate(`/offer-draft/${record.draftNo}`, { state: record });
        break;
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
      if (record.draftNo || record.type === "offer_draft") {
        navigate(`/offer-draft/${record.draftNo || record.id}`, { state: record });
        return;
      }

      if (record.productName || record.type === "product") {
        navigate(`/product/${record.id}`, { state: record });
        return;
      }

      setLoadingAction("view");
      const toastId = toast.loading("Fetching details...");
      try {
        const data = await roleBasedDataService.getById(role, record);
        setDetails(data);
        setIsModalOpen(true);
        toast.success("Loaded successfully", { id: toastId });
      } catch (err) {
        console.error("Error fetching details:", err);
        toast.error(getErrorMessage(err, "Failed to fetch details"), { id: toastId });
      } finally {
        setLoadingAction(null);
      }
    },

    edit: () => {
      setLoadingAction("edit");
      toast.loading("Opening edit page...", { duration: 1500 });
      navigateToEditPage();
      setTimeout(() => setLoadingAction(null), 300);
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
      const isProduct = record.productName || record.type === "product";
      const isOfferDraft = record.draftNo || record.type === "offer_draft";

      let name;
      if (isOfferDraft) {
        const draftName = record.draftName ? record.draftName.trim() : "";
        name = `Offer Draft ${draftName} (${record.draftNo || record.id})`;
      } else if (isProduct) {
        name = record.productName || "Product";
      } else {
        name = getRecordDisplayName(record);
      }

      setPendingAction({
        key: "delete",
        title: "Delete Record",
        description: `Are you sure you want to delete ${name}? This action cannot be undone.`,
        fn: () =>
          runAction(
            "delete",
            async () => {
              if (isOfferDraft) {
                await offerDraftService.deleteDraft(record.draftNo || record.id);
              } else if (isProduct) {
                await productService.deleteProduct(record.id);
              } else {
                await roleBasedDataService.softDelete(role, record.id);
              }
            },
            `${name} deleted successfully`,
            `Failed to delete ${name}`
          ),
      });
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
