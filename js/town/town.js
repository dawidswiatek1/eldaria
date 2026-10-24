/* ===== MIASTO: mapa z lotu ptaka, usługi (bez rozbudowy), kontrakty, skarbiec, koszary, szpital, targ ===== */
const BUILD={
 zamek:{n:'Zamek',ic:'b_zamek',v:'castle',t:'kontrakty',d:'Siedziba kompanii: tablica kontraktów i skarbiec.',s:'3 kontrakty naraz, nagrody +25% · skarbiec do 1000 zł (8% odsetek po wyprawie)'},
 karczma:{n:'Karczma',ic:'tavern',v:'tavern',t:'werbunek',d:'Werbunek ochotników na towarzyszy.',s:'5 ochotników, czasem doświadczeni weterani'},
 kowal:{n:'Kowal',ic:'smith',v:'smith',t:'ekwipunek',d:'Kupno i sprzedaż ekwipunku.',s:'8 przedmiotów, nowy towar po każdej wyprawie'},
 swiatynia:{n:'Świątynia',ic:'temple',v:'temple',t:'leczenie',d:'Leczenie ran i reset talentów.',s:'Pełne leczenie kompanii i reset talentów'},
 targ:{n:'Targ',ic:'b_targ',v:'market',t:'zapasy',d:'Zapasy na wyprawę.',s:'Pochodnie, bandaże, prowiant, mikstury i zioła · torba na 10 zapasów'},
 koszary:{n:'Koszary',ic:'b_koszary',v:'barracks',t:'trening',d:'Mistrz musztry trenuje bohaterów bez walki.',s:'2 miejsca treningowe (+25% PD) · kompania do 14 bohaterów'},
 lecznica:{n:'Szpital',ic:'b_lecznica',v:'infirmary',t:'urazy',d:'Opieka nad rannymi: pobyt w szpitalu, leczenie urazów i protezy.',s:'Skraca pobyt w szpitalu, leczy urazy ciała i ducha, dopasowuje protezy'},
 alchemik:{n:'Alchemik',ic:'b_alchemik',v:'alchemist',t:'eliksiry',d:'Mikstury i eliksiry odporności na wyprawę.',s:'Wielka mikstura i wszystkie eliksiry'},
 zaklinacz:{n:'Zaklinacz',ic:'b_zaklinacz',v:'enchanter',t:'ulepszenia',d:'Ulepszanie przedmiotów i nowe właściwości.',s:'Ulepszenia do +5, dodawanie i przekuwanie właściwości'},
 cmentarz:{n:'Cmentarz',ic:'b_cmentarz',v:'graveyard',t:'polegli',d:'Pamięć o poległych towarzyszach i przyzywanie ich duchów.',s:'Duch poległego wspiera drużynę przez jedną wyprawę'},
 gildia:{n:'Gildia łowców',ic:'b_gildia',v:'guild',t:'trofea',d:'Trofea, bestiariusz i nagrody za łowy.',s:'Skup trofeów (+25%) · bestiariusz po 6 zabiciach · 3 łowy'}
};
/* budynki nie mają już poziomów – każda usługa działa na stałym poziomie */
const TL_FIX={zamek:2,karczma:2,kowal:2,swiatynia:2,targ:3,koszary:2,lecznica:3,alchemik:3,zaklinacz:3,cmentarz:2,gildia:2};
const BV={};for(const k in BUILD)if(BUILD[k].v)BV[BUILD[k].v]=k;
function townOk(){if(typeof wOk==='function')wOk();if(S.town)delete S.town;
 if(S.vault==null)S.vault=0;if(!S.sup)S.sup={pochodnia:1,bandaz:2,prowiant:1};if(!S.con)S.con={av:[],act:[],n:0};if(!S.con.av.length)rollCon();
 S.roster.forEach(h=>{fateOk(h);if(h.tr==null)h.tr=0});ensureMain();if(!S.mat)S.mat={odl:0,esc:0};if(!S.tro)S.tro={};if(!S.kills)S.kills={};if(!S.bnt)rollBnt();if(S.spirit===undefined)S.spirit=null}
const tl=k=>TL_FIX[k]||1;
const rosterMax=()=>ROSTER_MAX+2*tl('koszary');
const pips=(l,m)=>Array.from({length:m||3},(_,i)=>`<i class="pip ${i<l?'on':''}"></i>`).join('');
/* --- mapa miasta --- */
let _tScroll=null;
function renderTown(){townOk();if(S.loc&&S.loc!=='weleszow'){renderSmallTown();return}const app=document.getElementById('app'),nb=S.roster.some(h=>h.free||tFree(h));
 app.innerHTML=`<div class="townv"><div class="ttop wel" style="background-image:linear-gradient(90deg,#140d12f0 0%,#140d12a0 30%,#140d1240 55%,#140d12c8 85%),url(${VART.p_weleszow})"><button class="btn-small" data-act="tab" data-t="team">${ic('nav_team',18)}<span class="lbl">Drużyna</span>${nb?'<span class="badge">!</span>':''}</button><button class="btn-small" data-act="tab" data-t="fallen" aria-label="Polegli">${ic('nav_fallen',18)}</button>
 <h2>${emb(20)} Weleszów <small class="tsub">stolica Velesii</small></h2><button class="btn-small" data-act="journal">${ic('contract',18)}<span class="lbl"> Dziennik</span>${qBadge()}</button><span class="pill gold">${ic('gold',18)} ${S.gold}</span><button class="btn-small" data-act="menu" aria-label="Menu">${ic('gear',18)}</button><button class="btn-main tgo" data-act="map" ${S.team.length?'':'disabled'}>${ic(S.exp?'walk':'map',20)} ${S.exp?'Wyprawa':'Mapa'}</button></div>
 <div class="tscroll" id="tscroll"><div class="tmap" id="tmap"></div></div><div class="thint">${ic('walk',12)} Przesuń, by rozejrzeć się po mieście · dotknij budynku</div></div>`;
 layoutTown()}
function layoutTown(){const sc=document.getElementById('tscroll'),m=document.getElementById('tmap');if(!sc||!m)return;const TM=GFX.TM;
 const s=Math.max(.5,sc.clientHeight/TM.H),W=Math.round(TM.W*s),H=Math.round(TM.H*s);
 m.style.width=W+'px';m.style.height=H+'px';
 let h=`<img class="px tbase" src="${TM.base}" style="width:${W}px;height:${H}px" alt=""><canvas class="tfx" id="tfx" width="${TM.W}" height="${TM.H}" style="width:${W}px;height:${H}px"></canvas>`;
 Object.keys(TM.pos).sort((a,b)=>TM.pos[a][1]-TM.pos[b][1]).forEach(k=>{const B=BUILD[k],o=TM.b[k][3],[x,y]=TM.pos[k],w=o.w*s,hh=o.h*s,l=(x-o.ax)*s,t=(y-o.ay)*s;
  const lab=B.t,hot=bldAlert(k);
  h+=`<img class="px tb" src="${o.u}" style="left:${Math.round(l)}px;top:${Math.round(t)}px;width:${Math.round(w)}px;height:${Math.round(hh)}px;z-index:${y}" alt="">`;
  h+=`<button class="tlab" data-act="tbld" data-k="${k}" style="left:${Math.round(x*s)}px;top:${Math.round(Math.max(16,t+hh*.12))}px;z-index:${600+y}">${ic(B.ic,11)}<b>${B.n}</b><span>${lab}</span>${hot?'<em>!</em>':''}</button>`;
  const bw=w*.8,bh=Math.max(hh*.75,o.ay*s*.6);h+=`<button class="thit" data-act="tbld" data-k="${k}" aria-label="${B.n}" style="left:${Math.round(x*s-bw/2)}px;top:${Math.round(y*s-bh)}px;width:${Math.round(bw)}px;height:${Math.round(bh)}px;z-index:${400+y}"></button>`});
 m.innerHTML=h;
 if(_tScroll==null)_tScroll=Math.max(0,TM.pos.zamek[0]*s-sc.clientWidth/2);sc.scrollLeft=_tScroll;
 const ls=[...m.querySelectorAll('.tlab')].sort((a,b)=>a.offsetTop-b.offsetTop),R=[];ls.forEach(e=>{let r=e.getBoundingClientRect();for(let n=0;n<4;n++){const o=R.find(q=>r.left<q.right&&q.left<r.right&&r.top<q.bottom&&q.top<r.bottom);if(!o)break;e.style.top=(e.offsetTop+(o.bottom-r.top)/UIZ+1)+'px';r=e.getBoundingClientRect()}R.push(r)});
 townAnim()}
/* --- ożywienie mapy: mieszkańcy na drogach i migotanie wody --- */
let _tAnimId=0;
function townAnim(){const cv=document.getElementById('tfx');if(!cv)return;const TM=GFX.TM,x=cv.getContext('2d'),id=++_tAnimId,P=TM.paths||[],Wt=TM.water||[];
 const COL=['#7a2f2f','#2f4f7a','#3f6a35','#6a4a8a','#8a6a2f','#5a5a5a','#a04a20','#2f6a6a'],HAIR=['#2a1a10','#6a3a1a','#c8a050','#e8e0d0','#3a2a20'],SK=['#f0c8a0','#d8a878','#a87050'];
 const seg=p=>{let L=[0];for(let i=1;i<p.length;i++)L.push(L[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));return L};
 const PL=P.map(seg),rnd=a=>a[Math.floor(Math.random()*a.length)];
 const ppl=[];P.forEach((p,i)=>{const n=PL[i][PL[i].length-1]>120?3:2;for(let j=0;j<n;j++)ppl.push({p:i,d:Math.random()*PL[i][PL[i].length-1],v:(Math.random()<.5?-1:1)*(4+Math.random()*4),c:rnd(COL),h:rnd(HAIR),s:rnd(SK),w:0,hat:Math.random()<.3})});
 const at=(o)=>{const p=P[o.p],L=PL[o.p];let i=1;while(i<L.length-1&&L[i]<o.d)i++;const f=(o.d-L[i-1])/((L[i]-L[i-1])||1);return [p[i-1][0]+(p[i][0]-p[i-1][0])*f,p[i-1][1]+(p[i][1]-p[i-1][1])*f]};
 const red=matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;let last=performance.now(),fr=0;
 function man(o,X,Y,st){X=Math.round(X);Y=Math.round(Y);x.fillStyle='rgba(0,0,0,.28)';x.fillRect(X-2,Y,5,1);
  x.fillStyle='#1a120e';x.fillRect(X-2,Y-9,5,8);x.fillRect(X-1,Y-10,3,1);
  x.fillStyle=o.hat?'#8a5a2a':o.h;x.fillRect(X-1,Y-9,3,2);if(o.hat){x.fillRect(X-2,Y-8,5,1)}
  x.fillStyle=o.s;x.fillRect(X-1,Y-7,3,1);
  x.fillStyle=o.c;x.fillRect(X-1,Y-6,3,3);
  x.fillStyle='#2a2018';const a=st%2;x.fillRect(X-1,Y-3,1,2+a);x.fillRect(X+1,Y-3,1,3-a);x.clearRect(X-2,Y-1,5,1);x.fillStyle='rgba(0,0,0,.28)';x.fillRect(X-2,Y,5,1);x.fillStyle='#2a2018';x.fillRect(X-1+(a?0:2),Y-1,1,1)}
 function draw(t){x.clearRect(0,0,TM.W,TM.H);
  for(let i=0;i<Wt.length;i++){const q=Wt[i],v=Math.sin(t/700+i*2.39)*Math.sin(t/1300+i*.7);if(v>.82){x.fillStyle=v>.93?'#ffffff':'#cfe8ff';x.fillRect(q[0],q[1],1,1);if(v>.95){x.fillStyle='#e8f6ff';x.fillRect(q[0]-1,q[1],3,1)}}}
  ppl.sort((a,b)=>a._y-b._y).forEach(o=>{const [X,Y]=at(o);o._y=Y;man(o,X,Y,o.w?0:Math.floor(t/220+o.d))})}
 function step(now){if(id!==_tAnimId||!document.body.contains(cv))return;const dt=Math.min(.2,(now-last)/1000);
  if(now-last>=90){last=now;ppl.forEach(o=>{if(o.w>0){o.w-=dt;return}const L=PL[o.p][PL[o.p].length-1];o.d+=o.v*dt;if(o.d<0||o.d>L){o.v=-o.v;o.d=Math.max(0,Math.min(L,o.d));if(Math.random()<.5)o.w=1+Math.random()*3}else if(Math.random()<.003)o.w=1+Math.random()*2});draw(now)}
  requestAnimationFrame(step)}
 draw(performance.now());if(!red)requestAnimationFrame(step)}
addEventListener('scroll',e=>{if(e.target&&e.target.id==='tscroll')_tScroll=e.target.scrollLeft},true);
addEventListener('resize',()=>{if(screen==='camp'&&tab==='town'&&!townView)setTimeout(layoutTown,120)});
/* --- nagłówek budynku (usługa) --- */
function bldAlert(k){if(!S)return false;if(k==='zamek')return S.con.act.some(c=>c.ok);if(k==='lecznica')return S.roster.some(h=>h.hosp>0);if(k==='gildia')return (S.bnt||[]).some(t=>(S.tro[t.k]||0)>=t.n);return false}
function bldHead(k){townOk();const B=BUILD[k],o=GFX.TM.b[k][3],sc=Math.min(2,64/o.h,96/o.w);
 return `<div class="bhead"><div class="bimg"><img class="px" src="${o.u}" style="width:${Math.round(o.w*sc)}px;height:${Math.round(o.h*sc)}px" alt=""></div><div class="binf"><div class="row1"><button class="btn-small" data-act="town" data-v="">${ic('back',16)}<span class="lbl"> ${S.loc&&NODES[S.loc]?NODES[S.loc].n:'Miasto'}</span></button><h2>${ic(B.ic,20)} ${bName(k)}</h2></div>
 <div class="sub">${B.d}</div><div class="sub gold">${ic('flag',12)} ${B.s}</div></div></div>`}
function bldView(v){const k=BV[v];let b=bldHead(k);
 if(v==='castle')b+=castleHtml();else if(v==='barracks')b+=barracksHtml();else if(v==='infirmary')b+=infirmaryHtml();else if(v==='market')b+=marketHtml();else if(v==='alchemist')b+=alchHtml();else if(v==='enchanter')b+=enchHtml();else if(v==='graveyard')b+=graveHtml();else if(v==='guild')b+=guildHtml();return b}
/* --- KONTRAKTY --- */
const CON_N=()=>1+tl('zamek');
function conGen(){regOk();const R=S.reg,open=R.lv.map((l,i)=>l?i:-1).filter(i=>i>=0),r=pick(open),bio=BIOMES[r],st=expStage(r,Math.max(1,Math.min(3,R.lv[r]))),mul=1+.25*(tl('zamek')-1),G=v=>Math.round(v*mul/5)*5;
 const pool=bio.pool.filter(p=>Math.min(3,R.lv[r])+1>=p[0]).map(p=>p[1]),opts=[];
 const e=pick(pool),n=4+Math.floor(Math.random()*4);opts.push({t:'kill',e,n,g:G(30+st*9+n*4),txt:`Upoluj: ${ENEMIES[e].name} ×${n}`,s:`${bio.n}`});
 if(R.lv[r]>=4&&!S.con.act.some(c=>c.t==='boss'&&c.r===r))opts.push({t:'boss',r,n:1,g:G(150+r*90),it:2,txt:`Pokonaj: ${ENEMIES[bio.boss].name}`,s:`Leże bossa – ${bio.n}`});
 const L=Math.max(1,Math.min(3,R.lv[r]));opts.push({t:'clean',r,L,n:1,g:G(60+st*14),it:1,txt:`Oczyść ${bio.n} (poz. ${['','I','II','III'][L]}+) bez strat`,s:'Nikt z drużyny nie może zginąć'});
 opts.push({t:'chest',n:2+Math.floor(Math.random()*3),g:0,txt:'',s:'Dowolna kraina'});const ch=opts[opts.length-1];ch.g=G(25+ch.n*15+st*4);ch.txt=`Otwórz ${ch.n} skrzynie`;
 const gg=Math.round((60+st*22)/10)*10;opts.push({t:'gold',n:gg,g:G(30+st*8),txt:`Przynieś ${gg} zł łupów z jednej wyprawy`,s:'Liczy się złoto zebrane na wyprawie'});
 const el=1+Math.floor(Math.random()*2);opts.push({t:'elite',n:el,g:G(40+st*10+el*20),txt:`Rozbij ${el} ${el>1?'oddziały':'oddział'} elity`,s:'Ostatnie komnaty wypraw'});
 if(tl('gildia')){const tn=3+Math.floor(Math.random()*3);opts.push({t:'tro',n:tn,g:G(30+tn*12+st*5),txt:`Zbierz ${tn} trofeów`,s:'Trofea wypadają z pokonanych potworów'})}
 opts.push({t:'exp',n:2,g:G(40+st*8),txt:'Ukończ 2 wyprawy',s:'Dowolne krainy i poziomy'});
 const c=pick(opts);c.id=++S.con.n;c.p=0;return c}
function rollCon(){S.con.av=[];const seen=new Set();let t=0;while(S.con.av.length<3&&t++<30){const c=conGen(),key=c.t+(c.e||'')+(c.r!=null?c.r:'');if(seen.has(key))continue;seen.add(key);S.con.av.push(c)}}
function conEv(type,d){if(!S||!S.con)return;const done=[];S.con.act.forEach(c=>{if(c.ok)return;
 if(type==='kill'&&c.t==='kill'&&c.e===d)c.p++;
 else if(type==='boss'&&c.t==='boss'&&c.r===d)c.p=1;
 else if(type==='elite'&&c.t==='elite')c.p++;
 else if(type==='chest'&&c.t==='chest')c.p++;
 else if(type==='tro'&&c.t==='tro')c.p+=d||1;
 else if(type==='exp'){if(c.t==='exp')c.p++;if(c.t==='clean'&&d.r===c.r&&d.L>=c.L&&!d.lost)c.p=1;if(c.t==='gold'&&d.gold>=c.n)c.p=c.n}
 c.p=Math.min(c.p,c.n);if(c.p>=c.n){c.ok=1;done.push(c)}});
 if(done.length)setTimeout(()=>toast(`${'✔'} Kontrakt wykonany: ${done[0].txt}! Odbierz nagrodę w Zamku.`),400);return done}
function conCard(c,act){const pr=c.t==='gold'?(c.p>=c.n?'✔':'0/1'):`${c.p}/${c.n}`;return `<div class="con ${c.ok?'ok':''}"><div class="ci">${ic('contract',28)}</div><div class="cinf"><b>${esc(c.txt)}</b><small>${esc(c.s||'')}</small><small class="rw">${ic('gold',12)} ${c.g}${c.it?` + przedmiot (${RAR[c.it].n.toLowerCase()}+)`:''}</small>${act?`<i class="bar xp"><i style="width:${(c.t==='gold'?(c.ok?1:0):c.p/c.n)*100}%"></i></i><small>Postęp: ${pr}</small>`:''}</div>
 ${act?(c.ok?`<button class="btn-small btn-gold" data-act="conclaim" data-id="${c.id}">Odbierz</button>`:`<button class="btn-small" data-act="condrop" data-id="${c.id}" aria-label="Porzuć">✕</button>`):`<button class="btn-small btn-green" data-act="contake" data-id="${c.id}" ${S.con.act.length>=CON_N()?'disabled':''}>Przyjmij</button>`}</div>`}
function castleHtml(){const L=tl('zamek'),cap=[0,300,1000,3000][L],rate=[0,5,8,12][L];
 let b=`<h2>${ic('contract',20)} Tablica kontraktów <small class="sub">(aktywne ${S.con.act.length}/${CON_N()})</small></h2>`;
 b+=S.con.act.length?'<div class="cols">'+S.con.act.map(c=>conCard(c,1)).join('')+'</div>':`<div class="empty">Brak przyjętych kontraktów.</div>`;
 b+=`<div class="sub" style="margin:6px 0 4px">Nowe zlecenia (zmieniają się po każdej wyprawie):</div>`+(S.con.av.length?'<div class="cols">'+S.con.av.map(c=>conCard(c,0)).join('')+'</div>':`<div class="empty">Tablica pusta – wróć po wyprawie.</div>`);
 b+=`<button style="width:100%;margin-top:4px" data-act="conreroll" ${S.gold<20?'disabled':''}>${ic('reroll',18)} Nowe zlecenia (20 ${ic('gold',14)})</button>`;
 b+=`<h2>${ic('vault',20)} Skarbiec kompanii</h2><div class="vault"><div class="vv">${ic('vault',32)}<span><b>${S.vault} / ${cap} zł</b><small>Po każdej wyprawie skarbiec przynosi ${rate}% odsetek (do limitu).</small></span></div>
 <div class="row"><button class="btn-small" data-act="vin" data-n="50" ${S.gold<1||S.vault>=cap?'disabled':''}>Wpłać 50</button><button class="btn-small" data-act="vin" data-n="all" ${S.gold<1||S.vault>=cap?'disabled':''}>Wpłać max</button><button class="btn-small" data-act="vout" data-n="50" ${S.vault<1?'disabled':''}>Wypłać 50</button><button class="btn-small" data-act="vout" data-n="all" ${S.vault<1?'disabled':''}>Wypłać wszystko</button></div></div>`;
 return b}
function vaultTick(){const L=tl('zamek'),cap=[0,300,1000,3000][L],rate=[0,.05,.08,.12][L];const v=Math.max(0,Math.min(cap-S.vault,Math.floor(S.vault*rate)));S.vault+=v;return v}
/* --- KOSZARY: trening --- */
const trSlots=()=>tl('koszary');
const trCost=h=>Math.round(30+h.lvl*15);
const trXp=h=>Math.round(xpNeed(h.lvl)*(.55+.25*(tl('koszary')-1)));
function barracksHtml(){const tr=S.roster.filter(h=>h.tr),free=S.roster.filter(h=>!h.tr&&!h.hosp);
 let b=`<div class="note">${ic('train',14)} Bohater w treningu nie wyrusza na wyprawę. Gdy kompania wróci z najbliższej wyprawy (lub z niej się wycofa), otrzyma PD i wróci do rezerwy. Miejsca: ${tr.length}/${trSlots()} · kompania: ${S.roster.length}/${rosterMax()}</div>`;
 b+=`<h2>${ic('train',20)} Na placu ćwiczeń</h2>`+(tr.length?'<div class="cols">'+tr.map(h=>heroCard(h,`<button class="btn-small" data-act="trstop" data-id="${h.id}">Przerwij</button>`)).join('')+'</div>':`<div class="empty">Nikt nie trenuje.</div>`);
 b+=`<h2>Wyślij na trening</h2>`+(free.length?'<div class="cols">'+free.map(h=>heroCard(h,`<button class="btn-small btn-gold" data-act="trgo" data-id="${h.id}" ${tr.length>=trSlots()||S.gold<trCost(h)||S.exp?'disabled':''}>+${trXp(h)} PD · ${trCost(h)} ${ic('gold',14)}</button>`)).join('')+'</div>':`<div class="empty">Brak bohaterów.</div>`);return b}
function trainPayout(){const o=[];S.roster.filter(h=>h.tr).forEach(h=>{const l=h.lvl,x=trXp(h);gainXp(h,x);h.tr=0;o.push(`${h.name.split(' ')[0]} kończy trening: +${x} PD${h.lvl>l?` (poziom ${h.lvl}!)`:''}`)});return o}
/* --- URAZY i LECZNICA --- */
const INJ={
 reka:{n:'Złamana ręka',d:'−15% ataku',f:{atkP:-.15}},noga:{n:'Skręcona noga',d:'−2 szybkości',f:{spd:-2}},zebra:{n:'Złamane żebra',d:'−15% PŻ',f:{hpP:-.15}},
 glowa:{n:'Wstrząs mózgu',d:'−10% ataku, −1 szybkości',f:{atkP:-.1,spd:-1}},rana:{n:'Głęboka rana',d:'−10% PŻ i obrony',f:{hpP:-.1,defP:-.1}},
 lek:{n:'Lęk',m:1,d:'−15% obrony',f:{defP:-.15}},koszmary:{n:'Koszmary',m:1,d:'−10% PŻ, −1 szybkości',f:{hpP:-.1,spd:-1}},gniew:{n:'Ślepy gniew',m:1,d:'+10% ataku, −20% obrony',f:{atkP:.1,defP:-.2}}};
function injFx(h){const o={atkP:0,hpP:0,defP:0,spd:0,crit:0,miss:0};(h.inj||[]).forEach(k=>{const f=INJ[k]&&INJ[k].f;if(!f)return;const m=h.injT&&h.injT[k]?.5:1;for(const s in f)o[s]+=f[s]*m});return o}
const injChips=h=>(h.inj||[]).filter(k=>INJ[k]).map(k=>`<span class="inj ${INJ[k].m?'m':''} ${INJ[k].p?'p':''}" title="${INJ[k].n} (${injKind(k)}${h.injT&&h.injT[k]?', złagodzony':''}): ${INJ[k].d}">${ic(injIc(k),12)}${INJ[k].n}</span>`).join('');
function rollInjuries(){const out=[];if(!B)return out;const red=.8;
 B.units.filter(u=>u.side==='h'&&u.alive).forEach(u=>{const h=u.hero;if(!h.inj)h.inj=[];const easy=S.exp&&S.exp.r===0&&S.exp.L<=2?.5:1,ch=((u._low?.25:0)+(u._crit?.1:0)+(B.units.some(e=>e.boss&&e.side==='e')?.05:0))*red*easy;if(!ch||h.inj.length>=3||Math.random()>=ch)return;
  const mind=Math.random()<.3,ks=Object.keys(INJ).filter(k=>!INJ[k].p&&!h.inj.includes(k)&&(mind?INJ[k].m:!INJ[k].m));if(!ks.length)return;const k=pick(ks);h.inj.push(k);out.push({h,k})});return out}
/* --- TARG i ZAPASY --- */
const SUP={
 pochodnia:{n:'Pochodnia',ic:'torch',p:12,lv:1,d:'Oświetla 2 kolejne komnaty: widzisz je na mapie, a pułapki i zasadzki w nich zostaną wykryte.',w:'exp'},
 bandaz:{n:'Bandaż',ic:'bandaz',p:10,lv:1,d:'Leczy 20% PŻ jednego bohatera i tamuje krwawienie lub truciznę.',w:'one'},
 prowiant:{n:'Prowiant',ic:'prowiant',p:8,lv:1,d:'Drużyna odzyskuje 10% PŻ. Przy ognisku: odpoczynek leczy 60% zamiast 35%.',w:'exp'},
 mikstura:{n:'Mikstura lecznicza',ic:'mikstura',p:28,lv:2,d:'Leczy 45% PŻ jednego bohatera.',w:'one'},
 ziola:{n:'Zioła lecznicze',ic:'ziola',p:40,lv:3,d:'Cała drużyna odzyskuje 25% PŻ (także w walce).',w:'all'}};
const bagCap=()=>4+2*tl('targ');
const bagN=()=>Object.values(S.sup||{}).reduce((a,b)=>a+b,0);
const bagB=()=>Object.keys(SUP).filter(k=>SUP[k].w!=='exp').reduce((a,k)=>a+((S.sup||{})[k]||0),0);
const supPrice=k=>SUP[k].p;
function marketHtml(){const L=tl('targ');
 let b=`<div class="note">${ic('bag',14)} Torba na zapasy: <b>${bagN()}/${bagCap()}</b>. Zapasy zabierasz na każdą wyprawę; użyjesz ich w korytarzu (przycisk ${ic('bag',12)} Torba) i w walce (nie zużywa tury).</div><div class="cols">`;
 for(const k in SUP){if(SUP[k].src)continue;const s=SUP[k],ok=L>=s.lv;b+=`<div class="item sup ${ok?'':'lk'}"><div class="ii">${ic(s.ic,32)}</div><div class="inf"><div class="inm">${s.n} <span class="cnt">×${S.sup[k]||0}</span></div><div class="sub">${s.d}</div></div>${ok?`<button class="btn-small btn-gold" data-act="supbuy" data-k="${k}" ${S.gold<supPrice(k)||bagN()>=bagCap()?'disabled':''}>${supPrice(k)} ${ic('gold',14)}</button>`:`<button class="btn-small" disabled>${ic('lock',14)} poz. ${s.lv}</button>`}</div>`}
 return b+'</div>'}
function bagModal(inBattle){const ks=Object.keys(SUP).filter(k=>S.sup[k]>0&&(!inBattle||SUP[k].w!=='exp'));
 modal(`<h2>${ic('bag',20)} Torba (${bagN()}/${bagCap()})</h2>${inBattle?'<div class="sub">Użycie przedmiotu w walce nie zużywa tury (raz na turę).</div>':''}${ks.length?'<div class="cols">'+ks.map(k=>`<div class="item sup"><div class="ii">${ic(SUP[k].ic,28)}</div><div class="inf"><div class="inm">${SUP[k].n} <span class="cnt">×${S.sup[k]}</span></div><div class="sub">${SUP[k].d}</div></div><button class="btn-small btn-green" data-act="supuse" data-k="${k}" data-b="${inBattle?1:0}">Użyj</button></div>`).join('')+'</div>':`<div class="empty">Brak przydatnych zapasów. Kup je na Targu przed wyprawą.</div>`}<button class="btn-main" data-act="close">Zamknij</button>`)}
function supPick(k,inBattle){const list=inBattle?B.units.filter(u=>u.side==='h'&&u.alive):partyHeroes();
 modal(`<h2>${ic(SUP[k].ic,20)} ${SUP[k].n}: kogo opatrzyć?</h2><div class="supg">${list.map(x=>{const h=inBattle?x.hero:x,hp=inBattle?x.hp:h.hp,mx=inBattle?x.maxHp:mh(h);return `<button class="supt" data-act="supon" data-k="${k}" data-id="${h.id}" data-b="${inBattle?1:0}">${bust(heroSprite(h),h.cls,32,1,-4)}<span><b>${esc(h.name.split(' ')[0])}</b><small>${hp}/${mx} PŻ${inBattle&&x.st.bleed?' · '+x.st.bleed.ic:''}</small></span></button>`}).join('')}</div><button data-act="bag" data-b="${inBattle?1:0}">${ic('back',14)} Wróć</button>`)}
function supApply(k,id,inBattle){if(!(S.sup[k]>0))return;const E=S.exp;
 if(inBattle){if(!B||!B.awaiting)return;if(B.itemT===B.turnId){toast('W tej turze użyto już przedmiotu.');return}
  const tgts=SUP[k].w==='all'?B.units.filter(u=>u.side==='h'&&u.alive):[B.units.find(u=>u.side==='h'&&u.hero.id===id)];if(!tgts[0])return;
  S.sup[k]--;B.itemT=B.turnId;closeModal();tgts.forEach(u=>{heal(u,u.maxHp*(SUP[k].h||.25));if(k==='bandaz'&&u.st.bleed){delete u.st.bleed;flt(u,'Opatrzony','info')}updUnit(u)});log(`🎒 Użyto: ${SUP[k].n}.`,'g');refreshBattle();save();return}
 if(SUP[k].w==='buff'){if(!E)return;S.sup[k]--;expAddFx(E,SUP[k].fx,SUP[k].n);if(inBattle){B.itemT=B.turnId;closeModal();B.units.filter(u=>u.side==='h'&&u.alive).forEach(u=>{buffUnit(u,SUP[k].fx);ring(u,'#ffe36a');updUnit(u)});log(`🎒 ${SUP[k].n}: ${SUP[k].d}`,'g');refreshBattle();save();return}save();closeModal();render();toast(`${SUP[k].n}: działa do końca wyprawy.`);return}
 if(!E)return;let t='';
 if(k==='pochodnia'){E.torch=Math.max(E.torch||0,E.i+2);t='Pochodnia rozświetla drogę: widzisz 2 kolejne komnaty.'}
 else if(k==='prowiant'){t=`Posiłek: drużyna odzyskuje ${healAll(.1)} PŻ.`}
 else if(k==='ziola'){t=`Zioła: drużyna odzyskuje ${healAll(.25)} PŻ.`}
 else{const h=getHero(id);if(!h)return;const v=Math.min(mh(h)-h.hp,Math.round(mh(h)*(SUP[k].h||.25)));h.hp+=v;t=`${h.name.split(' ')[0]} odzyskuje ${v} PŻ.`}
 S.sup[k]--;save();closeModal();render();toast(t)}
const litRoom=i=>S.exp&&S.exp.torch!=null&&i<=S.exp.torch;
/* --- wspólne zdarzenia końca wyprawy --- */
function expEndTown(E,lost,done){const o=[];if(done)conEv('exp',{r:E.r,L:E.L,lost:!!E.lost,gold:E.gold});
 hospApply().forEach(t=>o.push(t));const v=vaultTick();if(v)o.push(`${ic('vault',14)} Skarbiec: +${v} zł odsetek`);trainPayout().forEach(t=>o.push(`${ic('train',14)} ${t}`));
 S.con.av=[];rollCon();rollBnt();return o}
/* --- obsługa dotyku --- */
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||!S)return;const a=el.dataset.act,id=+el.dataset.id;
 switch(a){
 case 'tbld':{const k=el.dataset.k,Bd=BUILD[k];townView=Bd.v;render();document.querySelector('.main')&&(document.querySelector('.main').scrollTop=0);break}
 case 'contake':{const i=S.con.av.findIndex(c=>c.id===id);if(i<0||S.con.act.length>=CON_N())return;S.con.act.push(S.con.av.splice(i,1)[0]);save();render();break}
 case 'condrop':S.con.act=S.con.act.filter(c=>c.id!==id);save();render();break;
 case 'conclaim':{const c=S.con.act.find(c=>c.id===id&&c.ok);if(!c)return;S.gold+=c.g;let t=`Nagroda: ${c.g} zł`;if(c.it){const it=makeItem(Math.max(2,S.stage),rollRar(.2,c.it));if(S.inv.length<INV_MAX){S.inv.push(it);t+=` i ${it.n}`}else{S.gold+=sellPrice(it);t+=` (+${sellPrice(it)} zł za przedmiot – plecak pełny)`}}S.con.act=S.con.act.filter(x=>x!==c);save();render();toast(t+'!');break}
 case 'conreroll':if(S.gold<20)return;S.gold-=20;rollCon();save();render();break;
 case 'vin':{const cap=[0,300,1000,3000][tl('zamek')],n=Math.min(S.gold,cap-S.vault,el.dataset.n==='all'?1e9:50);if(n<=0)return;S.gold-=n;S.vault+=n;save();render();break}
 case 'vout':{const n=Math.min(S.vault,el.dataset.n==='all'?1e9:50);S.vault-=n;S.gold+=n;save();render();break}
 case 'trgo':{const h=getHero(id);if(!h||S.exp||S.roster.filter(x=>x.tr).length>=trSlots()||S.gold<trCost(h))return;S.gold-=trCost(h);h.tr=1;S.team=S.team.filter(x=>x!==id);save();render();break}
 case 'trstop':{const h=getHero(id);if(h){h.tr=0;save();render()}break}
 case 'injheal':{const h=getHero(id),k=el.dataset.k;if(!h||!h.inj.includes(k))return;const c=injCost(h,k);if(S.gold<c||INJ[k].p)return;S.gold-=c;h.inj=h.inj.filter(x=>x!==k);if(h.hp>stats(h).maxHp)h.hp=stats(h).maxHp;save();render();toast(`${h.name.split(' ')[0]}: wyleczono – ${INJ[k].n}.`);break}
 case 'supbuy':{const k=el.dataset.k;if(tl('targ')<SUP[k].lv||S.gold<supPrice(k)||bagN()>=bagCap())return;S.gold-=supPrice(k);S.sup[k]=(S.sup[k]||0)+1;save();render();break}
 case 'bag':bagModal(el.dataset.b==='1');break;
 case 'supuse':{const k=el.dataset.k,inB=el.dataset.b==='1';if(SUP[k].w==='one')supPick(k,inB);else supApply(k,null,inB);break}
 case 'supon':supApply(el.dataset.k,id,el.dataset.b==='1');break;
 case 'tomarket':closeModal();screen='camp';tab='town';townView='market';render();break;
 }});
