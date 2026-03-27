const CACHE = 'sudoku-v1';
const ASSETS = ['./', './index.html', './css/styles_v3.css', './js/sudoku.js', './js/ui.js', './manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
