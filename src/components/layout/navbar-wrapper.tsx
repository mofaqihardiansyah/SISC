"use client";

import { usePathname } from "next/navigation";

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  //route/halaman yang tidak akan memunculkan navbar
  const hideNavbarPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/register/verify", "/penyelenggara", "/admin/dashboard"];

  // ini buat ngecek apakah path saat ini ada di hideNavbarPaths
  const shouldHideNavbar = hideNavbarPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  if (shouldHideNavbar) {
    return null;
  }

  return <>{children}</>;
}
