import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";

// 🔹 Core layout and route protection
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import useAuth from "@/app/hooks/useAuth";

// 🔹 Pages
import Login from "@/modules/auth/pages/Login";
import ResetPassword from "@/modules/passwordReset/pages/ResetPassword";
import LandingPage from "@/modules/landing/pages/LandingPage";
import CheckoutPage from "@/modules/checkout/pages/Checkout";
import Users from "@/modules/dashboard/pages/Users";
import ResponsiveDashboard from "@/modules/dashboard/components/DashboardContent";
// import PaymentSuccess from "@/modules/checkout/components/PaymentSuccess";
import AddBuyerForm from "@/modules/businessOwner/pages/AddBuyer";
import AddBusinessOwner from "@/modules/superAdmin/AddBusinessOwner";
import AddProduct from "@/modules/product/pages/AddProduct";
import Products from "@/modules/product/pages/Products";
import BusinessOwnerPage from "@/modules/dashboard/pages/BusinessOwnerPage";
import BuyerPage from "@/modules/dashboard/pages/BuyerPage";
import PlanPurchase from "@/modules/businessOwner/pages/PlanPurchase";
import ViewProduct from "@/modules/product/pages/ViewProduct";
import CreateOfferDraft from "@/modules/offerDraft/pages/CreateOfferDraft";
import PaymentList from "@/modules/dashboard/pages/PaymentList";
import OfferDrafts from "@/modules/offerDraft/pages/OfferDrafts";
import ViewOfferDraft from "@/modules/offerDraft/pages/ViewOfferDraft";
import NotFound from "@/modules/landing/pages/NotFound";
import PaymentSuccess from "@/modules/checkout/components/PaymentSuccess";
import CreateOffer from "@/modules/offers/pages/CreateOffer";
import Offers from "@/modules/offers/pages/Offers";
import OfferPage from "@/modules/offers/pages/OfferPage";
import UpgradePlanPage from "@/modules/dashboard/components/upgradePlanPage";
import Negotiation from "@/modules/auth/pages/Negotiation";
import ProcessInstructions from "@/modules/landing/components/ProcessInstructions";
import Contact from "@/modules/landing/components/Contact";
import AddLocation from "@/modules/location/pages/AddLocation";
import Locations from "@/modules/location/pages/Locations";
import LocationPage from "@/modules/location/pages/LocationPage";
import UnauthorizedNegotiation from "@/modules/landing/pages/UnauthorizedNegotiation";
import Profile from "@/modules/dashboard/components/Profile";
import OfferNegotiation from "@/modules/buyer/pages/OfferNegotiation";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const publicPaths = new Set([
      "/",
      "/login",
      "/forgot-password",
      "/contact",
      "/checkout",
      "/onboard-process",
      "/subscription/success",
    ]);

    if (!isAuthenticated && !publicPaths.has(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthenticated, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-700 text-lg">
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/onboard-process" element={<ProcessInstructions />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/negotiation/unauthorized" element={<UnauthorizedNegotiation />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/latest-negotiation/:id" element={<OfferNegotiation />}/>
        <Route path="*" element={<NotFound />} />

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
          path="/upgrade-plan"
          element={
            <ProtectedRoute>
              <UpgradePlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
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
        <Route
          path="/payments-list"
          element={
            <ProtectedRoute>
              <PaymentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ViewProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-offer-draft"
          element={
            <ProtectedRoute>
              <CreateOfferDraft />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offer-draft"
          element={
            <ProtectedRoute>
              <OfferDrafts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offer-draft/:id"
          element={
            <ProtectedRoute>
              <ViewOfferDraft />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offer/:id"
          element={
            <ProtectedRoute>
              <CreateOffer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/negotiation/:id"
          element={
            <ProtectedRoute user={user}>
              <Negotiation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offers"
          element={
            <ProtectedRoute>
              <Offers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-offer/:id"
          element={
            <ProtectedRoute>
              <OfferPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/location/:id"
          element={
            <ProtectedRoute user={user}>
              <LocationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/location"
          element={
            <ProtectedRoute user={user}>
              <Locations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-location"
          element={
            <ProtectedRoute user={user}>
              <AddLocation />
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
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
          style: { marginTop: "60px" },
        }}/>
    </>
  );
}

