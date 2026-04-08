import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  //  not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //  logged in but wrong role → redirect to unauthorized
  if (allowedRoles && !allowedRoles.some((role) => user.roles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;