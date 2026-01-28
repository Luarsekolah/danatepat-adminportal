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
import { useListProgramCategories } from "@/services/queries/program";
import {
  createSubProgramPayloadSchema,
  type CreateSubProgramPayload,
} from "@/services/schemas/program";
import { InputPrice } from "@/components/ui/input-price";
import { formatCurrency } from "@/lib/utils";

interface AddSubProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId: string;
  parentCategoryId: number;
  remainingBudget: number;
  programStartDate: string;
  programEndDate: string;
  onSuccess?: () => void;
}

export function AddSubProgramDialog({
  open,
  onOpenChange,
  programId,
  parentCategoryId,
  remainingBudget,
  programStartDate,
  programEndDate,
  onSuccess,
}: AddSubProgramDialogProps) {
  // Fetch categories hierarchy
  const categoriesQuery = useListProgramCategories({
    enabled: open,
  });

  const categories = categoriesQuery.data?.data ?? [];
  const parentCategory = categories.find((cat) => cat.id === parentCategoryId);
  const subCategories = parentCategory?.children ?? [];

  const createMutation = useCreateSubPrograms(Number(programId), {
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const {
    register,
    handleSubmit,
    formState,
    reset,
    control,
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm<CreateSubProgramPayload>({
    resolver: zodResolver(createSubProgramPayloadSchema),
    defaultValues: {
      name: "",
      description: "",
      expTokenDate: null,
      anggaran: 0,
      dailyAllocationAmount: 0,
      maxTrxPerDay: undefined,
      categoryId: null,
    },
  });

  const inputAnggaran = watch("anggaran");
  React.useEffect(() => {
    if (inputAnggaran > remainingBudget) {
      setError("anggaran", {
        type: "manual",
        message: `Anggaran tidak dapat melebihi ${formatCurrency(
          remainingBudget,
        )}`,
      });
    } else {
      clearErrors("anggaran");
    }
  }, [inputAnggaran, remainingBudget, setError, clearErrors]);

  const onSubmit = (data: CreateSubProgramPayload) => {
    // Validate budget limit before submission
    if (data.anggaran > remainingBudget) {
      setError("anggaran", {
        type: "manual",
        message: `Anggaran tidak dapat melebihi ${formatCurrency(
          remainingBudget,
        )}`,
      });
      return;
    }

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

          {/* Kategori - Sub Category Only */}
          <div className="space-y-1.5">
            <Label htmlFor="kategori" className="text-sm font-bold">
              Sub Kategori
            </Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={field.value ? field.value.toString() : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                  disabled={subCategories.length === 0}
                >
                  <SelectTrigger className="h-9 border-slate-200">
                    <SelectValue placeholder={subCategories.length === 0 ? "Tidak ada sub kategori" : "Pilih sub kategori"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-slate-500">Tidak ada sub kategori</div>
                    ) : (
                      subCategories.map((subCat) => (
                        <SelectItem key={subCat.id} value={subCat.id.toString()}>
                          {subCat.categoryName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.categoryId && (
              <p className="text-xs text-red-500">
                {formState.errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Anggaran and Daily Allocation Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    prefix="Pr"
                  />
                )}
              />
              {formState.errors.anggaran ? (
                <p className="text-xs text-red-500">
                  {formState.errors.anggaran.message}
                </p>
              ) : (
                <p className="text-xs text-slate-600">
                  Sisa anggaran yang dapat digunakan:{" "}
                  {formatCurrency(remainingBudget)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="dailyAllocationAmount"
                className="text-sm font-bold"
              >
                Maks. Nominal Per Transaksi
              </Label>
              <Controller
                control={control}
                name="dailyAllocationAmount"
                render={({ field }) => (
                  <InputPrice
                    id="dailyAllocationAmount"
                    value={field.value}
                    onChange={field.onChange}
                    decimalScale={0}
                    prefix="Pr"
                  />
                )}
              />

              {formState.errors.dailyAllocationAmount ? (
                <p className="text-xs text-red-500">
                  {formState.errors.dailyAllocationAmount.message}
                </p>
              ) : (
                <p className="text-xs text-slate-600">
                  Batas maksimum nominal per transaksi yang dapat dilakukan
                </p>
              )}
            </div>
          </div>

          {/* Exp Token Date and Max Trx Per Day Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <div>
                <Label htmlFor="maxTrxPerDay" className="text-sm font-bold">
                  Maks. Transaksi Merchant Per Hari
                </Label>
              </div>
              <Input
                id="maxTrxPerDay"
                type="number"
                placeholder="0"
                className="h-9 border-slate-200"
                {...register("maxTrxPerDay", {
                  valueAsNumber: true,
                })}
              />

              {formState.errors.maxTrxPerDay ? (
                <p className="text-xs text-red-500">
                  {formState.errors.maxTrxPerDay.message}
                </p>
              ) : (
                <p className="text-xs text-slate-600">
                  Maksimum total transaksi yang dapat dilakukan per tiap
                  merchant dalam sehari
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expTokenDate" className="text-sm font-bold">
                Tanggal Kadaluarsa Token
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
                    disabled={(date) => {
                      // Only allow between `programStartDate` and `programEndDate`
                      if (!programStartDate || !programEndDate) return false;
                      const start = new Date(programStartDate);
                      const end = new Date(programEndDate);
                      return date < start || date > end;
                    }}
                  />
                )}
              />
              {formState.errors.expTokenDate && (
                <p className="text-xs text-red-500">
                  {formState.errors.expTokenDate.message}
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
