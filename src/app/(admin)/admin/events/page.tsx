import React from 'react';
import { getAdminEvents, getAdminEventStats } from '@/actions/admin-event';
import ClientPage from './ClientPage';
import type { Event, Stats } from './ClientPage';

export const metadata = {
  title: 'Manajemen Event | Admin Dashboard',
  description: 'Kelola semua event yang ada di platform SISC.',
};

export default async function AdminEventsPage() {
  const eventsResponse = await getAdminEvents();
  const statsResponse = await getAdminEventStats();

  const initialEvents = eventsResponse.success && eventsResponse.data ? (eventsResponse.data as Event[]) : [];
  const initialStats = statsResponse.success && statsResponse.data ? (statsResponse.data as Stats) : { total: 0, seminar: 0, conference: 0, published: 0, polines: 0, umum: 0 };

  return (
    <ClientPage 
      initialEvents={initialEvents} 
      initialStats={initialStats} 
    />
  );
}
