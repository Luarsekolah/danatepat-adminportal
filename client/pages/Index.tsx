import { DashboardLayout } from "@/components/Layout";
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  TrendingUp,
  Users,
  CreditCard,
  Wallet,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Total Transaksi",
    value: "2,847",
    change: "+12% dari bulan lalu",
    icon: CreditCard,
    color: "bg-[#1E6CF6]",
    trend: "up",
  },
  {
    title: "Dana Tersalurkan",
    value: "Rp 4.2M",
    change: "+8% dari bulan lalu",
    icon: Wallet,
    color: "bg-emerald-500",
    trend: "up",
  },
  {
    title: "Token Diterbitkan",
    value: "15,420",
    change: "+15% dari bulan lalu",
    icon: Layers,
    color: "bg-amber-500",
    trend: "up",
  },
  {
    title: "Merchant Aktif",
    value: "342",
    change: "+5% dari bulan lalu",
    icon: Users,
    color: "bg-purple-500",
    trend: "up",
  },
];

const transactionData = [
  { name: "Sen", value: 120 },
  { name: "Sel", value: 145 },
  { name: "Rab", value: 180 },
  { name: "Kam", value: 165 },
  { name: "Jum", value: 200 },
  { name: "Sab", value: 185 },
  { name: "Min", value: 160 },
];

const categoryData = [
  { name: "Pangan", value: 400, color: "#1E6CF6" },
  { name: "Kesehatan", value: 300, color: "#F59E0B" },
  { name: "Pendidikan", value: 300, color: "#10B981" },
];

const recentActivities = [
  {
    waktu: "2 menit lalu",
    jenis: "Token Transfer",
    status: "Berhasil",
    hash: "0x7f9a...b2c8",
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    waktu: "5 menit lalu",
    jenis: "Merchant Verification",
    status: "Pending",
    hash: "0x3e8d...f4a1",
    color: "text-amber-500 bg-amber-50",
  },
  {
    waktu: "12 menit lalu",
    jenis: "Program Creation",
    status: "Berhasil",
    hash: "0x9c2b...e7d3",
    color: "text-emerald-500 bg-emerald-50",
  },
];

export default function Index() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Pantau aktivitas platform bantuan sosial secara real-time
          </p>
        </div>

        {/* Alert Banner */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-amber-100/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-md shadow-amber-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Perhatian
              </p>
              <p className="text-sm font-semibold text-amber-700">
                2 Settlement menunggu verifikasi
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
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
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.change.split(" ")[0]}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {stat.change.split(" ").slice(1).join(" ")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Daily Activity Chart */}
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-extrabold text-slate-900">
                Aktivitas Transaksi Harian
              </h3>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactionData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1E6CF6"
                    strokeWidth={4}
                    dot={{
                      fill: "#1E6CF6",
                      strokeWidth: 2,
                      r: 6,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-extrabold text-slate-900">
                Distribusi Token per Kategori
              </h3>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">
              Aktivitas Terbaru
            </h3>
            <Button
              variant="ghost"
              className="text-[#1E6CF6] font-bold text-sm hover:bg-blue-50"
            >
              Lihat Semua
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Waktu
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Jenis
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Hash Blockchain
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentActivities.map((activity, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                      {activity.waktu}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {activity.jenis}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          activity.color,
                        )}
                      >
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-400">
                      {activity.hash}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-[#1E6CF6] text-sm font-bold hover:underline">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
