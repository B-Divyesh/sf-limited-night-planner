import { expect, test, type Page } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const workerPath = resolve('dist/sw.js');
let originalWorker = '';

async function activeWorkerVersion(page: Page): Promise<string | null> {
  return page.evaluate(async () => new Promise((resolveVersion) => {
    const worker = navigator.serviceWorker.controller;
    if (!worker) return resolveVersion(null);
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => resolveVersion(event.data?.version ?? null);
    worker.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
    setTimeout(() => resolveVersion(null), 2_000);
  }));
}

test.afterEach(async () => {
  if (originalWorker) await writeFile(workerPath, originalWorker, 'utf8');
});

test('Update now activates the waiting service worker and reloads into it', async ({ page }) => {
  test.setTimeout(45_000);
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  const before = await activeWorkerVersion(page);
  expect(before).toMatch(/^lnp-/);

  originalWorker = await readFile(workerPath, 'utf8');
  const updatedWorker = originalWorker.replace(/const VERSION = '([^']+)'/, "const VERSION = '$1-update'");
  expect(updatedWorker).not.toBe(originalWorker);
  await writeFile(workerPath, updatedWorker, 'utf8');

  await page.evaluate(async () => { await (await navigator.serviceWorker.ready).update(); });
  await expect(page.getByRole('button', { name: 'Update now' })).toBeVisible();
  const reload = page.waitForEvent('framenavigated');
  await page.getByRole('button', { name: 'Update now' }).click();
  await reload;
  await page.waitForLoadState('domcontentloaded');
  await expect.poll(() => activeWorkerVersion(page), { timeout: 12_000 }).toBe(`${before}-update`);
  await expect.poll(() => page.evaluate(async () => !(await navigator.serviceWorker.getRegistration())?.waiting)).toBe(true);
});
