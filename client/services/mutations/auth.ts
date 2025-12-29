import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { UseFormSetError } from "react-hook-form";
import { mainApi } from "../api";
import { routes } from "../api-config";
import { useAuthStore } from "@/stores/auth-store";
import { LoginPayload, LoginResponse } from "@/types/auth";
import { getErrorMessage } from "@/lib/error-utils";
import { toast } from "sonner";

export function useLogin(
  setError?: UseFormSetError<LoginPayload>,
  onSuccessCallback?: () => void,
) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (credentials) => {
      const res = await mainApi.post(routes.auth.login, credentials);
      return res.data;
    },
    onSuccess: (data) => {
      // Extract user and auth data from response
      if (data.data) {
        // Store auth data in Zustand store (automatically persists to localStorage)
        setAuth(
          {
            userId: data.data.userId,
            email: data.data.email,
            fullName: data.data.fullName,
            phoneNumber: data.data.phoneNumber,
            role: data.data.role,
            status: data.data.status,
          },
          data.data.token,
          data.data.expiresIn,
          data.data.tokenType,
        );

        toast.success("Login berhasil!", {
          description: "Selamat datang kembali",
        });

        onSuccessCallback?.();
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      console.error("Login failed:", errorMessage);

      toast.error("Login Gagal", {
        description: errorMessage,
      });

      setError?.("root", {
        type: "manual",
        message: errorMessage,
      });
    },
  });
}
