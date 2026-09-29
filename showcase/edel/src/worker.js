// Worker: rendert die Uhr auf einer OffscreenCanvas, der Haupt-Thread bleibt frei (Scrollen, Eingaben).
import { erstelle } from './szene.js';
let s;
self.onmessage = ({ data: d }) => {
  if (d.typ === 'start') {
    try { s = erstelle(d.canvas, d.opt, (m) => self.postMessage(m)); s.laufen(d.laufen); }
    catch (e) { self.postMessage({ typ: 'fehler', text: String(e) }); }
  } else if (!s) return;
  else if (d.typ === 'laufen') s.laufen(d.an);
  else if (d.typ === 'groesse') s.groesse(d.w, d.h, d.dpr);
  else if (d.typ === 'zeiger') s.zeiger(d.x, d.y);
};
