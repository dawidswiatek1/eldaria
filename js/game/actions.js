/* ===== OBSŁUGA AKCJI ===== */
function xHead(k){const B=XB[k],p=k==='szept'?'szeptucha':'starszy';return `<div class="bhead"><div class="bimg">${prtImg(p)}</div><div class="binf"><div class="row1"><button class="btn-small" data-act="town" data-v="">${ic('back',16)}<span class="lbl"> ${NODES[S.loc].n}</span></button><h2>${ic(B.ic,20)} ${B.n}</h2></div><div class="sub">${B.d}</div></div></div>`}
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||!S)return;const a=el.dataset.act;
 switch(a){
 case 'world':closeModal();screen='world';render();break;
 case 'region':closeModal();screen='region';render();break;
 case 'ksel':wSel=el.dataset.k;render();break;
 case 'nsel':rSel=el.dataset.k;render();break;
 case 'rlv':mapSel={r:+el.dataset.r,L:+el.dataset.l};render();break;
 case 'travel':{const k=el.dataset.k;rSel=k;travel(k);break}
 case 'rgo':{const k=el.dataset.k,N=NODES[k],r=N.r,L=mapSel&&mapSel.r===r?mapSel.L:S.reg.lv[r];if(!partyHeroes().length){toast('Najpierw ustaw drużynę w formacji!');return}if(k===hereNode())startSiteExp(k,r,L);else travel(k,()=>startSiteExp(k,r,L));break}
 case 'polgo':{if(!partyHeroes().length){toast('Najpierw ustaw drużynę w formacji!');return}const go=()=>startSiteExp('polana',2,3,{st:Math.max(9,S.stage),nm:'Mglista Polana'});if(hereNode()==='polana')go();else travel('polana',go);break}
 case 'intown':closeModal();screen='camp';tab='town';townView=null;render();break;
 case 'rev':roadResolve(+el.dataset.i);break;
 case 'revok':{closeModal();const p=S.pend;if(p&&p.to){S.pend=null;const th=_then;_then=null;finishTravel(p.to,th)}else{screen='region';render()}break}
 case 'journal':closeModal();jFrom={screen,tab,townView};screen='journal';render();break;
 case 'jtab':jTab=el.dataset.t;render();break;
 case 'jback':{const f=jFrom||{screen:'camp',tab:'town',townView:null};screen=f.screen==='journal'?'camp':f.screen;tab=f.tab;townView=f.townView;render();break}
 case 'talk':{const t=TALK[el.dataset.k][+el.dataset.i];const d=typeof t.dlg==='function'?t.dlg():t.dlg;if(d)showDlg(d);else{townView='starszy';render()}break}
 case 'dopt':dlgOpt(+el.dataset.i);break;
 case 'dclose':closeModal();render();if(S.qPend){const d=S.qPend;S.qPend=null;save();setTimeout(()=>showDlg(d),60)}break;
 case 'qdlg':{const d=el.dataset.d;S.pend=null;save();screen='camp';tab='town';townView=null;render();showDlg(d);break}
 case 'inn':{if(S.gold<innCost())return;S.gold-=innCost();S.roster.forEach(h=>{const m=stats(h).maxHp;h.hp=Math.min(m,h.hp+Math.ceil((m-h.hp)/2))});save();toast('Wyspana kompania odzyskuje siły.');render();break}
 case 'szheal':if(S.gold<szHeal())return;S.gold-=szHeal();S.roster.forEach(h=>h.hp=stats(h).maxHp);rep('duchy',1);save();toast('Zioła Wili stawiają wszystkich na nogi.');render();break;
 case 'szinj':{const h=getHero(+el.dataset.id),k=el.dataset.k;if(!h||!h.inj.includes(k)||INJ[k].p)return;const c=szInj(h,k);if(S.gold<c)return;S.gold-=c;h.inj=h.inj.filter(x=>x!==k);if(h.hp>stats(h).maxHp)h.hp=stats(h).maxHp;save();toast(`${h.name.split(' ')[0]}: uraz odczyniony`);render();break}
 case 'rite':{const k=el.dataset.k;if(S.bless||S.gold<ritePrice(k))return;S.gold-=ritePrice(k);S.bless={name:RITES[k].n,fx:RITES[k].fx};rep('duchy',2);save();toast(`${RITES[k].n} – działa na następną wyprawę`);render();break}
 case 'lore':{const k=el.dataset.k;unlockLore(k);modal(loreHtml(k));break}
 case 'introok':closeModal();break;
 case 'tocamp':if(S.qPend){const d=S.qPend;S.qPend=null;save();setTimeout(()=>showDlg(d),80)}break;
 }});
let jFrom=null;
/* ===== PODPIĘCIA DO ISTNIEJĄCEJ GRY ===== */
const _expComplete=expComplete;expComplete=function(){const E=S&&S.exp;if(!E)return;if(E.road){roadDone();return}
 if(E.site==='polana'){const bonus=60+E.st*8;S.gold+=E.gold+bonus;bankLoot(E);partyHeroes().forEach(h=>h.exps=(h.exps||0)+1);const tw=expEndTown(E,false,true);questExp(E);S.exp=null;save();
  modal(`<div class="banner"><div class="rays"></div><h1>${ic('flag',24)} Mglista Polana</h1></div><div class="res"><p>${ic('gold',18)} Łupy: ${E.gold} + premia ${bonus} zł</p><p>Mgła rzednie. W samym środku kręgu kamieni czeka pieczęć…</p>${tw.map(t=>`<p>${t}</p>`).join('')}</div><button class="btn-main" data-act="tocamp">${ic('walk',22)} Podejdź do pieczęci</button>`);return}
 const n=questExp(E);_expComplete();if(n&&!S.qPend)toast('Dziennik: cel zadania wykonany!')};
const _expRetreat=expRetreat;expRetreat=function(){const E=S&&S.exp;if(E&&E.road){roadDone();return}_expRetreat()};
const _conEv=conEv;conEv=function(t,d){_conEv(t,d);if(t==='kill')questKill(d)};
const _expStart=expStartTown;expStartTown=function(E){_expStart(E);if(S.bless){expAddFx(E,S.bless.fx,S.bless.name);S.bless=null}partyHeroes().forEach(h=>{const U=h.uniq&&UNIQ[h.uniq];if(U)expAddFx(E,U.fx,U.fxn)})};
const _finExp=finishExpBattle;finishExpBattle=function(){const road=S&&S.exp&&S.exp.road;_finExp();if(road&&S&&!S.exp){S.pend=null;save()}};
const _genOffers=genOffers;genOffers=function(){_genOffers();const m=repMul('lud',1);if(m!==1)S.offers.forEach(o=>o.cost=Math.round(o.cost*m))};
