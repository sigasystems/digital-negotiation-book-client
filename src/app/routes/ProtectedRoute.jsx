import { Navigate } from "react-router-dom";

// Dummy auth check, replace with real context/store
const isAuthenticated = () => {
  return localStorage.getItem("token") ? true : false;
};

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
