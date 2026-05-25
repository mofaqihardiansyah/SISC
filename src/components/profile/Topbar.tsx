import React from 'react';
import { auth } from "@/auth";
import UserMenu from "@/components/layout/UserMenu";
import { db } from "@/db";

interface TopbarProps {
  title?: string;
}

export async function Topbar({ title = "User Profile" }: TopbarProps) {
  const session = await auth();
  
  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, Number(session.user.id)),
    });
  }

  // Combine session data with latest DB data (especially for avatarUrl)
  const user = dbUser ? {
    name: dbUser.namaLengkap || session?.user?.name || "Demo User",
    email: dbUser.email || session?.user?.email || "demo@example.com",
    image: dbUser.avatarUrl || session?.user?.image,
    role: session?.user?.role,
  } : session?.user || {
    name: "Demo User",
    email: "demo@example.com",
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {user.role || 'Pengunjung'}
              </p>
            </div>
            {session?.user && <UserMenu user={user} />}
          </div>
        )}
      </div>
    </header>
  );
}
