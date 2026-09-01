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

test('standard routes have a shared header and footer, and the 404 is a complete route', async ({ page }) => {
  const missing = await page.goto('/this-route-does-not-exist');
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();

  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/this-route-does-not-exist']) {
    await page.goto(path);
    await expect(page.getByRole('link', { name: /skip to (planner|main content)/i })).toBeVisible();
    const siteHeader = page.locator('header.masthead, header.site-header');
    await expect(siteHeader).toContainText('Limited Night Planner');
    await expect(siteHeader.getByRole('link', { name: 'Demo' })).toBeVisible();
    await expect(siteHeader.getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(page.locator('footer')).toContainText('Plan a casual limited event from mixed components.');
    await expect(page.locator('footer').getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(page.locator('footer').getByRole('link', { name: 'Terms' })).toBeVisible();
    await expect(page.locator('main')).toHaveAttribute('id', 'main');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  }

  await page.goto('/');
  await expect(page.getByText(/Poster artwork is original AI-generated imagery/i)).toHaveCount(0);
  await expect(page.getByText(/Built by Param Factory · Build 1\.0\.5-polish-1/)).toBeVisible();
});
