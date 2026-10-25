/* Eldaria – style: walki z bossami (pasek bossa, zapowiedź ciosu, cel, elementy do zniszczenia; js/battle/bosses.js) */
css`
/* ===== pasek bossa: prawy górny róg sceny ===== */
.bossbar{position:absolute;right:max(6px,env(safe-area-inset-right));top:44px;width:min(46%,440px);z-index:16;background:#140d12d8;box-shadow:0 0 0 2px #140d12,inset 0 0 0 1px #ff8a5a44;padding:4px 7px 5px;font-size:.72rem;line-height:1.25;color:#f0e4d0;pointer-events:none}
.bossbar[hidden]{display:none}
.bbh{display:flex;align-items:center;gap:5px;white-space:nowrap}
.bbh b{color:#ffb07a;font-size:.86rem;overflow:hidden;text-overflow:ellipsis}
.bph{color:#ffd870;font-size:.68rem;overflow:hidden;text-overflow:ellipsis}
.bhp{margin-left:auto;color:var(--dim);font-size:.68rem}
.bbar{position:relative;height:7px;margin:3px 0 2px;background:#2a1418;box-shadow:0 0 0 1px #000}
.bbar i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(#ff7a4a,#c8301a);transition:width .3s}
.bbar s{position:absolute;top:-2px;bottom:-2px;width:2px;background:#ffd870;box-shadow:0 0 0 1px #000}
.bint{position:relative;margin-top:3px;padding:2px 5px 4px;background:#5a1410e8;box-shadow:0 0 0 1px #ff6a3a;color:#fff0e0;animation:bintA 1s ease-in-out infinite}
.bint b{color:#ffd870}
.bint .bprog{position:absolute;left:0;bottom:0;height:3px;background:#7dff8a;transition:width .3s}
@keyframes bintA{50%{box-shadow:0 0 0 1px #ffd870,0 0 10px #ff6a3a}}
.bnext,.btip{margin-top:2px;color:#e8d8b8}
.bnext b{color:#ffd870}
.btip{color:#c8e8b0}
.bossbar .ic{vertical-align:-2px}
/* boss zbiera siły (zapowiedź): pulsująca czerwona poświata */
.unit.chg .fxw{animation:chgA .8s ease-in-out infinite}
@keyframes chgA{0%,100%{filter:drop-shadow(0 0 3px #ff4a2a) drop-shadow(0 0 8px #ff8a3a88)}50%{filter:drop-shadow(0 0 6px #ffd870) drop-shadow(0 0 16px #ff4a2a)}}
/* oznaczony cel wielkiego ciosu */
.unit.marked .shadow{background:radial-gradient(#ff3a2a,#ff3a2a66 55%,transparent 72%);height:16px;bottom:-6px;animation:pulse .7s infinite}
.unit.marked .un{color:#ff8a7a}
.unit.marked .un::before{content:'🎯 '}
/* elementy do zniszczenia: delikatna poświata i pętla animacji (wszystkie klatki paska); zniszczone znikają */
.unit.obj .fxw{filter:drop-shadow(0 0 4px #ffd87088)}
.unit.obj .spr{animation:objA 1.1s infinite steps(8)}
@keyframes objA{to{background-position-x:calc(var(--fw) * -8)}}
.unit.obj.dead .mv{opacity:0;transition:opacity .6s}
/* efekty wielkich ciosów (bfx) */
.bfx{position:absolute;z-index:8;pointer-events:none;background-repeat:no-repeat;image-rendering:pixelated}
.unit.obj .un{color:#ffd870}
.note.bossn{background:#2a1a24;color:#f0e4d0;box-shadow:0 0 0 2px #140d12,inset 3px 0 0 #ff8a5a;font-size:.78rem}.note.bossn b{color:#ffd870}
.sub.trod{color:#ffb07a}
@media (max-height:500px){.bossbar{top:38px;width:min(48%,400px);font-size:.64rem;padding:3px 6px 4px}.bbh b{font-size:.76rem}.bbar{height:5px}.bnext{display:none}}
@media (max-height:360px){.bossbar{top:34px}}
`;
