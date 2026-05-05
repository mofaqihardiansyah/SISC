"use client";

import { usePathname } from "next/navigation";

export default function UserMenuWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  //route/halaman yang tidak akan memunculkan UserMenu
  const hiddenUserMenuPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/register/verify", "/penyelenggara"];

  // ini buat ngecek apakah path saat ini ada di hiddenUserMenuPaths
  const shouldHideUserMenu = hiddenUserMenuPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  if (shouldHideUserMenu) {
    return null;
  }

  return <>{children}</>;
}
