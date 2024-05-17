//STORAGE OF BROWSER
const CACHE_NAME_GET = "version-1";
const CACHE_NAME_POST = "version-2";
const urlsToCache = [
  '/',
  '/home',
  '/index.html',
  '/bundle.js',
  '/favicon.ico',
  '/logo192.png',
  '/manifest.json',
];
const self = this;
const URL_POST_SEND_NOTIF_LAST = '/sendNotif'
const URL_POST_JOIN_GROUP_LAST = '/joinGroup'
const URL_GET_GROUP_REQUESTS_LAST = '/getGroupRequests';
const URL_GET_USERS_LAST = '/getUsers';
const URL_GET_USERS = 'http://localhost:3005/getUsers';
const URL_GET_USERS_WS = 'http://localhost:3005/getUsersWithoutSecurity';

//installation
self.addEventListener('install', (event) => {
  console.log("install !!")
  event.waitUntil(
    caches.open(CACHE_NAME_GET)
      .then((cache) => {
        cache.addAll(urlsToCache);
        console.log("try to fetch " + URL_GET_USERS_WS)
        return fetch(URL_GET_USERS_WS)
          .then((response) => {
            console.log(response)
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return cache.put(URL_GET_USERS, response);
          })
          .catch((error) => {
            console.log(error)
            console.error('Failed to fetch and cache:', error);
          });
      })
  );
});


// listen for request
self.addEventListener("fetch", (event) => {
  var request = event.request;
  console.log("Detected request !", request.url);

  if (event.request.url.includes(URL_GET_USERS_LAST)) {
    console.log("getUsers -----------------------------------")
    
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          console.log(response)
          // cache first
          return fetch(event.request) || response;
        })
    );
  } else if (event.request.url.includes(URL_GET_GROUP_REQUESTS_LAST)) {
    console.log("getGroupRequests -----------------------------------")
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          console.log(response)
          // network first
          return fetch(event.request) || response;
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        // cache first
        return response || fetch(event.request);
      })
    );
  }

});

// actitivate the service worker
self.addEventListener("activate", (event) => {
  console.log("activation !!")

  const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME_GET);
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

self.addEventListener('update', (event) => {
  console.log("update -------------------------------------")
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
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
    // notif de rdv

    // check if app is on first plan
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      var isAppInForeground = clientList.some(client => client.visibilityState === 'visible');
      if (isAppInForeground) {
        // Application est au premier plan
        // Envoyer les données à toutes les fenêtres pour afficher une alerte ou mettre à jour l'interface utilisateur
        clientList.forEach(client => {
          client.postMessage({
            message: 'Vous avez reçu une nouvelle invitation',
            data: options
          });
        });
      } else {
        // Application n'est pas au premier plan
        return self.registration.showNotification("Meet your soul", options).then(() => {
          return clientList.forEach(client => {
            client.postMessage({
              message: 'play-sound',
              data: null
            });
          });
        })
      }
    })
  )
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification cliquée');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('http://localhost:3000/invitations')
  );
});