import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth-store";

/**
 * PublicRoute Component
 * Redirects authenticated users away from public routes (like login)
 * to the dashboard. Allows unauthenticated users to access the route.
 */
export const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show nothing while redirecting
  if (isAuthenticated) {
    return null;
  }

  return <Outlet />;
};
