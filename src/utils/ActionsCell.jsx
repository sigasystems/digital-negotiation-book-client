// ActionsCell.jsx
import { Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@headlessui/react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  dashboardService
} from "@/modules/dashboard/services/dashboardService";
import ViewContent from "@/components/common/ViewContent";

export const ActionsCell = ({ row, refreshData, userActions = [] }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const navigate = useNavigate();

  const isActive = row.original.status === "active";

  const handleView = async () => {
    setLoading(true);
    try {
      const owner = await dashboardService.getBusinessOwnerById(row.original.id);
      setOwnerDetails(owner.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/user/${row.original.id}`, { state: row.original });
  };

  const handleActivate = async () => {
    setLoading(true);
    try {
      await dashboardService.activateBusinessOwner(row.original.id);
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await dashboardService.deactivateBusinessOwner(row.original.id);
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this owner?")) return;
    setLoading(true);
    try {
      await dashboardService.softDeleteBusinessOwner(row.original.id);
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const allActions = useMemo(
    () => [
      { key: "view", icon: Eye, label: "View", handler: handleView },
      { key: "edit", icon: Edit, label: "Edit", handler: handleEdit },
      { key: "activate", icon: CheckCircle, label: "Activate", handler: handleActivate, show: !isActive },
      { key: "deactivate", icon: XCircle, label: "Deactivate", handler: handleDeactivate, show: isActive },
      { key: "delete", icon: Trash2, label: "Delete", handler: handleDelete, color: "text-red-600 hover:bg-red-50" },
    ],
    [row, isActive]
  );

  const filteredActions = allActions.filter(action => userActions.includes(action.key) && (action.show !== false));

  return (
    <>
      <div className="flex items-center gap-2">
        {filteredActions.map(({ icon: Icon, color, handler, label }) => (
          <Button
            key={label}
            variant="ghost"
            size="icon"
            onClick={handler}
            className={`p-1 ${color || ""} cursor-pointer`}
            disabled={loading}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      <ViewContent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        owner={ownerDetails}
      />
    </>
  );
};
