import { Loader2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentHistoryItem } from "@/services/schemas/payment";
import {
  formatDateTime,
  formatCurrencyToken,
  CATEGORY_ICONS,
  getCategoryColor,
  STATUS_STYLES,
  STATUS_LABELS,
} from "@/lib/utils";
import { HashCopyButton } from "./HashCopyButton";

interface DistributionTransactionsTableProps {
  transactions: PaymentHistoryItem[];
  totalElements: number;
  currentPage: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageClick: (page: number) => void;
  getPageNumbers: () => (number | string)[];
  onViewDetail: (item: PaymentHistoryItem) => void;
}

export function DistributionTransactionsTable({
  transactions,
  totalElements,
  currentPage,
  canGoPrevious,
  canGoNext,
  onPreviousPage,
  onNextPage,
  onPageClick,
  getPageNumbers,
  onViewDetail,
}: DistributionTransactionsTableProps) {
  return (
    <>
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-extrabold text-slate-900">
          Transaksi Distribusi ke Penerima
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Menampilkan {transactions.length} dari {totalElements} transaksi
        </p>
      </div>
      <div className="overflow-x-auto">
        {transactions.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <p className="text-sm font-medium">
              Tidak ada distribusi ke penerima
            </p>
          </div>
        ) : (
          <>
            <table className="w-full min-w-max text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Penerima
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Hash Transaksi
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Program
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Token
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((item: PaymentHistoryItem) => (
                  <tr
                    key={item.transaction.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-5 flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={`https://avatar.vercel.sh/${item.user?.userName || "user"}`}
                          alt={item.user?.userName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {item.user?.userName || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <HashCopyButton
                        hash={item.transaction.blockchainTxHash}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <p
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${getCategoryColor(
                          item.program.kategori,
                        )}`}
                      >
                        {CATEGORY_ICONS[
                          item.program.kategori?.toUpperCase() || "default"
                        ] || CATEGORY_ICONS.default}{" "}
                        {item.program.kategori}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {formatDateTime(item.transaction.createdAt)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                          STATUS_STYLES[item.transaction.status] ||
                          "text-slate-500 bg-slate-50"
                        }`}
                      >
                        {STATUS_LABELS[item.transaction.status] ||
                          item.transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-900">
                      {formatCurrencyToken(item.transaction.amount)}
                    </td>
                    <td className="px-6 py-5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => onViewDetail(item)}
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onPreviousPage}
                disabled={!canGoPrevious}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) =>
                  typeof page === "number" ? (
                    <Button
                      key={idx}
                      variant={page === currentPage ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onPageClick(page)}
                      className="min-w-10"
                    >
                      {page + 1}
                    </Button>
                  ) : (
                    <span key={idx} className="px-2 text-slate-400">
                      {page}
                    </span>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={!canGoNext}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
