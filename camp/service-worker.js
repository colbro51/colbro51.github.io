// service-worker.js

// ------------------------------------------------------------
// Install: activate immediately
// ------------------------------------------------------------
self.addEventListener("install", () => {
  self.skipWaiting();
});

// ------------------------------------------------------------
// Activate: take control of all open clients
// ------------------------------------------------------------
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// ------------------------------------------------------------
// Fetch: network-only (no caching, no offline support)
// ------------------------------------------------------------
self.addEventListener("fetch", event => {
  event.respondWith(fetch(event.request));
});