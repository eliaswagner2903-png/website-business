// Prozedural modellierte Objekte – kein fremdes Modell, keine Textur, keine zusätzliche Anfrage.
// Jedes Objekt passt in eine Kugel mit Radius 1 um den Ursprung (die Kamera richtet sich danach).
import {
  Group, Mesh, MeshPhysicalMaterial, LatheGeometry, TorusKnotGeometry, TorusGeometry, SphereGeometry,
  Vector2, DoubleSide,
} from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Materialien: Studio-Licht kommt aus der Umgebung (RoomEnvironment), deshalb wirken sie ohne Lampen hochwertig.
const MATERIAL = {
  keramik: f => new MeshPhysicalMaterial({ color: f, roughness: 0.42, clearcoat: 1, clearcoatRoughness: 0.14, side: DoubleSide }),
  metall: f => new MeshPhysicalMaterial({ color: f, metalness: 1, roughness: 0.24 }),
  stein: f => new MeshPhysicalMaterial({ color: f, roughness: 0.62, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
};

// Nähte (doppelte Punkte an Anfang/Ende des Umlaufs) zusammenführen, damit die Normalen glatt sind.
function glatt(g) {
  g.deleteAttribute('normal'); g.deleteAttribute('uv');
  const m = mergeVertices(g, 1e-5); m.computeVertexNormals(); return m;
}

// Gefäß: gedrehtes Profil (außen hoch, über die Lippe, innen hinunter) mit feinen senkrechten Rillen,
// damit man die Drehung sieht (ein glattes Drehteil sähe gedreht genauso aus).
function gefaess() {
  const aussen = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40, y = -1 + t * 1.9;
    const r = 0.34 + 0.36 * Math.sin(Math.PI * Math.min(t * 1.15, 1)) ** 1.4 - 0.1 * t + 0.08 * Math.max(0, t - 0.86) / 0.14;
    aussen.push(new Vector2(Math.max(r, 0.02), y));
  }
  const lippe = aussen[aussen.length - 1];
  const innen = aussen.slice(8).reverse().map(p => new Vector2(Math.max(p.x - 0.045, 0.02), p.y - 0.02));
  const profil = [new Vector2(0, -1), ...aussen, new Vector2(lippe.x - 0.022, lippe.y + 0.012), ...innen, new Vector2(0, -0.72)];
  const g = new LatheGeometry(profil, 160);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), y = pos.getY(i), w = Math.atan2(x, z);
    const rille = 1 + 0.018 * Math.cos(w * 18) * Math.min(1, (y + 1) * 3) * (y < 0.8 ? 1 : 0.2);
    pos.setX(i, x * rille); pos.setZ(i, z * rille);
  }
  return { geo: [glatt(g)], material: 'keramik', neigung: [0.22, 0], licht: [0.5, 2.4] };
}

function knoten() {
  return { geo: [new TorusKnotGeometry(0.62, 0.2, 320, 48, 2, 3)], material: 'metall', neigung: [0.35, 0.2] };
}

// Kiesel: Kugel, sanft verformt (überlagerte Wellen statt Zufall → jedes Mal gleich, Poster passt immer).
function kiesel() {
  const g = new SphereGeometry(1, 160, 120), pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const d = 1 + 0.16 * Math.sin(2.1 * x + 0.6) * Math.cos(1.6 * y) + 0.09 * Math.sin(3.2 * z + 1.3 * y) + 0.045 * Math.cos(5.1 * x - 2.3 * z);
    pos.setXYZ(i, x * d * 0.95, y * d * (0.5 + 0.06 * x), z * d * 0.78);
  }
  return { geo: [glatt(g)], material: 'stein', neigung: [0.5, 0.4], licht: [0.45, 2.6] };
}

// Ringe: drei verschachtelte Reifen wie ein Kreisel; jeder dreht sich um eine eigene Achse.
function ringe() {
  const geo = [0.92, 0.72, 0.52].map((r, i) => new TorusGeometry(r, 0.055 - i * 0.008, 32, 200));
  return { geo, material: 'metall', neigung: [0.5, 0.3], ringe: true };
}

const OBJEKTE = { gefaess, knoten, kiesel, ringe };

export function baueObjekt(name, farben, materialName) {
  const bau = (OBJEKTE[name] || gefaess)();
  const neu = MATERIAL[materialName] || MATERIAL[bau.material];
  const gruppe = new Group(), teile = [];
  bau.geo.forEach((g, i) => {
    const m = new Mesh(g, neu(i % 2 && farben[1] ? farben[1] : farben[0]));
    if (bau.ringe) m.rotation.set(i * 0.9, i * 0.55, 0);
    gruppe.add(m); teile.push(m);
  });
  gruppe.rotation.set(bau.neigung[0], bau.neigung[1], 0);
  // Eigenbewegung pro Zeitpunkt t (Sekunden seit Start); t = 0 ist genau das Poster.
  const bewegen = bau.ringe
    ? t => teile.forEach((m, i) => { m.rotation.x = i * 0.9 + t * (0.11 + i * 0.05); m.rotation.y = i * 0.55 + t * 0.07 * (i - 1); })
    : () => {};
  return { gruppe, bewegen, licht: bau.licht || [1, 0], entsorgen: () => teile.forEach(m => { m.geometry.dispose(); m.material.dispose(); }) };
}
