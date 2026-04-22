# Deployment Guide

Presidana Admin adalah aplikasi **static SPA** yang di-build menjadi file HTML/CSS/JS statis, lalu di-serve menggunakan **Nginx** di dalam Docker container.

---

## Arsitektur Build

```
Source Code
    │
    ▼
Docker Build (multi-stage)
    ├── Stage 1: Install dependencies + build Vite (pnpm build:client)
    └── Stage 2: Copy dist/spa → Nginx container
                        │
                        ▼
                  Container berjalan di port 80
                  (di-expose ke host sesuai konfigurasi)
```

> Variabel environment (`VITE_*`) harus diberikan saat **build time**, bukan runtime, karena Vite meng-embed nilai tersebut langsung ke dalam bundle JS.

---

## Persiapan

### 1. Buat file `.env`

Salin dari `.env.example`:

```bash
cp .env.example .env
```

Isi variabel berikut di `.env`:

```env
VITE_API_BASE_URL=https://api.presidana.id      # URL backend API (wajib)
VITE_APP_BASE_URL=https://admin.presidana.id    # URL frontend ini (opsional, untuk redirect logout)
VITE_GOOGLE_MAPS_API_KEY=your_key_here          # Opsional
```

> `VITE_API_BASE_URL` adalah satu-satunya variabel yang wajib diisi.

### 2. Pastikan Docker sudah terinstall

```bash
docker --version
docker compose version
```

---

## Build & Jalankan dengan Docker Compose

```bash
# Build image dan jalankan container
docker compose up --build -d
```

Aplikasi akan berjalan di: **http://localhost:5173**

### Cek status container

```bash
docker compose ps
docker compose logs -f presidana-admin
```

### Stop container

```bash
docker compose down
```

---

## Build Image Manual (tanpa Compose)

Jika ingin build image secara manual dengan variabel tertentu:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.presidana.id \
  --build-arg VITE_APP_BASE_URL=https://admin.presidana.id \
  -t itluarsekolah/presidana-admin:latest .
```

Jalankan container dari image tersebut:

```bash
docker run -d \
  --name presidana-admin \
  -p 5173:80 \
  itluarsekolah/presidana-admin:latest
```

---

## Push ke Docker Registry

Image name yang digunakan: `itluarsekolah/presidana-admin:dev`

```bash
# Login ke Docker Hub
docker login

# Build dan push sekaligus via Compose
docker compose build && docker compose push
```

---

## Deploy ke Server (VPS)

Gunakan script `deploy.sh` yang sudah tersedia. Script ini akan:
1. Pull kode terbaru dari branch `main`
2. Build ulang image Docker
3. Push image ke registry
4. Restart container dengan image baru

```bash
# Pastikan sudah login Docker di server
docker login

# Jalankan deploy
chmod +x deploy.sh
./deploy.sh
```

> Pastikan file `.env` sudah ada di server sebelum menjalankan deploy.

---

## Konfigurasi Nginx

File: `nginx.conf`

Nginx dikonfigurasi untuk:

- **SPA fallback** — semua route diarahkan ke `index.html` agar React Router bisa menangani navigasi
- **Static assets** — folder `/profile-avatars/` di-serve langsung tanpa fallback
- **Security headers** — sudah terpasang header keamanan standar:
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection`
  - `Content-Security-Policy`

Jika perlu menambahkan domain eksternal ke CSP (misalnya CDN baru), edit bagian `Content-Security-Policy` di `nginx.conf`.

---

## Mengganti Port

Default port host adalah `5173`. Untuk menggantinya, edit `docker-compose.yaml`:

```yaml
ports:
  - "80:80"   # Ganti 5173 dengan port yang diinginkan
```

---

## Troubleshooting

**Aplikasi terbuka tapi API tidak bisa diakses (CORS/network error)**
→ Pastikan `VITE_API_BASE_URL` sudah benar dan backend mengizinkan origin dari domain frontend.

**Perubahan env tidak ter-apply setelah rebuild**
→ Variabel `VITE_*` di-embed saat build. Wajib build ulang image setiap kali mengubah nilai env:
```bash
docker compose up --build -d
```

**Route `/dashboard` menampilkan 404**
→ Pastikan konfigurasi Nginx menggunakan `try_files $uri $uri/ /index.html` — sudah terkonfigurasi di `nginx.conf`.

**Container tidak mau start**
```bash
docker compose logs presidana-admin
```
