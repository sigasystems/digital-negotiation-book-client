import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "@/modules/landing/pages/LandingPage";
import DashboardHome from "@/modules/dashboard/pages/DashboardHome";
import Login from "@/modules/auth/pages/Login";
import CheckoutPage from "@/modules/checkout/pages/Checkout";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardHome />} />
         <Route path="/checkout/:id" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}
