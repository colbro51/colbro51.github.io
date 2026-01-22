// Always activate immediately
self.addEventListener("install", event => {
  self.skipWaiting();
});

// Take control of all pages immediately
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Always fetch fresh files (no caching)
self.addEventListener("fetch", event => {
  event.respondWith(fetch(event.request));
});