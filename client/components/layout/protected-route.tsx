import { Outlet, useLocation, useNavigate } from "react-router";
import env from "@/env";
import { useAuthStore } from "@/stores/auth-store";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const location = useLocation();

  if (!isAuthenticated) {
    clearAuth();
    if (location.pathname.startsWith("/dashboard")) {
      window.location.href = env.VITE_APP_BASE_URL || "/";
    }
    return null;
  }

  return <Outlet />;
};
