import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from '@/modules/auth/pages/Login';
import ResetPassword from "@/modules/passwordReset/pages/ResetPassword";
// Pages
import LandingPage from "@/modules/landing/pages/LandingPage";
import CheckoutPage from "@/modules/checkout/pages/Checkout";
import Users from "@/modules/dashboard/pages/Users";
import ResponsiveDashboard from "@/modules/dashboard/components/DashboardContent";
import UserPage from "@/modules/dashboard/pages/UserPage";

// Optional: ProtectedRoute wrapper
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import SuccessPage from "@/modules/checkout/components/PaymentSuccess";
import PaymentSuccess from "@/modules/checkout/components/PaymentSuccess";
import { useDispatch } from "react-redux";
import { getUserFromCookie } from "@/utils/auth";
import { useEffect } from "react";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = getUserFromCookie();
    if (user) {
      dispatch({ type: "auth/loginUser/fulfilled", payload: user });
    }
  }, [dispatch]);

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
                <ResponsiveDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:id"
            element={
              <ProtectedRoute>
                <UserPage />
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
