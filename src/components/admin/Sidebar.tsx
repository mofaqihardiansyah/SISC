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
  MapPin
} from 'lucide-react';
import { Sidebar as SharedSidebar, MenuItem } from '@/components/layout/Sidebar';

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: FileCheck, label: 'Persetujuan', href: '/admin/persetujuan' },
  { icon: Users, label: 'Penyelenggara', href: '/admin/penyelenggara' },
  { icon: Calendar, label: 'Events', href: '/admin/events' },
  { icon: UserCog, label: 'Manajemen User', href: '/admin/manajemen-user' },
  { icon: Layers, label: 'Kategori & Tag', href: '/admin/categories' },
  { icon: MapPin, label: 'Master Wilayah', href: '/admin/locations' },
  { icon: Settings, label: 'Pengaturan', href: '/admin/pengaturan' },
];

export function Sidebar() {
  return <SharedSidebar roleTitle="Admin" menuItems={menuItems} />;
}
