# SISC Project Report

> **Sistem Informasi Seminar & Conference (SISC)**  
> Laporan Analisis Lengkap Proyek — Diperbarui: 10 Juni 2026

---

## 1. Ringkasan Proyek

**SISC (Sistem Informasi Seminar & Conference)** — juga disebut **POLIVENTS** — adalah platform web untuk manajemen event seminar dan konferensi. Platform ini mendukung tiga peran pengguna utama:

| Peran | Deskripsi |
|-------|-----------|
| **Admin** | Mengelola seluruh event, user, kategori, tag, provinsi/kota, persetujuan event, validasi penyelenggara, pengaturan sistem |
| **Penyelenggara (Organizer)** | Membuat & mengelola event, mengelola peserta, melihat grafik, mengelola profil instansi |
| **Visitor (Peserta)** | Menjelajahi event, mendaftar event, mengirim paper, melihat dashboard pribadi, bookmark event |

### Fitur Utama
- Manajemen event (CRUD, approval, filtering, pencarian)
- Registrasi peserta event dengan sistem pembayaran (transfer bank/e-wallet/QRIS)
- Sistem submit & review paper/makalah
- Dashboard terpisah untuk setiap role dengan grafik (Recharts, Chart.js)
- Manajemen kategori, tag, provinsi & kota
- Validasi akses penyelenggara dengan upload dokumen legalitas
- Profil pengguna & pengaturan
- Upload file (banner event, paper, avatar, dokumen legalitas) via **Vercel Blob Store**
- Bookmark / event favorit
- Halaman bantuan (FAQ)
- Scraping event otomatis dari EventKampus (via Crawlee/Playwright + Inngest cron)
- Otentikasi email (OTP), forgot & reset password

---

## 2. Teknologi & Dependensi

### Core Stack

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| **Next.js** | 16.2.2 | Framework React full-stack (App Router) |
| **React** | 19.2.4 | Library UI |
| **TypeScript** | 5.x | Static typing |
| **PostgreSQL** | 16 (via Docker) | Database relasional |
| **Drizzle ORM** | 0.45.2 | Type-safe ORM |
| **NextAuth.js** | 5.0.0-beta.31 | Autentikasi (Credentials + JWT) |
| **Tailwind CSS** | 4.x | Utility-first CSS (via `@tailwindcss/postcss`) |
| **shadcn/ui** | (via `shadcn` package) | Komponen UI berbasis Base UI |

### Dependencies Utama

```json
{
  "next": "16.2.2",
  "react": "19.2.4",
  "next-auth": "^5.0.0-beta.31",
  "drizzle-orm": "^0.45.2",
  "postgres": "^3.4.9",
  "bcryptjs": "^3.0.3",
  "zod": "^4.3.6",
  "recharts": "^3.8.1",
  "chart.js": "^4.5.1",
  "lucide-react": "^1.17.0",
  "date-fns": "^4.1.0",
  "tailwindcss": "^4",
  "class-variance-authority": "^0.7.1",
  "sonner": "^2.0.7",
  "sweetalert2": "^11.26.24",
  "swiper": "^12.1.4",
  "input-otp": "^1.4.2",
  "nodemailer": "^7.0.13",
  "inngest": "^4.4.0",
  "@crawlee/playwright": "^3.16.0",
  "@vercel/blob": "^...",
  "xlsx": "^0.18.5"
}
```

---

## 3. Arsitektur & Struktur Folder

```
SISC/
├── drizzle/                       # Migrasi database
│   ├── 0000_funny_sentinel.sql
│   ├── 0001_ambitious_wraith.sql
│   ├── 0002_parched_miss_america.sql
│   ├── 0003_add_kata_kunci_track.sql
│   ├── 0004_add_tayangan_log.sql
│   ├── 0005_rename_columns_ke_indonesia.sql
│   └── meta/_journal.json
├── storage/                       # Artefak Crawlee
├── src/
│   ├── auth.ts                    # Konfigurasi NextAuth
│   ├── auth.config.ts             # Auth config (callbacks, authorized, JWT)
│   ├── proxy.ts                   # Proxy/Middleware NextAuth (Next.js 16)
│   ├── actions/                   # Server Actions
│   ├── app/                       # App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Homepage (ISR 60s)
│   │   ├── globals.css            # Global styles + design tokens
│   │   ├── (admin)/               # Admin route group
│   │   ├── (auth)/                # Auth route group
│   │   ├── (organizer)/           # Organizer route group
│   │   ├── (user)/                # User/Profile route group
│   │   ├── api/                   # API routes (15 route.ts)
│   │   ├── event/[id]             # Event detail (ISR 300s)
│   │   └── ...
│   ├── components/
│   │   ├── admin/                 # 5 komponen admin
│   │   ├── auth/                  # 1 komponen auth
│   │   ├── bantuan/               # 1 komponen bantuan
│   │   ├── event/                 # 2 komponen event
│   │   ├── feedback/              # 4 komponen feedback (BARU)
│   │   ├── layout/                # 9 komponen layout
│   │   ├── penyelenggara/         # 11 komponen organizer
│   │   ├── profile/               # 8 komponen profile
│   │   ├── shared/                # 9 komponen shared
│   │   └── ui/                    # 15 komponen UI (design system)
│   ├── db/
│   │   ├── index.ts               # DB connection
│   │   ├── schema.ts              # 20 tabel (Indonesia naming)
│   │   ├── seed-master.ts         # Reset + provinsi + kategori + users
│   │   ├── seed-event.ts          # Events + tags + jadwal + log
│   │   └── seed-demo.ts           # Bookmarks + pendaftaran + papers
│   └── lib/
│       ├── constants.ts
│       └── utils.ts
├── docker-compose.yml
├── drizzle.config.ts
├── next.config.ts
├── package.json
└── vercel.json
```

---

## 4. Database Schema

Database menggunakan **PostgreSQL 16** dengan **Drizzle ORM**. Schema didefinisikan di `src/db/schema.ts` — **20 tabel**.

### Enums

| Enum | Values |
|------|--------|
| `user_role` | `admin`, `organizer`, `visitor` |
| `event_status` | `draft`, `pending`, `published`, `rejected` |
| `jenis_event` | `seminar`, `conference` |
| `tipe_platform` | `online`, `offline`, `hybrid` |
| `tipe_harga` | `free`, `paid` |
| `paper_status` | `review`, `accepted`, `rejected` |
| `pendaftaran_status` | `terdaftar`, `dibatalkan`, `hadir` |
| `jenis_kelamin` | `Laki-laki`, `Perempuan` |

### Tabel (20)

| # | Tabel | Keterangan |
|---|-------|------------|
| 1 | `users` | Pengguna (serial PK) |
| 2 | `otp_codes` | Kode OTP |
| 3 | `profil_penyelenggara` | Profil Organizer |
| 4 | `provinsi` | Provinsi |
| 5 | `kota` | Kota/Kabupaten |
| 6 | `kategori` | Kategori Event |
| 7 | `tag` | Tag Event |
| 8 | `event_tag` | Relasi Event-Tag (M:N) |
| 9 | `event` | Event (tabel utama) |
| 10 | `lampiran_event` | Lampiran Event |
| 11 | `bookmark` | Bookmark Event |
| 12 | `log_admin` | Log Aktivitas Admin |
| 13 | `pendaftaran` | Pendaftaran Event |
| 14 | `transaksi` | Transaksi Pembayaran |
| 15 | `peserta` | Data Peserta |
| 16 | `paper_submission` | Paper Submission |
| 17 | `jadwal_event` | Jadwal Acara |
| 18 | `pemberitahuan` | Notifikasi |
| 19 | `favorit` | Favorit Event |
| 20 | `tayangan_log` | Log Tayangan |

**Indonesian Naming**: Semua properti tabel telah di-rename ke Bahasa Indonesia via migrasi `0005`. Contoh: `avatar_url` → `url_avatar`, `created_at` → `dibuat_pada`, `institution` → `institusi`, `banner_url` → `url_banner`, `is_event_polines` → `event_polines`.

### Relasi Database

```
users ──┬── profil_penyelenggara (1:1)
         ├── event (1:N, organizerId)
         ├── bookmark (1:N), log_admin (1:N)
         ├── pendaftaran (1:N), transaksi (1:N)
         ├── paper_submission (1:N), favorit (1:N)
event ──┬── event_tag, lampiran, bookmark, log_admin
         ├── pendaftaran, transaksi, jadwal
         ├── paper_submission, favorit, tayangan_log
kategori ── event (1:N)
kota ── event (1:N)
provinsi ── kota (1:N)
pendaftaran ── peserta (1:N)
transaksi ── peserta (1:N)
```

---

## 5. Autentikasi & Otorisasi

- **Library**: NextAuth.js v5 (beta) — Credentials Provider
- **Strategy**: JWT-based sessions
- **Password Hashing**: bcryptjs
- **Verifikasi Email**: Sistem OTP (`otp_codes` table)
- **Route Protection**: Next.js 16 `proxy.ts` dengan `auth.config.ts` callback `authorized`

### Protected Routes
```
/admin/*              → role "admin"
/penyelenggara/*      → role "organizer" atau "admin"
/profile/*            → Semua user login
/registrasi-event/*   → Semua user login
```

---

## 6. Routing & ISR Strategy

### ISR (Incremental Static Regeneration)

| Halaman | Strategy | Revalidate |
|---------|----------|------------|
| `/` (Homepage) | Static (ISR) | 60 detik |
| `/event/[id]` | ISR | 300 detik |
| Auth pages (`/login`, `/register`, dll) | Dynamic | — |
| Admin pages | Dynamic | — |
| Organizer pages | Dynamic | — |
| User/Profile pages | Dynamic | — |

**Architecture**: Navbar adalah client component dengan `useSession()` dari NextAuth. Ini memisahkan auth dari layout server, memungkinkan halaman publik di-cache via ISR tanpa kehilangan auth UI.

### Public Routes

| Path | File | ISR |
|------|------|:---:|
| `/` | `app/page.tsx` | ✅ 60s |
| `/login` | `app/(auth)/login/page.tsx` | ❌ |
| `/register` | `app/(auth)/register/page.tsx` | ❌ |
| `/register/verify` | `app/(auth)/register/verify/page.tsx` | ❌ |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | ❌ |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | ❌ |
| `/jelajah` | `app/jelajah/page.tsx` | ❌ |
| `/event/[id]` | `app/event/[id]/page.tsx` | ✅ 300s |
| `/registrasi-event/[eventID]` | `app/registrasi-event/[eventID]/page.tsx` | ❌ |
| `/bantuan` | `app/bantuan/page.tsx` | ❌ |

### Admin Routes

`/admin/dashboard`, `/admin/persetujuan`, `/admin/events`, `/admin/categories`, `/admin/locations`, `/admin/manajemen-user`, `/admin/penyelenggara`, `/admin/pengaturan`

### Organizer Routes

`/penyelenggara`, `/penyelenggara/buatevent`, `/penyelenggara/event`, `/penyelenggara/detail-event/[id]`, `/penyelenggara/peserta`, `/penyelenggara/review-paper`, `/penyelenggara/profil`, `/penyelenggara/bantuan`

### User Routes

`/profile`, `/profile/dashboard`, `/profile/eventku`, `/profile/event-favorit`, `/profile/submit-paper`, `/profile/settings`, `/profile/help`

---

## 7. API Routes

### Public
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/events` | Daftar event (filter, pagination) |
| POST | `/api/events/[id]/view` | Tambah view count |
| POST | `/api/upload` | Upload file via **Vercel Blob** |
| GET/POST | `/api/bookmark` | Bookmark event |

### Admin
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET/PUT | `/api/admin/users` | Manajemen user |
| GET/PUT | `/api/admin/pengaturan` | Pengaturan situs |

### Organizer
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/organizer/stats` | Statistik dashboard |
| GET | `/api/organizer/grafik` | Grafik peserta (Recharts) |
| GET | `/api/organizer/grafik-pendapatan` | Grafik pendapatan |
| GET | `/api/organizer/grafik-tayangan` | Grafik tayangan |
| GET/PATCH | `/api/organizer/peserta` | CRUD peserta |

### User
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET/PUT | `/api/user/profile` | Profil user |

### Internal
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/inngest` | Inngest handler |
| GET | `/api/cron/scrape` | Cron scraping (Vercel Cron) |

---

## 8. Design System & Komponen

### UI Components (`src/components/ui/`) — 15 files

| Komponen | Fitur |
|----------|-------|
| `button.tsx` | Variant: default, outline, secondary, ghost, destructive, **success**, link; size: default, xs, sm, lg, icon; **loading** prop (spinner + auto-disable) |
| `input.tsx` | Styled input dengan Base UI |
| `form-field.tsx` | **BARU**: Wrapper label + required `*` + error message |
| `badge.tsx` | Variant: default, secondary, destructive, outline, ghost, link |
| `status-badge.tsx` | Status dengan warna (belum_submit, review, accepted, rejected) — sentence case |
| `skeleton.tsx` | **BARU**: Loading placeholder |
| `modal.tsx` | **BARU**: 3 variant (center, side, side-left), backdrop blur, animasi |
| `card.tsx` | Container card |
| `table.tsx` | Styled table |
| `tabs.tsx` | Tab component |
| `breadcrumb.tsx` | Breadcrumb navigation |
| `stepper.tsx` | Step indicator |
| `Portal.tsx` | Portal untuk modal/dialog |
| `input-otp.tsx` | OTP input |
| `label.tsx` | Label component |

### Feedback Components (`src/components/feedback/`) — 4 files (BARU)

| Komponen | Fitur |
|----------|-------|
| `InlineBanner.tsx` | Variant success/error/warning/info + dismiss button |
| `ConfirmationModal.tsx` | Icon variant (danger/warning/info), loading state, Portal |
| `ProgressOverlay.tsx` | Progress bar + `processed/total (percentage%)` |
| `FormState.tsx` | Form → confirmation card transition, success/error variant |

### Design Tokens (`globals.css`)

```
brand-dark, brand-primary, brand-primary-hover, brand-accent
brand-success, brand-warning, brand-error
brand-surface, brand-text-primary, brand-text-secondary, brand-text-muted
sisc-navy, sisc-slate, sisc-dark, sisc-med, sisc-light, sisc-auth, dll.
```

---

## 9. Migrasi Database (6 file)

| File | Journal | Deskripsi |
|------|:-------:|-----------|
| `0000_funny_sentinel.sql` | ✅ idx 0 | Initial schema: 15 tabel + 8 enums |
| `0001_ambitious_wraith.sql` | ✅ idx 1 | Alter users: tambah pekerjaan, is_approved, dll |
| `0002_parched_miss_america.sql` | ✅ idx 2 | Alter event_status: tambah 'draft' |
| `0003_add_kata_kunci_track.sql` | ✅ idx 3 | Buat tabel favorit, pemberitahuan, transaksi |
| `0004_add_tayangan_log.sql` | ✅ idx 4 | Buat tabel tayangan_log (pindahan dari orphaned) |
| `0005_rename_columns_ke_indonesia.sql` | ✅ idx 5 | Rename semua kolom ke Bahasa Indonesia |

> **Catatan**: `0001_shocking_starfox.sql` (orphaned) telah dihapus. Kolom database telah di-rename ke Bahasa Indonesia via migrasi 0005.

### Seed Data (3 file — digabung dari 10)

| File | Isi |
|------|-----|
| `seed-master.ts` | Reset database + provinsi + kategori & tags + kota + users |
| `seed-event.ts` | 24 events + profil penyelenggara + tags + jadwal + log |
| `seed-demo.ts` | Bookmarks + pendaftaran & peserta + paper submissions |

**Semua URL file menggunakan placeholder eksternal** (picsum.photos, W3C sample PDF) — tidak lagi `/uploads/`.

---

## 10. UX/UI Improvements

### P1 — Feedback Fixes (SELESAI ✅)

| Task | File | Pattern |
|------|------|---------|
| Ganti `react-hot-toast` → `sonner` | 4 files | Toast |
| Feedback Categories/Locations CRUD | `CategoryClient.tsx`, `LocationClient.tsx` | Toast (12 action) |
| Feedback Admin Persetujuan | `ClientPage.tsx` | Toast approve/reject |
| Feedback Organizer Edit Event | `KelolaEventClient.tsx` | Toast |

### P2 — Design System (SELESAI ✅)

| Task | Detail |
|------|--------|
| Design tokens | `brand-*` colors di globals.css |
| Button.tsx | `loading` prop + `success` variant |
| Input standardization | ~31 file diperiksa, raw `<input>` → `<Input>` |
| Button standardization | ~30 file, raw `<button>` → `<Button>` + `aria-label` |
| Heading styles | 18 page heading → `text-3xl font-bold text-slate-900 tracking-tight` |
| Admin layout | `p-8` → `p-4 md:p-6 lg:p-8` (responsive) |
| Skeleton.tsx | Loading placeholder |
| FormField.tsx | Label + required + error wrapper |
| Modal.tsx | 3 variant + backdrop + animasi |
| Hamburger menu | Mobile drawer di Navbar |
| Empty states | 5 file → `<EmptyState>` component |
| All-caps → sentence case | Status badges, chart legends, filter labels |

### P3 — Feedback Components (SELESAI ✅)

| Komponen | File |
|----------|------|
| InlineBanner | `feedback/InlineBanner.tsx` |
| ConfirmationModal | `feedback/ConfirmationModal.tsx` |
| ProgressOverlay | `feedback/ProgressOverlay.tsx` |
| FormState | `feedback/FormState.tsx` |

---

## 11. Temuan & Potensi Masalah

### ✅ Sudah Diperbaiki
1. **Duplikasi migrasi** — orphaned file dihapus, migrasi 0004 + 0005 dibuat
2. **Proxy/Middleware** — `proxy.ts` aktif (Next.js 16)
3. **Folder residual** — `SISC/` dihapus
4. **Typo route** — `review-papper` → `review-paper`
5. **File upload** — Migrasi ke Vercel Blob Store + validasi magic bytes
6. **Hardcoded credentials** — Fallback di `drizzle.config.ts` dihapus
7. **README** — Diperbarui
8. **Mixed naming** — Kolom database di-rename ke Indonesia (migrasi 0005)
9. **Seed files** — 10 → 3 file
10. **ISR** — Halaman publik pakai ISR (60s/300s)
11. **Feedback** — Semua action punya feedback (sonner toast)
12. **Design system** — Design tokens, Button, Modal, Skeleton, FormField
13. **Button/Input konsistensi** — Semua pake komponen shared
14. **Heading konsisten** — 18 pages pake style seragam
15. **All-caps → sentence case** — Status badges, legends, filter labels
16. **Aksesibilitas** — aria-label di icon buttons
17. **Empty states** — Komponen reusable dipakai di 5 halaman
18. **Admin layout responsive** — Padding p-8 fix untuk mobile
19. **Detail event page** — Back button, sidebar active indicator
20. **API bug fix** — `/api/organizer/peserta` column name mismatch

### ❌ Masih Perlu Perbaikan
1. **Testing** — Belum ada unit/integration test
2. **Error boundaries** — Belum ada `error.tsx` di route groups
3. **Console.log di production code**
4. **Date formatting inkonsisten** — Campuran `date-fns` dan `toLocaleDateString()`
5. **`react-hot-toast`** — Masih terdaftar di package.json (meski sudah diganti sonner)
6. **Hardcoded colors** — 25+ file masih pakai HEX langsung, belum pake design tokens

---

## 12. Statistik Proyek

| Kategori | Jumlah |
|----------|:------:|
| Halaman (page.tsx) | 34 |
| API Routes (route.ts) | 15 |
| Components (.tsx) | ~70 |
| UI Components | 15 |
| Feedback Components | 4 |
| Database Tables | 20 |
| Migration Files | 6 (active) |
| Seed Files | 3 (digabung) |
| Total Estimasi LOC | ~12,000 |

---

## Commit Message

```
feat: overhaul UI/UX design system + feedback patterns + ISR architecture

- Tambah design tokens (brand-*) dan komponen UI: Button (loading+success),
  Modal (3 variant), Skeleton, FormField
- Standarisasi heading 18 page ke text-3xl font-bold tracking-tight
- Ganti raw <button>/<input> ke komponen shared di 60+ file
- Tambah aria-label ke icon-only buttons
- Fix semua feedback pattern: sonner toast di Categories/Locations CRUD,
  Admin Persetujuan, Organizer Edit Event (P1)
- Buat feedback components: InlineBanner, ConfirmationModal,
  ProgressOverlay, FormState (P3)
- Tambah hamburger menu mobile, responsive admin layout (p-8 fix)
- ISR: / (60s), /event/[id] (300s), Navbar client-side
- Rename kolom DB ke Indonesia (migrasi 0005), fix API peserta bug
- Gabung seed 10→3 file, ganti URL ke placeholder eksternal
- Fix all-caps text ke sentence case di status badges/charts/labels
- Standarisasi empty states (5 pages), tambah back button detail event
```

*Laporan dibuat berdasarkan analisis kode pada 10 Juni 2026.*
