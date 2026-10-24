/* Eldaria – style: v18: sceny miast */
css`
/* ===== v18: sceny miast ===== */
.stpano.hasscn{container-type:size;background:#140d12;overflow:hidden}
.scn{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(100cqw,177.78cqh);height:min(100cqh,56.25cqw)}
.stpano.hasscn .sblur{position:absolute;inset:-24px;width:calc(100% + 48px);height:calc(100% + 48px);object-fit:cover;filter:blur(14px) brightness(.45) saturate(.8);pointer-events:none}
.scn{box-shadow:0 0 0 2px #140d12,0 0 18px 6px #000a}
.scn .sbg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.shot{position:absolute;background:none;border:0;padding:0;min-height:0;box-shadow:none;border-image:none;cursor:pointer;z-index:2}
.shot:active,html.mouse .shot:hover{background:#ffd8701c;outline:2px solid #ffd87080;outline-offset:-2px}
.slab{z-index:5;font-size:.62rem}
.tlab em,.slab em{position:static;margin-left:2px;font-style:normal;font-weight:bold;color:#2a1408;background:#ffd23a;padding:0 3px}
.snpc{position:absolute;transform:translate(-50%,-100%);background:none;border:0;padding:0;min-height:0;box-shadow:none;border-image:none;z-index:4;cursor:pointer;display:flex;align-items:flex-end}
.snpc .sfr{display:block;height:100%;image-rendering:pixelated;background-repeat:no-repeat;background-position:0 0;filter:drop-shadow(0 2px 0 #0008)}
.snpc span{position:absolute;top:-6px;left:50%;transform:translateX(-50%);background:#ffd870;border:1px solid #140d12;line-height:0;padding:1px;animation:qpulse 1.6s ease-in-out infinite}
.evart{display:block;margin:0 auto 6px;width:min(240px,60%);image-rendering:pixelated;box-shadow:0 0 0 2px #140d12,0 0 0 4px #6a4a30}
.tabc.ok{box-shadow:0 0 0 2px #ffd870}
.tlab.tx{background:#2a1a0cd0}
/* v18: przyciski pozycjonowane przez translate nie mogą „skakać” przy wciśnięciu (przyczyna nietrafionych kliknięć) */
.tlab,.tlab:active:not(:disabled){transform:none;translate:-50% -100%}
.kpin,.npin,.kpin:active:not(:disabled),.npin:active:not(:disabled){transform:none;translate:-50% -50%}
.snpc,.snpc:active:not(:disabled){transform:none;translate:-50% -100%}
.tlab:active:not(:disabled),.npin:active:not(:disabled),.snpc:active:not(:disabled){filter:brightness(1.2)}
.slab.sr,.slab.sr:active:not(:disabled){translate:-92% -100%}
.slab.sl,.slab.sl:active:not(:disabled){translate:-8% -100%}
.tscroll>.sblur{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(14px) brightness(.45) saturate(.8);pointer-events:none}
.tscroll>.tmap{z-index:1;box-shadow:0 0 18px 6px #000a}
html.mouse .tlab{font-size:.66rem}html.mouse .tlab span{font-size:.58rem}html.mouse .tlab.slab{font-size:.7rem}
`;
