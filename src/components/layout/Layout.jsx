import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "./Footer";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Routes where sidebar is hidden
  const noSidebarRoutes = [
    "/",
    "/checkout",
    "/success",
    "/login",
    "/paymentsuccess",
    "/forgot-password",
  ];

  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);
  const contentPadding = sidebarCollapsed ? "lg:pl-16" : "lg:pl-64";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (only for dashboard routes) */}
      {shouldShowSidebar && (
        <div className="hidden lg:block">
          <Sidebar sidebarOpen={true} setSidebarOpen={() => {}}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col flex-1 w-full transition-all duration-300",
          shouldShowSidebar && contentPadding
        )}
      >
        <Navbar />

        {/* Page content */}
        <main className="flex-1 w-full px-4 py-4 pt-20 md:px-6 md:py-20">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
