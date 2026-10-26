/* Eldaria – style: v8: układ poziomy (walka, obóz, bohater, tytuł, miasto, okna, obróć telefon) */
css`
/* ===== v8: UKŁAD POZIOMY ===== */
html,body{height:100%;overflow:hidden;overscroll-behavior:none}
body{min-height:0}
#app{position:fixed;inset:0;max-width:none;margin:0;min-height:0;padding:0;display:block}
/* --- walka --- */
.bt{position:absolute;inset:0;display:block;padding:0}
.bt .scene{position:absolute;inset:0;margin:0;box-shadow:none;--tw:768px}
.bt .scene .ly{inset:0 -16px}
.btop{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:4px;padding:3px max(6px,env(safe-area-inset-right)) 8px max(6px,env(safe-area-inset-left));z-index:20;background:linear-gradient(#140d12d8,#140d1290 65%,#0000);pointer-events:none}
.btop>*{pointer-events:auto}
.btop .pill{min-height:32px;font-size:.84rem;white-space:nowrap;border-width:6px;border-image-width:6px;padding:0 4px}
.btop .btn-small{min-height:34px;padding:0 6px;font-size:.8rem;border-width:6px;border-image-width:6px;flex-shrink:0;white-space:nowrap}
.btop .order{flex:1;min-width:0;justify-content:center;min-height:0;padding:3px 2px}
.btop .order img{width:26px;height:26px}
.bt .log{position:absolute;left:max(6px,env(safe-area-inset-left));top:42px;width:min(40%,340px);height:auto;max-height:3.1em;overflow:hidden;z-index:15;background:#120c14a8;font-size:.68rem;line-height:1.25;display:flex;flex-direction:column;justify-content:flex-end;border-width:4px;border-image-width:4px;padding:0 4px;opacity:.85;cursor:pointer}
.bt .log div{flex-shrink:0}
.bt .log.open{max-height:52%;display:block;overflow-y:auto;background:#120c14ee;opacity:1;width:min(52%,420px);font-size:.74rem}
#panel{position:absolute;left:0;right:0;bottom:0;z-index:20;padding:0 max(6px,env(safe-area-inset-right)) max(4px,env(safe-area-inset-bottom)) max(6px,env(safe-area-inset-left))}
.bt .hint{font-size:.72rem;line-height:1.2;background:#140d12d0;padding:2px 8px;margin:0 0 3px;max-height:2.55em;overflow:hidden;box-shadow:0 0 0 1px #ffffff18;min-height:0;color:#e8dcc0;display:block}
.bt .hint .who{color:var(--gold)}.bt .hint .rs{vertical-align:middle;font-size:.64rem}
.bt .hint.wait{margin-bottom:2px;display:inline-block;max-width:100%}
.pbar{display:flex;gap:4px;align-items:stretch}
.pbar .skills{flex:1;display:flex;gap:4px;min-width:0}
.pbar .skills button{flex:1 1 0;min-width:0;min-height:50px;padding:2px 4px;font-size:.74rem;line-height:1.05;border-width:7px;border-image-width:7px;gap:4px}
.pbar .skills button .si{width:26px;height:26px}
.pbar .skills button .cd{top:-6px;right:-4px}
.pbar .sn{overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.pbar .use,.pbar .need{flex:0 0 112px;width:auto;min-height:50px;font-size:.95rem}
.pbar .need{display:flex;align-items:center;justify-content:center;text-align:center;background:#140d12d8;color:var(--gold);font-weight:600;box-shadow:0 0 0 2px #ffd77a66;font-size:.8rem;line-height:1.1;padding:0 4px;animation:pulse 1.4s infinite}
.unit .un{font-size:.62rem}.unit .hpt{font-size:.54rem}.unit .bar{height:5px;width:64%}
.unit .sts{top:-4px}
@media (max-width:720px){.pbar .sn{display:none}.pbar .skills button{justify-content:center;padding:2px}.pbar .skills button .si{width:30px;height:30px}.btop .lbl{display:none}.pbar .use,.pbar .need{flex-basis:96px}}
@media (max-height:360px){.pbar .skills button,.pbar .use,.pbar .need{min-height:44px}.btop .pill{min-height:30px;font-size:.78rem}.btop .btn-small{min-height:30px}.btop .order img{width:22px;height:22px}.bt .log{top:36px}}

/* --- obóz: boczna nawigacja + przewijana treść --- */
.camp{position:absolute;inset:0;display:grid;grid-template-columns:clamp(132px,calc(19*var(--vw)),184px) minmax(0,1fr);gap:8px;padding:6px max(8px,env(safe-area-inset-right)) max(4px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))}
.side{display:flex;flex-direction:column;gap:5px;min-height:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;padding-bottom:2px}
.side::-webkit-scrollbar{display:none}
.srow{display:flex;gap:4px;align-items:center}.srow .pill{flex:1;min-width:0;justify-content:center}.srow .btn-small{flex-shrink:0;min-height:40px;padding:0 6px}
.side .pill{min-height:36px;font-size:.95rem;border-width:7px;border-image-width:7px}
.pill.stg{align-items:center}.pill.stg>span{display:flex;flex-direction:column;line-height:1.05}.pill.stg small{color:var(--dim);font-weight:400;font-size:.7rem}
.tabs.vt{flex-direction:column;margin:0;gap:4px}
.tabs.vt button{flex:0 0 auto;justify-content:flex-start;min-height:44px;font-size:.95rem;padding:2px 6px;position:relative}
.tabs.vt .badge{position:absolute;right:2px;top:2px}
.fightb{margin-top:auto;flex-direction:column;gap:0;min-height:56px;font-size:1.02rem;flex-shrink:0;line-height:1.1}
.fightb>span{display:flex;align-items:center;gap:4px}.fightb small{font-size:.74rem;font-weight:400}
.main{overflow-y:auto;overflow-x:hidden;min-height:0;padding:0 2px 12px;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.main>h2:first-child,.main>.subtabs:first-child{margin-top:2px}
.cols{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr));gap:0 8px;align-items:start}
#app.enter>*{animation:none}#app.enter .main,#app.enter .tmenu{animation:enterA calc(.28s * var(--sp)) ease-out both}
/* bohater */
.hside{gap:4px}
.hside .herohead{gap:8px;margin:0}
.hside .herohead .big{width:84px;height:134px}
.hside .nm{font-size:.95rem;line-height:1.1;overflow-wrap:anywhere}
.hside .statgrid{grid-template-columns:repeat(3,1fr);margin:0}
.hside .statgrid div{font-size:.8rem}.hside .statgrid b{font-size:.9rem;display:inline;margin-left:2px}
.hside .note{margin:0;font-size:.76rem}
.hside .resrow{margin:0 2px}
.herov{grid-template-columns:clamp(200px,calc(31*var(--vw)),290px) minmax(0,1fr)}
.htabs{position:sticky;top:0;z-index:6;background:#140d12;box-shadow:0 4px 0 #140d12;margin-bottom:6px}
.htabs button{flex-direction:row;gap:4px;font-size:.84rem;min-height:44px;min-width:0}
@media (max-width:780px){.htabs button{flex-direction:column;gap:0;font-size:.7rem;min-height:48px;padding:0 1px}.htabs button .ic{width:18px;height:18px}}
.howto2 p{margin:6px 0;font-size:.9rem;line-height:1.4}
/* miasto */
.town{width:min(100%,calc((calc(100*var(--vh)) - 92px) * var(--ta,1.95)));margin:2px auto 8px}
.townbtns{grid-template-columns:repeat(3,1fr);gap:6px}
.townbtns button{padding:2px 6px;min-height:50px;gap:6px}
.townbtns button small{display:block;font-size:.72rem;line-height:1.1}
@media (max-width:760px){.townbtns button small{display:none}.townbtns button .ic{width:26px;height:26px}}
/* okna */
#modal{padding:8px}
#modal .box{max-width:min(600px,calc(94*var(--vw)));max-height:calc(94*var(--vh));max-height:calc(94*var(--vh))}
.toast{bottom:18px}
.loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
/* obróć telefon */
#rot{display:none}
@media (orientation:portrait) and (max-width:820px) and (pointer:coarse){
 #rot{display:flex;position:fixed;inset:0;z-index:300;flex-direction:column;align-items:center;justify-content:center;gap:18px;text-align:center;padding:24px;background:radial-gradient(ellipse at 50% 40%,#2a1c26 0,#140d12 70%),#140d12;color:var(--ink)}
 #app,#modal{visibility:hidden}
}
#rot .ph{width:56px;height:96px;position:relative;background:#2a2036;box-shadow:0 0 0 4px #140d12,0 0 0 8px #ffd77a,0 0 0 12px #140d12,inset 0 0 0 6px #4a3a5e;animation:rotA 2.4s steps(1) infinite}
#rot .ph::before{content:'';position:absolute;left:10px;right:10px;top:14px;bottom:18px;background:linear-gradient(#62b6d2 0 55%,#5a9a44 55%)}
#rot .ph::after{content:'';position:absolute;left:50%;bottom:6px;width:8px;height:8px;margin-left:-4px;background:#ffd77a}
@keyframes rotA{0%,30%{transform:rotate(0)}40%{transform:rotate(-45deg)}50%,90%{transform:rotate(-90deg)}}
#rot .arr{font-size:2rem;color:var(--gold);line-height:1;text-shadow:2px 2px 0 #000;animation:arrowA .8s steps(2) infinite}
#rot b{font-size:1.5rem;color:var(--gold);text-shadow:2px 2px 0 #140d12}
#rot small{color:var(--dim);max-width:280px;line-height:1.35}

#modal .box>.btn-main:last-child,#modal .box>.row:last-child{position:sticky;bottom:-4px;z-index:3;box-shadow:0 -6px 8px -2px #e8d8a8}
.res{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,210px),1fr));gap:0 10px;align-items:start}
.res p,.res .lvcard,.res .loot{margin:3px 0}
.banner{margin:0 0 4px}.banner h1{font-size:1.5rem}
`;
