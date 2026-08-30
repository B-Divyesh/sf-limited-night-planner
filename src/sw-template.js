const VERSION = '__VERSION__';
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const PRECACHE = __PRECACHE__;

function navigationFallback(pathname) {
  if (pathname === '/' || pathname === '/index.html') return '/index.html';
  if (pathname === '/demo' || pathname === '/demo/') return '/demo/index.html';
  if (pathname === '/privacy' || pathname === '/privacy/') return '/privacy/index.html';
  if (pathname === '/terms' || pathname === '/terms/') return '/terms/index.html';
  return '/404.html';
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => ![STATIC_CACHE, PAGE_CACHE].includes(key)).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'GET_VERSION') event.ports[0]?.postMessage({ version: VERSION });
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch(async () => (await caches.match(request, { ignoreVary: true })) || (await caches.match(navigationFallback(url.pathname), { ignoreVary: true })) || caches.match('/offline.html', { ignoreVary: true })));
    return;
  }

  event.respondWith(caches.match(request, { ignoreVary: true }).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(STATIC_CACHE).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
