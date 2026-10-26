/* Eldaria – style: Eldaria: mapy, podróż, miasta, dialogi, dziennik */
css`
/* ===== ELDARIA: mapy, podróż, miasta, dialogi, dziennik ===== */
.emb{image-rendering:pixelated;vertical-align:middle;display:inline-block}
.wv{position:absolute;inset:0;display:flex;flex-direction:column;background:#10161c}
.wbody{flex:1;min-height:0;display:flex;gap:8px;padding:6px max(8px,env(safe-area-inset-right)) max(6px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))}
.wfit{flex:1;min-width:0;min-height:0;display:flex;align-items:center;justify-content:center}
.wmap{position:relative;box-shadow:0 0 0 3px #140d12,0 0 0 6px #6a4a30,0 0 0 8px #140d12;background:#000;overflow:hidden}
.wmap>img{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}
.wmap .fog{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,transparent 60%,#0008 100%)}
.wside{flex:0 0 clamp(210px,28%,330px);overflow:auto;border:10px solid transparent;border-image:var(--fr-parch) 10/10px stretch;background:var(--tx-parch) 0 0/320px 320px;background-clip:padding-box;color:#3a2414;padding:4px 8px;display:flex;flex-direction:column;gap:5px}
.wside h2{color:#7a3a10;text-shadow:1px 1px 0 #fff4d0;margin:2px 0;font-size:1.15rem}
.wside p{margin:0;font-size:.86rem;line-height:1.3}.wside .sub{color:#6a5038;font-size:.8rem}
.wside .btn-main{color:#2a1408}
.kpin,.npin{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:1px;background:none;border:0;padding:2px;min-height:0;cursor:pointer;color:#fff4d0;font:inherit;z-index:2}
.kpin,.npin,.kpin:active:not(:disabled),.npin:active:not(:disabled){border-image:none;width:auto;min-width:0}
.kpin b,.npin b{font-size:.74rem;white-space:nowrap;padding:1px 5px;background:#140d12d8;border:1px solid #6a4a30;text-shadow:1px 1px 0 #000;line-height:1.2}
.kpin.lk b{color:#b8a888}.kpin.lk{opacity:.85}
.kpin.on b,.npin.on b{background:#7a3a10;border-color:#ffd870;color:#fff}
.kpin.op b{border-color:#ffd870}
.kpin:hover b,.npin:hover b{border-color:#ffd870}
.npin i{display:flex;align-items:center;justify-content:center;width:24px;height:24px;background:#2a1a14;border:2px solid #ffd870;box-shadow:0 0 0 2px #140d12;font-style:normal}
.npin.n-town i{width:28px;height:28px;background:#7a1e22}
.npin.n-site i{border-color:#e8a060;background:#3a2414}
.npin.n-exit i{border-color:#888;background:#333}
.npin.lk i{border-color:#777;background:#2a2a2a}
.npin.on i{box-shadow:0 0 0 2px #140d12,0 0 0 4px #fff4d0}
.npin em{position:absolute;top:-6px;right:-2px;font-style:normal;font-weight:bold;color:#2a1408;background:#ffd23a;border:2px solid #140d12;width:16px;height:16px;line-height:12px;text-align:center;font-size:.7rem;animation:qpulse 1.2s ease-in-out infinite}
@keyframes qpulse{50%{transform:scale(1.2)}}
.roads{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.roads line,.roads polyline{stroke:#f4e2b0;stroke-width:3;stroke-dasharray:6 5;vector-effect:non-scaling-stroke;opacity:.85;fill:none;stroke-linejoin:round;filter:drop-shadow(1px 1px 0 #3a2414)}
.party{position:absolute;transform:translate(-50%,-92%);z-index:3;pointer-events:none;transition:left calc(.55s * var(--sp)) linear,top calc(.55s * var(--sp)) linear;filter:drop-shadow(0 2px 0 #000)}
.party .pfig{display:block;width:28px;height:58px}
.party .pflag{position:absolute;right:-10px;top:-2px}
.party.fl .pfig{transform:scaleX(-1)}
.party.walk .pfig{animation:pwalk .5s steps(2) infinite}
.party.fl.walk .pfig{animation-name:pwalkfl}
@keyframes pwalk{50%{transform:translateY(-2px)}}
@keyframes pwalkfl{0%,100%{transform:scaleX(-1)}50%{transform:scaleX(-1) translateY(-2px)}}
@media (max-height:500px){.party .pfig{width:20px;height:42px}}
.pano{height:96px;flex:0 0 auto;margin:0 -2px;background:#223 center/cover no-repeat;image-rendering:pixelated;box-shadow:0 0 0 2px #6a4a30;position:relative;overflow:hidden}
.pano.scene .amb{display:none}
.wside .nd{font-style:italic}
.here{color:#2a6a1a;font-weight:bold;font-size:.86rem}
.soon{display:inline-flex;align-items:center;gap:6px;align-self:flex-start;padding:3px 10px;background:#3a2414;color:#ffd870;border:2px solid #140d12;font-weight:bold}
.wside .rlv{display:flex;gap:4px}.wside .rlv button{flex:1;min-height:34px;padding:0 4px;font-size:.84rem;position:relative}
.wside .rlv button.on{outline:3px solid #7a3a10}
.wside .rlv .ck{position:absolute;top:-4px;right:0;font-style:normal;color:#2a8a1a;font-weight:bold}
.wside .warn{color:#a02010;font-size:.8rem}
.wside .mparty{display:flex;align-items:flex-end;gap:2px;cursor:pointer;background:#0002;padding:2px 4px}
.wside .mparty small{margin-left:auto;color:#6a5038}
.wside .mp{width:34px;height:40px;display:flex;justify-content:center;align-items:flex-end}
.rgorow{display:flex;gap:5px;align-items:stretch}.rgorow .btn-main{flex:1}.rgorow .mbag{flex:0 0 auto;padding:0 6px}
/* małe miasta */
.stbody{flex:1;min-height:0;display:flex;gap:8px;padding:6px max(8px,env(safe-area-inset-right)) max(6px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))}
.stpano{flex:1.25;min-width:0;background:#223 center/cover no-repeat;image-rendering:pixelated;position:relative;box-shadow:0 0 0 3px #140d12,0 0 0 6px #6a4a30}
.stcap{position:absolute;left:8px;bottom:8px;background:#140d12d8;border:2px solid #6a4a30;padding:3px 10px;display:flex;flex-direction:column}
.stcap b{font-size:1.2rem;color:#ffd870}.stcap small{color:#e8d8b0}
.stside{flex:1;min-width:0;overflow:auto;display:flex;flex-direction:column;gap:6px}
.stside .nd{margin:0;font-style:italic;color:#e8d8b0;font-size:.86rem}
.stside h3{margin:4px 0 0;color:#ffd870;font-size:1rem}
.svcs,.talks{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:5px}
.svc,.talk{display:flex;align-items:center;gap:8px;text-align:left;min-height:50px;padding:3px 8px;position:relative}
.svc span,.talk span{display:flex;flex-direction:column;min-width:0}
.svc small,.talk small{font-size:.72rem;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.talk img{width:40px;height:45px;image-rendering:pixelated;flex:0 0 auto;box-shadow:0 0 0 2px #140d12}
.svc em,.talk em{position:absolute;top:2px;right:4px;font-style:normal;font-weight:bold;color:#2a1408;background:#ffd23a;width:16px;height:16px;line-height:16px;text-align:center;font-size:.7rem}
.inn{display:flex;align-items:center;gap:8px;justify-content:space-between;border:8px solid transparent;border-image:var(--fr-panel) 10/8px stretch;background:var(--tx-wood) 0 0/320px 320px;background-clip:padding-box;padding:2px 6px;margin:0 0 8px}
.inn span{display:flex;flex-direction:column}.inn small{font-size:.76rem;opacity:.85}
.ttop.wel{background-size:cover;background-position:center 30%;image-rendering:pixelated;min-height:50px}
.ttop .tsub{font-size:.7rem;color:#e8d8b0;font-weight:normal;margin-left:4px}
/* dialog */
.dlg{display:flex;gap:10px;align-items:flex-start}
.dpor{flex:0 0 auto;width:92px;height:103px;background:#2a1a14;box-shadow:0 0 0 3px #6a4a30,0 0 0 5px #140d12;display:flex;align-items:center;justify-content:center;margin:5px}
.dpor img{width:100%;height:100%;image-rendering:pixelated}
.dtx{flex:1;min-width:0}.dtx h2{margin:2px 0 4px}.dtx p{margin:0 0 6px;line-height:1.35;font-size:.92rem}
.dopts{display:flex;flex-direction:column;gap:5px;margin-top:6px}
.dopts button{text-align:left;justify-content:flex-start;min-height:40px;padding:4px 10px;font-size:.9rem;width:100%}
.dopts .rq{opacity:.75}
.ctag{display:inline-block;padding:0 5px;margin-right:2px;background:#7a3a10;color:#fff4d0;font-size:.72rem;border:1px solid #140d12;vertical-align:middle}
/* dziennik */
.jv{background:#1c1612}.jmain{overflow:auto}
.jt{padding:4px max(8px,env(safe-area-inset-left))}
.quest{border:8px solid transparent;border-image:var(--fr-parch) 10/8px stretch;background:var(--tx-parch) 0 0/320px 320px;background-clip:padding-box;color:#3a2414;padding:2px 8px;margin-bottom:6px}
.quest.done{opacity:.8}
.qh{display:flex;gap:8px;align-items:center}.qh img{width:40px;height:45px;image-rendering:pixelated;box-shadow:0 0 0 2px #6a4a30}
.qh div{display:flex;flex-direction:column}.qh b{color:#7a3a10;font-size:1.05rem}.qh small{color:#6a5038}
.quest p{margin:4px 0}.quest .sub{color:#6a5038}.qcur{font-weight:bold}
.quest summary{cursor:pointer;color:#7a3a10;font-size:.85rem}
.qcamp{border:8px solid transparent;border-image:var(--fr-parch) 10/8px stretch;background:var(--tx-parch) 0 0/320px 320px;background-clip:padding-box;color:#3a2414;padding:4px 10px;margin:4px 0 10px}
.qcamp>b{color:#7a3a10}.qcamp>small{color:#6a5038}
.qcamp>small.qprev{display:block;color:#3a6a20;font-size:.72rem;margin-bottom:1px}
.qcamp ol{list-style:none;margin:4px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:3px 16px}
.qcamp li{font-size:.85rem;display:flex;align-items:center;gap:4px}.qcamp li small{color:#6a5038}
.qcamp .c-done{color:#3a6a20}.qcamp .c-act{font-weight:bold}.qcamp .c-lk{color:#8a7a68}
.repr{display:flex;gap:8px;align-items:center;border:8px solid transparent;border-image:var(--fr-panel) 10/8px stretch;background:var(--tx-wood) 0 0/320px 320px;background-clip:padding-box;padding:2px 6px;margin-bottom:6px}
.rinf{flex:1;min-width:0}.rinf small{opacity:.8;font-size:.76rem}
.rbar{position:relative;height:8px;background:#140d12;margin-top:3px;box-shadow:0 0 0 1px #6a4a30}
.rbar::after{content:'';position:absolute;left:50%;top:-2px;bottom:-2px;width:2px;background:#fff4d0}
.rbar i{position:absolute;top:0;bottom:0}
.rv{font-weight:bold;color:#9ae070;white-space:nowrap}.rv.neg{color:#ff8a6a}
.lorelist{display:flex;flex-direction:column;gap:5px;margin-bottom:6px}.lorelist button{justify-content:flex-start;text-align:left}
.lore p{line-height:1.4;font-size:.92rem;margin:0 0 7px}
.lhead{display:flex;gap:10px;align-items:center;margin:4px 0 8px}.lhead h1{margin:0;font-size:1.8rem}.lhead small{color:#6a5038}
@media (max-height:500px){.pano{display:none}.wside .rlv button{min-height:28px}.wside .mp{width:26px;height:30px}.wside .mparty .bust{transform:scale(.8);transform-origin:bottom}.rgorow .btn-main{min-height:40px;font-size:.9rem}.wside .nd{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.wside{flex-basis:clamp(190px,32%,280px);padding:2px 6px;gap:3px}.wside p{font-size:.78rem}.wside h2{font-size:1rem}.kpin b,.npin b{font-size:.62rem;padding:0 3px}.npin i{width:20px;height:20px}.npin.n-town i{width:22px;height:22px}
 .svc,.talk{min-height:42px}.talk img{width:32px;height:36px}.svcs,.talks{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}.dpor{width:66px;height:74px}.dtx p{font-size:.82rem}.dopts button{min-height:34px;font-size:.82rem}.stcap b{font-size:1rem}}
@media (max-width:640px){.wbody{flex-direction:column}.wside{flex:0 0 auto;max-height:45%}.stbody{flex-direction:column}.stpano{flex:0 0 110px}}
`;
