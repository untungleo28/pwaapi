// Nama cache
const CACHE_NAME = 'webuntung-cache-v1';

// Daftar URL yang akan dicache
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // Daftar file lain yang diperlukan untuk offline
];

// Event install untuk service worker
self.addEventListener('install', event => {
  event.waitUntil(
    // Membuka cache dan menyimpan file yang sudah disebutkan dalam urlsToCache
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching files');
      return cache.addAll(urlsToCache);
    })
  );
});

// Event activate untuk service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  // Menghapus cache lama yang tidak digunakan lagi
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Event fetch untuk menangani permintaan jaringan dan mengembalikan file dari cache atau jaringan
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Jika file ada di cache, kembalikan file dari cache
      if (response) {
        return response;
      }
      // Jika tidak ada, ambil dari jaringan
      return fetch(event.request);
    })
  );
});
