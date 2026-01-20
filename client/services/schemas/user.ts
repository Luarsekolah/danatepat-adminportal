import { z } from "zod";
import type { ApiResponse } from "@/types/base";

/**
 * User role enum
 */
export const userRoleEnum = z.enum(["BENEFICIARY", "MERCHANT", "ADMIN"]);

/**
 * Bulk beneficiary item schema for CSV upload
 * Schema for individual beneficiary in bulk creation
 * Note: passwordHash will be generated on the backend
 */
export const bulkBeneficiaryItemSchema = z.object({
  email: z.string().min(1),
  fullName: z.string().min(1),
  phoneNumber: z.string().min(1),
  nik: z.string().min(1).length(16, { message: "NIK harus 16 karakter" }),
  blockchainWalletAddress: z.string().optional(),
  kategori: z.enum(["PANGAN", "KESEHATAN", "PENDIDIKAN"]),
  alamat: z.string().optional(),
  latlon: z.string().optional(),
  dateOfBirth: z.string().optional(),
  passwordHash: z.string().optional(),
  role: userRoleEnum,
  ktpPhotoUrl: z.string().optional(),
  selfiePhotoUrl: z.string().optional(),
});

/**
 * Bulk beneficiary creation payload schema
 * Wraps beneficiaries array for bulk creation with program
 */
export const bulkCreateBeneficiariesPayloadSchema = z.object({
  users: z.array(bulkBeneficiaryItemSchema).min(1, {
    message: "Minimal harus ada 1 beneficiary untuk dibuat",
  }),
});

/**
 * Schema for bulk beneficiary creation across multiple sub-programs
 * Each user can be assigned to multiple sub-programs via "Ya"/"Tidak" columns
 */
export const bulkCreateBeneficiariesMultiProgramSchema = z.object({
  users: z
    .array(
      bulkBeneficiaryItemSchema.extend({
        _selectedSubPrograms: z.array(z.number()).min(1, {
          message: "Minimal harus memilih 1 sub-program",
        }),
      }),
    )
    .min(1, {
      message: "Minimal harus ada 1 penerima dana untuk dibuat",
    }),
});

// Type exports
export type UserRole = z.infer<typeof userRoleEnum>;
export type BulkBeneficiaryItem = z.infer<typeof bulkBeneficiaryItemSchema>;
export type BulkCreateBeneficiariesPayload = z.infer<
  typeof bulkCreateBeneficiariesPayloadSchema
>;
export type BulkBeneficiaryMultiProgram = z.infer<
  typeof bulkCreateBeneficiariesMultiProgramSchema
>;

// Response type exports
export type BulkCreateBeneficiariesResponse = ApiResponse<
  Record<string, unknown>
>;

/**
 * User detail/profile response type
 */
export interface UserDetail {
  id: number;
  email: string;
  passwordHash: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  status: string;
  nik: string;
  blockchainWalletAddress: string;
  dateOfBirth: string | null;
  ktpPhotoUrl: string | null;
  selfiePhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type GetUserDetailResponse = ApiResponse<UserDetail>;
