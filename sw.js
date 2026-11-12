/* Offline support for the profile site and ATINDLET BOT.
 *
 * On first visit it saves every page, the styles, the scripts (the bot lives
 * in chatbot.js and needs no network) and the resume. Photos are saved as
 * they are viewed. Online, pages always come from the network first so edits
 * show up straight away; offline, the saved copy is served instead.
 *
 * Bump VERSION when CORE changes, so old caches are cleared.
 */
var VERSION = 'v1-20261112';
var CACHE = 'hillary-profile-' + VERSION;
var CORE = [
  './', 'index.html', 'about.html', 'experience.html', 'proposal.html', 'skills.html',
  'stem.html', 'achievements.html', 'certifications.html', 'community.html', 'work.html',
  'contact.html', '404.html', 'style.css', 'main.js', 'chatbot.js', 'hero-headshot.jpg',
  'Hillary-Atindah-George-Resume.pdf'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('hillary-profile-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function save(req, res) {
  // opaque (status 0) is fine for Google Fonts; skip real errors
  if (res && (res.ok || res.type === 'opaque')) {
    var copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copy); });
  }
  return res;
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== self.location.origin && !fonts) return;

  if (fonts) {
    // fonts never change at a given URL: cache first
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) { return save(req, res); });
    }));
    return;
  }

  // network first, saved copy when offline; ignoreSearch so style.css?v=... finds style.css
  e.respondWith(fetch(req).then(function (res) { return save(req, res); }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.match('index.html');
      return Response.error();
    });
  }));
});
