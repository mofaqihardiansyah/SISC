'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SharedDashboardUserMenu, { UserMenuItem } from './SharedDashboardUserMenu';

interface SharedDashboardTopbarProps {
  title?: string;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  roleTitle: string;
  menuItems: UserMenuItem[];
  children?: React.ReactNode;
}

const ROUTE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard Admin',
  '/admin/dashboard': 'Dashboard Admin',
  '/admin/manajemen-user': 'Manajemen User',
  '/admin/persetujuan': 'Persetujuan Event',
  '/admin/categories': 'Master Kategori & Tag',
  '/admin/events': 'Kelola Semua Event',
  '/admin/locations': 'Master Wilayah',
  '/admin/penyelenggara': 'Validasi Penyelenggara',
  '/admin/pengaturan': 'Pengaturan Admin',
  '/penyelenggara': 'Dashboard Penyelenggara',
  '/penyelenggara/peserta': 'Data Peserta',
  '/penyelenggara/profil': 'Profil Penyelenggara',
  '/penyelenggara/bantuan': 'Pusat Bantuan',
  '/penyelenggara/event': 'Kelola Event',
  '/penyelenggara/buatevent': 'Buat Event Baru',
  '/profile/dashboard': 'Dashboard Tiket',
  '/profile/submit-paper': 'Submit Paper',
  '/profile/settings': 'Pengaturan Akun',
  '/profile/help': 'Pusat Bantuan',
  '/profile/eventku': 'Event Saya',
  '/profile/event-favorit': 'Event Favorit',
};

export function SharedDashboardTopbar({ title, user, roleTitle, menuItems, children }: SharedDashboardTopbarProps) {
  const pathname = usePathname() || '';
  
  let dynamicTitle = ROUTE_TITLES[pathname];
  
  if (!dynamicTitle) {
    if (pathname.startsWith('/penyelenggara/detail-event/')) {
      dynamicTitle = 'Detail Event';
    } else {
      const lastSegment = pathname.split('/').pop() || '';
      if (!lastSegment || /^\d+$/.test(lastSegment)) {
        // If last segment is empty or a number (like dynamic id), try using the parent folder name
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length >= 2) {
          const parentSegment = segments[segments.length - 2];
          dynamicTitle = parentSegment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        }
      } else {
        dynamicTitle = lastSegment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
    }
  }

  if (!dynamicTitle) {
    dynamicTitle = 'Dashboard';
  }

  return (
    <header className="h-20 bg-white border-b border-gray-100 pl-16 pr-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm transition-all">
      <div className="truncate pr-4">
        <h2 className="text-xl md:text-2xl font-bold font-heading text-gray-900">{dynamicTitle}</h2>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {children}
        {user && <SharedDashboardUserMenu user={user} roleTitle={roleTitle} menuItems={menuItems} />}
      </div>
    </header>
  );
}
