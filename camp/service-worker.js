const CACHE_NAME = "camp-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("fetch", event => {
  // Always go to network during development
  event.respondWith(fetch(event.request));
});