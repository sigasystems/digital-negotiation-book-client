import { Navigate } from "react-router-dom";

const getUserInfo = () => {
  const userCookie = sessionStorage.getItem("user");
  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie);
  } catch (error) {
    console.error("Invalid cookie format:", error);
    return null;
  }
};

export default function ProtectedRoute({ children }) {
  const userInfo = getUserInfo();

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  const { userRole } = userInfo;

  if (userRole === "super_admin" || userRole === "business_owner") {
    return children;
  }

  return <Navigate to="/" replace />;
}
