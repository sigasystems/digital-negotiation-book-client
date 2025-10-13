import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const isAuthenticated = () => {
  const userCookie = Cookies.get("userInfo");
  return !!userCookie;
};

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
