/* Eldaria – style: panele, karty, paski, okna, toast */
css`
/* --- panele --- */
.pnl,.card,.herohead,.panel,.howto,.perkrow,.attr,.item,.statgrid div,.log{border:10px solid transparent;border-image:var(--fr-panel) 10/10px stretch;background:var(--tx-wood) 0 0/320px 320px;background-clip:padding-box}
.card{padding:0 2px;margin-bottom:6px;display:flex;gap:8px;align-items:center;position:relative}
.card .av{width:64px;height:64px;flex-shrink:0;overflow:hidden;box-shadow:0 0 0 2px #140d12,inset 0 -10px 0 #0003}
/* nagrobek poległego zamiast portretu (graveImg w js/ui/camp.js) */
.card .av.gravav{display:flex;align-items:flex-end;justify-content:center;background:linear-gradient(#1a1a2a,#2a2a24 70%,#3a3424);padding-bottom:2px}
.card .av.gravav img{image-rendering:pixelated;filter:drop-shadow(0 2px 0 #0008)}
.bust{overflow:hidden;position:relative;flex-shrink:0}
.bust img{position:absolute;left:50%;transform:translateX(-50%)}
.card .info{flex:1;min-width:0}
.nm{font-weight:600;color:#fff3d6;text-shadow:1px 1px 0 #000}
.sub{font-size:.84rem;color:var(--dim)}
.stats{display:flex;flex-wrap:wrap;gap:2px 4px;font-size:.86rem;margin-top:3px}
.bar{height:10px;background:#2a1216;margin-top:4px;position:relative;box-shadow:0 0 0 2px #140d12,inset 0 2px 0 #0008}
.bar>i{position:absolute;left:0;top:0;bottom:0;display:block;background:linear-gradient(#b8ff9a 0 2px,#4fcf5a 2px 6px,#2e8a3a 6px);transition:width calc(.25s * var(--sp))}
.bar>i.lag{background:#fff2b0;transition:width calc(.6s * var(--sp)) calc(.35s * var(--sp))}
.bar.low>i:not(.lag){background:linear-gradient(#ffb09a 0 2px,#e0482e 2px 6px,#9a2a1e 6px)}
.bar.xp{height:6px}.bar.xp>i{background:linear-gradient(#bfe0ff 0 2px,#5a8ae0 2px)}
.actions{display:flex;flex-direction:column;gap:4px}
.c-wojownik{background:linear-gradient(#8a4a32,#4a2418)}.c-lucznik{background:linear-gradient(#4a7a3a,#24401e)}.c-mag{background:linear-gradient(#3e5aa0,#1e2a52)}.c-kaplan{background:linear-gradient(#a08a3a,#4e4018)}.c-lotr{background:linear-gradient(#5a4270,#2a1e38)}.c-paladyn{background:linear-gradient(#8a8aa8,#3a3a5a)}.c-druid{background:linear-gradient(#5a7a34,#2a3a18)}.c-czarnoksieznik{background:linear-gradient(#4a2a4a,#1a0e1e)}.c-bard{background:linear-gradient(#a0503a,#4a2018)}
.bottom{position:sticky;bottom:0;padding:10px 0 4px;background:linear-gradient(#0000,#140d12ee 30%);display:flex;flex-direction:column;gap:8px;margin-top:auto;z-index:5}
.row{display:flex;gap:8px}.row>*{flex:1}
.empty{color:var(--dim);text-align:center;padding:16px;font-style:italic}
.hidden{display:none!important}
.badge{display:inline-block;background:var(--gold);color:#2a1408;padding:0 5px;font-size:.74rem;font-weight:600;margin-left:4px;box-shadow:0 0 0 2px #140d12;animation:badgeA 1.6s steps(2) infinite}
@keyframes badgeA{50%{background:#fff2b0}}
.note{font-size:.84rem;background:#3a1a1a;box-shadow:0 0 0 2px #140d12,inset 3px 0 0 #ff8a6a;padding:6px 8px 6px 12px;margin:8px 2px}
#modal{position:fixed;inset:0;background:#0a0608c8;display:flex;align-items:center;justify-content:center;z-index:50;padding:14px;animation:fadeIn calc(.2s * var(--sp))}
@keyframes fadeIn{from{opacity:0}}
#modal .box{border:12px solid transparent;border-image:var(--fr-parch) 10/10px stretch;background:var(--tx-parch) 0 0/320px 320px;background-clip:padding-box;color:#3a2414;padding:4px 8px;max-width:460px;width:100%;max-height:calc(86*var(--vh));overflow:auto;animation:popIn calc(.32s * var(--sp)) cubic-bezier(.2,1.4,.5,1)}
@keyframes popIn{from{transform:scale(.7);opacity:0}}
#modal .box h1,#modal .box h2{color:#7a3a10;text-shadow:1px 1px 0 #fff4d0}
#modal .box .sub{color:#6a5038}
#modal .box button{color:var(--ink)}
#modal .box .btn-main,#modal .box .btn-gold{color:#2a1408}
#modal .box .nm{color:#3a2414;text-shadow:none}
.skill-line{display:flex;gap:8px;padding:6px 0;border-bottom:2px dashed #0002;font-size:.9rem;align-items:flex-start}
.skill-line.locked{opacity:.45}
.toast{position:fixed;left:50%;bottom:96px;transform:translateX(-50%);border:8px solid transparent;border-image:var(--fr-slot) 8 fill/8px;padding:4px 10px;z-index:60;animation:toastA 2.1s forwards;text-align:center;pointer-events:none;max-width:calc(90*var(--vw));text-shadow:1px 1px 0 #000}
@keyframes toastA{0%{opacity:0;transform:translate(-50%,10px)}10%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}

/* przenoszenie zapisu (js/game/transfer.js) */
.xfer h3{margin:12px 0 4px;font-size:1rem;display:flex;align-items:center;gap:6px}
.xfer .row{flex-wrap:wrap;gap:6px}.xfer .row button{flex:1 1 auto}
.xfi{font-size:.84rem;background:#0002;box-shadow:0 0 0 2px #0002;padding:6px 8px;margin:4px 2px}
.xfta{display:block;width:100%;box-sizing:border-box;height:110px;margin:6px 0;padding:6px;font:inherit;font-size:.68rem;line-height:1.25;word-break:break-all;resize:vertical;background:#1a1216;color:#efe2c4;border:2px solid #6a4a30}
@media (max-height:440px){.xfta{height:70px}.xfer h3{margin:6px 0 2px}}
/* wąskie menu tytułowe: przycisk zapisu bez napisu */
@media (max-width:760px){.tmenu .row button{min-width:0}.tmenu .xfb{flex:0 0 auto;padding-left:10px;padding-right:10px}.tmenu .xfb .lbl{display:none}.tmenu .sndb{padding-left:10px!important;padding-right:10px!important}}
`;
