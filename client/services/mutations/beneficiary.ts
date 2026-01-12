import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { mainApi } from "../api";
import { queryKeys, routes } from "../api-config";
import { getErrorMessage } from "@/lib/error-utils";
import { toast } from "sonner";
import type {
  BulkCreateBeneficiariesPayload,
  BulkCreateBeneficiariesResponse,
} from "@/services/schemas/beneficiary";

/**
 * Hook for bulk creating beneficiaries with a program
 * Creates multiple beneficiary accounts associated with a program
 *
 * @example
 * const { mutate, isPending } = useBulkCreateBeneficiariesWithProgram(123, {
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
 *   }
 * });
 * mutate({
 *   users: [
 *     { email: 'test@test.com', fullName: 'Test', role: 'BENEFICIARY', ... }
 *   ]
 * });
 */
export function useBulkCreateBeneficiariesWithProgram(
  programId: number,
  options?: Omit<
    UseMutationOptions<
      BulkCreateBeneficiariesResponse,
      Error,
      BulkCreateBeneficiariesPayload
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    BulkCreateBeneficiariesResponse,
    Error,
    BulkCreateBeneficiariesPayload
  >({
    mutationFn: async (payload) => {
      const res = await mainApi.post(
        routes.beneficiary.bulkCreateWithProgram(programId),
        payload,
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.programs.beneficiariesList(programId),
      });
      toast.success("Beneficiary berhasil dibuat secara masal!", {
        description:
          data.message || "Semua beneficiary telah ditambahkan ke program",
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error("Gagal membuat beneficiary secara masal", {
        description: errorMessage,
      });
    },
    ...options,
  });
}
