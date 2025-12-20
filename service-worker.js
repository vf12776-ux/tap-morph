const CACHE_NAME = 'morph-v5';
const urlsToCache = [
    '/tap-morph/',
    '/tap-morph/index.html',
    '/tap-morph/style.css',
    '/tap-morph/app.js',
    '/tap-morph/manifest.json',
    '/tap-morph/icons/icon-192.png',
    '/tap-morph/icons/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.map(key => 
                key !== CACHE_NAME ? caches.delete(key) : null
            ))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
