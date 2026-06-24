# API — SISC

Dokumentasi endpoint REST API untuk **Sistem Informasi Seminar & Conference (SISC)**.

**Base URL**: `http://localhost:3000/api`

---

## Public Endpoints

### GET /api/events
Daftar event publik dengan filter dan pagination.

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `page` | number | Halaman (default: 1) |
| `limit` | number | Item per halaman (default: 6) |
| `q` | string | Pencarian judul (ilike) |
| `polines` | boolean | Filter event Polines |
| `price` | string | `Gratis` atau `Berbayar` |
| `location` | string | Filter by kota |
| `type` | string | `online`, `offline`, `hybrid` |
| `category` | string | Filter by kategori |
| `time` | string | `Hari Ini`, `Besok`, `Akhir Pekan`, `Minggu Ini`, `Minggu Depan`, `Bulan Ini`, `Bulan Depan` |
| `provinsi` | string | Filter by nama provinsi (requires `mode=provinsi`) |
| `platform` | string | Filter by tipe platform: `online`, `offline`, `hybrid` |
| `jenisEvent` | string | Filter by jenis event: `seminar`, `conference` |
| `sort` | string | `popular` — sort by `jumlah_tayangan` descending |
| `mode` | string | `kota` (return semua kota) atau `provinsi` (return semua provinsi dengan kota) atau `kategori` (return semua kategori) |

**Response**:
```json
{
  "events": [
    {
      "id": 1,
      "judul": "string",
      "urlBanner": "string",
      "harga": 0,
      "tipeHarga": "free|paid|null",
      "tipePlatform": "online|offline|hybrid",
      "jenisEvent": "seminar|conference",
      "eventPolines": true,
      "tanggalMulai": "2026-06-10T00:00:00.000Z",
      "tanggalSelesai": "2026-06-10T00:00:00.000Z",
      "status": "published",
      "kategoriNama": "string",
      "kotaNama": "string",
      "provinsiNama": "string",
      "penyelenggara": "string",
      "kuota": 300
    }
  ],
  "total": 50,
  "kota": [],
  "provinsi": [],
  "kategori": []
}
```

### POST /api/events/[id]/view
Mencatat tayangan event.

**Response**: `{ "success": true }`

### POST /api/upload
Upload file ke Vercel Blob Store.

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `file` | File | File to upload |
| `type` | string | `avatar`, `banner`, `document`, `paper`, `qris` |

Validasi magic bytes untuk keamanan file. Mendukung: JPEG, PNG, WebP, PDF.

**Response**: `{ "url": "https://...blob.vercel-storage.com/..." }`

### GET/POST /api/bookmark
Get atau toggle bookmark event. Membutuhkan autentikasi.

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `eventId` | number | ID event |

**GET Response**: `{ "bookmarked": true, "bookmark"?: { ... } }`

**POST Response**: `{ "bookmarked": true, "bookmark": { ... } }`

---

## Admin Endpoints

### GET/PUT /api/admin/users
Manajemen user oleh admin.

**Parameter GET**:
| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `type` | string | `stats` (return user statistics) |
| `userId` | number | Detail user by ID |
| (tanpa param) | | Daftar user dengan pagination |

**Stats Response**:
```json
{ "total": 100, "suspended": 5, "pending": 10, "active": 85 }
```

**PUT**: Update user (approve, suspend, change role).

### GET/PUT /api/admin/pengaturan
Pengaturan sistem oleh admin.

---

## Organizer Endpoints

### GET /api/organizer/stats
Statistik dashboard organizer.

**Response**:
```json
{
  "totalEvents": 10,
  "totalParticipants": 200,
  "totalRevenue": 5000000,
  "totalViews": 1500
}
```

### GET /api/organizer/grafik
Grafik peserta per bulan (Recharts).

### GET /api/organizer/grafik-pendapatan
Grafik pendapatan per bulan.

### GET /api/organizer/grafik-tayangan
Grafik tayangan per hari.

### GET/PATCH /api/organizer/peserta
CRUD data peserta untuk event organizer.

---

## User Endpoints

### GET/PUT /api/user/profile
Profil pengguna (membutuhkan login).

---

## Internal Endpoints

### POST /api/inngest
Handler untuk Inngest (event-driven scraping). Menerima trigger `app/scrape.start` untuk menjalankan crawler.

### GET /api/cron/scrape
Cron endpoint untuk scraping otomatis dari EventKampus. Dijalankan setiap hari pukul 00:00 UTC via Vercel Cron.

---

## Auth Endpoints

### POST /api/auth/[...nextauth]
NextAuth.js v5 endpoint untuk login. Body: `{ email, password, role }`.

### GET /api/auth/session
Mendapatkan session user saat ini.

---

## Error Response Format

```json
{
  "error": "Deskripsi error"
}
```

HTTP status codes: `401` (unauthorized), `403` (forbidden), `500` (internal error).

---

## Server Actions (src/actions/)

Selain REST API, terdapat **11 Server Actions** untuk operasi mutasi data:

| Action File | Fungsi |
|-------------|--------|
| `auth.ts` | Login, register, verify OTP, forgot/reset password |
| `create-event.ts` | Create event |
| `organizer-event.ts` | Edit, delete, manage organizer events |
| `organizer-paper.ts` | Review paper submissions |
| `organizer.ts` | Organizer profile management |
| `paper.ts` | Submit paper |
| `persetujuan-event.ts` | Admin approve/reject events |
| `peserta.ts` | Participant registration |
| `user-event.ts` | Visitor event management |
| `admin-event.ts` | Admin event management |
| `categories-locations.ts` | CRUD kategori, tag, provinsi, kota |
