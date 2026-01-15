import { DashboardLayout } from "@/components/Layout";
import { Loader2, LayoutGrid } from "lucide-react";
import { useGetPaymentHistory } from "@/services/queries/payment";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { PaymentHistoryItem } from "@/services/schemas/payment";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "text-amber-500 bg-amber-50",
  SUCCESS: "text-emerald-500 bg-emerald-50",
  FAILED: "text-red-500 bg-red-50",
  COMPLETED: "text-emerald-500 bg-emerald-50",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  SUCCESS: "Berhasil",
  FAILED: "Gagal",
  COMPLETED: "Selesai",
};

const CATEGORY_ICONS: Record<string, string> = {
  PANGAN: "🍴",
  PENDIDIKAN: "🎓",
  KESEHATAN: "🏥",
  default: "📋",
};

export default function Blockchain() {
  const paymentHistoryQuery = useGetPaymentHistory();
  const paymentHistory = paymentHistoryQuery.data?.data?.content ?? [];
  const totalElements = paymentHistoryQuery.data?.data?.totalElements ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Daftar Transaksi Blockchain
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Lihat riwayat transaksi Blockchain
          </p>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900">
              Riwayat Transaksi
            </h3>
          </div>
          <div className="overflow-x-auto">
            {paymentHistoryQuery.isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
              </div>
            ) : paymentHistory.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-slate-400">
                <p className="text-sm font-medium">
                  Tidak ada data transaksi blockchain
                </p>
              </div>
            ) : (
              <table className="w-full min-w-max text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Merchant
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Program
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Nominal
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Tipe Transaksi
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paymentHistory.map((item: PaymentHistoryItem) => (
                    <tr
                      key={item.transaction.id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-900">
                          {item.merchant.merchantName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          ID: {item.merchant.merchantId}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shadow-sm border border-slate-100">
                            {CATEGORY_ICONS[
                              item.program.kategori?.toUpperCase() || "default"
                            ] || CATEGORY_ICONS.default}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {item.program.programId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {formatCurrency(item.transaction.amount)}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-700">
                          {item.transaction.transactionType}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            STATUS_STYLES[item.transaction.status] ||
                              "text-slate-500 bg-slate-50",
                          )}
                        >
                          {STATUS_LABELS[item.transaction.status] ||
                            item.transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-700">
                        {formatDate(item.transaction.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Load More Section */}
          <div className="p-6 border-t border-slate-100 flex items-center justify-end">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Total {totalElements} transaksi
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
