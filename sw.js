const CACHE_NAME = 'dolar-al-dia-v9';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js?v=9',
  '/manifest.json',
  '/icon-32.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png'
];

// 1. Instalación: Cachear recursos estáticos mínimos viables
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activación: Limpieza de cachés anteriores
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

// 3. Fetch: Estrategia Stale-While-Revalidate para archivos estáticos locales
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Excluir llamadas a APIs externas para asegurar datos en tiempo real
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      });
    })
  );
});
