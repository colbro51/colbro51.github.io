// service-worker.js

const CACHE_NAME = "fb-summercamp-shell-v1";

const APP_SHELL = [
  "/camp/",
  "/camp/index.html",
  "/camp/style.css",
  "/camp/ui.js",
  "/camp/maps.js",
  "/camp/logic.js",
  "/camp/camp-data.js",
  "/camp/manifest.json",
  "/camp/icon-192.png",
  "/camp/icon-512.png"
];

// Install: cache the app shell (force fresh copies)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(
        APP_SHELL.map(url => new Request(url, { cache: "reload" }))
      )
    )
  );
  self.skipWaiting();
});

// Activate: take control and clean old caches
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

      // Notify clients that a new version is active
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.postMessage({ type: "NEW_VERSION_READY" });
      }
    })()
  );
});

// Fetch: offline-first for same-origin GET, with ignoreSearch for ?v=...
self.addEventListener("fetch", event => {
  const req = event.request;

  // Only handle same-origin GET requests
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) {
    return;
  }

  // For navigations: serve index.html from cache (SPA-style)
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("/camp/index.html").then(cached => {
        if (cached) return cached;
        return fetch(req);
      })
    );
    return;
  }

  // For other same-origin GETs: cache-first, ignoring ?v=...
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return response;
      });
    })
  );
});