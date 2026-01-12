import { z } from "zod";
import type {
  ApiResponse,
  MerchantData,
  MerchantSummary,
  Kota,
  Kecamatan,
} from "@/types/base";

/**
 * Merchant registration request payload schema
 * Validates all required fields for merchant registration
 */
export const registerMerchantPayloadSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email harus diisi" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Format email tidak valid",
    }),
  fullName: z
    .string({ message: "Nama lengkap harus diisi" })
    .min(1, { message: "Nama lengkap harus diisi" })
    .min(3, { message: "Nama lengkap minimal 3 karakter" }),
  phoneNumber: z
    .string()
    .nonempty({ message: "Nomor telepon harus diisi" })
    .regex(/^\d+$/, {
      message: "Nomor telepon harus berupa angka",
    })
    .regex(/^\d{10,15}$/, {
      message: "Nomor telepon harus 10 hingga 15 digit",
    }),
  nik: z
    .string({ message: "NIK harus diisi" })
    .min(1, { message: "NIK harus diisi" })
    .length(16, { message: "NIK harus 16 karakter" }),
  blockchainWalletAddress: z
    .string({ message: "Alamat wallet blockchain harus diisi" })
    .min(1, { message: "Alamat wallet blockchain harus diisi" }),
  businessName: z
    .string({ message: "Nama bisnis harus diisi" })
    .min(1, { message: "Nama bisnis harus diisi" })
    .min(3, { message: "Nama bisnis minimal 3 karakter" }),
  bankName: z
    .string({ message: "Nama bank harus diisi" })
    .min(1, { message: "Nama bank harus diisi" }),
  bankAccountNumber: z
    .string({ message: "Nomor rekening harus diisi" })
    .min(1, { message: "Nomor rekening harus diisi" }),
  kategori: z.enum(["PANGAN", "KESEHATAN", "PENDIDIKAN"], {
    message: "Kategori harus diisi",
  }),
});

/**
 * Bulk merchant registration item schema
 * Optional fields for bulk registration
 */
export const bulkMerchantItemSchema = z.object({
  email: z.string().min(1),
  fullName: z.string().min(1),
  phoneNumber: z.string().min(1),
  nik: z.string().min(1),
  blockchainWalletAddress: z.string().optional(),
  businessName: z.string().min(1),
  bankName: z.string().min(1),
  bankAccountNumber: z.string().min(1),
  kategori: z.enum(["PANGAN", "KESEHATAN", "PENDIDIKAN"]),
  alamat: z.string().optional(),
  latlon: z.string().optional(),
});

/**
 * Bulk merchant registration payload schema
 * Array of merchant data for bulk creation with program
 */
export const bulkRegisterMerchantPayloadSchema = z.array(
  bulkMerchantItemSchema,
);

/**
 * Set merchant wilayah (territory) payload schema
 * Validates merchant operational area
 */
export const setMerchantWilayahPayloadSchema = z.object({
  kota: z
    .string({ message: "Kota harus diisi" })
    .min(1, { message: "Kota harus diisi" }),
  kecamatan: z
    .string({ message: "Kecamatan harus diisi" })
    .min(1, { message: "Kecamatan harus diisi" }),
  alamat: z
    .string({ message: "Alamat harus diisi" })
    .min(1, { message: "Alamat harus diisi" })
    .min(5, { message: "Alamat minimal 5 karakter" }),
});

/**
 * Query parameters for listing merchants
 */
export const listMerchantQuerySchema = z
  .object({
    page: z.number().int().min(0).optional(),
    size: z.number().int().min(1).optional(),
    kota: z.string().optional(),
  })
  .strict();

// Type exports
export type RegisterMerchantPayload = z.infer<
  typeof registerMerchantPayloadSchema
>;
export type BulkMerchantItem = z.infer<typeof bulkMerchantItemSchema>;
export type BulkRegisterMerchantPayload = z.infer<
  typeof bulkRegisterMerchantPayloadSchema
>;
export type SetMerchantWilayahPayload = z.infer<
  typeof setMerchantWilayahPayloadSchema
>;
export type ListMerchantQuery = z.infer<typeof listMerchantQuerySchema>;

// Response type exports
export type RegisterMerchantResponse = ApiResponse<MerchantData>;
export type BulkRegisterMerchantResponse = ApiResponse<Record<string, unknown>>;
export type GetMerchantProfilesResponse = ApiResponse<{
  content: MerchantData[];
  pageable: Record<string, unknown>;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}>;
export type GetMerchantSummaryResponse = ApiResponse<MerchantSummary>;
export type SetMerchantWilayahResponse = ApiResponse<Record<string, unknown>>;
export type GetKotaListResponse = ApiResponse<Kota[]>;
export type GetKecamatanListResponse = ApiResponse<Kecamatan[]>;

/**
 * Update merchant profile payload schema
 * All fields are optional for partial updates
 */
export const updateMerchantProfilePayloadSchema = z.object({
  businessName: z.string().min(1).optional(),
  bankName: z.string().min(1).optional(),
  bankAccountNumber: z.string().min(1).optional(),
  bankAccountHolder: z.string().min(1).optional(),
  kategori: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  qrisData: z.string().optional(),
  alamat: z.string().optional(),
  latlon: z.string().optional(),
});

/**
 * Merchant profile/detail response type
 */
export interface MerchantProfile {
  userId: number;
  businessName: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  kategori: string;
  status: string;
  qrisData: string;
  alamat: string | null;
  latlon: string | null;
}

export type GetMerchantProfileResponse = ApiResponse<MerchantProfile>;
export type UpdateMerchantProfilePayload = z.infer<
  typeof updateMerchantProfilePayloadSchema
>;
export type UpdateMerchantProfileResponse = ApiResponse<MerchantProfile>;
