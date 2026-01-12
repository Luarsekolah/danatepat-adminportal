import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { mainApi } from "../api";
import { routes, queryKeys } from "../api-config";
import type {
  ListProgramsResponse,
  ListProgramsQuery,
  GetProgramResponse,
  ProgramDashboardResponse,
  ListProgramChildrenResponse,
  ListProgramUsersResponse,
} from "@/types/program";

/**
 * Hook for fetching program list
 * Returns a flat array of programs
 *
 * @example
 * const programsQuery = useListProgram({ status: 'ACTIVE' });
 * const programs = programsQuery.data?.data ?? [];
 */
export function useListProgram(
  filters?: ListProgramsQuery,
  options?: Omit<
    UseQueryOptions<ListProgramsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ListProgramsResponse, Error>({
    queryKey: queryKeys.programs.list(filters),
    queryFn: async () => {
      const res = await mainApi.get(routes.program.list, {
        params: filters,
      });
      return res.data;
    },
    ...options,
  });
}

/**
 * Hook for fetching a single program by ID
 *
 * @example
 * const programQuery = useGetProgram(1);
 * const program = programQuery.data?.data;
 */
export function useGetProgram(
  programId: number,
  options?: Omit<
    UseQueryOptions<GetProgramResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<GetProgramResponse, Error>({
    queryKey: queryKeys.programs.detail(programId),
    queryFn: async () => {
      const res = await mainApi.get(routes.program.detail(programId));
      return res.data;
    },
    ...options,
  });
}

/**
 * Hook for fetching program dashboard statistics
 *
 * @example
 * const dashboardQuery = useProgramDashboard();
 * const stats = dashboardQuery.data?.data;
 */
export function useProgramDashboard(
  options?: Omit<
    UseQueryOptions<ProgramDashboardResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ProgramDashboardResponse, Error>({
    queryKey: queryKeys.programs.dashboard(),
    queryFn: async () => {
      const res = await mainApi.get(routes.program.dashboard);
      return res.data;
    },
    ...options,
  });
}

/**
 * Hook for fetching sub programs (children) of a parent program
 *
 * @example
 * const childrenQuery = useListProgramChildren(1);
 * const subPrograms = childrenQuery.data?.data ?? [];
 */
export function useListProgramChildren(
  parentId: number,
  options?: Omit<
    UseQueryOptions<ListProgramChildrenResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ListProgramChildrenResponse, Error>({
    queryKey: queryKeys.programs.childrenList(parentId),
    queryFn: async () => {
      const res = await mainApi.get(routes.program.listChildren(parentId));
      return res.data;
    },
    ...options,
  });
}

/**
 * Hook for fetching users (beneficiaries and merchants) in a program
 *
 * @example
 * const usersQuery = useListProgramUsers(1);
 * const beneficiaries = usersQuery.data?.data?.beneficiaries ?? [];
 * const merchants = usersQuery.data?.data?.merchants ?? [];
 */
export function useListProgramUsers(
  programId: number,
  options?: Omit<
    UseQueryOptions<ListProgramUsersResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ListProgramUsersResponse, Error>({
    queryKey: queryKeys.programs.beneficiariesList(programId),
    queryFn: async () => {
      const res = await mainApi.get(routes.program.listUsers(programId));
      return res.data;
    },
    ...options,
  });
}
