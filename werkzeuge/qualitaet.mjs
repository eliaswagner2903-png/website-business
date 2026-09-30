// Quality Gate: prüft eine gebaute Seite gegen den Kundenauftrag (auftrag.md) und die Regeln in wissen/fachgebiete/.
//   node werkzeuge/qualitaet.mjs kunden/<slug> [--voll] [--port 8240] [--auftrag datei.md] [--still]
// Ohne --voll laufen die schnellen Prüfungen (statisch + Browser für CTA und „ohne JS“, Tests, html-validate, Kopf).
// Mit --voll zusätzlich pruefen.mjs (Breiten, Konsole, Tippflächen), Lighthouse (Startseite) und budget.mjs.
// Schreibt <ordner>/QUALITAET.md und hält <ordner>/abnahme.md (manuelle Bestätigungen) aktuell. Exit 1 = nicht bestanden.
import fs from 'node:fs'; import path from 'node:path'; import net from 'node:net'; import { spawn, spawnSync } from 'node:child_process';
import { REPO, ladeWissen, leseAuftrag, erstellePlan } from './regeln.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const ordnerArg = argv.find(a => !a.startsWith('--') && argv[argv.indexOf(a) - 1] !== '--port' && argv[argv.indexOf(a) - 1] !== '--auftrag');
if (!ordnerArg) { console.log('Aufruf: node werkzeuge/qualitaet.mjs kunden/<slug> [--voll] [--port 8240] [--auftrag datei]'); process.exit(2); }
const ORDNER = path.resolve(REPO, ordnerArg); const PUB = path.join(ORDNER, 'public');
const freierPort = () => new Promise((ok, nein) => { const s = net.createServer().once('error', nein).listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => ok(port)); }); });
const VOLL = argv.includes('--voll'); const PORT = argv.includes('--port') ? +opt('--port') : await freierPort(); // frei, damit parallele Läufe nie die Seite eines anderen Kunden messen
if (!fs.existsSync(PUB)) { console.log(`Kein public/-Ordner in ${ordnerArg}`); process.exit(2); }

// ---------- Auftrag und Regeln ----------
const wissen = ladeWissen();
const auftragDatei = path.resolve(REPO, opt('--auftrag', path.join(ordnerArg, 'auftrag.md')));
const hatAuftrag = fs.existsSync(auftragDatei);
const A = leseAuftrag(hatAuftrag ? fs.readFileSync(auftragDatei, 'utf8') : '', wissen);
const plan = erstellePlan(A, wissen);

// ---------- HTML lesen (bewusst ohne Parser-Abhängigkeit; unsere Seiten sind generiert und valide) ----------
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '', auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß', euro: '€', ndash: '–', mdash: '—', middot: '·', bdquo: '„', ldquo: '“', rdquo: '”', hellip: '…', copy: '©', thinsp: ' ', zwnj: '' };
const entities = s => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : (ENT[e] ?? m));
const attrs = t => Object.fromEntries([...t.matchAll(/([^\s=<>/"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].slice(1).map(m => [m[1].toLowerCase(), entities(m[2] ?? m[3] ?? m[4] ?? '')]));
const tags = (html, n) => [...html.matchAll(new RegExp(`<${n}\\b[^>]*>`, 'gi'))].map(m => ({ a: attrs(m[0]), i: m.index }));
const blocke = (html, n) => [...html.matchAll(new RegExp(`<${n}\\b([^>]*)>([\\s\\S]*?)</${n}>`, 'gi'))].map(m => ({ a: attrs(`<x ${m[1]}>`), inhalt: m[2], i: m.index }));
const text = h => entities(h.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|template|noscript)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<wbr\s*\/?>/gi, '').replace(/<[^>]+>/g, ' ')).replace(/­/g, '').replace(/\s+/g, ' ').trim();
const norm = s => String(s).toLowerCase().replace(/ /g, ' ').replace(/[‐-―]/g, '-').replace(/\s+/g, ' ').trim();
const ziffern = s => { s = String(s).replace(/^tel:/i, '').trim(); let d = s.replace(/\D/g, ''); if (d.startsWith('0049')) d = '0' + d.slice(4); else if (d.startsWith('49') && s.startsWith('+')) d = '0' + d.slice(2); return d; };

function alleDateien(dir, basis = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? alleDateien(path.join(dir, e.name), basis) : [path.relative(basis, path.join(dir, e.name))]);
}
const DATEIEN = alleDateien(PUB).map(f => f.split(path.sep).join('/'));
const HTMLS = DATEIEN.filter(f => /\.html?$/.test(f) && !/^(bausteine|demo)\//.test(f));
const urlPfad = f => '/' + f.replace(/(^|\/)index\.html$/, '$1');

const seiten = HTMLS.map(f => {
  const html = fs.readFileSync(path.join(PUB, f), 'utf8');
  const kopf = (html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i) || [, ''])[1];
  const koerper = (html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i) || [, html])[1];
  const metas = {}; for (const m of tags(kopf, 'meta')) { const k = (m.a.name || m.a.property || '').toLowerCase(); if (k) metas[k] = m.a.content ?? ''; }
  const robots = norm(metas.robots || '');
  const ld = blocke(html, 'script').filter(s => /ld\+json/i.test(s.a.type || '')).map(s => { try { return { ok: true, daten: JSON.parse(s.inhalt) }; } catch (e) { return { ok: false, fehler: e.message }; } });
  return {
    datei: f, pfad: urlPfad(f), html, kopf, koerper, metas, robots,
    indexiert: !/noindex/.test(robots) && !/^404\./.test(f),
    lang: attrs((html.match(/<html\b[^>]*>/i) || ['<html>'])[0]).lang || '',
    titel: text((html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1]),
    canonical: tags(kopf, 'link').filter(l => /(^|\s)canonical(\s|$)/i.test(l.a.rel || '')).map(l => l.a.href),
    h: [...koerper.matchAll(/<h([1-6])\b/gi)].map(m => +m[1]),
    bilder: tags(koerper, 'img'), links: blocke(koerper, 'a').map(a => ({ ...a.a, _text: text(a.inhalt), _inhalt: a.inhalt })),
    skripte: tags(html, 'script'), ld, text: text(koerper), ids: new Set([...html.matchAll(/\s(?:id|name)="([^"]+)"/g)].map(m => m[1])),
  };
});
const start = seiten.find(s => s.pfad === '/') || seiten[0];
const indexiert = seiten.filter(s => s.indexiert);
const lies = f => (fs.existsSync(path.join(PUB, f)) ? fs.readFileSync(path.join(PUB, f), 'utf8') : null);
const ldObjekte = (s) => { const out = []; const lauf = o => { if (Array.isArray(o)) o.forEach(lauf); else if (o && typeof o === 'object') { out.push(o); Object.values(o).forEach(lauf); } }; s.ld.filter(x => x.ok).forEach(x => lauf(x.daten)); return out; };
const typen = o => [].concat(o['@type'] || []);
const alleLd = seiten.flatMap(ldObjekte);
const betrieb = alleLd.find(o => o.address && (o.telephone || o.name) && typen(o).length) || null;
const basis = (() => { const c = start?.canonical[0] || ''; try { return new URL(c).origin; } catch { return A.domain ? `https://${A.domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}` : ''; } })();
const redirects = (lies('_redirects') || '').split('\n').map(z => z.trim().split(/\s+/)).filter(z => z[0] && !z[0].startsWith('#'));

// „Fremde Pfade“ im Auftrag: Pfade derselben Domain, die ein anderes System ausliefert (z. B. ein bestehender Shop).
// Endet ein Eintrag auf „/“, gilt er als Präfix, sonst genau (mit oder ohne Schrägstrich am Ende).
const fremd = A.fremdePfade.split(/[,\s]+/).filter(x => x.startsWith('/'));
const istFremd = p => fremd.some(f => (f.endsWith('/') ? p.startsWith(f) : p.replace(/\/$/, '') === f.replace(/\/$/, '')));

function ziel(href, von) {
  // interne Adresse → Datei im public-Ordner (null = extern/ignoriert oder fremdes System, false = fehlt)
  if (/^(mailto:|tel:|sms:|data:|javascript:)/i.test(href)) return null;
  let u; try { u = new URL(href, `https://intern.test${von.pfad}`); } catch { return false; }
  const intern = u.host === 'intern.test' || (basis && u.origin === basis);
  if (!intern) return null;
  let p = decodeURIComponent(u.pathname);
  if (istFremd(p) && !redirects.some(([v]) => v === p)) return null;
  for (const [von_, nach] of redirects) if (von_ === p) p = nach.startsWith('/') ? nach : p;
  const kand = [p, p.replace(/\/$/, '') + '/index.html', p + '.html', p + '.htm', p.replace(/\.html$/, '')].map(x => x.replace(/^\//, ''));
  const datei = kand.find(k => k && DATEIEN.includes(k)) ?? (p === '/' && DATEIEN.includes('index.html') ? 'index.html' : undefined);
  return datei ? { datei, anker: u.hash.slice(1) } : false;
}

// ---------- Prüfungen: id → Befunde [{ok, text}] (leere Liste = nicht anwendbar) ----------
const F = (ok, t) => ({ ok: ok === null ? null : !!ok, text: t }); // immer Boolean: '' oder undefined wären sonst „nicht falsch“
const esc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const jedeSeite = (liste, fn) => liste.flatMap(s => fn(s).map(b => ({ ...b, text: `${s.datei}: ${b.text}` })));
const ROBOTS = (() => {
  const t = lies('robots.txt'); if (t === null) return null;
  const gruppen = []; let g = null, zuletztAgent = false;
  for (const z of t.split('\n').map(z => z.replace(/#.*/, '').trim()).filter(Boolean)) {
    const [k, ...v] = z.split(':'); const key = k.trim().toLowerCase(); const wert = v.join(':').trim();
    if (key === 'user-agent') { if (!zuletztAgent) { g = { agents: [], regeln: [] }; gruppen.push(g); } g.agents.push(wert.toLowerCase()); zuletztAgent = true; }
    else { zuletztAgent = false; if (g && (key === 'disallow' || key === 'allow')) g.regeln.push([key, wert]); }
  }
  return { text: t, gruppen, sitemaps: [...t.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map(m => m[1]) };
})();
const gesperrt = (agent) => { if (!ROBOTS) return false; const g = ROBOTS.gruppen.find(g => g.agents.includes(agent.toLowerCase())) || ROBOTS.gruppen.find(g => g.agents.includes('*')); return !!g?.regeln.some(([k, w]) => k === 'disallow' && w === '/') && !g.regeln.some(([k, w]) => k === 'allow' && w === '/'); };
const SITEMAP = (() => { const t = lies('sitemap.xml'); return t === null ? null : { text: t, locs: [...t.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => entities(m[1])) }; })();
const HEADERS = (() => {
  const t = lies('_headers'); if (!t) return null; const h = {}; let aktiv = false;
  for (const z of t.split('\n')) { if (/^\S/.test(z)) aktiv = z.trim() === '/*'; else if (aktiv && z.includes(':')) { const [k, ...v] = z.trim().split(':'); h[k.toLowerCase()] = v.join(':').trim(); } }
  return h;
})();
const CSS = DATEIEN.filter(f => f.endsWith('.css')).map(f => ({ f, t: lies(f) }));
const TRACKER = /googletagmanager|google-analytics|gtag\(|fbq\(|connect\.facebook|hotjar|clarity\.ms|matomo|plausible\.io|umami|doubleclick|tiktok\.com\/i18n|static\.cloudflareinsights/i;

const CHECKS = {
  'html-lang': () => jedeSeite(seiten, s => [F(/^[a-z]{2}(-[A-Za-z]{2})?$/.test(s.lang), s.lang ? `lang="${s.lang}"` : 'lang fehlt am <html>')]),
  viewport: () => jedeSeite(seiten, s => { const v = s.metas.viewport || ''; return [F(/width=device-width/.test(v) && !/user-scalable\s*=\s*(no|0)/.test(v) && !(parseFloat((v.match(/maximum-scale\s*=\s*([\d.]+)/) || [])[1]) < 2), v ? `viewport „${v}“` : 'meta viewport fehlt')]; }),
  titel: () => jedeSeite(seiten, s => [F(s.titel.length > 0, s.titel ? 'Titel vorhanden' : '<title> fehlt oder leer')]),
  'titel-einzigartig': () => { const m = {}; indexiert.forEach(s => (m[s.titel] ||= []).push(s.datei)); return Object.entries(m).map(([t, d]) => F(d.length === 1, d.length === 1 ? `„${t}“` : `gleicher Titel „${t}“ auf ${d.join(', ')}`)); },
  'titel-laenge': () => jedeSeite(indexiert, s => [F(s.titel.length >= 10 && s.titel.length <= 70, `Titel ${s.titel.length} Zeichen (Faustregel 10–70, Google kürzt nach Breite)`)]),
  description: () => jedeSeite(indexiert, s => [F((s.metas.description || '').trim().length >= 50, s.metas.description ? `Description ${s.metas.description.length} Zeichen` : 'meta description fehlt')]),
  'description-einzigartig': () => { const m = {}; indexiert.forEach(s => (m[s.metas.description || ''] ||= []).push(s.datei)); return Object.entries(m).map(([t, d]) => F(d.length === 1 && t, d.length === 1 ? 'eindeutig' : `gleiche Description auf ${d.join(', ')}`)); },
  h1: () => jedeSeite(seiten, s => [F(s.h.filter(x => x === 1).length === 1, `${s.h.filter(x => x === 1).length} H1`)]),
  ueberschriften: () => jedeSeite(seiten, s => { const f = []; s.h.forEach((x, i) => { if (i && x > s.h[i - 1] + 1) f.push(`h${s.h[i - 1]} → h${x}`); }); return [F(!f.length, f.length ? `übersprungene Ebenen: ${f.join(', ')}` : 'Ebenen lückenlos')]; }),
  'bilder-alt': () => jedeSeite(seiten, s => { const o = s.bilder.filter(b => !('alt' in b.a)); return s.bilder.length ? [F(!o.length, o.length ? `${o.length} <img> ohne alt: ${o.slice(0, 3).map(b => b.a.src).join(', ')}` : `${s.bilder.length} Bilder mit alt`)] : []; }),
  'bilder-masse': () => jedeSeite(seiten, s => { const o = s.bilder.filter(b => !(b.a.width && b.a.height)); return s.bilder.length ? [F(!o.length, o.length ? `${o.length} <img> ohne width/height: ${o.slice(0, 3).map(b => b.a.src).join(', ')}` : 'alle Bilder mit Maßen')] : []; }),
  'bilder-format': () => jedeSeite(seiten, s => { const o = s.bilder.filter(b => /\.(jpe?g|png|bmp|gif)(\?|$)/i.test(b.a.src || '') && !/<source[^>]+type="image\/(avif|webp)"/i.test(s.html.slice(Math.max(0, b.i - 600), b.i))); return s.bilder.length ? [F(!o.length, o.length ? `Rasterbilder ohne WebP/AVIF: ${o.slice(0, 3).map(b => b.a.src).join(', ')}` : 'moderne Formate')] : []; }),
  'bilder-gewicht': () => { const o = DATEIEN.filter(f => /\.(avif|webp|jpe?g|png)$/i.test(f)).map(f => [f, fs.statSync(path.join(PUB, f)).size]).filter(([f, g]) => g > 300 * 1024 && !/^og-|\/og-/.test(f)); return [F(!o.length, o.length ? `Bilder > 300 KB: ${o.map(([f, g]) => `${f} (${Math.round(g / 1024)} KB)`).join(', ')}` : 'alle Bilder ≤ 300 KB')]; },
  dateinamen: () => { const o = DATEIEN.filter(f => /\.(avif|webp|jpe?g|png|gif)$/i.test(f) && /(^|\/)(img|dsc|image|bild|foto|photo|screenshot|whatsapp)[-_ ]?\d+/i.test(f)); return [F(!o.length, o.length ? `nichtssagende Bildnamen: ${o.slice(0, 5).join(', ')}` : 'Bildnamen beschreibend')]; },
  'links-intern': () => jedeSeite(seiten, s => { const kaputt = []; for (const l of s.links) { if (!l.href) continue; if (l.href.startsWith('#')) { if (l.href.length > 1 && !s.ids.has(l.href.slice(1))) kaputt.push(l.href); continue; } const z = ziel(l.href, s); if (z === false) kaputt.push(l.href); else if (z?.anker) { const t = seiten.find(x => x.datei === z.datei); if (t && !t.ids.has(z.anker)) kaputt.push(l.href); } } return [F(!kaputt.length, kaputt.length ? `tote Links: ${[...new Set(kaputt)].join(', ')}` : 'interne Links ok')]; }),
  'links-leer': () => jedeSeite(seiten, s => { const o = s.links.filter(l => 'href' in l && (l.href === '' || l.href === '#' || /^javascript:/i.test(l.href))); return [F(!o.length, o.length ? `${o.length} Links ohne Ziel (href="", "#", javascript:)` : 'alle Links mit Ziel')]; }),
  'link-namen': () => jedeSeite(seiten, s => { const o = s.links.filter(l => !l._text && !l['aria-label'] && !l['aria-labelledby'] && !/<img[^>]+alt="[^"]+"/i.test(l._inhalt) && !/<title>/i.test(l._inhalt)); return [F(!o.length, o.length ? `Links ohne zugänglichen Namen: ${o.slice(0, 3).map(l => l.href).join(', ')}` : 'alle Links benannt')]; }),
  ankertexte: () => jedeSeite(seiten, s => { const o = s.links.filter(l => /^(hier|hier klicken|klicken sie hier|mehr|weiter|link|click here|read more|mehr lesen)$/i.test(l._text) && !l['aria-label']); return [F(!o.length, o.length ? `nichtssagende Linktexte: ${o.map(l => `„${l._text}“`).join(', ')}` : 'Linktexte beschreibend')]; }),
  'formular-label': () => jedeSeite(seiten, s => { const umschlossen = new Set(blocke(s.koerper, 'label').flatMap(l => tags(l.inhalt, '(?:input|select|textarea)').map(f => f.a.name || f.a.id))); const o = tags(s.koerper, '(?:input|select|textarea)').filter(f => !/^(hidden|submit|button|reset|image)$/i.test(f.a.type || '') && !f.a['aria-label'] && !f.a['aria-labelledby'] && !umschlossen.has(f.a.name || f.a.id) && !(f.a.id && new RegExp(`<label[^>]+for="${esc(f.a.id)}"`).test(s.koerper))); return tags(s.koerper, 'form').length ? [F(!o.length, o.length ? `Felder ohne Label: ${o.map(f => f.a.name || f.a.id).join(', ')}` : 'alle Felder beschriftet')] : []; }),
  'formular-honigtopf': () => jedeSeite(seiten, s => blocke(s.koerper, 'form').filter(f => /\/api\//.test(f.a.action || '') && /<textarea|<input[^>]+type="(text|email|tel)"/i.test(f.inhalt)).map(f => { const hp = /<input(?=[^>]*type="(?:text|email)"|(?![^>]*type=))(?=[^>]*(?:tabindex="-1"|class="[^"]*\b(?:honig\w*|hp|topf)\b))[^>]*>/i.test(f.inhalt); return F(hp, hp ? 'Honigtopf vorhanden' : `Formular ${f.a.action} ohne Honigtopf-Feld (verstecktes Textfeld mit tabindex="-1")`); })),
  'formular-felder': () => jedeSeite(seiten, s => blocke(s.koerper, 'form').map(f => { const n = tags(f.inhalt, '(?:input|select|textarea)').filter(x => !/^(hidden|submit|button)$/i.test(x.a.type || '') && x.a.tabindex !== '-1').length; return F(n <= 6, `${f.a.action || 'Formular'}: ${n} sichtbare Felder (Richtwert ≤ 6)`); })),
  'skip-link': () => jedeSeite(seiten, s => { const a = s.links[0]; return [F(!!a && /^#./.test(a.href || '') && s.ids.has(a.href.slice(1)), a ? `erster Link ${a.href}` : 'kein Link')]; }),
  'impressum-datenschutz': () => jedeSeite(seiten.filter(s => !/^404\./.test(s.datei)), s => { const h = s.links.map(l => (l.href || '').toLowerCase()); const i = h.some(x => x.includes('impressum')), d = h.some(x => x.includes('datenschutz')); return [F(i && d, `${i ? '' : 'Impressum-Link fehlt '}${d ? '' : 'Datenschutz-Link fehlt'}` || 'Impressum und Datenschutz verlinkt')]; }),
  'seite-404': () => [F(DATEIEN.includes('404.html'), DATEIEN.includes('404.html') ? '404.html vorhanden' : '404.html fehlt')],
  favicon: () => jedeSeite(seiten, s => [F(tags(s.kopf, 'link').some(l => /icon/i.test(l.a.rel || '')), 'Favicon verlinkt')]),
  'fremde-quellen': () => { // alles, was der Browser ohne Klick lädt: src, srcset, poster, data, action, Kopf-Links, url() in CSS und style=""
    const o = new Set(); const fremd = u => { u = String(u || '').trim(); if (!/^(https?:)?\/\//i.test(u)) return; try { const x = new URL(u, basis || 'https://eigen.invalid'); if (x.origin !== basis) o.add(x.href); } catch { o.add(u); } };
    const urls = css => [...css.matchAll(/url\(\s*['"]?([^'")\s]+)|@import\s+(?:url\()?\s*['"]?([^'");\s]+)/g)].forEach(m => fremd(m[1] || m[2]));
    for (const s of seiten) {
      for (const m of s.html.matchAll(/<(?!a\b)[a-z][\w-]*\b[^>]*?\s(src|poster|data|action)="([^"]*)"/gi)) fremd(m[2]);
      for (const m of s.html.matchAll(/\ssrcset="([^"]*)"/gi)) m[1].split(',').forEach(x => fremd(x.trim().split(/\s+/)[0]));
      for (const l of tags(s.kopf, 'link')) if (!/(^|\s)(canonical|alternate|author|license|me)(\s|$)/i.test(l.a.rel || '')) fremd(l.a.href);
      for (const m of s.html.matchAll(/\sstyle="([^"]*)"/gi)) urls(m[1]);
    }
    for (const c of CSS) urls(c.t);
    return [F(!o.size, o.size ? `fremde Herkünfte: ${[...o].slice(0, 5).join(', ')}` : 'nur eigene Herkunft')];
  },
  'tracking-skripte': () => jedeSeite(seiten, s => { const m = s.html.match(TRACKER); return [F(!m, m ? `Tracking-Code gefunden (${m[0]}) – einwilligungspflichtig?` : 'kein Tracking-Code')]; }),
  'mixed-content': () => jedeSeite(seiten, s => { const o = [...s.html.matchAll(/\b(?:src|href|srcset|action|poster)="(http:\/\/[^"]+)"/g)].map(m => m[1]).filter(u => !/^http:\/\/(www\.)?w3\.org/.test(u)); return [F(!o.length, o.length ? `http://-Adressen: ${o.slice(0, 3).join(', ')}` : 'nur https')]; }),
  'sicherheits-header': () => { if (!HEADERS) return [F(false, 'public/_headers fehlt')]; const csp = HEADERS['content-security-policy'] || ''; const script = (csp.match(/script-src([^;]*)/) || csp.match(/default-src([^;]*)/) || [, ''])[1]; const f = []; if (!csp) f.push('CSP fehlt'); if (/unsafe-inline|unsafe-eval|\s\*(\s|$)/.test(script)) f.push('script-src mit unsafe-inline/unsafe-eval/*'); for (const h of ['strict-transport-security', 'x-content-type-options', 'referrer-policy', 'permissions-policy']) if (!HEADERS[h]) f.push(`${h} fehlt`); if (!/frame-ancestors/.test(csp) && !HEADERS['x-frame-options']) f.push('frame-ancestors/X-Frame-Options fehlt'); return [F(!f.length, f.length ? f.join(', ') : 'CSP, HSTS, nosniff, Referrer, Permissions, Framing gesetzt')]; },
  'security-txt': () => [F(DATEIEN.includes('.well-known/security.txt'), DATEIEN.includes('.well-known/security.txt') ? 'security.txt vorhanden' : '/.well-known/security.txt fehlt')],
  'robots-txt': () => { if (!ROBOTS) return [F(false, 'robots.txt fehlt')]; const f = []; if (gesperrt('*')) f.push('User-agent: * mit Disallow: / sperrt alles'); if (!ROBOTS.sitemaps.length) f.push('Sitemap:-Zeile fehlt'); if (ROBOTS.sitemaps.some(u => !/^https:\/\//.test(u))) f.push('Sitemap-URL nicht absolut/https'); if (/noindex/i.test(ROBOTS.text)) f.push('noindex in robots.txt wird nicht unterstützt'); return [F(!f.length, f.join(', ') || 'robots.txt ok')]; },
  'ki-crawler': () => { if (!ROBOTS) return [F(false, 'robots.txt fehlt')]; const such = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'Applebot']; const g = such.filter(gesperrt); return [F(!g.length, g.length ? `Such-Crawler gesperrt: ${g.join(', ')}` : 'alle Such-Crawler (Google, Bing, OpenAI-, Anthropic-, Perplexity-, Apple-Suche) zugelassen')]; },
  sitemap: () => { if (!SITEMAP) return [F(false, 'sitemap.xml fehlt')]; const f = []; if (!/<urlset\b/.test(SITEMAP.text)) f.push('kein <urlset>'); if (SITEMAP.locs.some(u => !/^https:\/\//.test(u))) f.push('nicht absolute/https-URLs'); if (/<priority>|<changefreq>/.test(SITEMAP.text)) f.push('priority/changefreq werden von Google ignoriert (weglassen)'); return [F(!f.length, f.join(', ') || `${SITEMAP.locs.length} URLs`)]; },
  'sitemap-abdeckung': () => { if (!SITEMAP) return [F(false, 'sitemap.xml fehlt')]; const locs = new Set(SITEMAP.locs.map(u => u.replace(/\/$/, ''))); const f = []; for (const s of indexiert) { const c = (s.canonical[0] || basis + s.pfad).replace(/\/$/, ''); if (!locs.has(c)) f.push(`${s.datei} fehlt in der Sitemap`); } for (const s of seiten.filter(x => !x.indexiert)) { const c = (s.canonical[0] || basis + s.pfad).replace(/\/$/, ''); if (locs.has(c)) f.push(`${s.datei} ist noindex, steht aber in der Sitemap`); } for (const u of SITEMAP.locs) { if (ziel(u, start) === false) f.push(`Sitemap-URL ohne Datei: ${u}`); } return [F(!f.length, f.join('; ') || 'Sitemap deckt alle indexierten Seiten ab')]; },
  canonical: () => jedeSeite(indexiert, s => { const c = s.canonical; if (c.length !== 1) return [F(false, `${c.length} Canonicals`)]; const f = []; let u; try { u = new URL(c[0]); } catch { return [F(false, `Canonical nicht absolut: ${c[0]}`)]; } if (u.protocol !== 'https:') f.push('nicht https'); if (/\.html?$/.test(u.pathname)) f.push('endet auf .html – Cloudflare Pages leitet auf die Adresse ohne Endung um, Canonical/Sitemap/Links ohne .html'); if (basis && u.origin !== basis) f.push(`andere Herkunft ${u.origin}`); const z = ziel(c[0], s); if (!z || z.datei !== s.datei) f.push(`zeigt nicht auf sich selbst (${c[0]})`); return [F(!f.length, f.join(', ') || `→ ${c[0]}`)]; }),
  'noindex-bewusst': () => { const ok = /^(404|impressum|datenschutz|danke|nachricht-gesendet|abbruch|agb|widerruf)\./; return seiten.filter(s => !s.indexiert && !/^404\./.test(s.datei)).map(s => F(ok.test(s.datei), `${s.datei} ist noindex${ok.test(s.datei) ? ' (gewollt)' : ' – Absicht?'}`)).concat([F(start?.indexiert, start?.indexiert ? 'Startseite indexierbar' : 'Startseite ist noindex!')]); },
  'interne-verlinkung': () => indexiert.filter(s => s !== start).map(s => { const von = seiten.filter(x => x !== s && x.links.some(l => { const z = l.href && !l.href.startsWith('#') && ziel(l.href, x); return z && z.datei === s.datei; })); return F(von.length > 0, von.length ? `${s.datei} von ${von.length} Seite(n) verlinkt` : `${s.datei} ist verwaist (kein interner Link)`); }),
  'og-tags': () => { const m = start.metas; const f = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'].filter(k => !m[k]); if (m['og:image'] && !/^https:\/\//.test(m['og:image'])) f.push('og:image nicht absolut'); return [F(!f.length, f.length ? `fehlt: ${f.join(', ')}` : 'Open Graph vollständig')]; },
  'jsonld-syntax': () => jedeSeite(seiten, s => s.ld.map(x => F(x.ok, x.ok ? 'JSON-LD gültig' : `JSON-LD ungültig: ${x.fehler}`))),
  'jsonld-typ': () => { const o = ldObjekte(start); return [F(o.some(x => typen(x).length) && start.ld.some(x => x.ok && /schema\.org/.test(JSON.stringify(x.daten['@context'] || ''))), o.length ? `Startseite: ${o.filter(x => x['@type']).map(x => typen(x).join('/')).join(', ')}` : 'Startseite ohne JSON-LD')]; },
  'jsonld-sichtbar': () => jedeSeite(seiten.filter(s => s.ld.length), s => {
    const sicht = norm(s.text + ' ' + s.titel); const ohne = new Set(['@context', '@type', '@id', 'url', 'image', 'logo', 'sameAs', 'hasMenu', 'menu', 'latitude', 'longitude', 'priceRange', 'dayOfWeek', 'opens', 'closes', 'telephone', 'addressCountry', 'openingHours', 'contentUrl', 'thumbnailUrl', 'item', 'validFrom', 'validThrough', 'inLanguage', 'currenciesAccepted', 'paymentAccepted', 'acceptsReservations', 'hasMap', 'mainEntityOfPage', 'datePublished', 'dateModified', 'position', 'email']);
    const fehlt = [];
    const lauf = (o, k) => { if (Array.isArray(o)) return o.forEach(x => lauf(x, k)); if (o && typeof o === 'object') return Object.entries(o).forEach(([kk, v]) => !ohne.has(kk) && lauf(v, kk)); if (typeof o === 'string' && k && !/^https?:|^\/|^\d{4}-\d{2}/.test(o) && !sicht.includes(norm(o))) fehlt.push(`${k}: „${o}“`); };
    s.ld.filter(x => x.ok).forEach(x => lauf(x.daten));
    return [F(!fehlt.length, fehlt.length ? `JSON-LD-Werte nicht sichtbar: ${fehlt.slice(0, 5).join(', ')}` : 'alle JSON-LD-Werte sichtbar')];
  }),
  'jsonld-lokal': () => {
    const b = betrieb; const erwartet = (A.brancheInfo?.typ || '').split(',').map(x => x.trim()).filter(Boolean);
    if (!b) return [F(false, 'kein LocalBusiness-JSON-LD mit Adresse gefunden')];
    const f = []; const a = b.address || {};
    for (const k of ['name', 'telephone', 'url']) if (!b[k]) f.push(`${k} fehlt`);
    for (const k of ['streetAddress', 'postalCode', 'addressLocality']) if (!a[k]) f.push(`address.${k} fehlt`);
    // Öffnungszeiten gibt es nur bei LocalBusiness; eine reine Organization (Hersteller ohne Kundenverkehr) hat keine
    const nurOrganisation = typen(b).every(t => /^(Organization|Corporation|NGO)$/.test(t));
    if (!nurOrganisation && !b.openingHoursSpecification && !b.openingHours) f.push('Öffnungszeiten fehlen');
    if (erwartet.length && !erwartet.some(t => typen(b).includes(t))) f.push(`Typ ${typen(b).join('/')} statt ${erwartet.join('/')} (Branchentabelle)`);
    return [F(!f.length, f.join(', ') || `${typen(b).join('/')} vollständig`)];
  },
  'jsonld-bewertungen': () => { const o = alleLd.filter(x => (x.aggregateRating || x.review) && typen(x).some(t => !/Product|Recipe|Book|Course|Event|SoftwareApplication|Movie/.test(t))); return [F(!o.length, o.length ? `Eigenbewertung in ${o.map(x => typen(x).join('/')).join(', ')} (self-serving, von Google nicht unterstützt)` : 'keine Eigenbewertungen im Markup')]; },
  nap: () => {
    if (!betrieb) return plan.aktiv['local-seo'] ? [F(false, 'kein LocalBusiness im JSON-LD – Name, Adresse, Telefon nicht abgleichbar')] : [];
    const f = []; const tel = ziffern(betrieb.telephone || ''); const a = betrieb.address || {};
    const tels = new Set(seiten.flatMap(s => s.links.filter(l => /^tel:/i.test(l.href || '')).map(l => ziffern(l.href))));
    const falsch = [...new Set(seiten.flatMap(s => s.links.map(l => l.href || '').filter(h => /^tel:\+490/.test(h.replace(/[\s-]/g, '')))))];
    if (falsch.length) f.push(`ungültige Rufnummer ${falsch.join(', ')} (nach +49 keine 0)`);
    if (tel && !tels.has(tel)) f.push(`JSON-LD-Telefon ${betrieb.telephone} nicht als tel:-Link vorhanden`);
    const kontakt = seiten.filter(s => s === start || /kontakt|anfahrt|contact/.test(s.datei));
    for (const s of kontakt) for (const k of ['streetAddress', 'postalCode', 'addressLocality']) if (a[k] && !norm(s.text).includes(norm(a[k]))) f.push(`${s.datei}: ${k} „${a[k]}“ nicht sichtbar`);
    if (betrieb.name && !seiten.every(s => /^404\./.test(s.datei) || norm(s.text + s.titel).includes(norm(betrieb.name)))) f.push('Name nicht auf jeder Seite');
    return [F(!f.length, f.join('; ') || `Name, Adresse, Telefon einheitlich (${tels.size} Rufnummer${tels.size === 1 ? '' : 'n'})`)];
  },
  oeffnungszeiten: () => {
    const spec = [].concat(betrieb?.openingHoursSpecification || []); if (!spec.length) return betrieb ? [F(false, 'keine Öffnungszeiten im JSON-LD')] : [];
    const sicht = seiten.map(s => s.text).join(' '); const f = [];
    for (const o of spec) for (const t of [o.opens, o.closes].filter(Boolean)) { const [h, m] = t.split(':'); const re = new RegExp(`\\b0?${+h}([:.]${m}|\\s*(Uhr|h))`, 'i'); if (!re.test(sicht) && !(t === '00:00' || t === '23:59')) f.push(`${t} nicht sichtbar`); }
    return [F(!f.length, f.join(', ') || 'Uhrzeiten aus dem JSON-LD stehen im Text (Wochentage bitte manuell abgleichen)')];
  },
  'karte-route': () => [F(seiten.some(s => s.links.some(l => /google\.[a-z.]+\/maps|maps\.apple|openstreetmap|maps\.app\.goo\.gl|geo:/i.test(l.href || '') || /route|anfahrt|wegbeschreibung/i.test(l._text))), 'Route-/Kartenlink vorhanden')],
  'kontakt-jede-seite': () => jedeSeite(seiten.filter(s => !/^(404|danke|abbruch|nachricht-gesendet)\./.test(s.datei)), s => { const ok = s.links.some(l => /^(tel:|mailto:)/i.test(l.href || '') || /kontakt|#kontakt|anfrage|termin|reserv/i.test(l.href || '')); return [F(ok, ok ? 'Kontaktweg vorhanden' : 'kein Kontaktweg (tel:, mailto: oder Kontaktseite)')]; }),
  'fakten-text': () => { const t = norm(start.text + ' ' + start.titel); const w = [betrieb?.name || A.kunde, betrieb?.address?.addressLocality || (A.ortGeraten ? '' : A.ort)].filter(Boolean); const f = w.filter(x => !t.includes(norm(x))); return w.length ? [F(!f.length, f.length ? `Startseite nennt nicht als Text: ${f.join(', ')}` : `Startseite nennt ${w.join(', ')} als Text`)] : [F(false, 'Name/Ort unbekannt (Auftrag und JSON-LD leer)')]; },
  nosnippet: () => jedeSeite(indexiert, s => { const b = /nosnippet|max-snippet\s*:\s*0\b/.test(s.robots) || /data-nosnippet/.test(s.koerper); return [F(!b, b ? 'nosnippet/max-snippet:0/data-nosnippet schränkt Snippets und KI-Antworten ein' : 'Snippets erlaubt')]; }),
  'schriften-lokal': () => { const ff = CSS.flatMap(c => [...c.t.matchAll(/@font-face\s*{([^}]*)}/g)].map(m => [c.f, m[1]])).filter(([, b]) => /url\(/.test(b)) /* reine local()-Ersatzschriften laden nichts */; const o = ff.filter(([, b]) => !/font-display\s*:\s*(swap|optional|fallback)/.test(b)); return ff.length ? [F(!o.length, o.length ? `@font-face ohne font-display: ${[...new Set(o.map(x => x[0]))].join(', ')}` : `${ff.length} Schriften lokal mit font-display`)] : []; },
  'skripte-blockierend': () => jedeSeite(seiten, s => { const o = tags(s.kopf, 'script').filter(t => t.a.src && !('defer' in t.a) && !('async' in t.a) && t.a.type !== 'module'); return [F(!o.length, o.length ? `blockierende Skripte im Kopf: ${o.map(t => t.a.src).join(', ')}` : 'keine blockierenden Skripte')]; }),
  'data-pruefen': () => { const n = seiten.reduce((z, s) => z + (s.html.match(/data-pruefen=/g) || []).length, 0); return [F(n === 0, n ? `${n} offene Angaben mit data-pruefen (vor Launch vom Kunden bestätigen lassen)` : 'keine offenen Angaben')]; },
  platzhalter: () => jedeSeite(seiten, s => { const m = s.text.match(/lorem ipsum|\bTODO\b|\bFIXME\b|\bXXX\b|\[platzhalter\]/i) || s.html.match(/(?:www\.)?beispiel\.de|example\.(?:com|org)/i); return [F(!m, m ? `Platzhalter „${m[0]}“` : 'kein Blindtext, keine Beispiel-Domain')]; }),
  'cache-header': () => { const t = lies('_headers') || ''; const ok = /\/(css|js|fonts|medien|assets)[^\n]*\n(\s+[^\n]*\n)*?\s+Cache-Control:\s*public,\s*max-age=\d{5,}/i.test(t); return [F(ok, ok ? 'lange Cache-Zeiten für Assets gesetzt' : 'keine Cache-Control-Regel für /css, /js, /fonts oder /medien in _headers')]; },
  geheimnisse: () => { const re = /\b(sk|rk)_(live|test)_[A-Za-z0-9]{10,}|whsec_[A-Za-z0-9]{10,}|\bre_[A-Za-z0-9]{16,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16}|\bghp_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{30,}|\b(?:CLOUDFLARE|CF)_API_TOKEN\s*=\s*['"]?[A-Za-z0-9_-]{30,}/; const o = []; const lauf = d => { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules') lauf(p); } else if (/\.(js|mjs|ts|json|html?|toml|txt|css)$|^\.dev\.vars$|^\.env/.test(e.name) && re.test(fs.readFileSync(p, 'utf8'))) o.push(path.relative(ORDNER, p)); } }; lauf(PUB); lauf(path.join(ORDNER, 'functions')); for (const f of ['wrangler.toml', 'kunde.json', '.dev.vars', '.env', '.env.local']) if (fs.existsSync(path.join(ORDNER, f)) && re.test(fs.readFileSync(path.join(ORDNER, f), 'utf8'))) o.push(f); return [F(!o.length, o.length ? `mögliche Geheimnisse in: ${o.join(', ')}` : 'keine Geheimnisse gefunden')]; },
  'csp-streng': () => { const c = HEADERS?.['content-security-policy'] || ''; const f = ["default-src 'self'", "object-src 'none'", 'base-uri', 'form-action'].filter(x => !c.includes(x)); return [F(c && !f.length, c ? (f.length ? `CSP ohne: ${f.join(', ')}` : 'CSP streng') : 'keine CSP')]; },
  hreflang: () => { const h = seiten.flatMap(s => tags(s.kopf, 'link').filter(l => l.a.hreflang)); return h.length ? [F(h.every(l => /^https:\/\//.test(l.a.href)), 'hreflang mit absoluten URLs')] : []; },
};

// Startet gzserver und prüft, dass wirklich DIESE Seite antwortet (sonst misst man still einen fremden Server)
async function starteServer(port) {
  const srv = spawn(process.execPath, [path.join(REPO, 'werkzeuge/gzserver.mjs'), String(port), PUB], { stdio: 'ignore' });
  let beendet = false; srv.on('exit', () => { beendet = true; });
  for (let i = 0; i < 50 && !beendet; i++) { try { const r = await fetch(`http://localhost:${port}/${start.datei}`); if ((await r.text()).includes(start.html.slice(0, 300))) return srv; } catch { /* startet noch */ } await new Promise(r => setTimeout(r, 100)); }
  srv.kill(); throw new Error(`Testserver auf Port ${port} liefert nicht diese Seite`);
}

// ---------- Browser-Prüfungen (Playwright über gzserver mit echten Headern) ----------
let server = null;
async function browserPruefungen() {
  const erg = {};
  server = await starteServer(PORT);
  const { playwright } = await import('./_playwright.mjs'); const { chromium } = await playwright(); const b = await chromium.launch();
  try {
    const CTA = /anruf|rufen sie|reservier|termin|anfrag|kontakt|buchen|bestell|angebot|beratung|jetzt|schreiben sie/i;
    erg['cta-sichtbar'] = [];
    for (const [w, h] of [[390, 844], [1440, 900]]) {
      const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700, reducedMotion: 'reduce' }); const p = await c.newPage();
      await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'load' }); await p.waitForTimeout(300);
      const t = await p.$$eval('a, button', (els, src) => { const re = new RegExp(src, 'i'); return els.filter(e => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e); return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0 && st.visibility !== 'hidden' && +st.opacity > 0 && (re.test(e.textContent + ' ' + (e.getAttribute('aria-label') || '')) || /^(tel:|mailto:)/.test(e.getAttribute('href') || '')); }).map(e => (e.textContent || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 30)); }, CTA.source);
      erg['cta-sichtbar'].push(F(t.length > 0, t.length ? `@${w}px im ersten Bildschirm: ${[...new Set(t)].slice(0, 3).join(' | ')}` : `@${w}px keine Handlungsaufforderung im ersten Bildschirm`));
      await c.close();
    }
    // Bilder im ersten Bildschirm dürfen nicht lazy sein (LCP-Kandidaten, web.dev) – gemessen, nicht geraten
    erg['lcp-nicht-lazy'] = []; const unten = {}; // unten[datei] = Bilder, die in dieser Breite nicht im ersten Bildschirm und nicht lazy sind
    for (const [w, h] of [[390, 844], [1440, 900]]) {
      const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, reducedMotion: 'reduce' }); const p = await c.newPage();
      for (const s of indexiert) {
        await p.goto(`http://localhost:${PORT}/${s.datei}`, { waitUntil: 'load' });
        const lazy = await p.$$eval('img[loading="lazy"]', els => els.filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.top < innerHeight && r.bottom > 0; }).map(e => e.getAttribute('src')));
        erg['lcp-nicht-lazy'].push(F(!lazy.length, lazy.length ? `${s.datei} @${w}px: Bild im ersten Bildschirm ist lazy: ${lazy.join(', ')}` : `${s.datei} @${w}px: erster Bildschirm ohne lazy-Bilder`));
        const eifrig = await p.$$eval('img:not([loading="lazy"])', els => els.filter(e => { const r = e.getBoundingClientRect(); return !(r.width > 0 && r.top < innerHeight && r.bottom > 0); }).map(e => e.getAttribute('src')));
        const u = new Set(eifrig); unten[s.datei] = unten[s.datei] ? new Set([...unten[s.datei]].filter(x => u.has(x))) : u;
      }
      await c.close();
    }
    // lazy nur für Bilder, die in keiner der beiden Breiten im ersten Bildschirm liegen (sonst Widerspruch zu lcp-nicht-lazy)
    erg['bilder-lazy'] = Object.entries(unten).map(([d, u]) => F(!u.size, u.size ? `${d}: ${u.size} Bilder außerhalb des ersten Bildschirms ohne loading="lazy": ${[...u].slice(0, 3).join(', ')}` : `${d}: Bilder unterhalb lazy`));
    erg['inhalt-ohne-js'] = [];
    const mit = await b.newContext({ reducedMotion: 'reduce' }); const ohne = await b.newContext({ javaScriptEnabled: false });
    const pm = await mit.newPage(); const po = await ohne.newPage();
    for (const s of indexiert) {
      await pm.goto(`http://localhost:${PORT}/${s.datei}`, { waitUntil: 'load' }); await po.goto(`http://localhost:${PORT}/${s.datei}`, { waitUntil: 'load' });
      const [a, o] = [await pm.evaluate(() => (document.querySelector('main') || document.body).innerText.length), await po.evaluate(() => (document.querySelector('main') || document.body).innerText.length)];
      erg['inhalt-ohne-js'].push(F(o >= a * 0.8, `${s.datei}: ohne JS ${o} von ${a} Zeichen Hauptinhalt`));
    }
    await mit.close(); await ohne.close();
  } finally { await b.close(); }
  return erg;
}

// ---------- Externe Werkzeuge ----------
function lauf(cmd, args, cwd = REPO, env = {}) { const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', env: { ...process.env, ...env }, timeout: 15 * 60e3 }); return { ok: r.status === 0, out: (r.stdout || '') + (r.stderr || '') }; }
const letzte = (out, n = 4) => out.trim().split('\n').filter(z => /✗|not ok|fehl|error|Problem|überschritten|Grenze|Perf/i.test(z)).slice(0, n).join(' | ') || out.trim().split('\n').slice(-1)[0];
async function externe() {
  const erg = {}; const rel = path.relative(REPO, ORDNER);
  const tests = fs.existsSync(path.join(ORDNER, 'tests')) ? fs.readdirSync(path.join(ORDNER, 'tests')).filter(f => f.endsWith('.test.mjs')).map(f => `tests/${f}`) : [];
  if (tests.length) { const r = lauf(process.execPath, ['--test', ...tests], ORDNER); erg['ext-tests'] = [F(r.ok, r.ok ? `${tests.length} Testdateien grün` : `Tests rot: ${letzte(r.out)}`)]; } else erg['ext-tests'] = [F(false, 'keine Tests im Seitenordner (tests/*.test.mjs)')];
  const hv = path.join(REPO, 'werkzeuge/node_modules/.bin/html-validate');
  if (fs.existsSync(hv)) { const r = lauf(hv, ['-c', 'werkzeuge/.htmlvalidate.json', ...HTMLS.map(f => path.join(rel, 'public', f))]); erg['ext-html-validate'] = [F(r.ok, r.ok ? 'html-validate ohne Fehler' : `html-validate: ${letzte(r.out)}`)]; }
  const k = lauf('python3', ['werkzeuge/kopf-pruefen.py', path.join(rel, 'public')]); erg['ext-kopf'] = [F(k.ok, k.ok ? 'Kopf-Regeln eingehalten' : `Kopf: ${letzte(k.out)}`)];
  if (VOLL) {
    const P2 = await freierPort(); const srv = await starteServer(P2);
    try {
      const p = lauf(process.execPath, ['werkzeuge/pruefen.mjs', path.join(rel, 'public'), String(P2)]); erg['ext-pruefen'] = [F(p.ok, p.ok ? 'pruefen.mjs: 320–1920 px, Konsole, Tippflächen, ohne JS, reduzierte Bewegung ohne Befund' : `pruefen.mjs: ${letzte(p.out, 6)}`)];
      const bu = lauf(process.execPath, ['werkzeuge/budget.mjs', path.join(rel, 'public'), String(P2)]); erg['ext-budget'] = [F(bu.ok, bu.ok ? 'Budget eingehalten' : `Budget: ${letzte(bu.out)}`)];
      const lh = lauf('bash', ['werkzeuge/lighthouse.sh', path.join(rel, 'public'), String(P2)], REPO, { SEITEN: start.datei });
      const zeilen = lh.out.split('\n').filter(z => /Perf \d+/.test(z)).map(z => { const n = k => +(z.match(new RegExp(`${k} (\\d+)`)) || [, 0])[1]; return { perf: n('Perf'), a11y: n('A11y'), bp: n('BP'), seo: n('SEO'), cls: +(z.match(/CLS ([\d.]+)/) || [, 1])[1], lcp: z.match(/LCP ([\d.,]+\s*s)/)?.[1] || '?' }; });
      if (zeilen.length) {
        const med = k => zeilen.map(x => x[k]).sort((a, b) => a - b)[Math.floor(zeilen.length / 2)];
        const w = { perf: med('perf'), a11y: med('a11y'), bp: med('bp'), seo: med('seo'), cls: med('cls') };
        erg['ext-lighthouse'] = [F(w.perf >= 95 && w.a11y === 100 && w.bp === 100 && w.seo === 100, `Lighthouse mobil (Median ${zeilen.length} Läufe): Perf ${w.perf} · A11y ${w.a11y} · BP ${w.bp} · SEO ${w.seo}`)];
        erg['ext-cwv-labor'] = [F(w.cls <= 0.02 && zeilen.every(z => parseFloat(String(z.lcp).replace(',', '.')) <= 2.5), `Labor: LCP ${zeilen.map(z => z.lcp).join(' / ')}, CLS ${w.cls} (Feldwerte erst nach Launch)`)];
      } else erg['ext-lighthouse'] = [F(false, `Lighthouse lieferte kein Ergebnis: ${lh.out.slice(-200)}`)];
    } finally { srv.kill(); }
  }
  return erg;
}

// ---------- Manuelle Bestätigungen (abnahme.md) ----------
const ABNAHME = path.join(ORDNER, 'abnahme.md');
// Ein Beleg muss nachprüfbar sein: Datum, Datei/Screenshot, Datei:Zeile, Messwert oder „trifft nicht zu, weil …“ – „ok“ reicht nicht
const BELEG = /\d{4}-\d{2}-\d{2}|[\w/.-]+\.(png|jpe?g|webp|avif|md|html?|mjs|js|css|json|txt)\b|:\d+\b|\d+([.,]\d+)?\s*(s|ms|px|%|kb|mb)\b|trifft nicht zu, weil .{10,}/i;
function leseBestaetigungen() {
  const m = {}; if (!fs.existsSync(ABNAHME)) return m;
  for (const z of fs.readFileSync(ABNAHME, 'utf8').split('\n')) { const r = z.match(/^\s*-\s*\[([ xX])\]\s*([A-Z][A-Z0-9]{1,4}-\d{2})\b.*?Beleg:\s*(.*)$/); if (r) m[r[2]] = { ok: r[1].toLowerCase() === 'x' && BELEG.test(r[3]), beleg: r[3].trim() }; }
  return m;
}
function schreibeAbnahme(regeln, best) {
  const bisher = fs.existsSync(ABNAHME) ? fs.readFileSync(ABNAHME, 'utf8') : `# Abnahme – manuelle Bestätigungen (${A.kunde || path.basename(ORDNER)})\n\nJe Zeile: prüfen, dann \`[x]\` setzen und hinter „Beleg:“ eintragen, woran es geprüft wurde (Screenshot-Pfad, Datei:Zeile,\nAussage des Kunden mit Datum, Messwert oder „trifft nicht zu, weil …“). Ohne nachprüfbaren Beleg zählt die Bestätigung nicht. Neue Zeilen ergänzt \`werkzeuge/qualitaet.mjs\` selbst.\n\n`;
  const neu = regeln.filter(r => r.art !== 'AUTO' && r.verbindlich !== 'Kann' && !(r.id in best) && !new RegExp(`\\b${r.id}\\b`).test(bisher));
  if (neu.length) fs.writeFileSync(ABNAHME, bisher.replace(/\n*$/, '\n') + neu.map(r => `- [ ] ${r.id} (${r.verbindlich}) ${r.regel.replace(/\s+/g, ' ')} — Beleg: `).join('\n') + '\n');
}

// ---------- Auswertung ----------
let browser = {};
try { browser = await browserPruefungen(); } catch (e) { browser = { 'cta-sichtbar': [F(false, `Browserprüfung nicht möglich: ${e.message.split('\n')[0]}`)], 'inhalt-ohne-js': [F(false, 'Browserprüfung nicht möglich')] }; } finally { server?.kill(); }
const ext = await externe();
const ergebnisse = {}; for (const [id, fn] of Object.entries(CHECKS)) { try { ergebnisse[id] = fn(); } catch (e) { ergebnisse[id] = [F(false, `Prüfung abgestürzt: ${e.message}`)]; } }
Object.assign(ergebnisse, browser, ext);
const VOLL_NOETIG = new Set(['ext-pruefen', 'ext-budget', 'ext-lighthouse', 'ext-cwv-labor']);

const best = leseBestaetigungen();
schreibeAbnahme(plan.regeln, best);
const zeilen = plan.regeln.map(r => {
  const bef = r.pruefung.flatMap(id => ergebnisse[id] ?? (VOLL_NOETIG.has(id) ? [{ ok: null, text: `${id}: nur mit --voll` }] : [{ ok: false, text: `unbekannte Prüfung ${id}` }]));
  const fehler = bef.filter(b => b.ok === false); const offenVoll = bef.some(b => b.ok === null);
  let status;
  if (!/[PBA]/.test(r.phase)) status = best[r.id]?.ok ? 'BESTÄTIGT' : 'NACH LAUNCH'; // Phase L: Wartung, blockiert nicht
  else if (r.art === 'MANUAL') status = best[r.id]?.ok ? 'BESTÄTIGT' : 'OFFEN';
  else if (fehler.length) status = 'FEHLER';
  else if (offenVoll) status = 'VOLL';
  else if (!bef.length) status = r.art === 'SEMI-AUTO' ? (best[r.id]?.ok ? 'BESTANDEN' : 'BESTÄTIGEN') : 'N/A'; // Werkzeug hat nichts gesehen ≠ bestanden
  else if (r.art === 'SEMI-AUTO') status = best[r.id]?.ok ? 'BESTANDEN' : 'BESTÄTIGEN';
  else status = 'BESTANDEN';
  return { ...r, status, befunde: fehler.length ? fehler : bef.slice(0, 2), beleg: best[r.id]?.beleg };
});
const gut = s => ['BESTANDEN', 'BESTÄTIGT', 'N/A', 'NACH LAUNCH', 'VOLL'].includes(s); // VOLL entscheidet das Urteil VORLÄUFIG
const blocker = zeilen.filter(z => z.verbindlich === 'Muss' && !gut(z.status));
const hinweise = zeilen.filter(z => z.verbindlich === 'Soll' && !gut(z.status));
// Dieselbe Prüfung steckt oft in GLOBAL und einem Fachgebiet: verschiedene Befunde getrennt zählen
const befundArten = new Set(blocker.map(z => z.status === 'FEHLER' ? z.befunde.map(b => b.text).join('|') : z.id)).size;
const nachLaunch = zeilen.filter(z => z.status === 'NACH LAUNCH');
const vorlaeufig = zeilen.some(z => z.status === 'VOLL');
const urteil = blocker.length ? 'NICHT BESTANDEN' : vorlaeufig ? 'VORLÄUFIG (ohne --voll)' : hinweise.length ? 'BESTANDEN MIT HINWEISEN' : 'BESTANDEN';

const ZEICHEN = { BESTANDEN: '✓', BESTÄTIGT: '✓', 'N/A': '·', FEHLER: '✗', OFFEN: '○', BESTÄTIGEN: '◐', VOLL: '…', 'NACH LAUNCH': '↻' };
const gruppen = ['global', ...Object.keys(plan.aktiv).sort((a, b) => plan.aktiv[b].prio - plan.aktiv[a].prio)].filter((k, i, l) => l.indexOf(k) === i);
const md = [`# Quality Gate – ${A.kunde || path.basename(ORDNER)}`, '', `**Urteil: ${urteil}** · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · ${VOLL ? 'volle Prüfung' : 'schnelle Prüfung'} · ${seiten.length} Seiten · Auftrag: ${hatAuftrag ? path.relative(REPO, auftragDatei) : 'keiner (nur globaler Standard)'}`, '',
  `Muss offen: **${blocker.length}** (${befundArten} verschiedene Befunde) · Soll offen: ${hinweise.length} · nach Launch: ${nachLaunch.length} · Legende: ✓ bestanden · ✗ Fehler · ◐ Werkzeug ok oder ohne Befund, Bestätigung fehlt · ○ manuell offen · … nur mit --voll · ↻ nach Launch (Wartung) · · nicht anwendbar`, ''];
for (const g of gruppen) {
  const zs = zeilen.filter(z => z.bereich === g); if (!zs.length) continue;
  md.push(`## ${plan.gebiete[g].name}${g === 'global' ? ' (immer)' : ` (${plan.aktiv[g] ? ['', 'OPTIONAL', 'NIEDRIG', 'MITTEL', 'HOCH', 'KRITISCH'][plan.aktiv[g].prio] : ''})`}`, '', '| | ID | Regel | Verb. | Befund |', '|---|---|---|---|---|');
  for (const z of zs) md.push(`| ${ZEICHEN[z.status]} | ${z.id} | ${z.regel.replace(/\|/g, '\\|')} | ${z.verbindlich} | ${(z.status === 'BESTÄTIGT' || (z.status === 'BESTANDEN' && z.art === 'SEMI-AUTO') ? `Beleg: ${z.beleg}` : z.status === 'OFFEN' ? 'in abnahme.md bestätigen' : z.status === 'NACH LAUNCH' ? 'im ersten Wartungslauf prüfen und in abnahme.md belegen' : z.befunde.map(b => b.text).join('; ')).replace(/\|/g, '\\|').slice(0, 400)} |`);
  md.push('');
}
if (blocker.length) md.push('## Zu beheben (Muss)', '', ...blocker.map(z => `- **${z.id}** ${z.regel} → ${z.status === 'FEHLER' ? z.befunde.map(b => b.text).join('; ') : z.status === 'VOLL' ? 'mit --voll prüfen' : 'Bestätigung mit Beleg in abnahme.md'}`), '');
md.push('Ablauf bei Fehlern: Problem dokumentieren → Ursache bestimmen → beheben → erneut prüfen → erst dann bestanden (`.claude/skills/abnahme/SKILL.md`).');
fs.writeFileSync(path.join(ORDNER, 'QUALITAET.md'), md.join('\n') + '\n');

if (!argv.includes('--still')) {
  for (const g of gruppen) {
    const zs = zeilen.filter(z => z.bereich === g && z.verbindlich !== 'Kann'); if (!zs.length) continue;
    console.log(`\n${plan.gebiete[g].name.toUpperCase()}`);
    for (const z of zs) console.log(`  ${ZEICHEN[z.status]} ${z.id.padEnd(7)} ${z.verbindlich.padEnd(4)} ${z.regel.slice(0, 70)}${z.status === 'FEHLER' ? `\n              → ${z.befunde.map(b => b.text).join('; ').slice(0, 240)}` : ''}`);
  }
}
console.log(`\n${urteil}: ${blocker.length} Muss offen, ${hinweise.length} Soll offen. Bericht: ${path.relative(REPO, path.join(ORDNER, 'QUALITAET.md'))}, Bestätigungen: ${path.relative(REPO, ABNAHME)}`);
process.exit(blocker.length ? 1 : 0);
