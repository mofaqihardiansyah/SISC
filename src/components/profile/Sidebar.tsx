"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Bookmark, 
  LibraryBig,
  Info, 
  HelpCircle
} from "lucide-react";
import { Sidebar as SharedSidebar, MenuItem } from '@/components/layout/Sidebar';

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/profile/dashboard", icon: LayoutDashboard },
  { label: "Riwayat", href: "/profile/eventku", icon: CalendarCheck },
  { label: "Favorit", href: "/profile/event-favorit", icon: Bookmark },
  { label: "Publikasi", href: "/profile/submit-paper", icon: LibraryBig},
  { label: "Pengaturan", href: "/profile/settings", icon: Info },
  { label: "Bantuan", href: "/profile/help", icon: HelpCircle },
];

export function Sidebar() {
  return <SharedSidebar roleTitle="Pengunjung" menuItems={menuItems} />;
}
