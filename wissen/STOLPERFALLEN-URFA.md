## Known pitfalls (they have already happened, please avoid)

1. **Network:** The old website `urfasofrasi-eislingen.de` as well as Unsplash, Pexels, Wikimedia, archive.org and jsdelivr are blocked in this environment.
   - npm (`registry.npmjs.org`) and PyPI work.
   - So request references as screenshots or files from the client.
2. **The PDF text layer of the menu is faulty:** The allergen letters are read out as „=“, „E“ or spaces. Never take the labels from the PDF text, but from `speisekarte.htm` (visually checked).
3. **Old website vs. PDF:** The numbering differs (Lahmacun 49/50, Pizzen 51–59). **The PDF is authoritative.**
4. **CSS shorthand:** `.section { padding: 64px 0 }` overrode the side padding of `.wrap` on the same element. Therefore use `padding-block`.
5. **Anchors below fixed bars:** `scroll-padding-top` (on `html`) and `scroll-margin-top` (on the target) **add up**. Always re-measure the position afterwards.
6. **`text-transform: uppercase`** turns „Süßspeisen“ into „SÜSSSPEISEN“. Do not set German headings with ß in capitals via CSS.
7. **SVG comments must not contain `--`.** Otherwise the SVG is invalid and is silently ignored as a CSS mask. Check SVGs with an XML parser after writing.
8. **Always test via a local HTTP server** (`python3 -m http.server`), not via `file://`: masks, SVG sprites and fonts otherwise fail.
9. **Full-page screenshots show lazily loaded images empty.** Scroll through the page beforehand, otherwise false findings arise.
10. **Fade-in animations:**
    - Remove the classes again after fading in, otherwise their higher specificity blocks the hover transforms.
    - Do not hide elements that are already in view on load.
11. **Mobile menu:** Only show/hide it via JS if it is reachable without JS anyway (set class `js` early in `<head>`).
12. **Specificity of `.js` rules:** New `.js …` rules can override desktop rules (that is how the frame around the phone number was once lost). After CSS changes look at desktop and mobile.
13. **Colour blocks:** The client does not want contrasting background colours between sections.
14. **Never load the LCP image lazily:** On the phone a photo in the hero was the largest element, but `loading="lazy"` → performance 87. Look up the LCP element in Lighthouse (`lcp-breakdown-insight`).
15. **Layout thrashing:** In the script first read all positions (`getBoundingClientRect`), then write classes/styles.
16. **`<figure>` has a 40 px default margin** left and right; always set `margin: 0`.
17. **`clip-path` animations with `fill-mode: both`** also cut off `outline`; use `backwards`.
18. **Lighthouse locally without compression** is too pessimistic; additionally measure with a gzip server (the web space compresses via `.htaccess`).
