import { DashboardLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Plus, Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

const mockBeneficiaries = [
  {
    id: 1,
    name: "Siti Aminah",
    nik: "3201234567890123",
    program: "Bantuan Pangan",
    email: "siti@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
  },
  {
    id: 2,
    name: "Budi Santoso",
    nik: "3201234567890124",
    program: "Bantuan Pendidikan",
    email: "budi@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
  },
  {
    id: 3,
    name: "Lina Pratiwi",
    nik: "3201234567890125",
    program: "Bantuan Kesehatan",
    email: "lina@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lina",
  },
  {
    id: 4,
    name: "Andi Kurniawan",
    nik: "3201234567890126",
    program: "Bantuan Pangan",
    email: "Andi@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi",
  },
  {
    id: 5,
    name: "Rina Sari",
    nik: "3201234567890127",
    program: "Bantuan Pendidikan",
    email: "rina@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina",
  },
];

export default function ProgramBeneficiary() {
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

        {/* Content */}
        <div className="space-y-6">
          {/* Header with Actions */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Penerima Dana</h2>
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
          <div className="overflow-x-auto border border-slate-200 rounded-lg overflow-hidden bg-white">
            <table className="w-full min-w-max">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <Checkbox />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    NIK
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockBeneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Checkbox />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={beneficiary.avatar} />
                          <AvatarFallback>
                            {beneficiary.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-slate-900">
                          {beneficiary.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {beneficiary.nik}
                    </td>
                    <td className="px-6 py-4 text-slate-900">
                      {beneficiary.program}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {beneficiary.email}
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
                ))}
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
      </div>
    </DashboardLayout>
  );
}
