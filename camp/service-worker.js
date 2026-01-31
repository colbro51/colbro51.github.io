// service-worker.js (or whatever path you're using)

// Activate immediately and take control of all clients
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Claim clients so this SW controls open pages right away
  event.waitUntil(self.clients.claim());
});

// Network-only fetch: no caching, no interception logic
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});