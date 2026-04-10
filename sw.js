const CACHE_NAME = 'zap-lite-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './app.js',
  './js/services/supabase-client.js',
  './js/services/chat-service.js',
  './js/components/chat-ui.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

