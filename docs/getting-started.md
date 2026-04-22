# Getting Started

## Prasyarat

Pastikan sudah terinstall:
- **Node.js** >= 18
- **pnpm** >= 10 — package manager utama proyek ini

Install pnpm jika belum ada:
```bash
npm install -g pnpm
```

## Instalasi

```bash
# Clone repository
git clone <repo-url>
cd presidana-admin

# Install dependencies
pnpm install
```

## Konfigurasi Environment

Salin file `.env.example` menjadi `.env` dan isi variabel yang dibutuhkan:

```bash
cp .env.example .env
```

Variabel environment yang tersedia ada di `client/env.ts`. Semua variabel frontend harus diawali dengan `VITE_`.

Contoh variabel penting:
```env
VITE_API_BASE_URL=http://localhost:8080
```

## Menjalankan Proyek

```bash
# Development (client + server sekaligus)
pnpm dev

# Build production
pnpm build

# Jalankan production server
pnpm start
```

## Perintah Lainnya

```bash
# TypeScript type checking
pnpm typecheck

# Jalankan test suite
pnpm test

# Format kode
pnpm format.fix
```

## Deployment

Proyek ini mendukung dua mode deployment:

### Docker
```bash
docker-compose up --build
```

### Netlify
Konfigurasi ada di `netlify.toml`. Fungsi serverless ada di `netlify/functions/api.ts`.

### Manual (VPS/Server)
Gunakan `deploy.sh` dan konfigurasi Nginx dari `nginx.conf`.
