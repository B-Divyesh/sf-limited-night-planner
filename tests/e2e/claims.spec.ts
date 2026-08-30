import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function openDemo(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByRole('link', { name: /try it with sample data/i }).click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Saturday mixed box night' })).toBeVisible();
}

test('@claim:demo-sandbox sample data is reset and never becomes a real plan', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  const notes = page.getByLabel('Host notes');
  await notes.fill('A temporary demo edit');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(notes).toHaveValue(/Ask players to return unused sleeves/);

  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('button', { name: 'Start a real plan' })).toBeVisible();
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  await page.getByLabel('Event name').fill('Real plan stays private');
  await page.waitForTimeout(250);

  await page.goto('/demo/');
  await expect(page.getByLabel('Host notes')).toHaveValue(/Ask players to return unused sleeves/);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Real plan stays private' })).toBeVisible();

  await page.goto('/demo/');
  await expect(page.getByRole('heading', { level: 1, name: 'Saturday mixed box night' })).toBeVisible();
});

test('@claim:core-planning shows stock, seating, timer, and the host sheet', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByText('300/237')).toBeVisible();
  await page.getByRole('button', { name: '03 Schedule' }).click();
  await expect(page.getByText(/Avery sits out|Morgan sits out|Sam sits out|Jo sits out|Kai sits out/).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start timer' })).toBeVisible();
  await page.getByRole('button', { name: '04 Host sheet' }).click();
  await expect(page.getByRole('heading', { name: 'Before departure' })).toBeVisible();
});

test('@claim:local-plan-data demo use sends no plan data away from this origin', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await openDemo(page);
  await page.getByRole('button', { name: /schedule/i }).click();
  await page.waitForTimeout(150);
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('@claim:no-third-party-requests demo use loads no external code or tracking', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await openDemo(page);
  await page.getByRole('button', { name: '03 Schedule' }).click();
  await page.getByRole('button', { name: '04 Host sheet' }).click();
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('@claim:json-export downloads the complete sample plan', async ({ page }) => {
  await openDemo(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /export json backup/i }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const exported = JSON.parse(await readFile(path!, 'utf8')) as { eventName: string; inventory: unknown[] };
  expect(exported.eventName).toBe('Saturday mixed box night');
  expect(exported.inventory).toHaveLength(2);
});

test('@claim:csv-export downloads inventory and round rows', async ({ page }) => {
  await openDemo(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /^export csv$/i }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const exported = await readFile(path!, 'utf8');
  expect(exported).toContain('"Inventory","Count","Included","Note"');
  expect(exported).toContain('"Round","Start","End","Table","Player A","Player B"');
  expect(exported.split(/\r?\n/).length).toBeGreaterThan(15);
});

test('@claim:first-cycle-pairings has no repeated opponents in the five sample rounds', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /schedule/i }).click();
  const pairings = await page.locator('.round-card li').allTextContents();
  const playedPairs = pairings
    .filter((pairing) => !pairing.includes('sits out'))
    .map((pairing) => pairing.replace(/^Table\s+\d+\s+/, '').split(/\s+vs\s+/).sort().join(' · '));
  expect(playedPairs).toHaveLength(10);
  expect(new Set(playedPairs).size).toBe(playedPairs.length);
});

test('@claim:timer-persistence keeps a running timer after refresh', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /schedule/i }).click();
  await page.getByRole('button', { name: 'Start timer' }).click();
  await page.waitForTimeout(1_300);
  await page.reload();
  await page.getByRole('button', { name: /schedule/i }).click();
  await expect(page.getByRole('timer')).not.toHaveText('45:00');
});

test('@claim:free-core-tools are available without a license', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /schedule/i }).click();
  await expect(page.getByRole('button', { name: 'Start timer' })).toBeVisible();
  await page.getByRole('button', { name: 'Next: Host sheet →' }).click();
  const tools = page.locator('.host-tools');
  await expect(tools.getByRole('button', { name: 'Print host sheet' })).toBeVisible();
  await expect(tools.getByRole('button', { name: 'Export JSON backup' })).toBeVisible();
  await expect(tools.getByRole('button', { name: 'Export CSV' })).toBeVisible();
});

test('@claim:night-pass-sales-unavailable does not advertise a broken checkout', async ({ page }) => {
  const validLicenseResponse = await readFile(new URL('../fixtures/license-valid.json', import.meta.url), 'utf8');
  let verificationRequest = '';
  await page.context().route('https://api.sociobot.in/api/v1/products/limited-night-planner/verify**', async (route) => {
    verificationRequest = route.request().url();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': 'http://127.0.0.1:4173' },
      body: validLicenseResponse,
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  await page.getByRole('button', { name: '04 Host sheet' }).click();
  await expect(page.getByText('New Night Pass purchases are not available yet.')).toBeVisible();
  await expect(page.locator('a[href*="/checkout"]')).toHaveCount(0);
  await page.getByText('Have an existing license? Restore it').click();
  await page.getByLabel('License token').fill('recorded-existing-pass');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Night Pass restored on this device.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Archive current plan' })).toBeVisible();
  expect(verificationRequest).toBe('https://api.sociobot.in/api/v1/products/limited-night-planner/verify?license=recorded-existing-pass');
  await page.getByRole('button', { name: 'Archive current plan' }).click();
  await expect(page.getByText('Plan archived on this device.')).toBeVisible();
});

test('@claim:round-cycle-warning warns before a five-player schedule starts repeating opponents', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: '02 Format' }).click();
  await page.getByLabel('Rounds').fill('6');
  await expect(page.locator('#repeat-opponent-guidance')).toHaveText('With 5 players, opponents begin repeating after round 5.');
});

test('@claim:offline-export downloads the CSV host sheet after the demo is offline', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  const page = await context.newPage();
  try {
    await page.goto('/demo/');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByText(/offline service/i)).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /^export csv$/i }).click();
    const path = await (await downloadPromise).path();
    expect(path).not.toBeNull();
    expect(await readFile(path!, 'utf8')).toContain('"Round","Start","End","Table","Player A","Player B"');
  } finally {
    await context.close();
  }
});

test('@claim:offline-after-first-visit reloads the demo in its own offline browser context', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  const page = await context.newPage();
  try {
    await page.goto('/demo/');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: 'Saturday mixed box night' })).toBeVisible();
    await expect(page.getByText(/offline service/i)).toBeVisible();
  } finally {
    await context.close();
  }
});
