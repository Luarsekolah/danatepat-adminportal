import { DashboardLayout } from "@/components/Layout";
import { 
  Plus, 
  Filter, 
  LayoutGrid, 
  CheckCircle2, 
  Coins, 
  Users, 
  Eye, 
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const stats = [
  {
    title: "Total Program",
    value: "24",
    icon: Briefcase,
    color: "bg-[#1E6CF6]",
  },
  {
    title: "Program Aktif",
    value: "18",
    icon: CheckCircle2,
    color: "bg-emerald-500",
  },
  {
    title: "Total Dana (IDR)",
    value: "2.4M",
    icon: Coins,
    color: "bg-amber-500",
  },
  {
    title: "Penerima Manfaat",
    value: "1,247",
    icon: Users,
    color: "bg-purple-500",
  }
];

const programs = [
  {
    nama: "Bantuan Pangan Jakarta Timur",
    kategori: "Pangan",
    donor: "Yayasan Peduli Jakarta",
    target: "Rp 500,000,000",
    realisasi: 75,
    status: "Aktif",
    statusColor: "text-emerald-500 bg-emerald-50",
    icon: "🍴"
  },
  {
    nama: "Beasiswa Anak Yatim",
    kategori: "Pendidikan",
    donor: "PT Maju Bersama Surabaya",
    target: "Rp 300,000,000",
    realisasi: 60,
    status: "Aktif",
    statusColor: "text-emerald-500 bg-emerald-50",
    icon: "🎓"
  },
  {
    nama: "Bantuan Kesehatan Lansia",
    kategori: "Kesehatan",
    donor: "Rumah Sakit Harapan Bandung",
    target: "Rp 750,000,000",
    realisasi: 30,
    status: "Baru",
    statusColor: "text-amber-500 bg-amber-50",
    icon: "🏥"
  }
];

export default function Programs() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Program Bantuan</h1>
            <p className="text-slate-500 text-sm font-medium">Kelola dan pantau semua program bantuan sosial</p>
          </div>
          <Button className="bg-[#1E6CF6] hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-blue-500/20">
            <Plus className="w-5 h-5 mr-2" />
            Tambah Program
          </Button>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
          <div className="w-full md:w-64">
            <Select defaultValue="all">
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-transparent focus:ring-0">
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
          <div className="w-full md:w-64">
            <Select defaultValue="all">
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-transparent focus:ring-0">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="baru">Baru</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11 px-6 rounded-xl ml-auto md:ml-0">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Programs Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Program Bantuan</h3>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Program</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Donor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Dana</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Realisasi</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programs.map((program, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shadow-sm border border-slate-100">
                          {program.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{program.nama}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori: {program.kategori}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-700">{program.donor.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="text-xs text-slate-400 font-medium">{program.donor.split(' ').slice(2).join(' ')}</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-900">{program.target}</td>
                    <td className="px-6 py-5">
                      <div className="space-y-2 w-32">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400">{program.realisasi}%</span>
                        </div>
                        <Progress value={program.realisasi} className="h-1.5 bg-slate-100 overflow-hidden rounded-full">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${program.realisasi}%` }} 
                          />
                        </Progress>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", program.statusColor)}>
                        {program.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button className="p-2 text-slate-400 hover:text-[#1E6CF6] hover:bg-blue-50 rounded-lg transition-all">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all">
                          <Edit className="w-5 h-5" />
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
              Menampilkan 1-3 dari 24 program
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 rounded-lg border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <Button size="sm" className="h-9 w-9 p-0 bg-[#1E6CF6] text-white font-bold rounded-lg shadow-md shadow-blue-500/20">1</Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-400 font-bold hover:bg-slate-50">2</Button>
              </div>
              <Button variant="outline" size="sm" className="h-9 rounded-lg border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
