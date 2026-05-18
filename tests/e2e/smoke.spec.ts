import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toContainText('HireMind');
    await expect(page.locator('text=Track your job search')).toBeVisible();
  });

  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/dashboard');
    // Should be redirected to /auth/login
    await expect(page).toHaveURL(/.*\/auth\/login/);
    await expect(page.locator('h1')).toContainText('HireMind');
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('should show login page for protected routes', async ({ page }) => {
    const routes = ['/ats', '/analytics', '/reminders'];
    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(/.*\/auth\/login/);
    }
  });
});
