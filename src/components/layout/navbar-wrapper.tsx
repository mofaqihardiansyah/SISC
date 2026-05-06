"use client";

import { usePathname } from "next/navigation";

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbarPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/register/verify",
    "/penyelenggara",
    "/admin/dashboard",
    "/Profile/dashboard",
    "/Profile/settings",
    "/Profile/events",
    "/Profile/favorites",
    "/Profile/help",
    "/eventfavorit"
  ];

  const shouldHideNavbar = hideNavbarPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (shouldHideNavbar) {
    return null;
  }

  return <>{children}</>;
}