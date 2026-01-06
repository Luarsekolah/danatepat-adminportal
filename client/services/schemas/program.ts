import { z } from "zod";
import type {
  ApiResponse,
  ApiPaginatedResponse,
  ProgramData,
  ProgramDashboard,
} from "@/types/base";

/**
 * Create Program request payload schema
 * Validates all required fields for creating a new program
 */
export const createProgramPayloadSchema = z.object({
  name: z
    .string({ message: "Nama program harus berisi nilai" })
    .min(1, { message: "Nama program harus diisi" })
    .min(3, { message: "Nama program minimal 3 karakter" }),
  description: z.string().optional(),
  startDate: z
    .string({ message: "Tanggal mulai harus berisi nilai" })
    .min(1, { message: "Tanggal mulai harus diisi" }),
  endDate: z
    .string({ message: "Tanggal akhir harus berisi nilai" })
    .min(1, { message: "Tanggal akhir harus diisi" }),
  dailyAllocationAmount: z
    .number({ message: "Jumlah alokasi harian harus berupa angka" })
    .positive({ message: "Jumlah alokasi harian harus lebih dari 0" }),
  currencyTokenName: z
    .string({ message: "Nama token harus berisi nilai" })
    .min(1, { message: "Nama token harus diisi" }),
});

/**
 * Update Program request payload schema
 */
export const updateProgramPayloadSchema = createProgramPayloadSchema.extend({
  status: z.enum(["DRAFT", "ACTIVE"]).optional(),
});

/**
 * Query parameters for listing programs
 */
export const listProgramQuerySchema = z
  .object({
    status: z.enum(["DRAFT", "ACTIVE"]).optional(),
  })
  .strict();

// Type exports
export type CreateProgramPayload = z.infer<typeof createProgramPayloadSchema>;
export type UpdateProgramPayload = z.infer<typeof updateProgramPayloadSchema>;
export type ListProgramQuery = z.infer<typeof listProgramQuerySchema>;
export type CreateProgramResponse = ApiResponse<ProgramData>;
export type UpdateProgramResponse = ApiResponse<ProgramData>;
export type ListProgramResponse = ApiResponse<ProgramData[]>;
export type GetProgramResponse = ApiResponse<ProgramData>;
export type ProgramDashboardResponse = ApiResponse<ProgramDashboard>;
