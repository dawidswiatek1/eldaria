/* Eldaria – style: walka: scena, jednostki, efekty, log */
css`
/* --- walka --- */
.bt{display:flex;flex-direction:column;flex:1;gap:5px;padding-bottom:6px}
.bt .top{padding:6px 0 2px}
.order{display:flex;gap:4px;overflow-x:auto;overflow-y:hidden;padding:3px 2px;min-height:36px;align-items:center;scrollbar-width:none}
.order img{width:30px;height:30px;object-fit:contain;object-position:50% 0;background:#2a2036;box-shadow:0 0 0 2px #140d12;flex-shrink:0;transition:transform .2s}
.order img.e{background:#4a1f25}
.order img.act{box-shadow:0 0 0 2px #140d12,0 0 0 4px var(--gold);transform:translateY(-2px)}
.scene{position:relative;overflow:hidden;flex-shrink:0;box-shadow:0 0 0 2px #140d12,0 0 0 5px #6a4a30,0 0 0 7px #140d12;margin:4px 4px 6px;--tw:512px}
.scene .ly{position:absolute;inset:0 -16px;background-repeat:repeat-x;background-size:auto 100%;background-position:0 0;pointer-events:none;image-rendering:pixelated}
.ly-far{animation:swayA calc(11s) ease-in-out infinite alternate}
.ly-mid{animation:swayB calc(8s) ease-in-out infinite alternate}
.ly-cl{animation:drift 60s linear infinite}
@keyframes swayA{from{transform:translateX(-3px)}to{transform:translateX(3px)}}
@keyframes swayB{from{transform:translateX(-7px)}to{transform:translateX(7px)}}
@keyframes drift{to{background-position-x:calc(-1 * var(--tw))}}
.amb{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1}
.amb i{position:absolute;width:3px;height:3px;animation-iteration-count:infinite;animation-timing-function:linear}
.amb.firefly i{background:#fff6a0;box-shadow:0 0 4px 1px #ffe24a;animation-name:ffA;animation-duration:6s}
.amb.dust i{background:#e8c890aa;animation-name:dustA;animation-duration:7s}
.amb.wisp i{background:#bff4ff;box-shadow:0 0 6px 2px #7fe0ff88;animation-name:ffA;animation-duration:8s}
.amb.snow i{background:#fff;animation-name:snowA;animation-duration:6s}
.amb.ember i{background:#ffb040;box-shadow:0 0 4px #ff7a1a;animation-name:emberA;animation-duration:5s}
@keyframes ffA{0%{transform:translate(0,0);opacity:0}20%{opacity:1}50%{transform:translate(14px,-16px)}80%{opacity:1}100%{transform:translate(-6px,-30px);opacity:0}}
@keyframes dustA{0%{transform:translate(0,0);opacity:0}20%{opacity:1}100%{transform:translate(60px,-10px);opacity:0}}
@keyframes snowA{0%{transform:translate(0,-20px);opacity:0}15%{opacity:1}100%{transform:translate(-20px,120px);opacity:0}}
@keyframes emberA{0%{transform:translate(0,0);opacity:0}15%{opacity:1}100%{transform:translate(10px,-110px);opacity:0}}
.sndbox{display:flex;flex-direction:column;gap:10px;margin:8px 0 12px;min-width:min(420px,calc(80*var(--vw)))}.sndr{display:grid;grid-template-columns:9.5em 1fr 3em;align-items:center;gap:10px;font-size:.85rem}.sndr b{text-align:right;color:#6a3a14}.sndr input{width:100%;accent-color:#e8a23a;height:22px}
.unit{position:absolute;text-align:center;z-index:2}
.unit .mv{position:relative;margin:0 auto}
.unit .shadow{position:absolute;left:10%;right:10%;bottom:-3px;height:9px;background:radial-gradient(closest-side,#000a,#0006 60%,#0000);border-radius:50%}
.unit.fly .shadow{bottom:-10px;left:28%;right:28%;opacity:.6}
.unit .fxw{position:absolute;inset:0}
.spr{position:absolute;background-repeat:no-repeat;image-rendering:pixelated;animation:idle calc(1.3s * var(--sp)) infinite steps(1)}
@keyframes idle{0%{background-position-x:0}50%{background-position-x:calc(var(--fw) * -1)}}
.spr[data-f]{animation:none}
.spr[data-f="1"]{background-position-x:calc(var(--fw) * -1)}.spr[data-f="2"]{background-position-x:calc(var(--fw) * -2)}.spr[data-f="3"]{background-position-x:calc(var(--fw) * -3)}.spr[data-f="4"]{background-position-x:calc(var(--fw) * -4)}.spr[data-f="5"]{background-position-x:calc(var(--fw) * -5)}.spr[data-f="6"]{background-position-x:calc(var(--fw) * -6)}
.unit .un{font-size:.68rem;margin-top:1px;font-weight:600;text-shadow:1px 1px 0 #000,-1px 0 0 #000,0 -1px 0 #000,1px 0 0 #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.1}
.unit .bar{height:6px;width:78%;margin:2px auto 0;box-shadow:0 0 0 1px #140d12}
.unit .bar>i{background:linear-gradient(#b8ff9a 0 1px,#4fcf5a 1px 4px,#2e8a3a 4px)}
.unit.e .bar>i:not(.lag){background:linear-gradient(#ffc09a 0 1px,#e0482e 1px 4px,#9a2a1e 4px)}
.unit .hpt{font-size:.6rem;font-weight:400;opacity:.85;line-height:1;margin-top:1px;text-shadow:1px 1px 0 #000}
.unit .sts{position:absolute;top:-2px;left:0;right:0;line-height:1;z-index:4;pointer-events:none;display:flex;justify-content:center;gap:1px;font-size:.6rem;text-shadow:1px 1px 0 #000}
.unit .sts span{display:inline-flex;align-items:center}
.unit.active .spr{filter:drop-shadow(0 0 2px #ffe38a) drop-shadow(0 0 4px #ffe38a88)}
.unit.active .mv::before{content:'';position:absolute;top:-14px;left:50%;width:10px;height:8px;margin-left:-5px;background:var(--gold);clip-path:polygon(0 0,100% 0,50% 100%);z-index:5;animation:arrowA .6s steps(2) infinite;filter:drop-shadow(0 1px 0 #000)}
@keyframes arrowA{50%{transform:translateY(3px)}}
.unit.target .shadow{background:radial-gradient(#ff5a3a,#ff5a3a55 60%,transparent 72%);animation:pulse 1s infinite;height:14px;bottom:-5px}
.unit.target.h .shadow{background:radial-gradient(#5fe08a,#5fe08a55 60%,transparent 72%)}
.unit.target .spr{filter:drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff)}
.unit.dead .mv{filter:grayscale(.8) brightness(.7);opacity:.6;transition:opacity 1s,filter 1s}
.unit.e.dead .mv{animation:vanish calc(1.2s * var(--sp)) forwards}
@keyframes vanish{0%{opacity:1}60%{opacity:.8;transform:translateY(2px)}100%{opacity:0;transform:translateY(6px)}}
.unit.dead .bar,.unit.dead .sts,.unit.dead .hpt{opacity:.25}
.unit.summon .mv{animation:summonA calc(.7s * var(--sp)) ease-out}
@keyframes summonA{from{opacity:0;transform:translateY(-10px) scale(.6)}}
.fxw.hit{animation:hitA calc(.32s * var(--sp))}
@keyframes hitA{0%,30%{filter:brightness(3) saturate(0)}100%{filter:none}}
@keyframes qpulse{50%{opacity:.4}}
.proj{position:absolute;z-index:6;pointer-events:none}
.p-fire{width:16px;height:16px;background:radial-gradient(#fff6a0 30%,#ff8a2a 31% 60%,#d0301a 61%);box-shadow:0 0 12px 4px #ff6a2a88;clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)}
.p-ice{width:24px;height:8px;background:linear-gradient(90deg,#7fe0ff00,#bff4ff 50%,#fff);clip-path:polygon(0 50%,70% 0,100% 50%,70% 100%);filter:drop-shadow(0 0 4px #7fe0ff)}
.p-magic,.p-dark{width:12px;height:12px;background:radial-gradient(#fff 30%,#c58aff 31% 65%,#7a3ad0 66%);box-shadow:0 0 10px 3px #c58aff88;clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)}
.p-dark{background:radial-gradient(#f4e0ff 25%,#8a3ad0 26% 65%,#2a1040 66%);box-shadow:0 0 10px 3px #7a3ad088}
.p-holy{width:12px;height:12px;background:radial-gradient(#fff 30%,#ffe36a 31% 65%,#c0a020 66%);box-shadow:0 0 12px 4px #ffe36a88}
.p-web{width:16px;height:16px;background:repeating-radial-gradient(#fff 0 1px,#0000 2px 4px);box-shadow:0 0 4px #fff}
.p-arrow{width:36px;height:7px}
.trail{position:absolute;width:4px;height:4px;z-index:5;pointer-events:none;animation:trailA calc(.35s * var(--sp)) forwards}
@keyframes trailA{to{opacity:0;transform:translate(-50%,-50%) scale(.2)}}
.vfx{position:absolute;z-index:7;pointer-events:none;background-repeat:no-repeat;image-rendering:pixelated;transform:translate(-50%,-50%)}
.pt{position:absolute;z-index:7;pointer-events:none;width:4px;height:4px;animation:ptA calc(var(--d,.6s) * var(--sp)) ease-out forwards}
@keyframes ptA{0%{transform:translate(-50%,-50%);opacity:1}100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy)));opacity:0}}
.glow{position:absolute;z-index:1;pointer-events:none;transform:translate(-50%,-50%);border-radius:50%;animation:glowP calc(.7s * var(--sp)) ease-out forwards}
@keyframes glowP{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}30%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.3)}}
.pillar{position:absolute;z-index:6;pointer-events:none;width:46px;transform:translateX(-50%);animation:pillarA calc(.8s * var(--sp)) ease-out forwards}
@keyframes pillarA{0%{opacity:0;transform:translateX(-50%) scaleX(.2)}30%{opacity:1}100%{opacity:0;transform:translateX(-50%) scaleX(1)}}
.ring{position:absolute;z-index:1;pointer-events:none;width:80px;height:22px;border:3px solid #7fc8ff;border-radius:50%;transform:translate(-50%,-50%);animation:ringA calc(.8s * var(--sp)) forwards}
@keyframes ringA{0%{opacity:1;transform:translate(-50%,-50%) scale(.4)}100%{opacity:0;transform:translate(-50%,-120%) scale(1.3)}}
.float{position:absolute;z-index:9;font-weight:600;font-size:1.3rem;pointer-events:none;animation:floatA calc(1s * var(--sp)) forwards;white-space:nowrap;transform:translate(-50%,0);text-shadow:2px 0 0 #140d12,-2px 0 0 #140d12,0 2px 0 #140d12,0 -2px 0 #140d12,2px 2px 0 #140d12,-2px -2px 0 #140d12,2px -2px 0 #140d12,-2px 2px 0 #140d12}
.float.dmg{color:#ff7a5a}.float.crit{color:#ffe24a;font-size:1.75rem}.float.heal{color:#7dff8a}.float.miss{color:#e0e0e0;font-size:1rem}.float.info{color:#9fd8ff;font-size:.95rem}.float.gold{color:var(--gold);font-size:1rem}
@keyframes floatA{0%{opacity:0;transform:translate(-50%,4px) scale(1.8)}12%{opacity:1;transform:translate(-50%,-4px) scale(.9)}22%{transform:translate(-50%,-8px) scale(1.05)}75%{opacity:1}100%{opacity:0;transform:translate(-50%,-44px) scale(1)}}
.float.crit::before{content:'KRYT! ';font-size:.8rem;color:#fff}
.log{padding:0 4px;font-size:.78rem;height:62px;overflow-y:auto;line-height:1.3;background:#120c14;border-image-source:var(--fr-slot);border-width:6px;border-image-width:6px;border-image-slice:8 fill}
.log div{border-bottom:1px dashed #ffffff10}
.log .g{color:#7fe07a}.log .r{color:#ff8a6a}.log .y{color:var(--gold)}
.panel{padding:0 2px}
.panel .who{font-weight:600;margin-bottom:6px;display:flex;gap:8px;align-items:center}
.panel .who .bust{background:#ffffff14;box-shadow:0 0 0 2px #140d12}
.skills{display:grid;grid-template-columns:1fr 1fr;gap:4px}
.skills button{justify-content:flex-start;text-align:left;font-size:.88rem;position:relative;padding:2px 4px;min-height:48px}
.skills button.sel{border-image-source:var(--fr-on);color:#fff6d8}
.skills button .si{width:28px;height:28px;flex-shrink:0}
.skills button .cd{position:absolute;right:0;top:-2px;background:#140d12;color:var(--gold);padding:0 4px;font-size:.78rem}
.hint{font-size:.82rem;color:#e0d0b0;margin-top:6px;min-height:2.3em}
`;
