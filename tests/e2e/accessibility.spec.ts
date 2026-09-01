import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('landing and every standard planner stop have no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);

  await page.getByRole('button', { name: /start a real plan/i }).click();
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
  const start = page.getByRole('button', { name: /start a real plan/i });
  await start.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('heading', { level: 1, name: /friday night limited/i })).toBeVisible();
});

test('planner step changes move focus to the h1 and announce the new step', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /start a real plan/i }).click();

  const schedule = page.getByRole('button', { name: '03 Schedule' });
  await schedule.focus();
  await page.keyboard.press('Enter');

  const heading = page.getByRole('heading', { level: 1, name: 'Friday night limited' });
  await expect(heading).toBeFocused();
  await expect(page.locator('#announcer')).toHaveText('Stop 03: Schedule.');
});

test('privacy and terms pages have no serious accessibility violations', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }
});

test('privacy and terms provide a keyboard skip link to their main content', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(path);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  }
});

test('390px landing keeps header and first-screen text visible at 200% root text size', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });

  const geometry = await page.evaluate(() => {
    const rectangle = (selector: string) => {
      const bounds = document.querySelector(selector)?.getBoundingClientRect();
      return bounds && { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom };
    };
    const named = ['.brand', '.masthead-nav', '.service-label', '.hero h1', '.plain-facts li:last-child'];
    const boxes = named.map((selector) => ({ selector, bounds: rectangle(selector) })).filter((item) => item.bounds);
    const header = boxes.filter(({ selector }) => ['.brand', '.masthead-nav', '.service-label'].includes(selector));
    const headerOverlaps = header.some(({ bounds }, index) => header.slice(index + 1).some(({ bounds: other }) => (
      bounds!.left < other!.right && other!.left < bounds!.right && bounds!.top < other!.bottom && other!.top < bounds!.bottom
    )));
    return {
      viewport: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      landingOverflow: getComputedStyle(document.querySelector('.landing')!).overflow,
      clipped: boxes.some(({ bounds }) => bounds!.left < 0 || bounds!.right > window.innerWidth),
      headerOverlaps,
    };
  });

  expect(geometry.landingOverflow).toBe('visible');
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.viewport);
  expect(geometry.clipped).toBe(false);
  expect(geometry.headerOverlaps).toBe(false);
});
