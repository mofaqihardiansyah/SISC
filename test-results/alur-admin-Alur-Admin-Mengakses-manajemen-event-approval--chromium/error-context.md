# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: alur-admin.spec.ts >> Alur Admin >> Mengakses manajemen event (approval)
- Location: tests\alur-admin.spec.ts:24:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*admin\/persetujuan/
Received string:  "http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fadmin%2Fpersetujuan"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fadmin%2Fpersetujuan"

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
  3  | test.describe('Alur Admin', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Login sebagai admin
  6  |     await page.goto('/login');
  7  |     await page.waitForSelector('input[name="email"]');
  8  |     await page.fill('input[name="email"]', 'poliventsofficial@gmail.com');
  9  |     await page.fill('input[name="password"]', 'adminpassword123');
  10 |     await page.click('button[type="submit"]');
  11 |     await page.waitForLoadState('networkidle');
  12 |   });
  13 | 
  14 |   test('Melihat dashboard admin utama', async ({ page }) => {
  15 |     await page.goto('/admin/dashboard');
  16 |     await expect(page).toHaveURL(/.*admin\/dashboard/);
  17 |   });
  18 | 
  19 |   test('Mengakses manajemen user', async ({ page }) => {
  20 |     await page.goto('/admin/manajemen-user');
  21 |     await expect(page).toHaveURL(/.*admin\/manajemen-user/);
  22 |   });
  23 | 
  24 |   test('Mengakses manajemen event (approval)', async ({ page }) => {
  25 |     await page.goto('/admin/persetujuan');
> 26 |     await expect(page).toHaveURL(/.*admin\/persetujuan/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  27 |   });
  28 | });
  29 | 
```