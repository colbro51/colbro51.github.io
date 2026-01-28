// service-worker.js

const CACHE_NAME = "fb-summercamp-static-v1";

// Only cache truly static assets (no HTML, no JS)
const STATIC_ASSETS = [
  "/camp/style.css",
  "/camp/manifest.json",
  "/camp/icon-192.png",
  "/camp/icon-512.png"
];

// Install: cache static shell assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

// Fetch: network-first for HTML/JS, cache-first for static assets and images
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin GET
  if (req.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Always fetch fresh HTML (including /camp/ and /camp/index.html)
  if (req.mode === "navigate" ||
      url.pathname === "/camp/" ||
      url.pathname === "/camp/index.html") {
    event.respondWith(fetch(req));
    return;
  }

  // Always fetch fresh JS
  if (url.pathname.endsWith(".js")) {
    event.respondWith(fetch(req));
    return;
  }

  // Cache-first for static assets and images (e.g. docs/*.png)
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return response;
      });
    })
  );
});