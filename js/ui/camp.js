/* ===== UI: OBÓZ ===== */
let _view='';
function toast(t){document.querySelectorAll('.toast').forEach(x=>x.remove());const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2100)}
function modal(html){const m=document.getElementById('modal');m.innerHTML=`<div class="box">${html}</div>`;m.classList.remove('hidden')}
function closeModal(){document.getElementById('modal').classList.add('hidden');if(B)B.paused=false}
function devBadge(h){const p=tFree(h);return (h.free?`<span class="badge">⬆ ${h.free} pkt</span>`:'')+(p?`<span class="badge">✨ ${p} tal.</span>`:'')}
function heroCard(h,btns,act){const c=CLASSES[h.cls],s=stats(h),r=h.hp/s.maxHp;return `<div class="card" data-act="${act||'hero'}" data-id="${h.id}"><div class="av c-${h.cls}">${bust(heroSprite(h),h.cls,64,2)}</div><div class="info"><div class="nm">${h.main?crown():''}${esc(h.name)}${devBadge(h)}</div><div class="sub">${c.name} · poz. ${h.lvl}${h.kills?` · ${ic('skull',12)}${h.kills}`:''} ${Object.values(h.eq).filter(Boolean).map(i=>`<span style="box-shadow:0 0 0 1px ${rcol(i)};display:inline-block;margin:0 1px;line-height:0">${ic(i.b,14)}</span>`).join('')}</div>${h.tr?`<div class="trn">${ic('train',12)} W treningu</div>`:''}${h.hosp>0?`<div class="trn hosp">${ic('b_lecznica',12)} W szpitalu: ${h.hosp} ${h.hosp>1?'wyprawy':'wyprawa'}</div>`:''}${h.inj&&h.inj.length?`<div class="injs">${injChips(h)}</div>`:''}<div class="bar ${r<.35?'low':''}"><i style="width:${r*100}%"></i></div><div class="stats"><span class="st">${ic('hp',14)}${h.hp}/${s.maxHp}</span><span class="st">${ic('atk',14)}${s.atk}</span><span class="st">${ic('def',14)}${s.def}</span><span class="st">${ic('spd',14)}${s.spd}</span></div><div class="bar xp"><i style="width:${h.xp/xpNeed(h.lvl)*100}%"></i></div></div><div class="actions">${btns||''}</div></div>`}
function itemHtml(it,btn,extra){const R=RAR[it.r];return `<div class="item r${it.r}" style="--rc:${R.c}"><div class="ii">${itIc(it)}</div><div class="inf"><div class="inm" style="color:${R.c}">${esc(it.n)}</div><div class="sub">${R.n} · ${SLOTS[it.s]}</div><div>${statStr(it.st)}${resStr(it.res)}</div>${it.cls?`<div class="sub">Tylko: ${it.cls.map(c=>CLASSES[c].name).join(', ')}</div>`:''}${extra||''}</div>${btn||''}</div>`}
function heroInfo(h){const c=CLASSES[h.cls],s=stats(h);return `<div class="herohead">${heroPortrait(h)}<div><div class="nm">${esc(h.name)}</div><div class="sub">${c.name} · poziom ${h.lvl}${c.role?`<br><b>${c.role}</b>`:''}<br>${c.desc}</div></div></div><div class="stats" style="font-size:.95rem;margin:8px 0">${fmtStat('hp',s.maxHp).replace('+','')}${fmtStat('atk',s.atk).replace('+','')}${fmtStat('def',s.def).replace('+','')}${fmtStat('spd',s.spd).replace('+','')}${fmtStat('crit',s.crit).replace('+','')}</div><div class="resrow"><span class="sub">Atak:</span>${dtChip(heroDt(h))}${resStr(s.res)}</div><h2>Umiejętności klasy</h2>${skillList(h)}<div class="sub" style="margin-top:6px">Drzewko talentów: ${TREE[h.cls].b.join(' · ')}</div><div class="row" style="margin-top:12px"><button data-act="close">Zamknij</button></div>`}
function skLine(h,k,extra,cls){const s=SK[k],un=k==='atak'||unlockedSk(h).includes(k),p=Math.round((PW(h,k)-1)*100),cd=cdOf(h,k),t=tOf(h,k);
 return `<div class="skill-line ${un?'':'locked'} ${cls||''}">${ic('sk_'+k,28)}<div style="flex:1;min-width:0"><b>${s.name}</b>${s.dt?' '+dtChip(s.dt==='wep'?heroDt(h):s.dt):''} ${skReachChip(h,k)}${cd?` <small>(odnowienie ${cd>=99?'raz na walkę':cd})</small>`:''}${p?` <small class="up">+${p}% mocy</small>`:''}${un?'':` <small>${ic('lock',12)} ${skReq(h,k)}</small>`}<br><small>${s.desc}${t!==s.t?' <b>(Kwiat życia: cała drużyna)</b>':''}</small></div>${extra||''}</div>`}
function skillList(h){return ['atak',...POOL[h.cls]].map(k=>skLine(h,k)).join('')}
/* drzewko talentów */
function treeHtml(h){const T=TREE[h.cls],free=tFree(h);
 let o=`<div class="tphead"><div>${ic('xp',22)} <b>Punkty talentów: <span class="${free?'gold':''}">${free}</span></b><small>1 punkt za każdy poziom od 2. Wydano: ${tSpent(h)}</small></div></div>`;
 o+=`<div class="tree"><div class="trow th">${T.b.map((n,b)=>`<div class="tbh">${ic(T.bi[b],20)}<b>${n}</b><small>${brPts(h,h.cls,b)} pkt</small></div>`).join('')}</div>`;
 for(let t=0;t<4;t++){o+=`<div class="trow">${T.n.map((br,b)=>{const x=br[t],st=tState(h,x),r=RK(h,x.id),can=canTake(h,x);
  const ln=t?`<i class="tl ${RK(h,br[t-1].id)?'on':''}"></i>`:'';
  return `<div class="tcell">${ln}<button class="tn s-${st}${t===3?' cap':''}${can?' can':''}" data-act="tnode" data-id="${x.id}" aria-label="${esc(x.n)}">${ic(x.ic,30)}<span class="rk">${r}/${x.r}</span>${x.un?'<span class="nw">NOWA</span>':''}</button><span class="tnm">${x.n}</span></div>`}).join('')}</div>`}
 o+=`</div><div class="sub" style="margin:8px 2px">${ic('lock',12)} Węzeł wymaga poprzedniego w gałęzi i punktów wydanych w gałęzi (2. rząd: 1, 3. rząd: 3, ostatni: 5). Reset talentów: Świątynia w Mieście.</div>`;return o}
function tnodeDetail(h,id){const x=TN[id];if(!x||x.cls!==h.cls)return;const r=RK(h,id),st=tState(h,x),T=TREE[h.cls],can=canTake(h,x);
 const req=[];if(x.t>0){const pv=T.n[x.b][x.t-1];req.push([`Poprzedni węzeł: ${pv.n}`,RK(h,pv.id)>0])}if(TREQ[x.t])req.push([`${TREQ[x.t]} pkt w gałęzi ${T.b[x.b]} (masz ${brPts(h,h.cls,x.b)})`,brPts(h,h.cls,x.b)>=TREQ[x.t]]);
 let o=`<div class="tdet"><div class="tn s-${st}${x.t===3?' cap':''}" style="pointer-events:none">${ic(x.ic,36)}</div><div><div class="nm" style="font-size:1.1rem">${x.n}</div><div class="sub">${T.b[x.b]} · ${x.t===3?'węzeł mistrzowski':'rząd '+(x.t+1)} · ranga ${r}/${x.r}</div></div></div>`;
 o+=`<p style="margin:8px 0">${r?`<b>Teraz:</b> ${tdesc(x,r)}`:tdesc(x,1)}</p>`;if(r&&r<x.r)o+=`<p style="margin:4px 0"><b>Następna ranga:</b> ${tdesc(x,r+1)}</p>`;
 if(x.un)o+=`<div class="skill-line" style="border:0">${ic('sk_'+x.un,28)}<div><b>${SK[x.un].name}</b><br><small>${SK[x.un].desc}</small></div></div>`;
 if(x.up&&x.up.sk&&!x.un)o+=`<div class="sub">Ulepsza: ${ic('sk_'+x.up.sk,14)} ${SK[x.up.sk].name}${unlockedSk(h).includes(x.up.sk)?'':' (jeszcze nieodblokowana: '+skReq(h,x.up.sk)+')'}</div>`;
 if(req.length&&r<x.r)o+=`<div class="treq">${req.map(([t,ok])=>`<div class="${ok?'ok':'no'}">${ok?'✔':'✖'} ${t}</div>`).join('')}</div>`;
 const why=r>=x.r?'Maksymalna ranga':!tFree(h)?'Brak punktów talentów':st==='locked'?'Niespełnione wymagania':'';
 o+=`<div class="row" style="margin-top:10px">${r<x.r?`<button class="btn-green" data-act="ttake" data-id="${id}" ${can?'':'disabled'}>${can?`✔ Wybierz (1 pkt)`:why}</button>`:`<button disabled>✔ ${why}</button>`}<button data-act="close">Zamknij</button></div>`;modal(o)}
/* zestaw umiejętności */
function loadoutHtml(h){const L=syncLoad(h),un=unlockedSk(h);
 let o=`<h2>${ic('sk_atak',20)} Zestaw do walki (${L.length}/${LOAD_MAX})</h2><div class="sub" style="margin-bottom:6px">Zabierasz do walki zwykły atak i maks. ${LOAD_MAX} umiejętności. Dotknij miejsca, aby zdjąć umiejętność.</div>`;
 o+=`<div class="lslots">${Array.from({length:LOAD_MAX},(_,i)=>{const k=L[i];return k?`<button class="lslot on" data-act="skoff" data-k="${k}">${ic('sk_'+k,30)}<span>${SK[k].name}</span></button>`:`<div class="lslot">${ic('lock',18,'dim')}<span>puste</span></div>`}).join('')}</div>`;
 o+=`<h2>${ic('xp',20)} Umiejętności klasy (${un.length}/${POOL[h.cls].length})</h2>`+POOL[h.cls].map(k=>{const on=L.includes(k),u=un.includes(k);
  const b=!u?'':on?`<button class="btn-small" data-act="skoff" data-k="${k}">Zdejmij</button>`:`<button class="btn-small btn-green" data-act="skon" data-k="${k}" ${L.length>=LOAD_MAX?'disabled':''}>Dodaj</button>`;return skLine(h,k,b,on?'eqd':'')}).join('');
 if(un.length>LOAD_MAX)o+=`<div class="sub" style="margin:6px 2px">Masz więcej umiejętności niż miejsc – zdejmij jedną, aby dodać inną.</div>`;return o}

function enterAnim(key){const app=document.getElementById('app');if(key!==_view){_view=key;app.classList.remove('enter');void app.offsetWidth;app.classList.add('enter')}}
function sceneLayers(bk,amb){const b=BIOMES.find(x=>x.k===bk)||BIOMES[0];const fx={las:'firefly',trakt:'dust',krypta:'wisp',gory:'snow',jama:'ember'}[b.k];
 return `<div class="ly ly-sky"></div><div class="ly ly-far"></div><div class="ly ly-cl"></div><div class="ly ly-mid"></div><div class="ly ly-gr"></div>${amb===false?'':`<div class="amb ${fx}">${Array.from({length:12},(_,i)=>`<i style="left:${(i*8.3+Math.random()*6).toFixed(1)}%;top:${(fx==='snow'?Math.random()*40:30+Math.random()*60).toFixed(1)}%;animation-delay:-${(Math.random()*7).toFixed(2)}s"></i>`).join('')}</div>`}`}
const canFs=()=>!!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen);
function goFull(){const d=document.documentElement,f=d.requestFullscreen||d.webkitRequestFullscreen;if(!f)return;try{const p=f.call(d,{navigationUI:'hide'});const lock=()=>{try{const o=screen.orientation;if(o&&o.lock)o.lock('landscape').catch(()=>{})}catch(e){}};if(p&&p.then)p.then(lock).catch(()=>{});else lock()}catch(e){}}
function howtoHtml(){return `<h2>${ic('map',20)} Jak grać?</h2><div class="howto2">
 <p>${ic('nav_town',16)} W <b>Mieście</b>: w <b>Karczmie</b> werbujesz wojowników (maks. ${TEAM_MAX} w drużynie), w <b>Świątyni</b> leczysz rannych i resetujesz talenty, u <b>Kowala</b> kupujesz i sprzedajesz przedmioty.</p>
 <p>${ic('nav_team',16)} Dotknij bohatera, by założyć mu <b>ekwipunek</b> (widać go na postaci), rozdać <b>punkty cech</b>, rozwijać <b>drzewko talentów</b> (3 gałęzie na klasę) i wybrać <b>zestaw 4 umiejętności</b> do walki.</p>
 <p>${ic('map',16)} <b>Wyprawy</b>: wybierz krainę i poziom, prowadź drużynę korytarzem przez komnaty – walki, skrzynie, wydarzenia i obozowiska. Rany nie goją się po drodze. Na końcu czeka elita lub boss. Możesz się wycofać (tracisz połowę złota z wyprawy).</p>
 <p>${ic('nav_team',16)} <b>Formacja</b>: 2 miejsca z przodu, 3 z tyłu. Walczący <b>wręcz</b> trafiają tylko 1. rząd wroga, dopóki ktoś w nim stoi; <b>dystansowi</b> – dowolny cel.</p>
 <p>${ic('fight',16)} W walce wybierz umiejętność na dolnym pasku, potem dotknij celu. Przytrzymaj postać, by zobaczyć jej odporności. Co 5 etapów czeka <b>boss</b>, a kraina się zmienia.</p>
 <p>${crown(1.2)} Twój <b>bohater główny</b> nigdy nie ginie – najwyżej zostaje pokonany. ${ic('skull',16)} Towarzysz przy 0 PŻ leży <b>na skraju śmierci</b>: wygrana albo odwrót go ratują (czeka go szpital i może odnieść trwały uraz), ale przegrana lub dobicie oznacza <b>śmierć na zawsze</b> – razem z ekwipunkiem.</p></div><button class="btn-main" data-act="close">Rozumiem!</button>`}
function titleHtml(){const has=hasSave(),ps=LH()<360?1.5:2;
 const party=['wojownik','lucznik','mag','kaplan','lotr','paladyn'].map((k,i)=>animBox(heroAnim(k,{},null,i%2?'k':'m'),ps,'tu',`margin:0 -${Math.round(11*ps)}px;z-index:${i%2?2:3};top:${i%2?Math.round(4*ps):0}px`)).join('');
 const foes=[['goblin',0],['wilk',4],['ork',0]].map(([k,dy])=>animBox(enemyAnim(k,true),ps*.75,'tu',`margin-left:-${Math.round(4*ps)}px;top:${dy}px`)).join('');
 return `<div class="title"><div class="tscene bg-title">${sceneLayers('trakt')}<div class="logo">${emb(40)}<b>Eldaria</b><small>Kronika wędrownej kompanii</small></div><div class="tparty">${party}</div><div class="tfoes">${foes}</div></div>
 <div class="tmenu">${loadMsg?`<div class="note">${esc(loadMsg)}</div>`:''}${has?`<button class="btn-main" data-act="continue">${ic('auto',22)} Kontynuuj</button>`:''}<button class="${has?'':'btn-main'}" data-act="new">${ic('xp',20)} Nowa gra</button>
 <div class="row"><button data-act="howto">${ic('map',18)} Jak grać?</button><button data-act="snd" class="sndb" aria-label="Dźwięk" style="flex:0 0 auto;padding-left:12px;padding-right:12px">${ic('sk_ballada',20)}</button>${canFs()?`<button data-act="fs" id="b-fs">${ic('speed',18)} Pełny ekran</button>`:''}</div>
 <div class="feat"><span>${ic('nav_team',16)} 9 klas</span><span>${ic('map',16)} Królestwo Velesii</span><span>${ic('nav_town',16)} 5 miast</span><span>${ic('contract',16)} Zadania i rozmowy</span><span>${ic('boss',16)} Bossowie</span></div>
 ${best()?`<div class="rec">${ic('boss',16)} Rekord: etap ${best()}</div>`:''}</div></div>`}
function render(){const m=document.querySelector('.main'),st=m?m.scrollTop:0,k=_view;_render();const n=document.querySelector('.main');if(n&&_view===k&&st)n.scrollTop=st}
function _render(){applySpeed();if(S){syncForm();townOk()}const app=document.getElementById('app');if(!GFX_READY)return;
 if(screen==='title'){enterAnim('title');app.innerHTML=titleHtml();return}
 if(screen==='battle'){if(document.getElementById('scene'))refreshBattle();else{enterAnim('battle');buildBattle()}return}
 if(screen==='hero'){enterAnim('hero'+curHero+htab);renderHero();return}
 if(screen==='map'){enterAnim('map');renderMap();return}
 if(screen==='exp'){enterAnim('exp');renderExp();return}
 if(screen==='world'){enterAnim('world');renderWorld();return}
 if(screen==='region'){enterAnim('region');renderRegion();return}
 if(screen==='journal'){enterAnim('journal');renderJournal();return}
 if(tab==='town'&&!townView){enterAnim('town'+(S.loc||''));renderTown();return}
 enterAnim('camp'+tab+(townView||''));
 const team=S.team.map(getHero).filter(Boolean),reserve=S.roster.filter(h=>!S.team.includes(h.id));let body='';
 const hurt=S.roster.some(h=>h.hp<stats(h).maxHp),boss=S.stage%5===0,bio=biomeOf(S.stage);
 const backT=(t,i)=>`<div class="row" style="align-items:center;margin:4px 0 2px"><button class="btn-small" style="flex:0 0 auto" data-act="town" data-v="">${ic('back',16)} ${NODES[S.loc]?NODES[S.loc].n:'Miasto'}</button><h2 style="margin:0">${ic(i,22)} ${t}</h2></div>`;
 if(tab==='team'){
  body+=`<div class="subtabs"><button class="${teamView!=='armory'?'on':''}" data-act="tview" data-v="heroes">${ic('nav_team',18)} Bohaterowie</button><button class="${teamView==='armory'?'on':''}" data-act="tview" data-v="armory">${ic('bag',18)} Zbrojownia</button></div>`;
 }
 if(tab==='team'&&teamView==='armory'){body+=armoryHtml()}
 else if(tab==='team'){
  body+=`<h2>${ic('nav_team',20)} Formacja (${team.length}/${TEAM_MAX})</h2>`+formHtml();
  body+=`<h2>${ic('nav_team',20)} Drużyna (${team.length}/${TEAM_MAX})</h2><div class="sub" style="margin-bottom:6px">Dotknij bohatera, aby zmienić ekwipunek i rozwój.</div>`+(team.length?'<div class="cols">'+team.map(h=>heroCard(h,`<button class="btn-small" data-act="bench" data-id="${h.id}">▼ Rezerwa</button>`)).join('')+'</div>':`<div class="empty">Nikogo w drużynie. Zwerbuj kogoś w Karczmie!</div>`);
  if(hurt)body+=`<div class="sub" style="margin:4px 0">${ic('temple',16)} Ranni bohaterowie? Odwiedź <b>Świątynię</b> lub <b>Szpital</b> w zakładce Miasto.</div>`;
  body+=`<h2>Rezerwa (${reserve.length})</h2>`+(reserve.length?'<div class="cols">'+reserve.map(h=>heroCard(h,`<button class="btn-small" data-act="join" data-id="${h.id}" ${team.length>=TEAM_MAX||h.tr||h.hosp?'disabled':''}>${h.tr?ic('train',12)+' Trening':h.hosp?ic('b_lecznica',12)+' Szpital':'▲ Drużyna'}</button>`)).join('')+'</div>':`<div class="empty">Rezerwa jest pusta.</div>`);
 }else if(tab==='town'&&typeof XVIEW!=='undefined'&&XVIEW[townView]){body+=XVIEW[townView]()
 }else if(tab==='town'&&svcGuard(townView)){body+=svcGuard(townView)
 }else if(tab==='town'&&townView==='szept'){body+=xHead('szept')+szeptHtml()
 }else if(tab==='town'&&townView==='starszy'){body+=xHead('starszy')+elderHtml()
 }else if(tab==='town'&&BV[townView]&&!['temple','tavern','smith'].includes(townView)){body+=bldView(townView)
 }else if(tab==='town'&&townView==='temple'){
  body+=bldHead('swiatynia');
  body+=`<div class="sub" style="margin-bottom:8px">Kapłani opatrzą rany całej kompanii (drużyna i rezerwa). Poległych nie da się wskrzesić.</div>`;
  const inj=S.roster.filter(h=>h.hp<stats(h).maxHp);
  body+=inj.length?'<div class="cols">'+inj.map(h=>heroCard(h,'')).join('')+'</div>':`<div class="empty">Wszyscy bohaterowie są w pełni sił.</div>`;
  body+=`<button class="btn-green" style="width:100%;margin-top:6px" data-act="rest" ${!hurt||S.gold<restCost()?'disabled':''}>${ic('sk_leczenie',20)} Ulecz wszystkich – pełne zdrowie (${restCost()} ${ic('gold',16)})</button>`;
  const tr=S.roster.filter(h=>tSpent(h)>0);body+=`<h2>${ic('xp',20)} Reset talentów</h2><div class="sub" style="margin-bottom:6px">Kapłani pomogą bohaterowi zapomnieć wybrane talenty – odzyska wszystkie punkty talentów.</div>`;
  body+=tr.length?'<div class="cols">'+tr.map(h=>`<div class="item treset"><div class="ii">${bust(heroSprite(h),h.cls,40,1,-6)}</div><div class="inf"><div class="inm">${esc(h.name)}</div><div class="sub">${CLASSES[h.cls].name} · poz. ${h.lvl} · wydane punkty: ${tSpent(h)}</div></div><button class="btn-small btn-gold" data-act="tresetq" data-id="${h.id}" ${S.gold<talReset(h)?'disabled':''}>${talReset(h)} ${ic('gold',14)}</button></div>`).join('')+'</div>':`<div class="empty">Nikt nie ma jeszcze wydanych talentów.</div>`;
 }else if(tab==='town'&&townView==='tavern'){
  body+=bldHead('karczma')+innHtml();const OF=S.offers.slice(0,curTown().off);body+=`<div class="sub" style="margin-bottom:8px">Ochotnicy gotowi do walki (${NODES[S.loc].n}: ${OF.length}). Bohaterów: ${S.roster.length}/${rosterMax()}</div>`;
  body+=OF.length?'<div class="cols">'+OF.map((o,i)=>heroCard(o.hero,`<button class="btn-small btn-gold" data-act="recruit" data-i="${i}" ${S.gold<o.cost||S.roster.length>=rosterMax()?'disabled':''}>${o.cost} ${ic('gold',14)}</button>`,'offerinfo').replace(`data-id="${o.hero.id}"`,`data-i="${i}"`)).join('')+'</div>':`<div class="empty">Brak ochotników. Wróć po następnej walce.</div>`;
  body+=`<button style="width:100%" data-act="reroll" ${S.gold<15?'disabled':''}>${ic('reroll',18)} Nowi ochotnicy (15 ${ic('gold',14)})</button>`;
 }else if(tab==='town'&&townView==='smith'){
  body+=bldHead('kowal');body+=`<div class="sub" style="margin-bottom:8px">Plecak: ${S.inv.length}/${INV_MAX}</div>`;
  body+=S.shop.length?'<div class="cols">'+S.shop.map((it,i)=>itemHtml(it,`<button class="btn-small btn-gold" data-act="buy" data-i="${i}" ${S.gold<it.price||S.inv.length>=INV_MAX?'disabled':''}>${it.price} ${ic('gold',14)}</button>`)).join('')+'</div>':`<div class="empty">Kowal wszystko sprzedał.</div>`;
  body+=`<button style="width:100%" data-act="shopreroll" ${S.gold<20?'disabled':''}>${ic('reroll',18)} Nowy towar (20 ${ic('gold',14)})</button>`;
  body+=`<h2>${ic('bag',20)} Twój plecak (${S.inv.length}/${INV_MAX})</h2><div class="sub" style="margin-bottom:6px">Wspólny dla całej kompanii. Zakładasz przedmioty na ekranie bohatera.</div>`+(S.inv.length?'<div class="cols">'+S.inv.slice().sort((a,b)=>b.r-a.r).map(it=>itemHtml(it,`<button class="btn-small" data-act="sell" data-id="${it.id}">Sprzedaj<br>+${sellPrice(it)} ${ic('gold',14)}</button>`)).join('')+'</div>':`<div class="empty">Plecak jest pusty.</div>`);
 }else{
  body+=`<h2>${ic('nav_fallen',20)} Polegli bohaterowie</h2><div class="sub" style="margin-bottom:6px">Ekwipunek poległych przepada razem z nimi.</div>`+(S.fallen.length?'<div class="cols">'+S.fallen.map(f=>`<div class="card" style="opacity:.85"><div class="av" style="background:#222;filter:grayscale(1)">${bust(sprite(f.cls),f.cls,64,2)}</div><div class="info"><div class="nm">✝ ${esc(f.name)}</div><div class="sub">${CLASSES[f.cls].name} · poz. ${f.lvl} · pokonanych wrogów: ${f.kills}</div><div class="sub">${gf(f,'Poległ','Poległa')} na etapie ${f.stage}, ${gf(f,'zabity','zabita')} przez: ${esc(f.by)}</div>${f.items&&f.items.length?`<div class="sub">Pogrzebany z: ${esc(f.items.join(', '))}</div>`:''}</div></div>`).join('')+'</div>':`<div class="empty">Nikt jeszcze nie zginął. Oby tak zostało…</div>`);
 }
 const nb=S.roster.some(h=>h.free||tFree(h));
 app.innerHTML=`<div class="camp"><nav class="side"><div class="srow"><span class="pill gold">${ic('gold',18)} ${S.gold}</span><button class="btn-small" data-act="menu" aria-label="Menu">${ic('gear',20)}</button></div>
 <span class="pill stg">${emb(18)}<span>${NODES[S.loc].n}<small>${S.exp?'trwa wyprawa':'Velesia · '+(qActive().length?'zadania: '+qActive().length:'brak zadań')}</small></span></span>
 <div class="tabs vt"><button class="${tab==='team'?'on':''}" data-act="tab" data-t="team">${ic('nav_team',22)} Drużyna${nb?'<span class="badge">!</span>':''}</button><button class="${tab==='town'?'on':''}" data-act="tab" data-t="town">${ic('nav_town',22)} ${NODES[S.loc].n}</button><button class="${tab==='fallen'?'on':''}" data-act="tab" data-t="fallen">${ic('nav_fallen',22)} Polegli</button></div>
 <button class="btn-main fightb" data-act="map" ${team.length?'':'disabled'}><span>${ic(S.exp?'walk':'map',22)} ${S.exp?'Wyprawa':'Mapa'}</span><small>${S.exp?'wróć do korytarza':'podróże i wyprawy'}</small></button></nav>
 <main class="main">${body}</main></div>`;
}
