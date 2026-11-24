// Service worker de la ligue : rend le site installable et affiche les rappels.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Pickleball jeudi', {
    body: d.body || 'Confirme ta présence pour jeudi.',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { url: d.url || './#presences' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data && e.notification.data.url || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) { c.navigate(url); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
