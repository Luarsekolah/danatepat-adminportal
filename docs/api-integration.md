# API Integration

Dokumentasi lengkap endpoint backend tersedia di `openapi.json` (OpenAPI 3.0).

## Axios Instance

File: `client/services/api.ts`

Semua request HTTP menggunakan satu Axios instance terpusat. Instance ini secara otomatis menyertakan token autentikasi dari auth store di setiap request.

## Konfigurasi Route & Query Keys

File: `client/services/api-config.ts`

Semua nama route API dan TanStack Query keys disimpan di satu tempat untuk konsistensi.

### Routes

```ts
import { routes } from "@/services/api-config";

// Contoh penggunaan
routes.auth.login                          // "/auth/login"
routes.program.list                        // "/program/api/programs"
routes.program.detail(1)                   // "/program/api/programs/1"
routes.merchant.profiles                   // "/merchant/api/merchant/profiles"
routes.payment.historyAll                  // "/payment/api/payments/history/all"
```

### Query Keys

```ts
import { queryKeys } from "@/services/api-config";

queryKeys.programs.list()                  // ["programs", "list", undefined]
queryKeys.programs.detail(1)               // ["programs", "detail", 1]
queryKeys.merchants.list()                 // ["merchants", "list", undefined]
queryKeys.payments.history()               // ["payments", "history", undefined]
```

## Pola Query (Read Data)

Buat hook di `client/services/queries/`. Gunakan `useQuery` dari TanStack Query.

```ts
// client/services/queries/program.ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys, routes } from "@/services/api-config";
import api from "@/services/api";

export function usePrograms(filters?: ListProgramsQuery) {
  return useQuery({
    queryKey: queryKeys.programs.list(filters),
    queryFn: () => api.get(routes.program.list, { params: filters }),
  });
}
```

Penggunaan di komponen:

```tsx
// Ikuti pola ini — jangan destructure langsung
const programs = usePrograms();

if (programs.isLoading) return <Spinner />;
if (programs.error) return <ErrorMessage />;

return <div>{programs.data?.data.map(...)}</div>;
```

## Pola Mutation (Write Data)

Buat hook di `client/services/mutations/`. Gunakan `useMutation` dari TanStack Query.

```ts
// client/services/mutations/program.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys, routes } from "@/services/api-config";
import api from "@/services/api";

export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProgramPayload) =>
      api.post(routes.program.create, data),
    onSuccess: () => {
      // Invalidate cache agar list ter-refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.lists() });
    },
  });
}
```

## Validasi Schema

Zod schemas untuk validasi form dan tipe data ada di `client/services/schemas/`.

```ts
// client/services/schemas/program.ts
import { z } from "zod";

export const createProgramSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  anggaran: z.number().positive(),
});

export type CreateProgramPayload = z.infer<typeof createProgramSchema>;
```

## Error Handling

Gunakan utility dari `client/lib/error-utils.ts` untuk menangani error dari Axios secara konsisten.

## Mutation Hooks yang Tersedia

### Auth — `client/services/mutations/auth.ts`

| Hook | Deskripsi |
|---|---|
| `useLogin(setError?, onSuccess?)` | Login user, simpan token ke store, redirect ke dashboard |
| `useLogout()` | Logout, clear auth store & query cache, redirect ke `/` |

### Programs — `client/services/mutations/program.ts`

| Hook | Deskripsi |
|---|---|
| `useCreateProgram(options?)` | Buat program baru |
| `useUpdateProgram(programId, options?)` | Update program yang ada |
| `useCreateSubPrograms(parentProgramId, options?)` | Buat sub program (bulk array) |
| `usePublishProgram(programId, options?)` | Publish program dari DRAFT → ACTIVE |

### Merchants — `client/services/mutations/merchant.ts`

| Hook | Deskripsi |
|---|---|
| `useRegisterMerchant(options?)` | Daftarkan satu merchant baru |
| `useBulkRegisterMerchantWithProgram(programId, options?)` | Daftarkan merchant secara massal ke program |
| `useSetMerchantWilayah(merchantId, options?)` | Set wilayah operasi merchant |
| `useUpdateMerchantProfile(merchantId, options?)` | Update profil merchant |

### Beneficiary — `client/services/mutations/beneficiary.ts`

| Hook | Deskripsi |
|---|---|
| `useBulkCreateBeneficiariesWithProgram(programId, options?)` | Buat beneficiary massal ke satu program |
| `useBulkCreateBeneficiariesMultiProgram(options?)` | Buat beneficiary massal ke beberapa sub-program sekaligus |

### Payment — `client/services/mutations/payment.ts`

| Hook | Deskripsi |
|---|---|
| `useDonate(options?)` | Set donatur ke program (trigger distribusi dana) |

---

## Query Hooks yang Tersedia

### Programs — `client/services/queries/program.ts`

| Hook | Deskripsi |
|---|---|
| `useListProgram(filters?)` | Daftar semua program |
| `useGetProgram(programId)` | Detail satu program |
| `useProgramDashboard()` | Statistik dashboard program |
| `useListProgramChildren(parentId)` | Daftar sub program |
| `useListProgramUsers(programId)` | Beneficiary & merchant dalam program |
| `useListProgramCategories()` | Daftar kategori program |

### Merchants — `client/services/queries/merchant.ts`

| Hook | Deskripsi |
|---|---|
| `useListMerchant(filters?)` | Daftar merchant (paginated) |
| `useGetMerchantProfile(merchantId)` | Detail profil merchant |
| `useMerchantSummary()` | Statistik dashboard merchant |
| `useGetKotaList()` | Daftar kota untuk wilayah |
| `useGetKecamatanList(idKota)` | Daftar kecamatan berdasarkan kota |

### Payments — `client/services/queries/payment.ts`

| Hook | Deskripsi |
|---|---|
| `usePaymentHistory(filters?)` | Riwayat transaksi (paginated) |
| `useGetTransaction(txHash)` | Detail transaksi blockchain |

### Users — `client/services/queries/user.ts`

| Hook | Deskripsi |
|---|---|
| `useListUsers(filters?)` | Daftar semua user |
| `useGetUser(userId)` | Detail satu user |

---

## Ringkasan Endpoint

| Domain | Base Path |
|---|---|
| Auth | `/auth` |
| Users / Beneficiary | `/users` |
| Programs | `/program/api/programs` |
| Merchant | `/merchant/api/merchant` |
| Payment | `/payment/api/payments` |

Lihat `openapi.json` untuk detail lengkap setiap endpoint.
