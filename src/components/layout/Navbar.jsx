import { useMemo, useState } from "react";
import { Menu, LogOut, X, ChevronDown, User } from "lucide-react";
import LogoutDialog from "../common/LogoutModal";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/app/hooks/useAuth";
import BuyerNavbar from "./BuyerNavbar";

export default function Navbar({ onMenuClick, showSidebarButton = true }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const userRole = user?.userRole || "guest";
  const isBuyer = userRole === "buyer";

  // Always call hooks
  const navLinks = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { label: "Onboard-process", path: "/onboard-process" },
        { label: "Contact", path: "/contact" },
      ];
    }

    switch (userRole) {
      case "super_admin":
        return [
          { label: "Dashboard", path: "/dashboard" },
          { label: "Business Owners", path: "/users" },
          { label: "Payment List", path: "/payments-list" },
        ];

      case "business_owner":
        return [
          { label: "Dashboard", path: "/dashboard" },
          { label: "Buyers", path: "/users" },
          { label: "Products", path: "/products" },
          { label: "Profile", path: "/profile" },
        ];

      default:
        return [];
    }
  }, [isAuthenticated, userRole]);

  const handleLogout = () => {
    logout();
    setLogoutOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const handleDashboardCTA = () => {
    navigate(isAuthenticated ? "/dashboard" : "/login");
    setMobileMenuOpen(false);
  };

  const userName =
    user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : user?.name || "";

  const businessName = user?.businessName || "";

  // ---- Render phase ----
  if (isBuyer) {
    return <BuyerNavbar />;
  }
  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {showSidebarButton && (
            <button
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          )}

          <Link
            to="/"
            className="text-xl font-semibold text-gray-800 whitespace-nowrap"
          >
            Digital Negotiation Book
          </Link>
        </div>

        {/* CENTER – Desktop links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-600 hover:text-gray-900 font-medium transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT – User Section */}
        <div className="">
          {!isAuthenticated ? (
            <button
              onClick={handleDashboardCTA}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                <User className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">{userName}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-40">
                  {businessName && (
                    <div className="px-4 py-2 text-xs text-gray-500 border-b">
                      {businessName}
                    </div>
                  )}

                  <button
                    onClick={() => setLogoutOpen(true)}
                    className="w-full text-left px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden">
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 text-lg font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6">
              {isAuthenticated ? (
                <button
                  onClick={() => setLogoutOpen(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleDashboardCTA}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Dialog */}
      <LogoutDialog
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}
