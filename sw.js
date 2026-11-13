// Hors-ligne : la page d'accès, l'appli chiffrée et toutes les images sont gardées sur le téléphone.
// Réseau faible (salle de sport…) : on n'attend jamais plus de 2,5 s, on prend la copie du téléphone.
const CACHE = "cerveau-pub-202611130204";
const SHELL = ["./", "index.html", "app.enc?v=202611130204", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "vendor/three.module.min.js"];
const IMAGES = ["icons/persos/berkano.jpg", "icons/persos/dagaz.jpg", "icons/persos/fehu.jpg", "icons/persos/hagalaz.jpg", "icons/persos/ingwaz.jpg", "icons/persos/isa.jpg", "icons/persos/jera.jpg", "icons/persos/sowilo-enrage.jpg", "icons/persos/sowilo.jpg", "icons/persos/tiwaz.jpg", "icons/persos/uruz.jpg", "icons/quetes/dagaz-humeur.jpg", "icons/quetes/dagaz-journal.jpg", "icons/quetes/fehu-depenses.jpg", "icons/quetes/fehu-epargne.jpg", "icons/quetes/isa-coucher.jpg", "icons/quetes/isa-dort.jpg", "icons/quetes/jera-eau.jpg", "icons/quetes/jera-pesee.jpg", "icons/quetes/jera-repas.jpg", "icons/quetes/tiwaz-candidature.jpg", "icons/quetes/tiwaz-travail.jpg", "icons/quetes/uruz-marche.jpg", "icons/quetes/uruz-seance.jpg", "icons/compagnons/biceps.png", "icons/compagnons/coeur.png", "icons/compagnons/equilibre.png", "icons/compagnons/eveil.png", "icons/compagnons/flow.png", "icons/compagnons/gratitude.png", "icons/compagnons/guitare.png", "icons/compagnons/huit-heures.png", "icons/compagnons/hypertrophie.png", "icons/compagnons/magnesium.png", "icons/compagnons/melatonine.png", "icons/compagnons/os.png", "icons/compagnons/paradoxal.png", "icons/compagnons/profond.png", "icons/compagnons/proteines.png", "icons/compagnons/saumon.png", "icons/compagnons/stoicisme.png", "icons/compagnons/tirelire.png", "icons/compagnons/tresor.png", "icons/compagnons/victoire-t.png", "icons/torse.jpg", "icons/torse-eteint.jpg"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then(async (c) => { await c.addAll(SHELL); try { await c.addAll(IMAGES); } catch (x) {} }).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  const url = new URL(e.request.url), image = /\/icons\//.test(url.pathname);
  e.respondWith((async () => {
    const copie = await caches.match(e.request, { ignoreSearch: true });
    if (image && copie) return copie;   // les images ne changent pas : directement depuis le téléphone
    const reseau = fetch(e.request).then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); } return r; });
    if (!copie) return reseau;
    // on laisse 2,5 s au réseau pour avoir la dernière version, sinon la copie du téléphone
    return Promise.race([reseau.catch(() => copie), new Promise((ok) => setTimeout(() => ok(copie), 2500))]);
  })());
});
