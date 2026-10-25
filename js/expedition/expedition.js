/* ===== WYPRAWY: mapa krain, rozgałęziona mapa wyprawy (ścieżki jak w Slay the Spire, mgła i pochodnie), komnaty, wydarzenia ===== */
const LV_N=['','Poziom I','Poziom II','Poziom III','Leże bossa'];
const expStage=(r,L)=>(BIOMES[r]&&BIOMES[r].sr!=null?BIOMES[r].sr:r)*5+Math.min(L,4);
const propUrl=k=>GFX.P&&GFX.P[k]?GFX.P[k].u:'';
const propImg=k=>{const P=GFX.P&&GFX.P[k];if(!P)return '';const s=Math.min(3,100/P.w,110/P.h);const q=Math.max(1,Math.floor(s*DPR()))/DPR();return `<img class="px" src="${P.u}" style="width:${Math.round(P.w*q)}px;height:${Math.round(P.h*q)}px" alt="">`};
const ROOM={fight:{ic:'fight',n:'Walka'},elite:{ic:'skull',n:'Elita'},boss:{ic:'boss',n:'Boss'},chest:{ic:'chest',n:'Skrzynia'},event:{ic:'event',n:'Wydarzenie'},camp:{ic:'camp',n:'Obozowisko'}};
let mapSel=null,_walking=false;
function regFromStage(s){const st=Math.max(1,s.stage||1),r=Math.min(4,Math.floor((st-1)/5)),L=st>25?4:(st-1)%5+1;s.reg={lv:[0,0,0,0,0],done:[0,0,0,0,0]};for(let i=0;i<r;i++){s.reg.lv[i]=4;s.reg.done[i]=1}s.reg.lv[r]=Math.max(s.reg.lv[r],Math.min(4,L));if(st>25)s.reg.done[4]=1}
function regOk(){if(!S.reg)regFromStage(S)}
const partyHeroes=()=>{syncForm();return S.slots.map(id=>id!=null?getHero(id):null).filter(h=>h&&h.hp>0)};
const hasCls=(...c)=>partyHeroes().some(h=>c.includes(h.cls));
const mh=h=>stats(h).maxHp;
function hurtAll(f,front){const o=[];partyHeroes().forEach(h=>{if(front&&S.slots.indexOf(h.id)>1)return;const d=Math.max(1,Math.round(mh(h)*f));h.hp=Math.max(1,h.hp-d);o.push(`${h.name.split(' ')[0]} −${d}`)});return o.join(', ')}
function healAll(f){let n=0;partyHeroes().forEach(h=>{const v=Math.min(mh(h)-h.hp,Math.round(mh(h)*f));h.hp+=v;n+=v});return n}
function partyXp(x){const o=[];partyHeroes().forEach(h=>{const l=h.lvl;gainXp(h,x);if(h.lvl>l)o.push(`${h.name.split(' ')[0]} awansuje na poziom ${h.lvl}!`)});return o}
/* --- generowanie wyprawy: rozgałęziona mapa ---
   Komnaty leżą w krokach (c) na 3 torach (l). Każda ścieżka ma tyle komnat co dawny korytarz (5 + poziom, maks. 8)
   i kończy się elitą albo bossem. Ścieżki się nie przecinają.
   E.rooms: płaska lista {k,ev,done,c,l}, ostatnia = koniec mapy (elita/boss); E.next[i]: dokąd można pójść z komnaty i;
   E.roots: komnaty pierwszego kroku; E.path: przebyta droga; E.seen: komnaty już odkryte (widziane jako możliwy krok).
   Wyprawy ze starych zapisów (bez E.next) i walki w drodze działają dalej jak jeden korytarz. */
const XLANES=3;
function expGraph(C){const has=Array.from({length:C},()=>[0,0,0]),ed=[];
 const crosses=(c,a,b)=>ed.some(([c2,a2,b2])=>c2===c&&((a<a2&&b>b2)||(a>a2&&b<b2)));
 const st=[0,1,2].sort(()=>Math.random()-.5);
 for(let p=0;p<3;p++){let l=p<2?st[p]:pick([0,1,2]);
  for(let c=0;c<C;c++){has[c][l]=1;if(c===C-1)break;const o=[l-1,l,l+1].filter(x=>x>=0&&x<XLANES&&!crosses(c,l,x));if(!o.length)return null;
   const nl=pick(o);if(!ed.some(e=>e[0]===c&&e[1]===l&&e[2]===nl))ed.push([c,l,nl]);l=nl}}
 return {has,ed}}
function expPaths(g,C){const out=[],go=(c,l,acc)=>{acc=acc.concat([[c,l]]);if(c===C-1){out.push(acc);return}g.ed.filter(e=>e[0]===c&&e[1]===l).forEach(e=>go(c+1,e[2],acc))};
 for(let l=0;l<XLANES;l++)if(g.has[0][l])go(0,l,[]);return out}
/* rodzaje komnat; zasady sprawdzane na KAŻDEJ ścieżce: obozowisko gdzieś w środku (nie na starcie i nie tuż przed bossem),
   nigdy dwa obozowiska z rzędu, najwyżej jedna dodatkowa elita (tylko w drugiej połowie), co najmniej 2 walki, najwyżej 2 skrzynie.
   Elita ma być wyborem: część ścieżek ją ma, część ją omija. */
function expTypes(g,C,strict){
 const ty=g.has.map((row,c)=>row.map(h=>{if(!h)return null;const w=[['fight',2.6],['event',2],['chest',1.4]];if(c>0&&c<C-1)w.push(['camp',.9]);if(c>=Math.ceil(C/2)&&c<C-1)w.push(['elite',1]);
  let x=Math.random()*w.reduce((a,b)=>a+b[1],0);for(const [k,v] of w){if((x-=v)<0)return k}return 'fight'}));
 const ps=expPaths(g,C),T=([c,l])=>ty[c][l],nb=(c,l)=>g.ed.some(e=>(e[0]===c-1&&e[2]===l&&ty[c-1][e[1]]==='camp')||(e[0]===c&&e[1]===l&&ty[c+1][e[2]]==='camp'));
 /* naprawa: ścieżka bez obozowiska dostaje je w środku (bez sąsiadujących obozowisk) */
 for(let k=0;k<6;k++){const miss=ps.find(p=>!p.some(x=>T(x)==='camp'));if(!miss)break;const cand=miss.filter(([c,l])=>c>0&&c<C-1&&T([c,l])!=='elite'&&!nb(c,l));if(!cand.length)break;const [c,l]=pick(cand);ty[c][l]='camp'}
 /* naprawa: gdy żadna ścieżka nie ma elity, dodaj ją tam, gdzie wszystkie przechodzące ścieżki jej jeszcze nie mają */
 if(strict&&!ps.some(p=>p.some(x=>T(x)==='elite'))){const cand=[];g.has.forEach((row,c)=>row.forEach((h,l)=>{if(h&&c>=Math.ceil(C/2)&&c<C-1&&['fight','event','chest'].includes(ty[c][l]))cand.push([c,l])}));if(cand.length){const [c,l]=pick(cand);ty[c][l]='elite'}}
 let withE=0;if(strict&&ps.length<2)return null;
 for(const p of ps){const t=p.map(T),n=k=>t.filter(x=>x===k).length;
  if(t.some((x,i)=>x==='camp'&&t[i+1]==='camp'))return null;
  if(n('elite')>1||n('fight')+n('elite')<2||n('chest')>2)return null;
  if(strict&&n('camp')<1)return null;
  if(n('elite'))withE++}
 if(strict&&(withE===0||withE===ps.length))return null;
 return ty}
function genExp(r,L){const st=expStage(r,L),n=5+Math.min(L,3),C=n-1;
 for(let t=0;t<300;t++){const g=expGraph(C);if(!g)continue;const ty=expTypes(g,C,t<240);if(ty){const E=expBuild(r,L,st,g,ty,C);if(t>=240)E.loose=1;return E}}
 return expCorridor(r,L,st,n)}
function expBuild(r,L,st,g,ty,C){const evs=['kapliczka','wedrowiec','pulapka','studnia','oboz'].sort(()=>Math.random()-.5),rooms=[],id={};let ei=0;
 for(let c=0;c<C;c++)for(let l=0;l<XLANES;l++)if(g.has[c][l]){const k=ty[c][l];id[c+','+l]=rooms.length;rooms.push({k,ev:k==='event'?evs[ei++%evs.length]:null,done:0,c,l})}
 const fin=rooms.length;rooms.push({k:L>=4?'boss':'elite',done:0,c:C,l:1});
 const next=rooms.map(rm=>rm.c===C?[]:rm.c===C-1?[fin]:g.ed.filter(e=>e[0]===rm.c&&e[1]===rm.l).map(e=>id[(e[0]+1)+','+e[2]]).sort((a,b)=>a-b));
 const roots=rooms.map((rm,i)=>rm.c===0?i:-1).filter(i=>i>=0);
 return {r,L,st,rooms,next,roots,path:[],seen:roots.slice(),i:-1,gold:0,loot:[],kills:0}}
/* zapasowo, gdy nie uda się ułożyć mapy: dawny korytarz (jedna ścieżka) */
function expCorridor(r,L,st,n){const mid=['fight','fight','chest','event','camp'];
 while(mid.length<n-1)mid.push(pick(['fight','event','chest','fight']));
 let ok=false,t=0;while(!ok&&t++<50){mid.sort(()=>Math.random()-.5);ok=mid[0]!=='camp'&&mid[mid.length-1]!=='camp'}
 const evs=['kapliczka','wedrowiec','pulapka','studnia','oboz'].sort(()=>Math.random()-.5);let ei=0;
 const rooms=mid.map(k=>({k,ev:k==='event'?evs[ei++%evs.length]:null,done:0}));rooms.push({k:L>=4?'boss':'elite',done:0});
 return {r,L,st,rooms,i:-1,gold:0,loot:[],kills:0}}
/* --- mapa wyprawy: pomocnicze --- */
const expCol=(E,i)=>i<0?-1:E.rooms[i]&&E.rooms[i].c!=null?E.rooms[i].c:i;
const expSteps=E=>expCol(E,E.rooms.length-1)+1;
function expNext(E){if(!E.next)return E.i+1<E.rooms.length?[E.i+1]:[];return (E.i<0?E.roots:E.next[E.i])||[]}
const roomPassed=(E,i)=>E.path?E.path.includes(i):i<=E.i;
function roomKnown(E,i){return i===E.rooms.length-1||roomPassed(E,i)||litRoom(i)||expNext(E).includes(i)||(E.seen?E.seen.includes(i):i<=E.i+1)}
function expEdges(E){const o=[];E.rooms.forEach((rm,i)=>{(E.next?E.next[i]||[]:i+1<E.rooms.length?[i+1]:[]).forEach(j=>o.push([i,j]))});return o}
const expLane=(E,i)=>{const rm=E.rooms[i];return i===E.rooms.length-1||!rm||rm.l==null?1:rm.l};
/* mała mapa na górnym pasku (dotknij = duża mapa) */
function expMini(E){const n=expSteps(E),W=Math.max(1,n-1)*22+16,X=i=>8+Math.max(0,expCol(E,i))*22,Y=i=>5+expLane(E,i)*10,last=E.rooms.length-1,cur=E.rooms[E.i],nx=!cur||cur.done?expNext(E):[];let s='';
 expEdges(E).forEach(([a,b])=>{s+=`<line class="${roomPassed(E,a)&&roomPassed(E,b)?'on':''}" x1="${X(a)}" y1="${Y(a)}" x2="${X(b)}" y2="${Y(b)}"/>`});
 E.rooms.forEach((rm,i)=>{const k=roomKnown(E,i);s+=`<circle class="t-${k?rm.k:'fog'}${rm.done?' done':''}${i===E.i?' cur':''}${nx.includes(i)?' nx':''}${litRoom(i)&&expCol(E,i)>expCol(E,E.i)?' lit':''}${!roomPassed(E,i)&&expCol(E,i)<=expCol(E,E.i)?' past':''}" cx="${X(i)}" cy="${Y(i)}" r="${i===last?5.5:i===E.i?4.6:3.6}"><title>${k?ROOM[rm.k].n:'?'}</title></circle>`});
 return `<div class="mm" data-act="xmap" role="button" tabindex="0" title="Mapa wyprawy"><svg viewBox="0 0 ${W} 30" aria-hidden="true">${s}</svg><b>${Math.max(0,expCol(E,E.i)+1)}/${n}</b></div>`}
/* duża mapa: wybór drogi na rozstajach */
function xMapModal(){const E=S.exp;if(!E)return;const last=E.rooms.length-1,cur=E.rooms[E.i],go=(!cur||cur.done)&&!_walking,nx=go?expNext(E):[],n=expSteps(E);
 /* wysokość ścieżek: rozłóż tylko użyte pasy, żeby mapa nie miała pustego dołu/góry */
 const ul=[...new Set(E.rooms.slice(0,last).map(rm=>rm.l).filter(l=>l!=null))].sort(),YS=ul.length>2?[20,50,80]:ul.length>1?[28,72]:[50],LY={};ul.forEach((l,j)=>LY[l]=YS[j]);
 const P=i=>{if(i<0)return [4,50];const c=expCol(E,i),f=i===last,l=expLane(E,i);return [12+(n>1?c/(n-1):.5)*82+(f?0:((i*7)%5-2)*.5),f||LY[l]==null?50:LY[l]+((i*11)%5-2)*1.6]};
 const ln=(a,b,cl)=>{const [x1,y1]=P(a),[x2,y2]=P(b);return `<line class="${cl}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`};
 let lines=(E.roots||[0]).map(j=>ln(-1,j,roomPassed(E,j)?'on':nx.includes(j)?'nx':'')).join('');
 expEdges(E).forEach(([a,b])=>{lines+=ln(a,b,roomPassed(E,a)&&roomPassed(E,b)?'on':a===E.i&&nx.includes(b)?'nx':'')});
 const nodes=E.rooms.map((rm,i)=>{const k=roomKnown(E,i),R=ROOM[rm.k],can=nx.includes(i),[x,y]=P(i),t=k?R.n:'Nieznana komnata';
  const cl=['xn','t-'+(k?rm.k:'fog'),rm.done?'done':'',i===E.i?'cur':'',can?'nx':'',litRoom(i)&&expCol(E,i)>expCol(E,E.i)?'lit':'',!roomPassed(E,i)&&expCol(E,i)<=expCol(E,E.i)?'past':'',i===last?'fin':''].filter(Boolean).join(' ');
  const inner=(k?ic(R.ic,i===last?26:18):'?')+(i===E.i?`<i class="xme">${emb(16)}</i>`:'');
  return can?`<button class="${cl}" style="left:${x}%;top:${y}%" data-act="xgo" data-i="${i}" title="${t}" aria-label="Idź: ${t}">${inner}</button>`:`<span class="${cl}" style="left:${x}%;top:${y}%" title="${t}">${inner}</span>`}).join('');
 const hint=cur&&!cur.done?'Najpierw zmierz się z tym, co czeka w tej komnacie.':nx.length>1?'Rozstaje! Dotknij jednej z podświetlonych komnat, aby tam pójść.':nx.length?'Dotknij podświetlonej komnaty, aby iść dalej.':'Koniec drogi – możesz zakończyć wyprawę.';
 modal(`<div class="xmw"><h2>${ic('map',20)} ${esc(E.nm||BIOMES[E.r].n)}${E.nm?'':` <small>${LV_N[E.L]}</small>`}<small class="xstep">krok ${Math.max(0,expCol(E,E.i)+1)} z ${n}</small></h2>
 <div class="xmap"><svg class="xml" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg><span class="xst" style="left:4%;top:50%" title="Wejście">${E.i<0?emb(18):ic('flag',16)}</span>${nodes}</div>
 <div class="xleg">${['fight','elite','chest','event','camp'].map(k=>`<span>${ic(ROOM[k].ic,14)}${ROOM[k].n}</span>`).join('')}<span><b class="xq">?</b>nieznane</span>${E.torch!=null?`<span>${ic('torch',14)}oświetlone</span>`:''}</div>
 <p class="sub xh">${hint}</p><div class="row"><button data-act="close">Zamknij</button></div></div>`);
 const b=document.querySelector('#modal .box');if(b)b.classList.add('wide')}
/* Naprzód: jedna droga – idź, rozstaje – pokaż mapę */
function expForward(){const E=S.exp;if(!E||_walking)return;const cur=E.rooms[E.i];if(cur&&!cur.done)return;const nx=expNext(E);if(nx.length>1)xMapModal();else if(nx.length)expWalk()}
function roomFoes(E,k){const bio=BIOMES[E.r],Q=E.site&&QSITE[E.site],loc=Math.min(E.L,3)+1,pool=((Q&&Q.pool)||bio.pool).filter(p=>loc>=p[0]).map(p=>p[1]);
 if(k==='boss')return [(Q&&Q.boss)||bio.boss,...Array.from({length:Math.min(3,1+E.r)},()=>pick(pool))];
 let n=2+Math.floor(E.L/2)+(Math.random()<.5?1:0)+(k==='elite'?1:0)+(E.r>=2?1:0);n=Math.max(2,Math.min(5,n));return Array.from({length:n},()=>pick(pool))}
function expFight(k){const E=S.exp,room=E.rooms[E.i],bio=BIOMES[E.r];k=k||room.k;
 const st=k==='boss'?E.r*5+5:E.st,est=k==='elite'?E.st+1:st;
 startBattle({st,est,bio,list:roomFoes(E,k),exp:true,elite:k==='elite',lbl:`${E.nm||bio.n.split(' ').pop()} ${LV_N[E.L].replace('Poziom ','')} · ${expCol(E,E.i)+1}/${expSteps(E)}`,wl:k==='elite'?'Elitarni wrogowie!':k==='boss'?'Boss!':'Zasadzka!'})}
/* --- koniec walki na wyprawie --- */
function finishExpBattle(){const E=S.exp,win=alive('e').length===0&&alive('h').length>0,lines=[],lv=[],got=[];
 const F=battleFates(win),fallen=F.fallen;
 const stolen=B.units.reduce((a,u)=>a+(u.stolen||0),0),boss=B.units.some(u=>u.boss&&u.side==='e');
 if(S.roster.length===0){const w=S.wins,f=S.fallen.length,st=S.stage;localStorage.removeItem(SAVE_KEY);S=null;
  modal(`<div class="banner"><h1>Koniec gry</h1></div><div class="res"><p>Cała kompania poległa na wyprawie.</p><p>Najdalszy etap: <b>${st}</b>, wygrane walki: <b>${w}</b>, polegli: <b>${f}</b>.</p></div><button class="btn-main" data-act="gameover">Spróbuj ponownie</button>`);return}
 let i=0;const dl=()=>`style="animation-delay:${(0.3+(i++)*0.2).toFixed(2)}s"`;if(fallen.length)E.lost=1;
 if(!win){const fh=fateHtml(F,dl),tw=expEndTown(E,true,false);S.exp=null;save();const m=mainOf();
  modal(`<div class="banner"><h1>Porażka…</h1></div><div class="res"><p ${dl()}>Drużyna została pokonana. Wyprawa przepadła razem z jej łupami.${m?` ${esc(m.name.split(' ')[0])} i ocaleni z trudem wracają do miasta.`:''}</p>${fh}${tw.map(t=>`<p ${dl()}>${t}</p>`).join('')}</div><button class="btn-main" data-act="tocamp">${ic('nav_town',22)} Do obozu</button>`);
  /* przegrana walka w drodze: podróż przepada */
  if(E.road){S.pend=null;save()}return}
 const st=B.st,gold=Math.round((14+st*7)*(B.elite?1.6:1)+(boss?60+st*6:0)),xp=Math.round((12+st*5)*(B.elite?1.4:1)*(boss?1.6:1));E.gold+=Math.round(gold*(1+((E.fx&&E.fx.gold)||0)))+stolen+(B.rab||0);S.wins++;E.kills+=B.units.filter(u=>u.side==='e'&&!u.obj).length;
 lines.push(`${ic('gold',18)} +${gold} złota do łupów wyprawy`+(stolen?` (+${stolen} odzyskane)`:'')+(B.rab?` (+${B.rab} skradzione)`:''),`${ic('xp',18)} +${xp} PD dla ocalałych`);
 B.units.filter(u=>u.side==='h'&&u.alive).forEach(u=>{const h=u.hero,l0=h.lvl;const msgs=gainXp(h,xp);if(h.lvl>l0)lv.push({h,msgs})});
 const luck=Math.min(.3,st*.02)+(boss?.15:B.elite?.08:0),n=boss?2:B.elite?1:Math.random()<.35?1:0;for(let k=0;k<n;k++){const it=makeItem(st+(boss?1:0),rollRar(luck,boss?1:0));E.loot.push(it);got.push(it)}if(boss){const tr=bossTrophy();if(tr){E.loot.push(tr);got.push(tr)}}
 const room=E.rooms[E.i];if(room)room.done=1;
 B.units.filter(u=>u.side==='e'&&!u.obj).forEach(u=>conEv('kill',u.key));if(B.elite)conEv('elite');if(boss)conEv('boss',E.r);const injs=rollInjuries(),drops=expDrops(boss);lines.push(...drops);
 let html=`<div class="banner"><div class="rays"></div><h1>${ic(boss?'boss':'xp',26)} ${boss?esc(B.units.find(u=>u.boss).name)+' '+gf(B.units.find(u=>u.boss),'pokonany','pokonana')+'!':'Zwycięstwo!'}</h1></div><div class="res">${lines.map(l=>`<p ${dl()}>${l}</p>`).join('')}`;
 lv.forEach(({h,msgs})=>{const nl=msgs.filter(m=>m.startsWith('⭐')).length;html+=`<div class="lvcard" ${dl()}>${bust(heroSprite(h),h.cls,44,1.5)}<div><b>${esc(h.name)}</b><br>${ic('lvl',14)} Poziom ${h.lvl}! <small>+${3*nl} pkt cech, +${nl} pkt talentu</small>${msgs.filter(m=>!m.startsWith('⭐')).map(m=>`<br><small>${esc(m)}</small>`).join('')}</div></div>`});
 got.forEach(it=>{html+=`<div class="loot r${it.r}" style="--rc:${rcol(it)};animation-delay:${(0.35+(i++)*0.3).toFixed(2)}s"><div class="ii">${itIc(it,28)}</div><div><b style="color:${rcol(it)};text-shadow:1px 1px 0 #000">${esc(it.n)}</b><br><small>${it.uq?'Trofeum bossa (pierwsze zwycięstwo)':RAR[it.r].n} · ${statStr(it.st)} · do łupów</small></div></div>`});
 injs.forEach(({h,k})=>html+=`<p ${dl()} class="injp">${ic(INJ[k].m?'mind':'injury',16)} ${esc(h.name.split(' ')[0])}: <b>${INJ[k].n}</b> (${INJ[k].d}) – wylecz w Szpitalu.</p>`);
 html+=fateHtml(F,dl);
 html+=`<p ${dl()} class="sub">${ic('hp',14)} Rany nie goją się same – odpocznij w obozowisku albo wróć do Świątyni.</p>`;
 save();modal(html+`</div><button class="btn-main" data-act="expback">${ic('walk',20)} Dalej</button>`)}
/* --- koniec / odwrót --- */
function bankLoot(E){let sold=0;E.loot.forEach(it=>{if(S.inv.length<INV_MAX||it.uq)S.inv.push(it);else{S.gold+=sellPrice(it);sold++}});return sold}
function expComplete(){const E=S&&S.exp;if(!E)return;
 /* walka w drodze i wyprawy z zadań (QSITE: Mglista Polana, Kurhan bez imienia, Czarny Bór) kończą się inaczej niż zwykła wyprawa */
 if(E.road){roadDone();return}
 if(E.site&&QSITE[E.site]){const Q=QSITE[E.site],bonus=60+E.st*8;S.gold+=E.gold+bonus;bankLoot(E);partyHeroes().forEach(h=>h.exps=(h.exps||0)+1);const tw=expEndTown(E,false,true);questExp(E);S.exp=null;save();
  modal(`<div class="banner"><div class="rays"></div><h1>${ic('flag',24)} ${NODES[E.site].n}</h1></div><div class="res"><p>${ic('gold',18)} Łupy: ${E.gold} + premia ${bonus} zł</p><p>${Q.end}</p>${tw.map(t=>`<p>${t}</p>`).join('')}</div><button class="btn-main" data-act="tocamp">${ic('walk',22)} ${Q.go}</button>`);return}
 const qn=questExp(E);
 const bio=BIOMES[E.r],boss=E.L>=4,bonus=20+E.st*10+(boss?100+E.st*8:0);S.gold+=E.gold+bonus;const sold=bankLoot(E);regOk();const R=S.reg;let un='';
 if(!boss){if(R.lv[E.r]<E.L+1){R.lv[E.r]=E.L+1;un=`Odblokowano: ${bio.n} – ${LV_N[E.L+1]}.`}}else{R.done[E.r]=1;if(E.r<4&&!R.lv[E.r+1]){R.lv[E.r+1]=1;un=`Odblokowano nową krainę: ${BIOMES[E.r+1].n}!`}else if(E.r===4)un='Żmij pokonany! Wszystkie krainy stoją otworem – możesz wracać po łupy.';else if(E.r>4)un=`${ENEMIES[bio.boss].name} ${gf({name:ENEMIES[bio.boss].name},'pokonany','pokonana')}! ${bio.n} jest bezpieczniejsze.`}
 const ns=boss?(E.r<=4?E.r*5+6:E.st+1):E.st+1;S.stage=Math.max(S.stage,Math.min(ns,25));if(S.stage>best())try{localStorage.setItem(BEST_KEY,String(S.stage))}catch(e){}
 partyHeroes().forEach(h=>h.exps=(h.exps||0)+1);const tw=expEndTown(E,false,true);genOffers();genShop();S.exp=null;save();
 modal(`<div class="banner"><div class="rays"></div><h1>${ic('flag',24)} Wyprawa zakończona!</h1></div><div class="res"><p>${ic('gold',18)} Łupy: ${E.gold} + premia ${bonus} = <b>${E.gold+bonus} złota</b></p><p>${ic('bag',18)} Przedmioty: <b>${E.loot.length}</b>${sold?` (${sold} sprzedano – pełny plecak)`:''}</p><p>${ic('skull',18)} Pokonani wrogowie: ${E.kills}</p>${un?`<p><b>${un}</b></p>`:''}${tw.map(t=>`<p>${t}</p>`).join('')}<p>${ic('tavern',16)}${ic('smith',16)} Nowi ochotnicy i nowy towar w mieście.</p></div><button class="btn-main" data-act="tocamp">${ic('nav_town',22)} Do obozu</button>`);
 if(qn&&!S.qPend)toast('Dziennik: cel zadania wykonany!')}
function expRetreat(){if(!S.exp)return;const E=S.exp;if(E.road){roadDone();return}const keep=Math.floor(E.gold/2);S.gold+=keep;const sold=bankLoot(E),tw=expEndTown(E,false,false);genOffers();genShop();S.exp=null;save();
 modal(`<h2>${ic('back',20)} Odwrót</h2><p>Drużyna wraca do miasta. Zachowujesz przedmioty (${E.loot.length}${sold?`, ${sold} sprzedano`:''}) i ${keep} z ${E.gold} złota.</p>${tw.map(t=>`<p class="sub">${t}</p>`).join('')}<button class="btn-main" data-act="tocamp">${ic('nav_town',22)} Do obozu</button>`)}
/* --- wydarzenia --- */
const EVENTS={
 kapliczka:{n:'Zapomniana kapliczka',p:'shrine',t:'Przy ścieżce stoi omszała kapliczka. Ze środka bije słabe światło.',o:[
  {t:'Pomódl się',r:()=>Math.random()<.65?`Światło koi rany: drużyna odzyskuje ${healAll(.25)} PŻ.`:`Mroczna klątwa! ${hurtAll(.1)}.`},
  {t:'Złóż ofiarę (25 zł)',c:()=>S.gold>=25,r:()=>{S.gold-=25;return `Ofiara przyjęta. Drużyna odzyskuje ${healAll(.4)} PŻ.`}},
  {t:'Odejdź',r:()=>'Ruszacie dalej, nie kusząc losu.'}]},
 wedrowiec:{n:'Ranny wędrowiec',p:'wanderer',t:'Pod drzewem siedzi ranny wędrowiec i prosi o pomoc.',o:[
  {t:'Opatrz jego rany',r:()=>{if(hasCls('kaplan','druid','paladyn')||Math.random()<.6){const g=15+S.exp.st*4;S.exp.gold+=g;const x=partyXp(10+S.exp.st*3);return `Wdzięczny wędrowiec daje wam ${g} złota i dzieli się wiedzą (+PD).${x.length?' '+x.join(' '):''}`}return {amb:1,t:'To pułapka! Z krzaków wyskakują jego kompani!'}}},
  {t:'Daj mu złoto (15 zł)',c:()=>S.gold>=15,r:()=>{S.gold-=15;const it=makeItem(S.exp.st,rollRar(.15));S.exp.loot.push(it);return `W podzięce oddaje wam znalezisko: ${it.n} (${RAR[it.r].n.toLowerCase()}).`}},
  {t:'Zostaw go',r:()=>'Odchodzicie. Jego jęk długo słychać za plecami.'}]},
 pulapka:{n:'Pułapka!',p:'trap',t:'Na ścieżce błyszczą ostrza ukrytej pułapki.',o:[
  {t:'Rozbrój',r:()=>{const ch=.45+(hasCls('lotr')?.4:0)+(hasCls('lucznik')?.15:0);if(Math.random()<ch){const g=10+S.exp.st*3;S.exp.gold+=g;return `Pułapka rozbrojona! Pod płytą leżał schowek: +${g} złota.`}return `Mechanizm zaskoczył! Pierwszy rząd ranny: ${hurtAll(.15,true)}.`}},
  {t:'Przejdź ostrożnie',r:()=>{const o=[];partyHeroes().forEach(h=>{if(Math.random()<.4){const d=Math.max(1,Math.round(mh(h)*.08));h.hp=Math.max(1,h.hp-d);o.push(`${h.name.split(' ')[0]} −${d}`)}});return o.length?`Kilka zadrapań: ${o.join(', ')}.`:'Wszyscy przeszli bez szwanku.'}}]},
 studnia:{n:'Stara studnia',p:'well',t:'Kamienna studnia. Mówią, że spełnia życzenia… albo truje.',o:[
  {t:'Wrzuć monetę (10 zł)',c:()=>S.gold>=10,r:()=>{S.gold-=10;const x=Math.random();if(x<.4){const g=30+S.exp.st*4;S.exp.gold+=g;return `Z dna wypływa sakiewka: +${g} złota!`}if(x<.7)return `Woda lśni – drużyna odzyskuje ${healAll(.2)} PŻ.`;return 'Plusk… i nic.'}},
  {t:'Napij się',r:()=>Math.random()<.5?`Orzeźwiające! +${healAll(.15)} PŻ.`:`Zatruta woda! ${hurtAll(.08)}.`},
  {t:'Odejdź',r:()=>'Lepiej nie ryzykować.'}]},
 oboz:{n:'Porzucony obóz',p:'cache',t:'Ktoś zostawił tu skrzynie i worki. Wygląda na pośpiech…',o:[
  {t:'Przeszukaj',r:()=>{const x=Math.random();if(x<.55){if(Math.random()<.5){const it=makeItem(S.exp.st,rollRar(.1));S.exp.loot.push(it);return `Znalazłeś: ${it.n}!`}const g=18+S.exp.st*4;S.exp.gold+=g;return `W worku było ${g} złota.`}if(x<.8)return 'Tylko szmaty i pleśń.';return {amb:1,t:'Właściciele wrócili – i nie są zadowoleni!'}}},
  {t:'Odejdź',r:()=>'Zostawiacie obóz w spokoju.'}]}
};
function roomProp(room){if(!room)return '';if(room.k==='chest')return room.done?'chest_open':'chest';if(room.k==='camp')return 'camp';if(room.k==='boss')return 'gate';if(room.k==='event')return EVENTS[room.ev].p;return ''}
function evModal(room,res){const E=EVENTS[room.ev];const p=propUrl(E.p);
 const body=res?`<p class="evr">${esc(res.t||res)}</p>${res.amb?`<button class="btn-main" data-act="exfight">${ic('fight',20)} Do walki!</button>`:`<button class="btn-main" data-act="evdone">${ic('walk',20)} Dalej</button>`}`
  :`<p>${E.t}</p><div class="evo">${E.o.map((o,i)=>`<button data-act="evopt" data-i="${i}" ${o.c&&!o.c()?'disabled':''}>${o.t}</button>`).join('')}</div>`;
 modal(`<div class="evm"><div class="evp">${propImg(E.p)}</div><div class="evt"><h2>${ic('event',20)} ${E.n}</h2>${body}</div></div>`)}
function chestModal(res){const room=S.exp.rooms[S.exp.i];
 modal(`<div class="evm"><div class="evp">${propImg(res?'chest_open':'chest')}</div><div class="evt"><h2>${ic('chest',20)} Skrzynia</h2>${res?`<p class="evr">${res}</p><button class="btn-main" data-act="evdone">${ic('walk',20)} Dalej</button>`:`<p>Okuta skrzynia stoi w cieniu. Może być pułapką…</p><div class="evo"><button class="btn-gold" data-act="chopen">${ic('chest',18)} Otwórz</button><button data-act="evskip">Zostaw</button></div>`}</div></div>`)}
function campModal(res){modal(`<div class="evm"><div class="evp">${propImg('camp')}</div><div class="evt"><h2>${ic('camp',20)} Obozowisko</h2>${res?`<p class="evr">${res}</p><button class="btn-main" data-act="evdone">${ic('walk',20)} Dalej</button>`:`<p>Bezpieczne miejsce na odpoczynek. Ognisko, namiot, chwila ciszy.</p><div class="evo"><button class="btn-green" data-act="crest">${ic('sk_leczenie',18)} Odpocznij (+35% PŻ)</button>${S.sup&&S.sup.prowiant>0?`<button class="btn-gold" data-act="crest" data-p="1">${ic('prowiant',18)} Ucztuj z prowiantem (+60% PŻ, masz ${S.sup.prowiant})</button>`:''}<button data-act="evskip">Ruszaj dalej</button></div>`}</div></div>`)}
function enterRoom(){const E=S.exp,room=E.rooms[E.i];if(!room||room.done)return;
 if(room.k==='event'&&room.ev==='pulapka'&&litRoom(E.i)){room.done=1;save();evModal(room,'Blask pochodni ujawnia ukrytą pułapkę – omijacie ją bez szwanku.');return}
 if(room.k==='fight'||room.k==='elite'||room.k==='boss'){expFight();return}
 if(room.k==='event')evModal(room);else if(room.k==='chest')chestModal();else if(room.k==='camp')campModal()}
/* --- ekran mapy krain --- */
function renderMap(){regOk();const R=S.reg;if(!mapSel){let r=0;R.lv.forEach((l,i)=>{if(l)r=i});mapSel={r,L:R.lv[r]}}
 const card=(b,r)=>{const lk=!R.lv[r];return `<div class="reg ${lk?'lk':''} ${mapSel.r===r?'on':''}"><div class="rth"><span class="rpin">${["I","II","III","IV","V"][r]}</span>${R.done[r]?`<span class="rdone">${ic('flag',14)}</span>`:''}${lk?`<span class="rlock">${ic('lock',20)}</span>`:''}</div><div class="rn"><b>${b.n}</b><small>${ic('boss',12)} ${ENEMIES[b.boss].name}</small></div>
  <div class="rlv">${[1,2,3,4].map(L=>{const op=R.lv[r]>=L,cl=L<4?R.lv[r]>L||R.done[r]:R.done[r];return `<button class="${mapSel.r===r&&mapSel.L===L?'on':''} ${L===4?'bl':''}" data-act="msel" data-r="${r}" data-l="${L}" ${op?'':'disabled'}>${op?(L===4?ic('boss',14):''):ic('lock',12)}${L<4?['','I','II','III'][L]:'Boss'}${cl?'<i class="ck">✓</i>':''}</button>`}).join('')}</div></div>`};
 const r=mapSel.r,L=mapSel.L,b=BIOMES[r],st=expStage(r,L),ph=partyHeroes(),hurt=ph.filter(h=>h.hp<mh(h)*.6).length,ok=R.lv[r]>=L&&ph.length;
 document.getElementById('app').innerHTML=`<div class="mapv"><div class="mtop"><button class="btn-small" data-act="back">${ic('back',16)} Obóz</button><h2>${ic('map',20)} Wyprawy</h2><span class="pill gold">${ic('gold',18)} ${S.gold}</span></div>
 <div class="regs">${BIOMES.map(card).join('')}</div>
 <div class="mbot"><div class="minf"><b>${b.n} · ${LV_N[L]}</b><small>${5+Math.min(L,3)} komnat · ${L>=4?'na końcu boss: '+ENEMIES[b.boss].name:'na końcu elitarni wrogowie'} · zalecany poziom bohaterów: ${Math.max(1,Math.round(st*.75))}</small>${hurt?`<small class="warn">${ic('hp',12)} Rannych: ${hurt} – rany nie goją się na wyprawie!</small>`:''}</div>
 <div class="mparty" data-act="formq">${[4,3,2,1,0].map(i=>{const h=S.slots[i]!=null?getHero(S.slots[i]):null;return `<span class="mp ${i<2?'f':''}">${h?bust(heroSprite(h),h.cls,30,1,-4):''}</span>`}).join('')}<small>Formacja ▸</small></div>
 <button class="btn-small mbag" data-act="tomarket" title="Zapasy">${ic('bag',18)}<span>${bagN()}/${bagCap()}</span></button><button class="btn-main" data-act="expstart" ${ok?'':'disabled'}>${ic('walk',22)} Wyrusz</button></div></div>`}
/* --- ekran korytarza --- */
function renderExp(){const E=S.exp;if(!E){screen='camp';render();return}const bio=BIOMES[E.r],room=E.rooms[E.i],ph=partyHeroes();
 const mm=expMini(E),nx=expNext(E);
 const act=!room||room.done?(!nx.length?`<button class="btn-main" data-act="expdone">${ic('flag',20)} Zakończ wyprawę</button>`:nx.length>1?`<button class="btn-main go" data-act="xmap">${ic('map',22)} Wybierz drogę</button>`:`<button class="btn-main go" data-act="expwalk">Naprzód ${ic('walk',22)}</button>`)
  :`<button class="btn-main" data-act="exroom">${{fight:ic('fight',20)+' Walcz!',elite:ic('skull',20)+' Walcz z elitą!',boss:ic('boss',20)+' Zmierz się z bossem!',chest:ic('chest',20)+' Otwórz skrzynię',event:ic('event',20)+' Zbadaj',camp:ic('camp',20)+' Rozbij obóz'}[room.k]}</button>`;
 document.getElementById('app').innerHTML=`<div class="expv"><div id="xscene" class="scene xscene bg-${bio.k}">${sceneLayers(bio.k)}<div id="xparty"></div><div id="xprop"></div></div>
 <div class="xtop"><span class="pill">${ic('map',16)}<span>${esc(E.nm||bio.n)}<small>${E.nm?'Velesia':LV_N[E.L]}</small></span></span>${fxChips(E)}${mm}<span class="pill gold" title="Łupy wyprawy">${ic('gold',16)} ${E.gold}</span><span class="pill" title="Przedmioty">${ic('bag',16)} ${E.loot.length}</span><button class="btn-small" data-act="expret">${ic('back',16)}<span class="lbl">Wycofaj się</span></button></div>
 <div class="xbot"><div class="xps">${[4,3,2,1,0].map(i=>{const h=S.slots[i]!=null?getHero(S.slots[i]):null;if(!h)return `<span class="xpc empty"></span>`;const r=h.hp/mh(h);return `<span class="xpc ${i<2?'f':''}" data-act="hero" data-id="${h.id}">${bust(heroSprite(h),h.cls,28,1,-4)}<span><b>${esc(h.name.split(' ')[0])}</b>${devBadge(h)?'<i class="xb">!</i>':''}<i class="bar ${r<.35?'low':''}"><i style="width:${r*100}%"></i></i></span></span>`}).join('')}<button class="btn-small xbag" data-act="bag" data-b="0">${ic('bag',18)}<span class="lbl">Torba</span>${bagN()?`<i class="xb">${bagN()}</i>`:''}</button><button class="btn-small" data-act="formq">${ic('nav_team',18)}<span class="lbl">Formacja</span></button></div>${act}</div></div>`;
 layoutExp(false)}
function layoutExp(){const E=S.exp,sc=document.getElementById('xscene');if(!sc||!E)return;const W=sc.clientWidth,H=sc.clientHeight;sc.style.setProperty('--tw',Math.round(H*960/270)+'px');
 const s=qsc(Math.min(3,H*.28/HM.ch,(W/2-40)/5.3*1.1/HM.cw)),w=HM.cw*s*.95,yF=H-(LH()<360?74:86)-8,c0=Math.max(10,W*.02),rg=w*.3,mid=Math.max(W*.46,c0+w*5+rg+8);
 let h='';[0,1,2,3,4].forEach(i=>{const id=S.slots[i],hero=id!=null?getHero(id):null;if(!hero)return;const A=heroA(hero),x=mid-c0-w*(i+.5)-(i>=2?rg:0),y=i>=2?yF-Math.round(HM.ch*s*.1):yF;
  h+=`<div class="wk" style="left:${Math.round(x-A.cw*s/2)}px;top:${Math.round(y-A.ch*s)}px;width:${Math.round(A.cw*s)}px;height:${Math.round(A.ch*s)}px;z-index:${i>=2?2:3};animation-delay:-${(i*.13).toFixed(2)}s"><div class="shadow"></div>${sprDiv(A,s)}</div>`});
 document.getElementById('xparty').innerHTML=h;
 const room=E.rooms[E.i],pk=roomProp(room),pr=document.getElementById('xprop');
 if(pk){const P=GFX.P[pk],ps=qsc(s*(pk==='gate'?1.6:pk==='camp'||pk==='cache'?1.2:1.3));pr.innerHTML=`<img class="px" src="${P.u}" style="width:${P.w*ps}px;height:${P.h*ps}px;left:${Math.round(W*.72-P.w*ps/2)}px;top:${Math.round(yF-P.h*ps+4)}px" alt="">`}
 else if(room&&!room.done){pr.innerHTML=`<div class="xalert" style="left:${Math.round(W*.72)}px;top:${Math.round(yF-120)}px">${ic(ROOM[room.k].ic,28)}<b>!</b></div>`}else pr.innerHTML=''}
function expWalk(to){const E=S.exp,sc=document.getElementById('xscene');if(_walking||!E||!sc)return;const room=E.rooms[E.i];if(room&&!room.done)return;const nx=expNext(E);if(to==null){if(nx.length!==1)return;to=nx[0]}if(!nx.includes(to))return;
 _walking=true;const D=RM?300:1700/Math.min(SET.speed,1.5);E.i=to;if(E.path){E.path.push(to);expNext(E).forEach(j=>{if(!E.seen.includes(j))E.seen.push(j)})}save();
 document.getElementById('xprop').innerHTML='';sc.classList.add('walking');const bb=document.querySelector('.xbot .btn-main');if(bb){bb.disabled=true;bb.innerHTML=`${ic('walk',20)} Idziecie…`}
 setTimeout(()=>{/* pojawienie się rekwizytu z prawej */layoutExp();const im=document.querySelector('#xprop img,#xprop .xalert');if(im&&!RM){const v=(sc.clientHeight*2)/4;im.animate([{transform:`translateX(${Math.round(v*D/1000*.55)}px)`},{transform:'translateX(0)'}],{duration:D*.55,easing:'linear'})}},D*.45);
 setTimeout(()=>{sc.classList.remove('walking');_walking=false;render();setTimeout(enterRoom,T(250))},D)}
/* --- obsługa dotyku --- */
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||!S)return;const a=el.dataset.act,E=S.exp;
 switch(a){
 case 'map':if(S.exp){screen='exp';render();return}mapSel=null;screen='region';render();break;
 case 'expgo':screen='exp';render();break;
 case 'msel':mapSel={r:+el.dataset.r,L:+el.dataset.l};render();break;
 case 'expstart':{regOk();if(!partyHeroes().length){toast('Najpierw ustaw drużynę w formacji!');return}S.exp=genExp(mapSel.r,mapSel.L);expStartTown(S.exp);save();screen='exp';render();break}
 case 'expwalk':expWalk();break;
 case 'xmap':xMapModal();break;
 case 'xgo':{const i=+el.dataset.i;closeModal();expWalk(i);break}
 case 'exroom':enterRoom();break;
 case 'expdone':if(E)expComplete();break;
 case 'expret':modal(`<h2>${ic('back',20)} Wycofać się?</h2><p>Drużyna wróci do miasta. Zachowasz zdobyte przedmioty (${E.loot.length}), ale stracisz połowę złota z wyprawy (${Math.ceil(E.gold/2)} z ${E.gold}) i premię za ukończenie.</p><div class="row"><button class="btn-red" data-act="expretok">Tak, wycofaj się</button><button data-act="close">Zostań</button></div>`);break;
 case 'expretok':expRetreat();break;
 case 'expback':closeModal();B=null;screen='exp';render();if(E&&E.i>=E.rooms.length-1&&E.rooms[E.i].done)setTimeout(expComplete,T(400));break;
 case 'evopt':{const room=E.rooms[E.i],o=EVENTS[room.ev].o[+el.dataset.i];if(!o||(o.c&&!o.c()))return;let r=o.r();if(r&&r.amb&&litRoom(E.i)){room.done=1;save();evModal(room,'Pochodnia w porę ujawnia czających się napastników – wymykacie się bokiem.');return}if(r&&r.amb){room.k='fight';room.ev=null;save();evModalAmb(r.t);return}room.done=1;save();evModal(room,r);break}
 case 'exfight':closeModal();expFight('fight');break;
 case 'evdone':case 'evskip':{const room=E.rooms[E.i];if(room)room.done=1;save();closeModal();render();break}
 case 'chopen':{const room=E.rooms[E.i];if(room.done)return;room.done=1;let t='';conEv('chest');if(Math.random()<.5){S.mat.odl++;t+='Odłamki rzemieślnicze (+1). '}if(!litRoom(E.i)&&Math.random()<.15)t+=`Pułapka w zamku! ${hurtAll(.12,true)}. `;const g=12+E.st*5;E.gold+=g;t+=`W środku: ${g} złota`;if(Math.random()<.65){const it=makeItem(E.st,rollRar(Math.min(.3,E.st*.02)+.05));E.loot.push(it);t+=` oraz ${it.n} (${RAR[it.r].n.toLowerCase()})`}save();chestModal(t+'.');layoutExp();break}
 case 'crest':{const room=E.rooms[E.i];if(room.done)return;room.done=1;const pr=el.dataset.p&&S.sup.prowiant>0;if(pr)S.sup.prowiant--;const v=healAll(pr?.6:.35);save();campModal(`${pr?'Ciepła strawa i ognisko stawiają drużynę na nogi':'Przy ognisku rany się goją'}: drużyna odzyskuje ${v} PŻ.`);break}
 }});
function evModalAmb(t){modal(`<div class="evm"><div class="evp">${propImg('trap')}</div><div class="evt"><h2>${ic('fight',20)} Zasadzka!</h2><p class="evr">${esc(t)}</p><button class="btn-main" data-act="exfight">${ic('fight',20)} Do walki!</button></div></div>`)}
let _xsT=0,_xsX=0;document.addEventListener('pointerdown',e=>{if(screen==='exp'&&e.target.closest('#xscene')){_xsX=e.clientX;_xsT=Date.now()}});
document.addEventListener('pointerup',e=>{if(screen==='exp'&&_xsT&&Date.now()-_xsT<600&&_xsX-e.clientX>50)expForward();_xsT=0});
addEventListener('resize',()=>{if(screen==='exp')setTimeout(layoutExp,120)});
