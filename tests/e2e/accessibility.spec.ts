import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('landing and every standard planner stop have no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);

  await page.getByRole('button', { name: /start a night/i }).click();
  await page.getByRole('button', { name: /add group/i }).click();
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);

  for (const index of [1, 2, 3]) {
    await page.locator(`.route-nav [data-step="${index}"]`).click();
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }
});

test('primary planner path is keyboard operable', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /skip to planner/i })).toBeFocused();
  await page.keyboard.press('Enter');
  const start = page.getByRole('button', { name: /start a night/i });
  await start.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('heading', { level: 1, name: /friday night limited/i })).toBeVisible();
});
