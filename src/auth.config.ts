import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // Sesi expired dalam 24 jam
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as { role?: string })?.role;
      const path = nextUrl.pathname;

      const isAuthRoute = path.startsWith("/login") || path.startsWith("/register") || path.startsWith("/forgot-password") || path.startsWith("/reset-password");

      if (isAuthRoute) {
        if (isLoggedIn) {
          if (userRole === 'admin') return Response.redirect(new URL("/admin/dashboard", nextUrl));
          if (userRole === 'organizer') return Response.redirect(new URL("/organizer", nextUrl));
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // 1. Admin Routes Protection
      if (path.startsWith("/admin")) {
        if (!isLoggedIn) return false; // Lempar ke login
        if (userRole !== 'admin') {
          // kalo lu bukan admin, tendang ke dashboard masing-masing
          if (userRole === 'organizer') return Response.redirect(new URL("/organizer", nextUrl));
          return Response.redirect(new URL("/", nextUrl));
        }
        // Redirect from /admin to /admin/dashboard
        if (path === "/admin") return Response.redirect(new URL("/admin/dashboard", nextUrl));
        return true;
      }

      // 2. Organizer Routes Protection
      if (path.startsWith("/organizer")) {
        if (!isLoggedIn) return false;
        if (userRole !== 'organizer' && userRole !== 'admin') { 
          if (userRole === 'admin') return Response.redirect(new URL("/admin/dashboard", nextUrl));
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // 3. Visitor Protected Routes (ini buat visitor /dashboard)
      if (path.startsWith("/dashboard")) {
        if (!isLoggedIn) return false;
        return true;
      }

      // 4. Root Path Redirection (Jika sudah login, arahkan ke dashboard masing-masing)
      if (path === "/") {
        if (isLoggedIn) {
          if (userRole === 'admin') return Response.redirect(new URL("/admin/dashboard", nextUrl));
          if (userRole === 'organizer') return Response.redirect(new URL("/organizer", nextUrl));
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        (session.user as { role?: unknown }).role = token.role;
      }
      return session;
    },
  },
  providers: [], // Empty array as per Auth.js v5 requirement for edge-compatible config
} satisfies NextAuthConfig;
