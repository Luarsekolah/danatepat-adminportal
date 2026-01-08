import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number as IDR currency
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

  return `Rp${formatted}`;
}

/**
 * Format date to Indonesian format (DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}
