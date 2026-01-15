import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { mainApi } from "../api";
import { routes, queryKeys } from "../api-config";
import type {
  GetPaymentHistoryResponse,
  PaymentHistoryQuery,
} from "@/services/schemas/payment";

/**
 * Hook for fetching payment history with date range filters
 * Returns paginated list of payment transactions
 *
 * @example
 * const historyQuery = useGetPaymentHistory({
 *   startDate: '2026-01-13',
 *   endDate: '2026-01-14'
 * });
 * const transactions = historyQuery.data?.data.content ?? [];
 */
export function useGetPaymentHistory(
  filters?: PaymentHistoryQuery,
  options?: Omit<
    UseQueryOptions<GetPaymentHistoryResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<GetPaymentHistoryResponse, Error>({
    queryKey: queryKeys.payments.history(filters),
    queryFn: async () => {
      const res = await mainApi.get(routes.payment.historyAll, {
        params: filters,
      });
      return res.data;
    },
    ...options,
  });
}
