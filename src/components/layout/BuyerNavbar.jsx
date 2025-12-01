import { useState } from "react";
import { LogOut } from "lucide-react";
import LogoutDialog from "../common/LogoutModal";
import { useNavigate } from "react-router-dom";
import useAuth from "@/app/hooks/useAuth";

export default function BuyerNavbar() {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setLogoutOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-350 z-30">
      <div className="flex items-center justify-end px-4 h-16">
        <button
          onClick={() => setLogoutOpen(true)}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <LogoutDialog
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}
