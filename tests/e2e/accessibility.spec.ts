import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

function contrastRatio(first: string, second: string): number {
  const luminance = (color: string) => {
    const [red, green, blue] = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

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

test('Import JSON shows a visible, contrasting focus ring on its label', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: '04 Host sheet' }).click();
  await page.getByRole('button', { name: 'Export CSV' }).focus();
  await page.keyboard.press('Tab');

  const input = page.locator('#import-file');
  const label = page.locator('label.file-button');
  await expect(input).toBeFocused();
  await expect(input).toHaveCSS('opacity', '0');
  await expect(label).toHaveCSS('outline-style', 'solid');
  await expect(label).toHaveCSS('outline-width', '3px');

  const colors = await label.evaluate((element) => ({
    ring: getComputedStyle(element).outlineColor,
    surface: getComputedStyle(element.closest('.host-tools')!).backgroundColor,
  }));
  expect(contrastRatio(colors.ring, colors.surface)).toBeGreaterThanOrEqual(3);
});

test('paper controls use a focus ring with at least 3 to 1 contrast', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start a real plan' }).click();
  const addFirstGroup = page.getByRole('button', { name: 'Add first group' });

  for (let press = 0; press < 40 && !(await addFirstGroup.evaluate((element) => element === document.activeElement)); press += 1) {
    await page.keyboard.press('Tab');
  }
  await expect(addFirstGroup).toBeFocused();
  await expect(addFirstGroup).toHaveCSS('outline-style', 'solid');
  await expect(addFirstGroup).toHaveCSS('outline-width', '3px');

  const colors = await addFirstGroup.evaluate((element) => ({
    ring: getComputedStyle(element).outlineColor,
    paper: getComputedStyle(element.closest('.work-main > section')!).backgroundColor,
  }));
  expect(contrastRatio(colors.ring, colors.paper)).toBeGreaterThanOrEqual(3);
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
