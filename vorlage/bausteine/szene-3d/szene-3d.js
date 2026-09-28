// Lader der 3D-Szene (klein, ohne three.js). Einbinden: <script src="/js/szene-3d.js" defer></script>
// Lädt szene-3d.modul.js erst, wenn die Seite fertig geladen ist, die Szene sichtbar wird, keine reduzierte
// Bewegung und kein „Daten sparen“ gewünscht sind und WebGL wirklich geht. Sonst bleibt das Poster (Standbild).
(function () {
  var skript = document.currentScript;
  function start() {
    var szenen = document.querySelectorAll('.szene-3d');
    if (!szenen.length) return;
    var modul = szenen[0].getAttribute('data-modul') ||
      (skript && skript.src ? skript.src.replace(/szene-3d(\.min)?\.js(\?.*)?$/, 'szene-3d.modul.js') : 'szene-3d.modul.js');
    var laden = function () { return import(modul); };

    // Werkzeug-Modus für poster-rendern.mjs: ?standbild → Standbild-Funktion bereitstellen, nichts bewegen.
    if (/[?&]standbild\b/.test(location.search)) {
      window.szeneStandbild = function (breite, nr) { return laden().then(function (m) { return m.standbild(szenen[nr || 0], breite); }); };
      document.documentElement.classList.add('szene-standbild');
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var netz = navigator.connection;
    if (netz && (netz.saveData || /(^|-)2g$/.test(netz.effectiveType || ''))) return;
    var geladen = null;
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        beobachter.unobserve(e.target);
        leerlauf(function () {
          geladen = geladen || laden();
          geladen.then(function (m) { return m.start(e.target); }).catch(function (f) { console.warn('3D-Szene: Standbild bleibt', f); });
        });
      });
    }, { rootMargin: '200px 0px' });
    // Erst nach dem Laden und im Leerlauf: Gerät prüfen, dann die sichtbaren Szenen beobachten.
    var los = function () {
      leerlauf(function () {
        if (!schnellGenug()) { szenen.forEach(function (el) { el.dataset.szene = 'zu-langsam'; }); return; }
        szenen.forEach(function (el) { beobachter.observe(el); });
      });
    };
    document.readyState === 'complete' ? los() : addEventListener('load', los, { once: true });
  }
  // Darf dieses Gerät die Szene rechnen? "?szene3d=an" in der Adresse erzwingt sie (für Screenshots und Prüfungen).
  function schnellGenug() {
    // Erzwingen für Screenshots und Prüfungen auf Maschinen ohne Grafikchip: Geräteprüfung und Probelauf aus.
    if (/[?&]szene3d=an\b/.test(location.search)) { document.documentElement.classList.add('szene-3d-erzwungen'); return true; }
    var urteil = merken('lesen');
    if (urteil) return urteil === 'schnell';
    var ok = grafikOk();
    merken(ok ? 'schnell' : 'zu-langsam');
    return ok;
  }
  function leerlauf(f) { 'requestIdleCallback' in window ? requestIdleCallback(f, { timeout: 1500 }) : setTimeout(f, 200); }
  // Urteil über das Gerät für die ganze Sitzung merken – jede weitere Seite startet sofort richtig.
  function merken(wert) {
    try { if (wert === 'lesen') return sessionStorage.getItem('szene-3d'); sessionStorage.setItem('szene-3d', wert); } catch (e) {}
    return null;
  }
  // Geräteprüfung: Nur-Software-Renderer (kein Grafikchip nutzbar – alte Geräte, virtuelle Maschinen,
  // Fernwartung) erkennt man am Namen. Dort bleibt es beim Standbild, three.js wird nie geladen.
  // Alles andere darf starten; wie schnell es dann wirklich ist, misst die Szene selbst (Probelauf, min-fps).
  var SOFTWARE = /swiftshader|llvmpipe|softpipe|basic render|software|mesa offscreen/i;
  function grafikOk() {
    try {
      var c = document.createElement('canvas'); c.width = c.height = 1;
      var g = c.getContext('webgl2') || c.getContext('webgl');
      if (!g) return false;
      var e = g.getExtension('WEBGL_debug_renderer_info');
      var name = String((e && g.getParameter(e.UNMASKED_RENDERER_WEBGL)) || g.getParameter(g.RENDERER) || '');
      var v = g.getExtension('WEBGL_lose_context'); if (v) v.loseContext();
      return !SOFTWARE.test(name);
    } catch (f) { return false; }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
