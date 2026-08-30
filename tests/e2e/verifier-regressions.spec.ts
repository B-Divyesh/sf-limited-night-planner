import { expect, test } from '@playwright/test';

test('a newly returned unverified license stays locked when its first verification is unavailable', async ({ page, context }) => {
  await context.route('https://api.sociobot.in/**', (route) => route.abort());
  await page.goto('/?license=qa-not-a-license');
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  await page.getByRole('button', { name: '04 Host sheet' }).click();

  await expect(page).toHaveURL(/^(?!.*license=)/);
  await expect(page.getByRole('button', { name: /archive current plan/i })).toHaveCount(0);
  await expect(page.getByText('Could not verify this Night Pass right now. Check your connection and try again; your free planner still works.')).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license_verdict:limited-night-planner'))).toBe(
    JSON.stringify({ valid: false, checkedAt: 0, reason: 'pending' }),
  );
});

test('storage denial leaves the planner usable with explicit export recovery guidance', async ({ page, context }) => {
  await context.addInitScript(() => {
    Object.defineProperty(indexedDB, 'open', {
      configurable: true,
      value: () => { throw new DOMException('Denied', 'SecurityError'); },
    });
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Friday night limited' })).toBeVisible();
  await expect(page.locator('.storage-banner')).toContainText(/This browser is blocking local storage.*export a JSON backup/i);
  await page.getByRole('button', { name: '04 Host sheet' }).click();
  await expect(page.getByRole('button', { name: /export json backup/i })).toBeVisible();
  expect(errors).toEqual([]);
});

test('repeat-opponent guidance updates as the rounds input changes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  await page.getByLabel('Players').fill('5');
  await page.getByRole('button', { name: 'Next: Format' }).click();
  await page.getByLabel('Rounds').fill('6');
  await expect(page.getByText('With 5 players, opponents begin repeating after round 5.')).toBeVisible();
  await page.getByLabel('Rounds').fill('5');
  await expect(page.getByText(/opponents begin repeating/i)).toHaveCount(0);
});

test('schema-invalid JSON gives import recovery guidance without exposing implementation errors', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  await page.getByRole('button', { name: '04 Host sheet' }).click();
  await page.locator('#import-file').setInputFiles({
    name: 'bad-shape.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":1,"eventName":"shape","inventory":[null]}'),
  });
  await expect(page.getByRole('status')).toContainText('This file is not valid planner JSON. Choose a JSON backup exported by Limited Night Planner.');
  await expect(page.getByRole('status')).not.toContainText('Cannot read properties');
});

test('every visible link has a 44 by 44 pixel touch target at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  await page.getByRole('button', { name: '04 Host sheet' }).click();

  const undersizedLinks = await page.locator('a:visible').evaluateAll((links) => links
    .map((link) => {
      const bounds = link.getBoundingClientRect();
      return { label: (link.textContent ?? '').trim(), width: bounds.width, height: bounds.height };
    })
    .filter(({ width, height }) => width < 44 || height < 44));
  expect(undersizedLinks).toEqual([]);
});
