import * as React from "react";
import { DashboardLayout } from "@/components/Layout";
import {
  Plus,
  Search,
  RotateCcw,
  Download,
  Printer,
  Eye,
  Check,
  X,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Store,
  Clock,
  CreditCard,
  CheckCircle2,
  Trash2,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useListMerchant,
  useMerchantSummary,
  useGetKotaList,
} from "@/services/queries/merchant";
import type { ListMerchantQuery } from "@/services/schemas/merchant";
import type { MerchantData } from "@/types/base";
import { AddMerchantDialog } from "@/components/AddMerchantDialog";
import { ViewMerchantDialog } from "@/components/ViewMerchantDialog";

const statConfig = [
  {
    title: "Total Merchant",
    key: "totalMerchant",
    icon: Store,
    color: "bg-[#1E6CF6]",
  },
  {
    title: "Merchant Aktif",
    key: "totalMerchantAktif",
    icon: CheckCircle2,
    color: "bg-emerald-500",
  },
  {
    title: "Menunggu Verifikasi",
    key: "totalMerchantPending",
    icon: Clock,
    color: "bg-amber-500",
  },
];

const getCategoryColor = (kategori: string) => {
  const categoryMap: Record<string, string> = {
    PANGAN: "text-emerald-500 bg-emerald-50 border-emerald-100",
    PENDIDIKAN: "text-purple-500 bg-purple-50 border-purple-100",
    KESEHATAN: "text-rose-500 bg-rose-50 border-rose-100",
  };
  return categoryMap[kategori] || "text-slate-500 bg-slate-50 border-slate-100";
};

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    AKTIF: "bg-emerald-500",
    VERIFIKASI: "bg-amber-500",
    NONAKTIF: "bg-slate-300",
  };
  return statusMap[status] || "bg-slate-300";
};

const getCategoryLabel = (kategori: string) => {
  const categoryMap: Record<string, string> = {
    PANGAN: "Pangan",
    PENDIDIKAN: "Pendidikan",
    KESEHATAN: "Kesehatan",
  };
  return categoryMap[kategori] || kategori;
};

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    AKTIF: "Aktif",
    VERIFIKASI: "Verifikasi",
    NONAKTIF: "Non-aktif",
  };
  return statusMap[status] || status;
};

export default function Merchants() {
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedKota, setSelectedKota] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [selectedMerchant, setSelectedMerchant] =
    React.useState<MerchantData | null>(null);
  const itemsPerPage = 10;

  const filters: ListMerchantQuery = React.useMemo(
    () => ({
      page: currentPage,
      size: itemsPerPage,
      ...(selectedKota !== "all" && { kota: selectedKota }),
    }),
    [currentPage, selectedKota],
  );

  const summaryQuery = useMerchantSummary();
  const merchantsQuery = useListMerchant(filters);
  const kotaQuery = useGetKotaList();
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Daftar Merchant QRIS
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Kelola dan verifikasi merchant yang terdaftar dalam sistem
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-[#1E6CF6] hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Merchant
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statConfig.map((stat, idx) => {
            const value =
              summaryQuery.data?.data?.[
                stat.key as keyof typeof summaryQuery.data.data
              ] ?? 0;
            const displayValue =
              typeof value === "number" ? value.toLocaleString() : value;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900">
                      {summaryQuery.isLoading ? "-" : displayValue}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110",
                      stat.color,
                    )}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 flex-1 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Kategori:
              </span>
              <Select defaultValue="all">
                <SelectTrigger className="h-10 w-44 rounded-xl bg-slate-50 border-transparent focus:ring-0">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="PANGAN">Pangan</SelectItem>
                  <SelectItem value="PENDIDIKAN">Pendidikan</SelectItem>
                  <SelectItem value="KESEHATAN">Kesehatan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Status:
              </span>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-10 w-44 rounded-xl bg-slate-50 border-transparent focus:ring-0">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="AKTIF">Aktif</SelectItem>
                  <SelectItem value="VERIFIKASI">Verifikasi</SelectItem>
                  <SelectItem value="NONAKTIF">Non-aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Wilayah:
              </span>
              <Select value={selectedKota} onValueChange={setSelectedKota}>
                <SelectTrigger className="h-10 w-44 rounded-xl bg-slate-50 border-transparent focus:ring-0">
                  <SelectValue placeholder="Semua Wilayah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Wilayah</SelectItem>
                  {kotaQuery.data?.data?.map((kota) => (
                    <SelectItem key={kota.id} value={kota.kota}>
                      {kota.kota}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-slate-500 font-bold text-xs h-10 px-4 rounded-xl hover:bg-slate-50 gap-2"
            onClick={() => {
              setSelectedStatus("all");
              setSelectedKota("all");
              setCurrentPage(0);
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filter
          </Button>
        </div>

        {/* Merchant Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">
              Daftar Merchant
            </h3>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                <Printer className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 w-12 text-center">
                    <Checkbox className="rounded-md border-slate-300" />
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Merchant
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    ID QRIS
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Wilayah
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Transaksi
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {merchantsQuery.isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <p className="text-sm text-slate-500 font-medium">
                        Loading merchant data...
                      </p>
                    </td>
                  </tr>
                ) : merchantsQuery.error ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <p className="text-sm text-rose-500 font-medium">
                        Gagal memuat data merchant
                      </p>
                    </td>
                  </tr>
                ) : (merchantsQuery.data?.data?.content ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <p className="text-sm text-slate-500 font-medium">
                        Tidak ada data merchant
                      </p>
                    </td>
                  </tr>
                ) : (
                  (merchantsQuery.data?.data?.content ?? []).map((merchant) => (
                    <tr
                      key={merchant.userId}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-6 py-5 w-12 text-center">
                        <Checkbox className="rounded-md border-slate-300" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shadow-sm border border-slate-100">
                            🏪
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {merchant.businessName}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400 leading-tight">
                              {merchant.wilayahList?.[0]?.alamat || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-mono font-medium text-slate-600 max-w-[230px] truncate">
                        {merchant.qrisData || "-"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                            getCategoryColor(merchant.kategori),
                          )}
                        >
                          {getCategoryLabel(merchant.kategori)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                        {merchant.wilayahList?.map((w) => w.kota).join(", ") ||
                          "-"}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              getStatusColor(merchant.status),
                            )}
                          />
                          <span className="text-xs font-bold text-slate-700">
                            {getStatusLabel(merchant.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        -
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => {
                              setSelectedMerchant(merchant);
                              setViewDialogOpen(true);
                            }}
                            className="p-2 text-[#1E6CF6] hover:bg-blue-50 rounded-lg transition-all"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Menampilkan {currentPage * itemsPerPage + 1}-
              {Math.min(
                (currentPage + 1) * itemsPerPage,
                merchantsQuery.data?.data?.totalElements ?? 0,
              )}{" "}
              dari {merchantsQuery.data?.data?.totalElements ?? 0} merchant
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-1 px-3"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0 || merchantsQuery.isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({
                  length: Math.ceil(
                    (merchantsQuery.data?.data?.totalElements ?? 0) /
                      itemsPerPage,
                  ),
                })
                  .slice(0, 3)
                  .map((_, i) => (
                    <Button
                      key={i}
                      size="sm"
                      className={cn(
                        "h-9 w-9 p-0 font-bold rounded-lg",
                        currentPage === i
                          ? "bg-[#1E6CF6] text-white shadow-md shadow-blue-500/20"
                          : "text-slate-400 hover:bg-slate-50",
                      )}
                      onClick={() => setCurrentPage(i)}
                      variant={currentPage === i ? "default" : "ghost"}
                    >
                      {i + 1}
                    </Button>
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-1 px-3"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={
                  currentPage >=
                    Math.ceil(
                      (merchantsQuery.data?.data?.totalElements ?? 0) /
                        itemsPerPage,
                    ) -
                      1 || merchantsQuery.isLoading
                }
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Merchant Dialog */}
      <AddMerchantDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setCurrentPage(0);
          merchantsQuery.refetch?.();
        }}
      />

      {/* View Merchant Dialog */}
      <ViewMerchantDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        merchant={selectedMerchant}
      />
    </DashboardLayout>
  );
}
