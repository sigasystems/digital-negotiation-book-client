import { useState } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import LogoutDialog from "../common/LogoutModal";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Fetch user from session storage
  const sessionUserData = sessionStorage.getItem("user");
  const sessionUser = sessionUserData ? JSON.parse(sessionUserData) : null;

  const links = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setLogoutOpen(false);
    window.location.href = "/login";
  };

  return (
    <header className="fixed w-full z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold text-indigo-600 tracking-tight hover:text-indigo-700 transition"
        >
          Digital Negotiation Book
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              {link.name}
            </a>
          ))}

          {/* User Section */}
          {sessionUser ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
              >
                <User className="w-4 h-4" />
                <span>{sessionUser.email?.split("@")[0]}</span>
                <ChevronDown className="w-4 h-4" />
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
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Button */}
        <button
          className="md:hidden text-gray-700 hover:text-indigo-600 transition"
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
                className="text-gray-700 hover:text-indigo-600 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </a>
            ))}

            {sessionUser ? (
              <button
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                onClick={() => {
                  setMobileOpen(false);
                  setLogoutOpen(true);
                }}
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
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
