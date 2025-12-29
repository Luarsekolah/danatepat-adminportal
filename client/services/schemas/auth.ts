import { z } from "zod";
import type { ApiResponse, UserAuthData } from "@/types/base";

/**
 * Login request payload schema
 * Validates email format and ensures password is not empty
 */
export const loginPayloadSchema = z.object({
  email: z
    .string({ message: "Email harus berisi nilai" })
    .min(1, { message: "Email harus diisi" })
    .email({ message: "Format email tidak valid" })
    .toLowerCase(),
  password: z
    .string({ message: "Password harus berisi nilai" })
    .min(1, { message: "Password harus diisi" })
    .min(6, { message: "Password minimal 6 karakter" }),
});

// Type exports
export type LoginPayload = z.infer<typeof loginPayloadSchema>;
export type LoginResponse = ApiResponse<UserAuthData>;
