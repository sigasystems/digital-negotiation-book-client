import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import DashboardContent from "../components/DashboardContent";

const DashboardHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    // <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <main
        className={`flex-1 w-full min-w-0 transition-all duration-300 
          p-3 sm:p-4 md:p-6 pt-16 sm:pt-18 md:pt-20
          ${sidebarOpen ? "lg:pl-94 xl:pl-12 2xl:pl-70" : "p-2"}
        `}
      >
        <DashboardContent />
      </main>
    // </div>
  );
};

export default DashboardHome;
