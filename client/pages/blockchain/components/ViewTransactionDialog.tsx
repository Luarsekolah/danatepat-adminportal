import * as React from "react";
import { Loader2, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetTransactionDetail } from "@/services/queries/payment";
import { useCopyToClipboard } from "react-use";
import type { PaymentHistoryItem } from "@/types/payment";
import { formatCurrencyToken } from "@/lib/utils";

interface ViewTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: PaymentHistoryItem | null;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  SUCCESS: "Berhasil",
  FAILED: "Gagal",
  COMPLETED: "Selesai",
};

const TRANSACTION_LABELS: Record<string, string> = {
  PAYMENT: "Transaksi Merchant",
  DAILY_DISTRIBUTION: "Distribusi ke Penerima",
  SETTLEMENT: "Settlement",
};

const HashCopyButton = ({ hash }: { hash?: string }) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    if (hash) {
      copyToClipboard(hash);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-sm font-mono text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1 group"
      title={hash}
    >
      {isCopied ? (
        <>
          <Check className="w-3 h-3" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="inline">{hash}</span>
        </>
      )}
    </button>
  );
};

export function ViewTransactionDialog({
  open,
  onOpenChange,
  transaction,
}: ViewTransactionDialogProps) {
  // Fetch detailed transaction information using blockchain tx hash
  const detailQuery = useGetTransactionDetail(
    transaction?.transaction?.blockchainTxHash || "",
    {
      enabled: open && !!transaction?.transaction?.blockchainTxHash,
    },
  );

  if (!transaction) return null;

  const detail = detailQuery.data?.data;
  const isLoading = detailQuery.isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
          <DialogDescription>
            Informasi lengkap transaksi blockchain
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : transaction ? (
          <div className="space-y-6">
            {/* Transaction Information */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tipe Transaksi
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {TRANSACTION_LABELS[
                    transaction.transaction
                      .transactionType as keyof typeof TRANSACTION_LABELS
                  ] || transaction.transaction.transactionType}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {STATUS_LABELS[transaction.transaction.status] ||
                    transaction.transaction.status}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Token (PRANA)
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {formatCurrencyToken(transaction.transaction.amount)}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tanggal
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {transaction.transaction.createdAt
                    ? new Date(
                        transaction.transaction.createdAt,
                      ).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
            </div>

            {/* Blockchain Information */}
            <div className="border-t border-slate-200 pt-4 space-y-4">
              <h3 className="font-semibold text-slate-900">
                Informasi Blockchain
              </h3>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Hash Transaksi
                </p>
                <div className="mt-1">
                  <HashCopyButton
                    hash={transaction.transaction.blockchainTxHash}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Asal
                </p>
                <div className="mt-1">
                  {detail?.from ? <HashCopyButton hash={detail?.from} /> : "-"}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tujuan
                </p>
                <div className="mt-1">
                  {detail?.to ? <HashCopyButton hash={detail?.to} /> : "-"}
                </div>
              </div>
            </div>

            {/* Program Information */}
            {transaction.program && (
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <h3 className="font-semibold text-slate-900">
                  Informasi Program
                </h3>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Program ID
                  </p>
                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {transaction.program.programId}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Kategori
                  </p>
                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {transaction.program.kategori}
                  </p>
                </div>
              </div>
            )}

            {/* Merchant Information */}
            {transaction.merchant &&
              transaction.transaction.transactionType === "PAYMENT" && (
                <div className="border-t border-slate-200 pt-4 space-y-4">
                  <h3 className="font-semibold text-slate-900">
                    Informasi Merchant
                  </h3>

                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Merchant
                    </p>
                    <p className="text-sm font-medium text-slate-900 mt-1">
                      {transaction.merchant.merchantName || "—"}
                    </p>
                  </div>
                </div>
              )}

            {/* User Information */}
            {transaction.user && (
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <h3 className="font-semibold text-slate-900">
                  Informasi Pengguna
                </h3>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nama Pengguna
                  </p>
                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {transaction.user.userName || "—"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">
              Gagal memuat data transaksi
            </p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
