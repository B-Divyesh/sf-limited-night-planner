import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function openDemo(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByRole('link', { name: /try it with sample data/i }).click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Saturday mixed box night' })).toBeVisible();
}

async function mockValidNightPass(page: Page): Promise<void> {
  const validLicenseResponse = await readFile(new URL('../fixtures/license-valid.json', import.meta.url), 'utf8');
  await page.context().route('https://api.sociobot.in/api/v1/products/limited-night-planner/verify**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': 'http://127.0.0.1:4173' },
    body: validLicenseResponse,
  }));
}

async function openUnlockedHostSheet(page: Page, eventName: string): Promise<void> {
  await mockValidNightPass(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  await page.getByLabel('Event name').fill(eventName);
  await page.waitForTimeout(250);
  await page.getByRole('button', { name: '04 Host sheet' }).click();
  await page.getByText('Have an existing license? Restore it').click();
  await page.getByLabel('License token').fill('recorded-existing-pass');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByRole('button', { name: 'Archive current plan' })).toBeVisible();
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
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page).toHaveTitle('Demo — Limited Night Planner');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://limited-night-planner.sociobot.in/demo/');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://limited-night-planner.sociobot.in/demo/');
  await expect(page.getByRole('heading', { level: 1, name: 'Saturday mixed box night' })).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('@claim:core-planning checks totals and creates pools, seating rounds, a running timer, and a host sheet', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: '01 Inventory' }).click();
  const componentBoard = page.locator('.departure-board');
  await expect(componentBoard.getByText('300', { exact: true })).toBeVisible();
  await expect(componentBoard.getByText('237', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: '03 Schedule' }).click();
  const firstRound = page.locator('.round-card').first();
  await expect(firstRound.getByText('Avery sits out', { exact: true })).toBeVisible();
  await expect(firstRound.getByText('Morgan vs Kai', { exact: true })).toBeVisible();
  const timer = page.getByRole('timer');
  await expect(timer).toHaveText('45:00');
  await page.getByRole('button', { name: 'Start timer' }).click();
  await page.waitForTimeout(1_300);
  await expect(timer).not.toHaveText('45:00');

  await page.getByRole('button', { name: '04 Host sheet' }).click();
  await expect(page.getByRole('heading', { name: 'Set-up checklist' })).toBeVisible();
  await expect(page.getByText('Count 237 components into 5 pools of 45.', { exact: true })).toBeVisible();
  await expect(page.locator('.manifest-list')).toContainText('Compatible mixed components');
  await expect(page.locator('.print-rounds').first()).toContainText('Morgan vs Kai');
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

test('@claim:no-analytics-cookies sample use leaves the browser cookie jar empty', async ({ page, context }) => {
  await openDemo(page);
  await page.getByRole('button', { name: '03 Schedule' }).click();
  await page.getByRole('button', { name: '04 Host sheet' }).click();
  expect(await context.cookies()).toEqual([]);
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

test('@claim:timer-background keeps counting while another tab is active', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: '03 Schedule' }).click();
  await page.getByRole('button', { name: 'Start timer' }).click();

  const session = await page.context().newCDPSession(page);
  try {
    await session.send('Page.setWebLifecycleState', { state: 'frozen' });
    await page.waitForTimeout(1_300);
    await session.send('Page.setWebLifecycleState', { state: 'active' });
    await expect(page.getByRole('timer')).not.toHaveText('45:00');
  } finally {
    await session.detach();
  }
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

test('@claim:plan-deletion removes a current plan and an individual archive', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  await page.getByLabel('Event name').fill('Plan to remove');
  await page.waitForTimeout(250);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Start over' }).click();
  await expect(page.getByRole('button', { name: 'Start a real plan' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start a real plan' })).toBeVisible();

  await openUnlockedHostSheet(page, 'Archive to remove');
  await page.getByRole('button', { name: 'Archive current plan' }).click();
  await expect(page.getByText('Plan archived on this device.')).toBeVisible();
  await page.getByRole('button', { name: 'Delete archived Archive to remove' }).click();
  await expect(page.getByText('Archived plan removed.')).toBeVisible();
  await expect(page.getByText('No archived plans yet.')).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: '04 Host sheet' }).click();
  await expect(page.getByText('No archived plans yet.')).toBeVisible();
});

test('@claim:reusable-archives saves a snapshot that can be reopened after reload', async ({ page }) => {
  await openUnlockedHostSheet(page, 'Reusable archived night');
  await page.getByRole('button', { name: 'Archive current plan' }).click();
  await expect(page.getByText('Plan archived on this device.')).toBeVisible();
  await page.getByRole('button', { name: '01 Inventory' }).click();
  await page.getByLabel('Event name').fill('Changed working copy');
  await page.waitForTimeout(250);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Changed working copy' })).toBeVisible();
  await page.getByRole('button', { name: '04 Host sheet' }).click();
  await page.locator('[data-action="load-archive"]').filter({ hasText: 'Reusable archived night' }).click();
  await expect(page.getByText('Archived plan loaded as your current plan.')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Reusable archived night' })).toBeVisible();
});

test('@claim:round-cycle-warning warns before a five-player schedule starts repeating opponents', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: '02 Format' }).click();
  await page.getByLabel('Rounds').fill('6');
  await expect(page.locator('#repeat-opponent-guidance')).toHaveText('With 5 players, opponents begin repeating after round 5.');
});

test('@claim:offline-export downloads complete JSON and CSV exports after the demo is offline', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  const page = await context.newPage();
  try {
    await page.goto('/demo/');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByText(/offline service/i)).toBeVisible();
    const jsonDownloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export json backup/i }).click();
    const jsonPath = await (await jsonDownloadPromise).path();
    expect(jsonPath).not.toBeNull();
    const json = JSON.parse(await readFile(jsonPath!, 'utf8')) as { eventName: string; inventory: unknown[] };
    expect(json.eventName).toBe('Saturday mixed box night');
    expect(json.inventory).toHaveLength(2);

    const csvDownloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /^export csv$/i }).click();
    const csvPath = await (await csvDownloadPromise).path();
    expect(csvPath).not.toBeNull();
    const csv = await readFile(csvPath!, 'utf8');
    expect(csv).toContain('"Inventory","Count","Included","Note"');
    expect(csv).toContain('"Round","Start","End","Table","Player A","Player B"');
    expect(csv.split(/\r?\n/).length).toBeGreaterThan(15);
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
