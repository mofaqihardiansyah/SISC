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
  { label: "Eventku", href: "/profile/eventku", icon: CalendarCheck },
  { label: "Event Favorit", href: "/profile/event-favorit", icon: Bookmark },
  { label: "Submit Paper", href: "/profile/submit-paper", icon: LibraryBig},
  { label: "Akun & Privasi", href: "/profile/settings", icon: Info },
  { label: "Bantuan", href: "/profile/help", icon: HelpCircle },
];

export function Sidebar() {
  return <SharedSidebar roleTitle="Pengunjung" menuItems={menuItems} />;
}
