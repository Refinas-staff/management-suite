// 旧キャッシュを解除するための移行用Service Workerです。
// lost-ipad.html側では新規登録しないため、解除後は通常のWebページとして動作します。
self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.filter(function (key) {
      return key.indexOf('lost-ipad') === 0;
    }).map(function (key) {
      return caches.delete(key);
    }));
    await self.registration.unregister();
    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      try { await client.navigate(client.url); } catch (e) {}
    }
  })());
});
