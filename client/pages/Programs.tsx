import * as React from "react";
import { useState } from "react";
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
  Briefcase,
  Loader2,
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
import {
  useListProgram,
  useProgramDashboard,
} from "@/services/queries/program";
import { AddProgramDialog } from "@/components/AddProgramDialog";
import { EditProgramDialog } from "@/components/EditProgramDialog";
import { ViewProgramDialog } from "@/components/ViewProgramDialog";
import { toast } from "sonner";
import type { ProgramData } from "@/types/base";

const CATEGORY_ICONS: Record<string, string> = {
  PANGAN: "🍴",
  PENDIDIKAN: "🎓",
  KESEHATAN: "🏥",
  default: "📋",
};

export default function Programs() {
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "DRAFT" | "ACTIVE"
  >("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramData | null>(
    null,
  );

  // Fetch programs using infinite query
  const programsQuery = useListProgram(
    {
      status:
        selectedStatus !== "all"
          ? (selectedStatus as "DRAFT" | "ACTIVE")
          : undefined,
    },
    {
      enabled: true,
    },
  );
  // Get programs array from response
  const programs = programsQuery.data?.data ?? [];
  const totalElements = programs.length;

  // Fetch dashboard statistics
  const dashboardQuery = useProgramDashboard({
    enabled: true,
  });

  // Handle errors
  React.useEffect(() => {
    if (programsQuery.error) {
      toast.error("Gagal memuat data program");
    }
  }, [programsQuery.error]);

  React.useEffect(() => {
    if (dashboardQuery.error) {
      toast.error("Gagal memuat statistik program");
    }
  }, [dashboardQuery.error]);

  // Build stats from dashboard data
  const stats = [
    {
      title: "Total Program",
      value: dashboardQuery.data?.data?.totalPrograms ?? "0",
      icon: Briefcase,
      color: "bg-[#1E6CF6]",
    },
    {
      title: "Program Aktif",
      value: dashboardQuery.data?.data?.totalActivePrograms ?? "0",
      icon: CheckCircle2,
      color: "bg-emerald-500",
    },
    {
      title: "Total Dana (IDR)",
      value: formatCurrency(
        dashboardQuery.data?.data?.totalDailyAllocationAmount ?? 0,
      ),
      icon: Coins,
      color: "bg-amber-500",
    },
    {
      title: "Penerima Manfaat",
      value: "—",
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Daftar Program Bantuan
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Kelola dan pantau semua program bantuan sosial
            </p>
          </div>
          <Button
            className="bg-[#1E6CF6] hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-blue-500/20"
            onClick={() => setDialogOpen(true)}
          >
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
                <SelectItem value="PANGAN">Pangan</SelectItem>
                <SelectItem value="KESEHATAN">Kesehatan</SelectItem>
                <SelectItem value="PENDIDIKAN">Pendidikan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-64">
            <Select
              value={selectedStatus}
              onValueChange={(value: any) => {
                setSelectedStatus(value);
              }}
            >
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-transparent focus:ring-0">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
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
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-3 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110",
                    stat.color,
                  )}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-3xl font-extrabold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Programs Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">
              Program Bantuan
            </h3>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            {programsQuery.isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
              </div>
            ) : programs.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-slate-400">
                <p className="text-sm font-medium">Tidak ada data program</p>
              </div>
            ) : (
              <table className="w-full min-w-max text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Nama Program
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Token Name
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Dana Harian
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Periode
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
                  {programs.map((program) => (
                    <tr
                      key={program.id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shadow-sm border border-slate-100">
                            {CATEGORY_ICONS[
                              program.currencyTokenName?.toUpperCase() ||
                                "default"
                            ] || CATEGORY_ICONS.default}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {program.name}
                            </p>
                            {program.description && (
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate w-48">
                                {program.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-700">
                          {program.currencyTokenName}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {formatCurrency(program.dailyAllocationAmount)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400">
                            Mulai: {formatDate(program.startDate)}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400">
                            Akhir: {formatDate(program.endDate)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            program.status === "ACTIVE"
                              ? "text-emerald-500 bg-emerald-50"
                              : "text-amber-500 bg-amber-50",
                          )}
                        >
                          {program.status === "ACTIVE" ? "Aktif" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            className="p-2 text-slate-400 hover:text-[#1E6CF6] hover:bg-blue-50 rounded-lg transition-all"
                            title="View"
                            onClick={() => {
                              setSelectedProgram(program);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                            onClick={() => {
                              setSelectedProgram(program);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Load More Section */}
          <div className="p-6 border-t border-slate-100 flex items-center justify-end">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Total {totalElements} program
            </p>
          </div>
        </div>
      </div>

      {/* Add Program Dialog */}
      <AddProgramDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          // Optionally refetch programs
          programsQuery.refetch?.();
        }}
      />

      {/* Edit Program Dialog */}
      <EditProgramDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        program={selectedProgram}
        onSuccess={() => {
          // Optionally refetch programs
          programsQuery.refetch?.();
        }}
      />

      {/* View Program Dialog */}
      <ViewProgramDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        program={selectedProgram}
      />
    </DashboardLayout>
  );
}

/**
 * Format number as IDR currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to Indonesian format (DD/MM/YYYY)
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}
