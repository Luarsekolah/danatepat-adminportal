import { useState } from "react";
import { DashboardLayout } from "@/components/Layout";
import { Loader2 } from "lucide-react";
import { useGetPaymentHistory } from "@/services/queries/payment";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { DatePickerInput } from "@/components/ui/calendar";
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

const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCategoryColor = (kategori: string) => {
  const categoryMap: Record<string, string> = {
    PANGAN: "text-emerald-500 bg-emerald-50 border-emerald-100",
    PENDIDIKAN: "text-purple-500 bg-purple-50 border-purple-100",
    KESEHATAN: "text-rose-500 bg-rose-50 border-rose-100",
  };
  return categoryMap[kategori] || "text-slate-500 bg-slate-50 border-slate-100";
};

export default function Blockchain() {
  const today = getTodayDate();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(today));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(today));

  const formatDateToString = (date: Date | undefined): string | undefined => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const paymentHistoryQuery = useGetPaymentHistory({
    startDate: formatDateToString(startDate),
    endDate: formatDateToString(endDate),
  });
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

        {/* Filters */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tanggal Mulai
              </label>
              <DatePickerInput
                value={startDate}
                onChange={setStartDate}
                placeholder="Pilih tanggal mulai"
                displayFormat="dd MMMM yyyy"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tanggal Selesai
              </label>
              <DatePickerInput
                value={endDate}
                onChange={setEndDate}
                placeholder="Pilih tanggal selesai"
                displayFormat="dd MMMM yyyy"
              />
            </div>
          </div>
        </div>
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
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Hash
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
                            <p
                              className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                getCategoryColor(item.program.kategori),
                              )}
                            >
                              {item.program.kategori}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {formatCurrency(item.transaction.amount)}
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
                      <td className="px-6 py-5 text-sm font-mono text-slate-600">
                        {item.transaction.blockchainTxHash}
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
