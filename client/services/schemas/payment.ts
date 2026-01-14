import { z } from "zod";
import type { ApiResponse } from "@/types/base";

/**
 * Payment donate request payload schema
 * Validates donation parameters
 */
export const donatePayloadSchema = z.object({
  userId: z
    .number({ message: "User ID harus diisi" })
    .int()
    .positive({ message: "User ID harus berupa angka positif" }),
  programId: z
    .number({ message: "Program ID harus diisi" })
    .int()
    .positive({ message: "Program ID harus berupa angka positif" }),
  nominal: z
    .number({ message: "Nominal harus diisi" })
    .positive({ message: "Nominal harus lebih dari 0" }),
});

// Type exports
export type DonatePayload = z.infer<typeof donatePayloadSchema>;

// Response type exports
export type DonateResponse = ApiResponse<Record<string, unknown>>;
