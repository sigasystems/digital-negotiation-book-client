import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Optional: ProtectedRoute wrapper
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import LandingPage from "@/modules/landing/pages/LandingPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} /> */}

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
  );
}
