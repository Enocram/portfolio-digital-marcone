const CACHE_NAME = 'marcone-portfolio-v1';
const urlsToCache = [
  './',
  './index.html',
  './assets/css/style.css',
  './assets/js/app.js',
  './data/content.json',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(fetchRes => {
        if (!fetchRes || fetchRes.status !== 200) return fetchRes;
        const responseClone = fetchRes.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return fetchRes;
      });
    }).catch(() => {
      // Fallback offline simples (opcional)
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
      return new Response('Offline – conteúdo disponível na próxima visita.');
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});