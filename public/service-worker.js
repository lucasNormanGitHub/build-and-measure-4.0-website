// const CACHE_NAME = "BAM-cache";
const CACHE_NAME = "BAM-cache-2";
const FILES_TO_CACHE = [
    // default route
    ".",
    // html
    "index.html",
    "docs.html",
    "download.html",
    "release-notes.html",
    // js
    "js/main.js",
    "js/startPageAnimations.js",
    // css
    "css/style.css",
    "css/start.css",
    "css/docs.css",
    "css/download.css",
    "css/release-notes.css",
    // images
    "logo.ico",
    "images/editor.png",
    "images/editor2.png",
    "images/example-car.png",
    "images/example-house.png",
    "images/example-office-chairs.png",
    "images/example-title-block.png",
    "images/example2.png",
    "images/example-vedbod-ritn1.svg",
    "images/example-vedbod-ritn2.svg",
    "images/hamburgerIcon.png",
    "images/logo-512.png",
    "images/logo-maskable.png",
    "images/logo.png",
    "images/searchIcon.png",
    // manifest
    "manifest.json"
];

self.addEventListener("install", async e => {
    console.log("[SW] install");
    const cache = await caches.open(CACHE_NAME);
    self.skipWaiting();
    e.waitUntil(cache.addAll(FILES_TO_CACHE));
});

async function cleanUpCache() {
    const keys = await caches.keys();
    const keysToDelete = keys.map(key => {
        if (key !== CACHE_NAME) {
            return caches.delete(key);
        }
    });

    return Promise.all(keysToDelete);
}

self.addEventListener("activate", async e => {
    console.log("[SW] activate");
    e.waitUntil(cleanUpCache());
});

async function fetchAssets(e) {
    try {
        const response = await fetch(e.request);
        return response;
    } catch {
        const cache = await caches.open(CACHE_NAME);
        return cache.match(e.request);
    }
}

self.addEventListener("fetch", async e => {
    e.respondWith(fetchAssets(e));
});
