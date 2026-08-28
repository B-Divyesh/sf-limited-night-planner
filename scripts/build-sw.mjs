import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
// Azure Static Web Apps consumes this deployment configuration instead of
// serving it. It belongs in the artifact, but cannot be fetched by a worker.
const deploymentOnlyFiles = new Set(['staticwebapp.config.json']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else {
      const outputPath = relative(root, path).replaceAll('\\', '/');
      if (!['sw.js', '.map'].some((suffix) => entry.name.endsWith(suffix)) && !deploymentOnlyFiles.has(outputPath)) {
        files.push(`/${outputPath}`);
      }
    }
  }
  return files;
}

const precache = await walk(root);
const source = await readFile(new URL('../src/sw-template.js', import.meta.url), 'utf8');
const version = `lnp-${createHash('sha256').update(JSON.stringify(precache)).digest('hex').slice(0, 12)}`;
await writeFile(join(root, 'sw.js'), source
  .replace('__VERSION__', version)
  .replace('__PRECACHE__', JSON.stringify(precache)), 'utf8');
console.log(`service worker: ${precache.length} files precached (${version})`);
