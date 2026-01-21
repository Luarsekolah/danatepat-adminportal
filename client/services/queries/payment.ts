import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { mainApi } from "../api";
import { routes, queryKeys } from "../api-config";
import type {
  GetPaymentHistoryResponse,
  GetTransactionDetailResponse,
  PaymentHistoryQuery,
} from "@/services/schemas/payment";

/**
 * Hook for fetching payment history with date range filters
 * Returns paginated list of payment transactions
 *
 * @example
 * const historyQuery = useGetPaymentHistory({
 *   startDate: '2026-01-13',
 *   endDate: '2026-01-14',
 *   page: 0
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

/**
 * Hook for fetching transaction detail by hash
 * Returns blockchain transaction details
 *
 * @example
 * const txQuery = useGetTransactionDetail('0x094dc6707647be0c9bf044c9d23972e49d4671b51d55cd169483462e1e5cee79');
 * const transaction = txQuery.data?.data;
 */
export function useGetTransactionDetail(
  txHash: string,
  options?: Omit<
    UseQueryOptions<GetTransactionDetailResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<GetTransactionDetailResponse, Error>({
    queryKey: queryKeys.payments.transaction(txHash),
    queryFn: async () => {
      const res = await mainApi.get(routes.payment.transaction(txHash));
      return res.data;
    },
    enabled: Boolean(txHash),
    ...options,
  });
}
