import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('review 1 plain-language regressions', () => {
  it('keeps the README reader-facing and removes the reviewed implementation shorthand', async () => {
    const readme = await readFile(resolve('README.md'), 'utf8');
    const readerCopy = readme.replace(/\s+/g, ' ');
    expect(readerCopy).toContain('Requires Node.js 22 or later.');
    expect(readerCopy).toContain('Plans and an existing Night Pass status stay in this browser.');
    expect(readerCopy).toContain('Restoring an existing Night Pass sends its license token to Sociobot for a check.');
    expect(readerCopy).toContain('## Project notes');
    for (const removedPhrase of ['current Node.js LTS', 'browser-origin CORS', 'HTTP 429', 'Retry-After', 'IndexedDB', 'localStorage', 'application API request']) {
      expect(readme).not.toContain(removedPhrase);
    }
  });

  it('uses direct planner labels and records a short verb-first catalog description', async () => {
    const app = await readFile(resolve('src/app.ts'), 'utf8');
    const catalog = (await readFile(resolve('.factory/catalog-description.txt'), 'utf8')).trim();
    for (const removedLabel of ['Local night service', 'Sample route', 'Live departure board', 'Assembly route', 'Generated route', 'Limited night · host route', 'Before departure', 'Round route', 'Dispatch desk']) {
      expect(app).not.toContain(removedLabel);
    }
    for (const directLabel of ['Sample plan', 'Event details', 'Component check', 'Pool format', 'Set-up checklist', 'Print and export']) {
      expect(app).toContain(directLabel);
    }
    expect(catalog.length).toBeLessThanOrEqual(120);
    expect(catalog).toMatch(/^Plan\b/);
  });
});
