import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { mainApi } from "../api";
import { routes, queryKeys } from "../api-config";
import type {
  GetUserDetailResponse,
  ListUsersResponse,
  ListUsersQuery,
} from "@/services/schemas/user";

/**
 * Hook for fetching all users list
 * Returns array of all users in the system
 *
 * @example
 * const usersQuery = useListUsers({ role: 'BENEFICIARY' });
 * const users = usersQuery.data?.data ?? [];
 */
export function useListUsers(
  filters?: ListUsersQuery,
  options?: Omit<
    UseQueryOptions<ListUsersResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ListUsersResponse, Error>({
    queryKey: queryKeys.users.list(filters),
    queryFn: async () => {
      const res = await mainApi.get(routes.user.list, {
        params: filters,
      });
      return res.data;
    },
    ...options,
  });
}

/**
 * Hook for fetching user detail/profile by ID
 * Returns detailed user information
 *
 * @example
 * const detailQuery = useGetUserDetail(4);
 * const user = detailQuery.data?.data;
 */
export function useGetUserDetail(
  userId: number,
  options?: Omit<
    UseQueryOptions<GetUserDetailResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<GetUserDetailResponse, Error>({
    queryKey: queryKeys.users.detail(userId),
    queryFn: async () => {
      const res = await mainApi.get(routes.user.detail(userId));
      return res.data;
    },
    ...options,
  });
}
