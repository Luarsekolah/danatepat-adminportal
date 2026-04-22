# Arsitektur Sistem

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Routing | React Router 7 (SPA mode) |
| Styling | TailwindCSS 3, Radix UI |
| State (server) | TanStack Query v5 |
| State (client) | Zustand v5 |
| HTTP Client | Axios |
| Form | React Hook Form + Zod |
| Testing | Vitest |
| Package Manager | pnpm |

## Struktur Folder

```
presidana-admin/
├── client/                     # React SPA frontend
│   ├── App.tsx                 # Entry point, routing setup, providers
│   ├── main.tsx                # React DOM render
│   ├── global.css              # TailwindCSS theme & global styles
│   ├── env.ts                  # Typed environment variables
│   │
│   ├── pages/                  # Halaman / route components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Merchants.tsx
│   │   ├── Users.tsx
│   │   ├── Audit.tsx
│   │   ├── SettingLog.tsx
│   │   ├── programs/           # Fitur program (index, detail, beneficiary, merchant)
│   │   └── blockchain/         # Fitur blockchain transactions
│   │
│   ├── components/
│   │   ├── ui/                 # Komponen UI generik (shadcn/ui based)
│   │   ├── layout/             # ProtectedRoute, PublicRoute
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   │
│   ├── services/               # Lapisan integrasi API
│   │   ├── api.ts              # Axios instance
│   │   ├── api-config.ts       # Route names & TanStack Query keys
│   │   ├── queries/            # TanStack Query hooks (read)
│   │   ├── mutations/          # TanStack Query hooks (write)
│   │   └── schemas/            # Zod validation schemas
│   │
│   ├── stores/
│   │   └── auth-store.ts       # Zustand auth state (persisted)
│   │
│   ├── types/                  # TypeScript type definitions
│   └── lib/
│       ├── utils.ts            # cn() utility dan helpers
│       └── error-utils.ts      # Error handling utilities
│
├── docs/                       # Dokumentasi teknis (folder ini)
├── public/                     # Static assets
├── openapi.json                # OpenAPI spec backend
├── .env.example                # Template environment variables
├── docker-compose.yaml
├── Dockerfile
└── nginx.conf
```

## Alur Data

```
User Action
    │
    ▼
React Component (pages/)
    │
    ├── Read data  ──► TanStack Query Hook (services/queries/)
    │                       │
    │                       ▼
    │                  Axios (services/api.ts)
    │                       │
    │                       ▼
    │                  Backend API
    │
    └── Write data ──► TanStack Query Mutation (services/mutations/)
                            │
                            ▼
                       Axios (services/api.ts)
                            │
                            ▼
                       Backend API
```

## Autentikasi

- Login menghasilkan JWT token dari backend
- Token disimpan di `localStorage` via Zustand `persist` middleware (`auth-store`)
- Setiap request API menyertakan token di header `Authorization: Bearer <token>`
- Route dilindungi oleh `ProtectedRoute` component — redirect ke `/` jika tidak terautentikasi
- Route publik (login) dilindungi oleh `PublicRoute` — redirect ke `/dashboard` jika sudah login
