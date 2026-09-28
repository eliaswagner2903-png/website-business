// Prozedural modellierte Armbanduhr „Lindgrund L-40“ (ausgedachte Manufaktur, Demo).
// Läuft im Worker (OffscreenCanvas) oder – als Rückfall – im Haupt-Thread. Keine Bilddateien, keine Schriften:
// Zifferblatt, Leder und Umgebung entstehen im Code. Bei t = 0 entspricht das Bild exakt dem Poster.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Color, Vector2, DoubleSide, AdditiveBlending,
  LatheGeometry, CircleGeometry, BoxGeometry, CylinderGeometry, SphereGeometry, PlaneGeometry, ExtrudeGeometry,
  Shape, BufferGeometry, Float32BufferAttribute, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial,
  PMREMGenerator, CanvasTexture, SRGBColorSpace, NeutralToneMapping, BackSide, RepeatWrapping, LinearMipmapLinearFilter,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Zifferblätter: Grundfarbe, Druckfarbe, Zeigerfarbe (Gold oder gebläuter Stahl)
export const VARIANTEN = {
  tanne: { grund: '#17352b', rand: '#0c1f19', druck: '#e8dcc2', zeiger: 'gold', sek: 'blau' },
  schiefer: { grund: '#2c3036', rand: '#15181c', druck: '#e6e2da', zeiger: 'stahl', sek: 'gold' },
  elfenbein: { grund: '#ebe3d0', rand: '#cbbf9f', druck: '#23262b', zeiger: 'blau', sek: 'gold' },
};

// Kamera-Ansichten (Hero, Schrägansicht, Krone von nah)
const ANSICHTEN = {
  held: { fov: 21, kam: [0, -6, 150], ziel: [0, -1.5, 0], rot: [-0.42, -0.34, -0.1] },
  schraeg: { fov: 20, kam: [0, 0, 150], ziel: [-3, -2, 0], rot: [-0.9, 0.62, 0.28] },
  krone: { fov: 12, kam: [0, 0, 150], ziel: 'krone', rot: [-0.3, -0.75, 0.05], umg: [0, -0.9, 0] },
};

const leinwand = (w, h) => (typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h)
  : Object.assign(document.createElement('canvas'), { width: w, height: h }));

// Kleiner deterministischer Zufall, damit Poster und Live-Bild gleich aussehen
function zufall(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function zifferblattTextur(v) {
  const N = 1024, c = leinwand(N, N), g = c.getContext('2d'), m = N / 2, z = zufall(7);
  const grad = g.createRadialGradient(m, m, 0, m, m, m);
  grad.addColorStop(0, v.grund); grad.addColorStop(0.82, v.grund); grad.addColorStop(1, v.rand);
  g.fillStyle = grad; g.fillRect(0, 0, N, N);
  // Sonnenschliff: feine Strahlen mit leicht wechselnder Helligkeit
  g.globalAlpha = 0.05;
  for (let i = 0; i < 720; i++) {
    const a = (i / 720) * Math.PI * 2; g.strokeStyle = z() > 0.5 ? '#ffffff' : '#000000'; g.lineWidth = 1 + z() * 2;
    g.beginPath(); g.moveTo(m, m); g.lineTo(m + Math.cos(a) * m, m + Math.sin(a) * m); g.stroke();
  }
  g.globalAlpha = 1;
  // Minuterie: 60 Striche am Rand, Kapitelring
  const R = m * (16.2 / 16.9);
  g.strokeStyle = v.druck; g.fillStyle = v.druck;
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2, lang = i % 5 === 0;
    g.lineWidth = lang ? 3.2 : 1.8;
    const r0 = R - (lang ? 26 : 16);
    g.beginPath(); g.moveTo(m + Math.cos(a) * r0, m + Math.sin(a) * r0); g.lineTo(m + Math.cos(a) * R, m + Math.sin(a) * R); g.stroke();
  }
  g.lineWidth = 1.5; g.beginPath(); g.arc(m, m, R - 34, 0, Math.PI * 2); g.stroke();
  // Marke: Lindenblatt unter der 12
  g.save(); g.translate(m, m - 190); g.lineWidth = 2.6;
  g.beginPath(); g.moveTo(0, -30); g.bezierCurveTo(22, -18, 22, 12, 0, 30); g.bezierCurveTo(-22, 12, -22, -18, 0, -30); g.stroke();
  g.beginPath(); g.moveTo(0, -26); g.lineTo(0, 40); g.stroke();
  for (const y of [-10, 4, 18]) { g.beginPath(); g.moveTo(0, y); g.lineTo(11, y - 9); g.moveTo(0, y); g.lineTo(-11, y - 9); g.stroke(); }
  g.restore();
  // Zwei feine Zeilen über der 6 (Linienblöcke statt Schrift – unabhängig von Systemschriften)
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t;
}

// Richtung des Schliffs für die Anisotropie: radial (Strahlen vom Mittelpunkt)
function schliffTextur() {
  const N = 256, c = leinwand(N, N), g = c.getContext('2d'), d = g.createImageData(N, N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let dx = x / N - 0.5, dy = 0.5 - y / N; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const i = (y * N + x) * 4; d.data[i] = (dx * 0.5 + 0.5) * 255; d.data[i + 1] = (dy * 0.5 + 0.5) * 255; d.data[i + 2] = 255; d.data[i + 3] = 255;
  }
  g.putImageData(d, 0, 0); const t = new CanvasTexture(c); t.generateMipmaps = false; t.minFilter = 1006; return t;
}

function lederTextur() {
  const W = 256, H = 512, c = leinwand(W, H), g = c.getContext('2d'), z = zufall(3);
  g.fillStyle = '#2a1d16'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 2600; i++) { g.fillStyle = z() > 0.5 ? 'rgba(255,230,200,.05)' : 'rgba(0,0,0,.18)'; g.fillRect(z() * W, z() * H, 1 + z() * 3, 1 + z() * 2); }
  // Naht: Stiche beidseitig
  g.fillStyle = '#8f7a5c';
  for (let y = 4; y < H; y += 12) for (const x of [18, W - 21]) g.fillRect(x, y, 3, 6);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.wrapT = RepeatWrapping; return t;
}

function studio(renderer) {
  // Umgebung wie im Fotostudio: dunkler Raum, zwei Softboxen, ein Streiflicht, schwaches warmes Licht von unten
  const s = new Scene(), raum = new Mesh(new BoxGeometry(200, 200, 200), new MeshBasicMaterial({ color: 0x0c0c0c, side: BackSide }));
  s.add(raum);
  const box = (w, h, stark, pos, farbe = 0xffffff) => {
    const p = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(farbe).multiplyScalar(stark), side: DoubleSide }));
    p.position.set(...pos); p.lookAt(0, 0, 0); s.add(p);
  };
  box(150, 60, 0.9, [0, 80, 20]);
  box(70, 40, 5, [-45, 55, 55]);
  box(8, 110, 7, [60, 0, 30]);
  box(90, 12, 3, [0, 60, -50]);
  box(80, 25, 0.8, [0, -60, 35], 0xffd9a8);
  box(20, 20, 2.2, [30, 40, 70]);
  box(24, 30, 2.4, [70, -20, 60]);
  const pm = new PMREMGenerator(renderer), env = pm.fromScene(s, 0.035).texture; pm.dispose(); return env;
}

function dauphine(L, w, tail, h) {
  // Facettierter Zeiger: Mittelgrat erhöht, zwei Flächen je Seite
  const B = [0, -tail, h * 0.6], C = [0, L * 0.28, h], T = [0, L, 0.05], Lf = [-w, L * 0.28, 0], R = [w, L * 0.28, 0];
  const Bl = [-w * 0.55, -tail, 0], Br = [w * 0.55, -tail, 0];
  const tri = [Bl, C, Lf, Bl, B, C, Lf, C, T, C, Br, R, B, Br, C, C, R, T];
  const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(tri.flat(), 3)); g.computeVertexNormals(); return g;
}

function riemen(material) {
  const s = new Shape(), w = 9.8, d = 1.6, r = 1.3;
  s.moveTo(-w + r, -d); s.lineTo(w - r, -d); s.quadraticCurveTo(w, -d, w, -d + r); s.lineTo(w, d - r); s.quadraticCurveTo(w, d, w - r, d);
  s.lineTo(-w + r, d); s.quadraticCurveTo(-w, d, -w, d - r); s.lineTo(-w, -d + r); s.quadraticCurveTo(-w, -d, -w + r, -d);
  const L = 48, g = new ExtrudeGeometry(s, { depth: L, steps: 48, bevelEnabled: false, curveSegments: 4 });
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i); // Querschnitt x/y, Länge z
    const yy = 18.5 + z, biege = Math.max(0, yy - 21), zz = y - 1.9 - 0.0065 * biege * biege;
    p.setXYZ(i, x, yy, zz); uv.setXY(i, (x + w) / (2 * w), z / L * 2);
  }
  g.computeVertexNormals();
  return new Mesh(g, material);
}

export function erstelle(canvas, { breite, hoehe, dpr = 1, variante = 'tanne', ansicht = 'held', erhalten = false, messen = false }, melde = () => {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: erhalten });
  renderer.setPixelRatio(Math.min(dpr, 2)); renderer.setSize(breite, hoehe, false);
  renderer.toneMapping = NeutralToneMapping; renderer.toneMappingExposure = 1.05; renderer.setClearColor(0x000000, 0);

  const szene = new Scene(); szene.environment = studio(renderer);
  const A = ANSICHTEN[ansicht] || ANSICHTEN.held; if (A.umg) szene.environmentRotation.set(...A.umg);
  const kamera = new PerspectiveCamera(A.fov, breite / hoehe, 10, 400);
  kamera.position.set(...A.kam);

  const V = VARIANTEN[variante] || VARIANTEN.tanne;
  const stahlPoliert = new MeshStandardMaterial({ color: 0xe9ecef, metalness: 1, roughness: 0.14 });
  const stahlMatt = new MeshPhysicalMaterial({ color: 0xd9dde2, metalness: 1, roughness: 0.34, anisotropy: 0.6 });
  const gold = new MeshStandardMaterial({ color: 0xe8c58c, metalness: 1, roughness: 0.2 });
  const blau = new MeshStandardMaterial({ color: 0x0c1f5c, metalness: 1, roughness: 0.3 });
  const zeigerMat = { gold, blau, stahl: stahlPoliert };

  const uhr = new Group(), gehaeuse = new Group(); uhr.add(gehaeuse);
  const P = (a) => a.map(([r, h]) => new Vector2(r, h));
  const mitte = new LatheGeometry(P([[0, -5.2], [13.5, -5.2], [15.6, -5.0], [17.9, -4.3], [19.5, -3.2], [20.15, -1.8], [20.3, 0.6], [20.05, 1.9]]), 160);
  const luenette = new LatheGeometry(P([[20.05, 1.9], [19.6, 2.7], [18.6, 3.35], [17.55, 3.55], [17.2, 3.35], [16.95, 1.2], [16.9, 0.05]]), 160);
  for (const g of [mitte, luenette]) g.rotateX(Math.PI / 2);
  gehaeuse.add(new Mesh(mitte, stahlMatt), new Mesh(luenette, stahlPoliert));

  // Bandanstöße
  const hornGeo = new RoundedBoxGeometry(2.9, 11, 3.1, 4, 1.0);
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const h = new Mesh(hornGeo, stahlPoliert); h.position.set(sx * 11.3, sy * 19.4, -1.3); h.rotation.x = -sy * 0.16; gehaeuse.add(h);
  }
  // Krone mit Rändelung
  const kroneGeo = new CylinderGeometry(3.3, 3.3, 3.4, 96, 1);
  const kp = kroneGeo.attributes.position;
  for (let i = 0; i < kp.count; i++) {
    const x = kp.getX(i), z = kp.getZ(i), a = Math.atan2(z, x), r = Math.hypot(x, z); if (r < 3.2) continue;
    const f = 1 - 0.07 * (0.5 + 0.5 * Math.cos(a * 24)); kp.setX(i, x * f); kp.setZ(i, z * f);
  }
  kroneGeo.computeVertexNormals(); kroneGeo.rotateZ(Math.PI / 2);
  const krone = new Mesh(kroneGeo, stahlPoliert); krone.position.set(21.9, 0, -1.2); gehaeuse.add(krone);
  const hals = new Mesh(new CylinderGeometry(1.4, 1.4, 2.2, 32).rotateZ(Math.PI / 2), stahlMatt); hals.position.set(20.4, 0, -1.2); gehaeuse.add(hals);
  const kappe = new Mesh(new CircleGeometry(2.4, 48).rotateY(Math.PI / 2), gold); kappe.position.set(23.62, 0, -1.2); gehaeuse.add(kappe);

  // Zifferblatt
  const blattMat = new MeshPhysicalMaterial({ map: zifferblattTextur(V), metalness: variante === 'elfenbein' ? 0.1 : 0.55,
    roughness: variante === 'elfenbein' ? 0.5 : 0.44, anisotropy: 1, anisotropyMap: schliffTextur() });
  const blatt = new Mesh(new CircleGeometry(16.9, 128), blattMat); gehaeuse.add(blatt);

  // Aufgesetzte Indexe
  const idxMat = zeigerMat[V.zeiger];
  const idx = new BoxGeometry(0.95, 3.4, 0.55); idx.translate(0, 0, 0.28);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2, r = 12.9;
    for (const off of i === 0 ? [-0.75, 0.75] : [0]) {
      const m = new Mesh(idx, idxMat); m.position.set(Math.sin(a) * r + Math.cos(a) * off, Math.cos(a) * r - Math.sin(a) * off, 0); m.rotation.z = -a; gehaeuse.add(m);
    }
  }
  // Zeiger (Stellung 10:09:36 wie auf dem Poster)
  const stunde = new Mesh(dauphine(9.6, 1.15, 2.2, 0.35), zeigerMat[V.zeiger]); stunde.position.z = 0.7;
  const minute = new Mesh(dauphine(14.6, 0.95, 2.4, 0.32), zeigerMat[V.zeiger]); minute.position.z = 1.05;
  const sek = new Group(); sek.position.z = 1.45;
  const sekMat = zeigerMat[V.sek];
  const nadel = new Mesh(new BoxGeometry(0.28, 19.5, 0.12).translate(0, 5.25, 0), sekMat);
  const gewicht = new Mesh(new CylinderGeometry(0.85, 0.85, 0.14, 32).rotateX(Math.PI / 2).translate(0, -3.2, 0), sekMat);
  sek.add(nadel, gewicht);
  const nabe = new Mesh(new CylinderGeometry(0.7, 0.7, 1.7, 32).rotateX(Math.PI / 2).translate(0, 0, 0.85), zeigerMat[V.zeiger]);
  gehaeuse.add(stunde, minute, sek, nabe);
  const winkel = (anteil) => -anteil * Math.PI * 2;
  stunde.rotation.z = winkel((10 + 9.6 / 60) / 12); minute.rotation.z = winkel(9.6 / 60);

  // Saphirglas: nur die Spiegelung wird addiert
  const glas = new Mesh(new SphereGeometry(80, 96, 8, 0, Math.PI * 2, 0, Math.asin(17.5 / 80)).rotateX(Math.PI / 2),
    new MeshPhysicalMaterial({ color: 0x000000, metalness: 0, roughness: 0.04, transparent: true, blending: AdditiveBlending, depthWrite: false, envMapIntensity: 1.4 }));
  glas.position.z = 3.55 - 80 * Math.cos(Math.asin(17.5 / 80)); gehaeuse.add(glas);

  // Lederband
  const leder = new MeshStandardMaterial({ map: lederTextur(), roughness: 0.62, metalness: 0 });
  const oben = riemen(leder), unten = riemen(leder); unten.rotation.z = Math.PI; uhr.add(oben, unten);

  uhr.rotation.set(...A.rot); szene.add(uhr);
  if (A.ziel === 'krone') { uhr.updateMatrixWorld(); const p = krone.getWorldPosition(krone.position.clone()); kamera.lookAt(p.x - 5, p.y - 1, p.z); }
  else kamera.lookAt(...A.ziel);

  // Bewegung: langsames Wiegen (setzt sanft ein), Zeiger-Neigung gedämpft, Sekunde springt 8× pro Sekunde (28 800 A/h)
  let letztesBild = 0, pr = Math.min(dpr, 2), mittel = 1 / 60, geprueft = 0, gezaehlt = 0, messStart = performance.now(), t = 0, zuletzt = null, laeuft = false, ziel = [0, 0], neig = [0, 0], erstesBild = false;
  const frame = self.requestAnimationFrame ? self.requestAnimationFrame.bind(self) : (f) => setTimeout(() => f(performance.now()), 16);
  const stelle = () => {
    const ein = Math.min(1, t / 5), e = ein * ein * (3 - 2 * ein);
    uhr.rotation.y = A.rot[1] + e * 0.2 * Math.sin((t / 24) * Math.PI * 2) + neig[0];
    uhr.rotation.x = A.rot[0] + e * 0.06 * Math.sin((t / 33) * Math.PI * 2) + neig[1];
    sek.rotation.z = winkel((36 + Math.floor(t * 8) / 8) / 60);
  };
  const zeichne = () => { stelle(); renderer.render(szene, kamera); };
  const schleife = (jetzt) => {
    if (!laeuft) { zuletzt = null; return; }
    // Höchstens ~40 Bilder je Sekunde: die Bewegung ist langsam, das spart Strom und lässt dem Scrollen Luft.
    if (jetzt - letztesBild < 24) { frame(schleife); return; }
    letztesBild = jetzt;
    const dt = zuletzt == null ? 0 : Math.min(0.05, (jetzt - zuletzt) / 1000); zuletzt = jetzt; t += dt;
    // Leistungs-Wächter: läuft die Szene dauerhaft langsam, sinkt die Auflösung (2 → 1,5 → 1)
    if (dt > 0) { mittel = mittel * 0.95 + dt * 0.05; if (++geprueft > 90 && mittel > 0.026 && pr > 1) { pr = Math.max(1, pr - 0.5); renderer.setPixelRatio(pr); renderer.setSize(breite, hoehe, false); geprueft = 0; } }
    const k = 1 - Math.exp(-dt * 2.2); neig[0] += (ziel[0] - neig[0]) * k; neig[1] += (ziel[1] - neig[1]) * k;
    zeichne();
    if (!erstesBild) { erstesBild = true; melde({ typ: 'bereit' }); }
    if (messen) { gezaehlt++; if (jetzt - messStart > 2000) { melde({ typ: 'fps', wert: Math.round(gezaehlt * 1000 / (jetzt - messStart)) }); gezaehlt = 0; messStart = jetzt; } }
    frame(schleife);
  };
  zeichne();
  return {
    laufen(an) { if (an && !laeuft) { laeuft = true; frame(schleife); } else if (!an) laeuft = false; },
    groesse(w, h, d = dpr) { breite = w; hoehe = h; pr = Math.min(d, pr, 2); renderer.setPixelRatio(pr); renderer.setSize(w, h, false); kamera.aspect = w / h; kamera.updateProjectionMatrix(); zeichne(); },
    zeiger(x, y) { ziel = [x * 0.14, y * 0.08]; },
    zeichne,
  };
}
