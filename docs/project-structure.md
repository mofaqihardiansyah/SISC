# Laporan Pemeriksaan Struktur dan Kode Proyek (SISC)

## 1. Ikhtisar Proyek
Proyek ini (SISC) adalah aplikasi berbasis web yang dibangun menggunakan **Next.js 16.2.2** (App Router) dengan **TypeScript** dan **React 19**. 
Aplikasi ini menggunakan **Tailwind CSS** untuk *styling*, **Drizzle ORM** dengan **PostgreSQL** untuk *database*, serta **NextAuth.js (v5 Beta)** untuk autentikasi.

## 2. Struktur Direktori Utama

### `src/` - Kode Utama Aplikasi
- **`actions/`**: Berisi Server Actions untuk Next.js.
- **`app/`**: Menggunakan pola *App Router*. Memiliki berbagai *route group*:
  - `(admin)`: Panel admin (dashboard, kategori, event, persetujuan, manajemen pengguna).
  - `(auth)`: Rute autentikasi (login, register, forgot-password, reset-password).
  - `(organizer)`: Panel penyelenggara event (buat event, peserta, detail event, review paper).
  - `(user)`: Panel profil peserta umum (dashboard, event favorit, eventku, submit paper).
  - `api/`: Endpoint API REST (auth, admin, events, organizer, upload dengan Vercel Blob, inngest, cron, dll).
  - Rute publik: `event`, `jelajah`, `bantuan`, `registrasi-event`.
- **`components/`**: Komponen UI Reusable (shadcn/ui), Layout, komponen spesifik untuk Auth, Admin, Event, Penyelenggara, Profil, dll.
- **`constants/`**: Konstanta statis yang digunakan di berbagai file.
- **`db/`**: Skema Drizzle ORM, konfigurasi koneksi *database*, dan *seeders* untuk data *dummy*.
- **`lib/`**: Fungsi utilitas, *helpers*, konfigurasi *scraper* (menggunakan Crawlee), dan integrasi *background jobs* (Inngest).
  - `lib/scraper/utils.ts`: Shared scraping utilities (`parseIndoDate`, `sanitizeHtml`, `isSafeUrl`, `extractCityFromLocation`, `categorizeEvent`, `guessPlatform`)
  - `lib/constants.ts`: Centralized constants (`SITE`, `UI_TEXT`, `EVENT_TARGET_LABELS`, `DEFAULT_REGISTRATION_STEPS`, `DEFAULT_TERMS`, `SCRAPER`, `API`)
- **`types/`**: Definisi antarmuka dan tipe TypeScript global.

### Root Folder
- **`docs/`**: Dokumentasi sistem (API, arsitektur, auth, DFD, ERD, *database*, *deployment*, UX feedback).
- **`public/`**: Aset statis seperti gambar logo.
- **`drizzle/`**: File migrasi *database* dari Drizzle Kit.

## 3. Teknologi dan *Library* Penting (Berdasarkan `package.json`)
- **Framework Utama:** Next.js (16.2.2), React (19.2.4)
- **Database & ORM:** PostgreSQL (`pg`, `postgres`), Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Autentikasi:** NextAuth.js (`next-auth@beta`), bcryptjs
- **Penyimpanan File:** Vercel Blob (`@vercel/blob`)
- **UI & Styling:** Tailwind CSS v4, shadcn/ui, Radix UI (`@base-ui/react`), Lucide React
- **Form & Validasi:** React Hook Form, Zod, Hookform Resolvers
- **Notifikasi & Feedback:** Sonner, SweetAlert2, React Hot Toast
- **Latar Belakang / Pekerjaan Asinkron:** Inngest, Playwright (untuk Crawlee/Scraping)
- **Visualisasi Data:** Recharts, Chart.js

## 4. Evaluasi dan Catatan Kesehatan Proyek
1. **Pemisahan Peran (Role Separation):** Aplikasi sudah memisahkan *route group* dengan baik `(admin)`, `(organizer)`, `(visitor)`. Ini mempermudah manajemen rute dan *middleware* otorisasi.
2. **Modern Stack:** Menggunakan versi Next.js dan React yang sangat mutakhir (React 19 dan Next 16). 
3. **Keamanan:** Autentikasi ditangani dengan standar industri (NextAuth), dan *upload* file diintegrasikan ke *cloud storage* secara publik (Vercel Blob) dengan manajemen ukuran/tipe file melalui `route.ts` API. Scraping pipeline dilindungi dari SSRF dengan `isSafeUrl()`.
4. **Dokumentasi Lengkap:** Folder `docs` memiliki struktur dokumentasi yang komprehensif, mulai dari arsitektur, basis data, *deployment*, hingga DFD/ERD.
5. **Konsistensi Kode:** Nilai hardcode sudah dipusatkan ke `src/lib/constants.ts` (`SITE`, `UI_TEXT`, `EVENT_TARGET_LABELS`, `DEFAULT_REGISTRATION_STEPS`, `DEFAULT_TERMS`, `SCRAPER`). Shared utilities di `src/lib/scraper/utils.ts` mengurangi duplikasi antara 3 implementasi scraper.

## Kesimpulan
Struktur folder dan kode sudah sangat tertata dengan pola arsitektur berbasis fitur (Feature-Driven) menggunakan Next.js App Router. Penggunaan *Server Components*, *Server Actions*, dan ORM seperti Drizzle membuat aplikasi ini memiliki kinerja tinggi dan *type-safe*.
