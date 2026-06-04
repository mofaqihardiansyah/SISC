"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  CalendarRange, 
  Users, 
  UserCircle, 
  HelpCircle
} from "lucide-react";
import { Sidebar as SharedSidebar, MenuItem } from '@/components/layout/Sidebar';

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/penyelenggara", icon: LayoutDashboard, exactMatch: true },
  { label: "Kelola Event", href: "/penyelenggara/event", icon: CalendarRange },
  { label: "Informasi Peserta", href: "/penyelenggara/peserta", icon: Users },
  { label: "Profil Akun", href: "/penyelenggara/profil", icon: UserCircle },
  { label: "Bantuan", href: "/penyelenggara/bantuan", icon: HelpCircle },
];

export function Sidebar() {
  return <SharedSidebar roleTitle="Penyelenggara" menuItems={menuItems} />;
}
