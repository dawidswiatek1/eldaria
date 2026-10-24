/* Eldaria – style: v18: duża mapa */
css`
/* ===== v18: duża mapa ===== */
.rview{flex:1;min-width:0;min-height:0;position:relative;overflow:hidden;touch-action:none;cursor:grab;background:#0c1410;box-shadow:0 0 0 3px #140d12,0 0 0 6px #6a4a30;user-select:none;-webkit-user-select:none}
.rview.drag{cursor:grabbing}
.rmap{position:absolute;left:0;top:0;transform-origin:0 0}
.rmap>img{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;pointer-events:none}
.rmap .npin{pointer-events:none;min-width:44px;min-height:44px;justify-content:center}
.rmap .npin.n-town i{width:30px;height:30px}.rmap .npin.n-vil i{width:24px;height:24px;background:#5a3a1e}
.npin.n-poi i{border-color:#9ad0ff;background:#1e2a3a;border-radius:50%}
.npin.n-fog i{border-style:dashed;border-color:#b8a888;background:#1a1a1a99;color:#e8d8b0;font-weight:bold;font-size:.9rem}
.npin.n-fog b{color:#b8a888;background:#140d1299}
.npin.here b{color:#9ae070}
.npin.on i{transform:scale(1.18);box-shadow:0 0 0 2px #140d12,0 0 0 4px #fff4d0,0 0 12px 4px #ffd870}
.roads line.fg{stroke:#b8a888;opacity:.45;stroke-dasharray:2 6}
.ngo{position:absolute;left:8px;bottom:6px;z-index:8;max-width:calc(100% - 170px);overflow:hidden;text-overflow:ellipsis;min-height:32px;padding:0 8px;border-width:6px;border-image-width:6px;white-space:nowrap;font-size:.8rem;pointer-events:auto;color:#2a1408;border-image-source:var(--fr-btn-gold,var(--fr-btn));background:#e8a040;}
.mzb{position:absolute;right:6px;bottom:6px;display:flex;gap:4px;align-items:center;z-index:7}
.mzb .btn-small{min-height:34px;min-width:34px;padding:0 6px;border-width:6px;border-image-width:6px;font-size:1.1rem}
.mzb span{font-size:.7rem;color:#e8d8b0;text-shadow:1px 1px 0 #000}
.pano.fogp{background:repeating-linear-gradient(45deg,#2a2a2a,#2a2a2a 6px,#333 6px,#333 12px)}
@media (max-height:500px){.rmap .npin{min-width:40px;min-height:40px}.rmap .npin.n-town i{width:24px;height:24px}.mzb .btn-small{min-height:30px;min-width:30px}}
`;
