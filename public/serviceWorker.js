//STORAGE OF BROWSER
const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];
const self = this;

//installation
self.addEventListener("install", (event) => {
  console.log('Service Worker installé');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened caches");
      return cache.addAll(urlsToCache);
    })
  );
});

// listen for request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

// actitivate the service worker
self.addEventListener("activate", (event) => {
  console.log('Service Worker activé');  
  const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)){
                    return caches.delete(cacheName);
                }
            })
        ))
    )
});

self.addEventListener("push", function(e) {
  console.log('Notification push reçue');
  var options = {
    body: e.data.text(),
    icon: './logo192.png',
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: 'rejoindre', title: 'Rejoindre le groupe !'},
      {action: 'close', title: 'Close'}
    ]
  };
  e.waitUntil(
    self.registration.showNotification("Meet your soul", options)
  )
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification cliquée');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('http://localhost:3000/invitation')
  );
});