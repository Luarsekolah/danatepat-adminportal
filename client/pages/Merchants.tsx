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
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Merchant",
    value: "1,247",
    change: "+12% dari bulan lalu",
    icon: Store,
    color: "bg-[#1E6CF6]",
  },
  {
    title: "Merchant Aktif",
    value: "1,089",
    change: "87.3% dari total merchant",
    icon: CheckCircle2,
    color: "bg-emerald-500",
  },
  {
    title: "Menunggu Verifikasi",
    value: "23",
    change: "Perlu review admin",
    icon: Clock,
    color: "bg-amber-500",
  },
  {
    title: "Transaksi Hari Ini",
    value: "4,562",
    change: "+8.2% dari kemarin",
    icon: CreditCard,
    color: "bg-purple-500",
  },
];

const merchants = [
  {
    id: "1",
    nama: "Warung Makan Sederhana",
    alamat: "Jl. Merdeka No. 123",
    idQris: "QR001234567",
    kategori: "Pangan",
    kategoriColor: "text-emerald-500 bg-emerald-50 border-emerald-100",
    wilayah: "Jakarta Pusat",
    status: "Aktif",
    statusColor: "bg-emerald-500",
    transaksi: "1,234",
    icon: "🍴",
  },
  {
    id: "2",
    nama: "Toko Buku Pendidikan",
    alamat: "Jl. Pendidikan No. 45",
    idQris: "QR001234568",
    kategori: "Pendidikan",
    kategoriColor: "text-purple-500 bg-purple-50 border-purple-100",
    wilayah: "Bandung",
    status: "Verifikasi",
    statusColor: "bg-amber-500",
    transaksi: "567",
    icon: "📚",
  },
  {
    id: "3",
    nama: "Apotek Sehat Bersama",
    alamat: "Jl. Kesehatan No. 78",
    idQris: "QR001234569",
    kategori: "Kesehatan",
    kategoriColor: "text-rose-500 bg-rose-50 border-rose-100",
    wilayah: "Surabaya",
    status: "Aktif",
    statusColor: "bg-emerald-500",
    transaksi: "892",
    icon: "💊",
  },
];

export default function Merchants() {
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
          <Button className="bg-[#1E6CF6] hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-blue-500/20">
            <Plus className="w-5 h-5 mr-2" />
            Tambah Merchant
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
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
                    {stat.value}
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
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {stat.change.includes("+") ? (
                  <span className="text-emerald-500">
                    {stat.change.split(" ")[0]}
                  </span>
                ) : stat.change.includes("%") ? (
                  <span className="text-blue-500">
                    {stat.change.split(" ")[0]}
                  </span>
                ) : (
                  <span className="text-amber-500">
                    {stat.change.split(" ").slice(0, 2).join(" ")}
                  </span>
                )}
                <span className="text-slate-400">
                  {stat.change
                    .split(" ")
                    .slice(stat.change.includes("Perlu") ? 2 : 1)
                    .join(" ")}
                </span>
              </p>
            </div>
          ))}
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
                  <SelectItem value="pangan">Pangan</SelectItem>
                  <SelectItem value="kesehatan">Kesehatan</SelectItem>
                  <SelectItem value="pendidikan">Pendidikan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Status:
              </span>
              <Select defaultValue="all">
                <SelectTrigger className="h-10 w-44 rounded-xl bg-slate-50 border-transparent focus:ring-0">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="verifikasi">Verifikasi</SelectItem>
                  <SelectItem value="nonaktif">Non-aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Wilayah:
              </span>
              <Select defaultValue="all">
                <SelectTrigger className="h-10 w-44 rounded-xl bg-slate-50 border-transparent focus:ring-0">
                  <SelectValue placeholder="Semua Wilayah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Wilayah</SelectItem>
                  <SelectItem value="jakarta">Jakarta Pusat</SelectItem>
                  <SelectItem value="bandung">Bandung</SelectItem>
                  <SelectItem value="surabaya">Surabaya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-slate-500 font-bold text-xs h-10 px-4 rounded-xl hover:bg-slate-50 gap-2"
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
            <table className="w-full text-left">
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
                {merchants.map((merchant, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-5 w-12 text-center">
                      <Checkbox className="rounded-md border-slate-300" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shadow-sm border border-slate-100">
                          {merchant.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {merchant.nama}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400 leading-tight">
                            {merchant.alamat}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-mono font-medium text-slate-600">
                      {merchant.idQris}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                          merchant.kategoriColor,
                        )}
                      >
                        {merchant.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                      {merchant.wilayah}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            merchant.statusColor,
                          )}
                        />
                        <span className="text-xs font-bold text-slate-700">
                          {merchant.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-900">
                      {merchant.transaksi}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 text-[#1E6CF6] hover:bg-blue-50 rounded-lg transition-all"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {merchant.status === "Verifikasi" ? (
                          <>
                            <button
                              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Menampilkan 1-10 dari 1,247 merchant
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-1 px-3"
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  className="h-9 w-9 p-0 bg-[#1E6CF6] text-white font-bold rounded-lg shadow-md shadow-blue-500/20"
                >
                  1
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-slate-400 font-bold hover:bg-slate-50"
                >
                  2
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-slate-400 font-bold hover:bg-slate-50"
                >
                  3
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-1 px-3"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
