// 3D-Szene (wird nachgeladen von szene-3d.js). Gebündelt mit `node bauen.mjs` zu szene-3d.modul.js.
// Aufgabe: exakt das Poster-Bild als erstes Bild zeichnen, unsichtbar darüberblenden, dann ruhig bewegen.
import { WebGLRenderer, Scene, PerspectiveCamera, PMREMGenerator, DirectionalLight, Color, NeutralToneMapping, MathUtils } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { baueObjekt } from './objekte.js';

// Farbe aus CSS (auch var(), oklch(), color-mix()) über ein 1×1-Canvas in sRGB umrechnen – robust für jede marke.css.
const pinsel = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
function farbe(el, wert, ersatz) {
  let css = (wert || '').trim();
  if (css.startsWith('--')) css = getComputedStyle(el).getPropertyValue(css).trim();
  if (!css) css = ersatz;
  pinsel.clearRect(0, 0, 1, 1); pinsel.fillStyle = '#000'; pinsel.fillStyle = css; pinsel.fillRect(0, 0, 1, 1);
  const [r, g, b] = pinsel.getImageData(0, 0, 1, 1).data;
  return new Color().setRGB(r / 255, g / 255, b / 255, 'srgb');
}

const sanft = x => x * x * (3 - 2 * x); // smoothstep: Bewegung beginnt und endet leise

function baue(el, { erhalten = false, glaetten = true } = {}) {
  const d = el.dataset;
  const renderer = new WebGLRenderer({ antialias: glaetten, alpha: true, preserveDrawingBuffer: erhalten, powerPreference: 'low-power' });
  renderer.toneMapping = NeutralToneMapping; // hält Markenfarben näher am CSS-Wert als ACES/AgX
  renderer.setClearColor(0x000000, 0);
  const szene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const raum = new RoomEnvironment();
  szene.environment = pmrem.fromScene(raum, 0.04).texture;
  raum.dispose(); pmrem.dispose();
  const farben = [farbe(el, d.farbe || '--farbe-akzent', '#b08d57'), farbe(el, d.farbeZwei || '--farbe-text', '#e8e2d6')];
  const objekt = baueObjekt(d.objekt, farben, d.material);
  szene.add(objekt.gruppe);
  // Metall lebt von Spiegelungen (nur Umgebung). Keramik/Stein wirken im gleichmäßigen Raumlicht flach:
  // weniger Umgebung, dafür ein Führungslicht von oben links → Form und Glanzkante.
  const [umgebung, fuehrung] = objekt.licht, faktor = +(d.licht || 1);
  szene.environmentIntensity = umgebung * faktor;
  if (fuehrung) { const l = new DirectionalLight(0xffffff, fuehrung * faktor); l.position.set(-2.5, 3, 2.2); szene.add(l); }
  const kamera = new PerspectiveCamera(28, 1, 0.1, 50);
  const basis = { x: objekt.gruppe.rotation.x, y: objekt.gruppe.rotation.y };
  const zoom = +(d.zoom || 1);
  function groesse(breite, hoehe, dpr) {
    renderer.setPixelRatio(dpr); renderer.setSize(breite, hoehe, false);
    kamera.aspect = breite / hoehe;
    // Abstand so, dass die Einheitskugel in die schmalere Richtung passt (mit etwas Luft).
    const halb = MathUtils.degToRad(kamera.fov / 2), eng = Math.min(Math.tan(halb), Math.tan(halb) * kamera.aspect);
    kamera.position.set(0, 0, 1.12 / Math.sin(Math.atan(eng)) / zoom);
    kamera.updateProjectionMatrix();
  }
  // Zeichnet Zustand: winkel (Drehung um y), t (Eigenbewegung), neigung (x/y aus Zeiger/Scroll)
  function zeichne(winkel = 0, t = 0, nx = 0, ny = 0) {
    objekt.gruppe.rotation.x = basis.x + nx; objekt.gruppe.rotation.y = basis.y + winkel + ny;
    objekt.bewegen(t); renderer.render(szene, kamera);
  }
  function entsorgen() { objekt.entsorgen(); szene.environment.dispose(); renderer.dispose(); renderer.forceContextLoss(); }
  return { renderer, szene, kamera, groesse, zeichne, entsorgen };
}

// Standbild für werkzeuge/poster-rendern.mjs: gleiches erstes Bild wie live, in fester Pixelbreite, mit Transparenz.
export async function standbild(el, breite) {
  const r = el.getBoundingClientRect(), hoehe = Math.round(breite * r.height / r.width);
  const s = baue(el, { erhalten: true });
  s.groesse(breite, hoehe, 1);
  await s.renderer.compileAsync(s.szene, s.kamera);
  s.zeichne();
  const url = s.renderer.domElement.toDataURL('image/png');
  s.entsorgen(); return url;
}

// Ein Gerät, das eine Szene nicht flüssig schafft, schafft auch die nächste nicht: Urteil merken (Seite + Sitzung).
let zuLangsam = false;
try { zuLangsam = sessionStorage.getItem('szene-3d') === 'zu-langsam'; } catch {}

export async function start(el) {
  if (zuLangsam) { el.dataset.szene = 'zu-langsam'; return null; }
  const d = el.dataset, DPR_MAX = Math.min(+(d.dprMax || 2), 2);
  let dpr = Math.min(devicePixelRatio || 1, DPR_MAX), breite = 0, hoehe = 0;
  // Ab 2 Gerätepixeln pro CSS-Pixel ist Kantenglättung (MSAA) kaum sichtbar, kostet aber viel Grafikleistung.
  const s = baue(el, { glaetten: dpr < 2 }), leinwand = s.renderer.domElement;
  leinwand.className = 'szene-3d__leinwand'; leinwand.setAttribute('aria-hidden', 'true');
  const messen = (w, h) => { breite = w; hoehe = h; s.groesse(w, h, dpr); };
  const r0 = el.getBoundingClientRect(); messen(r0.width, r0.height);
  await s.renderer.compileAsync(s.szene, s.kamera); // Shader parallel übersetzen, wo der Browser es kann
  s.zeichne();
  el.classList.add('szene-3d--probe'); el.append(leinwand); // praktisch unsichtbar, bis die Probe bestanden ist

  const tempo = +(d.drehung || 0.16);       // Bogenmaß pro Sekunde: eine Umdrehung in ~40 s
  const MIN_FPS = +(d.minFps ?? (document.documentElement.classList.contains('szene-3d-erzwungen') ? 0 : 45));
  const fein = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const MAX_NEIGUNG = 0.22;
  // phase: probe (unsichtbar, Standbild wird gezeichnet und die Bildrate gemessen) → blende → laeuft
  let phase = 'probe', winkel = 0, t = 0, anlauf = 0, nx = 0, ny = 0, zx = 0, zy = 0;
  let sichtbar = true, aktiv = false, bild = 0, zuletzt = 0, scroll0 = null, fensterStart = 0, fensterBilder = 0, beendet = false;

  if (fein) addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    zx = MathUtils.clamp((e.clientY - (r.top + r.height / 2)) / innerHeight, -0.5, 0.5) * 2 * MAX_NEIGUNG * 0.6;
    zy = MathUtils.clamp((e.clientX - (r.left + r.width / 2)) / innerWidth, -0.5, 0.5) * 2 * MAX_NEIGUNG;
  }, { passive: true });

  function schritt(jetzt) {
    if (!aktiv) return;
    bild = requestAnimationFrame(schritt);
    const dt = Math.min((jetzt - (zuletzt || jetzt)) / 1000, 0.05); zuletzt = jetzt;
    if (phase === 'laeuft') {
      if (!fein) { // Handy: Neigung folgt der Scroll-Position, bezogen auf den Start → kein Ruck beim Anlaufen
        const r = el.getBoundingClientRect(), p = (r.top + r.height / 2) / innerHeight;
        scroll0 ??= p; zx = MathUtils.clamp((p - scroll0) * 0.8, -MAX_NEIGUNG, MAX_NEIGUNG);
      }
      anlauf = Math.min(anlauf + dt / 2.4, 1);            // Drehung läuft über 2,4 s sanft an
      const v = sanft(anlauf);
      winkel += tempo * v * dt; t += v * dt;
      const k = 1 - Math.exp(-dt * 2.5);                   // gedämpft: folgt dem Ziel, nie hektisch
      nx += (zx - nx) * k; ny += (zy - ny) * k;
    }
    s.zeichne(winkel, t, nx, ny);
    if (phase !== 'blende') waechter(jetzt);
  }
  // Leistungswächter über Zeitfenster (echte Zeit, nicht gedeckelt): Probe 0,6 s, danach je 1,5 s.
  // Zu langsam → erst Auflösung senken, dann Standbild. Auf schwachen Geräten bleibt es so beim Poster.
  function waechter(jetzt) {
    if (!fensterStart) { fensterStart = jetzt; fensterBilder = 0; return; }
    fensterBilder++;
    const dauer = jetzt - fensterStart, fenster = phase === 'probe' ? 600 : 1500;
    if (dauer < fenster) return;
    const fps = fensterBilder * 1000 / dauer; fensterStart = 0;
    d.szeneFps = Math.round(fps);
    if (fps >= MIN_FPS) { if (phase === 'probe') einblenden(); return; }
    if (fps < MIN_FPS / 2) { stoppen(phase === 'probe' ? 'zu-langsam' : 'gestoppt'); return; } // hoffnungslos: sofort Standbild
    if (dpr > 1) { dpr = Math.max(1, dpr - 0.5); s.groesse(breite, hoehe, dpr); return; }
    stoppen(phase === 'probe' ? 'zu-langsam' : 'gestoppt');
  }
  const weiter = () => { if (aktiv || beendet || !sichtbar || document.hidden) return; aktiv = true; zuletzt = 0; fensterStart = 0; bild = requestAnimationFrame(schritt); };
  const pause = () => { aktiv = false; cancelAnimationFrame(bild); };

  const io = new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; sichtbar ? weiter() : pause(); });
  io.observe(el);
  const sichtwechsel = () => (document.hidden ? pause() : weiter());
  document.addEventListener('visibilitychange', sichtwechsel);
  const ro = new ResizeObserver(([e]) => {
    const { width: w, height: h } = e.contentRect;
    if (w && h && (Math.abs(w - breite) > 0.5 || Math.abs(h - hoehe) > 0.5)) { messen(w, h); if (!aktiv) s.zeichne(winkel, t, nx, ny); }
  });
  ro.observe(el);

  // Überblenden: Leinwand (gleiches Bild wie das Poster) blendet über dem Poster ein; erst danach verschwindet das
  // Poster und die Bewegung beginnt. So gibt es keinen sichtbaren Wechsel.
  function einblenden() {
    phase = 'blende'; el.classList.replace('szene-3d--probe', 'szene-3d--bereit');
    let fertig = false;
    const los = () => { if (fertig || beendet) return; fertig = true; phase = 'laeuft'; fensterStart = 0; el.classList.add('szene-3d--laeuft'); };
    leinwand.addEventListener('transitionend', los, { once: true });
    setTimeout(los, 2000);
  }
  function stoppen(grund = 'gestoppt') {
    if (beendet) return; beendet = true; pause(); d.szene = grund;
    if (grund === 'zu-langsam') { zuLangsam = true; try { sessionStorage.setItem('szene-3d', grund); } catch {} }
    io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', sichtwechsel);
    el.classList.remove('szene-3d--laeuft', 'szene-3d--bereit', 'szene-3d--probe');
    setTimeout(() => { leinwand.remove(); s.entsorgen(); }, 1500);
  }
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => e.matches && stoppen());
  weiter();
  return { stoppen };
}
