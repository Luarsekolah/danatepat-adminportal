import { DashboardLayout } from "@/components/Layout";
import {
  Loader2,
  ArrowRightLeft,
  ShoppingCart,
  Banknote,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useGetPaymentHistory } from "@/services/queries/payment";
import {
  formatDate,
  cn,
  formatCurrencyToken,
  formatDateTime,
} from "@/lib/utils";
import { DatePickerInput } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "react-use";
import { useState } from "react";
import type {
  PaymentHistoryItem,
  PaymentHistoryQuery,
} from "@/services/schemas/payment";
import { parseAsIsoDate, parseAsInteger, useQueryState } from "nuqs";
import { ViewTransactionDialog } from "./components/ViewTransactionDialog";

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

const TRANSACTION_STYLES: Record<
  PaymentHistoryItem["transaction"]["transactionType"],
  string
> = {
  PAYMENT: "text-indigo-500 bg-indigo-50",
  DAILY_DISTRIBUTION: "text-orange-500 bg-orange-50",
  SETTLEMENT: "text-blue-500 bg-blue-50",
};

const TRANSACTION_LABELS: Record<
  PaymentHistoryItem["transaction"]["transactionType"],
  string
> = {
  PAYMENT: "Transaksi Merchant",
  DAILY_DISTRIBUTION: "Distribusi ke Penerima",
  SETTLEMENT: "Settlement",
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

const HashCopyButton = ({ hash }: { hash?: string }) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

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
          <span className="hidden group-hover:inline">
            {hash?.slice(0, 8)}...{hash?.slice(-4)}
          </span>
          <span className="group-hover:hidden">
            {hash?.slice(0, 8)}...{hash?.slice(-4)}
          </span>
        </>
      )}
    </button>
  );
};

const getCategoryColor = (kategori: string) => {
  const categoryMap: Record<string, string> = {
    PANGAN: "text-emerald-500 bg-emerald-50 border-emerald-100",
    PENDIDIKAN: "text-purple-500 bg-purple-50 border-purple-100",
    KESEHATAN: "text-rose-500 bg-rose-50 border-rose-100",
  };
  return categoryMap[kategori] || "text-slate-500 bg-slate-50 border-slate-100";
};

const formatDateToString = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Blockchain() {
  const [queryStartDate, setQueryStartDate] = useQueryState(
    "startDate",
    parseAsIsoDate.withDefault(new Date()),
  );
  const [queryEndDate, setQueryEndDate] = useQueryState(
    "endDate",
    parseAsIsoDate.withDefault(new Date()),
  );
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "distribution",
  });
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(0),
  );
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaymentHistoryItem | null>(null);

  const getFilters = (tab: string, page: number): PaymentHistoryQuery => {
    const baseFilters: PaymentHistoryQuery = {
      startDate: formatDateToString(queryStartDate),
      endDate: formatDateToString(queryEndDate),
      page,
    };

    if (tab === "payment") {
      return { ...baseFilters, transactionType: "PAYMENT" };
    }
    if (tab === "distribution") {
      return { ...baseFilters, transactionType: "DAILY_DISTRIBUTION" };
    }
    if (tab === "settlement") {
      return { ...baseFilters, transactionType: "SETTLEMENT" };
    }
    return baseFilters;
  };

  const paymentQuery = useGetPaymentHistory(getFilters("payment", currentPage));
  const distributionQuery = useGetPaymentHistory(
    getFilters("distribution", currentPage),
  );
  const settlementQuery = useGetPaymentHistory(
    getFilters("settlement", currentPage),
  );

  const getActiveQuery = () => {
    switch (activeTab) {
      case "distribution":
        return distributionQuery;
      case "settlement":
        return settlementQuery;
      default:
        return paymentQuery;
    }
  };

  const activeQuery = getActiveQuery();
  const transactions = activeQuery.data?.data?.content ?? [];
  const totalElements = activeQuery.data?.data?.totalElements ?? 0;
  const totalPages = activeQuery.data?.data?.totalPages ?? 0;

  const paymentTransactions = paymentQuery.data?.data?.content ?? [];
  const distributionTransactions = distributionQuery.data?.data?.content ?? [];
  const settlementTransactions = settlementQuery.data?.data?.content ?? [];

  // Reset to page 0 when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setCurrentPage(0);
  };

  // Pagination helpers
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 0; i < 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(0);
        pages.push("...");
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(0);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

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
                value={queryStartDate}
                onChange={setQueryStartDate}
                placeholder="Pilih tanggal mulai"
                displayFormat="dd MMMM yyyy"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tanggal Selesai
              </label>
              <DatePickerInput
                value={queryEndDate}
                onChange={setQueryEndDate}
                placeholder="Pilih tanggal selesai"
                displayFormat="dd MMMM yyyy"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="px-6 pt-3 pb-3 overflow-x-auto">
              <TabsList className="max-w-content justify-start rounded-lg bg-slate-50 p-1 h-auto gap-1">
                <TabsTrigger
                  value="distribution"
                  className="rounded-md px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Distribusi ke Penerima</span>
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="rounded-md px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Transaksi Merchant</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settlement"
                  className="rounded-md px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <Banknote className="w-4 h-4" />
                  <span>Settlement</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="payment" className="mt-0">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Transaksi ke Merchant
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Menampilkan {paymentTransactions.length} dari {totalElements}{" "}
                  transaksi
                </p>
              </div>
              <div className="overflow-x-auto">
                {paymentQuery.isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                  </div>
                ) : paymentTransactions.length === 0 ? (
                  <div className="flex items-center justify-center py-20 text-slate-400">
                    <p className="text-sm font-medium">
                      Tidak ada transaksi merchant
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
                            Merchant
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
                        {paymentTransactions.map((item: PaymentHistoryItem) => (
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
                                className={cn(
                                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block",
                                  getCategoryColor(item.program.kategori),
                                )}
                              >
                                {CATEGORY_ICONS[
                                  item.program.kategori?.toUpperCase() ||
                                    "default"
                                ] || CATEGORY_ICONS.default}{" "}
                                {item.program.kategori}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-sm text-slate-600">
                              {formatDateTime(item.transaction.createdAt)}
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-bold text-slate-900">
                                {item.merchant?.merchantName || "-"}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-sm font-bold text-slate-900">
                              {formatCurrencyToken(item.transaction.amount)}
                            </td>
                            <td className="px-6 py-5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                                onClick={() => {
                                  setSelectedTransaction(item);
                                  setTransactionDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                                Detail
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {activeTab === "payment" && (
                      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousPage}
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
                                variant={
                                  page === currentPage ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => handlePageClick(page)}
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
                          onClick={handleNextPage}
                          disabled={!canGoNext}
                          className="gap-2"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="distribution" className="mt-0">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Transaksi Distribusi ke Penerima
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Menampilkan {distributionTransactions.length} dari{" "}
                  {totalElements} transaksi
                </p>
              </div>
              <div className="overflow-x-auto">
                {distributionQuery.isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                  </div>
                ) : distributionTransactions.length === 0 ? (
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
                        {distributionTransactions.map(
                          (item: PaymentHistoryItem) => (
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
                                  className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block",
                                    getCategoryColor(item.program.kategori),
                                  )}
                                >
                                  {CATEGORY_ICONS[
                                    item.program.kategori?.toUpperCase() ||
                                      "default"
                                  ] || CATEGORY_ICONS.default}{" "}
                                  {item.program.kategori}
                                </p>
                              </td>
                              <td className="px-6 py-5 text-sm text-slate-600">
                                {formatDateTime(item.transaction.createdAt)}
                              </td>
                              <td className="px-6 py-5">
                                <span
                                  className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block",
                                    STATUS_STYLES[item.transaction.status] ||
                                      "text-slate-500 bg-slate-50",
                                  )}
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
                                  onClick={() => {
                                    setSelectedTransaction(item);
                                    setTransactionDialogOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  Detail
                                </Button>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                    {activeTab === "distribution" && (
                      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousPage}
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
                                variant={
                                  page === currentPage ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => handlePageClick(page)}
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
                          onClick={handleNextPage}
                          disabled={!canGoNext}
                          className="gap-2"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settlement" className="mt-0">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Transaksi Settlement ke Program
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Menampilkan {settlementTransactions.length} dari{" "}
                  {totalElements} transaksi
                </p>
              </div>
              <div className="overflow-x-auto">
                {settlementQuery.isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                  </div>
                ) : settlementTransactions.length === 0 ? (
                  <div className="flex items-center justify-center py-20 text-slate-400">
                    <p className="text-sm font-medium">Tidak ada Settlement</p>
                  </div>
                ) : (
                  <>
                    <table className="w-full min-w-max text-left">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Merchant
                          </th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Hash Settlement
                          </th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Tanggal
                          </th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Program
                          </th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Token
                          </th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Status
                          </th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {settlementTransactions.map(
                          (item: PaymentHistoryItem) => (
                            <tr
                              key={item.transaction.id}
                              className="hover:bg-slate-50/30 transition-colors"
                            >
                              <td className="px-6 py-5 flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
                                  🏪
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">
                                    {item.merchant?.merchantName || "-"}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <HashCopyButton
                                  hash={item.transaction.blockchainTxHash}
                                />
                              </td>
                              <td className="px-6 py-5 text-sm text-slate-600">
                                {formatDate(item.transaction.createdAt)}
                              </td>
                              <td className="px-6 py-5">
                                <p
                                  className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block",
                                    getCategoryColor(item.program.kategori),
                                  )}
                                >
                                  {CATEGORY_ICONS[
                                    item.program.kategori?.toUpperCase() ||
                                      "default"
                                  ] || CATEGORY_ICONS.default}{" "}
                                  {item.program.kategori}
                                </p>
                              </td>
                              <td className="px-6 py-5 text-sm font-bold text-slate-900">
                                {formatCurrencyToken(item.transaction.amount)}
                              </td>
                              <td className="px-6 py-5">
                                <span
                                  className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block",
                                    STATUS_STYLES[item.transaction.status] ||
                                      "text-slate-500 bg-slate-50",
                                  )}
                                >
                                  {STATUS_LABELS[item.transaction.status] ||
                                    item.transaction.status}
                                </span>
                              </td>
                              <td className="px-6 py-5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => {
                                    setSelectedTransaction(item);
                                    setTransactionDialogOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  Detail
                                </Button>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                    {activeTab === "settlement" && (
                      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousPage}
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
                                variant={
                                  page === currentPage ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => handlePageClick(page)}
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
                          onClick={handleNextPage}
                          disabled={!canGoNext}
                          className="gap-2"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* View Transaction Detail Dialog */}
      <ViewTransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        transaction={selectedTransaction}
      />
    </DashboardLayout>
  );
}
