/* Eldaria – style: mapa miasta */
css`
/* --- mapa miasta --- */
.townv{position:absolute;inset:0;display:flex;flex-direction:column;background:#1a2a14}
.ttop{display:flex;align-items:center;gap:6px;padding:5px max(8px,env(safe-area-inset-right)) 5px max(8px,env(safe-area-inset-left));background:linear-gradient(#140d12,#140d12e0);box-shadow:0 2px 0 #000;z-index:5}
.ttop h2{margin:0;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ttop .pill{min-height:36px;border-width:7px;border-image-width:7px}
.ttop .btn-small{min-height:36px;border-width:7px;border-image-width:7px;padding:0 8px;position:relative;gap:4px}
.ttop .tgo{width:auto;flex:0 0 auto;min-height:40px;padding:0 14px;font-size:1rem}
.tscroll{flex:1;min-height:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;touch-action:pan-x;position:relative}
.tscroll::-webkit-scrollbar{display:none}
.tmap{position:relative;margin:0 auto}
.tbase,.tb,.tfx{position:absolute;left:0;top:0;image-rendering:pixelated;pointer-events:none}.tfx{z-index:1}
.thit{position:absolute;background:none;border:0;padding:0;min-height:0;box-shadow:none;border-image:none;cursor:pointer}
.thit:active{background:#ffffff22}
.tlab{position:absolute;transform:translate(-50%,-100%);display:flex;align-items:center;gap:2px;white-space:nowrap;min-height:0;padding:0 3px 0 2px;border:0;border-image:none;background:#140d12b8;box-shadow:0 0 0 1px #000a,inset 0 1px 0 #ffd77a40;font-size:.56rem;line-height:1.25;opacity:.92;color:var(--ink);cursor:pointer;animation:none}
.tlab b{font-weight:600;color:var(--gold)}.tlab span{display:flex;gap:1px;font-size:.5rem;color:var(--dim)}.tlab span .pip,.tlab span i{transform:scale(.8)}
.tlab.ruin{box-shadow:0 0 0 1px #000,inset 0 0 0 1px #b8a89055}.tlab.ruin b{color:#e8d8b8}.tlab.soon{opacity:.75}.tlab.soon b{color:var(--dim)}
.tlab em{font-style:normal;color:#7dff8a;font-size:.7rem;animation:goA 1.2s ease-in-out infinite}
.pip{display:inline-block;width:6px;height:6px;background:#3a2e40;box-shadow:0 0 0 1px #000;margin:0 1px}.pip.on{background:var(--gold)}
.thint{position:absolute;left:50%;bottom:max(4px,env(safe-area-inset-bottom));transform:translateX(-50%);background:#140d12b0;padding:2px 8px;font-size:.66rem;color:var(--dim);pointer-events:none;white-space:nowrap;z-index:4;animation:thintF .6s 5s forwards}
@keyframes thintF{to{opacity:0}}
@media (max-width:700px){.ttop .lbl{display:none}.ttop h2{font-size:.95rem}.tlab{font-size:.52rem}}
@media (max-height:360px){.ttop{padding-top:3px;padding-bottom:3px}.ttop .pill,.ttop .btn-small{min-height:32px}.ttop .tgo{min-height:34px}}
`;
