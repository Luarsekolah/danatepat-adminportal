import { DashboardLayout } from "@/components/Layout";
import { Loader2, ArrowRightLeft, ShoppingCart, Banknote } from "lucide-react";
import { useGetPaymentHistory } from "@/services/queries/payment";
import { parseAsIsoDate, parseAsInteger, useQueryState } from "nuqs";
import { ViewTransactionDialog } from "./components/ViewTransactionDialog";
import { Filters } from "./components/Filters";
import { PaymentTransactionsTable } from "./components/PaymentTransactionsTable";
import { DistributionTransactionsTable } from "./components/DistributionTransactionsTable";
import { SettlementTransactionsTable } from "./components/SettlementTransactionsTable";
import type {
  PaymentHistoryItem,
  PaymentHistoryQuery,
} from "@/services/schemas/payment";
import { DatePickerInput } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatDateToString } from "@/lib/utils";

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
  const [blockchainTxHashFilter, setBlockchainTxHashFilter] = useQueryState(
    "txHash",
    { defaultValue: "" },
  );
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaymentHistoryItem | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const getFilters = (tab: string, page: number): PaymentHistoryQuery => {
    const baseFilters: PaymentHistoryQuery = {
      startDate: formatDateToString(queryStartDate),
      endDate: formatDateToString(queryEndDate),
      page,
      ...(blockchainTxHashFilter && {
        blockchainTxHash: blockchainTxHashFilter,
      }),
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
  const totalElements = activeQuery.data?.data?.totalElements ?? 0;
  const totalPages = activeQuery.data?.data?.totalPages ?? 0;

  const paymentTransactions = paymentQuery.data?.data?.content ?? [];
  const distributionTransactions = distributionQuery.data?.data?.content ?? [];
  const settlementTransactions = settlementQuery.data?.data?.content ?? [];

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setCurrentPage(0);
  };

  const handleApplySearch = () => {
    setBlockchainTxHashFilter(searchInput);
    setCurrentPage(0);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApplySearch();
    }
  };

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

  const handleViewDetail = (item: PaymentHistoryItem) => {
    setSelectedTransaction(item);
    setTransactionDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Daftar Transaksi Blockchain
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Lihat riwayat transaksi Blockchain
          </p>
        </div>

        <Filters
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearchKeyDown={handleSearchKeyDown}
          onApplySearch={handleApplySearch}
          queryStartDate={queryStartDate}
          onStartDateChange={setQueryStartDate}
          queryEndDate={queryEndDate}
          onEndDateChange={setQueryEndDate}
        />

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
              {paymentQuery.isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                </div>
              ) : (
                <PaymentTransactionsTable
                  transactions={paymentTransactions}
                  totalElements={totalElements}
                  currentPage={currentPage}
                  canGoPrevious={canGoPrevious}
                  canGoNext={canGoNext}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                  onPageClick={handlePageClick}
                  getPageNumbers={getPageNumbers}
                  onViewDetail={handleViewDetail}
                />
              )}
            </TabsContent>

            <TabsContent value="distribution" className="mt-0">
              {distributionQuery.isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                </div>
              ) : (
                <DistributionTransactionsTable
                  transactions={distributionTransactions}
                  totalElements={totalElements}
                  currentPage={currentPage}
                  canGoPrevious={canGoPrevious}
                  canGoNext={canGoNext}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                  onPageClick={handlePageClick}
                  getPageNumbers={getPageNumbers}
                  onViewDetail={handleViewDetail}
                />
              )}
            </TabsContent>

            <TabsContent value="settlement" className="mt-0">
              {settlementQuery.isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                </div>
              ) : (
                <SettlementTransactionsTable
                  transactions={settlementTransactions}
                  totalElements={totalElements}
                  currentPage={currentPage}
                  canGoPrevious={canGoPrevious}
                  canGoNext={canGoNext}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                  onPageClick={handlePageClick}
                  getPageNumbers={getPageNumbers}
                  onViewDetail={handleViewDetail}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ViewTransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        transaction={selectedTransaction}
      />
    </DashboardLayout>
  );
}
