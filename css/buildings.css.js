/* Eldaria – style: budynki */
css`
/* --- budynki --- */
.bhead{display:flex;gap:8px;align-items:center;border:8px solid transparent;border-image:var(--fr-panel) 10/8px stretch;background:var(--tx-wood) 0 0/320px 320px;background-clip:padding-box;margin:2px 0 8px;padding:2px}
.bimg{flex:0 0 auto;width:100px;height:68px;display:flex;align-items:flex-end;justify-content:center;background:radial-gradient(ellipse at 50% 85%,#7cb44a66,#0000 70%)}
.bimg img{image-rendering:pixelated}
.binf{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.binf .row1{display:flex;align-items:center;gap:6px}.binf h2{margin:0;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.binf .btn-small{min-height:34px;border-width:6px;border-image-width:6px;padding:0 6px;flex:0 0 auto}
.binf .pips{flex:0 0 auto}.binf .pip{width:8px;height:8px}.ruin{color:#ffb07a}
.bup{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.bup .sub{flex:1;min-width:150px}
@media (max-width:700px){.bimg{width:70px;height:52px}.binf .lbl{display:none}}
.con{display:flex;gap:6px;align-items:center;background:#2a2036;box-shadow:0 0 0 2px #140d12;padding:5px}
.con.ok{box-shadow:0 0 0 2px #140d12,0 0 0 3px #7dff8a}
.ci{flex:0 0 auto}.cinf{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.2}.cinf b{color:var(--gold);font-size:.86rem}.cinf small{font-size:.7rem;color:var(--dim)}.cinf .rw{color:var(--ink)}
.cinf .bar{display:block;margin:3px 0 1px;height:6px}
.con .btn-small{flex:0 0 auto;min-height:36px}
.vault{background:#2a2036;box-shadow:0 0 0 2px #140d12;padding:6px;display:flex;flex-direction:column;gap:6px}
.vv{display:flex;align-items:center;gap:8px}.vv span{display:flex;flex-direction:column}.vv b{color:var(--gold);font-size:1.05rem}.vv small{font-size:.72rem;color:var(--dim)}
.vault .row{display:flex;gap:4px;flex-wrap:wrap}.vault .btn-small{flex:1 1 90px;min-height:36px}
.trn{font-size:.68rem;color:#8ad0ff;margin:1px 0}
.injs{display:flex;flex-wrap:wrap;gap:2px;margin:1px 0}
.inj{display:inline-flex;align-items:center;gap:2px;font-size:.62rem;line-height:1;padding:2px 4px 2px 2px;background:#5a1e1e;color:#ffd0c0;box-shadow:0 0 0 1px #000;white-space:nowrap}.inj.m{background:#3e2458;color:#e8d0ff}
.injl{display:flex;flex-direction:column;gap:3px;margin-top:3px}.ir{display:flex;align-items:center;gap:4px;flex-wrap:wrap}.ir small{flex:1;min-width:80px;font-size:.68rem;color:var(--dim)}.ir .btn-small{min-height:32px;padding:0 6px}
.injc .av{flex:0 0 auto}
.item.sup.lk{opacity:.6}.cnt{color:var(--dim);font-size:.8rem}
.supg{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:4px;margin:4px 0 6px}
.supt{display:flex;align-items:center;gap:6px;justify-content:flex-start;min-height:44px;text-align:left}.supt span{display:flex;flex-direction:column;line-height:1.1}.supt small{font-size:.7rem}
#modal .supt small{color:#e8d8b8}
.mbag{flex:0 0 auto;min-height:44px;gap:3px;padding:0 6px;font-size:.8rem}
.xbag{position:relative}
.injp{color:#8a2a1a}
.pbar .skills .bagb{position:relative}
`;
