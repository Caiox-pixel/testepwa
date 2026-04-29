const CACHE_NAME = "chaos-rush-v1";
const RUNTIME_CACHE = "chaos-rush-runtime";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/phaser.min.js",
  "./js/main.js",
  "./js/VirtualJoystick.js",
  "./js/scene/LoginScene.js",
  "./js/scene/RegisterScene.js",
  "./js/scene/MenuScene.js",
  "./js/scene/MainScene.js",
  "./js/entities/Player/player.js",
  "./js/entities/Player/PlayerClass.js",
  "./js/entities/Player/StatsPlayer.js",
  "./js/entities/Player/DamagePlayer.js",
  "./js/XPOrb.js",
  "./js/entities/Enemy/enemy.js",
  "./js/entities/Enemy/EnemyBullet.js",
  "./js/systems/UpgradeSystem.js",
  "./js/systems/ClassSystems.js",
  "./js/systems/WeaponSystem.js",
  "./js/systems/PassiveSystem/PassiveSystem.js",
  "./js/systems/PassiveSystem/PassiveAlquimista.js",
  "./js/systems/PassiveSystem/PassiveCoveiro.js",
  "./js/systems/PassiveSystem/PassiveSentinela.js",
  "./js/Director/SpawnDirector.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[Service Worker] Cache instalado");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log("[Service Worker] Limpando cache", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then(networkResponse => {
        if (!networkResponse || !networkResponse.ok) {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open(RUNTIME_CACHE).then(cache => {
          cache.put(request, responseClone).catch(err => {
            console.warn('[Service Worker] Falha ao armazenar em cache:', err);
          });
        });

        return networkResponse;
      }).catch(() => caches.match(request) || new Response("Offline", { status: 503 }));
    })
  );
});