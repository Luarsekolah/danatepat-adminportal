import { DashboardLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Upload, Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { UploadBeneficiaryCSVDialog } from "./components/UploadBeneficiaryCSVDialog";
import { useState } from "react";
import {
  useListProgramChildren,
  useListProgramUsers,
} from "@/services/queries/program";
import { ProgramUser } from "@/types/program";

export default function ProgramBeneficiary() {
  const navigate = useNavigate();
  const { programId } = useParams<{ programId: string }>();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const parentProgramId = programId ? parseInt(programId, 10) : 0;

  // Fetch sub-programs
  const subProgramsQuery = useListProgramChildren(parentProgramId);
  const subPrograms = subProgramsQuery.data?.data ?? [];

  // Track active tab (sub-program ID)
  const [activeSubProgramId, setActiveSubProgramId] = useState<number | null>(
    null,
  );

  // Set default active tab when sub-programs are loaded
  const defaultSubProgram = subPrograms[0]?.id?.toString() ?? "";
  const currentActiveId = activeSubProgramId ?? (subPrograms[0]?.id || 0);

  // Get current sub-program category
  const currentSubProgram = subPrograms.find((sp) => sp.id === currentActiveId);
  const currentCategory = currentSubProgram?.kategori as
    | "PANGAN"
    | "KESEHATAN"
    | "PENDIDIKAN"
    | undefined;

  // Fetch beneficiaries for the current active sub-program
  const programUsersQuery = useListProgramUsers(currentActiveId, {
    enabled: currentActiveId > 0,
  });

  const beneficiaries = programUsersQuery.data?.data?.beneficiaries ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/dashboard/programs/${programId}`)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-slate-600">Kembali</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dashboard/programs/${parentProgramId}`)}
            className="gap-2"
          >
            Lihat Detail Program
          </Button>
        </div>

        {/* Loading State */}
        {subProgramsQuery.isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Empty State */}
        {!subProgramsQuery.isLoading && subPrograms.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <h1 className="text-lg">Belum ada sub-program tersedia</h1>
            <p className="text-slate-600 mb-8 text-balance">
              Silakan buat sub-program terlebih dahulu untuk dapat mendaftarkan
              penerima dana
            </p>
            <Link
              to={`/dashboard/programs/${parentProgramId}`}
              className="text-blue-600 font-medium py-2 px-4 hover:underline"
            >
              Buat Sub-Program
            </Link>
          </div>
        )}

        {/* Tabs */}
        {!subProgramsQuery.isLoading && subPrograms.length > 0 && (
          <Tabs
            defaultValue={defaultSubProgram}
            value={activeSubProgramId?.toString() ?? defaultSubProgram}
            onValueChange={(value) =>
              setActiveSubProgramId(parseInt(value, 10))
            }
            className="w-full"
          >
            <TabsList className="bg-transparent border-b border-slate-200 rounded-none p-0 h-auto w-full justify-start">
              {subPrograms.map((subProgram, index) => (
                <TabsTrigger
                  key={subProgram.id}
                  value={subProgram.id.toString()}
                  className={`rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-0 pb-3 ${
                    index < subPrograms.length - 1 ? "mr-8" : ""
                  }`}
                >
                  {subProgram.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {subPrograms.map((subProgram) => (
              <TabsContent
                key={subProgram.id}
                value={subProgram.id.toString()}
                className="mt-6"
              >
                <BeneficiaryTable
                  parentProgramName={subPrograms[0].parentProgram.name}
                  beneficiaries={beneficiaries}
                  isLoading={programUsersQuery.isLoading}
                  onUploadClick={() => setUploadDialogOpen(true)}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Upload CSV Dialog */}
      <UploadBeneficiaryCSVDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        subProgram={currentSubProgram}
        onSuccess={() => {
          programUsersQuery.refetch();
        }}
      />
    </DashboardLayout>
  );
}

function BeneficiaryTable({
  parentProgramName,
  beneficiaries,
  isLoading,
  onUploadClick,
}: {
  parentProgramName: string;
  beneficiaries: ProgramUser[];
  isLoading: boolean;
  onUploadClick: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Penerima Dana</h2>
          <p className="text-slate-600">Dari program "{parentProgramName}"</p>
        </div>
        <Button
          className="gap-2 bg-[#1E6CF6] hover:bg-blue-700"
          onClick={onUploadClick}
        >
          <Upload className="h-4 w-4" />
          Unggah CSV
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 border border-slate-200 rounded-lg bg-white">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      ) : beneficiaries.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 border border-slate-200 rounded-lg bg-white">
          <h1 className="text-lg mb-2">Belum ada penerima dana terdaftar</h1>
          <p className="text-slate-600 mb-8 text-balance">
            Silakan klik "Unggah CSV" untuk mendaftarkan penerima dana
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg overflow-hidden bg-white">
            <table className="w-full min-w-max">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Nomor Telepon
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {beneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${beneficiary.fullName}`}
                          />
                          <AvatarFallback>
                            {beneficiary.fullName
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-slate-900">
                          {beneficiary.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {beneficiary.email}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {beneficiary.phoneNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Menampilkan {beneficiaries.length} penerima dana
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
              <Button variant="outline" size="sm" className="gap-1">
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
