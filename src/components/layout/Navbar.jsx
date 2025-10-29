import { useState } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import LogoutDialog from "../common/LogoutModal";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/app/store/slices/authSlice";

export default function Navbar({ onMenuClick, showSidebarButton = true }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    setLogoutOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          {showSidebarButton && (
            <button
              className="lg:hidden text-gray-700 hover:text-indigo-600 transition"
              onClick={onMenuClick}
            >
              <Menu size={24} />
            </button>
          )}

          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-semibold text-indigo-600 tracking-tight hover:text-indigo-700 transition"
          >
            Digital Negotiation Book
          </Link>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-6">
          {!user ? (
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
              >
                <User className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700 font-medium">
                  {user?.name || "User"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 z-50">
                  <button
                    onClick={() => {
                      setLogoutOpen(true);
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutDialog
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}
