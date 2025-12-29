import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/base";

/**
 * Type guard to check if an unknown error is an Axios API error
 *
 * @param error - The error to check
 * @returns True if the error is an Axios API error with a ApiErrorResponse, false otherwise
 *
 * @example
 * ```ts
 * try {
 *   await someApiCall();
 * } catch (error) {
 *   if (isApiError(error)) {
 *     // error is now typed as AxiosError<ApiErrorResponse>
 *     console.log(error.response.data);
 *   }
 * }
 * ```
 */
export function isApiError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  return (
    error instanceof Error &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  );
}

/**
 * Extracts a human-readable error message from various error types.
 *
 * @param error - The error object to process. Can be an API error, Axios error, standard Error, or unknown type
 * @returns A string containing the error message
 *
 * @example
 * ```typescript
 * try {
 *   // Some code that might throw
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   console.log(message); // Will output appropriate error message
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  // Check if it's an API error with structured response
  if (isApiError(error)) {
    return error.response?.data?.message || "An API error occurred";
  }

  // Check if it's an Axios error without structured response
  if (error instanceof AxiosError) {
    return error.message || "Network error occurred";
  }

  // Check if it's a regular Error
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback for unknown error types
  return "An unknown error occurred";
}

/**
 * Extracts error response data from an API error object.
 *
 * @param error - The error object to extract data from. Can be of any type.
 * @returns A {@link ApiErrorResponse} object if the error is an API error with response data, null otherwise.
 */
export function getErrorData(error: unknown): ApiErrorResponse | null {
  if (isApiError(error)) {
    return error.response?.data || null;
  }
  return null;
}

/**
 * Extracts the HTTP status code from an API error if present.
 *
 * @param error - The error object to examine
 * @returns The HTTP status code if the error is an API error with a status, otherwise null
 */
export function getErrorStatus(error: unknown): number | null {
  if (isApiError(error)) {
    return error.response?.status || null;
  }
  return null;
}
