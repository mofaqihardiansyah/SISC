# Architecture — SISC

Arsitektur dan struktur folder proyek **Sistem Informasi Seminar & Conference (SISC)**.

---

## Struktur Folder

```
SISC/
├── docs/                           # Dokumentasi proyek
├── drizzle/                        # Migrasi database (6 file SQL)
│   ├── 0000_funny_sentinel.sql
│   ├── 0001_ambitious_wraith.sql
│   ├── 0002_parched_miss_america.sql
│   ├── 0003_add_kata_kunci_track.sql
│   ├── 0004_add_tayangan_log.sql
│   ├── 0005_rename_columns_ke_indonesia.sql
│   └── meta/
├── storage/                        # Artefak Crawlee scraper
├── src/
│   ├── auth.ts                     # NextAuth konfigurasi (Credentials provider)
│   ├── auth.config.ts              # Auth callbacks, JWT, route protection
│   ├── proxy.ts                    # Next.js middleware proxy (NextAuth)
│   ├── providers.tsx               # Root providers (SessionProvider)
│   ├── actions/                    # 11 Server Actions
│   │   ├── admin-event.ts, auth.ts, categories-locations.ts
│   │   ├── create-event.ts, organizer-event.ts, organizer-paper.ts
│   │   ├── organizer.ts, paper.ts, persetujuan-event.ts
│   │   ├── peserta.ts, user-event.ts
│   ├── app/                        # App Router (34 pages, 15 API routes)
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Homepage (ISR 60s)
│   │   ├── globals.css             # Design tokens + Tailwind v4
│   │   ├── (admin)/                # Admin route group
│   │   ├── (auth)/                 # Auth route group
│   │   ├── (organizer)/            # Organizer route group
│   │   ├── (user)/                 # User profile route group
│   │   ├── api/                    # API routes
│   │   ├── event/[id]              # Event detail (ISR 300s)
│   │   ├── jelajah/                # Browse events
│   │   ├── registrasi-event/       # Event registration
│   │   ├── bantuan/                # FAQ page
│   │   └── eventku/                # Visitor my-events
│   ├── components/                 # 69 komponen React
│   │   ├── ui/                     # 15 design system components
│   │   ├── feedback/               # 4 feedback components
│   │   ├── admin/                  # 5 admin components
│   │   ├── penyelenggara/          # 9 organizer components
│   │   │   └── detail-event/       # 4 detail event components
│   │   ├── profile/                # 7 profile components
│   │   ├── shared/                 # 10 shared components
│   │   ├── layout/                 # 9 layout components
│   │   ├── event/                  # 3 event components
│   │   ├── auth/                   # 1 auth component
│   │   └── bantuan/                # 1 help component
│   ├── db/                         # Database layer
│   │   ├── index.ts                # Koneksi PostgreSQL
│   │   ├── schema.ts               # 21 tabel + 10 enums + relations
│   │   ├── seed.ts                 # Unified seed runner
│   │   ├── seed-master.ts          # Master data seed
│   │   ├── seed-event.ts           # Events seed
│   │   ├── seed-demo.ts            # Demo data seed
│   │   └── fix-seq.ts              # Sequence fix utility
│   └── lib/                        # 11 utility files
│       ├── api.ts, constants.ts, formatters.ts
│       ├── route-config.ts, utils.ts
│       ├── actions/                # Server action utilities
│       ├── inngest/                # Inngest client + functions
│       ├── scraper/                # Crawlee/Playwright engine
│       └── utils/                  # Image utilities
├── docker-compose.yml              # PostgreSQL 16 Alpine
├── drizzle.config.ts               # Drizzle Kit config
├── next.config.ts                  # Next.js config
├── package.json
└── vercel.json                     # Cron job config
```

---

## Routing & ISR Strategy

### ISR (Incremental Static Regeneration)

| Halaman | Strategy | Revalidate |
|---------|----------|------------|
| `/` (Homepage) | Static (ISR) | 60 detik |
| `/event/[id]` | ISR | 300 detik |
| Auth pages | Dynamic | — |
| Admin/Organizer/User pages | Dynamic | — |

### Public Routes

| Path | ISR | Keterangan |
|------|:---:|------------|
| `/` | ✅ 60s | Homepage dengan hero slider + event sections |
| `/login` | ❌ | Halaman login |
| `/register` | ❌ | Halaman registrasi |
| `/register/verify` | ❌ | Verifikasi OTP |
| `/forgot-password` | ❌ | Lupa password |
| `/reset-password` | ❌ | Reset password |
| `/jelajah` | ❌ | Browse & filter events |
| `/event/[id]` | ✅ 300s | Detail event |
| `/registrasi-event/[eventID]` | ❌ | Registrasi event |
| `/bantuan` | ❌ | FAQ / bantuan |
| `/eventku` | ❌ | Event saya (visitor) |

### Admin Routes

`/admin/dashboard`, `/admin/persetujuan`, `/admin/events`, `/admin/categories`, `/admin/locations`, `/admin/manajemen-user`, `/admin/penyelenggara`, `/admin/pengaturan`

### Organizer Routes

`/penyelenggara`, `/penyelenggara/buatevent`, `/penyelenggara/event`, `/penyelenggara/detail-event/[id]`, `/penyelenggara/peserta`, `/penyelenggara/review-paper`, `/penyelenggara/profil`, `/penyelenggara/bantuan`

### User Routes

`/profile`, `/profile/dashboard`, `/profile/eventku`, `/profile/event-favorit`, `/profile/submit-paper`, `/profile/settings`, `/profile/help`

---

## Middleware / Proxy

`proxy.ts` menggunakan NextAuth sebagai middleware Next.js 16 untuk melindungi rute:

```typescript
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

Route protection logic di `auth.config.ts`:
- `/admin/*` → hanya role `admin`
- `/penyelenggara/*` → role `organizer` atau `admin`
- `/profile/*` → semua user login
- `/registrasi-event/*` → semua user login
- Auth pages → redirect ke dashboard masing-masing role jika sudah login

---

## App Router Layout

### Component Tree

```
Root Layout (src/app/layout.tsx) — server component
├── Fonts: Montserrat (heading), Inter (sans, mono)
├── Providers (SessionProvider — client)
│   ├── NavbarWrapper (client — usePathname)
│   │   └── Navbar (client — useSession)
│   │       ├── Logo "POLIVENTS"
│   │       ├── SearchInput (autocomplete + debounce 300ms)
│   │       ├── Desktop: nav links + UserMenu / Login-Register
│   │       └── Mobile: hamburger → slide-in drawer
│   └── <main> Page Content
│       ├── Public Pages (no sidebar)
│       │   ├── Homepage, Jelajah, Event/[id], Bantuan, dll.
│       │   └── Auth Pages: auth-layout wrapper
│       ├── Admin Layout (layout.tsx)
│       │   ├── admin/Sidebar → layout/Sidebar (shared)
│       │   ├── admin/Topbar → SharedDashboardTopbar
│       │   │   └── SharedDashboardUserMenu
│       │   └── <main> p-4 md:p-6 lg:p-8
│       ├── Organizer Layout (layout.tsx)
│       │   ├── penyelenggara/Sidebar → layout/Sidebar (shared)
│       │   ├── penyelenggara/Topbar → SharedDashboardTopbar
│       │   │   ├── BuatEventButton
│       │   │   └── SharedDashboardUserMenu
│       │   └── <main> px-4 md:px-6 lg:px-8
│       └── Profile Layout (layout.tsx)
│           ├── profile/Sidebar → layout/Sidebar (shared)
│           ├── profile/Topbar → SharedDashboardTopbar
│           │   └── SharedDashboardUserMenu
│           └── <main> p-4 lg:p-8
└── Toaster (sonner)
```

### Navbar System

NavbarWrapper (client component) menentukan apakah navbar perlu ditampilkan berdasarkan pathname. Navbar disembunyikan pada halaman:

```typescript
HIDE_NAVBAR_PATHS = [
  "/login", "/register", "/register/verify",
  "/forgot-password", "/reset-password",
  "/penyelenggara", "/admin", "/profile",
];
```

Navbar adalah **client component** dengan `useSession()` dari NextAuth. Ini memisahkan auth dari layout server, memungkinkan halaman publik di-cache via ISR tanpa kehilangan auth UI.

**Desktop**: Links (Beranda, Jelajah, Bantuan) + UserMenu dropdown (Dashboard, Pengaturan, Keluar) atau tombol Daftar/Masuk untuk guest.

**Mobile**: Hamburger button → drawer slide-in dari kanan dengan backdrop blur. Menu mencakup links utama + profile links untuk logged-in user.

**SearchInput**: Autocomplete dengan debounce 300ms, fetch dari `/api/events`, menampilkan maksimal 5 suggestion, navigasi ke `/jelajah?q=...`.

### Dashboard Layout Pattern

Semua dashboard (Admin, Organizer, Profile) menggunakan pola yang sama:

1. **Sidebar** — Menggunakan `layout/Sidebar.tsx` (shared component) yang diinstansiasi per role dengan `menuItems` berbeda. Sidebar adalah generic component:
   - Props: `roleTitle` (string), `menuItems` (MenuItem[])
   - Mendukung navigasi items dan collapsible sub-items
   - **Desktop**: Fixed sidebar lebar 192px, dark slate theme
   - **Mobile**: Hamburger button, slide-in dari kiri, backdrop overlay, auto-close saat pindah halaman
   - Active state: Background putih untuk item aktif

2. **Topbar** — Menggunakan `layout/SharedDashboardTopbar.tsx` dengan dynamic title dari mapping route:
   - Menampilkan judul halaman berdasarkan pathname (`ROUTE_TITLES`)
   - `SharedDashboardUserMenu`: avatar + nama + role dropdown
   - Admin: `SITE.NAME` sebagai roleTitle
   - Organizer: "Penyelenggara" + `BuatEventButton` di samping
   - Profile: role dari session + fallback "Pengunjung"

3. **Content** — Dibungkus `max-w-7xl mx-auto` dengan `animate-page-fade-in`.

### Layout per Role

| Role | Layout File | Sidebar Items | Topbar Title Source |
|------|-------------|---------------|---------------------|
| **Admin** | `(admin)/admin/layout.tsx` | Dashboard, Persetujuan, Penyelenggara, Master Data (Event, Pengguna, Kategori, Wilayah), Pengaturan | Prop `title` + auto-detect |
| **Organizer** | `(organizer)/penyelenggara/layout.tsx` | Dashboard, Event, Peserta, Review Paper, Profil, Bantuan | Auto-detect dari route |
| **Visitor** | `(user)/profile/layout.tsx` | Dashboard, Riwayat, Favorit, Publikasi, Pengaturan, Bantuan | Auto-detect dari route |

### StatCard Variants

Tiap role punya variasi `StatCard` sendiri:

| Role | File | Gaya |
|------|------|------|
| Admin | `admin/StatCard.tsx` | Color-coded (blue/yellow/purple/green/red), icon background solid |
| Organizer | `penyelenggara/StatCard.tsx` | Centered layout, icon box + trend badge |
| Profile | `profile/StatCard.tsx` | Gradient background, emoji icon, trend arrows |

### Auth Layout

`components/auth/auth-layout.tsx` — wrapper component untuk halaman auth (login, register, forgot/reset password, verify OTP).

```
[45% - Image Panel (hidden mobile)]     [55% - Form Panel]
├── Background: /auth-bg.jpg            ├── Logo POLIVENTS (Image)
├── Dark overlay (slate-950/75)         ├── {children} (form content)
├── Left title (props leftTitle)        └── Footer: Copyright + Links
└── Description text
```

Digunakan di 5 halaman: `/login`, `/register`, `/register/verify`, `/forgot-password`, `/reset-password`.

### AuthStatus

`components/shared/AuthStatus.tsx` — client component yang me-redirect user yang sudah login ke dashboard masing-masing:
- `admin` → `/admin/dashboard`
- `organizer` → `/penyelenggara`
- `visitor` → tetap di halaman (no redirect)

Dipasang di **homepage** (`page.tsx`).

### Footer

`components/shared/Footer.tsx` — global footer di halaman public (`bg-brand-dark`):
- Brand: Nama + deskripsi SITE
- Links: FAQ, Kontak
- Links: Jelajah, Event Polines, Event Umum
- Copyright: `© {SITE.YEAR} {SITE.NAME}`
