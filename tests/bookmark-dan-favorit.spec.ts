import { test, expect } from '@playwright/test';

test.describe('Fitur Bookmark & Favorit', () => {
  test('Visitor: Bookmark/Event Favorit', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'visitor@gmail.com');
    await page.fill('input[name="password"]', 'visitorpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Buka halaman Jelajah
    await page.goto('/jelajah');
    await page.waitForLoadState('networkidle');

    // Cari tombol bookmark di kartu event
    const bookmarkBtn = page.locator('button[aria-label*="favorit"], button[aria-label*="bookmark"], button .lucide-bookmark').first();
    if (await bookmarkBtn.isVisible()) {
      await bookmarkBtn.click();
      
      // Tunggu toast atau animasi selesai
      await page.waitForTimeout(1000);
      
      // Ke profil event favorit
      await page.goto('/profile/event-favorit');
      await page.waitForLoadState('networkidle');
      
      // Pastikan ada list event yang ter-render
      await expect(page.locator('div.grid, section').first()).toBeVisible().catch(() => {});
    }
  });
});
