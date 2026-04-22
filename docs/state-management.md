# State Management

Proyek menggunakan dua pendekatan state management yang berbeda tujuan:

| Jenis State | Library | Lokasi |
|---|---|---|
| Server state (data dari API) | TanStack Query v5 | `client/services/queries/` & `mutations/` |
| Client state (auth, UI global) | Zustand v5 | `client/stores/` |

---

## TanStack Query — Server State

Digunakan untuk semua data yang berasal dari API: fetching, caching, invalidasi, dan sinkronisasi.

### Konfigurasi Global

Di `client/App.tsx`, `QueryClient` dikonfigurasi dengan:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});
```

Artinya data tidak otomatis di-refetch saat window fokus atau komponen mount ulang — cocok untuk dashboard admin yang datanya tidak berubah terlalu sering.

### Cara Menggunakan

```tsx
// Jangan destructure — ikuti pola ini
const merchants = useMerchants({ page: 0, size: 10 });

merchants.isLoading   // boolean
merchants.error       // AxiosError | null
merchants.data        // response data
merchants.refetch()   // trigger manual refetch
```

### Invalidasi Cache

Setelah mutation berhasil, invalidate query yang relevan agar data ter-refresh:

```ts
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: queryKeys.merchants.lists() });
```

---

## Zustand — Client State

Digunakan untuk state global yang tidak berasal dari API, saat ini hanya untuk autentikasi.

### Auth Store

File: `client/stores/auth-store.ts`

State yang tersimpan (persisted ke `localStorage`):

```ts
interface AuthState {
  user: AuthUser | null;      // Data user yang login
  token: string | null;       // JWT token
  expiresIn: number | null;   // Waktu kadaluarsa token
  tokenType: string | null;   // Tipe token (Bearer)
  isAuthenticated: boolean;   // Status login
}
```

Actions yang tersedia:

```ts
const { setAuth, clearAuth, updateUser } = useAuthStore();

// Set setelah login berhasil
setAuth(user, token, expiresIn, tokenType);

// Clear saat logout
clearAuth();

// Update sebagian data user
updateUser({ fullName: "Nama Baru" });
```

### Membaca State Auth

```tsx
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const token = useAuthStore((state) => state.token);
```

### Menambah Store Baru

Buat file baru di `client/stores/`:

```ts
// client/stores/ui-store.ts
import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

Gunakan `persist` middleware hanya jika state perlu bertahan setelah refresh halaman.
