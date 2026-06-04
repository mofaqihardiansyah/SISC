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
  { label: "Event", href: "/penyelenggara/event", icon: CalendarRange },
  { label: "Peserta", href: "/penyelenggara/peserta", icon: Users },
  { label: "Profil", href: "/penyelenggara/profil", icon: UserCircle },
  { label: "Bantuan", href: "/penyelenggara/bantuan", icon: HelpCircle },
];

export function Sidebar() {
  return <SharedSidebar roleTitle="Penyelenggara" menuItems={menuItems} />;
}
