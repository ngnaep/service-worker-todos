//importScripts('node_modules/dexie/dist/dexie.min.js');
var CACHE_STATIC_NAME = 'static-v1';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';
var STATIC_FILES = [
  '/',
  '/index.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/promise.js',
  '/src/js/fetch.js',
  '/src/js/material.min.js',
  'https://unpkg.com/dexie@latest/dist/dexie.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/todoList.jpg',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.blue-light_blue.min.css'
];


self.addEventListener('install', function (event) {
  console.log('Service worker Installation event', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('Service worker - pre caching all the assets');
        cache.addAll(STATIC_FILES);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('Service worker Activation Event', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('Service worker remove old cache', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { 
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); 
  } else {
    cachePath = string; 
  }
  return array.indexOf(cachePath) > -1;
}
self.addEventListener('fetch', function (event) {

  var url = 'https://todolist-f7963.firebaseio.com/todoList.json';
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
        .then(function (cache) {
          return fetch(event.request)
            .then(function (res) {
              cache.put(event.request, res.clone());
              return res;
            });
        })
    );
  } 
  else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
      caches.match(event.request)
    );
  } 
  else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache) {
                    // trimCache(CACHE_DYNAMIC_NAME, 3);
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
              .catch(function (err) {
                return caches.open(CACHE_STATIC_NAME)
                  .then(function (cache) {
                    if (event.request.headers.get('accept').includes('text/html')) {
                      return cache.match('/offline.html');
                    }
                  });
              });
          }
        })
    );
  }
});


function serverSync() {
  const db = new Dexie('TODO');
  db.version(1).stores({
   response: '++id, taskId, task'
  })
  db.open();
  db.response.toCollection().each(res=>{
    console.log("Each response", res);
    fetch('https://us-central1-todolist-f7963.cloudfunctions.net/addTodo', {
     method: 'POST',
     body: JSON.stringify({
       'id': res.taskId,
       'answer': res.task
     }),
     headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
   });

  })
  return ;
 }