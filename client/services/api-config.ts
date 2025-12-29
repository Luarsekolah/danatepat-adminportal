import env from "@/env";

export const apiBaseUrl = env.VITE_API_BASE_URL;

export const queryKeys = {} as const;

export const routes = {
  auth: {
    login: "/auth/login",
  },
} as const;
