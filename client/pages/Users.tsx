import * as React from "react";
import { DashboardLayout } from "@/components/Layout";
import { 
  Plus, 
  RotateCcw, 
  Download, 
  Eye, 
  Trash2, 
  Edit3,
  Users as UsersIcon,
  ShieldCheck,
  HeartHandshake,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Pengguna",
    value: "24",
    icon: UsersIcon,
    color: "bg-blue-50 text-[#1E6CF6]",
  },
  {
    title: "Administrator",
    value: "8",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    title: "Donor",
    value: "12",
    icon: HeartHandshake,
    color: "bg-amber-50 text-amber-500",
  },
  {
    title: "Auditor",
    value: "4",
    icon: Search,
    color: "bg-purple-50 text-purple-500",
  }
];

const userData = [
  {
    id: "USR001",
    name: "Ahmad Rizki",
    email: "ahmad.rizki@danatepat.id",
    role: "Administrator",
    roleColor: "bg-blue-50 text-blue-600 border-blue-100",
    status: "Aktif",
    statusColor: "bg-emerald-500",
    lastLogin: "2 jam lalu",
    avatar: "https://i.pravatar.cc/150?u=ahmad"
  },
  {
    id: "USR002",
    name: "Sari Dewi",
    email: "sari.dewi@yayasan.org",
    role: "Donor",
    roleColor: "bg-amber-50 text-amber-600 border-amber-100",
    status: "Aktif",
    statusColor: "bg-emerald-500",
    lastLogin: "1 hari lalu",
    avatar: "https://i.pravatar.cc/150?u=sari"
  },
  {
    id: "USR003",
    name: "Budi Santoso",
    email: "budi.santoso@audit.co.id",
    role: "Auditor",
    roleColor: "bg-purple-50 text-purple-600 border-purple-100",
    status: "Pending",
    statusColor: "bg-amber-500",
    lastLogin: "Belum pernah",
    avatar: "https://i.pravatar.cc/150?u=budi"
  }
];

export default function Users() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Pengguna</h1>
            <p className="text-slate-500 text-sm font-medium">Kelola akses pengguna dan hak akses role dalam sistem</p>
          </div>
          <Button className="bg-[#1E6CF6] hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-blue-500/20">
            <Plus className="w-5 h-5 mr-2" />
            Tambah Pengguna Baru
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
              </div>
              <div className={cn("p-3 rounded-2xl shadow-sm transition-transform group-hover:scale-110", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 flex-1 flex-wrap">
            <Select defaultValue="all">
              <SelectTrigger className="h-10 w-44 rounded-xl bg-slate-50 border-transparent focus:ring-0">
                <SelectValue placeholder="Semua Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="donor">Donor</SelectItem>
                <SelectItem value="auditor">Auditor</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="h-10 w-44 rounded-xl bg-slate-50 border-transparent focus:ring-0">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="nonaktif">Non-aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-slate-500 font-bold text-xs h-10 px-4 rounded-xl hover:bg-slate-50 gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset Filter
            </Button>
            <Button variant="outline" className="text-slate-500 font-bold text-xs h-10 px-4 rounded-xl hover:bg-slate-50 border-slate-200 gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Terakhir Login</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userData.map((user, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <Badge variant="outline" className={cn("px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border", user.roleColor)}>
                          {user.role}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600 text-center">{user.email}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", user.statusColor)} />
                        <span className="text-xs font-bold text-slate-700">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-600 text-center">{user.lastLogin}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-[#1E6CF6] hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                          <Trash2 className="w-4 h-4" />
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
              Menampilkan 1 sampai 10 dari 24 pengguna
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-400 hover:bg-slate-50">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                <Button size="sm" className="h-9 w-9 p-0 bg-[#1E6CF6] text-white font-bold rounded-lg shadow-md shadow-blue-500/20">1</Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-400 font-bold hover:bg-slate-50">2</Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-400 font-bold hover:bg-slate-50">3</Button>
              </div>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-400 hover:bg-slate-50">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
