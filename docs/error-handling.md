# Error Handling

## Axios Instance & Interceptors

File: `client/services/api.ts`

Axios instance (`mainApi`) sudah dikonfigurasi dengan dua interceptor:

**Request interceptor** — otomatis menyisipkan JWT token ke setiap request:
```
Authorization: Bearer <token>
```

**Response interceptor** — menangani error global:
- Jika response status `401` → otomatis clear auth store dan redirect ke halaman login
- Timeout default: **20 detik** per request

Selalu gunakan `mainApi` (bukan `axios` langsung) agar interceptor ini aktif:

```ts
import { mainApi } from "@/services/api";

const res = await mainApi.get("/some-endpoint");
```

---

## Error Utilities

File: `client/lib/error-utils.ts`

Empat fungsi helper untuk menangani error secara konsisten:

### `isApiError(error)`

Type guard — mengecek apakah error berasal dari API (Axios dengan response terstruktur):

```ts
import { isApiError } from "@/lib/error-utils";

try {
  await mainApi.post("/endpoint", data);
} catch (error) {
  if (isApiError(error)) {
    // error sekarang bertipe AxiosError<ApiErrorResponse>
    console.log(error.response?.data.code);
  }
}
```

### `getErrorMessage(error)`

Mengekstrak pesan error yang bisa dibaca manusia dari berbagai tipe error:

```ts
import { getErrorMessage } from "@/lib/error-utils";

try {
  await someApiCall();
} catch (error) {
  const message = getErrorMessage(error);
  toast.error(message); // "Email atau password salah"
}
```

Urutan pengecekan:
1. API error dengan response terstruktur → `error.response.data.message`
2. Axios error tanpa response → `error.message`
3. Error standar JS → `error.message`
4. Fallback → `"An unknown error occurred"`

### `getErrorData(error)`

Mengekstrak seluruh objek `ApiErrorResponse` jika tersedia:

```ts
const errorData = getErrorData(error);
if (errorData) {
  console.log(errorData.code);    // "UNAUTHORIZED"
  console.log(errorData.message); // "Token expired"
}
```

### `getErrorStatus(error)`

Mengekstrak HTTP status code:

```ts
const status = getErrorStatus(error);
if (status === 403) {
  // Handle forbidden
}
```

---

## Pola Error Handling di Mutation

Gunakan `onError` callback di `useMutation` untuk menampilkan toast error:

```ts
export function useCreateProgram() {
  return useMutation({
    mutationFn: (data) => mainApi.post(routes.program.create, data),
    onSuccess: () => {
      toast.success("Program berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.lists() });
    },
    onError: (error) => {
      toast.error("Gagal membuat program", {
        description: getErrorMessage(error),
      });
    },
  });
}
```

## Pola Error Handling di Query

Untuk query, error bisa diakses langsung dari return value hook:

```tsx
const programs = useListProgram();

if (programs.isError) {
  return (
    <div className="text-red-500">
      {getErrorMessage(programs.error)}
    </div>
  );
}
```

---

## Error 401 — Session Expired

Ketika token expired atau tidak valid, backend mengembalikan status `401`. Axios interceptor di `api.ts` akan:

1. Memanggil `clearAuth()` — menghapus token dan data user dari store
2. Redirect ke `/` (halaman login)

Ini terjadi otomatis tanpa perlu penanganan manual di setiap komponen.
