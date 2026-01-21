import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetMerchantProfile } from "@/services/queries/merchant";
import type { MerchantItem } from "../merchant";

interface ViewMerchantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: MerchantItem | null;
}

export function ViewMerchantDialog({
  open,
  onOpenChange,
  merchant,
}: ViewMerchantDialogProps) {
  // Fetch detailed merchant profile
  const profileQuery = useGetMerchantProfile(merchant?.id || 0, {
    enabled: open && !!merchant?.id,
  });

  if (!merchant) return null;

  const profile = profileQuery.data?.data;
  const isLoading = profileQuery.isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detail Merchant</DialogTitle>
          <DialogDescription>Informasi lengkap merchant</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nama Bisnis
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.businessName || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Kategori
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.kategori || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.status || "—"}
                </p>
              </div>
            </div>

            {/* Bank Information */}
            <div className="border-t border-slate-200 pt-4 space-y-4">
              <h3 className="font-semibold text-slate-900">Informasi Bank</h3>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nama Bank
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.bankName || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nomor Rekening
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.bankAccountNumber || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Pemilik Rekening
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile.bankAccountHolder || "—"}
                </p>
              </div>
            </div>

            {/* Location Information */}
            {profile.alamat && (
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <h3 className="font-semibold text-slate-900">
                  Informasi Lokasi
                </h3>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Alamat
                  </p>
                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {profile.alamat}
                  </p>
                </div>

                {profile.latlon && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Koordinat
                    </p>
                    <p className="text-sm font-medium text-slate-900 mt-1 break-all">
                      {profile.latlon}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* QRIS Data */}
            {profile.qrisData && (
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <h3 className="font-semibold text-slate-900">Data QRIS</h3>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    QRIS
                  </p>
                  <p className="text-sm font-medium text-slate-900 mt-1 break-all text-xs">
                    {profile.qrisData}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">Gagal memuat data merchant</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
