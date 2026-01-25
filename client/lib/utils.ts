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

  return `Pr${formatted}`;
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

export const STATUS_STYLES: Record<string, string> = {
  PENDING: "text-amber-500 bg-amber-50",
  SUCCESS: "text-emerald-500 bg-emerald-50",
  FAILED: "text-red-500 bg-red-50",
  COMPLETED: "text-emerald-500 bg-emerald-50",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  SUCCESS: "Berhasil",
  FAILED: "Gagal",
  COMPLETED: "Selesai",
};

export const TRANSACTION_STYLES: Record<string, string> = {
  PAYMENT: "text-indigo-500 bg-indigo-50",
  DAILY_DISTRIBUTION: "text-orange-500 bg-orange-50",
  SETTLEMENT: "text-blue-500 bg-blue-50",
};

export const TRANSACTION_LABELS: Record<string, string> = {
  PAYMENT: "Transaksi Merchant",
  DAILY_DISTRIBUTION: "Distribusi ke Penerima",
  SETTLEMENT: "Settlement",
};

export const CATEGORY_ICONS: Record<string, string> = {
  PANGAN: "🍴",
  PENDIDIKAN: "🎓",
  KESEHATAN: "🏥",
  default: "📋",
};

export function getCategoryColor(kategori: string): string {
  const categoryMap: Record<string, string> = {
    PANGAN: "text-emerald-500 bg-emerald-50 border-emerald-100",
    PENDIDIKAN: "text-purple-500 bg-purple-50 border-purple-100",
    KESEHATAN: "text-rose-500 bg-rose-50 border-rose-100",
  };
  return categoryMap[kategori] || "text-slate-500 bg-slate-50 border-slate-100";
}

export function formatDateToString(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
