import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ProgramData } from "@/types/base";

interface ViewProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: ProgramData | null;
}

export function ViewProgramDialog({
  open,
  onOpenChange,
  program,
}: ViewProgramDialogProps) {
  if (!program) return null;

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
      ACTIVE: "Aktif",
      DRAFT: "Draft",
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string): string => {
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
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Program</DialogTitle>
          <DialogDescription>
            Informasi lengkap program bantuan yang terdaftar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Program Name */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Nama Program
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {program.name}
            </p>
          </div>

          {/* Description */}
          {program.description && (
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Deskripsi
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {program.description}
              </p>
            </div>
          )}

          {/* Status */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Status
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {getStatusLabel(program.status)}
            </p>
          </div>

          {/* Token Name */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Token Name
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {program.currencyTokenName}
            </p>
          </div>

          {/* Daily Allocation Amount */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Dana Harian
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {formatCurrency(program.dailyAllocationAmount)}
            </p>
          </div>

          {/* Start Date */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Tanggal Mulai
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {formatDate(program.startDate)}
            </p>
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Tanggal Berakhir
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {formatDate(program.endDate)}
            </p>
          </div>

          {/* Program ID */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              ID Program
            </p>
            <p className="text-sm font-mono text-slate-600">{program.id}</p>
          </div>

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
