# POLIVENTS

Aplikasi SISC (juga disebut **POLIVENTS**) adalah platform web untuk manajemen event seminar dan konferensi. Dibangun menggunakan **Next.js 16 (App Router)**, **PostgreSQL (Docker)**, dan **Drizzle ORM**.

### Fitur Utama
- Manajemen event (CRUD, approval, filtering, pencarian)
- Registrasi peserta event dengan pembayaran (transfer bank / e-wallet / QRIS)
- Submit & review paper/makalah
- Dashboard per role dengan grafik (Recharts, Chart.js)
- Scraping event otomatis dari EventKampus (Crawlee/Playwright + Inngest)
- Autentikasi email (OTP), forgot & reset password
- Bookmark event favorit
- Validasi penyelenggara dengan dokumen legalitas

---

## 📌 1. Persiapan Instalasi Wajib

Pastikan Anda telah menginstal software berikut:

1. **[Node.js](https://nodejs.org/)** (v20+ LTS)
2. **[Git](https://git-scm.com/)**
3. **[Docker Desktop](https://www.docker.com/products/docker-desktop)** (Wajib untuk database lokal)

---

## 🚀 2. Cara Install & Setup Proyek

### Kloning & Install Dependencies

```bash
git clone https://github.com/mofaqihardiansyah/SISC.git
cd SISC
npm install
```

### Konfigurasi `.env`

Buat file bernama `.env` di root proyek:

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
# Dapatkan token dari https://vercel.com/docs/storage/vercel-blob
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Inngest (untuk scraping)
INGEST_SIGNING_KEY="your-signing-key"

# App
NEXT_PUBLIC_URL="http://localhost:3000"
```

---

## 🐳 3. Menjalankan Database PostgreSQL

```bash
docker-compose up -d
```

PostgreSQL 16 akan berjalan di `localhost:5433`, user `sisc_user`, database `sisc_db`.

---

## 🗄️ 4. Setup Database (Migrasi & Seed)

```bash
# Sinkronisasi skema
npm run db:push

# Isi data awal (kategori, provinsi, kota, akun dummy)
npm run db:seed

# (Opsional) Lihat database via Drizzle Studio
npm run db:studio
```

---

## ▶️ 5. Menjalankan Aplikasi

```bash
npm run dev
```

Kunjungi **http://localhost:3000**

---

## 👥 Role & Akun Default

| Role | Email | Password |
|------|-------|----------|
| Admin | (lihat seed) | - |
| Organizer | (lihat seed) | - |
| Visitor | (lihat seed) | - |

---

## 🐳 Docker

```yaml
Services:
  postgres:16-alpine (port 5433)
  Database: sisc_db
  User: sisc_user
```

---

## ⚠️ Aturan Kolaborasi

- **Jangan komit langsung ke `main`**. Buat _branch_ fitur.
- Sebelum membuat branch baru, `git pull origin main`.
- Format branch: `feature/nama-fitur-anda`.
