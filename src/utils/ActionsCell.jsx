import { Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@headlessui/react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ViewContent from "@/components/common/ViewContent";
import { roleBasedDataService } from "@/services/roleBasedDataService";

export const ActionsCell = ({ row, refreshData, userActions = [] }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const role = userInfo?.userRole || "super_admin"; // fallback just in case

  const isActive = row.original.status === "active";

  const handleView = async () => {
    setLoading(true);
    try {
      const data = await roleBasedDataService.getById(role, row.original.id);
      setDetails(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching details:", err);
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
      await roleBasedDataService.activate(role, row.original.id);
      refreshData();
    } catch (err) {
      console.error("Activation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await roleBasedDataService.deactivate(role, row.original.id);
      refreshData();
    } catch (err) {
      console.error("Deactivation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setLoading(true);
    try {
      await roleBasedDataService.softDelete(role, row.original.id);
      refreshData();
    } catch (err) {
      console.error("Delete failed:", err);
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

  const filteredActions = allActions.filter((action) => userActions.includes(action.key) && (action.show !== false));

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
        owner={details}
      />
    </>
  );
};
