import * as React from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  usePublishProgram,
  useUpdateProgram,
} from "@/services/mutations/program";
import {
  updateProgramPayloadSchema,
  type UpdateProgramPayload,
} from "@/services/schemas/program";
import type { ProgramData } from "@/types/base";
import { DatePickerInput } from "@/components/ui/calendar";

interface EditProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: ProgramData | null;
  onSuccess?: () => void;
}

export function EditProgramDialog({
  open,
  onOpenChange,
  program,
  onSuccess,
}: EditProgramDialogProps) {
  const initialProgramStatus = program?.status;
  const publishProgramMutation = usePublishProgram(program?.id);
  const updateMutation = useUpdateProgram(program?.id, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      if (initialProgramStatus === "DRAFT" && data.data.status === "ACTIVE") {
        publishProgramMutation.mutate();
      }
      onSuccess?.();
    },
  });

  const { register, handleSubmit, formState, reset, watch, setValue, control } =
    useForm<UpdateProgramPayload>({
      resolver: zodResolver(updateProgramPayloadSchema),
      defaultValues: {
        name: program?.name ?? "",
        description: program?.description ?? "",
        startDate: new Date(program?.startDate) ?? null,
        endDate: new Date(program?.endDate) ?? null,
        dailyAllocationAmount: program?.dailyAllocationAmount ?? 0,
        currencyTokenName: program?.currencyTokenName ?? "",
        status: (program?.status as "DRAFT" | "ACTIVE") ?? "DRAFT",
      },
    });

  const startDate = watch("startDate");
  const status = watch("status");

  // Update form values when program prop changes
  React.useEffect(() => {
    if (program && open) {
      reset({
        name: program.name,
        description: program.description ?? "",
        startDate: new Date(program.startDate),
        endDate: new Date(program.endDate),
        dailyAllocationAmount: program.dailyAllocationAmount,
        currencyTokenName: program.currencyTokenName,
        status: (program.status as "DRAFT" | "ACTIVE") ?? "DRAFT",
      });
    }
  }, [program, open, reset]);

  const onSubmit = (data: UpdateProgramPayload) => {
    updateMutation.mutate(data);
  };

  if (!program) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Program</DialogTitle>
          <DialogDescription>
            Perbarui informasi program bantuan
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
              Deskripsi (Opsional)
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

          {/* Token Name and Daily Amount Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="currencyTokenName" className="text-sm font-bold">
                Token Name
              </Label>
              <Input
                id="currencyTokenName"
                placeholder="e.g., SEMBAKO_TOKEN"
                className="h-9 border-slate-200 uppercase"
                {...register("currencyTokenName")}
              />
              {formState.errors.currencyTokenName && (
                <p className="text-xs text-red-500">
                  {formState.errors.currencyTokenName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="dailyAllocationAmount"
                className="text-sm font-bold"
              >
                Dana Harian (IDR)
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

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-sm font-bold">
              Status
            </Label>
            <p className="text-xs text-slate-500">
              * Dengan mengganti status menjadi Aktif, maka program akan mulai
              beroperasi
            </p>
            <Select
              value={status}
              onValueChange={(value) =>
                setValue("status", value as "DRAFT" | "ACTIVE")
              }
            >
              <SelectTrigger className="h-9 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
              </SelectContent>
            </Select>
            {formState.errors.status && (
              <p className="text-xs text-red-500">
                {formState.errors.status.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#1E6CF6] hover:bg-blue-700"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
