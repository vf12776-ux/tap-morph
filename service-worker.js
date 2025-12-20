const CACHE_NAME = 'morph-v3'; 
const urlsToCache = [
    '/tap-morph/',
    '/tap-morph/index.html',
    '/tap-morph/style.css',
    '/tap-morph/app.js',
    '/tap-morph/manifest.json',
    '/tap-morph/icons/icon-192.png',
    '/tap-morph/icons/icon-512.png'
];

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('[Service Worker] Установка...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Кеширую файлы:', urlsToCache);
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('[Service Worker] Установлен');
                return self.skipWaiting();
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    console.log('[Service Worker] Активация...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Удаляю старый кеш:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Активирован');
            return self.clients.claim();
        })
    );
});

// Перехват сетевых запросов
self.addEventListener('fetch', event => {
    // Обрабатываем только GET запросы
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Если файл есть в кеше, возвращаем его
                if (response) {
                    console.log('[Service Worker] Отдаю из кеша:', event.request.url);
                    return response;
                }
                
                // Иначе загружаем из сети
                console.log('[Service Worker] Загружаю из сети:', event.request.url);
                return fetch(event.request)
                    .then(response => {
                        // Проверяем, можно ли кешировать
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Клонируем ответ для кеширования
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.log('[Service Worker] Ошибка загрузки:', error);
                        // Для HTML страниц возвращаем index.html
                        if (event.request.url.match(/\.html$/) || 
                            event.request.url === self.location.origin + '/') {
                            return caches.match('./index.html');
                        }
                        return new Response('Офлайн', {
                            status: 408,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});

// Сообщения от основного скрипта
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
