import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from '@/modules/auth/pages/Login';
import ResetPassword from "@/modules/passwordReset/pages/ResetPassword";
// Pages
import LandingPage from "@/modules/landing/pages/LandingPage";
import CheckoutPage from "@/modules/checkout/pages/Checkout";

// Optional: ProtectedRoute wrapper
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import SuccessPage from "@/modules/checkout/components/PaymentSuccess";
import PaymentSuccess from "@/modules/checkout/components/PaymentSuccess";

export default function App() {
  return (
    <>
    {/* <Toaster position="top-right" reverseOrder={false} /> */}

    <Router>
<Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
           <Route path="/login" element={<Login />} />
           <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/forgot-password" element={<ResetPassword />} />

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
    <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}
