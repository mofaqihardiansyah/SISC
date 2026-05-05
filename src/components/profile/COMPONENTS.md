# Komponen Reusable Profile

Dokumentasi untuk komponen-komponen reusable yang dapat digunakan di seluruh profile dashboard.

## 📦 Komponen Tersedia

### 1. EventCard
Komponen untuk menampilkan informasi event dalam dua varian: list dan grid.

**File**: `src/components/profile/EventCard.tsx`

**Props**:
```typescript
interface EventCardProps {
  id: string | number;           // ID event untuk link
  title: string;                 // Judul event
  date: string;                  // Tanggal event
  location: string;              // Lokasi event
  organizer: string;             // Nama organizer
  timeLeft?: string;             // Waktu tersisa (opsional)
  image?: string;                // URL gambar event
  status?: 'upcoming' | 'registered' | 'completed' | 'favorited';
  onFavoriteToggle?: () => void;  // Callback saat favorite ditekan
  isFavorited?: boolean;         // Status favorit
  variant?: 'list' | 'grid';     // Tipe tampilan
}
```

**Penggunaan**:
```typescript
import { EventCard } from '@/components/profile';

export default function MyPage() {
  return (
    <EventCard
      id={1}
      title="Seminar PPKS"
      date="11 April 2026"
      location="Auditorium Utama"
      organizer="bem_polines"
      timeLeft="1hr : 30m : 40s"
      variant="list"
      status="upcoming"
    />
  );
}
```

---

### 2. PageHeader
Komponen header standar untuk setiap halaman di profile.

**File**: `src/components/profile/PageHeader.tsx`

**Props**:
```typescript
interface PageHeaderProps {
  title: string;           // Judul halaman
  description?: string;    // Deskripsi panjang
  subtitle?: string;       // Subtitle tambahan
  icon?: string;          // Icon (emoji atau unicode)
  actions?: React.ReactNode; // Tombol atau aksi di kanan
}
```

**Penggunaan**:
```typescript
import { PageHeader } from '@/components/profile';

export default function MyPage() {
  return (
    <PageHeader
      title="Dashboard Pengunjung"
      description="Selamat datang kembali! Berikut adalah ringkasan aktivitas Anda."
      icon="📊"
      actions={<button>Refresh</button>}
    />
  );
}
```

---

### 3. StatsCard
Komponen untuk menampilkan statistik dengan icon dan nilai.

**File**: `src/components/profile/StatsCard.tsx`

**Props**:
```typescript
interface StatsCardProps {
  label: string;           // Label statistik
  value: string | number;  // Nilai/angka
  icon: string;           // Icon (emoji)
  trend?: {               // Tren opsional
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;    // Callback saat diklik
}
```

**Penggunaan**:
```typescript
import { StatsCard } from '@/components/profile';

export default function MyPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <StatsCard
        label="Event Aktif"
        value={6}
        icon="🏃"
        trend={{ value: 12, direction: 'up' }}
      />
    </div>
  );
}
```

---

### 4. EmptyState
Komponen untuk menampilkan pesan saat tidak ada data.

**File**: `src/components/profile/EmptyState.tsx`

**Props**:
```typescript
interface EmptyStateProps {
  icon?: string;          // Icon (emoji)
  title: string;          // Judul pesan
  description?: string;   // Deskripsi tambahan
  action?: {             // Link aksi (opsional)
    label: string;
    href: string;
  };
}
```

**Penggunaan**:
```typescript
import { EmptyState } from '@/components/profile';

export default function MyPage() {
  return (
    <EmptyState
      title="Anda belum memiliki event favorit"
      description="Jelajahi event yang tersedia dan tambahkan ke favorit."
      action={{
        label: "Jelajahi Event",
        href: "/events"
      }}
    />
  );
}
```

---

## 🎯 Import Cepat

Semua komponen dapat diimport dari `@/components/profile`:

```typescript
import { 
  EventCard, 
  PageHeader, 
  StatsCard, 
  EmptyState 
} from '@/components/profile';
```

---

## 🎨 Styling Consistency

Semua komponen menggunakan:
- **Color scheme**: Blue (primary), Slate (neutral), berbagai warna untuk status
- **Spacing**: `space-y-*` dan `gap-*` untuk konsistensi
- **Border radius**: `rounded-xl` untuk card, `rounded-lg` untuk button
- **Shadows**: `shadow-sm` untuk card, `hover:shadow-md` untuk interaktif

---

## 📋 Contoh Penggunaan Lengkap

```typescript
'use client';

import React from 'react';
import { 
  EventCard, 
  PageHeader, 
  StatsCard, 
  EmptyState 
} from '@/components/profile';

export default function DashboardPage() {
  const events = [/* data */];
  const stats = [/* data */];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Dashboard Saya"
        description="Kelola semua aktivitas event Anda"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Events */}
      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event.id} {...event} variant="list" />
          ))
        ) : (
          <EmptyState
            title="Tidak ada event"
            action={{ label: "Cari Event", href: "/events" }}
          />
        )}
      </div>
    </div>
  );
}
```

---

## 🔄 Tips untuk Custom Styling

Jika ingin memodifikasi styling, Anda bisa:

1. **Pass className tambahan** melalui wrapper:
```typescript
<div className="custom-class">
  <EventCard {...props} />
</div>
```

2. **Duplicate dan customize** komponen untuk kebutuhan khusus
3. **Extend Tailwind** di `tailwind.config.ts` jika perlu warna custom

---

## 📝 Next Steps

1. Update halaman-halaman profile menggunakan komponen ini
2. Tambahkan loading states dan error handling
3. Integrasikan dengan data dari database
4. Tambahkan animasi dan transitions
5. Test responsiveness di berbagai ukuran device

---

**Last Updated**: May 2026
