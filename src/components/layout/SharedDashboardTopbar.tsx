import React from 'react';
import SharedDashboardUserMenu, { UserMenuItem } from './SharedDashboardUserMenu';

interface SharedDashboardTopbarProps {
  title: string;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  roleTitle: string;
  menuItems: UserMenuItem[];
  children?: React.ReactNode;
}

export function SharedDashboardTopbar({ title, user, roleTitle, menuItems, children }: SharedDashboardTopbarProps) {
  return (
    <header className="h-20 bg-white border-b border-gray-100 pl-16 pr-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm transition-all">
      <div className="truncate pr-4">
        <h2 className="text-xl md:text-2xl font-bold font-heading text-gray-900">{title}</h2>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {children}
        {user && <SharedDashboardUserMenu user={user} roleTitle={roleTitle} menuItems={menuItems} />}
      </div>
    </header>
  );
}
