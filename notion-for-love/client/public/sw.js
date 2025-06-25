/**
 * Love Journey - Service Worker
 * 
 * PWA service worker for offline functionality, caching,
 * and background sync capabilities.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const CACHE_NAME = 'love-journey-v1.0.0';
const STATIC_CACHE = 'love-journey-static-v1.0.0';
const DYNAMIC_CACHE = 'love-journey-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/auth\//,
  /\/api\/user\//,
  /\/api\/milestones\//,
  /\/api\/memories\//,
  /\/api\/goals\//
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static files - cache first strategy
    if (STATIC_FILES.some(file => url.pathname.endsWith(file))) {
      event.respondWith(cacheFirst(request));
    }
    // API requests - network first strategy
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkFirst(request));
    }
    // Images and media - cache first strategy
    else if (request.destination === 'image' || request.destination === 'video' || request.destination === 'audio') {
      event.respondWith(cacheFirst(request));
    }
    // Other requests - network first strategy
    else {
      event.respondWith(networkFirst(request));
    }
  }
});

// Cache first strategy - good for static assets
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline content not available', { status: 503 });
  }
}

// Network first strategy - good for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    
    return new Response('Content not available offline', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync-memories') {
    event.waitUntil(syncMemories());
  } else if (event.tag === 'background-sync-checkins') {
    event.waitUntil(syncCheckins());
  } else if (event.tag === 'background-sync-goals') {
    event.waitUntil(syncGoals());
  }
});

// Sync offline memories when back online
async function syncMemories() {
  try {
    const offlineMemories = await getOfflineData('memories');
    for (const memory of offlineMemories) {
      await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memory)
      });
    }
    await clearOfflineData('memories');
    console.log('Memories synced successfully');
  } catch (error) {
    console.error('Failed to sync memories:', error);
  }
}

// Sync offline check-ins when back online
async function syncCheckins() {
  try {
    const offlineCheckins = await getOfflineData('checkins');
    for (const checkin of offlineCheckins) {
      await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkin)
      });
    }
    await clearOfflineData('checkins');
    console.log('Check-ins synced successfully');
  } catch (error) {
    console.error('Failed to sync check-ins:', error);
  }
}

// Sync offline goals when back online
async function syncGoals() {
  try {
    const offlineGoals = await getOfflineData('goals');
    for (const goal of offlineGoals) {
      await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
      });
    }
    await clearOfflineData('goals');
    console.log('Goals synced successfully');
  } catch (error) {
    console.error('Failed to sync goals:', error);
  }
}

// Helper functions for offline data management
async function getOfflineData(type) {
  try {
    const cache = await caches.open('offline-data');
    const response = await cache.match(`/offline/${type}`);
    if (response) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error getting offline data:', error);
    return [];
  }
}

async function clearOfflineData(type) {
  try {
    const cache = await caches.open('offline-data');
    await cache.delete(`/offline/${type}`);
  } catch (error) {
    console.error('Error clearing offline data:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'You have a new notification from Love Journey',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logo192.png'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'Love Journey';
    options.data = { ...options.data, ...data };
  }

  event.waitUntil(
    self.registration.showNotification('Love Journey', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered', event.tag);
  
  if (event.tag === 'content-sync') {
    event.waitUntil(syncAllContent());
  }
});

async function syncAllContent() {
  try {
    await Promise.all([
      syncMemories(),
      syncCheckins(),
      syncGoals()
    ]);
    console.log('All content synced successfully');
  } catch (error) {
    console.error('Failed to sync content:', error);
  }
}
