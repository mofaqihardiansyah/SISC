# Panduan User Profile Dashboard

Struktur dashboard user-profile telah dibuat dengan layout yang konsisten dan dapat digunakan kembali untuk semua sub-menu.

## 📁 Struktur Folder

```
src/app/Profile/
├── layout.tsx                    # Layout utama dengan sidebar navigation
├── page-user-profile.tsx         # Halaman utama (masih bisa digunakan untuk redirect)
├── layout-userprofile.tsx        # File lama (dapat dihapus setelah migrasi)
├── dashboard/
│   └── page.tsx                  # Dashboard Pengunjung (halaman utama)
├── events/
│   └── page.tsx                  # Event Saya - daftar event yang diikuti
├── favorites/
│   └── page.tsx                  # Event Favorit - grid view favorit
├── tickets/
│   └── page.tsx                  # Tiket Saya - kelola tiket dengan QR code
├── settings/
│   └── page.tsx                  # Pengaturan Akun - profil & preferensi
└── help/
    └── page.tsx                  # Bantuan & Dukungan - FAQ & contact form
```

## 🎨 Fitur Utama

### 1. **Layout Konsisten** (`layout.tsx`)
- Sidebar navigasi yang responsif
- Top bar dengan info user
- Menu aktif dengan highlight biru
- Avatar user dengan inisial

### 2. **Dashboard Pengunjung** (`dashboard/page.tsx`)
- Stats cards dengan icon dan angka
- Acara Terdekat dengan detail event
- **Button "Lihat Selengkapnya"** ke halaman events
- Quick action cards (Jelajahi Event & Event Favorit)
- Event Card dengan tombol "Lihat Detail" dan "Favorit"

### 3. **Event Saya** (`events/page.tsx`)
- Daftar event dengan filter pencarian
- Status badge (Mendatang, Terdaftar, Selesai)
- Tombol aksi untuk lihat detail & favorit
- Filter by status

### 4. **Favorites** (`favorites/page.tsx`)
- Grid view untuk event favorit
- Kategori event
- Tombol hapus dari favorit
- Empty state dengan link ke jelajahi event

### 5. **Tiket Saya** (`tickets/page.tsx`)
- Display tiket dengan ID unik
- QR Code untuk setiap tiket
- Status terverifikasi/menunggu
- Tombol download & lihat detail
- Info event yang terkait

### 6. **Pengaturan Akun** (`settings/page.tsx`)
- Ubah foto profil
- Form edit informasi lengkap (nama, email, telepon, institusi, dll)
- Toggle notifikasi (email, SMS, push)
- Keamanan (ubah password, 2FA, kelola sesi)
- Zona bahaya (hapus akun)

### 7. **Bantuan** (`help/page.tsx`)
- FAQ dengan accordion
- Tautan cepat ke kebijakan, panduan, lapor bug
- Form kontak langsung
- Informasi kontak support

## 🚀 Cara Menggunakan Template

### Membuat Sub-Menu Baru

1. **Buat folder baru** di `src/app/Profile/` (misal: `src/app/Profile/myevents`)

2. **Buat file `page.tsx`** dengan template berikut:

```typescript
'use client';

import React from 'react';

export default function MyEventsPage() {
  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Judul Halaman</h1>
        <p className="text-slate-500 mt-2">Deskripsi singkat halaman</p>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        {/* Konten Anda di sini */}
      </div>
    </div>
  );
}
```

3. **Update `src/app/Profile/layout.tsx`** untuk menambahkan menu baru:

```typescript
const profileMenuItems = [
  // ... menu existing
  { href: '/profile/myevents', label: 'My Events', icon: '🎪' },
];
```

## 🎨 Tailwind Classes yang Digunakan

### Color Scheme
- **Primary Blue**: `bg-blue-600`, `text-blue-600`, `border-blue-500`
- **Background**: `bg-slate-50`, `bg-slate-900` (sidebar)
- **Text**: `text-slate-900`, `text-slate-500`, `text-slate-600`

### Components
- **Buttons**: `px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg`
- **Cards**: `bg-white rounded-xl border border-slate-200 p-6`
- **Input**: `px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500`
- **Badge**: `text-xs font-semibold px-3 py-1 rounded-full`

### Responsive
- Mobile-first approach
- `md:` breakpoint untuk tablet/desktop
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## 🔗 Routing

Pastikan routing sudah setup di Next.js:

```
/profile/dashboard          → Dashboard Pengunjung
/profile/events            → Event Saya
/profile/favorites         → Event Favorit
/profile/tickets           → Tiket Saya
/profile/settings          → Pengaturan Akun
/profile/help              → Bantuan
```

## 💡 Tips & Best Practices

1. **Gunakan `'use client'`** di awal file untuk interaktivitas
2. **Maintain spacing**: Gunakan `space-y-6` untuk konsistensi
3. **Responsive design**: Selalu test di mobile, tablet, desktop
4. **Loading states**: Tambahkan skeleton loader jika perlu fetch data
5. **Empty states**: Selalu sediakan pesan ketika tidak ada data
6. **Icons**: Gunakan emoji atau icon library yang konsisten
7. **Forms**: Gunakan controlled components dengan `useState`

## 🔄 Integrasi Database

Untuk menghubungkan dengan database:

1. Import functions dari `@/lib/actions/` atau `@/db/`
2. Ubah file menjadi `async` component atau gunakan Server Components
3. Fetch data dari database dan pass ke komponen

Contoh:
```typescript
import { getEvents } from '@/lib/actions/event';

export default async function EventsPage() {
  const events = await getEvents();
  
  return (
    // ... render events
  );
}
```

## 📝 Notes

- Semua halaman menggunakan Tailwind CSS untuk styling
- Layout responsif dan mobile-friendly
- Konsistensi warna dan spacing di semua halaman
- Siap untuk integrasi API/Database

---

**Last Updated**: May 2026
