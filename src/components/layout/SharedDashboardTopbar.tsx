'use client';

import React from 'react';
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

import { useSidebar } from './SidebarContext';

export function SharedDashboardTopbar({ user, roleTitle, menuItems, children }: SharedDashboardTopbarProps) {
  const { toggleSidebar } = useSidebar();
  
  return (
    <header className="h-14 bg-white border-b border-gray-100 px-4 md:px-8 flex items-center justify-between relative shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-900 p-2"
          aria-label="Toggle Sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16M4 10h16M4 14h16" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {children}
        {user && <SharedDashboardUserMenu user={user} roleTitle={roleTitle} menuItems={menuItems} />}
      </div>
    </header>
  );
}
