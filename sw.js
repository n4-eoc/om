/* =====================================================
   Service Worker — لوحة تحكم تجمع حائل الصحي
   يوفر: التخزين المؤقت، العمل offline، التحديث التلقائي
   ===================================================== */

const CACHE_NAME = 'hail-health-v1';
const CACHE_VERSION = 1;

// الملفات الأساسية التي تُخزَّن فوراً عند التثبيت
const CORE_FILES = [
  './index.html',
  './logo-white.png',
  './manifest.json'
];

// ── التثبيت: تخزين الملفات الأساسية ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_FILES);
    }).then(() => {
      // تفعيل فوري بدون انتظار إغلاق النوافذ الأخرى
      return self.skipWaiting();
    })
  );
});

// ── التفعيل: حذف الكاشات القديمة ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => {
      // التحكم في جميع النوافذ المفتوحة فوراً
      return self.clients.claim();
    })
  );
});

// ── الاعتراض: استراتيجية Cache First مع Fallback ──
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل طلبات غير HTTP (chrome-extension، etc.)
  if (!request.url.startsWith('http')) return;

  // Google Fonts: Network First مع Cache كبديل
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // باقي الملفات: Cache First ثم Network
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        // تخزين الاستجابات الناجحة فقط
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // إذا فشل كل شيء وكان الطلب لـ HTML، أعد index.html
        if (request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ── رسائل من الصفحة ──
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // إرجاع إصدار الكاش عند الطلب
  if (event.data === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION, cache: CACHE_NAME });
  }
});
