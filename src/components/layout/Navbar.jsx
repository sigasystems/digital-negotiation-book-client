import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import LogoutDialog from "../common/LogoutModal";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const links = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  // Check user login from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    // Clear session storage & update state
    sessionStorage.removeItem("user");
    setUser(null);
    setLogoutOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold text-indigo-600 tracking-tight hover:text-indigo-700 transition cursor-pointer"
        >
          Digital Negotiation Book
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-indigo-600 font-medium transition cursor-pointer"
            >
              {link.name}
            </a>
          ))}

          {!user ? (
            <Link
              to="/login"
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition px-4 py-2 rounded-lg font-medium"
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
                <span className="text-gray-700 font-medium">{user.email.split("@")[0]}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setLogoutOpen(true);
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700 hover:text-indigo-600 transition cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md animate-slideDown">
          <nav className="flex flex-col px-6 py-4 space-y-3">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-indigo-600 font-medium cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </a>
            ))}

            {!user ? (
              <Link
                to="/login"
                className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 transition p-2 rounded-lg text-center font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer"
                onClick={() => {
                  setMobileOpen(false);
                  setLogoutOpen(true);
                }}
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            )}
          </nav>
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
