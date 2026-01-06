import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLogout } from "@/services/mutations/auth";
import { Loader2 } from "lucide-react";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutConfirmDialog({
  open,
  onOpenChange,
}: LogoutConfirmDialogProps) {
  const logoutMutation = useLogout();

  const handleConfirm = () => {
    logoutMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin logout? Anda akan diarahkan ke halaman
            login.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={logoutMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {logoutMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logout...
              </>
            ) : (
              "Logout"
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
