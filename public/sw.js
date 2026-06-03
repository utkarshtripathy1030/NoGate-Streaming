const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  static: `nogate-static-${CACHE_VERSION}`,
  dynamic: `nogate-dynamic-${CACHE_VERSION}`,
  images: `nogate-images-${CACHE_VERSION}`,
  api: `nogate-api-${CACHE_VERSION}`,
};

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

const API_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  event.waitUntil(
    caches.open(CACHE_NAMES.static)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('[SW] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - advanced caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - cache but validate
  if (url.pathname.includes('/api/')) {
    event.respondWith(cacheApiRequest(request));
    return;
  }

  // Image requests - cache first
  if (request.destination === 'image') {
    event.respondWith(cacheImageRequest(request));
    return;
  }

  // Dynamic content - network first
  event.respondWith(networkFirstStrategy(request));
});

// Network first strategy with offline fallback
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const responseToCache = response.clone();
      caches.open(CACHE_NAMES.dynamic)
        .then((cache) => {
          cache.put(request, responseToCache);
        })
        .catch((error) => {
          console.error('[SW] Cache put failed:', error);
        });
    }
    return response;
  } catch (error) {
    console.log('[SW] Network request failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return createOfflineResponse();
  }
}

// Cache first strategy for images
async function cacheImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetch(request);
    if (response && response.status === 200) {
      const responseToCache = response.clone();
      caches.open(CACHE_NAMES.images)
        .then((cache) => {
          cache.put(request, responseToCache);
        });
    }
    return response;
  } catch (error) {
    console.error('[SW] Image fetch failed:', error);
    // Return placeholder image or cached version
    return caches.match(request)
      .then((response) => response || createPlaceholderImage());
  }
}

// API cache strategy
async function cacheApiRequest(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const responseToCache = response.clone();
      const cache = await caches.open(CACHE_NAMES.api);
      cache.put(request, responseToCache);
    }
    return response;
  } catch (error) {
    console.log('[SW] API request failed, checking cache');
    return caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Check if cache is too old
          const cacheDate = cachedResponse.headers.get('sw-cached-date');
          const now = Date.now();
          if (cacheDate && (now - parseInt(cacheDate)) > API_CACHE_DURATION) {
            console.log('[SW] API cache expired');
            return createOfflineResponse();
          }
          return cachedResponse;
        }
        return createOfflineResponse();
      });
  }
}

// Create offline response
function createOfflineResponse() {
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'You are currently offline. Some features may be limited.',
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }
  );
}

// Create placeholder image
function createPlaceholderImage() {
  const canvas = new OffscreenCanvas(200, 300);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, 200, 300);
  ctx.fillStyle = '#666';
  ctx.font = '16px Arial';
  ctx.fillText('Image Offline', 50, 150);
  return canvas.convertToBlob().then((blob) => new Response(blob));
}

// Background sync (optional - for future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-watch-history') {
    event.waitUntil(syncWatchHistory());
  }
});

async function syncWatchHistory() {
  try {
    console.log('[SW] Syncing watch history');
    // Implementation for syncing watch history with server
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}
