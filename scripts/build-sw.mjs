import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (!['sw.js', '.map'].some((suffix) => entry.name.endsWith(suffix))) files.push(`/${relative(root, path).replaceAll('\\', '/')}`);
  }
  return files;
}

const precache = await walk(root);
const source = await readFile(new URL('../src/sw-template.js', import.meta.url), 'utf8');
await writeFile(join(root, 'sw.js'), source.replace('__PRECACHE__', JSON.stringify(precache)), 'utf8');
console.log(`service worker: ${precache.length} files precached`);
