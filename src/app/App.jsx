import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// 🔹 Core layout and route protection
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/app/routes/ProtectedRoute";

// 🔹 Pages
import Login from "@/modules/auth/pages/Login";
import ResetPassword from "@/modules/passwordReset/pages/ResetPassword";
import LandingPage from "@/modules/landing/pages/LandingPage";
import CheckoutPage from "@/modules/checkout/pages/Checkout";
import Users from "@/modules/dashboard/pages/Users";
import ResponsiveDashboard from "@/modules/dashboard/components/DashboardContent";
import SuccessPage from "@/modules/checkout/components/PaymentSuccess";
import PaymentSuccess from "@/modules/checkout/components/PaymentSuccess";
import AddBuyerForm from "@/modules/businessOwner/pages/AddBuyer";
import AddBusinessOwner from "@/modules/superAdmin/AddBusinessOwner";

// 🔹 Role-specific pages
import BusinessOwnerPage from "@/modules/dashboard/pages/BusinessOwnerPage";
import BuyerPage from "@/modules/dashboard/pages/BuyerPage";
import PlanPurchase from "@/modules/businessOwner/pages/PlanPurchase";

function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const initUser = async () => {
  //     try {
  //       let sessionUser = sessionStorage.getItem("user");
  //       sessionUser = sessionUser ? JSON.parse(sessionUser) : null;

  //       if (!sessionUser) {
  //         // No session user → redirect to login
  //         navigate("/login", { replace: true });
  //         return;
  //       }

  //       dispatch({ type: "auth/loginUser/fulfilled", payload: sessionUser });
  //       setUser(sessionUser);
  //     } catch (err) {
  //       console.error("Error loading user:", err);
  //       navigate("/login", { replace: true });
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   initUser();
  // }, [dispatch, navigate]);

  // if (loading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center text-gray-600 text-lg">
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
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
              <Users userRole={user?.userRole} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-owner/:id"
          element={
            <ProtectedRoute>
              <BusinessOwnerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/:id"
          element={
            <ProtectedRoute>
              <BuyerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-buyer"
          element={
            <ProtectedRoute>
              <AddBuyerForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/plan-purchase"
          element={
            <ProtectedRoute>
              <PlanPurchase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-business-owner"
          element={
            <ProtectedRoute>
              <AddBusinessOwner />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <>
      <Router>
        <AppContent />
      </Router>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
