import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

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
import AddProduct from "@/modules/product/pages/AddProduct";
import Products from "@/modules/product/pages/Products";
import BusinessOwnerPage from "@/modules/dashboard/pages/BusinessOwnerPage";
import BuyerPage from "@/modules/dashboard/pages/BuyerPage";
import PlanPurchase from "@/modules/businessOwner/pages/PlanPurchase";
import Product from "@/modules/dashboard/pages/Product";

function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const sessionUser = sessionStorage.getItem("user");
  const currentPath = window.location.pathname;

  const publicPaths = [
    "/",
    "/login",
    "/forgot-password",
    "/checkout",
    "/success",
    "/paymentsuccess",
  ];

  if (!sessionUser) {
    // Only redirect if not already on a public route
    if (!publicPaths.includes(currentPath)) {
      navigate("/login", { replace: true });
    }
    setLoading(false);
    return;
  }

  try {
    const parsedUser = JSON.parse(sessionUser);
    setUser(parsedUser);
  } catch (err) {
    console.error("Failed to parse user session:", err);
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  } finally {
    setLoading(false);
  }
}, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

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
            <ProtectedRoute user={user}>
              <ResponsiveDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute user={user}>
              <Users userRole={user?.userRole} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-owner/:id"
          element={
            <ProtectedRoute user={user}>
              <BusinessOwnerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/:id"
          element={
            <ProtectedRoute user={user}>
              <BuyerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-buyer"
          element={
            <ProtectedRoute user={user}>
              <AddBuyerForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plan-purchase"
          element={
            <ProtectedRoute user={user}>
              <PlanPurchase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-business-owner"
          element={
            <ProtectedRoute user={user}>
              <AddBusinessOwner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute user={user}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute user={user}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute user={user}>
              <Product />
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
