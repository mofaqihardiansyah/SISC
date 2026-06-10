"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthStatus() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      const role = (session.user as { role?: string }).role;
      if (role === 'admin') router.replace('/admin/dashboard');
      else if (role === 'organizer') router.replace('/penyelenggara');
    }
  }, [session, router]);

  return null;
}
