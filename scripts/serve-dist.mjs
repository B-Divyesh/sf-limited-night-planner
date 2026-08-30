import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const port = Number(process.env.PORT ?? 4173);
const deploymentOnlyFiles = new Set(['/staticwebapp.config.json']);
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webmanifest', 'application/manifest+json'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

async function publicFile(pathname) {
  if (deploymentOnlyFiles.has(pathname)) return null;
  const relativePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  const candidates = [relativePath, join(relativePath, 'index.html')];
  for (const candidate of candidates) {
    const path = join(root, candidate);
    try {
      if ((await stat(path)).isFile()) return path;
    } catch {
      // Try the next public candidate.
    }
  }
  return null;
}

createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
  const path = await publicFile(pathname);
  if (!path) {
    const notFound = await publicFile('/404.html');
    if (!notFound) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    response.writeHead(404, {
      'Cache-Control': 'no-cache',
      'Content-Type': contentTypes.get(extname(notFound)) ?? 'text/html; charset=utf-8',
    });
    if (request.method !== 'HEAD') createReadStream(notFound).pipe(response);
    return;
  }
  response.writeHead(200, {
    'Cache-Control': path.includes('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
    'Content-Type': contentTypes.get(extname(path)) ?? 'application/octet-stream',
  });
  if (request.method === 'HEAD') response.end();
  else createReadStream(path).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`production-faithful test server listening on http://127.0.0.1:${port}`);
});
