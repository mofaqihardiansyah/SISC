# Integration Guide - Profile Dashboard

Panduan lengkap untuk mengintegrasikan profile dashboard dengan database dan backend.

## 🚀 Quick Start

### 1. Setup Environment Variables

Pastikan file `.env.local` Anda memiliki:
```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
```

---

## 📊 Database Integration

### Struktur Data Event
```typescript
// src/db/schema.ts - pastikan sudah ada table event
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  date: timestamp('date').notNull(),
  location: varchar('location').notNull(),
  organizerId: integer('organizer_id').notNull(),
  image: varchar('image'),
  // ... field lainnya
});
```

### Struktur Data User Events (untuk tracking favorit, pendaftaran)
```typescript
export const userEvents = pgTable('user_events', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  eventId: integer('event_id').notNull(),
  status: varchar('status').notNull(), // 'registered', 'favorited', 'completed'
  registeredAt: timestamp('registered_at').defaultNow(),
});
```

---

## 🔄 Server Actions untuk Data Fetching

### 1. Buat file: `src/lib/actions/user-events.ts`

```typescript
'use server';

import { db } from '@/db';
import { events, userEvents } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

// Get user's upcoming events
export async function getUserUpcomingEvents() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const result = await db
    .select()
    .from(userEvents)
    .innerJoin(events, eq(userEvents.eventId, events.id))
    .where(
      and(
        eq(userEvents.userId, parseInt(session.user.id)),
        eq(userEvents.status, 'registered')
      )
    );

  return result;
}

// Get user's favorite events
export async function getUserFavoriteEvents() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const result = await db
    .select()
    .from(userEvents)
    .innerJoin(events, eq(userEvents.eventId, events.id))
    .where(
      and(
        eq(userEvents.userId, parseInt(session.user.id)),
        eq(userEvents.status, 'favorited')
      )
    );

  return result;
}

// Toggle favorite
export async function toggleFavorite(eventId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const existing = await db
    .select()
    .from(userEvents)
    .where(
      and(
        eq(userEvents.userId, parseInt(session.user.id)),
        eq(userEvents.eventId, eventId),
        eq(userEvents.status, 'favorited')
      )
    );

  if (existing.length > 0) {
    // Remove from favorites
    await db
      .delete(userEvents)
      .where(eq(userEvents.id, existing[0].id));
    return { favorited: false };
  } else {
    // Add to favorites
    await db.insert(userEvents).values({
      userId: parseInt(session.user.id),
      eventId,
      status: 'favorited',
    });
    return { favorited: true };
  }
}

// Get dashboard stats
export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user?.id) return { active: 0, favorited: 0, registered: 0 };

  const active = await db
    .select()
    .from(userEvents)
    .where(
      and(
        eq(userEvents.userId, parseInt(session.user.id)),
        eq(userEvents.status, 'registered')
      )
    );

  const favorited = await db
    .select()
    .from(userEvents)
    .where(
      and(
        eq(userEvents.userId, parseInt(session.user.id)),
        eq(userEvents.status, 'favorited')
      )
    );

  return {
    active: active.length,
    favorited: favorited.length,
    registered: active.length,
  };
}
```

---

## 🎯 Update Dashboard Page

### File: `src/app/Profile/dashboard/page.tsx` (Updated)

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  EventCard, 
  PageHeader, 
  StatsCard, 
  EmptyState 
} from '@/components/profile';
import { 
  getUserUpcomingEvents, 
  getDashboardStats,
  toggleFavorite 
} from '@/lib/actions/user-events';

export default function UserDashboard() {
  const [stats, setStats] = useState({ active: 0, favorited: 0, registered: 0 });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsData = await getDashboardStats();
        const eventsData = await getUserUpcomingEvents();
        
        setStats(statsData);
        setEvents(eventsData.slice(0, 2)); // Ambil 2 event terakhir
        setFavorites(
          eventsData
            .filter((e) => e.user_events.status === 'favorited')
            .map((e) => e.events.id)
        );
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleToggleFavorite = async (eventId: number) => {
    try {
      const result = await toggleFavorite(eventId);
      setFavorites((prev) =>
        result.favorited
          ? [...prev, eventId]
          : prev.filter((id) => id !== eventId)
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Pengunjung"
        description="Selamat datang kembali! Berikut adalah ringkasan aktivitas Anda."
        icon="📊"
      />

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard label="Event Aktif" value={stats.active} icon="🏃" />
        <StatsCard label="Event Favorit" value={stats.favorited} icon="⭐" />
        <StatsCard label="Event Diikuti" value={stats.registered} icon="📅" />
      </div>

      {/* EVENTS */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Acara Terdekat</h2>
          <Link
            href="/profile/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Lihat Selengkapnya →
          </Link>
        </div>

        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event: any) => (
              <EventCard
                key={event.events.id}
                id={event.events.id}
                title={event.events.title}
                date={event.events.date}
                location={event.events.location}
                organizer={event.events.organizerId}
                isFavorited={favorites.includes(event.events.id)}
                onFavoriteToggle={() =>
                  handleToggleFavorite(event.events.id)
                }
                variant="list"
              />
            ))
          ) : (
            <EmptyState
              title="Tidak ada event terdekat"
              description="Mulai jelajahi event yang tersedia"
              action={{ label: "Jelajahi Event", href: "/profile/events" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 📱 Update Events Page

### File: `src/app/Profile/events/page.tsx` (Updated)

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { EventCard, PageHeader, EmptyState } from '@/components/profile';
import { getUserUpcomingEvents, toggleFavorite } from '@/lib/actions/user-events';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getUserUpcomingEvents();
        setEvents(data);
        setFilteredEvents(data);
        setFavorites(
          data
            .filter((e) => e.user_events.status === 'favorited')
            .map((e) => e.events.id)
        );
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by search
    if (search) {
      filtered = filtered.filter((e) =>
        e.events.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((e) => e.user_events.status === statusFilter);
    }

    setFilteredEvents(filtered);
  }, [search, statusFilter, events]);

  const handleToggleFavorite = async (eventId: number) => {
    try {
      await toggleFavorite(eventId);
      setFavorites((prev) =>
        prev.includes(eventId)
          ? prev.filter((id) => id !== eventId)
          : [...prev, eventId]
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Event Saya"
        description="Kelola semua event yang Anda ikuti atau daftarkan"
      />

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Cari event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Status</option>
          <option value="registered">Terdaftar</option>
          <option value="completed">Selesai</option>
        </select>
      </div>

      {/* EVENTS LIST */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event: any) => (
            <EventCard
              key={event.events.id}
              id={event.events.id}
              title={event.events.title}
              date={event.events.date}
              location={event.events.location}
              organizer={event.events.organizerId}
              isFavorited={favorites.includes(event.events.id)}
              onFavoriteToggle={() =>
                handleToggleFavorite(event.events.id)
              }
              variant="list"
            />
          ))
        ) : (
          <EmptyState
            title="Tidak ada event"
            description="Coba ubah filter atau jelajahi event baru"
            action={{ label: "Jelajahi Event", href: "/events" }}
          />
        )}
      </div>
    </div>
  );
}
```

---

## 🔐 Middleware Proteksi

Pastikan middleware di `src/middleware.ts` melindungi routes profile:

```typescript
export const config = {
  matcher: ['/profile/:path*'],
};

export default withAuth({
  pages: {
    signIn: '/login',
  },
});
```

---

## ✅ Checklist Implementasi

- [ ] Setup database schema untuk events dan user_events
- [ ] Create server actions di `src/lib/actions/user-events.ts`
- [ ] Update dashboard page dengan data real
- [ ] Update events page dengan data real
- [ ] Update favorites page dengan data real
- [ ] Setup middleware untuk proteksi route
- [ ] Test semua halaman dengan data dari database
- [ ] Add error handling dan loading states
- [ ] Test responsiveness
- [ ] Deploy ke production

---

## 🐛 Troubleshooting

### Problem: "Session is undefined"
**Solution**: Pastikan user sudah login sebelum mengakses profile pages. Check auth middleware.

### Problem: "Data tidak update"
**Solution**: Gunakan `revalidatePath()` setelah mutation atau gunakan React Query/SWR untuk caching.

### Problem: "Styling tidak konsisten"
**Solution**: Import dari `@/components/profile` dan pastikan Tailwind CSS sudah di-configure.

---

**Last Updated**: May 2026
