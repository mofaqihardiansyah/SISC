export const HIDE_NAVBAR_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/register/verify",
  "/penyelenggara",
  "/admin",
  "/profile",
];

export const shouldHideNavbar = (pathname: string) => {
  return HIDE_NAVBAR_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
};
