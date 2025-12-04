import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to proceed with this action? This change cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "bg-[#16a34a] hover:bg-green-700",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center border border-slate-200 shadow-2xl rounded-2xl p-6 backdrop-blur-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium cursor-pointer"
          >
            {cancelText}
          </Button>

          <Button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className={`px-6 py-2 rounded-xl text-white font-semibold shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer ${confirmButtonColor}`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
