import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  // already logged in → redirect away from login/signup
  if (user) {
    const role = user.roles?.[0];
    if (role === "ADMIN" || role === "PCD_OFFICER") {
      return <Navigate to="/home" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;