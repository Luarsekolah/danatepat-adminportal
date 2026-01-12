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
  CreateProgramPayload,
  CreateProgramResponse,
  UpdateProgramPayload,
  UpdateProgramResponse,
  PublishProgramResponse,
} from "@/types/program";
import type {
  CreateSubProgramsPayload,
  CreateSubProgramsResponse,
} from "../schemas/program";

/**
 * Hook for creating a new program
 * Follows the same pattern as useLogin mutation
 *
 * @example
 * const { mutate, isPending } = useCreateProgram({
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['programs'] });
 *   }
 * });
 * mutate({ name: 'Program Name', ... });
 */
export function useCreateProgram(
  options?: Omit<
    UseMutationOptions<CreateProgramResponse, Error, CreateProgramPayload>,
    "mutationFn"
  >,
) {
  return useMutation<CreateProgramResponse, Error, CreateProgramPayload>({
    mutationFn: async (payload) => {
      const res = await mainApi.post(routes.program.create, payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Program berhasil dibuat!", {
        description: data.message || "Program baru telah ditambahkan",
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error("Gagal membuat program", {
        description: errorMessage,
      });
    },
    ...options,
  });
}

/**
 * Hook for updating an existing program
 *
 * @example
 * const { mutate, isPending } = useUpdateProgram(1, {
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['program', 1] });
 *   }
 * });
 * mutate({ name: 'Updated Name', ... });
 */
export function useUpdateProgram(
  programId: number,
  options?: Omit<
    UseMutationOptions<UpdateProgramResponse, Error, UpdateProgramPayload>,
    "mutationFn"
  >,
) {
  return useMutation<UpdateProgramResponse, Error, UpdateProgramPayload>({
    mutationFn: async (payload) => {
      const res = await mainApi.put(routes.program.update(programId), payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Program berhasil diperbarui!", {
        description: data.message || "Perubahan telah disimpan",
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error("Gagal memperbarui program", {
        description: errorMessage,
      });
    },
    ...options,
  });
}

/**
 * Hook for creating sub-programs under a parent program
 *
 * @example
 * const { mutate, isPending } = useCreateSubPrograms(1, {
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['programs'] });
 *   }
 * });
 * mutate([{ name: 'Sub Program', kategori: 'PANGAN', ... }]);
 */
export function useCreateSubPrograms(
  parentProgramId: number,
  options?: Omit<
    UseMutationOptions<
      CreateSubProgramsResponse,
      Error,
      CreateSubProgramsPayload
    >,
    "mutationFn"
  >,
) {
  return useMutation<
    CreateSubProgramsResponse,
    Error,
    CreateSubProgramsPayload
  >({
    mutationFn: async (payload) => {
      const res = await mainApi.post(
        routes.program.createChildren(parentProgramId),
        payload,
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Sub program berhasil dibuat!", {
        description:
          data.message || `${data.data.length} sub program telah ditambahkan`,
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error("Gagal membuat sub program", {
        description: errorMessage,
      });
    },
    ...options,
  });
}

/**
 * Hook for publishing a program
 * Transitions a program from DRAFT to ACTIVE status
 *
 * @example
 * const { mutate, isPending } = usePublishProgram(1, {
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['programs'] });
 *   }
 * });
 * mutate();
 */
export function usePublishProgram(
  programId: number,
  options?: Omit<
    UseMutationOptions<PublishProgramResponse, Error, void>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<PublishProgramResponse, Error, void>({
    mutationFn: async () => {
      const res = await mainApi.post(routes.program.publish(programId));
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.programs.detail(programId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.programs.lists(),
      });
      toast.success("Program berhasil dipublikasikan!", {
        description: data.message || "Program status berubah menjadi Aktif",
      });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error("Gagal mempublikasikan program", {
        description: errorMessage,
      });
    },
    ...options,
  });
}
