# Design System — SISC

Dokumentasi design system, komponen UI, dan standarisasi visual untuk **Sistem Informasi Seminar & Conference (SISC)**.

---

## Design Tokens

Didefinisikan di `src/app/globals.css` menggunakan Tailwind CSS v4 `@theme` directive.

### Brand Colors

| Token | CSS Variable | Hex | Penggunaan |
|-------|-------------|-----|------------|
| `brand-dark` | `--brand-dark` | `#0F172B` | Background utama dark mode |
| `brand-primary` | `--brand-primary` | `#2563eb` | Tombol utama, link |
| `brand-primary-hover` | `--brand-primary-hover` | `#1d4ed8` | Hover state |
| `brand-accent` | `--brand-accent` | `#7c3aed` | Aksen |
| `brand-success` | `--brand-success` | `#16a34a` | Sukses |
| `brand-warning` | `--brand-warning` | `#d97706` | Peringatan |
| `brand-error` | `--brand-error` | `#dc2626` | Error |
| `brand-surface` | `--brand-surface` | `#f8fafc` | Surface |
| `brand-text-primary` | `--brand-text-primary` | `#1e293b` | Teks utama |
| `brand-text-secondary` | `--brand-text-secondary` | `#64748b` | Teks sekunder |
| `brand-text-muted` | `--brand-text-muted` | `#94a3b8` | Teks muted |

### SISC Legacy Colors

| Token | Hex |
|-------|-----|
| `sisc-navy` | `#0E215D` |
| `sisc-slate` | `#1E293B` |
| `sisc-dark` | `#1a2744` |
| `sisc-med` | `#243560` |
| `sisc-light` | `#a8c4f0` |
| `sisc-auth` | `#02336B` |
| `sisc-deep` | `#0a1845` |
| `sisc-nav` | `#13254C` |
| `sisc-hover` | `#1a3a8a` |
| `sisc-grid` | `#f0f0f0` |

### Typography

- Font: **Inter** (sans), **Montserrat** (heading)
- Custom sizes: `xxs` (10px), `micro` (11px), `nano` (9px), `sm2` (13px), `base2` (15px)

### Border Radius

- Base `--radius: 0.75rem` (12px)
- Variations: `sm` (0.6x), `md` (0.8x), `lg` (1x), `xl` (1.4x), `2xl` (1.8x), `3xl` (2.2x), `4xl` (2.6x)

### Animasi

```css
@keyframes fadeInUp {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-page-fade-in {
  animation: fadeInUp 0.3s ease-out forwards;
}
```

### Dark Mode

Full dark mode via `.dark` class dengan overrides menggunakan oklch color space.

---

## UI Components (15 komponen)

Semua komponen ada di `src/components/ui/`.

### Button (`button.tsx`)

| Prop | Values |
|------|--------|
| `variant` | `default`, `outline`, `secondary`, `ghost`, `destructive`, `success`, `link` |
| `size` | `default`, `xs`, `sm`, `lg`, `icon` |
| `loading` | boolean — menampilkan spinner + auto-disable |

### Input (`input.tsx`)
Styled input component menggunakan Base UI.

### FormField (`form-field.tsx`)
Wrapper untuk label + required indicator `*` + error message.

### Badge (`badge.tsx`)
Variant: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`.

### StatusBadge (`status-badge.tsx`)
Status dengan warna untuk paper submission. Styles: `belum_submit`, `review`, `accepted`, `rejected` — **sentence case**.

### Modal (`modal.tsx`)
3 variant: `center`, `side` (kanan), `side-left` (kiri). Dilengkapi backdrop blur dan animasi.

### Skeleton (`skeleton.tsx`)
Loading placeholder component.

### Lainnya
`card.tsx`, `table.tsx`, `tabs.tsx`, `breadcrumb.tsx`, `stepper.tsx`, `Portal.tsx`, `input-otp.tsx`, `label.tsx`

---

## Feedback Components (4 komponen)

Semua komponen ada di `src/components/feedback/`.

| Komponen | Variant | Use Case |
|----------|---------|----------|
| `InlineBanner` | `success`, `error`, `warning`, `info` + dismiss | Form error, network error sticky |
| `ConfirmationModal` | `danger`, `warning`, `info` + loading state | Delete confirmation |
| `ProgressOverlay` | Progress bar + `processed/total` + percentage | Bulk upload/processing |
| `FormState` | Success/error card transition | Paper submit confirmation |

---

## Layout Components (9 komponen)

Semua komponen ada di `src/components/layout/`.

### Navbar (`Navbar.tsx`)
Client component dengan `useSession()`. Sticky top, dark background, logo POLIVENTS. Desktop: links + UserMenu. Mobile: hamburger drawer.

### NavbarWrapper (`NavbarWrapper.tsx`)
Client component yang menyembunyikan navbar pada halaman auth/admin/organizer/profile via `shouldHideNavbar()`.

### SearchInput (`SearchInput.tsx`)
Autocomplete search di navbar. Debounce 300ms, fetch dari `/api/events`, maks 5 suggestions, navigasi ke `/jelajah?q=...`.

### Sidebar (`Sidebar.tsx`)
Reusable generic sidebar untuk semua dashboard role. Props: `roleTitle` + `menuItems[]`.

| Feature | Detail |
|---------|--------|
| Layout | Fixed 192px, dark slate (`bg-slate-900`) |
| Mobile | Hamburger button, slide-in left, backdrop blur, auto-close on navigate |
| Navigation | Single items + collapsible sub-items (dropdown) |
| Active state | Background putih (`bg-white text-slate-900`) untuk item aktif |
| Animasi | `transition-transform duration-300` |

### SharedDashboardTopbar (`SharedDashboardTopbar.tsx`)
Dynamic topbar untuk semua dashboard. Auto-detect title dari mapping `ROUTE_TITLES` berdasarkan pathname. Menampilkan `SharedDashboardUserMenu`.

### SharedDashboardUserMenu (`SharedDashboardUserMenu.tsx`)
Avatar + nama + role dropdown. Berisi menu items spesifik per role + tombol Keluar.

### UserMenu (`UserMenu.tsx`)
Dropdown di Navbar utama untuk logged-in user. Links: Dashboard, Beranda (visitor), Pengaturan, Keluar.

### SearchBar (`SearchBar.tsx`)
Simple search form (redirect ke `/jelajah?search=...`). Hanya muncul di desktop.

### UserMenuWrapper (`UserMenuWrapper.tsx`)
Conditional render untuk UserMenu di public pages. Sembunyikan di path tertentu.

### StatCard Variants per Role

| Role | Component | Karakteristik |
|------|-----------|---------------|
| Admin | `admin/StatCard.tsx` | Props: `color` (blue/yellow/purple/green/red), icon background solid, `rounded-3xl` |
| Organizer | `penyelenggara/StatCard.tsx` | Centered layout, icon box, trend badge (`rounded-xl`) |
| Profile | `profile/StatCard.tsx` | Gradient background, emoji icon, trend arrows (`rounded-2xl`) |

---

## Standarisasi

### Heading
Semua page heading menggunakan: `text-3xl font-bold text-slate-900 tracking-tight`

### Button
- Raw `<button>` → `<Button>` component di ~30 file
- Icon-only buttons wajib `aria-label`

### Input
- Raw `<input>` → `<Input>` component di ~31 file

### All-caps → Sentence Case
Status badges, chart legends, filter labels tidak boleh ALL-CAPS.
- ✅ `Disetujui`, `Published`, `Review`
- ❌ `DISETUJUI`, `PUBLISHED`, `REVIEW`

### Empty States
Komponen `<EmptyState>` reusable dipakai di 5+ halaman untuk menampilkan pesan ketika data kosong.

### Icon Policy
Gunakan **lucide-react**, dilarang menggunakan emoji keyboard di UI.

| ❌ Emoji | ✅ Lucide Icon |
|----------|----------------|
| `📅` | `Calendar` |
| `📋` | `ClipboardList` |
| `🖼️` | `ImageIcon` |
| `📎` | `Paperclip` |
| `🎨` | `Palette` |

### Page Transitions
Gunakan class `animate-page-fade-in` pada wrapper div halaman untuk animasi fade-in halus.
