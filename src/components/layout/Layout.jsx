import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "./Footer";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Routes where sidebar is hidden
  const noSidebarRoutes = [
    "/",
    "/checkout",
    "/success",
    "/login",
    "/contact",
    "/paymentsuccess",
    "/onboard-process",
    "/forgot-password",
  ];

  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);
  const contentPadding = sidebarCollapsed ? "lg:pl-16" : "lg:pl-64";

  // ✅ Apply padding only for internal pages (not login/landing)
  const shouldHavePadding =
    shouldShowSidebar && !["/", "/login"].includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {shouldShowSidebar && (
        <div className="hidden lg:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      {shouldShowSidebar && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden",
            mobileSidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className={cn(
              "absolute top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300",
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              collapsed={false}
              setCollapsed={() => {}}
              onClose={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-col flex-1 w-full transition-all duration-300",
          shouldShowSidebar && contentPadding
        )}
      >
        <Navbar
          onMenuClick={() => setMobileSidebarOpen(true)}
          showSidebarButton={shouldShowSidebar}
        />

        <main
          className={cn(
            "flex-1",
            shouldHavePadding && "px-4 pt-20 pb-6 lg:pt-20 lg:pl-4 lg:pb-10"
          )}
        >
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
