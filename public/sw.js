// Service Worker for Retain Dental PWA
const CACHE_NAME = 'retain-dental-v2';
const OFFLINE_URL = '/index.html';

// Take over as soon as a new version is available.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Drop every previous cache so stale bundles are never served.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // API / Supabase: always network, only fall back to cache when offline.
  if (url.pathname.startsWith('/api') || url.hostname.includes('supabase')) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // App shell / HTML navigations: NETWORK-FIRST so a new deployment is picked
  // up immediately (this was the cause of users being stuck on an old build).
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Content-addressed static assets: cache-first is safe.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200 &&
            (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icon'))) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});

// Listen for Push Notifications
self.addEventListener('push', function (event) {
  let data = { title: "Retain OS", content: "You have a new update in your Care Plan." };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.content = event.data.text();
    }
  }

  const options = {
    body: data.content,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle Notification Clicks
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click received.');

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
