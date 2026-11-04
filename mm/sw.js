// Modo sin conexión.
// Al publicar una versión nueva de index.html, sube también este archivo cambiando VERSION.
const VERSION = 'mm-1';
const LOCAL = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png'];
const REMOTE = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(LOCAL);
    await Promise.all(REMOTE.map(async u => {
      try { await c.put(u, await fetch(u, { mode: 'no-cors' })); } catch (_) {}
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = req.mode === 'navigate';
  const isFont = url.host.endsWith('googleapis.com') || url.host.endsWith('gstatic.com');
  if (url.origin !== location.origin && !REMOTE.includes(req.url) && !isFont) return;
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    if (isPage) {
      // Página: intenta la versión nueva; sin conexión, usa la guardada.
      try { const r = await fetch(req); c.put('./index.html', r.clone()); return r; }
      catch (_) { return (await c.match('./index.html')) || (await c.match('./')); }
    }
    const hit = await c.match(req, { ignoreSearch: false });
    if (hit) return hit;
    try { const r = await fetch(req); if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }
    catch (_) { return Response.error(); }
  })());
});
