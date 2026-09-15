/**
 * Sorteitos - Service Worker
 * Enables PWA installation, offline shell caching, and Web Share Target reception.
 */

const CACHE_NAME = 'sorteitos-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './styles/main.css',
  './styles/fishbowl.css',
  './styles/components.css',
  './scripts/app.js',
  './scripts/store.js',
  './scripts/social.js',
  './scripts/fishbowl.js',
  './scripts/confetti.js',
  './scripts/sound.js',
  './scripts/firebase-sync.js',
  './scripts/shortcuts-guide.js',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('PWA Cache addAll warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Let network requests pass, fallback to cache for offline navigation
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
