import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { mainApi } from "../api";
import { routes } from "../api-config";
import { getErrorMessage } from "@/lib/error-utils";
import { toast } from "sonner";
import type {
  RegisterMerchantPayload,
  BulkRegisterMerchantPayload,
  SetMerchantWilayahPayload,
  RegisterMerchantResponse,
  BulkRegisterMerchantResponse,
  SetMerchantWilayahResponse,
} from "@/services/schemas/merchant";

/**
 * Hook for bulk registering merchants with a program
 * Creates multiple merchant accounts associated with a program
 *
 * @example
 * const { mutate, isPending } = useBulkRegisterMerchantWithProgram(123, {
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['merchants'] });
 *   }
 * });
 * mutate([{ email: 'test@test.com', fullName: 'Test', ... }]);
 */
export function useBulkRegisterMerchantWithProgram(
  programId: number,
  options?: Omit<
    UseMutationOptions<
      BulkRegisterMerchantResponse,
      Error,
      BulkRegisterMerchantPayload
    >,
    "mutationFn"
  >,
) {
  return useMutation<
    BulkRegisterMerchantResponse,
    Error,
    BulkRegisterMerchantPayload
  >({
    mutationFn: async (payload) => {
      const res = await mainApi.post(
        routes.merchant.bulkRegisterWithProgram(programId),
        payload,
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Merchant berhasil terdaftar secara masal!", {
        description:
          data.message || "Semua merchant telah ditambahkan ke program",
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error("Gagal mendaftarkan merchant secara masal", {
        description: errorMessage,
      });
    },
    ...options,
  });
}

/**
 * Hook for registering a new merchant
 * Creates a new merchant account with business details
 *
 * @example
 * const { mutate, isPending } = useRegisterMerchant({
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['merchants'] });
 *   }
 * });
 * mutate({ userId: 1, businessName: 'Toko A', ... });
 */
export function useRegisterMerchant(
  options?: Omit<
    UseMutationOptions<
      RegisterMerchantResponse,
      Error,
      RegisterMerchantPayload
    >,
    "mutationFn"
  >,
) {
  return useMutation<RegisterMerchantResponse, Error, RegisterMerchantPayload>({
    mutationFn: async (payload) => {
      const res = await mainApi.post(routes.merchant.register, payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Merchant berhasil terdaftar!", {
        description: data.message || "Merchant baru telah ditambahkan",
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error("Gagal mendaftarkan merchant", {
        description: errorMessage,
      });
    },
    ...options,
  });
}

/**
 * Hook for setting merchant wilayah (territory/operational area)
 * Assigns operational areas to a merchant
 *
 * @example
 * const { mutate, isPending } = useSetMerchantWilayah(1, {
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['merchants'] });
 *   }
 * });
 * mutate({ kota: '3173', kecamatan: '3173010', alamat: 'Jl. Raya No 1' });
 */
export function useSetMerchantWilayah(
  merchantId: number,
  options?: Omit<
    UseMutationOptions<
      SetMerchantWilayahResponse,
      Error,
      SetMerchantWilayahPayload
    >,
    "mutationFn"
  >,
) {
  return useMutation<
    SetMerchantWilayahResponse,
    Error,
    SetMerchantWilayahPayload
  >({
    mutationFn: async (payload) => {
      const res = await mainApi.post(
        routes.merchant.wilayah(merchantId),
        payload,
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Wilayah merchant berhasil diatur!", {
        description: data.message || "Wilayah operasi telah disimpan",
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error("Gagal mengatur wilayah merchant", {
        description: errorMessage,
      });
    },
    ...options,
  });
}
