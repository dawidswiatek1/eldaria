/* ===== MIASTA VELESII: nie każde miasto ma wszystko ===== */
const ALLB=['zamek','karczma','kowal','swiatynia','targ','koszary','lecznica','alchemik','zaklinacz','cmentarz','gildia'];
const TOWNS={
 weleszow:{svc:ALLB,off:5,pano:'p_weleszow'},
 dabrowa:{svc:['karczma','alchemik','szept'],off:3,gosp:'Gospoda „Pod Starym Dębem”',alch:'Kupiec zielarski'},
 kregoszew:{svc:['karczma','kowal','koszary','zamek'],off:3,gosp:'Gospoda „Pod Strażnicą”',zamek:'Komendantura grodu'},
 sanow:{svc:['karczma','targ','gildia'],off:8,gosp:'Gospoda „Pod Kotwicą”',targ:'Kupcy portowi'},
 kurhanow:{svc:['karczma','cmentarz','starszy'],off:3,gosp:'Karczemka u Mogił',cmentarz:'Kurhany przodków'},
 /* wsie */
 brzezina:{svc:['karczma'],off:2,gosp:'Karczma „Pod Brzozą”'},
 olszynow:{svc:['karczma','targ'],off:2,gosp:'Karczma „Złoty Kłos”',targ:'Jarmark wiejski'},
 mokradla:{svc:['karczma','alchemik'],off:1,gosp:'Karczma na palach',alch:'Zielarz z grobli'},
 ustronie:{svc:['karczma'],off:1,gosp:'Karczma „Pod Lipą”'},
 wschodnia:{svc:['karczma','targ'],off:2,gosp:'Gospoda „Ostatni Postój”',targ:'Targ pasterski'}
};
const XB={szept:{n:'Szeptunka',ic:'ziola',t:'zioła i obrzędy',d:'Leczenie ziołami, odczynianie urazów i obrzędy przed wyprawą.'},starszy:{n:'Starszy osady',ic:'event',t:'opowieści',d:'Najstarszy z mieszkańców pamięta legendy o przodkach i Asterionie.'}};
const curTown=()=>TOWNS[S&&S.loc]||TOWNS.weleszow;
const hasSvc=k=>curTown().svc.includes(k);
const bName=k=>(curTown()[k])||(BUILD[k]?BUILD[k].n:XB[k].n);
const VIEW_B=v=>v==='szept'||v==='starszy'?v:BV[v];
/* małe miasto: panorama + usługi + rozmowy */
function renderSmallTown(){const k=S.loc,N=NODES[k];
 /* ciekawe miejsce: obóz w polu */
 if(N&&N.ty==='poi'){renderField();return}
 const T=TOWNS[k],app=document.getElementById('app'),nb=S.roster.some(h=>h.free||tFree(h));
 const svc=T.svc.map(b=>{const B=BUILD[b]||XB[b],v=B.v||b,al=BUILD[b]&&bldAlert(b);return `<button class="svc" data-act="town" data-v="${v}">${ic(B.ic,28)}<span><b>${bName(b)}</b><small>${b==='karczma'?`werbunek (${Math.min(T.off,S.offers.length)}) · nocleg`:B.t}</small></span>${al?'<em>!</em>':''}</button>`}).join('');
 app.innerHTML=`<div class="townv stown"><div class="ttop"><button class="btn-small" data-act="tab" data-t="team">${ic('nav_team',18)}<span class="lbl">Drużyna</span>${nb?'<span class="badge">!</span>':''}</button><button class="btn-small" data-act="tab" data-t="fallen" aria-label="Polegli">${ic('nav_fallen',18)}</button>
 <h2>${ic(N.ic,20)} ${N.n}</h2><button class="btn-small" data-act="journal">${ic('contract',18)}<span class="lbl"> Dziennik</span>${qBadge()}</button><span class="pill gold">${ic('gold',18)} ${S.gold}</span><button class="btn-small" data-act="menu" aria-label="Menu">${ic('gear',18)}</button><button class="btn-main tgo" data-act="map" ${S.team.length?'':'disabled'}>${ic(S.exp?'walk':'map',20)} Mapa</button></div>
 <div class="stbody"><div class="stpano" style="background-image:url(${VART['p_'+k]})"><div class="stcap"><b>${N.n}</b><small>${N.t}</small></div></div>
 <div class="stside"><p class="nd">${N.d}</p><div class="svcs">${svc}</div>${talkHtml(k)}</div></div></div>`;
 /* v18: tablica ogłoszeń, kupiec osobliwości i scena miasta */
 if(!NODES[k]||NODES[k].ty!=='town')return;
 const sv=document.querySelector('.stside .svcs');if(sv&&!SCN[k])sv.insertAdjacentHTML('beforeend',`<button class="svc" data-act="town" data-v="tablica">${ic('contract',28)}<span><b>Tablica ogłoszeń</b><small>zlecenia na bestie</small></span>${tabAlert()?'<em>!</em>':''}</button>`);
 if(sv&&k==='sanow')sv.insertAdjacentHTML('beforeend',`<button class="svc" data-act="town" data-v="osobl">${ic('bag',28)}<span><b>Kupiec osobliwości</b><small>rzadkie przedmioty</small></span></button>`);
 if(sv&&SCN[k])sv.insertAdjacentHTML('beforeend',`<button class="svc" data-act="town" data-v="tablica">${ic('contract',28)}<span><b>Tablica ogłoszeń</b><small>zlecenia na bestie</small></span>${tabAlert()?'<em>!</em>':''}</button>`);
 const p=document.querySelector('.stpano');if(p&&SCN[k]){p.classList.add('hasscn');p.style.backgroundImage='none';p.insertAdjacentHTML('afterbegin',`<img class="sblur" src="${VART18[SCN[k].img]}" alt="" aria-hidden="true">`+scnHtml(k))}}
function talkHtml(k){const L=(TALK[k]||[]).filter(t=>!t.when||t.when());if(!L.length)return '';return `<h3>${ic('event',16)} Rozmowy</h3><div class="talks">${L.map((t,i)=>`<button class="talk" data-act="talk" data-k="${k}" data-i="${TALK[k].indexOf(t)}"><img class="px" src="${VART['n_'+t.p]}" alt=""><span><b>${t.who}</b><small>${typeof t.s==='function'?t.s():t.s}</small></span>${t.nw&&t.nw()?'<em>!</em>':''}</button>`).join('')}</div>`}
const talkNew=k=>(TALK[k]||[]).some(t=>(!t.when||t.when())&&t.nw&&t.nw());
/* gospoda: nocleg w każdym mieście */
const innCost=()=>Math.round(restCost()*.45);
function innHtml(){const hurt=S.roster.some(h=>h.hp<stats(h).maxHp);return `<div class="inn"><span>${ic('camp',22)} <b>Nocleg</b><small>Ciepła strawa i łóżko: każdy odzyskuje połowę brakującego zdrowia.</small></span><button class="btn-small btn-gold" data-act="inn" ${!hurt||S.gold<innCost()?'disabled':''}>${innCost()} ${ic('gold',14)}</button></div>`}
/* szeptunka (Dąbrowa) */
const repMul=(k,good)=>{const v=(S.rep&&S.rep[k])||0;return v>=20?(good?.85:1.15):v<=-20?(good?1.2:.85):1};
const szHeal=()=>Math.round(restCost()*.7*repMul('duchy',1));
const szInj=(h,k)=>Math.max(10,Math.round(injCost(h,k)*.6*repMul('duchy',1)));
const RITES={
 welesa:{n:'Błogosławieństwo Welesa',d:'+10% obrony i +10% leczenia',fx:{defP:.1,heal:.1},p:60},
 krwi:{n:'Zamawianie krwi',d:'+8% szansy na trafienie krytyczne',fx:{crit:8},p:60},
 upiory:{n:'Obrona przed upiorami',d:'+25% odporności na mrok',fx:{res:{mrok:25}},p:50},
 ognia:{n:'Ogień Swarożyca',d:'+10% ataku',fx:{atkP:.1},p:70}};
const ritePrice=k=>Math.round(RITES[k].p*repMul('duchy',1));
function szeptHtml(){const hurt=S.roster.some(h=>h.hp<stats(h).maxHp);let b=`<div class="sub" style="margin-bottom:6px">Stara Wila zbiera zioła przy kręgu kamieni. Leczy taniej niż kapłani – i inaczej.${S.rep.duchy>=20?' Duchy wam sprzyjają: ceny niższe.':S.rep.duchy<=-20?' Duchy są wam nieprzychylne: ceny wyższe.':''}</div>`;
 b+=`<button class="btn-green" style="width:100%" data-act="szheal" ${!hurt||S.gold<szHeal()?'disabled':''}>${ic('ziola',20)} Okłady z ziół – pełne zdrowie kompanii (${szHeal()} ${ic('gold',16)})</button>`;
 const inj=[];S.roster.forEach(h=>(h.inj||[]).forEach(k=>{if(INJ[k]&&!INJ[k].p)inj.push([h,k])}));
 b+=`<h2>${ic('injury',20)} Odczynianie urazów</h2><div class="sub" style="margin-bottom:6px">Urazy tymczasowe (ciała i ducha) – taniej niż w Szpitalu. Trwałych nie odczyni.</div>`+(inj.length?'<div class="cols">'+inj.map(([h,k])=>`<div class="item"><div class="ii">${bust(heroSprite(h),h.cls,40,1,-6)}</div><div class="inf"><div class="inm">${esc(h.name.split(' ')[0])}: ${INJ[k].n}</div><div class="sub">${INJ[k].d}</div></div><button class="btn-small btn-gold" data-act="szinj" data-id="${h.id}" data-k="${k}" ${S.gold<szInj(h,k)?'disabled':''}>${szInj(h,k)} ${ic('gold',14)}</button></div>`).join('')+'</div>':`<div class="empty">Nikt nie ma tymczasowych urazów.</div>`);
 b+=`<h2>${ic('xp',20)} Obrzędy przed wyprawą</h2><div class="sub" style="margin-bottom:6px">Jeden obrzęd działa przez całą następną wyprawę.</div>`+(S.bless?`<div class="note ok">${ic('xp',14)} Aktywne: <b>${esc(S.bless.name)}</b> – na następną wyprawę.</div>`:'')+
 '<div class="cols">'+Object.keys(RITES).map(k=>`<div class="item"><div class="ii">${ic('ziola',28)}</div><div class="inf"><div class="inm">${RITES[k].n}</div><div class="sub">${RITES[k].d}</div></div><button class="btn-small btn-gold" data-act="rite" data-k="${k}" ${S.gold<ritePrice(k)||S.bless?'disabled':''}>${ritePrice(k)} ${ic('gold',14)}</button></div>`).join('')+'</div>';return b}
function elderHtml(){return `<div class="sub" style="margin-bottom:6px">Starszy Radogost siedzi na ławie przed chatą i patrzy na kurhany.</div><div class="dlg"><div class="dpor"><img class="px" src="${VART.n_starszy}" alt=""></div><div class="dtx"><p>„Każdy z tych kopców to ktoś, kto bronił tej ziemi. Pytajcie, a powiem, co pamiętam.”</p></div></div><div class="actions dopts">${Object.keys(LORE).filter(k=>LORE[k].elder).map(k=>`<button data-act="lore" data-k="${k}">${ic('event',16)} ${LORE[k].q}</button>`).join('')}</div>`}
/* nagłówek usługi z nazwą lokalną + kontrola dostępności */
function svcGuard(v){const b=VIEW_B(v);if(!b||hasSvc(b))return '';const where=Object.keys(TOWNS).filter(t=>TOWNS[t].svc.includes(b)).map(t=>NODES[t].n).join(', ');
 return `<div class="row" style="align-items:center;margin:4px 0 2px"><button class="btn-small" style="flex:0 0 auto" data-act="town" data-v="">${ic('back',16)} ${NODES[S.loc].n}</button></div><div class="empty">${ic('lock',16)} W ${NODES[S.loc].n} nie ma tej usługi (${BUILD[b]?BUILD[b].n:XB[b].n}). Znajdziesz ją w: ${where}.</div>`}
