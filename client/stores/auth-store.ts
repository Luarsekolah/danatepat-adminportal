import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  status: string;
}

export interface AuthState {
  // State
  user: AuthUser | null;
  token: string | null;
  expiresIn: number | null;
  tokenType: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (
    user: AuthUser,
    token: string,
    expiresIn: number,
    tokenType: string,
  ) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      expiresIn: null,
      tokenType: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token, expiresIn, tokenType) =>
        set({
          user,
          token,
          expiresIn,
          tokenType,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          expiresIn: null,
          tokenType: null,
          isAuthenticated: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "auth-store", // localStorage key
      partialize: (state) => ({
        // Only persist sensitive data
        user: state.user,
        token: state.token,
        expiresIn: state.expiresIn,
        tokenType: state.tokenType,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
