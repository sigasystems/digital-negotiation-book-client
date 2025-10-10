import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from '@/modules/auth/pages/Login';
import ResetPassword from "@/modules/passwordReset/pages/ResetPassword";

// Optional: ProtectedRoute wrapper
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import LandingPage from "@/modules/landing/pages/LandingPage";

export default function App() {
  return (
    <>
     <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        {/* <Route path="/register" element={<Register />} />  */}

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {/* <DashboardHome /> */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}
