// Modo sin conexión. Al publicar una versión nueva de index.html, cambia VERSION.
const VERSION = 'v2345-1';
const LOCAL = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(LOCAL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION && k.startsWith('v2345')) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    if (req.mode === 'navigate') {
      try { const r = await fetch(req); c.put('./index.html', r.clone()); return r; }
      catch (_) { return (await c.match('./index.html')) || (await c.match('./')); }
    }
    const hit = await c.match(req);
    if (hit) return hit;
    try { const r = await fetch(req); if (r.ok) c.put(req, r.clone()); return r; }
    catch (_) { return Response.error(); }
  })());
});
