import { z } from "zod";
import type {
  ApiResponse,
  MerchantData,
  MerchantSummary,
  Kota,
  Kecamatan,
  MerchantWilayah,
} from "@/types/base";

/**
 * Merchant registration request payload schema
 * Validates all required fields for merchant registration
 */
export const registerMerchantPayloadSchema = z.object({
  userId: z
    .number({ message: "ID pengguna harus berupa angka" })
    .positive({ message: "ID pengguna harus lebih dari 0" }),
  businessName: z
    .string({ message: "Nama bisnis harus berisi nilai" })
    .min(1, { message: "Nama bisnis harus diisi" })
    .min(3, { message: "Nama bisnis minimal 3 karakter" }),
  bankName: z
    .string({ message: "Nama bank harus berisi nilai" })
    .min(1, { message: "Nama bank harus diisi" }),
  bankAccountNumber: z
    .string({ message: "Nomor rekening harus berisi nilai" })
    .min(1, { message: "Nomor rekening harus diisi" }),
  kategori: z.enum(["PANGAN"], {
    message: "Kategori harus PANGAN",
  }),
});

/**
 * Set merchant wilayah (territory) payload schema
 * Validates merchant operational area
 */
export const setMerchantWilayahPayloadSchema = z.object({
  kota: z
    .string({ message: "Kota harus berisi nilai" })
    .min(1, { message: "Kota harus diisi" }),
  kecamatan: z
    .string({ message: "Kecamatan harus berisi nilai" })
    .min(1, { message: "Kecamatan harus diisi" }),
  alamat: z
    .string({ message: "Alamat harus berisi nilai" })
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
export type SetMerchantWilayahPayload = z.infer<
  typeof setMerchantWilayahPayloadSchema
>;
export type ListMerchantQuery = z.infer<typeof listMerchantQuerySchema>;

// Response type exports
export type RegisterMerchantResponse = ApiResponse<MerchantData>;
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
