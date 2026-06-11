# Getting Started — SISC

Panduan instalasi dan setup untuk **Sistem Informasi Seminar & Conference (SISC)** / POLIVENTS.

---

## Prasyarat

- **Node.js** v20+ LTS
- **Git**
- **Docker Desktop** (untuk database PostgreSQL lokal)
- **npm** (bundled with Node.js)

---

## Instalasi

```bash
git clone https://github.com/mofaqihardiansyah/SISC.git
cd SISC
npm install
```

---

## Konfigurasi Environment

Buat file `.env` di root proyek:

```env
# Database
DATABASE_URL="postgresql://sisc_user:sisc_password@localhost:5433/sisc_db"

# NextAuth
AUTH_SECRET="your-secret-key"

# Email (untuk OTP)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# Vercel Blob (untuk file upload)
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Inngest (untuk scraping)
INGEST_SIGNING_KEY="your-signing-key"
NEXT_PUBLIC_INNGEST_SIGNING_KEY="your-signing-key"

# App
NEXT_PUBLIC_URL="http://localhost:3000"
```

---

## Database

### Jalankan PostgreSQL via Docker

```bash
docker-compose up -d
```

PostgreSQL 16 berjalan di `localhost:5433`, user `sisc_user`, database `sisc_db`.

### Migrasi & Seed

```bash
# Push schema ke database
npm run db:push

# Seed data awal (kategori, provinsi, kota, users, events, demo)
npm run db:seed

# (Opsional) Buka Drizzle Studio
npm run db:studio
```

---

## Menjalankan Aplikasi

```bash
npm run dev
```

Kunjungi **http://localhost:3000**

---

## Scripts yang Tersedia

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Jalankan dev server (dengan NODE_OPTIONS memory 2GB) |
| `npm run build` | Build production |
| `npm run start` | Jalankan production server |
| `npm run lint` | ESLint check |
| `npm run db:push` | Push Drizzle schema ke database |
| `npm run db:seed` | Seed semua data (master + event + demo) |
| `npm run db:studio` | Buka Drizzle Studio |

---

## Tech Stack

| Teknologi | Versi |
|-----------|-------|
| Next.js | 16.2.2 (App Router) |
| React | 19.2.4 |
| TypeScript | 5.x |
| PostgreSQL | 16 (Docker) |
| Drizzle ORM | 0.45.2 |
| NextAuth.js | 5.0.0-beta.31 |
| Tailwind CSS | 4.x |
