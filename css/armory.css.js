/* Eldaria – style: typy obrażeń, odporności, zbrojownia (v6) */
css`
/* --- typy obrażeń, odporności, zbrojownia (v6) --- */
.rs{display:inline-flex;align-items:center;gap:2px;font-size:.72rem;line-height:1.15;padding:1px 4px 1px 2px;margin:1px 3px 1px 0;background:#1c1420;color:var(--dc,#ddd);box-shadow:0 0 0 1px #140d12,inset 0 0 0 1px #ffffff18;white-space:nowrap}
.rs .ic{width:12px;height:12px}.rs.wk{background:#3a1410;color:#ffb07a;box-shadow:0 0 0 1px #140d12,inset 0 0 0 1px #ff6a3a66}.rs.im{background:#14202a;color:#9fd8ff}.rs.dt{background:#2a2030}
.resrow{display:flex;flex-wrap:wrap;align-items:center;gap:2px 4px;margin:4px 2px}.resrow>.sub{margin-right:2px}
.note.ok{background:#1e2a1a;box-shadow:0 0 0 2px #140d12,inset 3px 0 0 #9cff6a}
.subtabs{display:flex;gap:4px;margin:0 0 6px}.subtabs button{flex:1;min-height:40px;font-size:.88rem;padding:2px}.subtabs button.on{border-image-source:var(--fr-on);color:#fff6d8}
.filters{margin:4px 0 8px}.filters>div{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-bottom:4px}
.chip{min-height:34px;padding:1px 6px;font-size:.74rem;flex:0 0 auto;border-width:6px}.chip.on{border-image-source:var(--fr-on);color:#fff6d8}.chip .ic{width:14px;height:14px}.chip i{font-style:normal;margin-right:2px}
.armit{cursor:pointer}.armit .item{margin-bottom:6px}
.owner{display:flex;flex-direction:column;align-items:center;min-width:44px;font-size:.7rem;color:var(--dim)}.owner .bust{margin:0 auto}.owner small{max-width:52px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.armdet{display:flex;gap:10px;align-items:center}.armdet .ii.big{width:64px;height:64px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px #140d12,0 0 0 4px var(--rc);background:#1c1420}
.eqlist{display:flex;flex-direction:column;gap:4px}.eqh{display:flex;align-items:center;gap:8px;text-align:left;width:100%;min-height:48px;padding:4px 8px}.eqh span{display:flex;flex-direction:column;min-width:0}.eqh small{font-size:.72rem;color:var(--dim)}.eqh .cmp{font-size:.72rem}
.uinfo{display:flex;gap:10px;align-items:center}.uinfo .uimg{min-width:90px;max-width:130px;display:flex;align-items:flex-end;justify-content:center;background:#1c1420;box-shadow:0 0 0 2px #140d12;padding:4px;overflow:hidden}
.sts.inl{position:static;display:inline-flex;gap:2px}
.float small{display:block;font-size:.7rem;text-align:center;margin-top:-2px}
.float.weak{color:#ffa23a}.float.weak small{color:#ffcf5a}.float.res{color:#c8beb4}.float.res small{color:#9fb0c0}
.float.info,.float.miss{background:#140d12cc;padding:1px 5px;font-size:.78rem;box-shadow:0 0 0 1px #ffffff22;z-index:8}
.hint .lp{display:block;color:var(--dim);font-size:.72rem;margin-top:2px}
.hint .rs{vertical-align:middle}
#panel.tall .panel{min-height:var(--ph);box-sizing:border-box}
@media (max-height:720px){.hint .lp{display:none}}@media (max-height:600px){.hint .rs{display:none}}
`;
