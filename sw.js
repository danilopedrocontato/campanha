// Atualização automática: o app sempre busca a versão nova na internet
// e só usa a cópia guardada quando está sem sinal.
var V="campanha-v4";
var SHELL=["./","index.html","manifest.json","icon-192.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(V).then(function(c){
    return Promise.all(SHELL.map(function(u){return fetch(u,{cache:"reload"}).then(function(r){if(r.ok)return c.put(u,r)}).catch(function(){})}))
  }).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET")return;
  var u=new URL(r.url),mesma=u.origin===location.origin;
  var cdn=/(^|\.)gstatic\.com$|^cdnjs\.cloudflare\.com$|^fonts\.googleapis\.com$/.test(u.hostname);
  if(!mesma&&!cdn)return;
  e.respondWith((mesma?fetch(r,{cache:"no-store"}):fetch(r)).then(function(res){
    if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}
    return res
  }).catch(function(){
    return caches.match(r,{ignoreSearch:true}).then(function(m){return m||(r.mode==="navigate"?caches.match("index.html"):undefined)})
  }))});
