/* Eldaria – style: korytarz wyprawy i wydarzenia */
css`
/* --- korytarz wyprawy --- */
.expv{position:absolute;inset:0}
.xscene{position:absolute;inset:0;margin:0;box-shadow:none}
.xscene .ly-far,.xscene .ly-mid,.xscene .ly-gr{right:auto;width:calc(100% + var(--tw) + 32px);animation:scrollT var(--d,6s) linear infinite;animation-play-state:paused;will-change:transform}
.xscene .ly-far{--d:80s}.xscene .ly-mid{--d:26s}.xscene .ly-gr{--d:7.5s}
@keyframes scrollT{from{transform:translateX(0)}to{transform:translateX(calc(-1 * var(--tw)))}}
.xscene.walking .ly-far,.xscene.walking .ly-mid,.xscene.walking .ly-gr{animation-play-state:running}
@keyframes scrollX{from{background-position-x:0}to{background-position-x:calc(-1 * var(--tw))}}
#xparty .wk{position:absolute}
#xparty .wk .spr{animation-duration:calc(1.3s * var(--sp))}
.xscene.walking #xparty .wk{animation:bobW .34s steps(2) infinite}
.xscene.walking #xparty .wk .spr{animation-duration:.34s}
@keyframes bobW{50%{transform:translateY(-3px)}}
#xparty .shadow{position:absolute;left:18%;right:18%;bottom:-3px;height:7px;background:#0006;border-radius:50%}
#xprop img{position:absolute;z-index:2;filter:drop-shadow(0 3px 0 #0005)}
.xalert{position:absolute;z-index:2;display:flex;flex-direction:column;align-items:center;transform:translateX(-50%);animation:arrowA .7s steps(2) infinite}
.xalert b{font-size:2rem;color:#ff5a3a;text-shadow:2px 2px 0 #000;line-height:1}
.xtop{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:4px;padding:4px max(6px,env(safe-area-inset-right)) 10px max(6px,env(safe-area-inset-left));background:linear-gradient(#140d12d8,#140d1288 70%,#0000);z-index:10}
.xtop .pill{min-height:34px;border-width:6px;border-image-width:6px;font-size:.84rem;white-space:nowrap;padding:0 4px}
.xtop .pill>span{display:flex;flex-direction:column;line-height:1.05}.xtop .pill small{font-size:.64rem;color:var(--dim);font-weight:400}
.xtop .btn-small{min-height:34px;border-width:6px;border-image-width:6px;padding:0 6px;font-size:.8rem;white-space:nowrap}
/* mała mapa wyprawy na górnym pasku (dotknięcie otwiera dużą mapę) */
.mm{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;padding:0 4px;min-height:34px}
.mm svg{height:30px;width:auto;max-width:calc(100% - 40px);overflow:visible;filter:drop-shadow(1px 1px 0 #000)}
.mm line{stroke:#6a5860;stroke-width:1.6}.mm line.on{stroke:var(--gold);stroke-width:2.2}
.mm circle{fill:#3a3044;stroke:#140d12;stroke-width:1}
.mm .t-fight{fill:#d86a40}.mm .t-elite{fill:#ff3a4a}.mm .t-boss{fill:#c070ff}.mm .t-chest{fill:#f0c050}.mm .t-event{fill:#5ab0f0}.mm .t-camp{fill:#6ad070}
.mm .done{opacity:.45}.mm .past{opacity:.3}.mm .cur{stroke:#fff6c8;stroke-width:2;opacity:1}.mm .lit{stroke:#ffb040;stroke-width:1.6}
.mm .nx{stroke:var(--gold);stroke-width:1.8;animation:mmA 1s steps(2) infinite}
@keyframes mmA{50%{stroke:#fff}}
.mm b{font-size:.8rem;color:var(--gold);text-shadow:1px 1px 0 #000;white-space:nowrap}
.mm:hover svg,.mm:focus-visible svg{filter:drop-shadow(1px 1px 0 #000) brightness(1.25)}
.xbot{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:flex-end;gap:6px;padding:0 max(6px,env(safe-area-inset-right)) max(5px,env(safe-area-inset-bottom)) max(6px,env(safe-area-inset-left));z-index:10}
.xps{flex:1;min-width:0;display:flex;gap:3px;align-items:flex-end;background:#140d12c0;padding:3px;box-shadow:0 0 0 2px #00000060}
.xpc{flex:1 1 0;min-width:0;display:flex;gap:3px;align-items:center;background:#2a2036;box-shadow:0 0 0 1px #000;padding:2px;cursor:pointer;position:relative;height:38px}
.xpc.f{box-shadow:0 0 0 1px #ff8a5a99}.xpc.empty{background:#0004;cursor:default}
.xpc>span{flex:1;min-width:0;display:flex;flex-direction:column;font-size:.62rem;line-height:1.1}.xpc b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.xpc .bar{height:5px;margin-top:2px;width:100%}.xb{position:absolute;right:1px;top:-4px;font-style:normal;background:var(--gold);color:#2a1408;font-size:.6rem;padding:0 3px;font-weight:600}
.xps .btn-small{min-height:38px;border-width:6px;border-image-width:6px;padding:0 6px;font-size:.78rem;flex-shrink:0}
.xbot .btn-main{width:auto;flex:0 0 auto;min-height:52px;padding:0 16px;font-size:1.05rem}
.xbot .btn-main.go{animation:goA 1.4s ease-in-out infinite}
@keyframes goA{50%{filter:brightness(1.15)}}
@media (max-width:760px){.xpc .bust{display:none}.xtop .lbl,.xps .lbl{display:none}.xbot .btn-main{padding:0 10px;font-size:.95rem}}
@media (max-width:620px){.xtop .pill:first-child small{display:none}}
/* --- duża mapa wyprawy: rozstaje (okno) --- */
#modal .box.wide{max-width:min(900px,calc(96*var(--vw)))}
.xmw h2{flex-wrap:wrap}.xmw h2 small{font-size:.75rem;color:#6a5038;font-weight:400;text-shadow:none}.xmw .xstep{margin-left:auto}
.xmap{position:relative;height:clamp(150px,calc(50*var(--vh)),320px);margin:6px 10px 8px;background:radial-gradient(ellipse at 50% 50%,#0000 50%,#7a502826),repeating-linear-gradient(90deg,#0000 0 47px,#7a50280c 48px);box-shadow:inset 0 0 0 2px #7a502830}
.xml{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.xml line{stroke:#8a6a48;stroke-width:2;stroke-dasharray:5 5;vector-effect:non-scaling-stroke}
.xml line.on{stroke:#a8321e;stroke-width:3.5;stroke-dasharray:none}
.xml line.nx{stroke:#c8861e;stroke-width:3;stroke-dasharray:8 5;animation:xdash 1s linear infinite}
@keyframes xdash{to{stroke-dashoffset:-26}}
.xmap .xn{position:absolute;transform:translate(-50%,-50%);width:40px;height:40px;min-height:0;padding:0;border:0;border-image:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#efe0bc;box-shadow:0 0 0 2px #6a4a30,0 3px 0 2px #0003;color:#6a4a30;font-weight:600;font-size:1.15rem;text-shadow:none;z-index:2;line-height:1}
.xmap .xn .ic{width:22px;height:22px}
.xmap .xn.fin{width:54px;height:54px;background:#f4d8a8;box-shadow:0 0 0 3px #6a2a1a,0 3px 0 3px #0003}.xmap .xn.fin .ic{width:30px;height:30px}
.xmap .xn.t-fog{background:#d8c49c;color:#8a6a48}
.xmap .xn.t-elite{box-shadow:0 0 0 2px #8a1a1a,0 0 0 4px #e8b0a0,0 3px 0 4px #0003}
.xmap .xn.t-camp{background:#e0ecc0}
.xmap .xn.done{background:#ddd0b0;box-shadow:0 0 0 2px #8a7a68,0 3px 0 2px #0002}.xmap .xn.done>*{filter:grayscale(.7);opacity:.55}
.xmap .xn.past{background:#e2d6ba;box-shadow:0 0 0 2px #a89880}.xmap .xn.past>*{filter:grayscale(.6);opacity:.35}
.xmap .xn.lit{box-shadow:0 0 0 2px #6a4a30,0 0 12px 5px #ffb84a}
.xmap .xn.cur{background:#efe0bc;box-shadow:0 0 0 3px #a8321e,0 0 0 6px #ffd77a;opacity:1;filter:none}.xmap .xn.cur>*{filter:none;opacity:1}
.xmap .xn.nx{cursor:pointer;box-shadow:0 0 0 3px #c8861e,0 0 14px 5px #ffd77a;animation:xnA 1.2s ease-in-out infinite}
.xmap .xn.nx:hover,.xmap .xn.nx:focus-visible{transform:translate(-50%,-50%) scale(1.14);outline:none}
.xmap .xn.nx:active{transform:translate(-50%,-50%) scale(1.05)}
@keyframes xnA{50%{box-shadow:0 0 0 3px #c8861e,0 0 22px 9px #ffe08a}}
.xmap .xme{position:absolute;left:50%;bottom:calc(100% - 4px);transform:translateX(-50%);line-height:0;filter:drop-shadow(0 2px 0 #0004)}
.xmap .xst{position:absolute;transform:translate(-50%,-50%);z-index:2;line-height:0;filter:drop-shadow(0 2px 0 #0004)}
.xleg{display:flex;flex-wrap:wrap;gap:2px 12px;font-size:.74rem;color:#5a4030;margin:0 10px}.xleg span{display:inline-flex;align-items:center;gap:3px}
.xleg .xq{display:inline-flex;width:14px;justify-content:center;color:#8a6a48}
.xmw .xh{margin:6px 10px}.xmw .row{margin-bottom:4px}
@media (max-height:440px){.xmap .xn{width:32px;height:32px;font-size:.95rem}.xmap .xn .ic{width:18px;height:18px}.xmap .xn.fin{width:42px;height:42px}.xmap .xn.fin .ic{width:24px;height:24px}.xleg{font-size:.66rem}.xmw h2{margin:4px 0 2px}.xmw .xh{margin:2px 10px}}
@media (max-width:560px){.xleg{display:none}}
/* --- wydarzenia --- */
.evm{display:flex;gap:10px;align-items:flex-start}
.evp{flex:0 0 auto;width:110px;min-height:110px;display:flex;align-items:flex-end;justify-content:center;background:radial-gradient(ellipse at 50% 90%,#0003,#0000 70%);padding:4px}
.evp img{image-rendering:pixelated;transform-origin:bottom center}
.evt{flex:1;min-width:0}.evt h2{margin-top:2px}.evt p{margin:4px 0 8px;line-height:1.35}
.evo{display:flex;flex-direction:column;gap:4px}.evo button{min-height:42px;justify-content:flex-start;text-align:left}
.evr{background:#fff6;padding:4px 8px;box-shadow:inset 3px 0 0 #a87c30}
@media (max-width:620px){.evp{width:80px;min-height:80px}.evp img{max-width:76px}}
`;
