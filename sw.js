// Офлайн-кэш. При изменении файлов увеличьте номер версии.
const V="atelier-v5",FILES=["./","index.html","manifest.json","icon.png","logo.png","logo-white.png","icon-512.png"];
self.addEventListener("install",e=>{
 e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))));
 self.skipWaiting();
});
self.addEventListener("activate",e=>{
 e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
// сначала кэш, в фоне обновляем из сети
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 e.respondWith(caches.open(V).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>{
  const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
  return hit||net;
 })));
});
