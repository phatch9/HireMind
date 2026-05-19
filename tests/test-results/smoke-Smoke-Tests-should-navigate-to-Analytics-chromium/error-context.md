# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Smoke Tests >> should navigate to Analytics
- Location: tests/e2e/smoke.spec.ts:19:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "Analytics"
Received string:    "job.env"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1')
    14 × locator resolved to <h1>job.env</h1>
       - unexpected value "job.env"

```

```yaml
- heading "job.env" [level=1]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Smoke Tests', () => {
  4  |   test('should load the dashboard', async ({ page }) => {
  5  |     // Note: This assumes a mock user or that the app handles no session by redirecting to landing
  6  |     await page.goto('/');
  7  |     
  8  |     // Check if we are on landing or dashboard
  9  |     const title = await page.title();
  10 |     expect(title).toBeTruthy();
  11 |   });
  12 | 
  13 |   test('should navigate to ATS Analyzer', async ({ page }) => {
  14 |     await page.goto('/ats');
  15 |     // Check for the heading
  16 |     await expect(page.locator('h1')).toContainText('AI Resume Optimizer');
  17 |   });
  18 | 
  19 |   test('should navigate to Analytics', async ({ page }) => {
  20 |     await page.goto('/analytics');
> 21 |     await expect(page.locator('h1')).toContainText('Analytics');
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  22 |   });
  23 | 
  24 |   test('should navigate to Reminders', async ({ page }) => {
  25 |     await page.goto('/reminders');
  26 |     await expect(page.locator('h1')).toContainText('Reminders');
  27 |   });
  28 | });
  29 | 
```