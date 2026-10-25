/* Eldaria – style: talenty i zestaw umiejętności */
css`
/* --- talenty i zestaw umiejętności --- */
.htabs button{flex-direction:column;gap:0;font-size:.74rem;padding:2px 0;min-height:52px;position:relative}
.htabs button .badge{position:absolute;right:-4px;top:-6px;margin:0}
.tphead{border:10px solid transparent;border-image:var(--fr-panel) 10/10px stretch;background:var(--tx-wood) 0 0/320px 320px;background-clip:padding-box;padding:0 4px;margin-bottom:6px}
.tphead small{display:block;color:var(--dim);font-size:.78rem}.tphead .gold{color:var(--gold)}
.tree{border:10px solid transparent;border-image:var(--fr-panel) 10/10px stretch;background:linear-gradient(#0000,#0004),var(--tx-stone) 0 0/320px 320px;background-clip:padding-box;padding:2px 0 6px}
.trow{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
.trow.th{margin-bottom:2px}
.tbh{text-align:center;font-size:.78rem;line-height:1.1;padding:2px 1px 4px;border-bottom:2px solid #0006}
.tbh b{display:block;color:var(--gold);text-shadow:1px 1px 0 #000;margin-top:1px}.tbh small{color:var(--dim)}
.tcell{display:flex;flex-direction:column;align-items:center;position:relative;padding-top:14px}
.tl{position:absolute;top:-16px;left:50%;width:4px;height:30px;margin-left:-2px;background:#2a1e1a;box-shadow:0 0 0 1px #0008;z-index:0}
.tl.on{background:linear-gradient(90deg,#a87c30,#ffd77a,#a87c30)}
.tn{width:54px;height:54px;min-height:0;padding:0;border-width:6px;border-image:var(--fr-slot) 8 fill/6px;position:relative;z-index:1;display:flex;align-items:center;justify-content:center}
.tn .ic{width:30px;height:30px}
.tn .rk{position:absolute;right:-8px;bottom:-9px;font-size:.68rem;background:#140d12;color:var(--dim);padding:0 3px;box-shadow:0 0 0 1px #000;line-height:1.3}
.tn .nw{position:absolute;left:-8px;top:-10px;font-size:.55rem;background:#3a6a22;color:#e8ffd0;padding:0 2px;box-shadow:0 0 0 1px #000;line-height:1.3}
.tn.s-locked{filter:grayscale(1) brightness(.55)}
.tn.s-avail{border-image-source:var(--fr-btn)}
.tn.can{border-image-source:var(--fr-gold);animation:tnA 1.4s ease-in-out infinite}
.tn.s-taken{border-image-source:var(--fr-on)}.tn.s-taken .rk{color:var(--gold)}
.tn.s-max{border-image-source:var(--fr-gold)}.tn.s-max .rk{color:#2a1408;background:var(--gold)}
.tn.cap{width:60px;height:60px}.tn.cap::before{content:'';position:absolute;inset:-6px;box-shadow:0 0 0 2px #ffd77a55;pointer-events:none}
@keyframes tnA{50%{filter:brightness(1.25) drop-shadow(0 0 4px #ffd77a)}}
.tnm{font-size:.7rem;text-align:center;line-height:1.1;margin-top:6px;min-height:2.2em;padding:0 1px;text-shadow:1px 1px 0 #000;max-width:100%;overflow-wrap:anywhere}
.tdet{display:flex;gap:10px;align-items:center}.tdet .tn{flex-shrink:0}
.treq{font-size:.84rem;margin-top:6px}.treq .ok{color:#2e7a2a}.treq .no{color:#9a2a1a}
.lslots{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:6px}
.lslot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:.68rem;line-height:1.05;text-align:center;min-height:68px;padding:2px;border:8px solid transparent;border-image:var(--fr-slot) 8 fill/8px;color:var(--dim)}
.lslot.on{border-image:var(--fr-on) 8 fill/8px;color:var(--ink)}
.lslot .ic{width:30px;height:30px}.lslot .dim{opacity:.4}
.skill-line.eqd{background:#ffd77a14;box-shadow:inset 3px 0 0 var(--gold);padding-left:4px}
.skill-line .btn-small{flex-shrink:0;align-self:center}
.treset .ii{background:#140d14}
.skills.n5{grid-template-columns:1fr 1fr 1fr}
.skills.n5 button{font-size:.76rem;padding:2px 2px;gap:3px;line-height:1.05}
.skills.n5 button .si{width:22px;height:22px}
.unit.bear .fxw{filter:drop-shadow(0 0 3px #7ab04a88)}
@media (max-width:360px){.tn{width:48px;height:48px}.tn.cap{width:52px;height:52px}.tn .ic{width:26px;height:26px}.tnm{font-size:.64rem}.lslot{font-size:.62rem}}
`;
