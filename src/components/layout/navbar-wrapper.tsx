"use client";

import { usePathname } from "next/navigation";
import { shouldHideNavbar as checkHideNavbar } from "@/lib/route-config";

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldHide = checkHideNavbar(pathname);

  if (shouldHide) return null;

  return <>{children}</>;
}