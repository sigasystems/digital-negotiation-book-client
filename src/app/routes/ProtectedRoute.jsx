import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  const userCookie = sessionStorage.getItem("user");
  if (!userCookie) return false;

  try {
    const userInfo = JSON.parse(userCookie);
    return (
      userInfo.userRole === "super_admin" ||
      userInfo.userRole === "business_owner"
    );
  } catch (error) {
    console.error("Invalid cookie format:", error);
    return false;
  }
};

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
