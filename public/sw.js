/**
 * Joe4cast Service Worker — lightweight offline shell
 * ─────────────────────────────────────────────────────
 * Strategies:
 *   - Hashed build assets (/assets/*): cache-first
 *   - Navigations: network-first, offline -> cached index.html
 *   - API / proxy calls: network only (never cached)
 */

const CACHE = 'joe4cast-v1';
const SHELL = 'index.html';

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
            await self.clients.claim();
        })()
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // Never intercept API / proxy / cross-origin traffic
    if (url.origin !== self.location.origin) return;
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/fanart-api/')) return;

    // Hashed Vite assets: cache-first (immutable content)
    if (url.pathname.startsWith('/assets/')) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE);
                const hit = await cache.match(req);
                if (hit) return hit;
                const res = await fetch(req);
                if (res.ok) cache.put(req, res.clone());
                return res;
            })()
        );
        return;
    }

    // App navigations: network-first with cached shell fallback
    if (req.mode === 'navigate') {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE);
                try {
                    const res = await fetch(req);
                    if (res.ok) cache.put(SHELL, res.clone());
                    return res;
                } catch {
                    const shell = (await cache.match(SHELL)) || (await cache.match(req));
                    return (
                        shell ||
                        new Response('<h1>Offline</h1>', {
                            status: 503,
                            headers: { 'Content-Type': 'text/html' },
                        })
                    );
                }
            })()
        );
    }
});
