/**
 * Generic API Response Wrapper
 * Standard wrapper for all API responses
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp?: number;
}

/**
 * Generic Paginated Response
 * Used for endpoints that return paginated data
 */
export interface PaginatedData<T> {
  content: T[];
  pageable: Record<string, unknown>;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

/**
 * Generic List Response
 * Convenience type for array responses
 */
export type ApiListResponse<T> = ApiResponse<T[]>;

/**
 * Generic Paginated Response
 * Convenience type for paginated responses
 */
export type ApiPaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

/**
 * Generic Error Response
 * Standard error response structure
 */
export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  data?: null;
  timestamp?: number;
}

/**
 * Generic Success Response (nullable data)
 * Used for operations that don't return data
 */
export type ApiSuccessResponse = ApiResponse<null | Record<string, unknown>>;

/**
 * Combined type for API responses - success or error
 */
export type ApiResponseResult<T> = ApiResponse<T> | ApiErrorResponse;

/**
 * User Authentication Data
 * Returned from login endpoint
 */
export interface UserAuthData {
  userId: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  status: string;
  message: string;
  token: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * Program Data
 * Represents a social assistance program
 */
export interface ProgramData {
  id: number;
  name: string;
  description?: string;
  programManagerId: number;
  startDate: string;
  endDate: string;
  dailyAllocationAmount: number;
  currencyTokenName: string;
  status: "DRAFT" | "ACTIVE";
}

/**
 * Program Statistics Dashboard
 * Program-related statistics
 */
export interface ProgramDashboard {
  totalPrograms: number;
  totalActivePrograms: number;
  totalDailyAllocationAmount: number;
}

/**
 * Regional Data - Kota
 * City/municipality data
 */
export interface Kota {
  id: string;
  kota: string;
}

/**
 * Regional Data - Kecamatan
 * District data with reference to city
 */
export interface Kecamatan {
  id: string;
  kecamatan: string;
  kota: Kota;
}

/**
 * Merchant Registration Request Data
 */
export interface MerchantRegistrationRequest {
  userId: number;
  businessName: string;
  bankName: string;
  bankAccountNumber: string;
  kategori: "PANGAN";
}

/**
 * Merchant Wilayah (Territory) Entry
 * Represents merchant's operational area
 */
export interface MerchantWilayah {
  id: number;
  merchantUserId: number;
  kota: string;
  kecamatan: string | null;
  alamat: string;
}

/**
 * Merchant Profile Data
 * Complete merchant information
 */
export interface MerchantData {
  userId: number;
  businessName: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  kategori: string;
  status: string;
  qrisData?: string;
  wilayahList?: MerchantWilayah[];
}

/**
 * Merchant Statistics Dashboard
 * Merchant-related statistics
 */
export interface MerchantSummary {
  totalMerchant: number;
  totalMerchantAktif: number;
  totalMerchantPending: number;
}
