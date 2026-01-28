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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDonate } from "@/services/mutations/payment";
import { useListUsers } from "@/services/queries/user";
import {
  donateFormSchema,
  type DonateForm,
} from "@/services/schemas/payment";
import type { ProgramData } from "@/types/base";

interface SetDonorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: ProgramData | null;
  onSuccess?: () => void;
}

export function SetDonorDialog({
  open,
  onOpenChange,
  program,
  onSuccess,
}: SetDonorDialogProps) {
  const usersQuery = useListUsers(
    {
      role: "DONOR",
    },
    {
      enabled: open,
    },
  );

  const donateMutation = useDonate({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const { handleSubmit, formState, reset, control, register } =
    useForm<DonateForm>({
      resolver: zodResolver(donateFormSchema),
      defaultValues: {
        userId: null,
      },
    });

  const onSubmit = (data: DonateForm) => {
    donateMutation.mutate({
      userId: data.userId,
      programId: program?.id || null,
      nominal: program?.anggaran || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Set Donatur</DialogTitle>
          <DialogDescription>
            Pilih donatur untuk program{" "}
            <span className="font-semibold">{program?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* User Select */}
          <div className="space-y-1.5">
            <Label htmlFor="userId" className="text-sm font-bold">
              Pilih Donatur
            </Label>
            <Controller
              control={control}
              name="userId"
              render={({ field }) => (
                <Select
                  value={field.value ? field.value.toString() : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger className="h-9 border-slate-200">
                    <SelectValue placeholder="Pilih donatur" />
                  </SelectTrigger>
                  <SelectContent>
                    {usersQuery.isLoading ? (
                      <div className="px-2 py-1.5 text-sm text-slate-500">
                        Memuat pengguna...
                      </div>
                    ) : usersQuery.data?.data &&
                      usersQuery.data.data.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-slate-500">
                        Tidak ada pengguna
                      </div>
                    ) : (
                      usersQuery.data?.data?.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.fullName} ({user.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.userId && (
              <p className="text-xs text-red-500">
                {formState.errors.userId.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={donateMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#1E6CF6] hover:bg-blue-700"
              disabled={donateMutation.isPending}
            >
              {donateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {donateMutation.isPending ? "Menyimpan..." : "Set Donatur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
