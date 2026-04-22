# Data Types & Response Structure

Semua tipe data terpusat di `client/types/` dan `client/services/schemas/`. File `client/types/base.ts` adalah fondasi yang digunakan di seluruh codebase.

---

## Response Wrapper

Semua response dari API dibungkus dengan struktur yang konsisten:

```ts
// client/types/base.ts
interface ApiResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp?: number;
}

interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  data?: null;
  timestamp?: number;
}
```

Convenience types yang tersedia:

```ts
// Array response
type ApiListResponse<T> = ApiResponse<T[]>;

// Paginated response
type ApiPaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
```

## Paginated Data

Endpoint yang mengembalikan data terpaginasi menggunakan struktur ini:

```ts
interface PaginatedData<T> {
  content: T[];          // Array data halaman ini
  totalPages: number;    // Total halaman
  totalElements: number; // Total semua data
  size: number;          // Ukuran per halaman
  number: number;        // Halaman saat ini (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
  pageable: Record<string, unknown>;
}
```

Contoh mengakses data paginated:

```tsx
const merchants = useListMerchant({ page: 0, size: 10 });

const list = merchants.data?.data.content ?? [];
const totalPages = merchants.data?.data.totalPages ?? 0;
const currentPage = merchants.data?.data.number ?? 0;
```

---

## Domain Types

### Program

```ts
interface ProgramData {
  id: number;
  name: string;
  description?: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE";
  startDate: string;           // ISO date string
  endDate: string;
  anggaran?: number;
  dailyAllocationAmount?: number;
  budgetPerPenerima?: number;
  currencyTokenName: string;
  categoryId: number | null;
  categoryName: string | null;
  parentProgram?: ProgramData | null;  // null jika program utama
  expTokenDate?: string;
  maxTrxPerDay?: number;
  donors: Array<{
    userId: number | null;
    email: string | null;
    fullName: string;
    phoneNumber: string;
  }>;
}
```

Program memiliki hierarki: **Program Utama → Sub Program (children)**. Sub program memiliki `parentProgram` yang merujuk ke program induknya.

### Merchant

```ts
interface MerchantData {
  userId: number;
  businessName: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  kategori: string;           // "PANGAN" | "KESEHATAN" | "PENDIDIKAN"
  status: string;
  qrisData?: string;
  wilayahList?: MerchantWilayah[];
}

interface MerchantWilayah {
  id: number;
  merchantUserId: number;
  kota: string;
  kecamatan: string | null;
  alamat: string;
}
```

### User / Beneficiary

```ts
interface UserListItem {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;               // "BENEFICIARY" | "MERCHANT" | "ADMIN" | "DONOR"
  status: string;
  blockchainWalletAddress: string | null;
  isBlockchainWalletApproved: boolean;
  dateOfBirth: string | null;
  ktpPhotoUrl: string | null;
  selfiePhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Payment Transaction

```ts
interface PaymentHistoryItem {
  user: { userId: number; userName: string } | null;
  merchant: { merchantId: number; merchantName: string } | null;
  program: { programId: number; categoryId: number; categoryName: string };
  transaction: {
    id: string;
    transactionRefId: string;
    amount: number;
    status: string;
    blockchainTxHash: string;
    transactionType: "DAILY_DISTRIBUTION" | "PAYMENT" | "SETTLEMENT";
    createdAt: string;
  };
}
```

---

## Struktur Tipe per Domain

| Domain | Schema (validasi) | Types (re-export) |
|---|---|---|
| Program | `client/services/schemas/program.ts` | `client/types/program.ts` |
| Merchant | `client/services/schemas/merchant.ts` | `client/types/merchant.ts` |
| Payment | `client/services/schemas/payment.ts` | `client/types/payment.ts` |
| User | `client/services/schemas/user.ts` | `client/types/user.ts` |
| Auth | `client/services/schemas/auth.ts` | `client/types/auth.ts` |
| Base | — | `client/types/base.ts` |

> File di `client/types/` hanya melakukan re-export dari schemas. Impor tipe dari `@/types/` untuk konsistensi.

---

## Environment Variables

Didefinisikan dan divalidasi di `client/env.ts` menggunakan Zod:

| Variable | Wajib | Keterangan |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Base URL backend API |
| `VITE_APP_BASE_URL` | ❌ | Base URL frontend (untuk redirect setelah logout) |
| `VITE_GOOGLE_MAPS_API_KEY` | ❌ | API key Google Maps |

Cara menggunakan di kode:

```ts
import env from "@/env";

const baseUrl = env.VITE_API_BASE_URL;
```

Jika `VITE_API_BASE_URL` tidak diset, aplikasi akan throw error saat startup.
