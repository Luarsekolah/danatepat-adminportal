import env from "@/env";
import type { ListProgramsQuery } from "@/types/program";

export const apiBaseUrl = env.VITE_API_BASE_URL;

export const queryKeys = {
  programs: {
    all: ["programs"] as const,
    lists: () => [...queryKeys.programs.all, "list"] as const,
    list: (filters?: ListProgramsQuery) =>
      [...queryKeys.programs.lists(), filters] as const,
    details: () => [...queryKeys.programs.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.programs.details(), id] as const,
    dashboard: () => [...queryKeys.programs.all, "dashboard"] as const,
  },
} as const;

export const routes = {
  auth: {
    login: "/auth/login",
  },
  program: {
    list: "/program/api/programs",
    create: "/program/api/programs",
    detail: (id: number) => `/program/api/programs/${id}`,
    update: (id: number) => `/program/api/programs/${id}`,
    dashboard: "/program/api/programs/dashboard",
  },
} as const;
