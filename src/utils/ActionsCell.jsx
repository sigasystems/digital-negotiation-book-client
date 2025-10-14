import { Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@headlessui/react";
import { useState, useMemo } from "react";
import {
  getBusinessOwnerById,
  updateBusinessOwner,
  activateBusinessOwner,
  deactivateBusinessOwner,
  softDeleteBusinessOwner,
} from "@/modules/dashboard/services/dashboardService";
import ViewContent from "@/components/common/ViewContent";

export const ActionsCell = ({ row, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const isActive = row.original.status === "active";

  const handleView = async () => {
    setLoading(true);
    try {
      const owner = await getBusinessOwnerById(row.original.id);
      setOwnerDetails(owner.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const payload = { ...row.original, name: row.original.name + " Updated" };
      await updateBusinessOwner(row.original.id, payload);
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    setLoading(true);
    try {
      await activateBusinessOwner(row.original.id);
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
      await deactivateBusinessOwner(row.original.id);
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this owner?")) return;
    setLoading(true);
    try {
      await softDeleteBusinessOwner(row.original.id);
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const actions = useMemo(() => [
    { icon: Eye, color: "", label: "View", handler: handleView },
    { icon: Edit, color: "", label: "Edit", handler: handleEdit },
    isActive
      ? { icon: XCircle, color: "text-yellow-600 hover:bg-yellow-50", label: "Deactivate", handler: handleDeactivate }
      : { icon: CheckCircle, color: "text-green-600 hover:bg-green-50", label: "Activate", handler: handleActivate },
    { icon: Trash2, color: "text-red-600 hover:bg-red-50", label: "Delete", handler: handleDelete },
  ], [row, isActive]);

  return (
    <>
      <div className="flex items-center gap-2">
        {actions.map(({ icon: Icon, color, handler, label }) => (
          <Button
            key={label}
            variant="ghost"
            size="icon"
            onClick={handler}
            className={`p-1 ${color} cursor-pointer`}
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
