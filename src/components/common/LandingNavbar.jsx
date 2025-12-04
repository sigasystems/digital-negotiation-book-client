import { useMemo, useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/app/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function LandingNavbar({
  onMenuClick,
  showSidebarButton = false,
  isNoSidebarRoute = true,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const navLinks = useMemo(
    () => [
      { label: "Onboard Process", path: "/onboard-process" },
      { label: "Contact", path: "/contact" },
    ],
    []
  );

  const handleLogin = () => navigate("/login");

  return (
    <header
      className={cn(
        "w-full h-16 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100",
        isNoSidebarRoute ? "px-4 sm:px-6 lg:px-78" : "px-4 sm:px-6 lg:px-13"
      )}
    >
      <div className="w-full h-full mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {showSidebarButton && (
            <button
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              onClick={onMenuClick}
              aria-label="Open menu"
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

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogin}
            className="button-styling"
          >
            Login
          </button>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-[9000] lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-xl p-4 z-[9100]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close menu"
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
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogin();
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
