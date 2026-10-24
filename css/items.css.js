/* Eldaria – style: przedmioty, atrybuty, talenty bohatera */
css`
/* --- przedmioty --- */
.item{padding:0 2px;margin-bottom:6px;display:flex;gap:8px;align-items:center;position:relative}
.item .ii{width:44px;height:44px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:radial-gradient(circle,color-mix(in srgb,var(--rc,#888) 40%,transparent) 0,transparent 72%),#140d14;box-shadow:0 0 0 2px #140d12,0 0 0 4px var(--rc,#5a4a5e)}
.item .ii .ic{width:32px;height:32px}
.item.r2 .ii,.item.r3 .ii{animation:glowA 1.8s ease-in-out infinite}
.item.r3::after{content:'';position:absolute;inset:0;background:linear-gradient(110deg,#0000 40%,#ffd27a22 50%,#0000 60%) 0 0/300% 100%;animation:shineA 2.6s linear infinite;pointer-events:none}
@keyframes glowA{50%{box-shadow:0 0 0 2px #140d12,0 0 0 4px var(--rc),0 0 10px 3px var(--rc)}}
@keyframes shineA{from{background-position:100% 0}to{background-position:-200% 0}}
.item .inf{flex:1;min-width:0;font-size:.86rem}
.item .inm{font-weight:600;font-size:.95rem;text-shadow:1px 1px 0 #000}
.cmp{font-size:.82rem;margin-top:2px}
.up{color:#7dff8a}.dn{color:#ff8a7a}
.slot.sel{border-image-source:var(--fr-parch)}
.slot.sel .inf{color:#3a2414}.slot.sel .sub{color:#6a5038}
.slot.emptyslot .ii .ic{filter:grayscale(1) brightness(.6);opacity:.6}
.attr{display:flex;align-items:center;gap:10px;padding:0 4px;margin-bottom:6px}
.attr .an{flex:1}.attr .an small{color:var(--dim);display:block}
.attr button{width:54px;font-size:1.4rem;font-weight:600}
.perkrow{padding:2px 4px;margin-bottom:8px}
.perkrow .opts{display:flex;gap:6px;margin-top:6px}
.perkrow .opts button{flex:1;text-align:left;font-size:.82rem;padding:2px 4px;min-height:62px;flex-direction:column;align-items:flex-start;justify-content:center}
.perkrow .opts button.chosen{border-image-source:var(--fr-on)}
.perkrow.locked{opacity:.55}
.herohead{display:flex;gap:12px;align-items:center;padding:2px;margin-bottom:8px}
.herohead .big{width:92px;height:136px;display:flex;align-items:flex-end;justify-content:center;flex-shrink:0;padding-bottom:4px;box-shadow:0 0 0 2px #140d12,inset 0 -14px 0 #0003;position:relative;overflow:hidden}
.statgrid{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;text-align:center;font-size:.8rem;margin:6px 0}
.statgrid div{padding:0;border-width:8px;border-image-width:8px}
.statgrid b{display:block;font-size:1rem}
`;
