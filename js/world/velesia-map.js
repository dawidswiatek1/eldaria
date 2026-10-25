/* ===== VELESIA v18: duża mapa (przesuwanie, zoom), mgła wojny, wioski, ciekawe miejsca, dni podróży ===== */
const nodeVis=k=>nodeOk(k)||(S.found&&S.found[k]);
/* mgła: odkryj sąsiadów miejsca (oprócz sekretnych) */
/* sekretne miejsca: odsłania je dopiero rozmowa albo zadanie */
const SECRET=['polana','chata','wyrab','kaplica','jagna','kurhan','czarnybor','kuznia'];
function reveal(k,quiet){const nw=[];EDGES.forEach(([a,b])=>{const o=a===k?b:b===k?a:null;if(o&&!SECRET.includes(o)&&NODES[o].hidden&&!S.found[o]){S.found[o]=1;nw.push(NODES[o].n)}});if(nw.length&&!quiet)toast('Odkryto na mapie: '+nw.join(', '));return nw}
const fogN=k=>NODES[k].hidden&&!S.found[k]&&!SECRET.includes(k)&&EDGES.some(([a,b])=>(a===k&&nodeOk(b))||(b===k&&nodeOk(a)));
/* znane miejsce bez znanej drogi: odsłoń najkrótszy szlak */
function rawPath(a,b){const prev={[a]:null},q=[a];while(q.length){const c=q.shift();if(c===b){const p=[];let x=c;while(x!=null){p.unshift(x);x=prev[x]}return p}EDGES.forEach(([u,v])=>{const o=u===c?v:v===c?u:null;if(o&&!(o in prev)&&NODES[o].ty!=='exit'&&(!SECRET.includes(o)||o===b||S.found[o])){prev[o]=c;q.push(o)}})}return null}
function routeFix(){if(!S||!NODES[S.loc])return;Object.keys(NODES).filter(k=>nodeOk(k)&&NODES[k].ty!=='exit').forEach(k=>{if(k===S.loc||pathTo(S.loc,k))return;const p=rawPath(S.loc,k);if(p)p.forEach(n=>{if(NODES[n].hidden)S.found[n]=1})})}
/* --- dni podróży --- */
function passDays(n){for(let i=0;i<n;i++){S.day=(S.day||1)+1;if(S.day%3===0)S.roster.forEach(h=>{if(h.hosp>0)h.hosp--})}}
const dayTxt=()=>`Dzień ${S.day||1}`;
/* --- widok mapy z przesuwaniem i zoomem ---
   mapa to pixel-art 1024×640 (tools/velesia_map.py); zoom liczony tak, by piksel mapy
   miał od „wypełnij widok” do 4 pikseli ekranu, domyślnie 2 */
const MAPW=1024,MAPH=640;
let MZ={z:1,x:null,y:null},_mp=null;
function mvRect(){const v=document.getElementById('rview');if(!v)return null;const r=v.getBoundingClientRect();return {v,r,k:r.width/(v.offsetWidth||1)}}
function mvBase(v){const W=v.offsetWidth,H=v.offsetHeight,ar=MAPW/MAPH;let w=W,h=W/ar;if(h<H){h=H;w=H*ar}return {W,H,w,h}}
const mvMaxZ=B0=>Math.max(1,4*MAPW/B0.w);
const mvDefZ=B0=>Math.min(mvMaxZ(B0),Math.max(1,(B0.H<420?1.5:2)*MAPW/B0.w));
function mvApply(){const R=mvRect();if(!R)return;const m=document.getElementById('rmap'),B0=mvBase(R.v);
 if(MZ.x==null){MZ.z=mvDefZ(B0);const N=NODES[hereNode()]||NODES.weleszow;MZ.x=B0.W/2-N.x/100*B0.w*MZ.z;MZ.y=B0.H/2-N.y/100*B0.h*MZ.z}
 MZ.z=Math.min(mvMaxZ(B0),Math.max(1,MZ.z));const w=B0.w*MZ.z,h=B0.h*MZ.z;
 MZ.x=Math.min(0,Math.max(B0.W-w,MZ.x));MZ.y=Math.min(0,Math.max(B0.H-h,MZ.y));
 m.style.width=w+'px';m.style.height=h+'px';m.style.transform=`translate(${Math.round(MZ.x)}px,${Math.round(MZ.y)}px)`;
 const zl=document.getElementById('rzl');if(zl)zl.textContent=Math.round(MZ.z*100)+'%';ngoPlace();
 /* v19: etykiety przy krawędzi widoku nie są ucinane */
 m.querySelectorAll('.npin').forEach(p=>{const b=p.querySelector('b');if(!b)return;const px=MZ.x+parseFloat(p.style.left)/100*w,hw=b.offsetWidth/2;let dx=0;if(px<0||px>B0.W)dx=0;else if(px-hw<3)dx=3-(px-hw);else if(px+hw>B0.W-3)dx=B0.W-3-(px+hw);b.style.translate=dx?Math.round(dx)+'px 0':''})}
function ngoPlace(){const g=document.getElementById('ngo');if(g&&!document.querySelector(`#rmap .npin[data-k="${g.dataset.k}"]`))g.remove()}
function mvZoom(f,cx,cy){const R=mvRect();if(!R)return;const B0=mvBase(R.v),z0=MZ.z,z=Math.max(1,Math.min(mvMaxZ(B0),z0*f));if(z===z0)return;
 if(cx==null){cx=B0.W/2;cy=B0.H/2}const mx=(cx-MZ.x)/z0,my=(cy-MZ.y)/z0;MZ.z=z;MZ.x=cx-mx*z;MZ.y=cy-my*z;mvApply()}
function mvCenter(k){const R=mvRect();if(!R)return;const B0=mvBase(R.v),N=NODES[k||hereNode()];MZ.x=B0.W/2-N.x/100*B0.w*MZ.z;MZ.y=B0.H/2-N.y/100*B0.h*MZ.z;mvApply()}
/* trafienie: najbliższy węzeł w promieniu ~32 px ekranu (z etykietą) */
function nodeAt(cx,cy){let best=null,bd=1e9;document.querySelectorAll('#rmap .npin').forEach(p=>{const r=p.getBoundingClientRect(),i=p.querySelector('i').getBoundingClientRect();
 const inLab=cx>=r.left-6&&cx<=r.right+6&&cy>=r.top-6&&cy<=r.bottom+6;const d=Math.hypot(cx-(i.left+i.width/2),cy-(i.top+i.height/2));const s=inLab?Math.min(d,20):d;if(s<bd){bd=s;best=p}});
 const R=mvRect(),lim=34*(R?R.k:1);return best&&bd<=lim?best.dataset.k:null}
function mvBind(){const R=mvRect();if(!R)return;const v=R.v,P=new Map();let st=null;
 v.addEventListener('pointerdown',e=>{if(e.target.closest('.ngo,.mzb'))return;v.setPointerCapture&&v.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(P.size===1)st={x:e.clientX,y:e.clientY,mx:MZ.x,my:MZ.y,moved:false,t:Date.now()};else if(P.size===2){const [a,b]=[...P.values()];st={pinch:Math.hypot(a.x-b.x,a.y-b.y),z:MZ.z,moved:true}}});
 v.addEventListener('pointermove',e=>{if(!P.has(e.pointerId)||!st)return;P.set(e.pointerId,{x:e.clientX,y:e.clientY});const k=mvRect().k;
  if(P.size===2&&st.pinch){const [a,b]=[...P.values()],d=Math.hypot(a.x-b.x,a.y-b.y),r=v.getBoundingClientRect();mvZoom(st.z*d/st.pinch/MZ.z,((a.x+b.x)/2-r.left)/k,((a.y+b.y)/2-r.top)/k);return}
  const dx=e.clientX-st.x,dy=e.clientY-st.y;if(!st.moved&&Math.hypot(dx,dy)>8*k){st.moved=true;v.classList.add('drag')}
  if(st.moved&&st.mx!=null){MZ.x=st.mx+dx/k;MZ.y=st.my+dy/k;mvApply()}});
 const up=e=>{if(!P.has(e.pointerId))return;P.delete(e.pointerId);if(P.size)return;v.classList.remove('drag');const s=st;st=null;
  if(s&&!s.moved&&!s.pinch){const k=nodeAt(e.clientX,e.clientY);if(k)selNode(k)}};
 v.addEventListener('pointerup',up);v.addEventListener('pointercancel',e=>{P.delete(e.pointerId);st=null;v.classList.remove('drag')});
 v.addEventListener('wheel',e=>{e.preventDefault();const r=v.getBoundingClientRect(),k=mvRect().k;mvZoom(e.deltaY<0?1.2:1/1.2,(e.clientX-r.left)/k,(e.clientY-r.top)/k)},{passive:false});
 if(!window._mvRs){window._mvRs=1;window.addEventListener('resize',()=>{if(screen==='region')setTimeout(mvApply,60)})}}
function selNode(k){if(!nodeVis(k)&&!fogN(k))return;rSel=k;document.querySelectorAll('#rmap .npin').forEach(p=>p.classList.toggle('on',p.dataset.k===k));const g=document.getElementById('ngo');if(g)g.remove();
 const sd=document.getElementById('rside');if(sd)sd.innerHTML=nodePanel(k);const N=NODES[k],here=hereNode();
 if(fogN(k)||k===here||N.ty==='exit'||S.exp)return;const path=pathTo(here,k);if(!path)return;
 const m=document.getElementById('rview');if(m)m.insertAdjacentHTML('beforeend',`<button class="ngo" id="ngo" data-act="${N.ty==='site'&&N.r!=null&&S.reg.lv[N.r]?'rgo':qsiteOpen(k)?'qsgo':'travel'}" data-k="${k}">${ic('walk',14)} ${(N.ty==='site'&&N.r!=null&&S.reg.lv[N.r])||qsiteOpen(k)?'Wyrusz':'Podróżuj'}: ${N.n} · ${path.length-1} d.</button>`);ngoPlace();typeof SND!=='undefined'&&SND.play('tap')}
function nodeIc(k){const N=NODES[k];if(N.ty==='site'&&N.r!=null&&!S.reg.lv[N.r])return ic('lock',14);if(N.ty==='site'&&N.r!=null&&S.reg.done[N.r])return ic('flag',14);if(N.ty==='poi'&&S.poi&&S.poi[k])return ic('xp',14);return ic(N.ic||(N.ty==='site'?'fight':'nav_town'),14)}
function renderRegion(){regOk();wOk();const here=hereNode();if(!rSel||!(nodeVis(rSel)||fogN(rSel)))rSel=here;const ks=Object.keys(NODES).filter(nodeOk),fg=Object.keys(NODES).filter(fogN);
 const P=k=>NODES[k],vis=k=>nodeOk(k),/* drogi są narysowane na mapie; linie tylko dla ścieżek do sekretnych miejsc i do mgły */
 pl=(a,b,cl)=>`<polyline ${cl?`class="${cl}" `:''}points="${roadLine(a,b).map(p=>p.join(',')).join(' ')}"/>`,
 roads=EDGES.filter(e=>vis(e[0])&&vis(e[1])&&(SECRET.includes(e[0])||SECRET.includes(e[1]))).map(([a,b])=>pl(a,b)).join('')+EDGES.filter(e=>(vis(e[0])&&fogN(e[1]))||(vis(e[1])&&fogN(e[0]))).map(([a,b])=>pl(a,b,'fg')).join('');
 const m=mainOf()||S.roster[0];
 document.getElementById('app').innerHTML=`<div class="wv rv2"><div class="ttop"><button class="btn-small" data-act="back" data-esc="1">${ic('back',16)}<span class="lbl"> Obóz</span></button><button class="btn-small" data-act="world" title="Mapa świata">${ic('map',18)}<span class="lbl"> Świat</span></button><h2>${emb(18)} Velesia <small class="tsub">${dayTxt()}</small></h2><button class="btn-small" data-act="journal">${ic('contract',18)}<span class="lbl"> Dziennik</span>${qBadge()}</button><span class="pill gold">${ic('gold',18)} ${S.gold}</span></div>
 <div class="wbody"><div class="rview" id="rview"><div class="rmap" id="rmap"><img class="px" src="${VART18.map}" alt="Mapa Velesii" draggable="false"><svg class="roads" viewBox="0 0 100 100" preserveAspectRatio="none">${roads}</svg>
 ${ks.map(k=>{const N=P(k);return `<button class="npin n-${N.ty} ${N.vil?'n-vil':''} ${k===rSel?'on':''} ${k===here?'here':''} ${N.ty==='site'&&N.r!=null&&!S.reg.lv[N.r]?'lk':''}" data-act="nsel" data-k="${k}" style="left:${N.x}%;top:${N.y}%" aria-label="${N.n}"><i>${nodeIc(k)}</i><b>${N.n}</b>${qMark(k)?'<em>!</em>':''}</button>`}).join('')}
 ${fg.map(k=>`<button class="npin n-fog ${k===rSel?'on':''}" data-act="nsel" data-k="${k}" style="left:${P(k).x}%;top:${P(k).y}%" aria-label="Nieodkryte"><i>?</i><b>???</b></button>`).join('')}
 <div class="party" id="pmark" style="left:${P(here).x}%;top:${P(here).y}%">${m?`<img class="px pfig" src="${heroSprite(m)}" alt="">`:''}<span class="pflag">${emb(12)}</span></div></div>
 <div class="mzb"><button class="btn-small" data-act="mz" data-z="1.25" aria-label="Przybliż">+</button><button class="btn-small" data-act="mz" data-z="0.8" aria-label="Oddal">−</button><button class="btn-small" data-act="mzc" aria-label="Wyśrodkuj na kompanii">${ic('flag',14)}</button><span id="rzl"></span></div></div>
 <aside class="wside" id="rside">${nodePanel(rSel)}</aside></div></div>`;
 mvApply();mvBind();if(rSel!==here)selNode(rSel);
 if(!S.intro){S.intro=1;save();setTimeout(()=>{if(screen==='region')modal(loreHtml('velesia',true))},60)}}
function nodePanel(k){const N=NODES[k];
 if(fogN(k))return `<div class="pano fogp"></div><h2>${ic('event',18)} Nieodkryte</h2><p class="nd">Mgła i dzikie ostępy. Dotrzyj do sąsiedniego miejsca, by zobaczyć, co tu jest.</p>`;
 if(N.ty==='poi'){const here=hereNode(),path=pathTo(here,k),d=path?path.length-1:0;let b=`<div class="pano" style="background-image:url(${VART['p_'+({mlyn:'dabrowa',kapliczka:'dabrowa',krag:'mglista',straznica:'kregoszew',ruiny:'kurhanow',doliny:'mglista',rozlewiska:'mglista',wyrab:'dabrowa',kaplica:'mglista',jagna:'dabrowa',most:'sanow',kuznia:'mglista'}[k]||'mglista')]})"></div><h2>${ic(N.ic,18)} ${N.n}</h2><div class="sub">${N.t}${d?` · ${d} ${d>1?'dni':'dzień'} drogi`:''}${S.poi[k]?' · zbadane':''}</div><p class="nd">${N.d}</p>`;
  if(S.exp)return b;if(k===here)return b+`<div class="here">${ic('flag',14)} Tu obozuje kompania</div>${S.poi[k]?'':`<button class="btn-main" data-act="poigo" data-k="${k}">${ic('event',20)} Zbadaj</button>`}`;
  return b+`<button class="btn-main" data-act="travel" data-k="${k}" ${path?'':'disabled'}>${ic('walk',20)} Podróżuj (${d} d.)</button>`}
 /* miasto, wieś, wyjście z mapy, miejsce wyprawy */
 const here=hereNode(),path=pathTo(here,k),d=path?path.length-1:0;const sr=N.r!=null?N.r:QSITE[k]?QSITE[k].r:null;let b=(N.ty==='site'&&sr!=null?`<div class="pano scene bg-${BIOMES[sr].k}">${sceneLayers(BIOMES[sr].k,false)}</div>`:`<div class="pano" style="background-image:url(${N.ty==='town'&&N.vil?VART.p_dabrowa:VART['p_'+k]||VART['p_mglista']})"></div>`)+`<h2>${N.ty==='site'?ic('fight',18):N.ty==='exit'?ic('lock',16):ic('nav_town',18)} ${N.n}</h2><div class="sub">${N.t}${d&&N.ty!=='exit'?` · ${d} ${d>1?'dni':'dzień'} drogi`:''}</div><p class="nd">${N.d}</p>`;
 if(N.ty==='exit')return b+`<div class="soon">${ic('lock',16)} Wkrótce</div>`;
 if(S.exp)return b+`<button class="btn-main" data-act="map">${ic('walk',20)} Wróć na wyprawę</button>`;
 if(N.ty==='town'){if(k===S.loc)return b+`<div class="here">${ic('flag',14)} Tu jest kompania</div><button class="btn-main" data-act="intown">${ic('nav_town',20)} Wejdź do miasta</button>`;
  return b+`<button class="btn-main" data-act="travel" data-k="${k}" ${path?'':'disabled'}>${ic('walk',20)} Podróżuj (${d} d.)</button><div class="sub">Po drodze może się coś wydarzyć.</div>`}
 /* miejsce wyprawy */
 if(QSITE[k]){const Q=QSITE[k];return b+(qsiteOpen(k)?`<div class="sub">Zalecany poziom bohaterów: ${Q.lv}${Q.boss?` · boss: ${ENEMIES[Q.boss].name}`:''}</div><button class="btn-main" data-act="qsgo" data-k="${k}">${ic('walk',20)} ${k===hereNode()?'Wyrusz':'Podróżuj i wyrusz'}</button>`:`<div class="sub">${qS(Q.q)==='done'?'Tu już wszystko się wydarzyło.':Q.idle}</div>`)}
 const r=N.r,R=S.reg;if(!R.lv[r])return b+`<div class="soon">${ic('lock',16)} Zamknięte</div><div class="sub">Pokonaj bossa poprzedniej krainy, aby tu dotrzeć.</div>`;
 if(!mapSel||mapSel.r!==r||R.lv[r]<mapSel.L)mapSel={r,L:R.lv[r]};const L=mapSel.L,st=expStage(r,L),ph=partyHeroes(),hurt=ph.filter(h=>h.hp<mh(h)*.6).length;
 b+=`<div class="rlv">${[1,2,3,4].map(l=>{const op=R.lv[r]>=l,cl=l<4?R.lv[r]>l||R.done[r]:R.done[r];return `<button class="${L===l?'on':''} ${l===4?'bl':''}" data-act="rlv" data-r="${r}" data-l="${l}" ${op?'':'disabled'}>${op?(l===4?ic('boss',14):''):ic('lock',12)}${l<4?['','I','II','III'][l]:'Boss'}${cl?'<i class="ck">✓</i>':''}</button>`}).join('')}</div>`;
 b+=`<div class="sub">${5+Math.min(L,3)} komnat · ${L>=4?'boss: '+ENEMIES[BIOMES[r].boss].name:'na końcu elita'} · zalecany poziom: ${Math.max(1,Math.round(st*.75))}</div>${hurt?`<div class="warn">${ic('hp',12)} Rannych: ${hurt} – rany nie goją się na wyprawie!</div>`:''}`;
 b+=`<div class="mparty" data-act="formq">${[4,3,2,1,0].map(i=>{const h=S.slots[i]!=null?getHero(S.slots[i]):null;return `<span class="mp ${i<2?'f':''}">${h?bust(heroSprite(h),h.cls,30,1,-4):''}</span>`}).join('')}<small>Formacja ▸</small></div>`;
 return b+`<div class="rgorow"><button class="mbag" data-act="tomarket" title="Zapasy">${ic('bag',18)}<span>${bagN()}/${bagCap()}</span></button><button class="btn-main" data-act="rgo" data-k="${k}" ${ph.length&&path?'':'disabled'}>${ic('walk',20)} ${k===here?'Wyrusz':'Podróżuj i wyrusz'}</button></div>`}
/* podróż po mapie: travel() i finishTravel() w js/world/world-map.js */
/* kamera za kompanią w podróży (bez wygładzania – wołane co klatkę) */
function mvFollow(x,y){const R=mvRect();if(!R)return;const B0=mvBase(R.v);MZ.x=B0.W/2-x/100*B0.w*MZ.z;MZ.y=B0.H/2-y/100*B0.h*MZ.z;mvApply()}
function mvCenterSoft(k){const m=document.getElementById('rmap');if(m){m.style.transition='transform .6s ease';setTimeout(()=>{if(m)m.style.transition=''},700)}mvCenter(k)}
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||!S)return;switch(el.dataset.act){
 case 'mz':mvZoom(+el.dataset.z);break;case 'mzc':mvCenterSoft(hereNode());break;
 case 'poigo':poiEvent(el.dataset.k);break;case 'poiopt':poiResolve(+el.dataset.i);break;}},true);
/* nsel: zaznacz bez przerysowania mapy */
document.addEventListener('click',e=>{const el=e.target.closest('[data-act=nsel]');if(!el||screen!=='region')return;e.stopImmediatePropagation();selNode(el.dataset.k)},true);
/* --- ciekawe miejsca: jednorazowe wydarzenia z wyborem --- */
const POI={
 mlyn:{p:'kupiec',n:'Młyn nad Veleską',t:'Stary młynarz ociera mąkę z rąk. „Koło kręci się samo, nawet bez wody. Wodnik pilnuje, żebym miał chleb – a ja nie pytam, czemu z rozlewisk nikt nie wraca.”',o:[
  {t:'Zapytaj o rozlewiska',r:()=>{['rozlewiska','mokradla'].forEach(k=>S.found[k]=1);return {txt:'„Rusałki śpiewają tam o zmierzchu. A dalej, za groblą, są Mokradła i Bagno Czarne.” Rozlewiska i Mokradła odkryte na mapie.'}}},
  {t:'Kup worek mąki dla kompanii (20 zł)',req:()=>S.gold>=20,r:()=>{S.gold-=20;S.sup.prowiant=(S.sup.prowiant||0)+1;return {txt:'Prowiant trafia do torby. (+1 prowiant)'}}},
  {t:'Uspokój wodnika ofiarą z chleba',c:['druid','kaplan'],r:()=>{rep('duchy',4);return {txt:'Woda pod kołem cichnie, a z toni wypływa sakiewka. '+reward(40+S.stage*4)}}}]},
 kapliczka:{ic:'temple',n:'Leśna kapliczka',t:'Drewniana kapliczka z wyblakłym obrazem i miseczką na dary. Ktoś niedawno zostawił tu świeże kwiaty.',o:[
  {t:'Zostaw dar (15 zł)',req:()=>S.gold>=15,r:()=>{S.gold-=15;rep('duchy',2);S.roster.forEach(h=>h.hp=Math.min(stats(h).maxHp,h.hp+Math.round(stats(h).maxHp*.25)));return {txt:'Robi się dziwnie ciepło. Rany szczypią mniej. (+25% zdrowia, Duchy +2)'}}},
  {t:'Pomódl się',c:['kaplan','paladyn'],r:()=>{S.roster.forEach(h=>h.hp=stats(h).maxHp);rep('lud',2);return {txt:'Modlitwa niesie się po lesie. Cała kompania odzyskuje siły.'}}},
  {t:'Zabierz dary z miseczki',r:()=>{rep('duchy',-4);rep('lud',-2);return {txt:'Kilka monet i bursztyn. '+reward(25)+'. Las jakby pociemniał.'}}}]},
 krag:{ic:'event',n:'Krąg Kamienny',t:'Głazy porośnięte mchem stoją w idealnym kręgu. W środku leży popiół po ognisku – całkiem świeży.',o:[
  {t:'Odpraw obrzęd przy kamieniach',c:['druid'],r:()=>{S.bless={name:'Moc Kręgu',fx:{atkP:.1,defP:.1}};rep('duchy',3);return {txt:'Kamienie odpowiadają cichym brzęczeniem. (Moc Kręgu: +10% ataku i obrony na następną wyprawę)'}}},
  {t:'Przyłóż dłoń do największego głazu',r:()=>{unlockLore('asterion');return {txt:'Pod palcami czujesz wyryte runy i chłód. Wizja: krąg we mgle na północy… (Kronika: Pieczęcie Asterionu)'}}},
  {t:'Odejdź',r:()=>({txt:'Lepiej nie budzić tego, co śpi.'})}]},
 straznica:{ic:'flag',n:'Strażnica',t:'Opuszczona wieża sygnałowa. Schody skrzypią, ale wytrzymają.',o:[
  {t:'Wejdź na szczyt i rozejrzyj się',r:()=>{['jama','martwe','grzbiet','poludnie'].forEach(k=>S.found[k]=1);return {txt:'Na południowym wschodzie ciągną się spękane Martwe Ziemie, na południu – złote Równiny. Na północy, wysoko w górach, dymi Smocza Jama. Odkryto nowe miejsca na mapie.'}}},
  {t:'Przeszukaj magazyn',r:()=>Math.random()<.5?{fight:['goblin','goblin','wilk'],lbl:'Gobliny w strażnicy'}:{txt:'Stara skrzynia strażników. '+reward(20,1)}}]},
 ruiny:{ic:'event',n:'Ruiny Asterionu',t:'Kolumny z czarnego kamienia i łuk z runami, które jarzą się słabo, gdy podchodzisz bliżej.',o:[
  {t:'Odczytaj runy',c:['mag','czarnoksieznik','bard'],r:()=>{unlockLore('asterion');partyHeroes().forEach(h=>gainXp(h,40+S.stage*8));return {txt:'Runy mówią o siedmiu pieczęciach. Jedna z nich jest w Velesii… (Doświadczenie dla drużyny, wpis w Kronice)'}}},
  {t:'Kop pod łukiem',r:()=>({fight:['szeptun','nietoperz','nietoperz'],lbl:'Strażnicy ruin'})},
  {t:'Odejdź',r:()=>({txt:'Ruiny czekały tysiąc lat. Poczekają jeszcze.'})}]},
 doliny:{ic:'event',n:'Mgliste Doliny',t:'Mgła gęstnieje. Z niej dochodzi kobiecy płacz i twoje imię, wypowiadane głosem kogoś, kto dawno nie żyje.',o:[
  {t:'Idź za głosem',r:()=>({fight:['strzyga','nietoperz'],lbl:'Strzyga we mgle'})},
  {t:'Zapal pochodnię i trzymaj się ścieżki',req:()=>(S.sup.pochodnia||0)>0,r:()=>{S.sup.pochodnia--;S.found.jary=1;return {txt:'Ogień rozrywa mgłę. Ścieżka wyprowadza was nad głębokie Wilcze Jary w północnej puszczy. (−1 pochodnia)'}}},
  {t:'Zawróć',r:()=>({txt:'Głosy cichną dopiero pod murami Weleszowa.'})}]},
 most:{p:'straznik',n:'Kamienny most',t:'Strażnik w budce przy moście podnosi głowę znad miski z kaszą. „Przechodzicie? To przechodźcie szybko. Za dnia. I nie patrzcie w wodę.”',o:[
  {t:'Zapytaj, czemu tak się boi',r:()=>{qSet('koscimost','wybor');return {dlg:'km_wybor'}}}]},
 kuznia:{ic:'event',n:'Zatopiona kuźnia',t:'Woda stoi tu po kolana. Spod mułu wystają obręcze, kleszcze i stary miech.',o:[
  {t:'Wyłówcie z wody, co się da',r:()=>({txt:'Kilka kawałków dobrego żelaza i zardzewiała sakiewka. '+reward(20+S.stage*3)})},
  {t:'Odpocznijcie w suchym kącie',r:()=>{S.roster.forEach(h=>h.hp=Math.min(stats(h).maxHp,h.hp+Math.round(stats(h).maxHp*.15)));return {txt:'Szum jeziora usypia. (+15% zdrowia)'}}}]},
 wyrab:{p:'leszy',n:'Opuszczony wyrąb',t:'Pnie, porzucone siekiery i wygasłe ognisko. Las wokół szumi już zwyczajnie – ale nikt z Dąbrowy nie chce tu wracać.',o:[
  {t:'Zabierz porzucone siekiery i piły',r:()=>({txt:'Dobre żelazo. Kowal w Dąbrowie da za nie trochę grosza. '+reward(20+S.stage*3)})},
  {t:'Odpocznij przy ognisku',r:()=>{S.roster.forEach(h=>h.hp=Math.min(stats(h).maxHp,h.hp+Math.round(stats(h).maxHp*.15)));return {txt:'Ciepło ognia i cisza lasu. (+15% zdrowia)'}}}]},
 kaplica:{ic:'temple',n:'Opuszczona kaplica',t:'Kamienna kaplica na wzgórzu. Na ścianach wciąż widać wydrapane imiona.',o:[
  {t:'Zapal świecę za zmarłych z Ustronia',r:()=>{rep('duchy',3);rep('lud',2);return {txt:'Płomień pali się równo, bez drżenia. Ktoś za ścianą szepcze „dziękuję”.'}}},
  {t:'Przeszukaj zakrystię',r:()=>({txt:'Stare naczynia i księga z wyrwanymi kartami. '+reward(25,1)})}]},
 jagna:{p:'szeptunka2',n:'Chata Jagny',t:()=>S.fl.dlug==='spalona'?'Z chaty zostały zgliszcza. Na płocie wciąż wiszą zwęglone wiązki ziół.':S.fl.dlug==='ofiara'?'Chata stoi pusta. Na progu ktoś zostawia świeże kwiaty.':'Jagna przesiewa zioła na ganku. „Siadajcie. Rany opatrzę, ale nie za darmo – zioła same nie rosną.”',o:[
  {t:'Kup opatrunek z ziół (30 zł)',req:()=>S.gold>=30&&!['spalona','ofiara'].includes(S.fl.dlug),r:()=>{S.gold-=30;S.roster.forEach(h=>h.hp=Math.min(stats(h).maxHp,h.hp+Math.round(stats(h).maxHp*.4)));return {txt:'Maści pieką, ale rany zasklepiają się w oczach. (+40% zdrowia)'}}},
  {t:'Rozejrzyj się i odejdź',r:()=>({txt:'Las wokół chaty pachnie rutą i dymem.'})}]},
 rozlewiska:{p:'dziewczyna',n:'Rozlewiska Utopców',t:'Na kamieniu nad wodą siedzi dziewczyna o zielonych włosach i czesze je grzebieniem z rybich ości. „Chodź, wędrowcze… woda jest ciepła.”',o:[
  {t:'Do broni! To rusałka!',r:()=>({fight:['rusalka','utopiec','utopiec'],lbl:'Rusałki nad Veleską'})},
  {t:'Zaśpiewaj jej pieśń w odpowiedzi',c:['bard'],r:()=>{rep('duchy',3);return {txt:'Rusałka słucha i płacze ze wzruszenia. Rzuca wam perłę z dna. '+reward(60+S.stage*5)}}},
  {t:'Zatkaj uszy woskiem i odejdź',r:()=>({txt:'Śpiew ciągnie się za wami aż do grobli.'})}]}};
let curPoi=null;
function poiEvent(k){const E=POI[k];if(!E)return;curPoi=k;
 modal(`<div class="dlg">${E.p?`<div class="dpor"><img class="px" src="${VART['n_'+E.p]}" alt=""></div>`:`<div class="dpor ic">${ic(E.ic,40)}</div>`}<div class="dtx"><h2>${E.n}</h2><p>${typeof E.t==='function'?E.t():E.t}</p></div></div><div class="actions dopts">${E.o.map((o,i)=>{if(o.c&&!RCLS(o.c))return '';const ok=!o.req||o.req();return `<button data-act="poiopt" data-i="${i}" ${ok?'':'disabled'}>${o.c?clsTag(o.c)+' ':''}${o.t}</button>`}).join('')}</div>`)}
function poiResolve(i){const k=curPoi,E=POI[k],o=E&&E.o[i];if(!o||(o.c&&!RCLS(o.c))||(o.req&&!o.req()))return;S.poi[k]=1;const r=o.r();save();
 if(r.dlg){showDlg(r.dlg);return}
 if(r.fight){closeModal();roadFight(r.fight,r.lbl);return}modal(`<h2>${E.n}</h2><p>${r.txt}</p><button class="btn-main" data-act="region">${ic('map',20)} Mapa</button>`)}
/* obóz poza miastem */
function renderField(){const k=S.loc,N=NODES[k],nb=S.roster.some(h=>h.free||tFree(h));
 document.getElementById('app').innerHTML=`<div class="townv stown"><div class="ttop"><button class="btn-small" data-act="tab" data-t="team">${ic('nav_team',18)}<span class="lbl">Drużyna</span>${nb?'<span class="badge">!</span>':''}</button><h2>${ic('camp',20)} Obóz: ${N.n} <small class="tsub">${dayTxt()}</small></h2><span class="pill gold">${ic('gold',18)} ${S.gold}</span><button class="btn-small" data-act="menu" aria-label="Menu">${ic('gear',18)}</button><button class="btn-main tgo" data-act="map">${ic('map',20)} Mapa</button></div>
 <div class="stbody"><div class="stpano" style="background-image:url(${VART.p_mglista})"><div class="stcap"><b>${N.n}</b><small>${N.t}</small></div></div><div class="stside"><p class="nd">${N.d}</p><p class="nd">Kompania rozbiła obóz. Usługi miejskie są dostępne tylko w miastach i wsiach – ruszaj dalej przez mapę.</p>${S.poi[k]?'':`<button class="btn-main" data-act="poigo" data-k="${k}">${ic('event',20)} Zbadaj to miejsce</button>`}</div></div></div>`;
 /* przyciski zadań, które prowadzą w to miejsce */
 const s=document.querySelector('.stside');if(!s)return;const b=[];
 for(const id of qActive()){const st=qSt(id);if(st&&st.obj&&st.obj.go===k&&st.obj.dlg)b.push(`<button class="btn-main" data-act="qdlg" data-d="${st.obj.dlg}">${ic('contract',20)} ${QD[id].n}</button>`)}
 if(b.length)s.insertAdjacentHTML('beforeend',b.join(''))}
