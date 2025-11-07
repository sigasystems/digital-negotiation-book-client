import { Button } from "@headlessui/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ViewContent from "@/components/common/ViewContent";
import { Spinner } from "@/components/ui/spinner";
import { roleBasedDataService } from "@/services/roleBasedDataService";
import { productService } from "@/modules/product/services";
import { offerDraftService } from "@/modules/offerDraft/services";
import { ACTION_ICONS } from "@/app/config/actionConfig";
import {
  getRecordDisplayName,
  resolveEntityRoute,
  getEntityType,
} from "@/utils/actionsUtil/recordUtils";

import { runAction, getErrorMessage } from "@/utils/actionsUtil/actionRunner";

export const ActionsCell = ({ row, refreshData, userActions = [] }) => {
  const [loadingAction, setLoadingAction] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState(null);

  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role = userInfo?.userRole;
  const record = row?.original || {};
  const isActive = record.status === "active";

  const onView = () => {
    const route = resolveEntityRoute(role, record);
    if (route) {
      navigate(route);
      return;
    }
    toast.error("Unable to determine view route");
  };

  const onEdit = () => {
    const route = resolveEntityRoute(role, record);
    if (route) {
      navigate(route, { state: record });
      return;
    }
    toast.error("Unable to determine edit route");
  };

  const actionHandlers = {
    view: onView,
    edit: onEdit,

    activate: () => {
      const name = getRecordDisplayName(record);
      setPendingAction({
        key: "activate",
        title: "Activate Record",
        description: `Are you sure you want to activate ${name}?`,
        fn: () =>
          runAction({
            key: "activate",
            fn: () => roleBasedDataService.activate(role, record.id),
            setLoading: setLoadingAction,
            refresh: refreshData,
            getErrorMessage,
          }),
      });
    },

    deactivate: () => {
      const name = getRecordDisplayName(record);
      setPendingAction({
        key: "deactivate",
        title: "Deactivate Record",
        description: `Are you sure you want to deactivate ${name}?`,
        fn: () =>
          runAction({
            key: "deactivate",
            fn: () => roleBasedDataService.deactivate(role, record.id),
            setLoading: setLoadingAction,
            refresh: refreshData,
            getErrorMessage,
          }),
      });
    },

    delete: () => {
      const name = getRecordDisplayName(record);
      const type = getEntityType(record);

      setPendingAction({
        key: "delete",
        title: "Delete Record",
        description: `Delete ${name}? This cannot be undone.`,
        fn: () =>
          runAction({
            key: "delete",
            fn: async () => {
              if (type === "offer_draft") {
                return offerDraftService.deleteDraft(record.draftNo || record.id);
              }
              if (type === "product") {
                return productService.deleteProduct(record.id);
              }
              return roleBasedDataService.softDelete(role, record.id);
            },
            setLoading: setLoadingAction,
            refresh: refreshData,
            getErrorMessage,
          }),
      });
    },
  };

  const filteredActions = useMemo(() => {
    return userActions
      .map((key) => {
        if (!ACTION_ICONS[key] || !actionHandlers[key]) return null;
        if (key === "activate" && isActive) return null;
        if (key === "deactivate" && !isActive) return null;

        return {
          key,
          handler: actionHandlers[key],
          icon: ACTION_ICONS[key].icon,
          color: ACTION_ICONS[key].color,
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
            className={`p-1 rounded-md ${color} ${
              loadingAction === key ? "opacity-70 cursor-wait" : "cursor-pointer"
            }`}
          >
            {loadingAction === key ? <Spinner className="size-4" /> : <Icon className="w-4 h-4" />}
          </Button>
        ))}
      </div>

      {pendingAction && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setPendingAction(null)}
          onConfirm={pendingAction.fn}
          title={pendingAction.title}
          description={pendingAction.description}
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
