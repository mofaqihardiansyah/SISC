"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck, 
  Users, 
  Calendar, 
  UserCog,
  Settings,
  Layers,
  MapPin,
  Database,
  Globe,
  ScrollText,
  ShieldCheck
} from 'lucide-react';
import { Sidebar as SharedSidebar, MenuItem } from '@/components/layout/Sidebar';

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: FileCheck, label: 'Persetujuan', href: '/admin/persetujuan' },
  { icon: Users, label: 'Penyelenggara', href: '/admin/penyelenggara' },
  {
    icon: Database,
    label: 'Master Data',
    subItems: [
      { icon: Calendar, label: 'Event', href: '/admin/events' },
      { icon: UserCog, label: 'Pengguna', href: '/admin/manajemen-user' },
      { icon: Layers, label: 'Kategori', href: '/admin/categories' },
      { icon: MapPin, label: 'Wilayah', href: '/admin/locations' },
    ]
  },
  {
    icon: Globe,
    label: 'Scraping',
    subItems: [
      { icon: ScrollText, label: 'Data & Log', href: '/admin/scraping', exactMatch: true },
      { icon: Settings, label: 'Konfigurasi', href: '/admin/scraping/sources' },
    ]
  },
  { icon: Settings, label: 'Pengaturan', href: '/admin/pengaturan' },
];

export function Sidebar() {
  return <SharedSidebar roleTitle="Admin" menuItems={menuItems} />;
}
