var V="campanha-v3";
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(["./","index.html","manifest.json","icon-192.png"])}).then(function(){return self.skipWaiting()}).catch(function(){}))});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET")return;
  var u=new URL(r.url);
  var ok=u.origin===location.origin||/(^|\.)gstatic\.com$|^cdnjs\.cloudflare\.com$|^fonts\.googleapis\.com$/.test(u.hostname);
  if(!ok)return;
  e.respondWith(fetch(r).then(function(res){
    if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}
    return res}).catch(function(){return caches.match(r)}))});
