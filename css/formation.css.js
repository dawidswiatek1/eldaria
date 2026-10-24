/* Eldaria – style: formacja i zasięg w walce */
css`
/* --- formacja --- */
.form{border:10px solid transparent;border-image:var(--fr-panel) 10/10px stretch;background:linear-gradient(#0000 60%,#3a5a2a55),var(--tx-stone) 0 0/320px 320px;background-clip:padding-box;padding:2px 2px 4px;margin-bottom:6px}
.frow{display:flex;align-items:flex-end;gap:10px;justify-content:center}
.fgrp{display:flex;flex-direction:column;align-items:center;gap:2px}
.fl{font-size:.72rem;color:var(--gold);text-shadow:1px 1px 0 #000;letter-spacing:.5px}
.fgrp.front .fl{color:#ffb07a}
.fsl{display:flex;gap:4px;padding:3px;background:#0004;box-shadow:inset 0 0 0 2px #0006}
.fgrp.front .fsl{box-shadow:inset 0 0 0 2px #ff8a5a66}
.fslot{width:66px;min-height:0;height:100px;padding:0;border-width:6px;border-image:var(--fr-slot) 8 fill/6px;flex-direction:column;justify-content:flex-end;gap:0;position:relative;overflow:hidden}
.fslot.sel{border-image-source:var(--fr-gold);animation:tnA 1s ease-in-out infinite}
.fslot.empty .fe{color:var(--dim);font-size:.7rem;margin:auto}
.fslot.ko .fspr{filter:grayscale(1) brightness(.6)}
.fspr{flex:1;display:flex;align-items:flex-end;justify-content:center;width:100%;overflow:hidden}
.fslot .fn{font-size:.62rem;line-height:1.1;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.frc{font-size:.56rem;line-height:1.1;display:flex;align-items:center;gap:1px}.frc .ic{width:10px;height:10px}.frc.m{color:#ffb07a}.frc.r{color:#9fd8ff}
.fhp{display:block;width:80%;height:3px;background:#2a1216;margin:1px auto 0}.fhp>i{display:block;height:100%;background:#4fcf5a}
.fen{display:flex;flex-direction:column;align-items:center;color:#ff8a6a;font-size:.6rem;padding-bottom:30px}
.fnote{margin:4px 2px 0;font-size:.72rem;line-height:1.3}.fnote .gold{color:var(--gold)}
@media (max-width:760px){.fslot{width:58px;height:94px}.fen{display:none}.frow{gap:6px}}
/* --- zasięg w walce --- */
.rs.rc.m{color:#ffb07a}.rs.rc.r{color:#9fd8ff}
.unit .blk{display:none;position:absolute;left:50%;top:30%;transform:translateX(-50%);background:#140d12dd;color:#ffd0a0;font-size:.56rem;padding:1px 3px;white-space:nowrap;box-shadow:0 0 0 1px #ff8a5a88;z-index:5;align-items:center;gap:2px;pointer-events:none}
.unit.noreach .blk{display:flex}
.unit.noreach .fxw{filter:grayscale(.85) brightness(.55)}
.unit.noreach .un,.unit.noreach .bar{opacity:.5}
.blkh{color:#ffb07a}
.unit{transition:left .35s ease,top .35s ease}
.rowmark{position:absolute;height:12px;border-radius:50%;background:radial-gradient(ellipse,#ffd77a22,#0000 70%);pointer-events:none;z-index:1}
.rowmark.e{background:radial-gradient(ellipse,#ff5a3a22,#0000 70%)}
.pbar .skills .swp{flex:0 0 auto;min-width:54px;max-width:84px}
@media (max-width:720px){.pbar .skills .swp{min-width:44px;max-width:52px}}
.pbar .sn.ln{font-size:.62rem;letter-spacing:-.02em}
`;
