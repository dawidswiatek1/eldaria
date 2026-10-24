/* ===== OBSŁUGA DOTYKU ===== */
document.addEventListener('click',e=>{if(_lp){_lp=false;e.preventDefault();return}const el=e.target.closest('[data-act]');if(!el)return;const a=el.dataset.act;
 if(el.id==='modal'){if(e.target.closest('.box'))return;closeModal();return}
 switch(a){
 case 'close':closeModal();break;
 case 'new':if(hasSave()&&!confirm('Rozpocząć nową grę? Obecny postęp zostanie utracony.'))return;modal(creatorHtml());break;
 case 'continue':{const s=load();if(!s){render();return}S=s;save();screen=S.exp?'exp':'camp';tab='team';render();if(loadMsg){modal(`<h2>${ic('xp',20)} Aktualizacja gry</h2><p>${esc(loadMsg)}</p><button class="btn-main" data-act="close">Dobrze!</button>`);loadMsg=''}break}
 case 'tab':tab=el.dataset.t;townView=null;render();window.scrollTo(0,0);break;
 case 'town':tab='town';townView=el.dataset.v||null;render();window.scrollTo(0,0);break;
 case 'hero':if(e.target.closest('button'))return;curHero=+el.dataset.id;htab='eq';selSlot=null;screen='hero';render();window.scrollTo(0,0);break;
 case 'offerinfo':if(e.target.closest('button'))return;modal(heroInfo(S.offers[+el.dataset.i].hero));break;
 case 'recruit':{const o=S.offers[+el.dataset.i];if(!o||S.gold<o.cost||S.roster.length>=rosterMax())return;S.gold-=o.cost;S.roster.push(o.hero);if(S.team.length<TEAM_MAX)S.team.push(o.hero.id);S.offers.splice(+el.dataset.i,1);save();toast(`${o.hero.name} dołącza do kompanii!`);render();break}
 case 'reroll':if(S.gold<15)return;S.gold-=15;genOffers();save();render();break;
 case 'buy':{const it=S.shop[+el.dataset.i];if(!it||S.gold<it.price||S.inv.length>=INV_MAX)return;S.gold-=it.price;S.shop.splice(+el.dataset.i,1);S.inv.push(it);save();toast(`Kupiono: ${it.n}`);render();break}
 case 'sell':{const i=S.inv.findIndex(x=>x.id===el.dataset.id);if(i<0)return;const it=S.inv[i];S.gold+=sellPrice(it);S.inv.splice(i,1);save();toast(`Sprzedano za ${sellPrice(it)}💰`);render();break}
 case 'shopreroll':if(S.gold<20)return;S.gold-=20;genShop();save();render();break;
 case 'fslot':{const i=+el.dataset.i;if(formSel==null)formSel=i;else if(formSel===i)formSel=null;else{syncForm();const a=S.slots[formSel];S.slots[formSel]=S.slots[i];S.slots[i]=a;S.team=S.slots.filter(x=>x!=null);formSel=null;save()}refreshForm();break}
 case 'formq':formSel=null;modal(formModal());break;
 case 'bench':S.team=S.team.filter(id=>id!==+el.dataset.id);save();render();break;
 case 'join':if(S.team.length<TEAM_MAX&&!S.team.includes(+el.dataset.id)){S.team.push(+el.dataset.id);save();render()}break;
 case 'back':screen=S.exp&&screen==='hero'?'exp':'camp';render();break;
 case 'htab':htab=el.dataset.t;render();break;
 case 'slot':if(e.target.closest('button'))return;selSlot=selSlot===el.dataset.s?null:el.dataset.s;render();break;
 case 'equip':{const h=getHero(curHero),i=S.inv.findIndex(x=>x.id===el.dataset.id);if(!h||i<0)return;const it=S.inv[i];if(!canEquip(h,it))return;changeHero(h,()=>{S.inv.splice(i,1);if(h.eq[it.s])S.inv.push(h.eq[it.s]);h.eq[it.s]=it});save();toast(`Założono: ${it.n}`);render();break}
 case 'unequip':{const h=getHero(curHero),sl=el.dataset.s;if(!h||!h.eq[sl])return;if(S.inv.length>=INV_MAX){toast('Plecak jest pełny!');return}changeHero(h,()=>{S.inv.push(h.eq[sl]);h.eq[sl]=null});save();render();break}
 case 'pt':{const h=getHero(curHero),k=el.dataset.k;if(!h||!h.free)return;changeHero(h,()=>{h.pts[k]++;h.free--});save();render();break}
 case 'tnode':{const h=getHero(curHero);if(h)tnodeDetail(h,el.dataset.id);break}
 case 'ttake':{const h=getHero(curHero),x=TN[el.dataset.id];if(!h||!canTake(h,x))return;changeHero(h,()=>{h.tal[x.id]=(h.tal[x.id]||0)+1});const nu=x.un&&syncLoad(h).includes(x.un);save();toast(`${x.n} – ranga ${h.tal[x.id]}/${x.r}`+(x.un?(nu?` · ${SK[x.un].name} w zestawie`:` · nowa umiejętność: ${SK[x.un].name}`):''));const y=window.scrollY;render();window.scrollTo(0,y);if(h.tal[x.id]<x.r&&tFree(h))tnodeDetail(h,x.id);else closeModal();break}
 case 'skon':{const h=getHero(curHero),k=el.dataset.k;if(!h||!unlockedSk(h).includes(k))return;syncLoad(h);if(h.load.length>=LOAD_MAX||h.load.includes(k))return;h.load.push(k);save();render();break}
 case 'skoff':{const h=getHero(curHero),k=el.dataset.k;if(!h)return;syncLoad(h);h.load=h.load.filter(x=>x!==k);save();render();break}
 case 'tresetq':{const h=getHero(+el.dataset.id);if(!h)return;modal(`<h2>${ic('xp',20)} Reset talentów</h2><p>${esc(h.name)} zapomni wszystkie talenty i odzyska ${tSpent(h)} pkt. Umiejętności z talentów zostaną zdjęte z zestawu.</p><div class="row"><button class="btn-gold" data-act="treset" data-id="${h.id}" ${S.gold<talReset(h)?'disabled':''}>Resetuj za ${talReset(h)} ${ic('gold',14)}</button><button data-act="close">Anuluj</button></div>`);break}
 case 'treset':{const h=getHero(+el.dataset.id);if(!h||S.gold<talReset(h))return;S.gold-=talReset(h);changeHero(h,()=>{h.tal={}});syncLoad(h);save();closeModal();toast(`${h.name.split(' ')[0]}: talenty zresetowane`);render();break}
 case 'rest':if(S.gold<restCost())return;S.gold-=restCost();S.roster.forEach(h=>h.hp=stats(h).maxHp);save();toast('🙏 Kapłani uleczyli kompanię – pełne zdrowie!');render();break;
 case 'fight':startBattle();break;
 case 'howto':modal(howtoHtml());break;
 case 'fs':goFull();break;
 case 'menu':modal(`<h2>${ic('gear',20)} Menu</h2><p>Wygrane walki: ${S.wins} · Rekord: etap ${best()}<br>Kraina: ${esc(biomeOf(S.stage).n)}</p><div class="actions"><button data-act="snd">${ic('sk_ballada',18)} Dźwięk i muzyka</button><button data-act="speed">${ic('speed',18)} Prędkość animacji: ×${SET.speed}</button>${canFs()?`<button data-act="fs">${ic('speed',18)} Pełny ekran</button>`:''}<button data-act="totitle">${ic('back',18)} Ekran tytułowy</button><button class="btn-red" data-act="reset">${ic('skull',18)} Zacznij od nowa</button><button data-act="close">Zamknij</button></div>`);break;
 case 'totitle':closeModal();screen='title';render();break;
 case 'reset':if(confirm('Na pewno? Cały postęp zostanie usunięty.')){localStorage.removeItem(SAVE_KEY);S=null;screen='title';render();modal(creatorHtml())}break;
 case 'speed':SET.speed=SET.speed===1?2:SET.speed===2?3:1;saveSet();applySpeed();if(screen==='battle')refreshBattle();else{closeModal();render()}break;
 case 'logt':{SET.logOpen=!SET.logOpen;saveSet();const l=document.getElementById('log');if(l){l.classList.toggle('open',!!SET.logOpen);l.scrollTop=l.scrollHeight}break}
 case 'auto':SET.auto=!SET.auto;saveSet();refreshBattle();if(SET.auto&&B&&B.awaiting)autoAct(B.active);break;
 case 'skill':{if(!B||!B.awaiting)return;const k=el.dataset.k;if((B.active.cd[k]||0)>0)return;B.sel=k;refreshBattle();break}
 case 'use':if(B&&B.awaiting)doAction(B.active,B.sel);break;
 case 'unit':{if(!B)return;const u=B.units.find(x=>x.uid===el.dataset.uid);if(!u)return;if(B.awaiting&&isTarget(u)){doAction(B.active,B.sel,u);return}if(!B.awaiting||!u.alive){unitInfo(u);return}if(noReach(u)){flt(u,'Osłonięty','miss');toast('Najpierw pokonaj pierwszy rząd – albo użyj ataku dystansowego.');return}if(u.side==='e'&&tOf(B.active,B.sel)!=='enemy'&&canReach(B.active,u,'atak')){B.sel='atak';doAction(B.active,'atak',u)}else unitInfo(u);break}
 case 'tview':teamView=el.dataset.v;render();break;
 case 'af':{const k=el.dataset.k;if(k==='c'){const cs=['',...Object.keys(CLASSES)];AF.c=cs[(cs.indexOf(AF.c)+1)%cs.length]}else if(k==='o'){const os=['r','s','v','h'];AF.o=os[(os.indexOf(AF.o)+1)%os.length]}else AF[k]=k==='r'?+el.dataset.v:el.dataset.v;render();break}
 case 'armitem':armConfirm=false;armDetail(el.dataset.id);break;
 case 'armdet':armConfirm=false;armDetail(el.dataset.id);break;
 case 'armequip':{const x=findItem(el.dataset.id),to=getHero(+el.dataset.h);if(!x||!to||!canEquip(to,x.it))return;if(moveItem(x.it,x.h,to)){toast(`${to.name.split(' ')[0]} zakłada: ${x.it.n}`);closeModal();render()}break}
 case 'armunequip':{const x=findItem(el.dataset.id);if(!x||!x.h)return;if(moveItem(x.it,x.h,null)){toast(`Zdjęto: ${x.it.n}`);closeModal();render()}break}
 case 'armsell':{const x=findItem(el.dataset.id);if(!x||x.h)return;if(x.it.r>=1){armConfirm=true;armDetail(x.it.id);return}}
 case 'armsellok':{const x=findItem(el.dataset.id);if(!x||x.h)return;S.inv.splice(S.inv.findIndex(i=>i.id===x.it.id),1);S.gold+=sellPrice(x.it);armConfirm=false;save();toast(`Sprzedano za ${sellPrice(x.it)} zł`);closeModal();render();break}
 case 'tocamp':closeModal();screen='camp';tab='team';B=null;render();window.scrollTo(0,0);break;
 case 'gameover':closeModal();screen='title';render();break;
 }});
document.getElementById('modal').dataset.act='modal';
/* przytrzymanie postaci w walce = karta informacji */
let _lp=false,_lpT=null;
document.addEventListener('pointerdown',e=>{const el=e.target.closest('.unit');if(!el||!B)return;clearTimeout(_lpT);_lpT=setTimeout(()=>{const u=B&&B.units.find(x=>x.uid===el.dataset.uid);if(u){_lp=true;unitInfo(u);setTimeout(()=>{_lp=false},700)}},450)});
['pointerup','pointercancel','pointermove'].forEach(ev=>document.addEventListener(ev,e=>{if(ev==='pointermove'&&Math.abs(e.movementX)+Math.abs(e.movementY)<4)return;clearTimeout(_lpT)}));
document.addEventListener('contextmenu',e=>{if(e.target.closest('.unit'))e.preventDefault()});
const GAME_BOOT=loadGfx(); /* start ładowania grafik; pierwszy render robi js/main.js, gdy wczytają się wszystkie pliki */
