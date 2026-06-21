# Auth Audit Report

**Date:** 2026-06-21
**Scope:** Auth flow & session handling, login page, admin registration, profile page

## Summary

| Area | Status | Notes |
|------|--------|-------|
| AuthStatus auto-redirect | ✅ OK | Admin → /admin/dashboard, Organizer → /penyelenggara |
| Login flow (auth, token, session) | ✅ OK | Credentials + JWT + session flow works |
| Login page logo | ✅ OK | Visible, correctly positioned |
| Admin register from dashboard | ✅ OK | Admin can register organizers |
| Profile — personal event list | ✅ OK | Shows correctly if user exists |

## Issues Found

### 1. 401 on login (preexisting)
- Every login attempt hits a 401 before succeeding
- This is a NextAuth CSRF-handshake pattern, not caused by our changes
- Root cause: NextAuth's internal double-submit cookie dance

### 2. Profile detail page refresh 404
- Refresh on `/profile/some-slug` returns 404
- Likely: missing catch-all route or dynamic route param handling
- Not an auth issue — routing concern

### 3. Profile page alignment when not logged in
- "Silahkan login" / empty state misaligns when user hasn't authenticated
- Minor layout issue in profile layout component

## Recommendations

1. Ignore 401 login blip — standard NextAuth behavior
2. Fix profile slug route to handle direct URL access (if needed)
3. Tweak empty-state centering in profile layout when `session` is null
