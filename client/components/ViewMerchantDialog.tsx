import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { MerchantData } from "@/types/base";

interface ViewMerchantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: MerchantData | null;
}

export function ViewMerchantDialog({
  open,
  onOpenChange,
  merchant,
}: ViewMerchantDialogProps) {
  if (!merchant) return null;

  const getCategoryLabel = (kategori: string) => {
    const categoryMap: Record<string, string> = {
      PANGAN: "Pangan",
      PENDIDIKAN: "Pendidikan",
      KESEHATAN: "Kesehatan",
    };
    return categoryMap[kategori] || kategori;
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      AKTIF: "Aktif",
      VERIFIKASI: "Verifikasi",
      NONAKTIF: "Non-aktif",
    };
    return statusMap[status] || status;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Merchant</DialogTitle>
          <DialogDescription>
            Informasi lengkap merchant yang terdaftar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Business Name */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Nama Bisnis
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {merchant.businessName}
            </p>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Kategori
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {getCategoryLabel(merchant.kategori)}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Status
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {getStatusLabel(merchant.status)}
            </p>
          </div>

          {/* QRIS Data */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              ID QRIS
            </p>
            <p className="text-sm font-mono text-slate-600">
              {merchant.qrisData || "-"}
            </p>
          </div>

          {/* Bank Information */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Nama Bank
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {merchant.bankName}
            </p>
          </div>

          {/* Bank Account */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Nomor Rekening
            </p>
            <p className="text-sm font-mono text-slate-600">
              {merchant.bankAccountNumber}
            </p>
          </div>

          {/* Account Holder */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Pemegang Rekening
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {merchant.bankAccountHolder || "-"}
            </p>
          </div>

          {/* Wilayah/Area */}
          {merchant.wilayahList && merchant.wilayahList.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Wilayah Operasi
              </p>
              <div className="space-y-2">
                {merchant.wilayahList.map((wilayah, idx) => (
                  <div
                    key={idx}
                    className="text-sm p-3 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <p className="font-semibold text-slate-900">
                      {wilayah.kota}
                      {wilayah.kecamatan && ` - ${wilayah.kecamatan}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {wilayah.alamat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-10 bg-[#1E6CF6] hover:bg-blue-700 text-white font-bold rounded-xl"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
