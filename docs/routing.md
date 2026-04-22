# Routing

Routing menggunakan **React Router 7** dalam mode SPA. Semua route didefinisikan di `client/App.tsx`.

## Struktur Route

```
/                           → Login (PublicRoute)
/dashboard                  → Dashboard (ProtectedRoute)
/dashboard/programs         → Daftar Program
/dashboard/programs/:programId          → Detail Program
/dashboard/programs/merchant/:programId → Merchant dalam Program
/dashboard/programs/beneficiary/:programId → Beneficiary dalam Program
/dashboard/merchants        → Daftar Merchant
/dashboard/blockchain       → Transaksi Blockchain
/dashboard/users            → Manajemen User
/dashboard/audit            → Audit Log
/dashboard/settings         → Setting & Log
*                           → 404 Not Found
```

## Route Guards

### ProtectedRoute
Semua route di bawah `/dashboard` dibungkus `ProtectedRoute`. Jika user belum login (tidak ada token di auth store), akan di-redirect ke `/`.

File: `client/components/layout/protected-route.tsx`

### PublicRoute
Route `/` (login) dibungkus `PublicRoute`. Jika user sudah login, akan di-redirect ke `/dashboard`.

File: `client/components/layout/public-route.tsx`

## Menambah Route Baru

1. Buat file halaman baru di `client/pages/`
2. Import di `client/App.tsx`
3. Tambahkan `<Route>` di dalam blok `ProtectedRoute` (untuk halaman yang butuh login)

```tsx
// client/App.tsx
import NewPage from "./pages/NewPage";

// Di dalam <Route path="dashboard" element={<ProtectedRoute />}>
<Route path="new-page" element={<NewPage />} />
```

## URL State Management

Proyek menggunakan **nuqs** untuk sinkronisasi state dengan URL query params. Ini memungkinkan filter/pagination tersimpan di URL dan bisa di-share.

```tsx
import { useQueryState } from "nuqs";

const [page, setPage] = useQueryState("page", { defaultValue: "1" });
```

`NuqsAdapter` sudah dipasang di `App.tsx` menggunakan adapter React Router v7.
