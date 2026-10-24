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
.mm{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
.mr{width:24px;height:24px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:#2a2036;box-shadow:0 0 0 2px #140d12;color:var(--dim);font-size:.8rem;font-weight:600}
.mr.done{filter:grayscale(.7) brightness(.7)}.mr.cur{background:#5a3a1a;box-shadow:0 0 0 2px #140d12,0 0 0 4px var(--gold);filter:none}.mr.fog{background:#1a141e}
.ml{flex:0 1 12px;min-width:4px;height:3px;background:#3a2e40}.ml.on{background:var(--gold)}
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
/* --- wydarzenia --- */
.evm{display:flex;gap:10px;align-items:flex-start}
.evp{flex:0 0 auto;width:110px;min-height:110px;display:flex;align-items:flex-end;justify-content:center;background:radial-gradient(ellipse at 50% 90%,#0003,#0000 70%);padding:4px}
.evp img{image-rendering:pixelated;transform-origin:bottom center}
.evt{flex:1;min-width:0}.evt h2{margin-top:2px}.evt p{margin:4px 0 8px;line-height:1.35}
.evo{display:flex;flex-direction:column;gap:4px}.evo button{min-height:42px;justify-content:flex-start;text-align:left}
.evr{background:#fff6;padding:4px 8px;box-shadow:inset 3px 0 0 #a87c30}
@media (max-width:620px){.evp{width:80px;min-height:80px}.evp img{max-width:76px}}
`;
