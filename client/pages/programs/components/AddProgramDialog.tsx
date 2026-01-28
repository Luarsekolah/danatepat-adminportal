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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListProgramCategories } from "@/services/queries/program";

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
  const categoriesQuery = useListProgramCategories({
    enabled: open,
  });

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
        budgetPerPenerima: 0,
        categoryId: null,
        escrowAccountNumber: "",
        escrowAccountBank: "",
        escrowAccountOwner: "",
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 grid-cols-2"
        >
          {/* Program Name */}
          <div className="space-y-1.5 col-span-2">
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
          <div className="space-y-1.5 col-span-2">
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

          {/* Kategori */}
          <div className="space-y-1.5 col-span-2">
            <Label htmlFor="categoryId" className="text-sm font-bold">
              Kategori
            </Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={field.value ? field.value.toString() : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger className="h-9 border-slate-200">
                    <SelectValue placeholder="Pilih kategori program" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesQuery.isLoading ? (
                      <div className="px-2 py-1.5 text-sm text-slate-500">Memuat kategori...</div>
                    ) : categoriesQuery.data?.data && categoriesQuery.data.data.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-slate-500">Tidak ada kategori</div>
                    ) : (
                      categoriesQuery.data?.data?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.categoryName}
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

          {/* Escrow Account Number */}
          <div className="space-y-1.5 col-span-2">
            <Label htmlFor="escrowAccountNumber" className="text-sm font-bold">
              Nomor Rekening Escrow
            </Label>
            <Input
              id="escrowAccountNumber"
              placeholder="Masukkan nomor rekening escrow"
              className="h-9 border-slate-200"
              {...register("escrowAccountNumber")}
            />
            {formState.errors.escrowAccountNumber && (
              <p className="text-xs text-red-500">
                {formState.errors.escrowAccountNumber.message}
              </p>
            )}
          </div>

          {/* Escrow Account Bank */}
          <div className="space-y-1.5 col-span-2 md:col-span-1">
            <Label htmlFor="escrowAccountBank" className="text-sm font-bold">
              Bank Rekening Escrow
            </Label>
            <Input
              id="escrowAccountBank"
              placeholder="Masukkan nama bank"
              className="h-9 border-slate-200"
              {...register("escrowAccountBank")}
            />
            {formState.errors.escrowAccountBank && (
              <p className="text-xs text-red-500">
                {formState.errors.escrowAccountBank.message}
              </p>
            )}
          </div>

          {/* Escrow Account Owner */}
          <div className="space-y-1.5 col-span-2 md:col-span-1">
            <Label htmlFor="escrowAccountOwner" className="text-sm font-bold">
              Pemilik Rekening Escrow
            </Label>
            <Input
              id="escrowAccountOwner"
              placeholder="Masukkan nama pemilik"
              className="h-9 border-slate-200"
              {...register("escrowAccountOwner")}
            />
            {formState.errors.escrowAccountOwner && (
              <p className="text-xs text-red-500">
                {formState.errors.escrowAccountOwner.message}
              </p>
            )}
          </div>

          {/* Dates Start */}
          <div className="space-y-1.5 col-span-2 md:col-span-1">
            <Label htmlFor="startDate" className="text-sm font-bold">
              Tanggal Mulai Aktif Program
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

          {/* Dates End */}
          <div className="space-y-1.5 col-span-2 md:col-span-1">
            <Label htmlFor="endDate" className="text-sm font-bold">
              Tanggal Akhir Aktif Program
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

          {/* Anggaran */}
          <div className="space-y-1.5 col-span-2 md:col-span-1">
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
            {formState.errors.anggaran && (
              <p className="text-xs text-red-500">
                {formState.errors.anggaran.message}
              </p>
            )}
          </div>

          {/* Budget per penerima */}
          <div className="space-y-1.5 col-span-2 md:col-span-1">
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
                  prefix="Pr"
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
          <div className="space-y-1.5 col-span-2">
            <Label className="text-sm font-bold">Jumlah Penerima Manfaat</Label>
            <Input
              placeholder="-"
              value={totalBenificiary ?? 0}
              className="h-9 border-slate-200"
              disabled
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 col-span-2">
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
