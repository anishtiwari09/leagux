var arr = [];
let dynamicCache = "dynamicCache";
let offlinePost = "offlinePost";
let offlinePostImageAssets = "offlinePostImageAssets";
self.addEventListener("install", (evt) => {
  console.log(evt);
});

self.addEventListener("active", (evt) => {
  console.log(evt);
});
self.addEventListener("fetch", (evt) => {
  let requestType = evt.request.destination;
  const requestUrl = new URL(evt.request.url);

  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return fetch(evt.request)
        .then((fetchRes) => {
          if (requestType === "image") {
            return fetchRes;
          }
          if (cacheRes) return fetchRes;
          return caches.open(dynamicCache).then((cache) => {
            cache
              .put(evt.request, fetchRes.clone())
              .catch((e) => console.log(e));

            return fetchRes;
          });
        })
        .catch(async (e) => {
          return cacheRes;
        });
    })
  );
});

self.addEventListener("notificationclick", (event) => {});

self.addEventListener("message", (event) => {
  const { data: message } = event;

  let { type, data, id, imageUrl } = message;
  id = id.replaceAll(":", "_");
  console.log(type);
  if (type === "addToOffline") {
    caches.match(id).then((res) => {
      if (!res) {
        caches.open(offlinePost).then((cache) => {
          cache.put(id, new Response(data)).then((res) => {
            if (imageUrl) {
              caches.open(dynamicCache).then((cache) => {
                fetch(imageUrl)
                  .then((fetchRes) => {
                    let imageRequest = new Request(imageUrl);
                    cache
                      .put(imageRequest, fetchRes.clone())
                      .catch((e) => console.log(e));
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              });
            }
          });
        });
      }
    });
  } else if (type === "removeFromOffline") {
    removeFromOffline(id, imageUrl);
  }
});
async function removeFromOffline(id, imageUrl) {
  try {
    console.log(id);
    let cache = await caches.open(offlinePost);

    let res = await cache.delete(id);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
  try {
    let cache = await caches.open(dynamicCache);
    let res = await cache.delete(imageUrl);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
}
// self.addEventListener("removeFromOffline", (evt) => {});
