# Presidana Admin — Technical Documentation

Selamat datang di dokumentasi teknis **Presidana Admin**, sebuah platform admin untuk manajemen distribusi bantuan digital berbasis blockchain.

## Daftar Dokumen

| Dokumen | Deskripsi |
|---|---|
| [getting-started.md](./getting-started.md) | Setup awal, instalasi, dan menjalankan proyek lokal |
| [deployment.md](./deployment.md) | Build & deploy dengan Docker, push image, konfigurasi Nginx |
| [architecture.md](./architecture.md) | Arsitektur sistem, struktur folder, dan alur data |
| [routing.md](./routing.md) | Sistem routing SPA dan daftar halaman |
| [api-integration.md](./api-integration.md) | Cara integrasi API, daftar semua query & mutation hooks |
| [state-management.md](./state-management.md) | Manajemen state dengan Zustand dan TanStack Query |
| [data-types.md](./data-types.md) | Tipe data, response structure, dan environment variables |
| [error-handling.md](./error-handling.md) | Error utilities, interceptor 401, dan pola penanganan error |
| [ui-components.md](./ui-components.md) | Panduan penggunaan komponen UI dan sistem styling |
| [csv-upload.md](./csv-upload.md) | Fitur bulk upload CSV untuk beneficiary dan merchant |

## Gambaran Singkat Proyek

Presidana Admin adalah dashboard web untuk mengelola:
- **Program bantuan** — buat, kelola, dan pantau program distribusi
- **Merchant** — daftarkan dan kelola merchant penerima dana
- **Beneficiary** — kelola penerima manfaat per program
- **Blockchain** — pantau transaksi distribusi dan pembayaran
- **Users & Audit** — manajemen pengguna dan log aktivitas
