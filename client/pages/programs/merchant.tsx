import { DashboardLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Loader2,
  Eye,
  Map,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { UploadMerchantCSVDialog } from "./components/UploadMerchantCSVDialog";
import { EditMerchantDialog } from "./components/EditMerchantDialog";
import { ViewMerchantDialog } from "./components/ViewMerchantDialog";
import { useState } from "react";
import {
  useListProgramChildren,
  useListProgramUsers,
} from "@/services/queries/program";
import { ProgramData } from "@/types/base";
import { ViewMapsDialog } from "./components/ViewMapsDialog";

export interface MerchantItem {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: "BENEFICIARY" | "MERCHANT";
  status: string;
  businessName?: string;
  nik?: string;
  kategori?: string;
}

export default function ProgramMerchant() {
  const { programId } = useParams<{ programId: string }>();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [mapsDialogOpen, setMapsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantItem | null>(
    null,
  );

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
  // const currentCategory = currentSubProgram?.kategori as
  //   | "PANGAN"
  //   | "KESEHATAN"
  //   | "PENDIDIKAN"
  //   | undefined;

  // Fetch merchants for the current active sub-program
  const programUsersQuery = useListProgramUsers(currentActiveId, {
    enabled: currentActiveId > 0,
  });

  const merchants = programUsersQuery.data?.data?.merchants ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Link
            to={`/dashboard/programs/${programId}`}
            className="p-2 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-500 transition-colors"
          >
            <ChevronLeft className="size-5" />
            Kembali ke Program
          </Link>
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
              merchant
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
                <MerchantTable
                  parentProgramName={subPrograms[0].parentProgram.name}
                  subProgram={subProgram}
                  merchants={merchants}
                  isLoading={programUsersQuery.isLoading}
                  onUploadClick={() => setUploadDialogOpen(true)}
                  onDetailClick={(merchant) => {
                    setSelectedMerchant(merchant);
                    setViewDialogOpen(true);
                  }}
                  onMapsClick={() => setMapsDialogOpen(true)}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* View Maps Dialog */}
      <ViewMapsDialog
        open={mapsDialogOpen}
        onOpenChange={setMapsDialogOpen}
      />

      {/* Upload CSV Dialog */}
      <UploadMerchantCSVDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        subProgram={currentSubProgram}
        onSuccess={() => {
          programUsersQuery.refetch();
        }}
      />

      {/* Edit Merchant Dialog */}
      <EditMerchantDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        merchant={selectedMerchant}
        onSuccess={() => {
          programUsersQuery.refetch();
        }}
      />

      {/* View Merchant Dialog */}
      <ViewMerchantDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        merchant={selectedMerchant}
      />
    </DashboardLayout>
  );
}

function MerchantTable({
  parentProgramName,
  subProgram,
  merchants,
  isLoading,
  onUploadClick,
  onDetailClick,
  onMapsClick,
}: {
  parentProgramName: string;
  subProgram: ProgramData;
  merchants: MerchantItem[];
  isLoading: boolean;
  onUploadClick: () => void;
  onDetailClick: (merchant: MerchantItem) => void;
  onMapsClick: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Daftar Merchant</h2>
          <p className="text-sm text-slate-600">
            Merchant
            <span className="font-semibold"> {subProgram.name} </span>
            dari program
            <span className="font-semibold"> {parentProgramName} </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
        <Button
          onClick={onMapsClick}
        >
          <Map className="h-4 w-4" />
          Lihat Peta
        </Button>
        <Button
          onClick={onUploadClick}
        >
          <Upload className="h-4 w-4" />
          Unggah CSV
        </Button>
        </div>

      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 border border-slate-200 rounded-lg bg-white">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      ) : merchants.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 border border-slate-200 rounded-lg bg-white">
          <h1 className="text-lg mb-2">Belum ada merchant terdaftar</h1>
          <p className="text-slate-600 mb-8 text-balance">
            Silakan klik "Unggah CSV" untuk mendaftarkan merchant
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
                    Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Telepon
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {merchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {merchant.businessName || merchant.fullName}
                        </p>
                        {merchant.nik && (
                          <p className="text-xs text-slate-500">
                            NIK: {merchant.nik}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {merchant.email}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {merchant.phoneNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => onDetailClick(merchant)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                        >
                          <Eye className="size-4" />
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-slate-600">
              Menampilkan {merchants.length} merchant
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
