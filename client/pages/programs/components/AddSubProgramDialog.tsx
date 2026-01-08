import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerInput } from "@/components/ui/calendar";
import { useCreateSubPrograms } from "@/services/mutations/program";
import {
  createSubProgramPayloadSchema,
  type CreateSubProgramPayload,
} from "@/services/schemas/program";

interface AddSubProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId: string;
  onSuccess?: () => void;
}

export function AddSubProgramDialog({
  open,
  onOpenChange,
  programId,
  onSuccess,
}: AddSubProgramDialogProps) {
  const createMutation = useCreateSubPrograms(Number(programId), {
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const { register, handleSubmit, formState, reset, control, setValue } =
    useForm<CreateSubProgramPayload>({
      resolver: zodResolver(createSubProgramPayloadSchema),
      defaultValues: {
        name: "",
        description: "",
        expTokenDate: null,
        anggaran: 0,
        dailyAllocationAmount: 0,
        maxTrxPerDay: undefined,
        kategori: "PANGAN",
      },
    });

  const onSubmit = (data: CreateSubProgramPayload) => {
    // Send as array since API expects multiple sub programs
    createMutation.mutate([data]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Sub Program Baru</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk membuat sub program bantuan baru
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-bold">
              Nama Sub Program
            </Label>
            <Input
              id="name"
              placeholder="Masukkan nama sub program"
              className="h-9 border-slate-200"
              {...register("name")}
            />
            {formState.errors.name && (
              <p className="text-xs text-red-500">
                {formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-bold">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              placeholder="Masukkan deskripsi sub program"
              className="min-h-[80px] resize-none border-slate-200 text-sm"
              {...register("description")}
            />
            {formState.errors.description && (
              <p className="text-xs text-red-500">
                {formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Kategori */}
          <div className="space-y-1.5">
            <Label htmlFor="kategori" className="text-sm font-bold">
              Kategori
            </Label>
            <Controller
              control={control}
              name="kategori"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 border-slate-200">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PANGAN">Pangan</SelectItem>
                    <SelectItem value="KESEHATAN">Kesehatan</SelectItem>
                    <SelectItem value="PENDIDIKAN">Pendidikan</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.kategori && (
              <p className="text-xs text-red-500">
                {formState.errors.kategori.message}
              </p>
            )}
          </div>

          {/* Anggaran and Daily Allocation Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="anggaran" className="text-sm font-bold">
                Anggaran (IDR)
              </Label>
              <Input
                id="anggaran"
                type="number"
                placeholder="0"
                className="h-9 border-slate-200"
                {...register("anggaran", {
                  valueAsNumber: true,
                })}
              />
              {formState.errors.anggaran && (
                <p className="text-xs text-red-500">
                  {formState.errors.anggaran.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="dailyAllocationAmount"
                className="text-sm font-bold"
              >
                Alokasi Harian (IDR)
              </Label>
              <Input
                id="dailyAllocationAmount"
                type="number"
                placeholder="0"
                className="h-9 border-slate-200"
                {...register("dailyAllocationAmount", {
                  valueAsNumber: true,
                })}
              />
              {formState.errors.dailyAllocationAmount && (
                <p className="text-xs text-red-500">
                  {formState.errors.dailyAllocationAmount.message}
                </p>
              )}
            </div>
          </div>

          {/* Exp Token Date and Max Trx Per Day Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="expTokenDate" className="text-sm font-bold">
                Tanggal Kadaluarsa Token (Opsional)
              </Label>
              <Controller
                control={control}
                name="expTokenDate"
                render={({ field }) => (
                  <DatePickerInput
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    placeholder="Pilih tanggal"
                    displayFormat="dd MMMM yyyy"
                    size="default"
                    variant="outline"
                  />
                )}
              />
              {formState.errors.expTokenDate && (
                <p className="text-xs text-red-500">
                  {formState.errors.expTokenDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="maxTrxPerDay" className="text-sm font-bold">
                Max Transaksi Per Hari (Opsional)
              </Label>
              <Input
                id="maxTrxPerDay"
                type="number"
                placeholder="0"
                className="h-9 border-slate-200"
                {...register("maxTrxPerDay", {
                  valueAsNumber: true,
                })}
              />
              {formState.errors.maxTrxPerDay && (
                <p className="text-xs text-red-500">
                  {formState.errors.maxTrxPerDay.message}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#1E6CF6] hover:bg-blue-700"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {createMutation.isPending ? "Menyimpan..." : "Simpan Sub Program"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
