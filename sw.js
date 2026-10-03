var CACHE='luxurysmok-v2';
var ARCHIVOS=['./','./index.html','./logo.png','./manifest.json'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ARCHIVOS);}));
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){if(k!==CACHE)return caches.delete(k);}));
  }));
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r||fetch(e.request).then(function(res){
        if(res&&res.status===200&&res.type==='basic'){
          var copia=res.clone();
          caches.open(CACHE).then(function(c){c.put(e.request,copia);});
        }
        return res;
      }).catch(function(){return caches.match('./index.html');});
    })
  );
});
