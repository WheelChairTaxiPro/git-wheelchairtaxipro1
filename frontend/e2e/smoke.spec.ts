import { test, expect } from '@playwright/test';

test('root URL redirects to booking', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/booking\/?$/);
  await expect(page.locator('app-root')).toBeVisible();
});
