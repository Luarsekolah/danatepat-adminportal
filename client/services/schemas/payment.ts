import { z } from "zod";
import type { ApiResponse } from "@/types/base";

/**
 * Payment history query parameters schema
 */
export const paymentHistoryQuerySchema = z
  .object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.number().int().min(0).optional(),
    size: z.number().int().min(1).optional(),
  })
  .strict();

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
export type PaymentHistoryQuery = z.infer<typeof paymentHistoryQuerySchema>;
export type DonatePayload = z.infer<typeof donatePayloadSchema>;

// Response type exports
export type DonateResponse = ApiResponse<Record<string, unknown>>;

/**
 * Payment history transaction details
 */
export interface PaymentTransaction {
  id: string;
  transactionRefId: string;
  amount: number;
  status: string;
  blockchainTxHash: string;
  transactionType: string;
  createdAt: string;
}

/**
 * Payment history merchant info
 */
export interface PaymentMerchant {
  merchantId: number;
  merchantName: string;
}

/**
 * Payment history program info
 */
export interface PaymentProgram {
  programId: number;
  kategori: string;
}

/**
 * Payment history item
 */
export interface PaymentHistoryItem {
  merchant: PaymentMerchant;
  program: PaymentProgram;
  transaction: PaymentTransaction;
}

/**
 * Payment history response data with pagination
 */
export interface PaymentHistoryData {
  content: PaymentHistoryItem[];
  pageable: Record<string, unknown>;
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: Record<string, unknown>;
  empty: boolean;
}

export type GetPaymentHistoryResponse = ApiResponse<PaymentHistoryData>;
