import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function LogoutDialog({ isOpen, onClose, onLogout }) {

  const handleLogout = () => {
  const remove = sessionStorage.removeItem("user");
  const removeToken = sessionStorage.removeItem("authToken");
  toast.success("Logged out successfully!");
  onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to logout? You’ll need to log in again to continue using the app.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
