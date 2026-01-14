import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { mainApi } from "../api";
import { queryKeys, routes } from "../api-config";
import { getErrorMessage } from "@/lib/error-utils";
import { toast } from "sonner";
import type { DonatePayload, DonateResponse } from "@/services/schemas/payment";

/**
 * Hook for making a donation to a program
 * Allows users to donate nominal amount to a program
 *
 * @example
 * const { mutate, isPending } = useDonate();
 * mutate({ userId: 4, programId: 8, nominal: 100000000 });
 */
export function useDonate(
  options?: Omit<
    UseMutationOptions<DonateResponse, Error, DonatePayload>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<DonateResponse, Error, DonatePayload>({
    mutationFn: async (payload) => {
      const res = await mainApi.post(routes.payment.donate, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.programs.dashboard(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.programs.lists(),
      });
      toast.success("Berhasil set donatur!", {
        description: data.message || "Donatur berhasil di-set ke program",
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error("Gagal mengirim donasi", {
        description: errorMessage,
      });
    },
    ...options,
  });
}
