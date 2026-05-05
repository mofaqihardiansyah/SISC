import React from 'react';
import { auth } from "@/auth";
import UserMenu from "@/components/layout/UserMenu";

interface TopbarProps {
  title?: string;
}

export async function Topbar({ title = "User Profile" }: TopbarProps) {
  const session = await auth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {session?.user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {session.user.name}
              </p>
              <p className="text-xs text-slate-500">
                Pengunjung
              </p>
            </div>
            <UserMenu user={session.user} />
          </div>
        )}
      </div>
    </header>
  );
}
