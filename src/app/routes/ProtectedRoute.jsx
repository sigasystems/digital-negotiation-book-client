import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/app/hooks/useAuth";

const DEFAULT_ALLOWED_ROLES = ["super_admin", "business_owner"];

export default function ProtectedRoute({
  children,
  allowedRoles = DEFAULT_ALLOWED_ROLES,
}) {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (user?.userRole === "buyer") {
    const isNegotiationRoute = location.pathname.startsWith("/negotiation/");
    if (!isNegotiationRoute) {
      return <Navigate to="/negotiation/unauthorized" replace />;
    }
    return children;
  }

  if (
    Array.isArray(allowedRoles) &&
    allowedRoles.length > 0 &&
    user?.userRole &&
    !allowedRoles.includes(user.userRole)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
