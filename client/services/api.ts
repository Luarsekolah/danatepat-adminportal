import { apiBaseUrl } from "./api-config";
import { useAuthStore } from "@/stores/auth-store";
import env from "@/env";
import axios from "axios";

function apiCreator(baseUrl: string) {
  const api = axios.create({
    baseURL: baseUrl,
    timeout: 20_000,
    timeoutErrorMessage: "Request timeout",
  });

  api.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearAuth();

        if (
          typeof window !== "undefined" &&
          window.location.pathname.startsWith("/dashboard")
        ) {
          window.location.href = env.VITE_APP_BASE_URL || "/";
        }
      }
      // Return the full error object, not just error.response
      return Promise.reject(error);
    },
  );

  return api;
}

export const mainApi = apiCreator(apiBaseUrl);
