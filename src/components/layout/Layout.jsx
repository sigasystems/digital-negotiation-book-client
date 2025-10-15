import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "./Footer";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (only for dashboard routes) */}
      {shouldShowSidebar && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col flex-1 w-full transition-all duration-300",
          "pt-16 lg:pt-0", // top padding for mobile header
          shouldShowSidebar && sidebarOpen ? "lg:pl-64" : "pl-16"
        )}
      >
        <Navbar />

        {/* Page content */}
        <main className="flex-1 w-full px-4 py-4 md:px-6 md:py-26">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
