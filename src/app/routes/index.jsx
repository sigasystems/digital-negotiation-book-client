import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "@/modules/landing/pages/LandingPage";
import DashboardHome from "@/modules/dashboard/pages/DashboardHome";
import Login from "@/modules/auth/pages/Login";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardHome />} />
      </Routes>
    </Router>
  );
}
