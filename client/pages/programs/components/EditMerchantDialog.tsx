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
import { useUpdateMerchantProfile } from "@/services/mutations/merchant";
import { useGetMerchantProfile } from "@/services/queries/merchant";
import { updateMerchantProfilePayloadSchema } from "@/services/schemas/merchant";
import type { UpdateMerchantProfilePayload } from "@/services/schemas/merchant";
import type { MerchantItem } from "../merchant";

interface EditMerchantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: MerchantItem | null;
  onSuccess?: () => void;
}

export function EditMerchantDialog({
  open,
  onOpenChange,
  merchant,
  onSuccess,
}: EditMerchantDialogProps) {
  // Fetch detailed merchant profile
  const profileQuery = useGetMerchantProfile(merchant?.id || 0, {
    enabled: open && !!merchant?.id,
  });

  const updateMutation = useUpdateMerchantProfile(merchant?.id || 0, {
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const { register, handleSubmit, formState, reset, control, setValue } =
    useForm<UpdateMerchantProfilePayload>({
      resolver: zodResolver(updateMerchantProfilePayloadSchema),
      defaultValues: {
        businessName: "",
        bankName: "",
        bankAccountNumber: "",
        bankAccountHolder: "",
        kategori: "",
        alamat: "",
        latlon: "",
        qrisData: "",
      },
    });

  // Update form values when profile data is loaded
  React.useEffect(() => {
    if (profileQuery.data?.data && open) {
      const profile = profileQuery.data.data;
      reset({
        businessName: profile.businessName ?? "",
        bankName: profile.bankName ?? "",
        bankAccountNumber: profile.bankAccountNumber ?? "",
        bankAccountHolder: profile.bankAccountHolder ?? "",
        kategori: profile.kategori ?? "",
        alamat: profile.alamat ?? "",
        latlon: profile.latlon ?? "",
        qrisData: profile.qrisData ?? "",
      });
    }
  }, [profileQuery.data, open, reset]);

  const onSubmit = (data: UpdateMerchantProfilePayload) => {
    updateMutation.mutate(data);
  };

  if (!merchant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Merchant</DialogTitle>
          <DialogDescription>Perbarui informasi merchant</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Business Name */}
          <div className="space-y-1.5">
            <Label htmlFor="businessName" className="text-sm font-bold">
              Nama Bisnis
            </Label>
            <Input
              id="businessName"
              placeholder="Masukkan nama bisnis"
              className="h-9 border-slate-200"
              {...register("businessName")}
            />
            {formState.errors.businessName && (
              <p className="text-xs text-red-500">
                {formState.errors.businessName.message}
              </p>
            )}
          </div>

          {/* Bank Name */}
          <div className="space-y-1.5">
            <Label htmlFor="bankName" className="text-sm font-bold">
              Nama Bank
            </Label>
            <Input
              id="bankName"
              placeholder="Masukkan nama bank"
              className="h-9 border-slate-200"
              {...register("bankName")}
            />
            {formState.errors.bankName && (
              <p className="text-xs text-red-500">
                {formState.errors.bankName.message}
              </p>
            )}
          </div>

          {/* Bank Account Information Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="bankAccountNumber" className="text-sm font-bold">
                Nomor Rekening
              </Label>
              <Input
                id="bankAccountNumber"
                placeholder="Nomor rekening"
                className="h-9 border-slate-200"
                {...register("bankAccountNumber")}
              />
              {formState.errors.bankAccountNumber && (
                <p className="text-xs text-red-500">
                  {formState.errors.bankAccountNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bankAccountHolder" className="text-sm font-bold">
                Pemilik Rekening
              </Label>
              <Input
                id="bankAccountHolder"
                placeholder="Nama pemilik"
                className="h-9 border-slate-200"
                {...register("bankAccountHolder")}
              />
              {formState.errors.bankAccountHolder && (
                <p className="text-xs text-red-500">
                  {formState.errors.bankAccountHolder.message}
                </p>
              )}
            </div>
          </div>

          {/* Category and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="kategori" className="text-sm font-bold">
                Kategori
              </Label>
              <Controller
                control={control}
                name="kategori"
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
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
          </div>

          {/* Alamat */}
          <div className="space-y-1.5">
            <Label htmlFor="alamat" className="text-sm font-bold">
              Alamat
            </Label>
            <Textarea
              id="alamat"
              placeholder="Masukkan alamat"
              className="min-h-[80px] resize-none border-slate-200 text-sm"
              {...register("alamat")}
            />
            {formState.errors.alamat && (
              <p className="text-xs text-red-500">
                {formState.errors.alamat.message}
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
