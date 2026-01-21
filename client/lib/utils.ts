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
 * Format number as IDR currency for PRANA token
 */
export function formatCurrencyToken(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

  return `Pr${formatted}`;
}

/**
 * Format date to Indonesian format (DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const timeFormatter = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const dateFormatter = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
  } catch {
    return dateString;
  }
}
