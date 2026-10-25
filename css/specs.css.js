/* Eldaria – style: specjalizacje (panel w zakładce Talenty, karty ścieżek, ukryty cień nocy; js/data/specs.js) */
css`
.specbox{border:10px solid transparent;border-image:var(--fr-panel) 10/10px stretch;background:linear-gradient(#2a1a2408,#0003),var(--tx-wood) 0 0/320px 320px;background-clip:padding-box;padding:0 4px 2px;margin-bottom:6px}
.specbox.open{box-shadow:0 0 0 2px #ffd77a,0 0 12px #ffd77a66;animation:spA 1.8s ease-in-out infinite}
@keyframes spA{50%{box-shadow:0 0 0 2px #ffd77a,0 0 18px #ffd77aaa}}
.spech{display:flex;gap:8px;align-items:flex-start;margin-bottom:6px}
.spech>div{display:flex;flex-direction:column;min-width:0}
.spech b{color:var(--gold);font-size:1rem}
.spech small{color:var(--dim);font-size:.78rem;line-height:1.3}
.specs{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.specs.one{grid-template-columns:1fr}
.spc{display:flex;flex-direction:column;gap:4px;background:#140d12b0;box-shadow:0 0 0 2px #140d12,inset 0 0 0 1px #ffd77a33;padding:6px 8px 8px;font-size:.8rem;line-height:1.3;color:#e8dcc0}
.spc.on{box-shadow:0 0 0 2px #140d12,inset 0 0 0 1px #ffd77a,inset 3px 0 0 #ffd77a}
.spt{display:flex;gap:8px;align-items:center}
.spt>div{display:flex;flex-direction:column;min-width:0}
.spt b{color:#fff2c8;font-size:.98rem}
.spt small{color:var(--dim);font-size:.74rem;font-style:italic}
.spl{display:block}
.spl.sks{display:flex;gap:6px;align-items:flex-start;padding-top:4px;border-top:1px solid #ffd77a22}
.spl.sks .ic{flex:none}
.spl.sks small{color:var(--dim)}
.spc button{margin-top:auto;align-self:stretch;min-height:38px}
.sptag{display:inline-block;margin-right:5px;padding:0 4px;font-size:.64rem;text-transform:uppercase;letter-spacing:.04em;line-height:1.5;background:#3a2a14;color:var(--gold);box-shadow:0 0 0 1px #000;vertical-align:1px}
#modal .spl{margin:4px 0;font-size:.86rem}#modal .spl.sks{border-top-color:#7a3a1033}
.badge.spb{background:#ffb07a}
/* ikony umiejętności specjalizacji: złota poświata */
.ic.spk{filter:drop-shadow(0 0 1px #ffd77a) drop-shadow(0 0 3px #ffd77a99)}
/* cień nocy ukryty w cieniu: półprzezroczysty */
.unit.hid .fxw{opacity:.45;filter:drop-shadow(0 0 3px #4a2a6a) grayscale(.4)}
@media (max-width:640px){.specs{grid-template-columns:1fr}}
@media (max-height:500px){.specbox{padding:0 2px}.spc{font-size:.74rem;padding:5px 6px 6px}.spt b{font-size:.88rem}.spech small{font-size:.7rem}.spc button{min-height:32px}}
`;
