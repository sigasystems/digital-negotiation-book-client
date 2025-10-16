import React from "react";
import DashboardContent from "../components/DashboardContent";

const DashboardHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main
        className="flex-1 p-4 md:p-6 pt-20 md:pt-20 md:pl-80 transition-all duration-300">
        <DashboardContent />
      </main>
    </div>
  );
};

export default DashboardHome;
