import { DashboardLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  Trash2,
  Utensils,
  BookOpen,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router";

const mockMerchants = [
  {
    id: 1,
    name: "Warung Makan Sederhana",
    qrisId: "QR001234567",
    transactions: 1234,
    icon: Utensils,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    name: "Toko Buku Pendidikan",
    qrisId: "QR001234568",
    transactions: 567,
    icon: BookOpen,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 3,
    name: "Apotek Sehat Bersama",
    qrisId: "QR001234569",
    transactions: 892,
    icon: Heart,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];

export default function ProgramMerchant() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/dashboard/programs")}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-slate-600">Kembali</span>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="makan-siang" className="w-full">
          <TabsList className="bg-transparent border-b border-slate-200 rounded-none p-0 h-auto w-full justify-start">
            <TabsTrigger
              value="makan-siang"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-0 pb-3 mr-8"
            >
              Makan Siang
            </TabsTrigger>
            <TabsTrigger
              value="buku"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-0 pb-3 mr-8"
            >
              Buku
            </TabsTrigger>
            <TabsTrigger
              value="pendidikan"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-0 pb-3"
            >
              Pendidikan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="makan-siang" className="mt-6">
            <MerchantTable merchants={mockMerchants} />
          </TabsContent>

          <TabsContent value="buku" className="mt-6">
            <MerchantTable merchants={mockMerchants} />
          </TabsContent>

          <TabsContent value="pendidikan" className="mt-6">
            <MerchantTable merchants={mockMerchants} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function MerchantTable({ merchants }: { merchants: typeof mockMerchants }) {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daftar Merchant</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Data
          </Button>
          <Button className="gap-2 bg-[#1E6CF6] hover:bg-blue-700">
            <Upload className="h-4 w-4" />
            Unggah CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <Checkbox />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Merchant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                ID QRIS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Transaksi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Afiliasi Program
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {merchants.map((merchant) => {
              const Icon = merchant.icon;
              return (
                <tr key={merchant.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Checkbox />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${merchant.iconBg} flex items-center justify-center`}
                      >
                        <Icon className={`h-5 w-5 ${merchant.iconColor}`} />
                      </div>
                      <span className="font-medium text-slate-900">
                        {merchant.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {merchant.qrisId}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {merchant.transactions.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm">
                      Lihat Detail
                    </Button>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Menampilkan 1-10 dari 1,247 merchant
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1E6CF6] text-white hover:bg-blue-700 hover:text-white"
          >
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
