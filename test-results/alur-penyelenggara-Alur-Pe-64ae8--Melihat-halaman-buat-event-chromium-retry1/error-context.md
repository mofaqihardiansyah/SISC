# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: alur-penyelenggara.spec.ts >> Alur Penyelenggara (Organizer) >> Melihat halaman buat event
- Location: tests\alur-penyelenggara.spec.ts:19:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*penyelenggara\/buatevent/
Received string:  "http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fpenyelenggara%2Fbuatevent"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fpenyelenggara%2Fbuatevent"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e6]:
        - heading "Kelola acara dan tim anda dengan mudah." [level=2] [ref=e7]
        - paragraph [ref=e8]: Kelola pendaftaran, operasional acara, dan pengalaman peserta dalam satu dasbor pintar. Tingkatkan kualitas acara Anda bersama POLIVENTS.
      - generic [ref=e10]:
        - img "POLIVENTS" [ref=e12]
        - generic [ref=e13]:
          - generic [ref=e14]:
            - heading "Selamat Datang" [level=2] [ref=e15]
            - paragraph [ref=e16]: Masuk ke akun Anda untuk melanjutkan
          - generic [ref=e17]:
            - generic [ref=e18]:
              - generic [ref=e19]: Alamat Email
              - textbox "Alamat Email" [ref=e20]:
                - /placeholder: Masukkan email anda
            - generic [ref=e21]:
              - generic [ref=e22]:
                - generic [ref=e23]: Kata Sandi
                - link "Lupa kata sandi?" [ref=e24] [cursor=pointer]:
                  - /url: /forgot-password
              - generic [ref=e25]:
                - textbox "Kata Sandi" [ref=e26]:
                  - /placeholder: Masukkan kata sandi
                - button "Tampilkan kata sandi" [ref=e27]:
                  - img
            - button "Masuk" [ref=e29] [cursor=pointer]
          - paragraph [ref=e31]:
            - text: Belum punya akun?
            - link "Daftar sekarang." [ref=e32] [cursor=pointer]:
              - /url: /register
        - generic [ref=e33]:
          - paragraph [ref=e34]: Â© 2026 POLIVENTS.
          - generic [ref=e35]:
            - link "Ketentuan" [ref=e36] [cursor=pointer]:
              - /url: "#"
            - link "Kebijakan Privasi" [ref=e37] [cursor=pointer]:
              - /url: "#"
  - region "Notifications alt+T"
  - generic [ref=e42] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e43]:
      - img [ref=e44]
    - generic [ref=e47]:
      - button "Open issues overlay" [ref=e48]:
        - generic [ref=e49]:
          - generic [ref=e50]: "0"
          - generic [ref=e51]: "1"
        - generic [ref=e52]: Issue
      - button "Collapse issues badge" [ref=e53]:
        - img [ref=e54]
  - alert [ref=e56]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Alur Penyelenggara (Organizer)', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Login sebagai organizer
  6  |     await page.goto('/login');
  7  |     await page.waitForSelector('input[name="email"]');
  8  |     await page.fill('input[name="email"]', 'organizer@gmail.com');
  9  |     await page.fill('input[name="password"]', 'organizerpassword123');
  10 |     await page.click('button[type="submit"]');
  11 |     await page.waitForLoadState('networkidle');
  12 |   });
  13 | 
  14 |   test('Melihat dashboard organizer', async ({ page }) => {
  15 |     await page.goto('/penyelenggara');
  16 |     await expect(page).toHaveURL(/.*penyelenggara/);
  17 |   });
  18 | 
  19 |   test('Melihat halaman buat event', async ({ page }) => {
  20 |     await page.goto('/penyelenggara/buatevent');
> 21 |     await expect(page).toHaveURL(/.*penyelenggara\/buatevent/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  22 |     
  23 |     // Pastikan form pembuatan event terlihat
  24 |     await expect(page.locator('form')).toBeVisible().catch(() => {});
  25 |   });
  26 | 
  27 |   test('Melihat daftar event yang dikelola', async ({ page }) => {
  28 |     await page.goto('/penyelenggara/event');
  29 |     await expect(page).toHaveURL(/.*penyelenggara\/event/);
  30 |   });
  31 | });
  32 | 
```