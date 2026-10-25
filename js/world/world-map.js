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
 weleszow:{n:'Weleszów',t:'Stolica Velesii',ty:'town',x:53,y:17,ic:'b_zamek',d:'Zamek na skalistym wzgórzu nad Veleską, rynek z fontanną, kościół z czerwonej cegły i port rzeczny. Serce królestwa.'},
 dabrowa:{n:'Dąbrowa',t:'Osada w świętym gaju',ty:'town',x:25,y:35,ic:'ziola',d:'Osada przy prastarym dębie, słynna z szeptunów i handlu ziołami. Wokół stoją kamienne kręgi.'},
 kregoszew:{n:'Kręgoszew',t:'Gród graniczny',ty:'town',x:19,y:58,ic:'b_koszary',d:'Kamienna strażnica na skale na zachodnim skraju puszczy, brama Velesii od strony bagien i dzikich ostępów. Kowale, koszary i kontrakty graniczne.'},
 sanow:{n:'Sanów',t:'Miasto kupców',ty:'town',x:56,y:45,ic:'tavern',d:'Ruchliwe miasto targowe na skrzyżowaniu traktów. Spichlerze, przystań i najwięcej najemników w Velesii.'},
 kurhanow:{n:'Kurhanów',t:'Osada przy kurhanach',ty:'town',x:44,y:72,ic:'b_cmentarz',d:'Mała osada u stóp starych mogił. Mieszkańcy strzegą pamięci przodków.'},
 brzezina:{n:'Brzezina',t:'Wieś',ty:'town',vil:1,x:40,y:32,ic:'nav_town',d:'Spokojna wieś wśród brzóz. Karczma, plotki i kilku chętnych do wojaczki.'},
 olszynow:{n:'Olszynów',t:'Wieś rolnicza',ty:'town',vil:1,x:65,y:27,ic:'nav_town',hidden:1,d:'Bogata wieś wśród złotych pól. Chłopi szepczą o białej pani, która chodzi w południe po zbożu.'},
 mokradla:{n:'Mokradła',t:'Wieś na grobli',ty:'town',vil:1,x:20,y:80,ic:'nav_town',hidden:1,d:'Chaty na palach na skraju Bagna Czarnego. Zielarze i rybacy, którzy nie chodzą nad wodę po zmroku.'},
 wschodnia:{n:'Wschodnia',t:'Wieś pod górami',ty:'town',vil:1,x:77,y:43,ic:'nav_town',hidden:1,d:'Ostatnia wieś przed przełęczami Wielkiego Grzbietu. Kamienne chaty, wieża strażnicza i pasterze, którzy znają każdą ścieżkę w górach.'},
 ustronie:{n:'Ustronie',t:'Wieś na uboczu',ty:'town',vil:1,x:70,y:11,ic:'nav_town',hidden:1,d:'Wieś zagubiona w północno-wschodnich lasach. Ludzie są tu uprzejmi, ale dziwnie nieobecni – jakby o czymś zapomnieli.'},
 wyrab:{n:'Opuszczony wyrąb',t:'Ciekawe miejsce',ty:'poi',x:15,y:22,ic:'event',hidden:1,d:'Porzucony obóz drwali w północnej puszczy. Siekiery wciąż tkwią w pniach.'},
 kaplica:{n:'Opuszczona kaplica',t:'Ciekawe miejsce',ty:'poi',x:80,y:6,ic:'temple',hidden:1,d:'Kamienna kaplica na wzgórzu nad Ustroniem. Od lat nikt tu nie przychodzi.'},
 jagna:{n:'Chata Jagny',t:'Ciekawe miejsce',ty:'poi',x:9,y:64,ic:'ziola',hidden:1,d:'Chata szeptunki Jagny w lesie na zachód od Kręgoszewa. Na płocie suszą się zioła.'},
 czarnybor:{n:'Czarny Bór',t:'Wyprawa · finał Aktu I',ty:'site',x:5,y:25,ic:'boss',hidden:1,home:'dabrowa',d:'Najstarsza i najciemniejsza część puszczy, na samym zachodzie. Drzewa są tu tak gęste, że w południe panuje zmierzch.'},
 kurhan:{n:'Kurhan bez imienia',t:'Wyprawa',ty:'site',x:72,y:33,ic:'skull',hidden:1,home:'olszynow',d:'Kurhan odkryty pod pługiem na polach Olszynowa. Po zmroku dochodzą z niego odgłosy walki.'},
 mlyn:{n:'Młyn nad Veleską',t:'Ciekawe miejsce',ty:'poi',x:29,y:49,ic:'event',hidden:1,d:'Stary młyn wodny. Młynarz podobno ma układ z wodnikiem.'},
 kapliczka:{n:'Leśna kapliczka',t:'Ciekawe miejsce',ty:'poi',x:13,y:46,ic:'temple',hidden:1,d:'Drewniana kapliczka na rozstaju leśnych dróg. Wędrowcy zostawiają tu dary.'},
 krag:{n:'Krąg Kamienny',t:'Ciekawe miejsce',ty:'poi',x:32,y:24,ic:'event',hidden:1,d:'Omszałe głazy ustawione w krąg. Szeptunki przychodzą tu w noc Kupały.'},
 straznica:{n:'Strażnica',t:'Ciekawe miejsce',ty:'poi',x:85,y:69,ic:'flag',hidden:1,d:'Opuszczona wieża sygnałowa u południowych stóp Wielkiego Grzbietu. Z jej szczytu widać Martwe Ziemie.'},
 ruiny:{n:'Ruiny Asterionu',t:'Ciekawe miejsce',ty:'poi',x:63,y:79.5,ic:'event',hidden:1,d:'Kolumny i łuki z czasów dawnych magów. Na kamieniach wciąż widać runy.'},
 doliny:{n:'Mgliste Doliny',t:'Ciekawe miejsce',ty:'poi',x:38,y:12,ic:'event',hidden:1,d:'Doliny wiecznie spowite mgłą. Ludzie słyszą tu głosy zmarłych.'},
 rozlewiska:{n:'Rozlewiska Utopców',t:'Ciekawe miejsce',ty:'poi',x:29,y:64,ic:'event',hidden:1,d:'Zalane łąki nad Veleską. Rusałki i utopce wciągają tu nieostrożnych.'},
 polana:{n:'Mglista Polana',t:'Sekretna lokacja',ty:'site',hidden:1,x:22,y:11,ic:'event',d:'Krąg runicznych kamieni w mgle – miejsce pieczęci Asterionu.'},
 puszcza:{n:'Mroczna Puszcza',t:'Wyprawa · kraina I',ty:'site',r:0,x:7,y:33,home:'dabrowa',d:'Prastara puszcza na zachodzie. Gobliny, wilki, dziki – i Leszy, pan lasu.'},
 trakt:{n:'Trakt Bandytów',t:'Wyprawa · kraina II',ty:'site',r:1,x:5,y:52,home:'kregoszew',hidden:1,d:'Leśny trakt kupiecki, od lat nękany przez zbójców. Biesy podobno im pomagają.'},
 kurhany:{n:'Kurhany Przodków',t:'Wyprawa · kraina III',ty:'site',r:2,x:43,y:86,home:'kurhanow',hidden:1,d:'Kurhany i krypty pod nimi. Strzygi i szeptuni nie dają spać przodkom.'},
 grzbiet:{n:'Wielki Grzbiet',t:'Wyprawa · kraina IV',ty:'site',r:3,x:88,y:35,home:'wschodnia',hidden:1,d:'Ośnieżone turnie granicznego pasma. Orkowie, harpie, wilkołaki i bazyliszki.'},
 jama:{n:'Smocza Jama',t:'Wyprawa · kraina V',ty:'site',r:4,x:92,y:14,home:'wschodnia',hidden:1,d:'Rozżarzona pieczara w zboczu gór. Leże Żmija.'},
 bagno:{n:'Bagno Czarne',t:'Wyprawa · bagna',ty:'site',r:5,x:10,y:89,home:'mokradla',hidden:1,d:'Czarna woda, martwe drzewa i błędne ogniki. Królestwo Utopca Starszego.'},
 pola:{n:'Pola Południcy',t:'Wyprawa · pola',ty:'site',r:6,x:47,y:61,home:'sanow',hidden:1,d:'Złote łany, gdzie w samo południe nikt nie odważy się pracować.'},
 chata:{n:'Chata na kurzej stopce',t:'Sekretna wyprawa',ty:'site',r:7,x:4,y:74,home:'mokradla',hidden:1,d:'Płot z czaszek, a za nim chata, która obraca się na kurzej nodze. Dom Baby Jagi.'},
 jary:{n:'Wilcze Jary',t:'Łowisko',ty:'site',r:8,x:10,y:17,home:'dabrowa',hidden:1,d:'Głębokie jary w północnej puszczy. Wataha wilkołaka Alfy poluje tu każdej pełni.'},
 poludnie:{n:'Równiny Południowe',t:'ku Avarii',ty:'exit',x:72,y:92,ic:'lock',hidden:1,d:'Szeroki trakt na południe, ku stepom Avarii. Granica zamknięta – wkrótce.'},
 martwe:{n:'Martwe Ziemie',t:'granica',ty:'exit',x:96,y:85,ic:'skull',hidden:1,d:'Spękana, wymarła ziemia za wschodnią granicą. Stąd przychodzi zło – wkrótce.'}};
const EDGES=[['weleszow','dabrowa'],['weleszow','brzezina'],['weleszow','olszynow'],['weleszow','doliny'],['weleszow','sanow'],
 ['dabrowa','brzezina'],['dabrowa','puszcza'],['dabrowa','jary'],['dabrowa','krag'],['dabrowa','kapliczka'],['dabrowa','polana'],['dabrowa','wyrab'],['wyrab','czarnybor'],['krag','polana'],['krag','doliny'],
 ['brzezina','mlyn'],['brzezina','sanow'],['kapliczka','mlyn'],['kapliczka','trakt'],['kapliczka','kregoszew'],['trakt','chata'],
 ['kregoszew','jagna'],['kregoszew','mokradla'],['kregoszew','rozlewiska'],['kregoszew','kurhanow'],['mlyn','rozlewiska'],['rozlewiska','pola'],['rozlewiska','mokradla'],
 ['mokradla','bagno'],['mokradla','chata'],['sanow','pola'],['pola','kurhanow'],['kurhanow','kurhany'],['kurhanow','ruiny'],['ruiny','poludnie'],
 ['sanow','wschodnia'],['olszynow','kurhan'],['olszynow','ustronie'],['olszynow','wschodnia'],['ustronie','kaplica'],
 ['wschodnia','grzbiet'],['wschodnia','jama'],['wschodnia','straznica'],['straznica','martwe']];
const SITE_OF_R=['puszcza','trakt','kurhany','grzbiet','jama','bagno','pola','chata','jary'];
const nodeOk=k=>NODES[k]&&(!NODES[k].hidden||(S.found&&S.found[k]));
const nbrs=k=>EDGES.filter(e=>e.includes(k)).map(e=>e[0]===k?e[1]:e[0]).filter(nodeOk);
function pathTo(a,b){if(a===b)return [a];const prev={[a]:null},q=[a];while(q.length){const c=q.shift();for(const n of nbrs(c)){if(n in prev)continue;prev[n]=c;if(n===b){const p=[b];let x=c;while(x){p.unshift(x);x=prev[x]}return p}if(NODES[n].ty!=='exit')q.push(n)}}return null}
const hereNode=()=>S.exp&&S.exp.site?S.exp.site:S.loc;
/* --- stan świata (domyślne wartości + migracja) --- */
/* krainy, które otwierają się same po odkryciu na mapie (bagno, pola, jary) */
const OPEN_ON_FIND=[5,6,8];
function wOk(){if(!S)return;if(!S.found)S.found={};
 /* kompania stoi w mieście, wsi albo ciekawym miejscu */
 const ok=S.loc&&NODES[S.loc]&&NODES[S.loc].ty!=='exit'&&NODES[S.loc].ty!=='site';if(!ok)S.loc='weleszow';
 if(!S.rep)S.rep={dwor:0,lud:0,duchy:0};if(!S.q)S.q={};if(!S.fl)S.fl={};if(!S.lore)S.lore=['velesia'];if(S.bless===undefined)S.bless=null;
 /* po wczytaniu gry: przerwana podróż przepada */
 if(!wOk._l){wOk._l=1;if(S.pend&&!S.exp)S.pend=null}
 if(!NODES[S.loc]||NODES[S.loc].ty!=='town'&&NODES[S.loc].ty!=='poi')S.loc='weleszow';if(!S.day)S.day=1;if(!S.poi)S.poi={};regFix(S);if(!S._rv){S._rv=1;reveal(S.loc,1)}SITE_OF_R.forEach((k,r)=>{if(k&&S.reg.lv[r]&&!S.found[k]){S.found[k]=1;}});routeFix();
 if(!S.reg)return;OPEN_ON_FIND.forEach(r=>{const k=SITE_OF_R[r];if(k&&S.found[k]&&!S.reg.lv[r])S.reg.lv[r]=1})}
/* --- mapa świata --- */
let wSel='velesia',rSel=null,_trav=false;
function fitBox(id,ar){const el=document.getElementById(id);if(!el)return;const W=el.clientWidth,H=el.clientHeight;let w=W,h=W/ar;if(h>H){h=H;w=H*ar}const m=el.querySelector('.wmap');m.style.width=Math.floor(w)+'px';m.style.height=Math.floor(h)+'px'}
function renderWorld(){const K=KINGDOMS.find(k=>k.k===wSel)||KINGDOMS[0];
 document.getElementById('app').innerHTML=`<div class="wv"><div class="ttop"><button class="btn-small" data-act="region" data-esc="1">${ic('back',16)}<span class="lbl"> Velesia</span></button><h2>${emb(18)} Kontynent Eldarii</h2><span class="pill gold">${ic('gold',18)} ${S.gold}</span></div>
 <div class="wbody"><div class="wfit" id="wfit"><div class="wmap world"><img class="px" src="${VART.world}" alt="Mapa Eldarii">${KINGDOMS.map(k=>`<button class="kpin ${k.open?'op':'lk'} ${k.k===wSel?'on':''}" data-act="ksel" data-k="${k.k}" style="left:${k.x}%;top:${k.y}%">${k.open?emb(16):ic('lock',12)}<b>${k.n}</b></button>`).join('')}<div class="fog"></div></div></div>
 <aside class="wside"><h2>${K.open?emb(20):ic('lock',18)} ${K.n}</h2><p>${K.d}</p>${K.open?`<button class="btn-main" data-act="region">${ic('map',20)} Wejdź do Velesii</button>`:`<div class="soon">${ic('lock',16)} Wkrótce</div><p class="sub">To królestwo pojawi się w kolejnych rozdziałach kroniki.</p>`}</aside></div></div>`;
 fitBox('wfit',16/9)}
/* --- mapa Velesii (widok: js/world/velesia-map.js) --- */
function qMark(k){return Object.keys(S.q).some(id=>{const q=S.q[id];if(q.done)return false;const st=QD[id]&&QD[id].st[q.s];return st&&st.obj&&(st.obj.go===k||st.obj.site===k||(st.obj.exp&&SITE_OF_R[st.obj.exp.r]===k))})||(NODES[k].ty==='town'&&talkNew(k))}
/* --- podróż: kompania idzie po narysowanych drogach, po drodze 30% szans na wydarzenie --- */
/* kształt drogi a→b z mapy (ROADS w js/data/velesia-roads.js, punkty w % mapy); bez danych – prosto */
function roadLine(a,b){const r=ROADS[a+'|'+b];if(r)return r;const q=ROADS[b+'|'+a];if(q)return q.slice().reverse();return [[NODES[a].x,NODES[a].y],[NODES[b].x,NODES[b].y]]}
const WALK_PX=.11;/* piksele mapy na milisekundę (przy prędkości gry ×1) */
function travel(to,then){if(_trav)return;const path=pathTo(hereNode(),to);if(!path||path.length<2){if(then)then();return}_trav=true;window._lp=path;const g=document.getElementById('ngo');if(g)g.remove();const mk=document.getElementById('pmark');
 const done=()=>{if(mk){mk.classList.remove('walk','fl');mk.style.transition=''}passDays(path.length-1);arrive(to,then,path.length-1)};
 if(!mk){done();return}
 /* jedna linia przez wszystkie odcinki; at[n] = indeks punktu, w którym kompania mija n-te miejsce */
 const pts=[],at=[0];path.slice(1).forEach((k,i)=>{roadLine(path[i],k).forEach((p,j)=>{if(i&&!j)return;pts.push(p)});at.push(pts.length-1)});
 const d=[0];for(let i=1;i<pts.length;i++)d.push(d[i-1]+Math.hypot((pts[i][0]-pts[i-1][0])*MAPW/100,(pts[i][1]-pts[i-1][1])*MAPH/100));
 const tot=d[d.length-1]||1,dur=RM?300:Math.max(400,Math.min(8000,T(tot/WALK_PX)));let seg=1,ni=1,t0=null;
 mk.style.transition='none';mk.classList.add('walk');
 const frame=now=>{if(!document.body.contains(mk)){done();return}if(t0==null)t0=now;const s=Math.min(tot,(now-t0)/dur*tot);
  while(seg<pts.length-1&&d[seg]<s)seg++;const a=pts[seg-1],b=pts[seg],f=d[seg]>d[seg-1]?(s-d[seg-1])/(d[seg]-d[seg-1]):1,x=a[0]+(b[0]-a[0])*f,y=a[1]+(b[1]-a[1])*f;
  mk.style.left=x+'%';mk.style.top=y+'%';if(Math.abs(b[0]-a[0])>.05)mk.classList.toggle('fl',b[0]<a[0]);mvFollow(x,y);
  /* mijane miejsca: odkryj sąsiadów, stuknij krokiem */
  while(ni<path.length&&d[at[ni]]<=s+.01){reveal(path[ni],1);if(ni<path.length-1)typeof SND!=='undefined'&&SND.play('tap');ni++}
  if(s>=tot){done();return}requestAnimationFrame(frame)};
 requestAnimationFrame(frame)}
let _then=null;
function arrive(to,then,days){_trav=false;if(days>0&&Math.random()<roadChance()){S.pend={to};_then=then||null;save();roadEvent();return}finishTravel(to,then)}
const roadChance=()=>window.ROAD_P!=null?window.ROAD_P:.3;
function finishTravel(to,then){S.pend=null;const N=NODES[to];if(N.ty==='town'||N.ty==='poi')S.loc=to;else if(window._lp){const c=window._lp.filter(k=>NODES[k]&&(NODES[k].ty==='town'||NODES[k].ty==='poi'));if(c.length)S.loc=c[c.length-1]}window._lp=null;reveal(to);save();if(then){then();return}rSel=to;screen='region';render();
 if(N.ty==='town'){toast(`Kompania dociera do: ${N.n} (${dayTxt()})`);questGo(to)}else if(N.ty==='poi'){if(!questGo(to)&&!S.poi[to])setTimeout(()=>poiEvent(to),250)}}
function startSiteExp(k,r,L,extra){reveal(k,1);const l=S.loc,N=NODES[k];
 if(!partyHeroes().length)toast('Najpierw ustaw drużynę w formacji!');
 else{S.exp=Object.assign(genExp(r,L),{site:k},extra||{});S.loc=N.home||S.loc;expStartTown(S.exp);save();screen='exp';render()}
 /* kompania zostaje tam, skąd wyruszyła (miasto, wieś lub ciekawe miejsce) */
 if(NODES[l]&&(NODES[l].ty==='town'||NODES[l].ty==='poi')){S.loc=l;save()}}
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
  o:[{t:'Podejdźcie bliżej',r:()=>{if(Math.random()<.5){S.bless={name:'Szept ogników',fx:{crit:6}};return {txt:'Ogniki krążą wokół was i znikają. Czujecie się dziwnie pewni siebie. (Na następną wyprawę: +6% kryt.)'}}return {txt:`Ogniki wciągają was w bagno. ${hurtAll(.1)}.`}}},{c:['druid','kaplan','czarnoksieznik'],t:'Odpowiedz duchom w ich mowie',r:()=>{rep('duchy',6);S.bless={name:'Błogosławieństwo duchów',fx:{defP:.1,heal:.1}};return {txt:'Duchy przodków odpowiadają łagodnie. Na następną wyprawę: +10% obrony i +10% leczenia. +Duchy'}}},{t:'Odwróćcie wzrok i idźcie dalej',r:()=>({txt:'Szept cichnie za plecami.'})}]},
 /* v18 */
 brod:{n:'Bród na Velesce',ic:'event',p:'rusalka',t:()=>'Przy brodzie siedzą na kamieniach blade dziewczęta z mokrymi włosami. „Chodźcie się wykąpać, wędrowcy… woda taka ciepła…”',
  o:[{t:'Do broni!',r:()=>({fight:['rusalka','utopiec'],bk:5,lbl:'Rusałki przy brodzie'})},{c:['bard'],t:'Zaśpiewaj im pieśń',r:()=>{rep('duchy',2);return {txt:'Rusałki słuchają zasłuchane i pozwalają wam przejść. Jedna rzuca wam srebrną łuskę. '+reward(25+S.stage*3)}}},{t:'Nadłóż drogi przez groblę (+1 dzień)',r:()=>{passDays(1);return {txt:'Dzień marszu w błocie, ale wszyscy cali.'}}}]},
 poludnie:{n:'Południe w polu',ic:'event',p:'poludnica',t:()=>'Słońce w zenicie. Między łanami zboża stoi wysoka biała postać z sierpem. „Odpowiedz, wędrowcze: co jest cięższe – snop czy sierp?”',
  o:[{t:'„Snop – bo sierp wraca do domu, a snop zostaje w polu.”',r:()=>{rep('duchy',2);return {txt:'Południca kiwa głową i rozpływa się w drżącym powietrzu.'}}},{t:'Zaatakuj ją!',r:()=>({fight:['poludnica'],bk:6,lbl:'Południca'})},{t:'Schowaj się w cieniu i przeczekaj',r:()=>{S.roster.forEach(h=>h.hp=Math.max(1,h.hp-Math.round(stats(h).maxHp*.1)));return {txt:'Upał daje się we znaki. (−10% zdrowia)'}}}]},
 dzik:{n:'Rozjuszony dzik',ic:'fight',p:null,t:()=>'Z zarośli wypada ogromny odyniec z kłami jak noże. Za nim drugi.',
  o:[{t:'Stawić czoła',r:()=>({fight:['dzik','dzik'],bk:0,lbl:'Dziki na drodze'})},{c:['lucznik','lotr'],t:'Zapoluj z ukrycia',r:()=>{S.sup.prowiant=(S.sup.prowiant||0)+1;return {txt:'Celny strzał. Dziczyzna na wieczór i skóra na sprzedaż. (+1 prowiant) '+reward(15)}}},{t:'Wejdź na drzewa i przeczekaj',r:()=>({txt:'Dziki ryją jeszcze godzinę, potem odchodzą.'})}]},
 rozstaje:{n:'Rozstaje dróg',ic:'event',p:null,t:()=>'Na rozstajach, przy przydrożnym krzyżu, siedzi elegancki jegomość z kopytem zamiast stopy. „Mam dla was interes. Sakwa złota za… drobiazg. Nic, czego byście potrzebowali.”',
  o:[{t:()=>`Przyjmij sakwę (+${60+S.stage*8} zł, Duchy −8)`,r:()=>{S.gold+=60+S.stage*8;rep('duchy',-8);return {txt:'Bies chichocze i znika. Złoto jest prawdziwe. Na razie.'}}},{c:['kaplan','paladyn'],t:'Przegoń go modlitwą',r:()=>{rep('duchy',4);rep('lud',2);return {txt:'Bies syczy i zapada się pod ziemię, zostawiając swąd siarki.'}}},{t:'Zaatakuj biesa',r:()=>({fight:['bies','bies'],bk:1,lbl:'Biesy z rozstajów'})}]}
};
function roadItem(){if(!S.fl.rit){const it=makeItem(S.stage,rollRar(.15));it.price=Math.round(it.price*.75);S.fl.rit=it}return S.fl.rit}
function roadEvent(k){k=k||pick(Object.keys(ROADEV));S.pend.ev=k;save();const E=ROADEV[k];
 modal(`<div class="dlg">${E.p?`<div class="dpor"><img class="px" src="${VART['n_'+E.p]}" alt=""></div>`:`<div class="dpor ic">${ic(E.ic,40)}</div>`}<div class="dtx"><h2>${ic(E.ic,20)} ${E.n}</h2><p>${E.t()}</p></div></div><div class="actions dopts">${E.o.map((o,i)=>{const ok=!o.c||RCLS(o.c);return ok?`<button data-act="rev" data-i="${i}">${o.c?clsTag(o.c)+' ':''}${typeof o.t==='function'?o.t():o.t}</button>`:''}).join('')}</div>`)}
function roadResolve(i){const k=S.pend&&S.pend.ev;if(!k)return;const E=ROADEV[k],o=E.o[i];if(!o||(o.c&&!RCLS(o.c)))return;const r=o.r();save();
 /* zdarzenia v18: walka z własną listą wrogów i tłem krainy */
 if(['brod','poludnie','dzik','rozstaje'].includes(k)){if(r.fight){closeModal();roadFight(r.fight,r.lbl,{bk:r.bk});return}modal(`<h2>${E.n}</h2><p>${r.txt}</p><button class="btn-main" data-act="revok">${ic('walk',20)} Dalej</button>`);return}
 if(r.fight){closeModal();roadFight();return}
 modal(`<h2>${ic(E.ic,20)} ${E.n}</h2><p>${r.txt}</p><button class="btn-main" data-act="revok">${ic('walk',20)} W drogę</button>`)}
function roadFight(list,lbl,extra){if(!partyHeroes().length){const g=Math.min(S.gold,20+S.stage*3);S.gold-=g;S.pend=null;save();modal(`<h2>${ic('skull',20)} Ucieczka</h2><p>Nikt w drużynie nie jest zdolny do walki. Uciekacie, gubiąc ${g} zł.</p><button class="btn-main" data-act="close">Dalej</button>`);render();return}const E=Object.assign({r:Math.min(4,Math.max(0,Math.floor((S.stage-1)/5))),L:Math.min(3,1+((S.stage-1)%5>2?1:0)),st:Math.max(1,S.stage),rooms:[{k:'fight',done:0}],i:0,gold:0,loot:[],kills:0,road:1},extra||{});S.exp=E;save();
 const bio=BIOMES[(extra&&extra.bk!=null)?extra.bk:1];startBattle({st:E.st,est:E.st,bio,list:list||Array.from({length:3+(S.stage>8?1:0)},()=>pick(['bandyta','rzezimieszek','lucznikB'])),exp:true,lbl:lbl||'Zasadzka na trakcie',wl:'Zasadzka!'})}
function roadDone(){const E=S.exp;S.gold+=E.gold;bankLoot(E);S.exp=null;save();const q=E.qd;
 modal(`<h2>${ic('flag',20)} ${q?'Zwycięstwo!':'Droga wolna'}</h2><p>${ic('gold',16)} Łupy: ${E.gold} zł${E.loot.length?`, przedmioty: ${E.loot.length}`:''}.</p><button class="btn-main" data-act="${q?'qdlg':'revok'}" data-d="${q||''}">${ic('walk',20)} Dalej</button>`)}
function roadLost(){S.pend=null;save()}
