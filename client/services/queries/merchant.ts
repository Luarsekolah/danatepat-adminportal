import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { mainApi } from "../api";
import { routes, queryKeys } from "../api-config";
import type {
  GetMerchantProfilesResponse,
  GetMerchantProfileResponse,
  GetMerchantSummaryResponse,
  GetKotaListResponse,
  GetKecamatanListResponse,
  ListMerchantQuery,
} from "@/services/schemas/merchant";

/**
 * Hook for fetching merchant list with pagination
 * Returns paginated merchant data
 *
 * @example
 * const merchantsQuery = useListMerchant({ page: 0, size: 10, kota: 'Jakarta' });
 * const merchants = merchantsQuery.data?.data.content ?? [];
 */
export function useListMerchant(
  filters?: ListMerchantQuery,
  options?: Omit<
    UseQueryOptions<GetMerchantProfilesResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<GetMerchantProfilesResponse, Error>({
    queryKey: queryKeys.merchants.list(filters),
    queryFn: async () => {
      const res = await mainApi.get(routes.merchant.profiles, {
        params: filters,
      });
      return res.data;
    },
    ...options,
  });
}

/**
 * Hook for fetching merchant profile/detail by ID
 * Returns detailed merchant information
 *
 * @example
 * const profileQuery = useGetMerchantProfile(2);
 * const profile = profileQuery.data?.data;
 */
export function useGetMerchantProfile(
  merchantId: number,
  options?: Omit<
    UseQueryOptions<GetMerchantProfileResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<GetMerchantProfileResponse, Error>({
    queryKey: queryKeys.merchants.profile(merchantId),
    queryFn: async () => {
      const res = await mainApi.get(routes.merchant.profile(merchantId));
      return res.data;
    },
    ...options,
  });
}

/**
 * Hook for fetching merchant summary statistics
 *
 * @example
 * const summaryQuery = useMerchantSummary();
 * const stats = summaryQuery.data?.data;
 */
export function useMerchantSummary(
  options?: Omit<
    UseQueryOptions<GetMerchantSummaryResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<GetMerchantSummaryResponse, Error>({
    queryKey: queryKeys.merchants.summary(),
    queryFn: async () => {
      const res = await mainApi.get(routes.merchant.summary);
      return res.data;
    },
    ...options,
  });
}

/**
 * Hook for fetching list of cities (Kota)
 * Used for merchant wilayah selection
 *
 * @example
 * const kotaQuery = useGetKotaList();
 * const kotas = kotaQuery.data?.data ?? [];
 */
export function useGetKotaList(
  options?: Omit<
    UseQueryOptions<GetKotaListResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<GetKotaListResponse, Error>({
    queryKey: queryKeys.merchants.kotaList(),
    queryFn: async () => {
      const res = await mainApi.get(routes.merchant.kota);
      return res.data;
    },
    ...options,
  });
}

/**
 * Hook for fetching list of districts (Kecamatan) by city ID
 * Used for merchant wilayah selection
 *
 * @example
 * const kecamatanQuery = useGetKecamatanList('3173');
 * const kecamatans = kecamatanQuery.data?.data ?? [];
 */
export function useGetKecamatanList(
  idKota: string,
  options?: Omit<
    UseQueryOptions<GetKecamatanListResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<GetKecamatanListResponse, Error>({
    queryKey: queryKeys.merchants.kecamatanList(idKota),
    queryFn: async () => {
      const res = await mainApi.get(routes.merchant.kecamatan(idKota));
      return res.data;
    },
    enabled: !!idKota,
    ...options,
  });
}
