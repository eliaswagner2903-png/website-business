// URFA SOFRASI – Variante 1. Kleines Skript ohne Abhängigkeiten.
// Ohne JavaScript ist alles sichtbar und bedienbar; hier kommen nur Komfort und ruhige Bewegung dazu.
// Tempi und Kurven sind bewusst gewählt (siehe werkzeuge/DESIGN-NOTIZEN.md).
(function () {
  "use strict";

  var root = document.documentElement;
  var ruhig = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fein = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasIO = "IntersectionObserver" in window;
  var alle = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var bildAus = function (f, vorlage) {
    var img = document.createElement("img");
    img.alt = f.a || "";
    img.decoding = "async";
    img.width = 1016;
    img.height = vorlage ? vorlage.height || 535 : 535;
    if (vorlage && vorlage.sizes) img.sizes = vorlage.sizes;
    img.dataset.srcset = "assets/img/" + f.n + "-640.webp 640w, assets/img/" + f.n + "-1016.webp 1016w";
    img.dataset.src = "assets/img/" + f.n + "-1016.webp";
    if (f.t) img.dataset.titel = f.t;
    return img;
  };
  var laden = function (img) {
    if (!img || !img.dataset.src) return;
    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
    delete img.dataset.src;
  };

  // ---------------------------------------------------------------- Kopfzeile wird beim Scrollen dichter
  var kopf = document.querySelector(".kopf");
  if (kopf && hasIO) {
    var marker = document.createElement("div");
    marker.setAttribute("aria-hidden", "true");
    marker.style.cssText = "position:absolute;top:0;left:0;width:1px;height:12px;pointer-events:none";
    document.body.prepend(marker);
    new IntersectionObserver(function (e) { kopf.classList.toggle("gescrollt", !e[0].isIntersecting); }).observe(marker);
  }

  // ---------------------------------------------------------------- Handy-Menü: Blatt mit Bogen-Oberkante
  // Öffnen 0,72 s mit leise startender Kurve (große Fläche soll nicht „anspringen“), Schließen 0,42 s.
  // Schließt per Tipp daneben, Escape, Wischen nach unten oder Tipp auf einen Eintrag.
  var knopf = document.querySelector(".menue-knopf");
  var menue = document.getElementById("menue");
  if (knopf && menue) {
    var blatt = menue.querySelector(".menue-blatt");
    var hinten = alle("main, .fuss, .schnell");
    var offen = false, bilderDa = false;
    var setze = function (auf, fokusZurueck) {
      if (auf === offen) return;
      offen = auf;
      if (auf && !bilderDa) {
        bilderDa = true;
        alle(".menue-bild[data-bild]", menue).forEach(function (s) {
          var i = document.createElement("img");
          i.src = s.dataset.bild; i.alt = ""; i.width = 640; i.height = 337; i.decoding = "async";
          s.appendChild(i);
        });
      }
      blatt.style.removeProperty("--ziehen");
      menue.classList.toggle("offen", auf);
      if (auf) menue.removeAttribute("inert"); else menue.setAttribute("inert", "");
      hinten.forEach(function (el) { if (auf) el.setAttribute("inert", ""); else el.removeAttribute("inert"); });
      knopf.setAttribute("aria-expanded", String(auf));
      root.classList.toggle("menue-auf", auf);
      if (auf) setTimeout(function () { var a = menue.querySelector(".menue-liste a"); if (a && offen) a.focus({ preventScroll: true }); }, 420);
      else if (fokusZurueck) knopf.focus();
    };
    knopf.addEventListener("click", function () { setze(!offen); });
    menue.addEventListener("click", function (e) {
      if (e.target.closest("[data-zu]") || e.target.closest(".menue-liste a")) setze(false, !!e.target.closest("[data-zu]"));
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && offen) setze(false, true); });
    window.addEventListener("resize", function () { if (offen && window.innerWidth >= 980) setze(false); });

    // Wischen nach unten schließt (nur wenn der Inhalt ganz oben steht)
    var startY = null, dy = 0, t0 = 0;
    blatt.addEventListener("touchstart", function (e) {
      startY = blatt.scrollTop > 0 ? null : e.touches[0].clientY; dy = 0; t0 = Date.now();
    }, { passive: true });
    blatt.addEventListener("touchmove", function (e) {
      if (startY === null) return;
      dy = Math.max(0, e.touches[0].clientY - startY);
      if (dy > 6) { blatt.classList.add("zieht"); blatt.style.setProperty("--ziehen", dy + "px"); }
    }, { passive: true });
    blatt.addEventListener("touchend", function () {
      if (startY === null) return;
      startY = null;
      blatt.classList.remove("zieht");
      var tempo = dy / Math.max(1, Date.now() - t0);
      if (dy > 110 || (dy > 40 && tempo > 0.5)) setze(false); else blatt.style.removeProperty("--ziehen");
      dy = 0;
    });
  }

  // ---------------------------------------------------------------- Navigation (Computer): Linie mit Raute gleitet mit
  var navi = document.querySelector(".navi");
  if (navi) {
    var aktivLink = navi.querySelector('a[aria-current="page"]');
    var linieZu = function (a, sofort) {
      if (!a || !navi.offsetWidth) { navi.classList.remove("linie-an"); return; }
      var r = a.getBoundingClientRect(), n = navi.getBoundingClientRect();
      var innen = parseFloat(getComputedStyle(a).paddingLeft) || 0;
      if (sofort || !navi.classList.contains("linie-an")) navi.classList.add("ohne-gleiten");
      navi.style.setProperty("--lx", (r.left - n.left + innen) + "px");
      navi.style.setProperty("--lw", String(Math.max(0, r.width - 2 * innen)));
      navi.classList.add("linie-an");
      if (navi.classList.contains("ohne-gleiten")) { void navi.offsetWidth; navi.classList.remove("ohne-gleiten"); }
    };
    alle("a", navi).forEach(function (a) {
      a.addEventListener("mouseenter", function () { linieZu(a); });
      a.addEventListener("focus", function () { linieZu(a); });
    });
    navi.addEventListener("mouseleave", function () { linieZu(aktivLink); });
    navi.addEventListener("focusout", function () { linieZu(aktivLink); });
    var setzeLinie = function () { linieZu(aktivLink, true); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setzeLinie); else setzeLinie();
    window.addEventListener("resize", setzeLinie);
  }

  // ---------------------------------------------------------------- Öffnungsstatus (täglich 10–23 Uhr, Zeit in Eislingen)
  var statusEl = alle("[data-status]");
  if (statusEl.length) {
    var pruefeStatus = function () {
      var h, m;
      try {
        var teile = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
        teile.forEach(function (p) { if (p.type === "hour") h = +p.value % 24; if (p.type === "minute") m = +p.value; });
      } catch (e) { var d = new Date(); h = d.getHours(); m = d.getMinutes(); }
      var min = h * 60 + m, auf = min >= 600 && min < 1380;
      var text = auf ? "Jetzt geöffnet · bis 23:00 Uhr" : "Geschlossen · öffnet um 10:00 Uhr";
      statusEl.forEach(function (el) {
        el.classList.toggle("offen", auf);
        el.classList.toggle("zu", !auf);
        el.querySelector(".status-text").textContent = text;
      });
    };
    pruefeStatus();
    setInterval(pruefeStatus, 60000);
  }

  // ---------------------------------------------------------------- Schnellleiste auf der Startseite erst, wenn der Anruf-Knopf im Hero nicht zu sehen ist
  var schnell = document.querySelector(".schnell");
  var heroTel = document.querySelector("[data-hero-tel]");
  if (schnell) {
    if (heroTel && hasIO) {
      new IntersectionObserver(function (e) { schnell.classList.toggle("da", !e[0].isIntersecting); }).observe(heroTel);
    } else schnell.classList.add("da");
  }

  // ---------------------------------------------------------------- Einblenden beim Scrollen (gestaffelt, einmalig)
  var einblend = alle(".einblenden");
  alle(".kopf-zeile, .kopf-mitte, .tafel-text > *, .gast-text > *, .willkommen .schmal > :not([data-woerter]), .streifen, " +
       ".galerie li, .kontakt-spalten > div, .fuss-marke, .fuss-raster > div, .menu-cat").forEach(function (el) {
    if (!el.classList.contains("einblenden")) { el.classList.add("einblenden"); einblend.push(el); }
  });
  if (!ruhig && hasIO) {
    var hoehe = window.innerHeight;
    var einIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        einIO.unobserve(el);
        el.classList.add("sichtbar");
        var d = parseInt(el.style.getPropertyValue("--d"), 10) || 0;
        // Danach aufräumen, sonst bremsen die langen Übergänge spätere Hover-Effekte
        setTimeout(function () { el.classList.remove("einblenden", "sichtbar"); el.style.removeProperty("--d"); },
          d + (el.classList.contains("arkade") ? 2400 : 1200));
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    // Erst alle Positionen lesen, dann schreiben (sonst erzwingt jedes Element ein neues Layout)
    var oben = einblend.map(function (el) { return el.getBoundingClientRect().top; });
    var stufe = einblend.map(function (el) { return Math.min(Math.max(0, alle(":scope > .einblenden", el.parentElement).indexOf(el)), 5); });
    einblend.forEach(function (el, i) {
      // Was beim Laden schon zu sehen ist, wird nicht versteckt (kein Flackern)
      if (oben[i] < hoehe * 0.92) { el.classList.remove("einblenden"); return; }
      el.style.setProperty("--d", stufe[i] * 90 + "ms");
      einIO.observe(el);
    });
  } else einblend.forEach(function (el) { el.classList.remove("einblenden"); });

  // ---------------------------------------------------------------- Wort-Welle im Willkommenstext
  // Jedes Wort wird nacheinander hell (45 ms Versatz, je 1 s): gut zu verfolgen, gesamt ca. 3,5 s.
  if (!ruhig && hasIO) {
    alle("[data-woerter]").forEach(function (p) {
      if (p.getBoundingClientRect().top < window.innerHeight * 0.85) return;
      var n = 0;
      var teile = function (knoten) {
        Array.prototype.slice.call(knoten.childNodes).forEach(function (k) {
          if (k.nodeType === 3) {
            var frag = document.createDocumentFragment();
            k.textContent.split(/(\s+)/).forEach(function (s) {
              if (!s) return;
              if (/^\s+$/.test(s)) { frag.appendChild(document.createTextNode(s)); return; }
              var w = document.createElement("span");
              w.className = "wort";
              w.style.setProperty("--w", n++);
              w.textContent = s;
              frag.appendChild(w);
            });
            knoten.replaceChild(frag, k);
          } else if (k.nodeType === 1) teile(k);
        });
      };
      teile(p);
      p.classList.add("wellen");
      var wIO = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { p.classList.add("an"); wIO.disconnect(); }
      }, { threshold: 0.45 });
      wIO.observe(p);
    });
  }

  // ---------------------------------------------------------------- Diashows in den Bögen
  // Takt 6,8 s, Überblendung 1,4 s, dazu 7 % Zoom über Takt + 2,2 s. Die beiden Hero-Bögen wechseln um einen
  // halben Takt versetzt. Weitere Fotos werden erst geladen, wenn sie gebraucht werden (schont das Datenvolumen).
  // Pausiert außerhalb des Bildschirms, bei verstecktem Tab und solange die Maus darauf ruht.
  alle(".diashow").forEach(function (fig) {
    var erstes = fig.querySelector("img");
    var extra = [];
    try { extra = JSON.parse(fig.dataset.fotos || "[]"); } catch (e) { extra = []; }
    if (!erstes || !extra.length) return;
    var bilder = [erstes].concat(extra.map(function (f) { var i = bildAus(f, erstes); fig.appendChild(i); return i; }));
    var takt = parseInt(fig.dataset.takt, 10) || 6800;
    var pos = 0, timer = null, vorTimer = null, start = 0, rest = takt + (parseInt(fig.dataset.versatz, 10) || 0);
    var sichtbar = false, maus = false, bereit = document.readyState === "complete";
    var zwei = function (n) { return (n < 10 ? "0" : "") + n; };
    fig.style.setProperty("--kb", (takt + 2200) + "ms");

    var leiste = document.createElement("div");
    leiste.className = "dia-leiste";
    var titel = document.createElement("p");
    titel.className = "dia-titel";
    titel.setAttribute("aria-hidden", "true");
    titel.textContent = erstes.dataset.titel || "";
    var zahl = document.createElement("span");
    zahl.className = "dia-zahl";
    zahl.setAttribute("aria-hidden", "true");
    var balken = document.createElement("div");
    balken.className = "dia-balken";
    balken.setAttribute("role", "group");
    balken.setAttribute("aria-label", "Fotos wechseln");
    var knoepfe = bilder.map(function (b, n) {
      var k = document.createElement("button");
      k.type = "button";
      k.setAttribute("aria-label", "Foto " + (n + 1) + " von " + bilder.length + (b.dataset.titel ? ": " + b.dataset.titel : ""));
      k.addEventListener("click", function () { zeigen(n); });
      balken.appendChild(k);
      return k;
    });
    leiste.appendChild(titel);
    leiste.appendChild(zahl);
    leiste.appendChild(balken);
    fig.parentNode.insertBefore(leiste, fig.nextSibling);
    if (ruhig) leiste.classList.add("stumm");

    var laeuft = function () { return !ruhig && bereit && sichtbar && !maus && !document.hidden; };
    var markieren = function (neustart) {
      knoepfe.forEach(function (k, i) {
        k.classList.toggle("gezeigt", i < pos);
        k.removeAttribute("aria-current");
        if (i === pos) {
          k.style.setProperty("--takt", rest + "ms");
          if (neustart) void k.offsetWidth;   // Balken-Animation neu starten
          k.setAttribute("aria-current", "true");
        }
      });
      zahl.innerHTML = "<b>" + zwei(pos + 1) + "</b> / " + zwei(bilder.length);
    };
    var planen = function () {
      clearTimeout(timer); timer = null;
      leiste.classList.toggle("pausiert", !laeuft());
      if (!laeuft()) return;
      start = Date.now();
      // nächstes Foto erst kurz vor dem Wechsel laden (spart Datenvolumen beim ersten Aufruf)
      var naechstes = bilder[(pos + 1) % bilder.length];
      clearTimeout(vorTimer);
      vorTimer = setTimeout(function () { laden(naechstes); }, Math.max(0, rest - 3000));
      timer = setTimeout(function () { zeigen(pos + 1); }, rest);
    };
    var anhalten = function () {
      if (timer) { clearTimeout(timer); timer = null; rest = Math.max(600, rest - (Date.now() - start)); }
      leiste.classList.add("pausiert");
    };
    var zeigen = function (n) {
      var alt = bilder[pos];
      pos = (n + bilder.length) % bilder.length;
      var neu = bilder[pos];
      laden(neu);
      if (alt !== neu) alt.classList.remove("an", "zoom");
      neu.classList.add("an");
      if (!ruhig) { neu.classList.remove("zoom"); void neu.offsetWidth; neu.classList.add("zoom"); }
      if (neu.dataset.titel && titel.textContent !== neu.dataset.titel) {
        titel.classList.add("wechsel");
        setTimeout(function () { titel.textContent = neu.dataset.titel; titel.classList.remove("wechsel"); }, 300);
      }
      rest = takt;
      markieren(true);
      planen();
    };
    markieren();
    if (!ruhig) requestAnimationFrame(function () { erstes.classList.add("zoom"); });
    if (!bereit) window.addEventListener("load", function () { bereit = true; planen(); });
    if (fein) {
      fig.addEventListener("mouseenter", function () { maus = true; anhalten(); });
      fig.addEventListener("mouseleave", function () { maus = false; planen(); });
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) anhalten(); else planen(); });
    if (hasIO) {
      new IntersectionObserver(function (e) {
        sichtbar = e[0].isIntersecting;
        if (sichtbar) planen(); else anhalten();
      }, { threshold: 0.25 }).observe(fig);
    } else { sichtbar = true; planen(); }
  });

  // ---------------------------------------------------------------- Speisetafel: Foto wechselt passend zum Gericht (Computer)
  var tafelFig = document.querySelector("[data-tafelbild]");
  if (tafelFig) {
    var tafelErstes = tafelFig.querySelector("img");
    var tafelBilder = {};
    tafelBilder[tafelErstes.dataset.fuer] = tafelErstes;
    var tafelAktuell = tafelErstes, tafelGeladen = false;
    var tafelLaden = function () {
      if (tafelGeladen) return;
      tafelGeladen = true;
      var extra = [];
      try { extra = JSON.parse(tafelFig.dataset.fotos || "[]"); } catch (e) { extra = []; }
      extra.forEach(function (f) { var i = bildAus(f, tafelErstes); tafelFig.appendChild(i); laden(i); tafelBilder[f.n] = i; });
    };
    var liste = document.querySelector(".tafel-liste");
    if (fein && liste) liste.addEventListener("mouseenter", tafelLaden);
    alle(".tafel-liste a[data-bild]").forEach(function (a) {
      var zeig = function () {
        tafelLaden();
        var z = tafelBilder[a.dataset.bild];
        if (!z || z === tafelAktuell) return;
        tafelAktuell.classList.remove("an");
        z.classList.add("an");
        tafelAktuell = z;
      };
      if (fein) a.addEventListener("mouseenter", zeig);
      a.addEventListener("focus", zeig);
    });
  }

  // ---------------------------------------------------------------- Zahlen zählen beim Erscheinen hoch
  if (!ruhig && hasIO) {
    alle("[data-zaehlen]").forEach(function (dd) {
      if (dd.getBoundingClientRect().top < window.innerHeight) return;
      var ziel = parseInt(dd.dataset.zaehlen, 10);
      dd.textContent = "0";
      var zIO = new IntersectionObserver(function (e) {
        if (!e[0].isIntersecting) return;
        zIO.disconnect();
        var t0 = performance.now();
        var schritt = function (t) {
          var p = Math.min(1, (t - t0) / 1400);
          dd.textContent = String(Math.round(ziel * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(schritt);
        };
        requestAnimationFrame(schritt);
      }, { threshold: 0.6 });
      zIO.observe(dd);
    });
  }

  // ---------------------------------------------------------------- Foto-Streifen: Pfeile am Computer
  var streifen = document.querySelector(".streifen");
  var pfeile = document.querySelector(".streifen-pfeile");
  if (streifen && pfeile && fein) {
    pfeile.hidden = false;
    var pk = alle("button", pfeile);
    var pruefePfeile = function () {
      pk[0].disabled = streifen.scrollLeft < 8;
      pk[1].disabled = streifen.scrollLeft + streifen.clientWidth > streifen.scrollWidth - 8;
    };
    pk.forEach(function (b) {
      b.addEventListener("click", function () {
        var karte = streifen.querySelector(".streifen-karte");
        var w = karte ? karte.getBoundingClientRect().width + 16 : 280;
        streifen.scrollBy({ left: parseInt(b.dataset.streifen, 10) * w * 2, behavior: ruhig ? "auto" : "smooth" });
      });
    });
    streifen.addEventListener("scroll", function () { requestAnimationFrame(pruefePfeile); }, { passive: true });
    pruefePfeile();
  }

  // ---------------------------------------------------------------- Speisekarte: Suche, Taste „/“, aktive Kategorie
  var suche = document.getElementById("menu-search");
  if (suche) {
    // findet „sis“ auch in „Şiş“ und „kunefe“ in „Künefe“
    var falten = function (s) {
      return s.toLocaleLowerCase("de")
        .replace(/[şŞ]/g, "s").replace(/[ıİ]/g, "i").replace(/[ğĞ]/g, "g").replace(/[çÇ]/g, "c")
        .replace(/ö/g, "o").replace(/ü/g, "u").replace(/ä/g, "a").replace(/ß/g, "ss")
        .normalize("NFD").replace(/[̀-ͯ]/g, "");
    };
    var kategorien = alle(".menu-cat");
    var eintraege = kategorien.map(function (cat) {
      return alle(".menu-item", cat).map(function (li) {
        var de = li.querySelector(".de");
        return { el: li, text: falten(li.querySelector(".name > span").textContent + " " + (de ? de.textContent : "")) };
      });
    });
    var leer = document.getElementById("menu-empty");
    var meldung = document.getElementById("menu-status");
    suche.addEventListener("input", function () {
      var q = falten(suche.value.trim());
      var summe = 0;
      kategorien.forEach(function (cat, i) {
        var treffer = 0;
        eintraege[i].forEach(function (it) {
          var zeigen = !q || it.text.indexOf(q) !== -1;
          it.el.hidden = !zeigen;
          if (zeigen) treffer++;
        });
        cat.hidden = treffer === 0;
        alle(".menu-sub", cat).forEach(function (sub) { sub.hidden = !!q; });
        summe += treffer;
      });
      leer.hidden = summe !== 0;
      meldung.textContent = !q ? "" : summe === 0 ? "Kein Gericht gefunden" : summe === 1 ? "1 Gericht gefunden" : summe + " Gerichte gefunden";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { e.preventDefault(); suche.focus(); }
    });

    var leiste2 = document.querySelector(".menu-cats");
    var tools = document.querySelector(".menu-tools");
    var toolsHoehe = function () { root.style.setProperty("--tools-h", tools.offsetHeight + "px"); };
    toolsHoehe();
    window.addEventListener("resize", toolsHoehe);
    leiste2.classList.add("hat-pille");
    var chips = {};
    alle("a", leiste2).forEach(function (a) { chips[a.hash.slice(1)] = a; });
    var aktivChip = null, sperre = 0;
    var setzeAktiv = function (id, sofort) {
      var chip = chips[id];
      if (!chip || chip === aktivChip) return;
      if (aktivChip) { aktivChip.classList.remove("is-active"); aktivChip.removeAttribute("aria-current"); }
      chip.classList.add("is-active");
      chip.setAttribute("aria-current", "true");
      var erstesMal = !aktivChip;
      aktivChip = chip;
      if (sofort || erstesMal) leiste2.classList.add("ohne-gleiten");
      leiste2.style.setProperty("--cx", chip.offsetLeft + "px");   // die Leiste ist position: relative
      leiste2.style.setProperty("--cw", chip.offsetWidth + "px");
      if (leiste2.classList.contains("ohne-gleiten")) { void leiste2.offsetWidth; leiste2.classList.remove("ohne-gleiten"); }
      if (leiste2.scrollWidth > leiste2.clientWidth) {
        leiste2.scrollTo({ left: chip.offsetLeft - (leiste2.clientWidth - chip.offsetWidth) / 2, behavior: ruhig || sofort ? "auto" : "smooth" });
      }
    };
    // Zwei Spalten am Computer: Unter den Kategorien an der Leselinie gewinnt die, deren Überschrift
    // zuletzt über die Linie gekommen ist (passt auch nach einem Sprung in die rechte Spalte).
    var berechne = function () {
      if (Date.now() < sperre) return;
      var y = tools.getBoundingClientRect().bottom + 48, beste = null, hoechste = -Infinity;
      kategorien.forEach(function (c) {
        if (c.hidden) return;
        var r = c.getBoundingClientRect();
        if (r.top > y || r.bottom <= y) return;
        var gleich = Math.abs(r.top - hoechste) <= 1;   // gleich hoch (oben in beiden Spalten): aktive behalten
        if (r.top > hoechste + 1 || (gleich && aktivChip && aktivChip.hash === "#" + c.id)) { beste = c; hoechste = r.top; }
      });
      if (!beste) {
        var erste = kategorien.filter(function (c) { return !c.hidden; })[0];
        if (erste && erste.getBoundingClientRect().top > y) beste = erste;
      }
      if (beste) setzeAktiv(beste.id);
    };
    var rafPlan = false;
    window.addEventListener("scroll", function () {
      if (rafPlan) return;
      rafPlan = true;
      requestAnimationFrame(function () { rafPlan = false; berechne(); });
    }, { passive: true });
    window.addEventListener("resize", function () { var a = aktivChip; aktivChip = null; if (a) setzeAktiv(a.hash.slice(1), true); });
    leiste2.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a) { sperre = Date.now() + 1000; setzeAktiv(a.hash.slice(1)); }
    });
    var start = location.hash.slice(1);
    var anfang = function () { if (chips[start]) { sperre = Date.now() + 800; setzeAktiv(start, true); } else berechne(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(anfang); else anfang();
    window.addEventListener("hashchange", function () { var id = location.hash.slice(1); if (chips[id]) { sperre = Date.now() + 1000; setzeAktiv(id); } });
  }

  // ---------------------------------------------------------------- Großansicht für Fotos (Galerie und Foto-Streifen)
  var links = alle("a[data-lightbox]");
  if (links.length && typeof HTMLDialogElement === "function") {
    var ic = function (n, c) { return '<svg' + (c ? ' class="' + c + '"' : "") + ' aria-hidden="true" focusable="false"><use href="assets/img/icons.svg#' + n + '"></use></svg>'; };
    var dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", "Bildansicht");
    dlg.innerHTML =
      '<p class="lb-zahl" aria-live="polite"></p>' +
      '<figure><img alt="" decoding="async"><figcaption></figcaption></figure>' +
      '<button class="rund lb-btn lb-zu" type="button" aria-label="Schließen">' + ic("i-close") + "</button>" +
      '<button class="rund lb-btn lb-zurueck" type="button" aria-label="Vorheriges Foto">' + ic("i-chevron", "links") + "</button>" +
      '<button class="rund lb-btn lb-vor" type="button" aria-label="Nächstes Foto">' + ic("i-chevron") + "</button>";
    document.body.appendChild(dlg);
    var lbImg = dlg.querySelector("img"), lbCap = dlg.querySelector("figcaption"), lbZahl = dlg.querySelector(".lb-zahl");
    var aktuell = 0;
    var zeige = function (i) {
      aktuell = (i + links.length) % links.length;
      var l = links[aktuell], vorschau = l.querySelector("img");
      var fig = l.closest("figure"), cap = fig && fig.querySelector("figcaption");
      var titelEl = l.querySelector(".streifen-titel");
      lbImg.src = l.href;
      lbImg.alt = vorschau ? vorschau.alt : "";
      lbCap.textContent = cap ? cap.textContent : titelEl ? titelEl.textContent : "";
      lbZahl.textContent = (aktuell + 1) + " / " + links.length;
      lbImg.classList.remove("neu"); void lbImg.offsetWidth; lbImg.classList.add("neu");
    };
    links.forEach(function (l, i) {
      l.addEventListener("click", function (e) { e.preventDefault(); zeige(i); dlg.showModal(); root.classList.add("lb-auf"); });
    });
    dlg.addEventListener("close", function () { root.classList.remove("lb-auf"); links[aktuell].focus(); });
    dlg.querySelector(".lb-zu").addEventListener("click", function () { dlg.close(); });
    dlg.querySelector(".lb-zurueck").addEventListener("click", function () { zeige(aktuell - 1); });
    dlg.querySelector(".lb-vor").addEventListener("click", function () { zeige(aktuell + 1); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.tagName === "FIGURE") dlg.close(); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") zeige(aktuell - 1);
      if (e.key === "ArrowRight") zeige(aktuell + 1);
    });
    var sx = null;
    dlg.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) zeige(aktuell + (dx < 0 ? 1 : -1));
      sx = null;
    }, { passive: true });
  }

  // ---------------------------------------------------------------- Prüfmodus für den Betreiber: Seite mit #pruefen aufrufen
  if (location.hash === "#pruefen") document.body.classList.add("pruefen-aktiv");
})();
