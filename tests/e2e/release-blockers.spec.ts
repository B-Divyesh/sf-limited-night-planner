import { expect, test } from '@playwright/test';

test('cold landing names event hosts, offers the sample first, and explains pairings plainly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Plan pools and rounds for a tabletop event.' })).toBeVisible();
  await expect(page.getByText('For hosts using mixed components, check counts and build a schedule before friends arrive.')).toBeVisible();
  await expect(page.getByRole('link', { name: /try it with sample data/i })).toBeVisible();
  await expect(page.getByText('Avoid repeat opponents until everyone has played each other.')).toBeVisible();
  await expect(page.getByText(/round-robin/i)).toHaveCount(0);
  await expect(page.getByText(/repeat-free pairings/i)).toHaveCount(0);
  await expect(page.getByText(/fair/i)).toHaveCount(0);
});

test('landing shows the sample plan, limits, privacy boundary, and optional archive boundary', async ({ page }) => {
  await page.goto('/');
  const preview = page.locator('.sample-preview');
  await expect(preview.getByRole('heading', { name: 'See a completed five-player plan' })).toBeVisible();
  await expect(preview.getByText('300', { exact: true })).toBeVisible();
  await expect(preview.getByText('237', { exact: true })).toBeVisible();
  await expect(preview.getByText('Count 237 components into 5 pools of 45.', { exact: true })).toBeVisible();
  await expect(preview.getByText('Morgan vs Kai', { exact: true })).toBeVisible();
  await expect(preview.getByRole('link', { name: /open the sample plan/i })).toHaveAttribute('href', '/demo/');

  await expect(page.getByRole('heading', { name: 'What the planner does not check' })).toBeVisible();
  await expect(page.getByText('You supply compatibility notes and official rules.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Where your data goes' })).toBeVisible();
  await expect(page.getByText('Restoring an existing Night Pass sends its license token to Sociobot for a check.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Optional plan archives' })).toBeVisible();
  await expect(page.getByText('Existing Night Pass holders can restore local plan archives. New passes are not available yet.')).toBeVisible();
});

test('desktop first screen keeps each offline, privacy, and free fact in view', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  for (const fact of [
    'Works offline after the first visit.',
    'Plan data stays in this browser.',
    'Planning, timers, printing, and exports stay free.',
  ]) {
    const bounds = await page.getByText(fact, { exact: true }).boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(900);
  }
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
    await expect(page.locator('footer').getByRole('link', { name: 'Source code (external)' })).toHaveAttribute('href', 'https://github.com/B-Divyesh/sf-limited-night-planner');
    await expect(page.locator('main')).toHaveAttribute('id', 'main');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('script[src="/route-focus.js"]')).toHaveCount(1);
    const touchIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(touchIcon).toHaveAttribute('sizes', '180x180');
    await expect(touchIcon).toHaveAttribute('href', '/apple-touch-icon.png');
  }

  const icon = await page.request.get('/apple-touch-icon.png');
  expect(icon.status()).toBe(200);
  expect(icon.headers()['content-type']).toContain('image/png');

  await page.goto('/');
  await expect(page.getByText(/Poster artwork is original AI-generated imagery/i)).toHaveCount(0);
  await expect(page.getByText(/Built by Param Factory · Build 1\.0\.8-polish-5/)).toBeVisible();
  await page.goto('/privacy/');
  await expect(page.getByRole('link', { name: 'sociobot.in (external)' })).toHaveAttribute('href', 'https://sociobot.in');
});

test('document route changes focus and announce the new route heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /try it with sample data/i }).click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Saturday mixed box night' })).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Demo opened.');

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Plan pools and rounds for a tabletop event.' })).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Planner opened.');
});
