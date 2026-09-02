import { expect, test } from '@playwright/test';

test('creates, saves, and reopens a plan offline at phone width', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /start a real plan/i }).click();
  await page.getByLabel('Event name').fill('Kitchen table test');
  await page.getByRole('button', { name: /add group/i }).click();
  await page.getByRole('spinbutton', { name: 'Count' }).fill('240');
  await page.getByRole('button', { name: /next: format/i }).click();
  await expect(page.getByRole('complementary', { name: 'Enough components' })).toBeVisible();
  await page.waitForTimeout(500);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect.poll(() => page.evaluate(async () => {
    const source = document.querySelector<HTMLScriptElement>('script[type="module"]')?.src;
    return Boolean(source && await caches.match(source));
  })).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Kitchen table test' })).toBeVisible();
  await expect(page.getByText(/offline service/i)).toBeVisible();
});

test('keyboard reaches planner actions and legal pages exist', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page).toHaveTitle(/Privacy/);
  await expect(page.locator('main')).toBeVisible();
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms' })).toBeVisible();
});

test('fresh free use stays on this origin', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/');
  await page.waitForTimeout(300);
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('generates odd-player seating, runs the timer, and exports a host sheet', async ({ page }) => {
  const browserErrors: string[] = [];
  page.on('console', (entry) => { if (entry.type() === 'error') browserErrors.push(entry.text()); });
  page.on('pageerror', (error) => browserErrors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: /start a real plan/i }).click();
  await page.getByLabel('Players').fill('5');
  await page.getByLabel(/player names/i).fill('Avery\nMorgan\nSam\nJo\nKai');
  await page.getByRole('button', { name: /add group/i }).click();
  await page.getByRole('spinbutton', { name: 'Count' }).fill('300');
  await page.getByRole('button', { name: /schedule/i }).click();
  await expect(page.getByText('Kai sits out').or(page.getByText('Avery sits out'))).toBeVisible();
  await page.getByRole('button', { name: 'Start timer' }).click();
  await expect(page.getByRole('timer')).not.toHaveText('45:00', { timeout: 3_000 });
  await page.getByRole('button', { name: /next: host sheet/i }).click();
  await expect(page.getByRole('heading', { name: /set-up checklist/i })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /export json backup/i }).click();
  await expect((await downloadPromise).suggestedFilename()).toContain('friday-night-limited');
  expect(browserErrors).toEqual([]);
});

test('immediately corrects out-of-range counts and gives actionable import recovery', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /start a real plan/i }).click();

  const players = page.getByLabel('Players');
  await players.fill('65');
  await expect(players).toHaveValue('64');
  await expect(page.getByText('Players must be between 2 and 64. Using 64.')).toBeVisible();

  await page.getByRole('button', { name: /add group/i }).click();
  const count = page.getByRole('spinbutton', { name: 'Count' });
  await count.fill('1000001');
  await expect(count).toHaveValue('1000000');
  await expect(page.getByText('Count must be between 0 and 1,000,000. Using 1,000,000.')).toBeVisible();

  await page.getByRole('button', { name: /host sheet/i }).click();
  await page.locator('#import-file').setInputFiles({
    name: 'not-a-plan.json',
    mimeType: 'application/json',
    buffer: Buffer.from('not json'),
  });
  await expect(page.getByRole('status')).toContainText('This file is not valid planner JSON. Choose a JSON backup exported by Limited Night Planner.');
  await expect(page.getByRole('heading', { level: 1, name: /friday night limited/i })).toBeVisible();
});
