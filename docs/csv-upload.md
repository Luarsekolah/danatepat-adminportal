# Fitur CSV Upload

Presidana Admin mendukung pendaftaran massal (bulk) untuk beneficiary dan merchant melalui upload file CSV. Fitur ini menggunakan library **PapaParse** untuk parsing di sisi client.

---

## Upload Beneficiary CSV

Komponen: `client/pages/programs/components/UploadBeneficiaryCSVDialog.tsx`

Digunakan di halaman detail program untuk mendaftarkan banyak penerima dana sekaligus ke satu atau beberapa sub-program.

### Format Kolom CSV

| Nama Kolom (case-insensitive) | Field | Wajib |
|---|---|---|
| `Email` | `email` | ✅ |
| `Nama Lengkap Sesuai KTP` | `fullName` | ✅ |
| `Nomor Telepon` | `phoneNumber` | ✅ (10-15 digit angka) |
| `NIK` | `nik` | ✅ (16 karakter) |
| `Tanggal Lahir (format: yyyy-mm-dd, contoh: 1990-01-30)` | `dateOfBirth` | ❌ |
| `URL Foto KTP` | `ktpPhotoUrl` | ❌ |
| `URL Foto` | `selfiePhotoUrl` | ❌ |
| `[Nama Sub-Program]` | sub-program selection | ✅ (min 1) |

Kolom sub-program ditambahkan secara dinamis berdasarkan sub-program yang ada. Isi dengan `Ya` atau `Tidak`.

### Contoh CSV

```csv
Email,Nama Lengkap Sesuai KTP,Nomor Telepon,NIK,Tanggal Lahir (format: yyyy-mm-dd),Bantuan Pangan,Bantuan Kesehatan
budi@gmail.com,Budi Santoso,6281234567890,3173010101010001,1990-01-30,Ya,Tidak
siti@gmail.com,Siti Rahayu,6289876543210,3173010101010002,1995-05-15,Ya,Ya
```

### Behavior Khusus

- `passwordHash` otomatis diisi `"password12345"` — tidak perlu diisi di CSV
- `role` otomatis diisi `"BENEFICIARY"`
- `categoryId` diambil dari sub-program yang dipilih (kolom `Ya`)
- Jika user memilih beberapa sub-program, mutation `useBulkCreateBeneficiariesMultiProgram` akan memanggil API secara berurutan untuk setiap sub-program

### Alur Upload

1. User download template (tombol "Download Template") — template sudah berisi kolom sub-program yang relevan
2. User isi data dan upload file `.csv`
3. PapaParse mem-parse file di browser (tidak ada upload ke server dulu)
4. Setiap baris divalidasi dengan `bulkBeneficiaryItemSchema` (Zod)
5. Preview tabel menampilkan status valid/invalid per baris
6. Hanya baris valid yang dikirim ke API saat klik "Unggah"

---

## Upload Merchant CSV

Komponen: `client/pages/programs/components/UploadMerchantCSVDialog.tsx`

Digunakan di halaman merchant program untuk mendaftarkan banyak merchant ke satu sub-program.

### Format Kolom CSV

| Nama Kolom (case-insensitive) | Field | Wajib |
|---|---|---|
| `Email` | `email` | ✅ |
| `Nama Lengkap` | `fullName` | ✅ |
| `Nomor Telepon` | `phoneNumber` | ✅ |
| `NIK` | `nik` | ✅ (16 karakter) |
| `Nama Usaha` | `businessName` | ✅ |
| `Nama Bank` | `bankName` | ✅ |
| `Nomor Rekening` | `bankAccountNumber` | ✅ |
| `Nama Pemilik Rekening` | `bankAccountHolder` | ✅ |
| `Alamat` | `alamat` | ❌ |
| `Latlon` | `latlon` | ❌ (format: `-6.200000,106.816666`) |

### Behavior Khusus

- `categoryId` otomatis diambil dari sub-program yang dipilih saat membuka dialog — tidak perlu diisi di CSV
- Validasi menggunakan `bulkMerchantItemSchema` (Zod)

### Alur Upload

Sama dengan beneficiary, namun mutation yang digunakan adalah `useBulkRegisterMerchantWithProgram(programId)`.

---

## Menambah Fitur CSV Upload Baru

Jika perlu menambah fitur upload CSV untuk entitas lain, ikuti pola yang sudah ada:

1. Buat schema Zod untuk satu item di `client/services/schemas/`
2. Buat mutation hook di `client/services/mutations/`
3. Buat komponen dialog dengan pola yang sama (PapaParse + validasi per baris + preview tabel)
4. Sediakan tombol download template dengan data contoh

Library yang digunakan:
- **PapaParse** (`papaparse`) — parsing CSV di browser
- **Zod** — validasi per baris
- `transformHeader` di PapaParse — normalisasi nama kolom agar case-insensitive
