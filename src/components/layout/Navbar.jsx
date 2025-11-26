import { useMemo, useState } from "react";
import { Menu, LogOut, X, ChevronDown, User } from "lucide-react";
import LogoutDialog from "../common/LogoutModal";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/app/hooks/useAuth";

export default function Navbar({ onMenuClick, showSidebarButton = true }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const userRole = user?.userRole || "guest";

  const handleLogout = () => {
    logout();
    setLogoutOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const navLinks = useMemo(() => {
    if (!isAuthenticated && userRole !== "buyer") {
      return [
        { label: "Onboard-process", path: "/onboard-process" },
         { label: "Contact", path: "/contact" },
      ];
    }

    if (userRole === "super_admin") {
      return [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Business Owners", path: "/users" },
        { label: "Payment List", path: "/payments-list" },
      ];
    }

    if (userRole === "business_owner") {
      return [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Buyers", path: "/users" },
        { label: "Products", path: "/products" },
        { label: "Profile", path: "/profile" },
      ];
    }

    return [];
  }, [isAuthenticated, userRole]);

  const handleDashboardCTA = () => {
    if (isAuthenticated) navigate("/dashboard");
    else navigate("/login");
    setMobileMenuOpen(false);
  };

  const userName =
    user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : user?.name || "";

  const businessName = user?.businessName || "";

  if (userRole === "buyer") {
    return (
      <header className="fixed top-0 left-0 w-full z-30 bg-white shadow-sm border-b border-gray-200">
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
          onLogout={() => {
            logout();
            navigate("/login");
          }}
        />
      </header>
    );
  }
  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-3 sm:gap-4">
          {showSidebarButton && (
            <button
              className="lg:hidden text-gray-700 hover:text-indigo-600 transition p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={onMenuClick}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
          )}

          <Link
            to="/"
            className="text-base sm:text-lg md:text-xl font-semibold text-indigo-600 tracking-tight hover:text-indigo-700 transition whitespace-nowrap"
          >
            <span className="hidden sm:inline sm:ml-[15rem]">Digital Negotiation Book</span>
            <span className="sm:hidden">
              DNB <span className="text-black">{businessName ? `| ${businessName}` : ""}</span>
            </span>
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            userName ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
              >
                <User className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {userName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-700 transition-transform ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setLogoutOpen(true);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
            ) : (
              <button
                onClick={() => setLogoutOpen(true)}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )
          ) : (
            userRole !== "buyer" && (
            <button
              onClick={handleDashboardCTA}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition cursor-pointer"
            >
              Login
            </button>
            )
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden text-gray-700 hover:text-indigo-600 transition p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
                <div className="border-t border-gray-200 my-3 pt-3">
                {userName && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg mb-2">
                    <User className="w-4 h-4 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {userName}
                    </span>
                  </div>
                )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLogoutOpen(true);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
            ) : (
              <div className="border-t border-gray-200 my-3 pt-3">
                <button
                  onClick={handleDashboardCTA}
                  className="block w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition text-center cursor-pointer"
                >
                 Login
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* LOGOUT MODAL */}
      <LogoutDialog
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}