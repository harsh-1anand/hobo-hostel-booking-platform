import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // If no login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user role doesn't match
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "owner") return <Navigate to="/owner" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default ProtectedRoute;