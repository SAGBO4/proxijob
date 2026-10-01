// Service Worker ProxiJob Bénin
const CACHE_NAME = "proxijob-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/jobeurs",
  "/demandes",
  "/connexion",
  "/inscription",
  "/icons/icon-192x192.svg",
  "/icons/icon-512x512.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Ignorer les requêtes API et les requêtes non GET pour ne pas perturber les mutations Neon
  if (event.request.method !== "GET" || event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Mettre en cache si réponse valide
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // En cas de coupure réseau (tolérance réseau mobile béninois)
        return caches.match(event.request);
      })
  );
});
