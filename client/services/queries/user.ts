import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { mainApi } from "../api";
import { routes, queryKeys } from "../api-config";
import type { GetUserDetailResponse } from "@/services/schemas/user";

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
