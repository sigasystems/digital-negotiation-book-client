import { useMemo, useState, useEffect, useRef } from "react";
import { Menu, LogOut, X, ChevronDown, User } from "lucide-react";
import LogoutDialog from "../common/LogoutModal";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/app/hooks/useAuth";
import BuyerNavbar from "./BuyerNavbar";
import { cn } from "@/lib/utils";

export default function Navbar({ onMenuClick, showSidebarButton = true, isNoSidebarRoute = false }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const userRole = user?.userRole || "guest";
  const isBuyer = userRole === "buyer";

  const userDropdownRef = useRef(null);
  const userNameRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(null);

  const navLinks = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { label: "Onboard Process", path: "/onboard-process" },
        { label: "Contact", path: "/contact" },
      ];
    }

        return [];
    }, [isAuthenticated]);

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

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
    }

    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen]);

  useEffect(() => {
    if (userNameRef.current) {
      const width = userNameRef.current.getBoundingClientRect().width;
      setDropdownWidth(width);
    }
  }, [userDropdownOpen]);

  if (isBuyer) {
    return <BuyerNavbar />;
  }
  return (
    <header className={cn(
  "w-full h-16 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50",
  isNoSidebarRoute ? "px-4 sm:px-6 lg:px-78" : "px-4 sm:px-6 lg:px-10"
)}>
  <div className="w-full h-full mx-auto flex items-center justify-between">
    {/* LEFT: Logo and menu button */}
    <div className="flex items-center">
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
        className={cn(
          "text-xl font-semibold text-gray-800 whitespace-nowrap",
          isNoSidebarRoute ? "ml-0" : "ml-2 lg:ml-0"
        )}
      >
        Digital Negotiation Book
      </Link>
    </div>

    {/* RIGHT: Navigation links and User Section */}
    <div className="flex items-center gap-6">
      {/* Desktop Navigation Links - Now on the right side */}
      <nav className="hidden lg:flex items-center gap-6 mr-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="text-gray-600 hover:text-gray-900 font-medium transition whitespace-nowrap"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <button
            onClick={handleDashboardCTA}
            className="button-styling"
          >
            Login
          </button>
        ) : (
          <div className="relative" ref={userDropdownRef}>
            <button
              ref={userNameRef}
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
              <div 
                className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-60 py-3"
                style={{ width: dropdownWidth || "auto" }}
              >
                <div className="flex flex-col items-center px-2">
                  <Link
                    to="/profile"
                    className="w-full flex justify-center items-center gap-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 cursor-pointer rounded-lg"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>

                  <div className="w-11/12 border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => setLogoutOpen(true)}
                    className="w-full flex justify-center items-center gap-3 px-4 text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
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
