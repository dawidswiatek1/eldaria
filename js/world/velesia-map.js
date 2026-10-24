/* ===== VELESIA v18: duża mapa (przesuwanie, zoom), mgła wojny, wioski, ciekawe miejsca, dni podróży ===== */
for(const k in NODES)delete NODES[k];
Object.assign(NODES,{
 weleszow:{n:'Weleszów',t:'Stolica Velesii',ty:'town',x:53,y:17,ic:'b_zamek',d:'Zamek na skalistym wzgórzu nad Veleską, rynek z fontanną, kościół z czerwonej cegły i port rzeczny. Serce królestwa.'},
 dabrowa:{n:'Dąbrowa',t:'Osada w świętym gaju',ty:'town',x:35.5,y:30.5,ic:'ziola',d:'Osada przy prastarym dębie, słynna z szeptunów i handlu ziołami. Wokół stoją kamienne kręgi.'},
 kregoszew:{n:'Kręgoszew',t:'Gród graniczny',ty:'town',x:75,y:53,ic:'b_koszary',d:'Drewniana warownia na skale, ostatnia straż przed Martwymi Ziemiami. Kowale, koszary i kontrakty graniczne.'},
 sanow:{n:'Sanów',t:'Miasto kupców',ty:'town',x:46,y:62.5,ic:'tavern',d:'Ruchliwe miasto targowe na skrzyżowaniu traktów. Spichlerze, przystań i najwięcej najemników w Velesii.'},
 kurhanow:{n:'Kurhanów',t:'Osada przy kurhanach',ty:'town',x:60.5,y:63,ic:'b_cmentarz',d:'Mała osada u stóp starych mogił. Mieszkańcy strzegą pamięci przodków.'},
 brzezina:{n:'Brzezina',t:'Wieś',ty:'town',vil:1,x:41,y:42,ic:'nav_town',d:'Spokojna wieś wśród brzóz. Karczma, plotki i kilku chętnych do wojaczki.'},
 olszynow:{n:'Olszynów',t:'Wieś rolnicza',ty:'town',vil:1,x:62,y:36,ic:'nav_town',hidden:1,d:'Bogata wieś wśród złotych pól. Chłopi szepczą o białej pani, która chodzi w południe po zbożu.'},
 mokradla:{n:'Mokradła',t:'Wieś na grobli',ty:'town',vil:1,x:22,y:68,ic:'nav_town',hidden:1,d:'Chaty na palach na skraju Bagna Czarnego. Zielarze i rybacy, którzy nie chodzą nad wodę po zmroku.'},
 mlyn:{n:'Młyn nad Veleską',t:'Ciekawe miejsce',ty:'poi',x:29.5,y:49.5,ic:'event',hidden:1,d:'Stary młyn wodny. Młynarz podobno ma układ z wodnikiem.'},
 kapliczka:{n:'Leśna kapliczka',t:'Ciekawe miejsce',ty:'poi',x:18,y:41,ic:'temple',hidden:1,d:'Drewniana kapliczka na rozstaju leśnych dróg. Wędrowcy zostawiają tu dary.'},
 krag:{n:'Krąg Kamienny',t:'Ciekawe miejsce',ty:'poi',x:26,y:22,ic:'event',hidden:1,d:'Omszałe głazy ustawione w krąg. Szeptunki przychodzą tu w noc Kupały.'},
 straznica:{n:'Strażnica',t:'Ciekawe miejsce',ty:'poi',x:84,y:40,ic:'flag',hidden:1,d:'Opuszczona wieża sygnałowa u stóp gór. Z jej szczytu widać Martwe Ziemie.'},
 ruiny:{n:'Ruiny Asterionu',t:'Ciekawe miejsce',ty:'poi',x:61.5,y:73,ic:'event',hidden:1,d:'Kolumny i łuki z czasów dawnych magów. Na kamieniach wciąż widać runy.'},
 doliny:{n:'Mgliste Doliny',t:'Ciekawe miejsce',ty:'poi',x:77,y:27,ic:'event',hidden:1,d:'Doliny wiecznie spowite mgłą. Ludzie słyszą tu głosy zmarłych.'},
 rozlewiska:{n:'Rozlewiska Utopców',t:'Ciekawe miejsce',ty:'poi',x:28,y:59,ic:'event',hidden:1,d:'Zalane łąki nad Veleską. Rusałki i utopce wciągają tu nieostrożnych.'},
 polana:{n:'Mglista Polana',t:'Sekretna lokacja',ty:'site',hidden:1,x:13,y:11,ic:'event',d:'Krąg runicznych kamieni w mgle – miejsce pieczęci Asterionu.'},
 puszcza:{n:'Mroczna Puszcza',t:'Wyprawa · kraina I',ty:'site',r:0,x:11,y:30,home:'dabrowa',d:'Prastara puszcza na zachodzie. Gobliny, wilki, dziki – i Leszy, pan lasu.'},
 trakt:{n:'Trakt Bandytów',t:'Wyprawa · kraina II',ty:'site',r:1,x:13,y:50,home:'dabrowa',hidden:1,d:'Leśny trakt kupiecki, od lat nękany przez zbójców. Biesy podobno im pomagają.'},
 kurhany:{n:'Kurhany Przodków',t:'Wyprawa · kraina III',ty:'site',r:2,x:50,y:85,home:'kurhanow',hidden:1,d:'Kurhany i krypty pod nimi. Strzygi i szeptuni nie dają spać przodkom.'},
 grzbiet:{n:'Wielki Grzbiet',t:'Wyprawa · kraina IV',ty:'site',r:3,x:68,y:8,home:'weleszow',hidden:1,d:'Ośnieżone turnie granicznego pasma. Orkowie, harpie, wilkołaki i bazyliszki.'},
 jama:{n:'Smocza Jama',t:'Wyprawa · kraina V',ty:'site',r:4,x:87.5,y:20,home:'kregoszew',hidden:1,d:'Rozżarzona pieczara w zboczu gór. Leże Żmija.'},
 bagno:{n:'Bagno Czarne',t:'Wyprawa · bagna',ty:'site',r:5,x:11,y:79,home:'mokradla',hidden:1,d:'Czarna woda, martwe drzewa i błędne ogniki. Królestwo Utopca Starszego.'},
 pola:{n:'Pola Południcy',t:'Wyprawa · pola',ty:'site',r:6,x:37,y:71,home:'sanow',hidden:1,d:'Złote łany, gdzie w samo południe nikt nie odważy się pracować.'},
 chata:{n:'Chata na kurzej stopce',t:'Sekretna wyprawa',ty:'site',r:7,x:5,y:60,home:'mokradla',hidden:1,d:'Płot z czaszek, a za nim chata, która obraca się na kurzej nodze. Dom Baby Jagi.'},
 jary:{n:'Wilcze Jary',t:'Łowisko',ty:'site',r:8,x:31,y:10,home:'dabrowa',hidden:1,d:'Głębokie jary w północnej puszczy. Wataha wilkołaka Alfy poluje tu każdej pełni.'},
 poludnie:{n:'Równiny Południowe',t:'ku Avarii',ty:'exit',x:82,y:88,ic:'lock',hidden:1,d:'Szeroki trakt na południe, ku stepom Avarii. Granica zamknięta – wkrótce.'},
 martwe:{n:'Martwe Ziemie',t:'granica',ty:'exit',x:93,y:56,ic:'skull',hidden:1,d:'Spękana, wymarła ziemia za wschodnią granicą. Stąd przychodzi zło – wkrótce.'}});
EDGES.length=0;EDGES.push(...[['weleszow','dabrowa'],['weleszow','brzezina'],['weleszow','olszynow'],['weleszow','grzbiet'],['dabrowa','puszcza'],['dabrowa','jary'],['dabrowa','krag'],['dabrowa','kapliczka'],['dabrowa','brzezina'],['dabrowa','polana'],['krag','polana'],['kapliczka','trakt'],['kapliczka','mlyn'],['trakt','chata'],['brzezina','mlyn'],['brzezina','sanow'],['mlyn','rozlewiska'],['rozlewiska','mokradla'],['rozlewiska','pola'],['mokradla','bagno'],['mokradla','chata'],['sanow','pola'],['sanow','kurhanow'],['sanow','kurhany'],['kurhanow','ruiny'],['kurhanow','kregoszew'],['ruiny','poludnie'],['kurhanow','poludnie'],['olszynow','kregoszew'],['olszynow','doliny'],['kregoszew','straznica'],['kregoszew','martwe'],['straznica','jama'],['straznica','doliny'],['doliny','grzbiet']]);
SITE_OF_R.push('bagno','pola','chata','jary');
Object.assign(TOWNS,{brzezina:{svc:['karczma'],off:2,gosp:'Karczma „Pod Brzozą”'},olszynow:{svc:['karczma','targ'],off:2,gosp:'Karczma „Złoty Kłos”',targ:'Jarmark wiejski'},mokradla:{svc:['karczma','alchemik'],off:1,gosp:'Karczma na palach',alch:'Zielarz z grobli'}});
Object.assign(TALK,{brzezina:[],olszynow:[],mokradla:[]});
const nodeVis=k=>nodeOk(k)||(S.found&&S.found[k]);
/* mgła: odkryj sąsiadów miejsca (oprócz sekretnych) */
const SECRET=['polana','chata'];
function reveal(k,quiet){const nw=[];EDGES.forEach(([a,b])=>{const o=a===k?b:b===k?a:null;if(o&&!SECRET.includes(o)&&NODES[o].hidden&&!S.found[o]){S.found[o]=1;nw.push(NODES[o].n)}});if(nw.length&&!quiet)toast('Odkryto na mapie: '+nw.join(', '));return nw}
const fogN=k=>NODES[k].hidden&&!S.found[k]&&!SECRET.includes(k)&&EDGES.some(([a,b])=>(a===k&&nodeOk(b))||(b===k&&nodeOk(a)));
const _wOk0=wOk;wOk=function(){if(!S)return;if(!S.found)S.found={};const ok=S.loc&&NODES[S.loc]&&NODES[S.loc].ty!=='exit'&&NODES[S.loc].ty!=='site';if(!ok)S.loc='weleszow';const _l=S.loc;_wOk0();S.loc=_l;if(!NODES[S.loc]||NODES[S.loc].ty!=='town'&&NODES[S.loc].ty!=='poi')S.loc='weleszow';if(!S.day)S.day=1;if(!S.poi)S.poi={};regFix(S);if(!S._rv){S._rv=1;reveal(S.loc,1)}SITE_OF_R.forEach((k,r)=>{if(k&&S.reg.lv[r]&&!S.found[k]){S.found[k]=1;}});routeFix()};
/* znane miejsce bez znanej drogi: odsłoń najkrótszy szlak */
function rawPath(a,b){const prev={[a]:null},q=[a];while(q.length){const c=q.shift();if(c===b){const p=[];let x=c;while(x!=null){p.unshift(x);x=prev[x]}return p}EDGES.forEach(([u,v])=>{const o=u===c?v:v===c?u:null;if(o&&!(o in prev)&&NODES[o].ty!=='exit'&&(!SECRET.includes(o)||o===b||S.found[o])){prev[o]=c;q.push(o)}})}return null}
function routeFix(){if(!S||!NODES[S.loc])return;Object.keys(NODES).filter(k=>nodeOk(k)&&NODES[k].ty!=='exit').forEach(k=>{if(k===S.loc||pathTo(S.loc,k))return;const p=rawPath(S.loc,k);if(p)p.forEach(n=>{if(NODES[n].hidden)S.found[n]=1})})}
/* --- dni podróży --- */
function passDays(n){for(let i=0;i<n;i++){S.day=(S.day||1)+1;if(S.day%3===0)S.roster.forEach(h=>{if(h.hosp>0)h.hosp--})}}
const dayTxt=()=>`Dzień ${S.day||1}`;
/* --- widok mapy z przesuwaniem i zoomem --- */
let MZ={z:1,x:null,y:null},_mp=null;
function mvRect(){const v=document.getElementById('rview');if(!v)return null;const r=v.getBoundingClientRect();return {v,r,k:r.width/(v.offsetWidth||1)}}
function mvBase(v){const W=v.offsetWidth,H=v.offsetHeight,ar=16/9;let w=W,h=W/ar;if(h<H){h=H;w=H*ar}return {W,H,w,h}}
function mvApply(){const R=mvRect();if(!R)return;const m=document.getElementById('rmap'),B0=mvBase(R.v),w=B0.w*MZ.z,h=B0.h*MZ.z;
 if(MZ.x==null){const N=NODES[hereNode()]||NODES.weleszow;MZ.x=B0.W/2-N.x/100*w;MZ.y=B0.H/2-N.y/100*h}
 MZ.x=Math.min(0,Math.max(B0.W-w,MZ.x));MZ.y=Math.min(0,Math.max(B0.H-h,MZ.y));
 m.style.width=w+'px';m.style.height=h+'px';m.style.transform=`translate(${Math.round(MZ.x)}px,${Math.round(MZ.y)}px)`;
 const zl=document.getElementById('rzl');if(zl)zl.textContent=Math.round(MZ.z*100)+'%';ngoPlace();
 /* v19: etykiety przy krawędzi widoku nie są ucinane */
 m.querySelectorAll('.npin').forEach(p=>{const b=p.querySelector('b');if(!b)return;const px=MZ.x+parseFloat(p.style.left)/100*w,hw=b.offsetWidth/2;let dx=0;if(px-hw<3)dx=3-(px-hw);else if(px+hw>B0.W-3)dx=B0.W-3-(px+hw);b.style.translate=dx?Math.round(dx)+'px 0':''})}
function ngoPlace(){const g=document.getElementById('ngo');if(g&&!document.querySelector(`#rmap .npin[data-k="${g.dataset.k}"]`))g.remove()}
function mvZoom(f,cx,cy){const R=mvRect();if(!R)return;const B0=mvBase(R.v),z0=MZ.z,z=Math.max(1,Math.min(3,z0*f));if(z===z0)return;
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
 const m=document.getElementById('rview');if(m)m.insertAdjacentHTML('beforeend',`<button class="ngo" id="ngo" data-act="${N.ty==='site'&&N.r!=null&&S.reg.lv[N.r]?'rgo':k==='polana'?'polgo':'travel'}" data-k="${k}">${ic('walk',14)} ${N.ty==='site'&&N.r!=null&&S.reg.lv[N.r]?'Wyrusz':'Podróżuj'}: ${N.n} · ${path.length-1} d.</button>`);ngoPlace();typeof SND!=='undefined'&&SND.play('tap')}
nodeIc=function(k){const N=NODES[k];if(N.ty==='site'&&N.r!=null&&!S.reg.lv[N.r])return ic('lock',14);if(N.ty==='site'&&N.r!=null&&S.reg.done[N.r])return ic('flag',14);if(N.ty==='poi'&&S.poi&&S.poi[k])return ic('xp',14);return ic(N.ic||(N.ty==='site'?'fight':'nav_town'),14)};
renderRegion=function(){regOk();wOk();const here=hereNode();if(!rSel||!(nodeVis(rSel)||fogN(rSel)))rSel=here;const ks=Object.keys(NODES).filter(nodeOk),fg=Object.keys(NODES).filter(fogN);
 const P=k=>NODES[k],vis=k=>nodeOk(k),roads=EDGES.filter(e=>vis(e[0])&&vis(e[1])).map(([a,b])=>`<line x1="${P(a).x}" y1="${P(a).y}" x2="${P(b).x}" y2="${P(b).y}"/>`).join('')+EDGES.filter(e=>(vis(e[0])&&fogN(e[1]))||(vis(e[1])&&fogN(e[0]))).map(([a,b])=>`<line class="fg" x1="${P(a).x}" y1="${P(a).y}" x2="${P(b).x}" y2="${P(b).y}"/>`).join('');
 const m=mainOf()||S.roster[0];
 document.getElementById('app').innerHTML=`<div class="wv rv2"><div class="ttop"><button class="btn-small" data-act="back" data-esc="1">${ic('back',16)}<span class="lbl"> Obóz</span></button><button class="btn-small" data-act="world" title="Mapa świata">${ic('map',18)}<span class="lbl"> Świat</span></button><h2>${emb(18)} Velesia <small class="tsub">${dayTxt()}</small></h2><button class="btn-small" data-act="journal">${ic('contract',18)}<span class="lbl"> Dziennik</span>${qBadge()}</button><span class="pill gold">${ic('gold',18)} ${S.gold}</span></div>
 <div class="wbody"><div class="rview" id="rview"><div class="rmap" id="rmap"><img class="px" src="${VART18.map}" alt="Mapa Velesii" draggable="false"><svg class="roads" viewBox="0 0 100 100" preserveAspectRatio="none">${roads}</svg>
 ${ks.map(k=>{const N=P(k);return `<button class="npin n-${N.ty} ${N.vil?'n-vil':''} ${k===rSel?'on':''} ${k===here?'here':''} ${N.ty==='site'&&N.r!=null&&!S.reg.lv[N.r]?'lk':''}" data-act="nsel" data-k="${k}" style="left:${N.x}%;top:${N.y}%" aria-label="${N.n}"><i>${nodeIc(k)}</i><b>${N.n}</b>${qMark(k)?'<em>!</em>':''}</button>`}).join('')}
 ${fg.map(k=>`<button class="npin n-fog ${k===rSel?'on':''}" data-act="nsel" data-k="${k}" style="left:${P(k).x}%;top:${P(k).y}%" aria-label="Nieodkryte"><i>?</i><b>???</b></button>`).join('')}
 <div class="party" id="pmark" style="left:${P(here).x}%;top:${P(here).y}%">${m?`<img class="px pfig" src="${heroSprite(m)}" alt="">`:''}<span class="pflag">${emb(12)}</span></div></div>
 <div class="mzb"><button class="btn-small" data-act="mz" data-z="1.25" aria-label="Przybliż">+</button><button class="btn-small" data-act="mz" data-z="0.8" aria-label="Oddal">−</button><button class="btn-small" data-act="mzc" aria-label="Wyśrodkuj na kompanii">${ic('flag',14)}</button><span id="rzl"></span></div></div>
 <aside class="wside" id="rside">${nodePanel(rSel)}</aside></div></div>`;
 mvApply();mvBind();if(rSel!==here)selNode(rSel);
 if(!S.intro){S.intro=1;save();setTimeout(()=>{if(screen==='region')modal(loreHtml('velesia',true))},60)}};
const _nodePanel0=nodePanel;nodePanel=function(k){const N=NODES[k];
 if(fogN(k))return `<div class="pano fogp"></div><h2>${ic('event',18)} Nieodkryte</h2><p class="nd">Mgła i dzikie ostępy. Dotrzyj do sąsiedniego miejsca, by zobaczyć, co tu jest.</p>`;
 if(N.ty==='poi'){const here=hereNode(),path=pathTo(here,k),d=path?path.length-1:0;let b=`<div class="pano" style="background-image:url(${VART['p_'+({mlyn:'dabrowa',kapliczka:'dabrowa',krag:'mglista',straznica:'kregoszew',ruiny:'kurhanow',doliny:'mglista',rozlewiska:'mglista'}[k])]})"></div><h2>${ic(N.ic,18)} ${N.n}</h2><div class="sub">${N.t}${d?` · ${d} ${d>1?'dni':'dzień'} drogi`:''}${S.poi[k]?' · zbadane':''}</div><p class="nd">${N.d}</p>`;
  if(S.exp)return b;if(k===here)return b+`<div class="here">${ic('flag',14)} Tu obozuje kompania</div>${S.poi[k]?'':`<button class="btn-main" data-act="poigo" data-k="${k}">${ic('event',20)} Zbadaj</button>`}`;
  return b+`<button class="btn-main" data-act="travel" data-k="${k}" ${path?'':'disabled'}>${ic('walk',20)} Podróżuj (${d} d.)</button>`}
 let h=_nodePanel0(k);if(N.ty==='town'&&N.vil)h=h.replace('<div class="pano"','<div class="pano" style="background-image:url('+VART.p_dabrowa+')"');
 const d=(pathTo(hereNode(),k)||[1]).length-1;return h.replace('> Podróżuj</button>',`> Podróżuj (${d} d.)</button>`)};
/* podróż: dni + odkrywanie */
travel=function(to,then){if(_trav)return;const path=pathTo(hereNode(),to);if(!path||path.length<2){if(then)then();return}_trav=true;window._lp=path;const g=document.getElementById('ngo');if(g)g.remove();const mk=document.getElementById('pmark');let i=0;
 if(mk&&NODES[to]){mvCenterSoft(to)}
 const step=()=>{i++;if(i>=path.length||!mk){passDays(path.length-1);arrive(to,then,path.length-1);return}const N=NODES[path[i]];reveal(path[i],1);mk.style.left=N.x+'%';mk.style.top=N.y+'%';typeof SND!=='undefined'&&SND.play('tap');setTimeout(step,T(520))};
 if(mk)mk.classList.add('mv');setTimeout(step,T(60))};
function mvCenterSoft(k){const m=document.getElementById('rmap');if(m){m.style.transition='transform .6s ease';setTimeout(()=>{if(m)m.style.transition=''},700)}mvCenter(k)}
finishTravel=function(to,then){S.pend=null;const N=NODES[to];if(N.ty==='town'||N.ty==='poi')S.loc=to;else if(window._lp){const c=window._lp.filter(k=>NODES[k]&&(NODES[k].ty==='town'||NODES[k].ty==='poi'));if(c.length)S.loc=c[c.length-1]}window._lp=null;reveal(to);save();if(then){then();return}rSel=to;screen='region';render();
 if(N.ty==='town'){toast(`Kompania dociera do: ${N.n} (${dayTxt()})`);questGo(to)}else if(N.ty==='poi'){if(!questGo(to)&&!S.poi[to])setTimeout(()=>poiEvent(to),250)}};
const _startSiteExp=startSiteExp;startSiteExp=function(k,r,L,extra){reveal(k,1);const l=S.loc;_startSiteExp(k,r,L,extra);if(NODES[l]&&(NODES[l].ty==='town'||NODES[l].ty==='poi')){S.loc=l;save()}};
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
  {t:'Wejdź na szczyt i rozejrzyj się',r:()=>{['jama','doliny','martwe','grzbiet'].forEach(k=>S.found[k]=1);return {txt:'Na wschodzie ciągną się spękane Martwe Ziemie. Na północy dymi Smocza Jama. Odkryto nowe miejsca na mapie.'}}},
  {t:'Przeszukaj magazyn',r:()=>Math.random()<.5?{fight:['goblin','goblin','wilk'],lbl:'Gobliny w strażnicy'}:{txt:'Stara skrzynia strażników. '+reward(20,1)}}]},
 ruiny:{ic:'event',n:'Ruiny Asterionu',t:'Kolumny z czarnego kamienia i łuk z runami, które jarzą się słabo, gdy podchodzisz bliżej.',o:[
  {t:'Odczytaj runy',c:['mag','czarnoksieznik','bard'],r:()=>{unlockLore('asterion');partyHeroes().forEach(h=>gainXp(h,40+S.stage*8));return {txt:'Runy mówią o siedmiu pieczęciach. Jedna z nich jest w Velesii… (Doświadczenie dla drużyny, wpis w Kronice)'}}},
  {t:'Kop pod łukiem',r:()=>({fight:['szeptun','nietoperz','nietoperz'],lbl:'Strażnicy ruin'})},
  {t:'Odejdź',r:()=>({txt:'Ruiny czekały tysiąc lat. Poczekają jeszcze.'})}]},
 doliny:{ic:'event',n:'Mgliste Doliny',t:'Mgła gęstnieje. Z niej dochodzi kobiecy płacz i twoje imię, wypowiadane głosem kogoś, kto dawno nie żyje.',o:[
  {t:'Idź za głosem',r:()=>({fight:['strzyga','nietoperz'],lbl:'Strzyga we mgle'})},
  {t:'Zapal pochodnię i trzymaj się ścieżki',req:()=>(S.sup.torch||0)>0,r:()=>{S.sup.torch--;S.found.grzbiet=1;return {txt:'Ogień rozrywa mgłę. Na końcu ścieżki – przełęcz ku Wielkiemu Grzbietowi. (−1 pochodnia)'}}},
  {t:'Zawróć',r:()=>({txt:'Głosy cichną dopiero przy Olszynowie.'})}]},
 rozlewiska:{p:'dziewczyna',n:'Rozlewiska Utopców',t:'Na kamieniu nad wodą siedzi dziewczyna o zielonych włosach i czesze je grzebieniem z rybich ości. „Chodź, wędrowcze… woda jest ciepła.”',o:[
  {t:'Do broni! To rusałka!',r:()=>({fight:['rusalka','utopiec','utopiec'],lbl:'Rusałki nad Veleską'})},
  {t:'Zaśpiewaj jej pieśń w odpowiedzi',c:['bard'],r:()=>{rep('duchy',3);return {txt:'Rusałka słucha i płacze ze wzruszenia. Rzuca wam perłę z dna. '+reward(60+S.stage*5)}}},
  {t:'Zatkaj uszy woskiem i odejdź',r:()=>({txt:'Śpiew ciągnie się za wami aż do grobli.'})}]}};
let curPoi=null;
function poiEvent(k){const E=POI[k];if(!E)return;curPoi=k;
 modal(`<div class="dlg">${E.p?`<div class="dpor"><img class="px" src="${VART['n_'+E.p]}" alt=""></div>`:`<div class="dpor ic">${ic(E.ic,40)}</div>`}<div class="dtx"><h2>${E.n}</h2><p>${E.t}</p></div></div><div class="actions dopts">${E.o.map((o,i)=>{if(o.c&&!RCLS(o.c))return '';const ok=!o.req||o.req();return `<button data-act="poiopt" data-i="${i}" ${ok?'':'disabled'}>${o.c?clsTag(o.c)+' ':''}${o.t}</button>`}).join('')}</div>`)}
function poiResolve(i){const k=curPoi,E=POI[k],o=E&&E.o[i];if(!o||(o.c&&!RCLS(o.c))||(o.req&&!o.req()))return;S.poi[k]=1;const r=o.r();save();
 if(r.fight){closeModal();roadFight(r.fight,r.lbl);return}modal(`<h2>${E.n}</h2><p>${r.txt}</p><button class="btn-main" data-act="region">${ic('map',20)} Mapa</button>`)}
/* obóz poza miastem */
const _rst=renderSmallTown;renderSmallTown=function(){const N=NODES[S.loc];if(N&&N.ty==='poi'){renderField();return}_rst()};
function renderField(){const k=S.loc,N=NODES[k],nb=S.roster.some(h=>h.free||tFree(h));
 document.getElementById('app').innerHTML=`<div class="townv stown"><div class="ttop"><button class="btn-small" data-act="tab" data-t="team">${ic('nav_team',18)}<span class="lbl">Drużyna</span>${nb?'<span class="badge">!</span>':''}</button><h2>${ic('camp',20)} Obóz: ${N.n} <small class="tsub">${dayTxt()}</small></h2><span class="pill gold">${ic('gold',18)} ${S.gold}</span><button class="btn-small" data-act="menu" aria-label="Menu">${ic('gear',18)}</button><button class="btn-main tgo" data-act="map">${ic('map',20)} Mapa</button></div>
 <div class="stbody"><div class="stpano" style="background-image:url(${VART.p_mglista})"><div class="stcap"><b>${N.n}</b><small>${N.t}</small></div></div><div class="stside"><p class="nd">${N.d}</p><p class="nd">Kompania rozbiła obóz. Usługi miejskie są dostępne tylko w miastach i wsiach – ruszaj dalej przez mapę.</p>${S.poi[k]?'':`<button class="btn-main" data-act="poigo" data-k="${k}">${ic('event',20)} Zbadaj to miejsce</button>`}</div></div></div>`}
