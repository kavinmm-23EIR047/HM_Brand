// HM Brand Sacred Agarbattis & Fragrances - Web Push Service Worker
// Cross-browser push listener (Android Chrome, iOS Safari 16.4+, Windows/Mac Chrome, Edge, Firefox)

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let notification = {
    title: 'HM Agarbattis Coimbatore',
    body: 'Sacred fragrance updates from HM Brand.',
    icon: '/images/brand_logo_gold_transparent.png',
    badge: '/images/brand_logo_gold_transparent.png',
    url: '/',
    tag: 'hm-brand-general',
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notification = {
        title: data.title || notification.title,
        body: data.body || notification.body,
        icon: data.icon || notification.icon,
        badge: data.badge || notification.badge,
        image: data.image,
        url: data.url || data.data?.url || notification.url,
        tag: data.tag || (data.data?.orderNumber ? `hm-order-${data.data.orderNumber}` : 'hm-brand-alert'),
        data: data.data || { url: data.url || '/' },
      };
    } catch {
      notification.body = event.data.text();
    }
  }

  const notificationOptions = {
    body: notification.body,
    icon: notification.icon,
    badge: notification.badge,
    image: notification.image,
    tag: notification.tag,
    renotify: true,
    vibrate: [200, 100, 200, 100, 200], // Haptic vibration on Android/mobile
    data: {
      url: notification.url || '/',
      timestamp: Date.now(),
      ...(notification.data || {}),
    },
    actions: [
      {
        action: 'view',
        title: 'View Details ➔',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(notification.title, notificationOptions)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing open tab if available
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

