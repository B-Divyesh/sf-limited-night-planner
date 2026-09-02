import { execFile } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);

describe('static delivery policy', () => {
  it('ships a restrictive policy, manifest MIME type, and immutable asset cache rule', async () => {
    const config = JSON.parse(await readFile(resolve('public/staticwebapp.config.json'), 'utf8')) as {
      globalHeaders: Record<string, string>;
      mimeTypes: Record<string, string>;
      routes: Array<{ route: string; headers: Record<string, string> }>;
      responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
    };
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.routes).toContainEqual({
      route: '/assets/*',
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  });

  it('does not precache Azure deployment configuration that is not publicly served', async () => {
    await execFileAsync('npm', ['run', 'build'], { cwd: process.cwd() });
    const worker = await readFile(resolve('dist/sw.js'), 'utf8');
    const precache = JSON.parse(worker.match(/const PRECACHE = (\[[^;]+\]);/)?.[1] ?? '[]') as string[];

    expect(precache).not.toContain('/staticwebapp.config.json');
    expect(precache).toContain('/index.html');
    expect(precache).toContain('/demo/index.html');
    expect(precache).toContain('/404.html');
    expect(precache).toContain('/offline.html');
    expect(precache).toHaveLength(24);
  });

  it('ships an original 180 pixel Apple touch icon', async () => {
    const icon = await stat(resolve('public/apple-touch-icon.png'));
    expect(icon.size).toBeGreaterThan(0);
  });
});
