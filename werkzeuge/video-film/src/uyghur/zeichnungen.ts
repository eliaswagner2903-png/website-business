// Aus der Seite UYGHUR HAUS übernommen (index.html), erzeugt von aufnahme/uyghur-vorbereiten.py – nicht von Hand ändern.
export const WOK_SVG = `<svg class="wok-art" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
<defs>
<linearGradient id="wkG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2D27A"/><stop offset=".55" stop-color="#D9A441"/><stop offset="1" stop-color="#8A6420"/></linearGradient>
<linearGradient id="wkS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b3127"/><stop offset=".6" stop-color="#1a1510"/><stop offset="1" stop-color="#0b0907"/></linearGradient>
<linearGradient id="wkW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4a22"/><stop offset="1" stop-color="#2a1b0c"/></linearGradient>
<linearGradient id="wkA" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffb43a"/><stop offset=".45" stop-color="#f06a1c"/><stop offset="1" stop-color="#c2300f" stop-opacity=".7"/></linearGradient>
<linearGradient id="wkB" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffe08a"/><stop offset=".5" stop-color="#ff9a2a"/><stop offset="1" stop-color="#e2501a" stop-opacity=".8"/></linearGradient>
<linearGradient id="wkC" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff3c4"/><stop offset=".6" stop-color="#ffc24a"/><stop offset="1" stop-color="#ff8a1f" stop-opacity=".2"/></linearGradient>
<radialGradient id="wkL" cx="620" cy="660" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ff8a1f" stop-opacity=".36"/><stop offset=".45" stop-color="#c2410c" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="wkI" cx="620" cy="470" r="200" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3a2a16"/><stop offset="1" stop-color="#0a0806"/></radialGradient>
<radialGradient id="wkK"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ff8a1f" stop-opacity="0"/></radialGradient>
</defs>
<style>
.wg{fill:none;stroke:url(#wkG);stroke-linecap:round;stroke-linejoin:round}
.wgs{fill:url(#wkG)}
.wln{stroke:#D9A441;stroke-width:2;fill:none;stroke-linecap:round;opacity:.7}
.wok,.wfl,.wkt,.wgl,.wkg{transform-box:view-box}
.wpc,.wks,.wfi{transform-box:fill-box;transform-origin:center}
.wok{transform-origin:128px 418px}
.wfl,.wkt{transform-origin:620px 722px}
.wkt{transform-origin:742px 700px}
.wks{opacity:.8}
@media (prefers-reduced-motion:no-preference){
.wok,.wfi,.wfl,.wkt,.wgl,.wkg,.wks,.wpc,.wpg{animation:6s ease-in-out infinite both}
.wok{animation-name:wtoss;animation-timing-function:cubic-bezier(.45,0,.3,1)}
.wfi{animation-name:wslide}
.wfl1,.wfl2{animation-name:wbr}
.wfl3,.wfl4{animation-name:wbr2}
.wkt{animation-name:wkiss}
.wgl{animation-name:wglo}
.wkg{animation-name:wkgl}
.wks{animation-name:wspk}
.k2{animation-name:wspk2}.k3{animation-name:wspk3}.k4{animation-name:wspk4}
.wpc{animation-name:wair;animation-timing-function:linear}
.wpg{animation-name:wpg}
}
/* 0-10 rest | 10-16, 20-26 two pushes | 33-40 flick | 40-72 wave in the air | 74-100 rest */
@keyframes wtoss{0%,10%{transform:none}13.5%{transform:translate(27px,6.7px) rotate(1.2deg)}17%{transform:translate(-2px,0) rotate(-.2deg)}20%{transform:none}23.5%{transform:translate(28px,7px) rotate(1.3deg)}27%{transform:translate(-1px,0) rotate(-.1deg)}31%{transform:none}34.5%{transform:translate(14px,4px) rotate(1.6deg)}39.5%{transform:translate(-16px,-24px) rotate(-13deg)}47%{transform:translate(-12px,-18px) rotate(-10deg)}55%{transform:translate(0,2px) rotate(.5deg)}62%{transform:translate(-2px,-4px) rotate(-1.2deg)}68%{transform:translate(2px,3px) rotate(.6deg)}74%,100%{transform:none}}
@keyframes wslide{0%,13%{transform:none;opacity:1}17%,21%{transform:translate(7px,-1px)}24%{transform:translate(4px,0)}28%,33%{transform:translate(13px,-2px);opacity:1}38%{transform:translate(16px,-4px);opacity:.85}44%{opacity:.35}62%{transform:translate(4px,0);opacity:.4}76%{opacity:1}78%,100%{transform:none;opacity:1}}
@keyframes wbr{0%,100%{transform:scaleY(.94)}9%{transform:scaleY(.98) skewX(-1deg)}19%{transform:scaleY(.93) skewX(.8deg)}29%{transform:scaleY(.97)}37%{transform:scaleY(.95)}46%{transform:scaleY(1.12) skewX(-1.5deg)}56%{transform:scaleY(1.05) skewX(1deg)}66%{transform:scaleY(.97)}80%{transform:scaleY(.93) skewX(-.8deg)}90%{transform:scaleY(.97)}}
@keyframes wbr2{0%,100%{transform:scaleY(.92)}12%{transform:scaleY(.97) skewX(1deg)}24%{transform:scaleY(.91)}36%{transform:scaleY(.95) skewX(-1deg)}46%{transform:scaleY(1.08)}58%{transform:scaleY(.98) skewX(1deg)}72%{transform:scaleY(.95)}86%{transform:scaleY(.9) skewX(-.6deg)}}
@keyframes wkiss{0%,40%{transform:scaleY(.22)}48%{transform:scaleY(1)}53%{transform:scaleY(.96) skewX(1deg)}57%{transform:scaleY(1.01)}62%{transform:scaleY(.75)}70%,100%{transform:scaleY(.22)}}
@keyframes wglo{0%,38%,100%{opacity:.75}52%{opacity:1}68%{opacity:.8}}
@keyframes wkgl{0%,45%,100%{opacity:0}50%{opacity:1}57%{opacity:.85}63%{opacity:0}}
@keyframes wspk{0%,48%{transform:none;opacity:0}50%{opacity:1}60%,100%{transform:translate(-14px,-46px);opacity:0}}
@keyframes wspk2{0%,50%{transform:none;opacity:0}52%{opacity:1}62%,100%{transform:translate(18px,-38px);opacity:0}}
@keyframes wspk3{0%,53%{transform:none;opacity:0}55%{opacity:1}64%,100%{transform:translate(-30px,-26px);opacity:0}}
@keyframes wspk4{0%,55%{transform:none;opacity:0}57%{opacity:1}66%,100%{transform:translate(6px,-52px);opacity:0}}
@keyframes wair{0%,40%{transform:translate(0,0) rotate(0);opacity:0}42%{transform:translate(-24.7px,-50.4px) rotate(-15.5deg);opacity:1}44%{transform:translate(-49.5px,-87.9px) rotate(-30.9deg);opacity:1}46%{transform:translate(-74.2px,-112.4px) rotate(-46.4deg);opacity:1}48%{transform:translate(-98.9px,-124px) rotate(-61.8deg);opacity:1}50%{transform:translate(-123.6px,-122.6px) rotate(-77.3deg);opacity:1}52%{transform:translate(-148.4px,-108.2px) rotate(-92.7deg);opacity:1}54%{transform:translate(-173.1px,-80.9px) rotate(-108.2deg);opacity:1}56%{transform:translate(-197.8px,-40.6px) rotate(-123.6deg);opacity:1}58%{transform:translate(-222.5px,12.6px) rotate(-139.1deg);opacity:1}60%{transform:translate(-247.3px,78.8px) rotate(-154.5deg);opacity:0.6}62%{transform:translate(-272px,158px) rotate(-170deg);opacity:0}100%{transform:translate(0,0) rotate(0);opacity:0}}
@keyframes wpg{0%,46.2%,52.3%,100%{opacity:0}48.8%{opacity:.9}}
</style>

<rect width="1200" height="900" fill="#0d0c0b"/>
<rect class="wgl" width="1200" height="900" fill="url(#wkL)"/>

<!-- stove -->
<path d="M300 724H940L960 744H280Z" fill="#1d1812" stroke="url(#wkG)" stroke-width="3" stroke-linejoin="round"/>
<path d="M280 744H960L944 868H296Z" fill="url(#wkS)" stroke="url(#wkG)" stroke-width="3" stroke-linejoin="round"/>
<path class="wln" d="M304 766H936M314 846H926"/>
<g class="wg" stroke-width="3"><circle cx="382" cy="806" r="17"/><circle cx="858" cy="806" r="17"/></g>
<path class="wln" d="M382 806V792M858 806V792"/>
<!-- ikat diamond ornament, stove front -->
<g transform="translate(620 806)">
<path class="wg" stroke-width="2.5" d="M0-34L10-24L14-24L24-14L24-10L34 0L24 10L24 14L14 24L10 24L0 34L-10 24L-14 24L-24 14L-24 10L-34 0L-24-10L-24-14L-14-24L-10-24Z"/>
<path class="wgs" d="M0-18L18 0L0 18L-18 0Z"/>
<path d="M0-8L8 0L0 8L-8 0Z" fill="#0d0c0b"/>
<g class="wgs"><path d="M-74 0L-62-10L-50 0L-62 10Z"/><path d="M74 0L62-10L50 0L62 10Z"/><path d="M-118 0L-110-7L-102 0L-110 7Z"/><path d="M118 0L110-7L102 0L110 7Z"/></g>
<path class="wln" d="M-94 0H-84M84 0H94M-140 0H-128M128 0H140"/>
</g>
<!-- burner + grate -->
<path class="wg" stroke-width="5" d="M452 724L478 690M788 724L762 690M560 724L566 698M680 724L674 698"/>
<ellipse cx="620" cy="722" rx="96" ry="12" fill="#0b0907" stroke="url(#wkG)" stroke-width="3"/>
<path class="wln" d="M540 720H700" stroke-dasharray="2 9"/>

<!-- back flames -->
<g class="wfl wfl1"><path fill="url(#wkA)" d="M500 722C462 690 448 640 432 590C420 552 424 500 400 452C452 500 492 560 516 620C526 600 536 586 548 566C556 610 568 640 590 660H650C672 640 684 610 692 566C704 586 714 600 724 620C744 560 788 500 840 452C816 500 820 552 808 590C792 640 778 690 740 722Z"/></g>
<g class="wfl wfl2"><path fill="url(#wkB)" d="M526 722C500 696 486 656 474 616C466 590 468 560 452 528C500 560 540 620 542 646C550 630 558 618 568 602C574 636 590 656 606 668H634C650 656 666 636 672 602C682 618 690 630 698 646C708 610 740 560 788 528C772 560 774 590 766 616C754 656 740 696 714 722Z"/></g>


<!-- kissing flame tongue (rises behind the far rim) -->
<g class="wkt"><path fill="url(#wkA)" d="M716 700C722 600 647.2 367 673.2 181C727.2 317 800 560 770 700Z"/></g>

<!-- wok (pivots about the grip) -->
<g class="wok"><g transform="rotate(-3 128 418)">
<!-- handle -->
<path d="M410 482L320 460" stroke="url(#wkG)" stroke-width="14" stroke-linecap="round"/>
<path d="M410 482L320 460" stroke="#1a1510" stroke-width="8" stroke-linecap="round"/>
<path d="M330 462L110 408" stroke="url(#wkG)" stroke-width="30" stroke-linecap="round"/>
<path d="M330 462L110 408" stroke="url(#wkW)" stroke-width="24" stroke-linecap="round"/>
<path class="wln" d="M300 452L146 414" opacity=".45"/>
<path class="wg" stroke-width="3" d="M336 452L330 474M318 448L312 470"/>
<!-- gold cuff + gripping fingers -->
<path d="M-20 360L96 384L84 448L-20 428Z" fill="#14110d" stroke="url(#wkG)" stroke-width="3" stroke-linejoin="round"/>
<path d="M96 384L120 389L108 453L84 448Z" fill="#1d1812" stroke="url(#wkG)" stroke-width="3" stroke-linejoin="round"/>
<path class="wg" stroke-width="2" d="M100 398L112 409L98 420L110 431L96 442"/>
<path d="M120 396C142 392 168 398 182 406C190 412 188 424 178 426C186 432 184 444 172 446C178 452 172 462 160 460L126 452Z" fill="#14110d" stroke="url(#wkG)" stroke-width="3" stroke-linejoin="round"/>
<path class="wln" d="M136 412Q160 412 178 426M132 430Q154 432 172 446"/>
<!-- far ear -->
<path class="wg" stroke-width="5" d="M836 474C856 462 878 466 880 480C882 494 862 498 846 492"/>
<!-- bowl -->
<path d="M404 480C420 576 512 636 620 636C728 636 820 576 836 480Z" fill="url(#wkS)" stroke="url(#wkG)" stroke-width="4" stroke-linejoin="round"/>
<path class="wln" d="M448 534C488 594 552 622 624 624" opacity=".5"/>
<path class="wln" d="M470 512C520 570 580 590 640 592" opacity=".25"/>
<!-- food in wok + rim -->
<ellipse cx="620" cy="480" rx="216" ry="28" fill="url(#wkI)" stroke="url(#wkG)" stroke-width="4"/>
<g class="wfi">
<path d="M480 484Q506 462 540 474Q566 456 600 470Q630 454 662 468Q694 456 724 470Q752 462 770 484Q700 500 620 500Q540 500 480 484Z" fill="#a8380f" opacity=".7"/>
<path class="wg" stroke-width="3.5" d="M494 482Q524 458 556 474M572 472Q606 448 640 468M652 470Q690 450 726 468M700 478Q736 462 760 482"/>
<path d="M590 470Q608 460 626 468" stroke="#5f7a2c" stroke-width="8" stroke-linecap="round" fill="none"/>
<path d="M684 470Q700 462 716 470" stroke="#c2300f" stroke-width="8" stroke-linecap="round" fill="none"/>
</g>
<!-- small ikat diamonds on the rim -->
<g class="wgs"><path d="M620 500L628 508L620 516L612 508Z"/><path d="M520 494L526 500L520 506L514 500Z"/><path d="M720 494L726 500L720 506L714 500Z"/></g>
</g>

</g>
<!-- front flames -->
<g class="wfl wfl3"><path fill="url(#wkA)" opacity=".95" d="M520 722C514 694 536 684 530 656C550 672 562 666 572 640C582 666 600 672 620 636C640 672 658 666 668 640C678 666 690 672 710 656C704 684 726 694 720 722Z"/></g>
<g class="wfl wfl4"><path fill="url(#wkC)" d="M552 722C552 702 570 696 570 678C584 688 594 682 600 664C608 684 614 684 620 660C626 684 632 684 640 664C646 682 656 688 670 678C670 696 688 702 688 722Z"/></g>

<!-- touch point: brief glow + sparks -->
<circle class="wkg" cx="687.2" cy="173" r="90" fill="url(#wkK)"/>
<g fill="#ffc24a"><circle class="wks k1" cx="687.2" cy="175" r="3"/><circle class="wks k2" cx="691.2" cy="171" r="2.5"/><circle class="wks k3" cx="683.2" cy="173" r="2"/><circle class="wks k4" cx="689.2" cy="177" r="2.5"/></g>
<!-- food wave (one ribbon on one arc; the delay spaces it like a wave) -->
<g class="wwv">
<g transform="translate(796 292)"><g class="wpc" style="transform:translate(-197.8px,-40.6px) rotate(-123.6deg);animation-delay:0s"><g transform="scale(1.6)"><path d="M-14 4C-10-12 10-12 12 0C13 10 0 12-3 4" fill="none" stroke="#F2D27A" stroke-width="5" stroke-linecap="round"/><path class="wpg" style="animation-delay:0s" d="M-12 0Q0-8 12 0" fill="none" stroke="#ffe08a" stroke-width="3" stroke-linecap="round" opacity="0"/></g></g></g>
<g transform="translate(796 292)"><g class="wpc" style="transform:translate(-175.6px,-77.4px) rotate(-109.7deg);animation-delay:0.1s"><g transform="scale(1.6)"><path d="M-18 6Q0-12 18 0" fill="none" stroke="#c2300f" stroke-width="10" stroke-linecap="round"/><path class="wpg" style="animation-delay:0.1s" d="M-12 0Q0-8 12 0" fill="none" stroke="#ffe08a" stroke-width="3" stroke-linecap="round" opacity="0"/></g></g></g>
<g transform="translate(796 292)"><g class="wpc" style="transform:translate(-153.3px,-103.8px) rotate(-95.8deg);animation-delay:0.2s"><g transform="scale(1.6)"><path d="M-16 0C-12-14 6-14 8-2C9 8-2 9-4 3M10 0C14 10 22 8 24 2" fill="none" stroke="#F2D27A" stroke-width="5" stroke-linecap="round"/><path class="wpg" style="animation-delay:0.2s" d="M-12 0Q0-8 12 0" fill="none" stroke="#ffe08a" stroke-width="3" stroke-linecap="round" opacity="0"/></g></g></g>
<g transform="translate(796 292)"><g class="wpc" style="transform:translate(-131.1px,-119.6px) rotate(-81.9deg);animation-delay:0.3s"><g transform="scale(1.6)"><path d="M-18 4Q0-10 18 4" fill="none" stroke="#5f7a2c" stroke-width="10" stroke-linecap="round"/><path class="wpg" style="animation-delay:0.3s" d="M-12 0Q0-8 12 0" fill="none" stroke="#ffe08a" stroke-width="3" stroke-linecap="round" opacity="0"/></g></g></g>
<g transform="translate(796 292)"><g class="wpc" style="transform:translate(-108.8px,-125px) rotate(-68deg);animation-delay:0.4s"><g transform="scale(1.6)"><path d="M-10 8C-18-6-4-16 6-10C14-4 8 8 0 6" fill="none" stroke="#D9A441" stroke-width="5" stroke-linecap="round"/><path class="wpg" style="animation-delay:0.4s" d="M-12 0Q0-8 12 0" fill="none" stroke="#ffe08a" stroke-width="3" stroke-linecap="round" opacity="0"/></g></g></g>
<g transform="translate(796 292)"><g class="wpc" style="transform:translate(-86.5px,-119.8px) rotate(-54.1deg);animation-delay:0.5s"><g transform="scale(1.6)"><path d="M-15 4Q0-8 15 2" fill="none" stroke="#e2501a" stroke-width="9" stroke-linecap="round"/><path class="wpg" style="animation-delay:0.5s" d="M-12 0Q0-8 12 0" fill="none" stroke="#ffe08a" stroke-width="3" stroke-linecap="round" opacity="0"/></g></g></g>
<g transform="translate(796 292)"><g class="wpc" style="transform:translate(-64.3px,-104.2px) rotate(-40.2deg);animation-delay:0.6s"><g transform="scale(1.6)"><path d="M-14 2C-8-12 10-10 10 2C10 10 0 10-2 4" fill="none" stroke="#F2D27A" stroke-width="5" stroke-linecap="round"/><path class="wpg" style="animation-delay:0.6s" d="M-12 0Q0-8 12 0" fill="none" stroke="#ffe08a" stroke-width="3" stroke-linecap="round" opacity="0"/></g></g></g>
<g transform="translate(796 292)"><g class="wpc" style="transform:translate(-42px,-78px) rotate(-26.3deg);animation-delay:0.8s"><g transform="scale(1.6)"><path d="M-16 6Q0-10 16 2" fill="none" stroke="#5f7a2c" stroke-width="9" stroke-linecap="round"/><path class="wpg" style="animation-delay:0.8s" d="M-12 0Q0-8 12 0" fill="none" stroke="#ffe08a" stroke-width="3" stroke-linecap="round" opacity="0"/></g></g></g>
</g>
</svg>`;
/** Monogramm „U“ (viewBox 0 0 120 136) */
export const MONOGRAMM = `<path fill="currentColor" d="M4 10H48V14C41 14 38 16 38 23V82C38 106 50 118 66 118C83 118 94 106 94 84V23C94 16 90 14 84 14V10H116V14C109 14 102 16 102 23V84C102 112 86 126 64 126C36 126 16 112 16 84V23C16 16 12 14 4 14Z"/>
<g fill="currentColor">
<path d="M66 110C55 96 54 72 66 48C78 72 77 96 66 110Z"/>
<path d="M65 101C54 100 45 90 46 76C52 86 58 92 65 96Z"/>
<path d="M67 101C78 100 87 90 86 76C80 86 74 92 67 96Z"/>
<path d="M66 32L71 39L66 46L61 39Z"/>
</g>
<path d="M66 56V104" stroke="#0d0c0b" stroke-width="1.4" stroke-linecap="round"/>
<path d="M2 132H118" stroke="currentColor" stroke-width="1"/>`;
/** Trenner mit Raute (viewBox 0 0 400 24) */
export const RAUTE = `<g stroke="currentColor" stroke-linecap="round" fill="none">
<path d="M8 12H164M236 12H392" stroke-width="1"/>
<path d="M200 1L215 12L200 23L185 12Z" stroke-width="1.4"/>
</g>
<g fill="currentColor">
<path d="M200 6L208 12L200 18L192 12Z"/>
<path d="M174 8L179 12L174 16L169 12ZM226 8L231 12L226 16L221 12Z"/>
<circle cx="4" cy="12" r="2"/><circle cx="396" cy="12" r="2"/>
</g>`;
