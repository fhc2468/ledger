// 離線快取：開過一次之後，沒有網路也能用
const C="ledger-v3",FILES=["./","./index.html","./manifest.json","./icon-192.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:"reload"})))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  // 永遠先向 GitHub 拿最新版本（略過瀏覽器的 10 分鐘快取）；沒有網路時才用離線版本
  e.respondWith(fetch(e.request.url,{cache:"no-cache"}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
});
