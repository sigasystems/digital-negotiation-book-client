import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "@/modules/landing/pages/LandingPage";
import CheckoutPage from "@/modules/checkout/pages/Checkout";

// Optional: ProtectedRoute wrapper
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import SuccessPage from "@/modules/checkout/components/SuccessPage";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {/* <DashboardHome /> */}
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
