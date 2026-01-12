import env from "@/env";
import type { ListProgramsQuery } from "@/types/program";
import type { ListMerchantQuery } from "@/services/schemas/merchant";

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
    children: () => [...queryKeys.programs.all, "children"] as const,
    childrenList: (parentId: number) =>
      [...queryKeys.programs.children(), parentId] as const,
    beneficiaries: () => [...queryKeys.programs.all, "beneficiaries"] as const,
    beneficiariesList: (programId: number) =>
      [...queryKeys.programs.beneficiaries(), programId] as const,
  },
  merchants: {
    all: ["merchants"] as const,
    lists: () => [...queryKeys.merchants.all, "list"] as const,
    list: (filters?: ListMerchantQuery) =>
      [...queryKeys.merchants.lists(), filters] as const,
    summaries: () => [...queryKeys.merchants.all, "summary"] as const,
    summary: () => [...queryKeys.merchants.summaries()] as const,
    kotas: () => [...queryKeys.merchants.all, "kota"] as const,
    kotaList: () => [...queryKeys.merchants.kotas()] as const,
    kecamatans: () => [...queryKeys.merchants.all, "kecamatan"] as const,
    kecamatanList: (idKota: string) =>
      [...queryKeys.merchants.kecamatans(), idKota] as const,
  },
} as const;

export const routes = {
  auth: {
    login: "/auth/login",
  },
  beneficiary: {
    bulkCreateWithProgram: (programId: number) =>
      `/users/bulk/program/${programId}`,
  },
  program: {
    list: "/program/api/programs",
    create: "/program/api/programs",
    detail: (id: number) => `/program/api/programs/${id}`,
    update: (id: number) => `/program/api/programs/${id}`,
    dashboard: "/program/api/programs/dashboard",
    createChildren: (parentId: number) =>
      `/program/api/programs/${parentId}/children`,
    listChildren: (parentId: number) =>
      `/program/api/programs/${parentId}/children`,
    listUsers: (programId: number) =>
      `/program/api/programs/${programId}/users`,
  },
  merchant: {
    profiles: "/merchant/api/merchant/profiles",
    register: "/merchant/api/merchant/register",
    bulkRegisterWithProgram: (programId: number) =>
      `/merchant/api/merchant/register/bulk-program/${programId}`,
    summary: "/merchant/api/merchant/summary",
    kota: "/merchant/api/merchant/kota",
    kecamatan: (idKota: string) => `/merchant/api/merchant/kecamatan/${idKota}`,
    wilayah: (merchantId: number) =>
      `/merchant/api/merchant/${merchantId}/wilayah`,
  },
} as const;
