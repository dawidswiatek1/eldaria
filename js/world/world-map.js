/* ===== ELDARIA: mapa świata, Velesia, podróże, wydarzenia na drodze ===== */
const KINGDOMS=[
 {k:'velesia',n:'Velesia',d:'Kraina gęstych lasów, rzek i starych grodów. Tu zaczyna się wasza kronika.',x:43,y:44,open:1},
 {k:'eisenmark',n:'Eisenmark',d:'Serce z kamienia i żelaza – kopalnie, kuźnie i twierdze w skale.',x:45,y:19},
 {k:'valenne',n:'Valenne',d:'Kraina rzek i światła, dworskich turniejów i białych miast.',x:14,y:36},
 {k:'skeld',n:'Skeld',d:'Królestwo lodu i kamienia na mroźnej północy.',x:21,y:12},
 {k:'solaria',n:'Solaria',d:'Sanktuarium światła i porządku, gdzie rządzą zakony.',x:38,y:73},
 {k:'avaria',n:'Avaria',d:'Otwarte równiny, stepowi jeźdźcy i karawany kupców.',x:65,y:30},
 {k:'meredia',n:'Meredia',d:'Królestwo portów i handlu, rozsiane po ciepłych wyspach.',x:14,y:79},
 {k:'martwe',n:'Martwe Ziemie',d:'Jałowe piaski i zapomniane kości. Stamtąd nadciągają najazdy.',x:71,y:68},
 {k:'wschod',n:'Nieznane Ziemie',d:'Za Wielkim Grzbietem kończą się mapy. Nikt stamtąd nie wrócił.',x:90,y:24}
];
const NODES={
 weleszow:{n:'Weleszów',t:'Stolica Velesii',ty:'town',x:52.5,y:21,ic:'b_zamek',d:'Murowane miasto z zamkiem na wzgórzu nad rzeką: targi, świątynie i dwór królewski. Renesansowe kamienice mieszają się tu ze starszymi drewnianymi dzielnicami.'},
 dabrowa:{n:'Dąbrowa',t:'Miasto leśne',ty:'town',x:16.5,y:46,ic:'ziola',d:'Osada przy starym gaju, słynna z szeptunów i handlu ziołami. Nieopodal stoją kamienne kręgi.'},
 kregoszew:{n:'Kręgoszew',t:'Gród graniczny',ty:'town',x:19,y:79,ic:'b_koszary',d:'Warownia na skraju puszczy, broniąca Velesii przed najazdami z Martwych Ziem.'},
 sanow:{n:'Sanów',t:'Port rzeczny',ty:'town',x:62.5,y:55,ic:'tavern',d:'Port rzeczny pełen spichlerzy i warsztatów. Najlepsze miejsce, by znaleźć nowych towarzyszy.'},
 kurhanow:{n:'Kurhanów',t:'Osada przy kurhanach',ty:'town',x:51,y:76,ic:'b_cmentarz',d:'Mała osada wokół starych mogił. Mieszkańcy strzegą tajemnic przodków.'},
 polana:{n:'Mglista Polana',t:'Sekretna lokacja',ty:'site',hidden:1,x:17.5,y:17,ic:'event',d:'Przeklęta – a może święta – polana w głębi lasu, związana z duchami i pieczęciami Asterionu.'},
 puszcza:{n:'Mroczna Puszcza',t:'Wyprawa · kraina I',ty:'site',r:0,x:33,y:30,home:'dabrowa',d:'Prastara puszcza na północ od Dąbrowy. Gobliny, wilki i coś, co porusza się między drzewami.'},
 trakt:{n:'Trakt Bandytów',t:'Wyprawa · kraina II',ty:'site',r:1,x:41,y:46,home:'sanow',d:'Kupiecki trakt między Weleszowem a Sanowem, od lat nękany przez bandy zbójców.'},
 kurhany:{n:'Kurhany Przodków',t:'Wyprawa · kraina III',ty:'site',r:2,x:66,y:86,home:'kurhanow',d:'Kurhany i krypty pod nimi. Niektórzy przodkowie nie śpią spokojnie.'},
 grzbiet:{n:'Wielki Grzbiet',t:'Wyprawa · kraina IV',ty:'site',r:3,x:79,y:23,home:'sanow',d:'Mgliste turnie granicznego pasma. Orkowie, harpie i kamienne olbrzymy.'},
 jama:{n:'Smocza Jama',t:'Wyprawa · kraina V',ty:'site',r:4,x:86,y:39,home:'sanow',d:'Rozżarzona pieczara w zboczu Wielkiego Grzbietu. Leże smoka.'},
 poludnie:{n:'Równiny Południowe',t:'ku Avarii',ty:'exit',x:86,y:82,ic:'lock',d:'Szeroki trakt na południe, ku stepom Avarii. Granica jest na razie zamknięta – wkrótce.'}
};
const EDGES=[['weleszow','trakt'],['trakt','sanow'],['weleszow','puszcza'],['puszcza','dabrowa'],['trakt','dabrowa'],['dabrowa','kregoszew'],['dabrowa','polana'],['kregoszew','kurhanow'],['sanow','kurhanow'],['kurhanow','kurhany'],['sanow','grzbiet'],['grzbiet','jama'],['weleszow','grzbiet'],['sanow','poludnie']];
const SITE_OF_R=['puszcza','trakt','kurhany','grzbiet','jama'];
const nodeOk=k=>NODES[k]&&(!NODES[k].hidden||(S.found&&S.found[k]));
const nbrs=k=>EDGES.filter(e=>e.includes(k)).map(e=>e[0]===k?e[1]:e[0]).filter(nodeOk);
function pathTo(a,b){if(a===b)return [a];const prev={[a]:null},q=[a];while(q.length){const c=q.shift();for(const n of nbrs(c)){if(n in prev)continue;prev[n]=c;if(n===b){const p=[b];let x=c;while(x){p.unshift(x);x=prev[x]}return p}if(NODES[n].ty!=='exit')q.push(n)}}return null}
const hereNode=()=>S.exp&&S.exp.site?S.exp.site:S.loc;
/* --- stan świata (domyślne wartości + migracja) --- */
function wOk(){if(!S)return;if(!S.loc||!NODES[S.loc]||NODES[S.loc].ty!=='town')S.loc='weleszow';if(!S.rep)S.rep={dwor:0,lud:0,duchy:0};if(!S.q)S.q={};if(!S.found)S.found={};if(!S.fl)S.fl={};if(!S.lore)S.lore=['velesia'];if(S.bless===undefined)S.bless=null;if(!wOk._l){wOk._l=1;if(S.pend&&!S.exp){if(NODES[S.pend.to]&&NODES[S.pend.to].ty==='town')S.loc=S.pend.to;S.pend=null}}}
/* --- mapa świata --- */
let wSel='velesia',rSel=null,_trav=false;
function fitBox(id,ar){const el=document.getElementById(id);if(!el)return;const W=el.clientWidth,H=el.clientHeight;let w=W,h=W/ar;if(h>H){h=H;w=H*ar}const m=el.querySelector('.wmap');m.style.width=Math.floor(w)+'px';m.style.height=Math.floor(h)+'px'}
function renderWorld(){const K=KINGDOMS.find(k=>k.k===wSel)||KINGDOMS[0];
 document.getElementById('app').innerHTML=`<div class="wv"><div class="ttop"><button class="btn-small" data-act="region" data-esc="1">${ic('back',16)}<span class="lbl"> Velesia</span></button><h2>${emb(18)} Kontynent Eldarii</h2><span class="pill gold">${ic('gold',18)} ${S.gold}</span></div>
 <div class="wbody"><div class="wfit" id="wfit"><div class="wmap world"><img class="px" src="${VART.world}" alt="Mapa Eldarii">${KINGDOMS.map(k=>`<button class="kpin ${k.open?'op':'lk'} ${k.k===wSel?'on':''}" data-act="ksel" data-k="${k.k}" style="left:${k.x}%;top:${k.y}%">${k.open?emb(16):ic('lock',12)}<b>${k.n}</b></button>`).join('')}<div class="fog"></div></div></div>
 <aside class="wside"><h2>${K.open?emb(20):ic('lock',18)} ${K.n}</h2><p>${K.d}</p>${K.open?`<button class="btn-main" data-act="region">${ic('map',20)} Wejdź do Velesii</button>`:`<div class="soon">${ic('lock',16)} Wkrótce</div><p class="sub">To królestwo pojawi się w kolejnych rozdziałach kroniki.</p>`}</aside></div></div>`;
 fitBox('wfit',16/9)}
/* --- mapa Velesii --- */
function nodeIc(k){const N=NODES[k];if(N.ty==='site'&&N.r!=null&&!S.reg.lv[N.r])return ic('lock',14);if(N.ty==='site'&&N.r!=null&&S.reg.done[N.r])return ic('flag',14);return ic(N.ic||(N.ty==='site'?'fight':'nav_town'),14)}
function qMark(k){return Object.keys(S.q).some(id=>{const q=S.q[id];if(q.done)return false;const st=QD[id]&&QD[id].st[q.s];return st&&st.obj&&(st.obj.go===k||st.obj.site===k||(st.obj.exp&&SITE_OF_R[st.obj.exp.r]===k))})||(NODES[k].ty==='town'&&talkNew(k))}
function renderRegion(){regOk();wOk();const here=hereNode();if(!rSel||!nodeOk(rSel))rSel=here;const ks=Object.keys(NODES).filter(nodeOk);
 const P=k=>NODES[k],roads=EDGES.filter(e=>nodeOk(e[0])&&nodeOk(e[1])).map(([a,b])=>`<line x1="${P(a).x}" y1="${P(a).y}" x2="${P(b).x}" y2="${P(b).y}"/>`).join('');
 const m=mainOf()||S.roster[0];
 document.getElementById('app').innerHTML=`<div class="wv"><div class="ttop"><button class="btn-small" data-act="back" data-esc="1">${ic('back',16)}<span class="lbl"> Obóz</span></button><button class="btn-small" data-act="world" title="Mapa świata">${ic('map',18)}<span class="lbl"> Świat</span></button><h2>${emb(18)} Velesia</h2><button class="btn-small" data-act="journal">${ic('contract',18)}<span class="lbl"> Dziennik</span>${qBadge()}</button><span class="pill gold">${ic('gold',18)} ${S.gold}</span></div>
 <div class="wbody"><div class="wfit" id="rfit"><div class="wmap reg" id="rmap"><img class="px" src="${VART.velesia}" alt="Mapa Velesii"><svg class="roads" viewBox="0 0 100 100" preserveAspectRatio="none">${roads}</svg>
 ${ks.map(k=>{const N=P(k);return `<button class="npin n-${N.ty} ${k===rSel?'on':''} ${k===here?'here':''} ${N.ty==='site'&&N.r!=null&&!S.reg.lv[N.r]?'lk':''}" data-act="nsel" data-k="${k}" style="left:${N.x}%;top:${N.y}%"><i>${nodeIc(k)}</i><b>${N.n}</b>${qMark(k)?'<em>!</em>':''}</button>`}).join('')}
 <div class="party" id="pmark" style="left:${P(here).x}%;top:${P(here).y}%">${m?`<img class="px pfig" src="${heroSprite(m)}" alt="">`:''}<span class="pflag">${emb(12)}</span></div></div></div>
 <aside class="wside" id="rside">${nodePanel(rSel)}</aside></div></div>`;
 fitBox('rfit',16/9);if(!S.intro){S.intro=1;save();setTimeout(()=>{if(screen==='region')modal(loreHtml('velesia',true))},60)}}
function nodePanel(k){const N=NODES[k],here=hereNode(),path=pathTo(here,k),d=path?path.length-1:0;let b=(N.ty==='site'&&N.r!=null?`<div class="pano scene bg-${BIOMES[N.r].k}">${sceneLayers(BIOMES[N.r].k,false)}</div>`:`<div class="pano" style="background-image:url(${VART['p_'+k]||VART['p_mglista']})"></div>`)+`<h2>${N.ty==='site'?ic('fight',18):N.ty==='exit'?ic('lock',16):ic('nav_town',18)} ${N.n}</h2><div class="sub">${N.t}${d&&N.ty!=='exit'?` · ${d} ${d>1?'dni':'dzień'} drogi`:''}</div><p class="nd">${N.d}</p>`;
 if(N.ty==='exit')return b+`<div class="soon">${ic('lock',16)} Wkrótce</div>`;
 if(S.exp)return b+`<button class="btn-main" data-act="map">${ic('walk',20)} Wróć na wyprawę</button>`;
 if(N.ty==='town'){if(k===S.loc)return b+`<div class="here">${ic('flag',14)} Tu jest kompania</div><button class="btn-main" data-act="intown">${ic('nav_town',20)} Wejdź do miasta</button>`;
  return b+`<button class="btn-main" data-act="travel" data-k="${k}" ${path?'':'disabled'}>${ic('walk',20)} Podróżuj</button><div class="sub">Po drodze może się coś wydarzyć.</div>`}
 /* miejsce wyprawy */
 if(k==='polana'){const st=S.q.osadnicy&&S.q.osadnicy.s==='pieczec';return b+(st?`<div class="sub">Zalecany poziom bohaterów: 5+</div><button class="btn-main" data-act="polgo">${ic('walk',20)} Wyrusz na polanę</button>`:`<div class="sub">Pieczęć milczy. Na razie nie ma tu czego szukać.</div>`)}
 const r=N.r,R=S.reg;if(!R.lv[r])return b+`<div class="soon">${ic('lock',16)} Zamknięte</div><div class="sub">Pokonaj bossa poprzedniej krainy, aby tu dotrzeć.</div>`;
 if(!mapSel||mapSel.r!==r||R.lv[r]<mapSel.L)mapSel={r,L:R.lv[r]};const L=mapSel.L,st=expStage(r,L),ph=partyHeroes(),hurt=ph.filter(h=>h.hp<mh(h)*.6).length;
 b+=`<div class="rlv">${[1,2,3,4].map(l=>{const op=R.lv[r]>=l,cl=l<4?R.lv[r]>l||R.done[r]:R.done[r];return `<button class="${L===l?'on':''} ${l===4?'bl':''}" data-act="rlv" data-r="${r}" data-l="${l}" ${op?'':'disabled'}>${op?(l===4?ic('boss',14):''):ic('lock',12)}${l<4?['','I','II','III'][l]:'Boss'}${cl?'<i class="ck">✓</i>':''}</button>`}).join('')}</div>`;
 b+=`<div class="sub">${5+Math.min(L,3)} komnat · ${L>=4?'boss: '+ENEMIES[BIOMES[r].boss].name:'na końcu elita'} · zalecany poziom: ${Math.max(1,Math.round(st*.75))}</div>${hurt?`<div class="warn">${ic('hp',12)} Rannych: ${hurt} – rany nie goją się na wyprawie!</div>`:''}`;
 b+=`<div class="mparty" data-act="formq">${[4,3,2,1,0].map(i=>{const h=S.slots[i]!=null?getHero(S.slots[i]):null;return `<span class="mp ${i<2?'f':''}">${h?bust(heroSprite(h),h.cls,30,1,-4):''}</span>`}).join('')}<small>Formacja ▸</small></div>`;
 return b+`<div class="rgorow"><button class="mbag" data-act="tomarket" title="Zapasy">${ic('bag',18)}<span>${bagN()}/${bagCap()}</span></button><button class="btn-main" data-act="rgo" data-k="${k}" ${ph.length&&path?'':'disabled'}>${ic('walk',20)} ${k===here?'Wyrusz':'Podróżuj i wyrusz'}</button></div>`}
/* --- podróż: znacznik idzie po drogach, po drodze 30% szans na wydarzenie --- */
function travel(to,then){if(_trav)return;const path=pathTo(hereNode(),to);if(!path)return;_trav=true;const mk=document.getElementById('pmark');let i=0;
 const step=()=>{i++;if(i>=path.length||!mk){arrive(to,then,path.length-1);return}const N=NODES[path[i]];mk.style.left=N.x+'%';mk.style.top=N.y+'%';typeof SND!=='undefined'&&SND.play('tap');setTimeout(step,T(560))};
 if(mk)mk.classList.add('mv');setTimeout(step,T(60))}
let _then=null;
function arrive(to,then,days){_trav=false;if(days>0&&Math.random()<roadChance()){S.pend={to};_then=then||null;save();roadEvent();return}finishTravel(to,then)}
const roadChance=()=>window.ROAD_P!=null?window.ROAD_P:.3;
function finishTravel(to,then){S.pend=null;const N=NODES[to];if(N.ty==='town')S.loc=to;save();if(then){then();return}rSel=to;screen='region';render();if(N.ty==='town'){toast(`Kompania dociera do: ${N.n}`);questGo(to)}}
function startSiteExp(k,r,L,extra){const N=NODES[k];if(!partyHeroes().length){toast('Najpierw ustaw drużynę w formacji!');return}S.exp=Object.assign(genExp(r,L),{site:k},extra||{});S.loc=N.home||S.loc;expStartTown(S.exp);save();screen='exp';render()}
/* --- wydarzenia na drodze --- */
const RCLS=c=>partyHeroes().find(h=>c.includes(h.cls));
const clsTag=c=>`<i class="ctag">[${c.map(k=>CLASSES[k].name).join('/')}]</i>`;
const ROADEV={
 zasadzka:{n:'Zasadzka!',ic:'fight',p:'herszt',t:()=>'Zza zwalonego drzewa wyskakują zbóje. „Sakiewki albo życie!” – woła herszt z przepaską na oku.',
  o:[{t:'Do broni!',r:()=>({fight:1})},{t:()=>`Rzuć im ćwierć sakiewki (${Math.floor(S.gold*.25)} zł)`,r:()=>{const g=Math.floor(S.gold*.25);S.gold-=g;return {txt:`Zbóje odchodzą z ${g} zł. Upokarzające, ale wszyscy cali.`}}},{c:['lotr','lucznik'],t:'Okrąż ich lasem i zaskocz',r:()=>{const g=30+S.stage*6;S.gold+=g;return {txt:`Zbóje nawet nie zauważyli, kiedy zniknęli ich zwiadowcy. Zabieracie ich łup: +${g} zł.`}}}]},
 kupiec:{n:'Wędrowny kupiec',ic:'bag',p:'kupiec',t:()=>'Kupiec z ciężkim tobołem macha do was z pobocza. „Dobra z Meredii i Avarii, tanio, bo w drodze!”',
  o:[{t:()=>{const it=roadItem();return `Kup: ${it.n} (${it.price} zł)`},r:()=>{const it=roadItem();if(S.gold<it.price)return {txt:'Nie stać was. Kupiec wzrusza ramionami.'};if(S.inv.length>=INV_MAX)return {txt:'Plecak jest pełny.'};S.gold-=it.price;S.inv.push(it);S.fl.rit=null;return {txt:`Kupiono: ${it.n}.`}}},{t:'Kup miksturę leczniczą (25 zł)',r:()=>{if(S.gold<25||bagN()>=bagCap())return {txt:'Nie da rady – brak złota albo miejsca w torbie.'};S.gold-=25;S.sup.mikstura=(S.sup.mikstura||0)+1;return {txt:'Mikstura trafia do torby.'}}},{c:['bard'],t:'Zagraj mu, a może opuści cenę',r:()=>{S.gold+=20;rep('lud',3);return {txt:'Kupiec tak się rozczulił, że to on wam zapłacił 20 zł za pieśń. +Lud'}}},{t:'Ruszajcie dalej',r:()=>({txt:'Mijacie kupca.'})}]},
 pomoc:{n:'Prośba o pomoc',ic:'hp',p:'dziewczyna',t:()=>'Przy drodze stoi przewrócony wóz. Młoda chłopka prosi o pomoc – jej ojciec jest ranny, a wół uciekł do lasu.',
  o:[{t:'Pomóżcie jej (trochę czasu i sił)',r:()=>{hurtAll(.05);rep('lud',6);return {txt:'Wóz stoi, wół wrócił, a ojciec opatrzony. Wieść o tym szybko się rozniesie. +Lud'}}},{c:['kaplan','druid','paladyn'],t:'Opatrz rannego jak należy',r:()=>{rep('lud',8);rep('duchy',2);partyXp(15);return {txt:'Rana zszyta, gorączka spada. Rodzina błogosławi waszą kompanię. +Lud, +15 PD'}}},{t:'Nie mamy czasu',r:()=>{rep('lud',-3);return {txt:'Odjeżdżacie. Za plecami słychać płacz. −Lud'}}}]},
 tropy:{n:'Ślady bestii',ic:'skull',p:'bestia',t:()=>'Na błocie odciski łap wielkich jak tarcza. Prowadzą w gąszcz, a w powietrzu czuć krew.',
  o:[{t:'Idźcie tropem',r:()=>{if(Math.random()<.55){const g=40+S.stage*8;S.gold+=g;S.tro.wilk=(S.tro.wilk||0)+2;return {txt:`Znajdujecie rozszarpaną watahę i porzucony łup myśliwych: +${g} zł i 2 trofea wilka.`}}return {txt:`Bestia zaatakowała z ukrycia i znikła. ${hurtAll(.12)}.`}}},{c:['lucznik','druid','lotr'],t:'Odczytaj ślady z bezpiecznej odległości',r:()=>{const g=30+S.stage*6;S.gold+=g;rep('lud',2);return {txt:`Wiesz, gdzie bestia poluje – ostrzegacie pobliską wieś, a ta płaci za wieść ${g} zł.`}}},{t:'Omińcie to miejsce',r:()=>({txt:'Rozsądnie nadkładacie drogi.'})}]},
 znalezisko:{n:'Znalezisko',ic:'chest',p:null,t:()=>'W rowie leży okuta skrzynka – chyba spadła z kupieckiego wozu. Zamek wygląda solidnie.',
  o:[{t:'Rozbijcie zamek',r:()=>{const g=20+S.stage*5;S.gold+=g;if(Math.random()<.4){const it=makeItem(S.stage,rollRar(.1));if(S.inv.length<INV_MAX)S.inv.push(it);return {txt:`+${g} zł i ${it.n}.`}}return {txt:`+${g} zł. Reszta zawartości się potłukła.`}}},{c:['lotr'],t:'Otwórz wytrychem',r:()=>{const g=30+S.stage*7;S.gold+=g;const it=makeItem(S.stage+1,rollRar(.2,1));if(S.inv.length<INV_MAX)S.inv.push(it);return {txt:`Delikatna robota. +${g} zł i ${it.n}!`}}},{t:'Odwieźcie ją do najbliższego grodu',r:()=>{rep('dwor',4);rep('lud',2);S.gold+=15;return {txt:'Starosta dziękuje i płaci znaleźne 15 zł. +Dwór'}}}]},
 zjawisko:{n:'Dziwne zjawisko',ic:'event',p:'duch',t:()=>'Nad mokradłem tańczą błękitne ogniki. Z mgły dobiega szept w dawno zapomnianej mowie.',
  o:[{t:'Podejdźcie bliżej',r:()=>{if(Math.random()<.5){S.bless={name:'Szept ogników',fx:{crit:6}};return {txt:'Ogniki krążą wokół was i znikają. Czujecie się dziwnie pewni siebie. (Na następną wyprawę: +6% kryt.)'}}return {txt:`Ogniki wciągają was w bagno. ${hurtAll(.1)}.`}}},{c:['druid','kaplan','czarnoksieznik'],t:'Odpowiedz duchom w ich mowie',r:()=>{rep('duchy',6);S.bless={name:'Błogosławieństwo duchów',fx:{defP:.1,heal:.1}};return {txt:'Duchy przodków odpowiadają łagodnie. Na następną wyprawę: +10% obrony i +10% leczenia. +Duchy'}}},{t:'Odwróćcie wzrok i idźcie dalej',r:()=>({txt:'Szept cichnie za plecami.'})}]}
};
function roadItem(){if(!S.fl.rit){const it=makeItem(S.stage,rollRar(.15));it.price=Math.round(it.price*.75);S.fl.rit=it}return S.fl.rit}
function roadEvent(k){k=k||pick(Object.keys(ROADEV));S.pend.ev=k;save();const E=ROADEV[k];
 modal(`<div class="dlg">${E.p?`<div class="dpor"><img class="px" src="${VART['n_'+E.p]}" alt=""></div>`:`<div class="dpor ic">${ic(E.ic,40)}</div>`}<div class="dtx"><h2>${ic(E.ic,20)} ${E.n}</h2><p>${E.t()}</p></div></div><div class="actions dopts">${E.o.map((o,i)=>{const ok=!o.c||RCLS(o.c);return ok?`<button data-act="rev" data-i="${i}">${o.c?clsTag(o.c)+' ':''}${typeof o.t==='function'?o.t():o.t}</button>`:''}).join('')}</div>`)}
function roadResolve(i){const k=S.pend&&S.pend.ev;if(!k)return;const o=ROADEV[k].o[i];if(!o||(o.c&&!RCLS(o.c)))return;const r=o.r();save();
 if(r.fight){closeModal();roadFight();return}
 modal(`<h2>${ic(ROADEV[k].ic,20)} ${ROADEV[k].n}</h2><p>${r.txt}</p><button class="btn-main" data-act="revok">${ic('walk',20)} W drogę</button>`)}
function roadFight(list,lbl,extra){if(!partyHeroes().length){const g=Math.min(S.gold,20+S.stage*3);S.gold-=g;S.pend=null;save();modal(`<h2>${ic('skull',20)} Ucieczka</h2><p>Nikt w drużynie nie jest zdolny do walki. Uciekacie, gubiąc ${g} zł.</p><button class="btn-main" data-act="close">Dalej</button>`);render();return}const E=Object.assign({r:Math.min(4,Math.max(0,Math.floor((S.stage-1)/5))),L:Math.min(3,1+((S.stage-1)%5>2?1:0)),st:Math.max(1,S.stage),rooms:[{k:'fight',done:0}],i:0,gold:0,loot:[],kills:0,road:1},extra||{});S.exp=E;save();
 const bio=BIOMES[(extra&&extra.bk!=null)?extra.bk:1];startBattle({st:E.st,est:E.st,bio,list:list||Array.from({length:3+(S.stage>8?1:0)},()=>pick(['bandyta','rzezimieszek','lucznikB'])),exp:true,lbl:lbl||'Zasadzka na trakcie',wl:'Zasadzka!'})}
function roadDone(){const E=S.exp;S.gold+=E.gold;bankLoot(E);S.exp=null;save();const q=E.qd;
 modal(`<h2>${ic('flag',20)} ${q?'Zwycięstwo!':'Droga wolna'}</h2><p>${ic('gold',16)} Łupy: ${E.gold} zł${E.loot.length?`, przedmioty: ${E.loot.length}`:''}.</p><button class="btn-main" data-act="${q?'qdlg':'revok'}" data-d="${q||''}">${ic('walk',20)} Dalej</button>`)}
function roadLost(){S.pend=null;save()}
