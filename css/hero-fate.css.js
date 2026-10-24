/* Eldaria – style: v15: bohater główny, skraj śmierci, szpital, urazy, kreator */
css`
/* ===== v15: bohater główny, skraj śmierci, szpital, urazy, kreator ===== */
.crown{display:inline-block;vertical-align:-1px;margin-right:3px;image-rendering:pixelated;filter:drop-shadow(0 0 2px #ffd24a88)}
.unit .un .crown{margin-right:2px;vertical-align:0}
.inj.p{background:#2a1810;color:#ffd77a;box-shadow:0 0 0 1px #000,inset 0 0 0 1px #a07a2a}
.trn.hosp{color:#c0392b;font-weight:600}
.unit .ddm{display:none}
.unit.down .ddm{display:block;position:absolute;left:50%;top:74%;z-index:6;transform:translate(-50%,-50%);animation:ddp 1.1s ease-in-out infinite;filter:drop-shadow(0 0 3px #ff2a1a)}
@keyframes ddp{50%{transform:translate(-50%,-50%) scale(1.3);opacity:.65}}
.unit.down .mv{filter:sepia(.5) saturate(1.5) hue-rotate(-25deg) brightness(.72);transition:filter .6s}
.unit.h.dead .fxw,.unit.down .fxw{transform-origin:50% 50%;transform:translateY(var(--dy)) rotate(-90deg);transition:transform .35s cubic-bezier(.5,0,.9,.5)}
.unit.down .shadow{width:150%;left:-25%}
.unit.down .bar,.unit.down .sts{opacity:.25}
.unit.down .hpt{color:#ff8a7a;opacity:1;font-weight:600}
.injlist{margin-top:4px;display:flex;flex-direction:column;gap:3px}
.injrow{display:flex;flex-direction:column;align-items:flex-start;gap:1px}
.injrow small{font-size:.62rem;color:var(--dim);line-height:1.1}
.crw{display:flex;gap:8px;align-items:flex-start;margin-top:6px}
.crg{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;flex:1.5;min-width:0}
.crc{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:0;padding:2px 0;min-height:0;min-width:0;border-width:6px;border-image-width:6px}
.crc small{font-size:.56rem;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.crc.on{filter:brightness(1.2);outline:3px solid var(--gold);outline-offset:-1px}
.crd{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.crn{display:flex;align-items:center;gap:4px;font-size:.8rem}
.crn input{flex:1;min-width:0;font:inherit;font-size:.85rem;padding:4px 6px;background:#f4e6c8;color:#2a1a10;border:2px solid #3a2414;box-shadow:inset 1px 1px 0 #0003}
.crsex{display:flex;align-items:center;gap:4px;font-size:.8rem;margin-bottom:4px}
.crsex button{flex:1;min-height:28px;min-width:0;padding:2px 4px;font-size:.74rem;white-space:nowrap;opacity:.62;filter:saturate(.6)}
.crsex button.on{opacity:1;filter:brightness(1.25);outline:3px solid var(--gold);outline-offset:-1px;color:#ffe9a8}
.crd .sub{font-size:.66rem;line-height:1.2}
`;
