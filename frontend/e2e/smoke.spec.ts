import { test, expect } from '@playwright/test';

test('app shell loads at the root URL', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('app-root')).toBeVisible();
});
