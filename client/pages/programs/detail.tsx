import * as React from "react";
import { useParams, useNavigate, Link } from "react-router";
import { DashboardLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, Plus, Users, Store } from "lucide-react";
import {
  useGetProgram,
  useListProgramChildren,
} from "@/services/queries/program";
import { cn, formatCurrency } from "@/lib/utils";
import { AddSubProgramDialog } from "./components/AddSubProgramDialog";


export default function ProgramDetail() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const programData = useGetProgram(Number(programId));
  const subProgramsQuery = useListProgramChildren(Number(programId));

  const currentAllBudget = subProgramsQuery.data?.data?.reduce(
    (acc, curr) => acc + curr.anggaran,
    0,
  );
  const remainingBudget =
    programData.data?.data?.budgetPerPenerima - currentAllBudget;

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const program = programData.data?.data;
  const subPrograms = subProgramsQuery.data?.data ?? [];

  const handleDialogSuccess = () => {
    setIsDialogOpen(false);
    programData.refetch();
    subProgramsQuery.refetch();
  };

  if (programData.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!program) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20 text-slate-400">
          <p className="text-sm font-medium">Program tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/programs"
            className="p-2 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-500 transition-colors"
          >
            <ChevronLeft className="size-5" />
            Kembali
          </Link>
        </div>

        {/* Page Title */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sub Program
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Rincian dana yang tersedia dan dapat digunakan untuk pelaksanaan
              program ini.
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl"
          >
            <Plus className="size-8" />
            Tambah Sub Program
          </Button>
        </div>

        {/* Program Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6">
          <div className="flex items-center flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">
                {program.name}
              </h3>
              {program.description && (
                <p className="text-sm text-slate-600">{program.description}</p>
              )}
            </div>
          </div>

          {/* Program Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-200">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Nama Program
              </p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {program.name}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Anggaran
              </p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {program.anggaran ? formatCurrency(program.anggaran) : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Budget Per Penerima
              </p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {program.budgetPerPenerima
                  ? formatCurrency(program.budgetPerPenerima)
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Jumlah Penerima
              </p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {program.anggaran && program.budgetPerPenerima
                  ? Math.floor(program.anggaran / program.budgetPerPenerima)
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Sub Programs Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">
              Daftar Sub Program
            </h3>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/programs/beneficiary/${programId}`)
                }
                className="gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                Penerima
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/programs/merchant/${programId}`)
                }
                className="gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                Merchant
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {subProgramsQuery.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
              </div>
            ) : subPrograms.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm font-medium">
                  Belum ada sub program. Klik "Tambah Sub Program" untuk
                  menambahkan.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-max text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Nama Sub Program
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Anggaran
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Maks. Sekali Transaksi
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Maks. Transaksi Merchant per Hari
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subPrograms.map((subProgram) => (
                    <tr
                      key={subProgram.id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {subProgram.name}
                          </p>
                          {subProgram.description && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {subProgram.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          )}
                        >
                          {subProgram.categoryName || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {subProgram.anggaran
                          ? formatCurrency(subProgram.anggaran)
                          : "—"}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {subProgram.dailyAllocationAmount
                          ? formatCurrency(subProgram.dailyAllocationAmount)
                          : "—"}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900 text-center">
                        {subProgram.maxTrxPerDay || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Dialog */}
        <AddSubProgramDialog
          programId={programId || ""}
          parentCategoryId={program?.categoryId || 0}
          remainingBudget={remainingBudget < 0 ? 0 : remainingBudget}
          programStartDate={program?.startDate || ""}
          programEndDate={program?.endDate || ""}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={handleDialogSuccess}
        />
      </div>
    </DashboardLayout>
  );
}
