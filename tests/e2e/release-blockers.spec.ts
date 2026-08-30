import { expect, test } from '@playwright/test';

test('cold landing names event hosts, offers the sample first, and qualifies pairings', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Plan a fair tabletop event.' })).toBeVisible();
  await expect(page.getByText('For hosts using mixed components, build a fair schedule before friends arrive.')).toBeVisible();
  await expect(page.getByRole('link', { name: /try it with sample data/i })).toBeVisible();
  await expect(page.getByText(/Avoid repeat opponents for one round-robin cycle/)).toBeVisible();
  await expect(page.getByText(/repeat-free pairings/i)).toHaveCount(0);
});

test('localStorage denial cannot block the free planner', async ({ page, context }) => {
  await context.addInitScript(() => {
    for (const method of ['getItem', 'setItem'] as const) {
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        value: () => { throw new DOMException('Denied', 'SecurityError'); },
      });
    }
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Friday night limited' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('adding inventory cannot steal an immediate count entry with deferred focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  await page.getByRole('button', { name: /add group/i }).click();

  await page.getByRole('spinbutton', { name: 'Count' }).fill('1000001');
  await expect(page.getByRole('spinbutton', { name: 'Count' })).toHaveValue('1000000');
  await expect(page.getByRole('textbox', { name: 'Group name' })).toHaveValue('Group 1');
  await expect(page.getByText('Count must be between 0 and 1,000,000. Using 1,000,000.')).toBeVisible();
});

test('unknown routes are real 404s and standard routes expose discovery metadata', async ({ page }) => {
  const missing = await page.goto('/this-route-does-not-exist');
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: 'This page is not on the route.' })).toBeVisible();

  for (const path of ['/', '/privacy/', '/terms/']) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  }

  await page.goto('/');
  await expect(page.getByText(/Built by Param Factory · Build 1\.0\.2-repair-6/)).toBeVisible();
});
