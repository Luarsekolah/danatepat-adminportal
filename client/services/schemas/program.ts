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
export const createProgramPayloadSchema = z
  .object({
    name: z
      .string({ message: "Nama program harus diisi" })
      .min(1, { message: "Nama program harus diisi" })
      .min(3, { message: "Nama program minimal 3 karakter" }),
    description: z
      .string({ message: "Deskripsi harus diisi" })
      .min(1, { message: "Deskripsi harus diisi" }),
    startDate: z
      .string({ message: "Tanggal mulai harus diisi" })
      .min(1, { message: "Tanggal mulai harus diisi" }),
    endDate: z
      .string({ message: "Tanggal akhir harus diisi" })
      .min(1, { message: "Tanggal akhir harus diisi" }),
    anggaran: z
      .number({ message: "Anggaran harus berupa angka" })
      .positive({ message: "Anggaran harus lebih dari 0" }),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "Tanggal akhir harus lebih besar atau sama dengan tanggal mulai",
    path: ["endDate"],
  });

/**
 * Update Program request payload schema
 */
export const updateProgramPayloadSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  programManagerId: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dailyAllocationAmount: z.number().positive().optional(),
  currencyTokenName: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).optional(),
});

/**
 * Query parameters for listing programs
 */
export const listProgramQuerySchema = z
  .object({
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).optional(),
  })
  .strict();

/**
 * Create Sub Program request payload schema
 * For creating children programs under a parent program
 */
export const createSubProgramPayloadSchema = z.object({
  name: z
    .string({ message: "Nama sub program harus diisi" })
    .min(1, { message: "Nama sub program harus diisi" }),
  description: z
    .string({ message: "Deskripsi harus diisi" })
    .min(1, { message: "Deskripsi harus diisi" }),
  expTokenDate: z.date().optional(),
  anggaran: z
    .number({ message: "Anggaran harus berupa angka" })
    .positive({ message: "Anggaran harus lebih dari 0" }),
  dailyAllocationAmount: z
    .number({ message: "Alokasi harian harus berupa angka" })
    .positive({ message: "Alokasi harian harus lebih dari 0" }),
  maxTrxPerDay: z
    .number({ message: "Maksimal transaksi per hari harus berupa angka" })
    .positive({ message: "Maksimal transaksi per hari harus lebih dari 0" }),
  kategori: z.enum(["PANGAN", "KESEHATAN", "PENDIDIKAN"], {
    message: "Kategori harus salah satu dari: PANGAN, KESEHATAN, PENDIDIKAN",
  }),
});

/**
 * Array of sub programs for bulk creation
 */
export const createSubProgramsPayloadSchema = z.array(
  createSubProgramPayloadSchema,
);

// Type exports
export type CreateProgramPayload = z.infer<typeof createProgramPayloadSchema>;
export type UpdateProgramPayload = z.infer<typeof updateProgramPayloadSchema>;
export type ListProgramQuery = z.infer<typeof listProgramQuerySchema>;
export type CreateSubProgramPayload = z.infer<
  typeof createSubProgramPayloadSchema
>;
export type CreateSubProgramsPayload = z.infer<
  typeof createSubProgramsPayloadSchema
>;
export type CreateProgramResponse = ApiResponse<ProgramData>;
export type UpdateProgramResponse = ApiResponse<ProgramData>;
export type CreateSubProgramsResponse = ApiResponse<ProgramData[]>;
export type ListProgramResponse = ApiResponse<ProgramData[]>;
export type GetProgramResponse = ApiResponse<ProgramData>;
export type ProgramDashboardResponse = ApiResponse<ProgramDashboard>;
