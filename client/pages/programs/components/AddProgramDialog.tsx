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
import { DatePickerInput } from "@/components/ui/calendar";
import { InputPrice } from "@/components/ui/input-price";
import { useCreateProgram } from "@/services/mutations/program";
import {
  createProgramPayloadSchema,
  type CreateProgramPayload,
} from "@/services/schemas/program";

interface AddProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddProgramDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddProgramDialogProps) {
  const createMutation = useCreateProgram({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const { register, handleSubmit, formState, reset, control, watch } =
    useForm<CreateProgramPayload>({
      resolver: zodResolver(createProgramPayloadSchema),
      defaultValues: {
        name: "",
        description: "",
        startDate: null,
        endDate: null,
        anggaran: 0,
      },
    });

  const startDate = watch("startDate");
  let totalBenificiary = 0;
  if (watch("budgetPerPenerima") > 0 && watch("anggaran") > 0) {
    totalBenificiary = Math.floor(
      watch("anggaran") / watch("budgetPerPenerima"),
    );
  }

  const onSubmit = (data: CreateProgramPayload) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Program Baru</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk membuat program bantuan baru
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Program Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-bold">
              Nama Program
            </Label>
            <Input
              id="name"
              placeholder="Masukkan nama program"
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
              placeholder="Masukkan deskripsi program"
              className="min-h-[80px] resize-none border-slate-200 text-sm"
              {...register("description")}
            />
            {formState.errors.description && (
              <p className="text-xs text-red-500">
                {formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-sm font-bold">
                Tanggal Mulai
              </Label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DatePickerInput
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    placeholder="Pilih tanggal"
                    displayFormat="dd MMMM yyyy"
                    variant="outline"
                  />
                )}
              />
              {formState.errors.startDate && (
                <p className="text-xs text-red-500">
                  {formState.errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="text-sm font-bold">
                Tanggal Akhir
              </Label>
              <Controller
                control={control}
                name="endDate"
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
                    disabled={(date) => {
                      if (!startDate) return false;
                      const start = new Date(startDate);
                      return date < start;
                    }}
                  />
                )}
              />
              {formState.errors.endDate && (
                <p className="text-xs text-red-500">
                  {formState.errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Anggaran */}
          <div className="space-y-1.5">
            <Label htmlFor="anggaran" className="text-sm font-bold">
              Anggaran
            </Label>
            <Controller
              control={control}
              name="anggaran"
              render={({ field }) => (
                <InputPrice
                  id="anggaran"
                  value={field.value}
                  onChange={field.onChange}
                  decimalScale={0}
                />
              )}
            />
            {formState.errors.anggaran && (
              <p className="text-xs text-red-500">
                {formState.errors.anggaran.message}
              </p>
            )}
          </div>

          {/* Budget per penerima */}
          <div className="space-y-1.5">
            <Label htmlFor="budgetPerPenerima" className="text-sm font-bold">
              Budget Per Penerima
            </Label>
            <Controller
              control={control}
              name="budgetPerPenerima"
              render={({ field }) => (
                <InputPrice
                  id="budgetPerPenerima"
                  value={field.value}
                  onChange={field.onChange}
                  decimalScale={0}
                />
              )}
            />
            {formState.errors.budgetPerPenerima && (
              <p className="text-xs text-red-500">
                {formState.errors.budgetPerPenerima.message}
              </p>
            )}
          </div>

          {/* Disabled Total Benificier */}
          <div className="space-y-1.5">
            <Label className="text-sm font-bold">Jumlah Penerima Manfaat</Label>
            <Input
              placeholder="-"
              value={totalBenificiary ?? 0}
              className="h-9 border-slate-200"
              disabled
            />
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
              {createMutation.isPending ? "Menyimpan..." : "Simpan Program"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
