/* Toán 8 Song Ngữ — service worker: học được cả khi mất mạng.
   - Tệp tĩnh của Next (/_next/static, biểu tượng): lấy từ bộ nhớ đệm trước (tên tệp đã có mã phiên bản).
   - Trang: lấy từ mạng trước; mất mạng thì dùng bản đã lưu; chưa từng mở thì hiện /offline.html.
   Tiến độ học nằm trong localStorage nên không cần mạng. */
const CACHE = "t8sn-v1";
const SHELL = ["/", "/hoc", "/on-tap", "/cong-cu", "/cua-em", "/offline.html", "/icons/192"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) =>
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  )
);

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Tệp tĩnh: bộ nhớ đệm trước
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            // Phải clone ngay (trước khi trả res cho trình duyệt), clone sau thì thân đã bị đọc → lỗi, không lưu được
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  // Trang và dữ liệu điều hướng của Next: mạng trước, mất mạng dùng bản đã lưu
  const isPage = req.mode === "navigate";
  const isRsc = req.headers.get("RSC") === "1";
  if (isPage || isRsc) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(async () => (await caches.match(req)) || (isPage ? caches.match("/offline.html") : Response.error()))
    );
  }
});
