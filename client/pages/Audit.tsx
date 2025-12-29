import * as React from "react";
import { DashboardLayout } from "@/components/Layout";
import {
  Download,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  ExternalLink,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const transactions = [
  {
    hash: "0x1a2b3c4d...",
    block: "#12345",
    program: "Bantuan Pangan",
    programCode: "BP-2024-001",
    jumlah: "500,000 JAGD",
    jumlahRp: "≈ Rp 500,000",
    merchant: "Warung Sari Rasa",
    merchantId: "QR00D1234",
    waktu: "2024-01-15",
    waktuTime: "14:30:22",
    status: "Verified",
    statusColor: "text-emerald-500 bg-emerald-50",
    statusIcon: CheckCircle2,
  },
  {
    hash: "0x5e6f7g8h...",
    block: "#12344",
    program: "Bantuan Pendidikan",
    programCode: "BP-2024-002",
    jumlah: "750,000 JAGD",
    jumlahRp: "≈ Rp 750,000",
    merchant: "Toko Buku Cerdas",
    merchantId: "QR005678",
    waktu: "2024-01-15",
    waktuTime: "13:45:10",
    status: "Pending",
    statusColor: "text-amber-500 bg-amber-50",
    statusIcon: Clock,
  },
  {
    hash: "0x9i0j1k2l...",
    block: "#12343",
    program: "Bantuan Kesehatan",
    programCode: "BK-2024-001",
    jumlah: "300,000 JAGD",
    jumlahRp: "≈ Rp 300,000",
    merchant: "Apotek Sehat",
    merchantId: "QR009876",
    waktu: "2024-01-15",
    waktuTime: "12:15:33",
    status: "Verified",
    statusColor: "text-emerald-500 bg-emerald-50",
    statusIcon: CheckCircle2,
  },
];

export default function Audit() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Audit & Blockchain Explorer
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Verifikasi dan audit semua transaksi dalam jaringan blockchain
            </p>
          </div>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-teal-500/20">
            <Download className="w-5 h-5 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Blockchain Network Status */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-3xl border border-teal-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                Blockchain Network Status
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Semua transaksi diverifikasi oleh jaringan Hyperledger Fabric.
                Status: <span className="font-bold text-teal-600">Online</span>
              </p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hash Transaksi
              </label>
              <Input
                type="text"
                placeholder="0x1a2b3c..."
                className="h-11 rounded-xl bg-slate-50 border-transparent focus:ring-0 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Program
              </label>
              <Select defaultValue="all">
                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-transparent focus:ring-0">
                  <SelectValue placeholder="Semua Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Program</SelectItem>
                  <SelectItem value="pangan">Bantuan Pangan</SelectItem>
                  <SelectItem value="kesehatan">Bantuan Kesehatan</SelectItem>
                  <SelectItem value="pendidikan">Bantuan Pendidikan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tanggal Mulai
              </label>
              <Input
                type="date"
                className="h-11 rounded-xl bg-slate-50 border-transparent focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tanggal Akhir
              </label>
              <Input
                type="date"
                className="h-11 rounded-xl bg-slate-50 border-transparent focus:ring-0"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-[#1E6CF6] hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-blue-500/20">
              <Filter className="w-4 h-4 mr-2" />
              Terapkan Filter
            </Button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">
              Riwayat Transaksi Blockchain
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Hash Transaksi
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Program
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Jumlah
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Merchant
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Waktu
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-mono font-bold text-slate-900">
                          {tx.hash}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 leading-tight">
                          Block {tx.block}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {tx.program}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400">
                          {tx.programCode}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {tx.jumlah}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400">
                          {tx.jumlahRp}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {tx.merchant}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400">
                          ID: {tx.merchantId}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {tx.waktu}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400">
                          {tx.waktuTime}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <tx.statusIcon className="w-4 h-4 text-current" />
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            tx.statusColor,
                          )}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 text-[#1E6CF6] hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"
                          title="View on Blockchain"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
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
              Menampilkan 1-10 dari 1,247 transaksi
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-1 px-3"
              >
                Previous
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
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
