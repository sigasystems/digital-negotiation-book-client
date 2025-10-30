import { useState, useEffect } from "react";
import { Menu, LogOut, X, ChevronDown, User } from "lucide-react";
import LogoutDialog from "../common/LogoutModal";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onMenuClick, showSidebarButton = true }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from sessionStorage:", err);
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    setLogoutOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    setUser(null);
    navigate("/");
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Products", path: "/products" },
    { label: "Buyers", path: "/users" },
    { label: "Reports", path: "/reports" },
    { label: "Settings", path: "/settings" },
  ];

  const userName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.name || "User";

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 max-w-[1920px] mx-auto">
        {/* Left Side - Logo & Sidebar Toggle */}
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
            <span className="hidden sm:inline">Digital Negotiation Book</span>
            <span className="sm:hidden">DNB</span>
          </Link>
        </div>

        {/* Right Side - Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {/* Nav Links */}
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* User / Login Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100hover:bg-gray-200 rounded-lg transition cursor-pointer"
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

              {/* Dropdown Menu */}
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
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 hover:text-indigo-600 transition p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Nav Links */}
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

            {/* User / Login Section */}
            {user ? (
                <div className="border-t border-gray-200 my-3 pt-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {userName}
                    </span>
                  </div>
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
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition text-center"
                >
                  Login
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Logout Modal */}
      <LogoutDialog
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}