# Frontend Audit — Ponytail Compliance

**Date:** 2026-06-21
**Scope:** Beranda (`src/app/page.tsx`), Jelajah (`src/app/jelajah/page.tsx`), Shared Components (`src/components/shared/`)

---

## Beranda Page (`src/app/page.tsx`)

| Check                  | Status | Notes                                                                                                            |
| ---------------------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| Server component       | ✅     | Async server component                                                                                           |
| Data fetching          | ✅     | Single `Promise.all`, no N+1                                                                                   |
| AuthStatus usage       | ⚠️   | Mounts auth check client component for all visitors. Small tax, acceptable for passive redirect                  |
| `isLoggedIn={false}` | ⚠️   | Hardcoded false — logged-in homepage visitors won't see bookmark buttons. Intentional (bookmark on detail page) |
| No error boundary      | ⚠️   | If any DB query fails, the whole page crashes                                                                    |
| Constants usage        | ⚠️   | "Polines" hardcoded in organizerLabel                                                                            |
| Empty states           | ✅     | Carousel and sections have empty states                                                                          |

**Ponytail issues:** None blocker. Error boundary would be nice but YAGNI unless server errors are common.

---

## Jelajah Page (`src/app/jelajah/page.tsx`)

| Check                           | Status | Notes                                                                                   |
| ------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| `'use client'`                | ❌     | Entire page is client-rendered. Data fetching could be server-side                      |
| Duplicate footer                | ❌     | Inline footer (lines 369–385) duplicates `Footer` component, hardcodes "POLIVENTS"   |
| `kotaNama` / `kategoriNama` | ❌     | Passed as `undefined` in EventCard — footer shows "-" for both                       |
| No search input                 | ⚠️   | Reads `q` from URL params but has no search box in markup (relies on external header) |
| Filter accordion                | ✅     | Clean dropdown pattern, active filter indicator dots                                    |
| State management                | ⚠️   | 6 `useState` + 3 `useEffect` — could be simplified                                 |
| Debounce                        | ⚠️   | Manual 300ms setTimeout — fine but not extracted                                       |

**Ponytail issues:** Inline footer duplication violates "deletion over addition." This should be removed in favor of the shared Footer component. The `kotaNama`/`kategoriNama` undefined bug hides event metadata from card footers.

---

## Shared Components (`src/components/shared/`)

| Component                | Status | Issues                                                                                                                        |
| ------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `KategoriCarousel.tsx` | ❌     | **Hardcoded icon/color map** — new DB categories get generic `Tag` icon + gray background. `urlIkon` field ignored |
| `EventCard.tsx`        | ✅     | Clean. Uses `normalizeImagePath`, proper fallbacks                                                                          |
| `EventSection.tsx`     | ✅     | Clean grid + empty state                                                                                                      |
| `HeroSlider.tsx`       | ✅     | Swiper with autoplay, pagination, proper loading                                                                              |
| `Footer.tsx`           | ✅     | Uses `SITE.*` constants                                                                                                     |
| `BookmarkButton.tsx`   | ✅     | Session-aware, optimistic UI                                                                                                  |
| `AuthStatus.tsx`       | ⚠️   | Single-use, could inline into layout                                                                                          |
| `FileUpload.tsx`       | ✅     | Clean dropzone + button variant                                                                                               |
| `ImageUpload.tsx`      | ✅     | Thin wrapper                                                                                                                  |
| `LoadingSpinner.tsx`   | ✅     | One-liner                                                                                                                     |

---

## Priority Fixes

1. **P0 — KategoriCarousel icon/color**: `urlIkon` field from DB is ignored. New categories get generic icon + gray color. Use `urlIkon` as image for unknown slugs, derive color from slug hash.
2. **P1 — Jelajah duplicate footer**: Replace inline footer with shared `Footer` component.
3. **P1 — Jelajah `kotaNama`/`kategoriNama` undefined**: Pass actual data from API response to EventCard.
4. **P2 — Jelajah search input**: Verify external search is wired correctly.
5. **P3 — Error boundaries**: Nice-to-have for server components.
