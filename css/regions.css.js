/* Eldaria – style: mapa krain */
css`
/* --- mapa krain --- */
.mapv{position:absolute;inset:0;display:flex;flex-direction:column;gap:6px;padding:6px max(8px,env(safe-area-inset-right)) max(6px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))}
.mtop{display:flex;align-items:center;gap:8px}.mtop h2{margin:0;flex:1}.mtop .pill{min-height:38px;border-width:7px;border-image-width:7px}
.regs{flex:1;min-height:0;display:flex;gap:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;padding:0;background-color:#0d0a0c;background-size:100% auto;background-position:center 40%;background-repeat:no-repeat;background-attachment:local;box-shadow:inset 0 0 0 2px #140d12,0 0 0 2px #6a4a30,0 0 0 4px #140d12;image-rendering:pixelated}
.reg{flex:1 0 150px;display:flex;flex-direction:column;border:6px solid transparent;border-image:none;background:none;min-height:0;position:relative}
.reg .rn,.reg .rlv{background:#1a1014e6;box-shadow:0 0 0 2px #140d12,inset 0 1px 0 #ffd77a30}.reg .rn{padding:3px 5px 1px}.reg .rlv{padding:3px 4px 4px}
.reg.on{border-image:var(--fr-gold) 8/6px stretch}
.rpin{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);min-width:26px;text-align:center;font-size:.72rem;color:#ffe9a8;background:#3a2414;padding:1px 5px;box-shadow:0 0 0 2px #140d12,inset 0 0 0 1px #ffd77a80,2px 3px 0 #0007;text-shadow:1px 1px 0 #000}
.reg.on .rpin{background:#c8862a;color:#2a1408;text-shadow:none}
.reg.on{border-image-source:var(--fr-gold)}
.reg.lk .rth{backdrop-filter:grayscale(1) brightness(.45);-webkit-backdrop-filter:grayscale(1) brightness(.45)}.reg.lk .rn{filter:grayscale(1) brightness(.6)}
.rth{position:relative;flex:1;min-height:40px;overflow:hidden}
.rth .ly{position:absolute;inset:0;background-repeat:repeat-x;background-size:auto 100%;image-rendering:pixelated}
.rlock,.rdone{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3;background:#140d12cc;padding:4px;box-shadow:0 0 0 2px #000;line-height:0}
.rdone{left:auto;right:3px;top:3px;transform:none}
.rn{padding:2px 2px 0;line-height:1.1}.rn b{display:block;font-size:.84rem;color:var(--gold);text-shadow:1px 1px 0 #000}.rn small{font-size:.66rem;color:var(--dim)}
.rlv{display:grid;grid-template-columns:1fr 1fr;gap:3px;padding:3px 0 0}
.rlv button{min-height:34px;font-size:.78rem;padding:0 2px;border-width:6px;border-image-width:6px;position:relative;gap:2px}
.rlv button.on{border-image-source:var(--fr-gold);color:#2a1408;text-shadow:none}
.rlv button.bl{color:#ffb07a}.rlv button.on.bl{color:#2a1408}
.rlv .ck{position:absolute;right:-3px;top:-6px;font-style:normal;color:#7dff8a;font-size:.7rem;text-shadow:1px 1px 0 #000}
.mbot{display:flex;align-items:center;gap:8px;border:8px solid transparent;border-image:var(--fr-panel) 10/8px stretch;background:var(--tx-wood) 0 0/320px 320px;background-clip:padding-box;padding:0 2px}
.minf{flex:1;min-width:0;line-height:1.15}.minf b{color:var(--gold);display:block;font-size:.92rem}.minf small{display:block;font-size:.7rem;color:var(--dim)}.minf .warn{color:#ffb07a}
.mparty{display:flex;align-items:flex-end;gap:2px;cursor:pointer;position:relative;padding-bottom:12px}.mparty small{position:absolute;bottom:-2px;right:0;font-size:.62rem;color:var(--gold)}
.mp{width:30px;height:30px;background:#0005;box-shadow:0 0 0 1px #000}.mp.f{box-shadow:0 0 0 1px #ff8a5a}
.mbot .btn-main{width:auto;flex:0 0 auto;min-height:50px;padding:0 14px}
@media (max-width:700px){.mparty{display:none}.reg{flex-basis:128px}}
@media (max-height:360px){.rlv button{min-height:30px}.rth{min-height:28px}.mbot .btn-main{min-height:44px}}
`;
