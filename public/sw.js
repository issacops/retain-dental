// Basic Service Worker for Retain Dental PWA
const CACHE_NAME = 'retain-dental-v1';

// Skip installing files right now for Dev speed. But intercept fetch requests for offline.
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Cache-First strategy for static assets, network-first for API
self.addEventListener('fetch', (event) => {
    // Only intercept basic GET requests
    if (event.request.method !== 'GET') return;
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
