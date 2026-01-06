import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useRegisterMerchant } from "@/services/mutations/merchant";
import {
  registerMerchantPayloadSchema,
  type RegisterMerchantPayload,
} from "@/services/schemas/merchant";

interface AddMerchantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddMerchantDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddMerchantDialogProps) {
  const registerMutation = useRegisterMerchant({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const { register, handleSubmit, formState, reset } =
    useForm<RegisterMerchantPayload>({
      resolver: zodResolver(registerMerchantPayloadSchema),
      defaultValues: {
        email: "",
        fullName: "",
        phoneNumber: "",
        nik: "",
        blockchainWalletAddress: "",
        businessName: "",
        bankName: "",
        bankAccountNumber: "",
        kategori: "PANGAN",
      },
    });

  const onSubmit = (data: RegisterMerchantPayload) => {
    registerMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Merchant Baru</DialogTitle>
          <DialogDescription>
            Daftarkan merchant baru ke dalam sistem QRIS
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold text-slate-900">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email"
              {...register("email")}
              className="h-10 rounded-xl border-slate-200 focus:ring-[#1E6CF6]"
            />
            {formState.errors.email && (
              <p className="text-xs text-rose-500 font-medium">
                {formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Full Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-sm font-bold text-slate-900"
            >
              Nama Lengkap
            </Label>
            <Input
              id="fullName"
              placeholder="Masukkan nama lengkap"
              {...register("fullName")}
              className="h-10 rounded-xl border-slate-200 focus:ring-[#1E6CF6]"
            />
            {formState.errors.fullName && (
              <p className="text-xs text-rose-500 font-medium">
                {formState.errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label
              htmlFor="phoneNumber"
              className="text-sm font-bold text-slate-900"
            >
              Nomor Telepon
            </Label>
            <Input
              id="phoneNumber"
              placeholder="Masukkan nomor telepon"
              {...register("phoneNumber")}
              className="h-10 rounded-xl border-slate-200 focus:ring-[#1E6CF6]"
            />
            {formState.errors.phoneNumber && (
              <p className="text-xs text-rose-500 font-medium">
                {formState.errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* NIK Field */}
          <div className="space-y-2">
            <Label htmlFor="nik" className="text-sm font-bold text-slate-900">
              NIK (16 digit)
            </Label>
            <Input
              id="nik"
              placeholder="Masukkan NIK 16 digit"
              {...register("nik")}
              className="h-10 rounded-xl border-slate-200 focus:ring-[#1E6CF6]"
            />
            {formState.errors.nik && (
              <p className="text-xs text-rose-500 font-medium">
                {formState.errors.nik.message}
              </p>
            )}
          </div>

          {/* Blockchain Wallet Address Field */}
          <div className="space-y-2">
            <Label
              htmlFor="blockchainWalletAddress"
              className="text-sm font-bold text-slate-900"
            >
              Alamat Wallet Blockchain
            </Label>
            <Input
              id="blockchainWalletAddress"
              placeholder="Masukkan alamat wallet (0x...)"
              {...register("blockchainWalletAddress")}
              className="h-10 rounded-xl border-slate-200 focus:ring-[#1E6CF6]"
            />
            {formState.errors.blockchainWalletAddress && (
              <p className="text-xs text-rose-500 font-medium">
                {formState.errors.blockchainWalletAddress.message}
              </p>
            )}
          </div>

          {/* Business Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="businessName"
              className="text-sm font-bold text-slate-900"
            >
              Nama Bisnis
            </Label>
            <Input
              id="businessName"
              placeholder="Masukkan nama bisnis"
              {...register("businessName")}
              className="h-10 rounded-xl border-slate-200 focus:ring-[#1E6CF6]"
            />
            {formState.errors.businessName && (
              <p className="text-xs text-rose-500 font-medium">
                {formState.errors.businessName.message}
              </p>
            )}
          </div>

          {/* Bank Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="bankName"
              className="text-sm font-bold text-slate-900"
            >
              Nama Bank
            </Label>
            <Input
              id="bankName"
              placeholder="Masukkan nama bank"
              {...register("bankName")}
              className="h-10 rounded-xl border-slate-200 focus:ring-[#1E6CF6]"
            />
            {formState.errors.bankName && (
              <p className="text-xs text-rose-500 font-medium">
                {formState.errors.bankName.message}
              </p>
            )}
          </div>

          {/* Bank Account Number Field */}
          <div className="space-y-2">
            <Label
              htmlFor="bankAccountNumber"
              className="text-sm font-bold text-slate-900"
            >
              Nomor Rekening
            </Label>
            <Input
              id="bankAccountNumber"
              placeholder="Masukkan nomor rekening"
              {...register("bankAccountNumber")}
              className="h-10 rounded-xl border-slate-200 focus:ring-[#1E6CF6]"
            />
            {formState.errors.bankAccountNumber && (
              <p className="text-xs text-rose-500 font-medium">
                {formState.errors.bankAccountNumber.message}
              </p>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Label
              htmlFor="kategori"
              className="text-sm font-bold text-slate-900"
            >
              Kategori
            </Label>
            <Select defaultValue="PANGAN" onValueChange={(value) => {}}>
              <SelectTrigger className="h-10 rounded-xl border-slate-200 focus:ring-[#1E6CF6]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PANGAN">Pangan</SelectItem>
              </SelectContent>
            </Select>
            {formState.errors.kategori && (
              <p className="text-xs text-rose-500 font-medium">
                {formState.errors.kategori.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-10 rounded-xl font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex-1 h-10 bg-[#1E6CF6] hover:bg-blue-700 text-white font-bold rounded-xl gap-2"
            >
              {registerMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {registerMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
