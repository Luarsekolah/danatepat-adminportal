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
} from "@/services/schemas/user";

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
      toast.success("Penerima dana berhasil dibuat secara masal!", {
        description:
          data.message || "Semua penerima dana telah ditambahkan ke program",
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error("Gagal membuat penerima dana secara masal", {
        description: errorMessage,
      });
    },
    ...options,
  });
}

/**
 * Hook for bulk creating beneficiaries across multiple sub-programs
 * This is a temporary client-side implementation that calls the single-program
 * mutation for each selected sub-program. Backend should handle this in one call.
 *
 * @example
 * const { mutate, isPending } = useBulkCreateBeneficiariesMultiProgram(
 *   [123, 124, 125],
 *   { onSuccess: () => {} }
 * );
 * mutate({
 *   users: [
 *     { email: 'test@test.com', fullName: 'Test', ...subProgramIds: [123, 124] }
 *   ]
 * });
 */
export function useBulkCreateBeneficiariesMultiProgram(
  options?: Omit<
    UseMutationOptions<
      { successCount: number; totalPrograms: number; message: string },
      Error,
      {
        users: Array<
          BulkCreateBeneficiariesPayload["users"][0] & {
            _selectedSubPrograms: number[];
          }
        >;
      }
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    { successCount: number; totalPrograms: number; message: string },
    Error,
    {
      users: Array<
        BulkCreateBeneficiariesPayload["users"][0] & {
          _selectedSubPrograms: number[];
        }
      >;
      _subProgramsMapping?: Record<number, string>;
    }
  >({
    mutationFn: async (payload) => {
      // Collect unique sub-program IDs from all users
      const uniqueProgramIds = Array.from(
        new Set(payload.users.flatMap((user) => user._selectedSubPrograms)),
      );

      let successCount = 0;
      const errors: string[] = [];

      // For each sub-program, create beneficiaries
      for (const programId of uniqueProgramIds) {
        try {
          // Filter users for this sub-program and set kategori to match the sub-program's kategori
          const usersForProgram = payload.users
            .filter((user) => user._selectedSubPrograms.includes(programId))
            .map(({ _selectedSubPrograms, ...user }) => ({
              ...user,
              kategori:
                (payload._subProgramsMapping?.[
                  programId
                ] as BulkCreateBeneficiariesPayload["users"][0]["kategori"]) ||
                user.kategori,
            }));

          if (usersForProgram.length === 0) continue;

          // Call the single-program API
          const res = await mainApi.post(
            routes.beneficiary.bulkCreateWithProgram(programId),
            { users: usersForProgram },
          );

          if (res.data) {
            successCount++;
          }
        } catch (error) {
          const errorMsg = getErrorMessage(error);
          errors.push(`Program ID ${programId}: ${errorMsg}`);
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join("\n"));
      }

      return {
        successCount,
        totalPrograms: uniqueProgramIds.length,
        message: `Berhasil membuat penerima dana di ${successCount} dari ${uniqueProgramIds.length} sub-program`,
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.programs.beneficiaries(),
      });
      toast.success("Penerima dana berhasil dibuat!", {
        description: data.message,
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error("Gagal membuat penerima dana", {
        description: errorMessage,
      });
    },
    ...options,
  });
}
