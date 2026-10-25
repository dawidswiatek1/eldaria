/* ===== UKŁAD WALKI: formacja 2 (przód) + 3 (tył) po każdej stronie ===== */
const DPR=()=>Math.max(1,Math.min(6,(window.devicePixelRatio||1)*UIZ));
const qsc=v=>Math.max(1,Math.round(v*DPR()))/DPR();/* skala w całych pikselach urządzenia = ostre piksele */
const panelRes=()=>LH()<360?78:LH()<460?86:96;
const frontAlive=side=>B.units.some(x=>x.side===side&&x.alive&&x.row==='f');
function canReach(u,t,k){if(!t||!u||t.side===u.side)return true;if(t.row!=='b'||t.obj)return true;return reachOf(u,k)!=='m'||!frontAlive(t.side)}
const reachable=(u,k,side)=>alive(side).filter(t=>canReach(u,t,k));
function slotX(side,i){const L=B.lay,off=L.c0+L.w*(i+.5)+(i>=2?L.rg:0);return side==='h'?L.mid-off:L.mid+off}
function slotPos(i,side,u){const L=B.lay,z=u.A,s=u._s||L.sc,iw=z.cw*s,ih=z.ch*s;let cx=slotX(side,i);if(u.boss)cx=(slotX(side,0)+slotX(side,1))/2;
 const bw=Math.round(Math.max(Math.min(iw,u.boss?L.w*2.4:L.w*1.35),L.w-2));const y=i>=2?L.yB:L.yF;
 return `left:${Math.round(cx-bw/2)}px;top:${Math.round(y-ih)}px;width:${bw}px;z-index:${u.boss?2:i>=2?2:3}`}
function placeUnit(u){const el=uel(u);if(!el||u.slot==null)return;const m=/left:([-\d]+)px;top:([-\d]+)px;width:(\d+)px;z-index:(\d+)/.exec(slotPos(u.slot,u.side,u));if(!m)return;el.style.left=m[1]+'px';el.style.top=m[2]+'px';el.style.width=m[3]+'px';el.style.zIndex=m[4]}
let PANEL_H=0;
function buildBattle(){const bio=B.bio||biomeOf(S.stage);
 document.getElementById('app').innerHTML=`<div class="bt"><div id="scene" class="scene bg-${bio.k}">${sceneLayers(bio.k)}<div class="rowmark h"></div><div class="rowmark e"></div></div><div class="btop"><span class="pill" id="bt-title"></span><div class="order" id="order"></div><button class="btn-small" data-act="logt" id="b-log" aria-label="Dziennik walki">${ic('map',16)}<span class="lbl">Dziennik</span></button><button class="btn-small" data-act="auto" id="b-auto"></button><button class="btn-small" data-act="speed" id="b-speed"></button></div><div id="bossbar" class="bossbar" hidden></div><div class="log${SET.logOpen?' open':''}" id="log" data-act="logt">${B.log.map(l=>`<div class="${l.c||''}">${esc(l.t)}</div>`).join('')}</div><div id="panel"></div></div>`;
 const scene=document.getElementById('scene'),W=scene.clientWidth,H=scene.clientHeight,top=LH()<360?40:46;
 const SW=Math.min(W,Math.round(H*2.5)),ox=Math.round((W-SW)/2),half=SW/2,c0=Math.max(12,Math.round(half*.05)),w=(half-c0-6)/5.3,rg=Math.round(w*.3);
 const sc=qsc(Math.min(3,H*.28/HM.ch,w*1.1/HM.cw)),ih=HM.ch*sc,yF=H-panelRes()-26,yB=yF-Math.max(8,Math.round(ih*.1));
 B.lay={W,H,SW,ox,mid:ox+half,half,c0,w,rg,sc,yF,yB};
 B.units.forEach(u=>{const cw=u.A.cw;/* v19: jedna gęstość pikseli dla wszystkich – bossowie są duzi natywnie; zmniejszamy tylko, gdy naprawdę się nie mieszczą */if(u.boss){const room=yF-top-14;u._s=Math.min(sc,qsc(Math.min(room/u.A.ch,w*2.6/cw)))}else{u._s=cw*sc>w*1.9?Math.max(qsc(sc*.6),qsc(w*1.9/cw)):sc}});
 /* znaczniki rzędów na ziemi */
 const rm=(side,cls)=>{const a=slotX(side,1),b=slotX(side,0),x0=Math.min(a,b)-w/2,x1=Math.max(a,b)+w/2;return `left:${Math.round(x0)}px;width:${Math.round(x1-x0)}px;top:${yF-6}px`};
 scene.querySelector('.rowmark.h').style.cssText=rm('h');scene.querySelector('.rowmark.e').style.cssText=rm('e');
 let html='';B.units.forEach(u=>{if(u.slot==null)return;html+=unitHtml(u,slotPos(u.slot,u.side,u),u._s)});
 scene.insertAdjacentHTML('beforeend',html);B.units.forEach(u=>{if(!u.alive){const el=uel(u),s=el&&el.querySelector('.spr');if(s)s.dataset.f=6}});refreshBattle()}
function fitPanel(){}
let _rzT=null;addEventListener('resize',()=>{clearTimeout(_rzT);_rzT=setTimeout(()=>{if(screen==='battle'&&B&&document.getElementById('scene'))buildBattle()},250)});
function unitInfo(u){if(!B)return;B.paused=true;const e=u.side==='e'?ENEMIES[u.key]:null,h=u.hero;const r=u.res||{},wk=Object.keys(DT).filter(k=>r[k]<0),rs=Object.keys(DT).filter(k=>r[k]>0);
 const st=stsHtml(u);
 modal(`<div class="uinfo"><div class="uimg ${u.side}">${animBox(u.A,u.A.ch>60?1.5:2,'',`margin:auto`)}</div><div style="flex:1;min-width:0"><div class="nm">${esc(u.name)}${u.boss?` <span class="badge">BOSS</span>`:''}</div><div class="sub">${e?esc(e.d):CLASSES[u.cls].name+' · poziom '+h.lvl}</div>
 <div class="bar ${u.hp/u.maxHp<.35?'low':''}" style="margin-top:4px"><i style="width:${u.hp/u.maxHp*100}%"></i></div><div class="stats" style="margin-top:4px"><span class="st">${ic('hp',14)}${u.hp}/${u.maxHp}</span><span class="st">${ic('atk',14)}${Math.round(eAtk(u))}</span><span class="st">${ic('def',14)}${Math.round(eDef(u))}</span><span class="st">${ic('spd',14)}${u.spd}</span></div></div></div>
 <div class="resrow"><span class="sub">Pozycja:</span><span class="rs">${u.row==='f'?'1. rząd':'2. rząd'}</span><span class="sub">Atak:</span>${reachChip(reachOf(u,'atak'))}</div><div class="resrow"><span class="sub">Zadaje:</span>${dtChip(u.dt)}${u.nb?'<span class="sub">· nie krwawi</span>':''}</div>
 <div class="resrow"><span class="sub">Słabości:</span>${wk.length?wk.map(k=>resChip(k,r[k])).join(''):'<span class="sub">brak</span>'}</div>
 <div class="resrow"><span class="sub">Odporności:</span>${rs.length?rs.map(k=>resChip(k,r[k])).join(''):'<span class="sub">brak</span>'}</div>
 ${u.boss&&BOSS[u.key]?`<div class="note bossn">${ic('boss',14)} ${BOSS[u.key].tip?BOSS[u.key].tip(u):''}${BOSS[u.key].big?`<br><b>${BOSS[u.key].big.n}</b>: ${BOSS[u.key].big.d}. Zapowiada go turę wcześniej – przerwiesz go obrażeniami (${Math.round(CHG_NEED*100)}% PŻ) albo ogłuszeniem.`:''}</div>`:''}
 ${st?`<div class="resrow"><span class="sub">Efekty:</span><span class="sts inl">${st}</span></div>`:''}
 <div class="sub" style="margin-top:6px">Słabość: obrażenia większe o podany %. Odporność: mniejsze.</div><button style="width:100%;margin-top:8px" data-act="close">Wróć do walki</button>`)}
function fitScale(u){const L=B.lay,cw=u.A.cw;return cw*L.sc>L.w*1.45?Math.max(qsc(L.sc*.6),qsc(L.w*1.45/cw)):L.sc}
function summon(by,key){const occ=i=>B.units.some(u=>u.side==='e'&&u.alive&&(u.slot===i||(u.boss&&i<2)));const i=[2,3,4,0,1].find(j=>!occ(j));if(i==null)return false;
 B.units.filter(u=>u.side==='e'&&!u.alive&&u.slot===i).forEach(u=>{const o=uel(u);if(o)o.remove();u.slot=null});
 B.nextE=(B.nextE||10)+1;const e=makeEnemy(key,B.st||S.stage,'e'+B.nextE,' (wezwany)',.7);e.name=ENEMIES[key].name;e.slot=i;e.row=i<2?'f':'b';e._s=fitScale(e);B.units.push(e);
 document.getElementById('scene').insertAdjacentHTML('beforeend',unitHtml(e,slotPos(i,'e',e),e._s,' summon'));updUnit(e);
 const p=center(e,.6);vfx('smokeD',p,2.6,{dur:560});particles(p,10,FXC.dark,{up:30,d:.8,glow:1});log(`✨ ${by.name} przyzywa: ${e.name}!`,'r');return true}
function swapUnits(u,t){const a=u.slot;u.slot=t.slot;t.slot=a;[u,t].forEach(x=>{x.row=x.slot<2?'f':'b';placeUnit(x)});
 if(S&&Array.isArray(S.slots)){const ia=S.slots.indexOf(u.hero.id),ib=S.slots.indexOf(t.hero.id);if(ia>=0&&ib>=0){S.slots[ia]=t.hero.id;S.slots[ib]=u.hero.id}}
 log(`⇄ ${u.name} i ${t.name} zamieniają się miejscami.`,'y');flt(u,'⇄','info')}
function refreshBattle(){if(!B)return;const a=B.active;const t=document.getElementById('bt-title');if(!t)return;
 t.innerHTML=`${ic(B.units.some(x=>x.boss)?'boss':'map',18)} ${esc(B.lbl||'')} · R${B.round}`;document.getElementById('b-auto').innerHTML=SET.auto?`${ic('pause',16)} Auto`:`${ic('auto',16)} Auto`;document.getElementById('b-speed').innerHTML=`${ic('speed',16)} ×${SET.speed}`;
 document.getElementById('order').innerHTML=(B.order||[]).filter(u=>u.alive).map(u=>`<img class="px ${u.side}${u===a?' act':''}" src="${u.img}" alt="">`).join('');
 bossBar();B.units.forEach(u=>{const el=uel(u);if(!el)return;el.classList.toggle('active',u===a);el.classList.toggle('target',isTarget(u));el.classList.toggle('noreach',!!noReach(u));updUnit(u)});
 let panel='';
 if(B.awaiting&&a){const s=SK[B.sel],tt=tOf(a,B.sel);const need=B.sel==='zamiana'?'Wybierz sojusznika':tt==='enemy'?'Dotknij wroga':tt==='ally'?'Dotknij sojusznika':tt==='deadAlly'?'Dotknij poległego':'';
  const blocked=isOff(a,B.sel)&&reachOf(a,B.sel)==='m'&&frontAlive('e')&&alive('e').some(e=>e.row==='b');
  panel=`<div class="hint"><b class="who">${esc(a.name)}${a.row==='f'?' (1. rząd)':' (2. rząd)'}:</b> <b>${s.name}</b> ${isOff(a,B.sel)?reachChip(reachOf(a,B.sel))+' ':''}${s.dt?dtChip(s.dt==='wep'?a.dt:s.dt)+' ':''}${blocked?`<b class="blkh">${ic('lock',12)} Najpierw pokonaj pierwszy rząd</b> `:''}<span class="ds">${s.desc}</span></div><div class="pbar"><div class="skills n${a.skills.length}">${a.skills.map(k=>{const sk=SK[k],cd=a.cd[k]||0,no=SK[k].t==='deadAlly'&&!deadAllies().length;return `<button data-act="skill" data-k="${k}" class="${B.sel===k?'sel':''}" ${cd>0||no?'disabled':''} aria-label="${sk.name}">${skIc(k,28,'si')}<span class="sn${sk.name.split(" ").some(w=>w.length>11)?" ln":""}">${sk.name}</span>${cd>0?`<span class="cd">${cd>=90?'1×':cd}</span>`:''}</button>`}).join('')}<button data-act="skill" data-k="zamiana" class="swp ${B.sel==='zamiana'?'sel':''}" aria-label="Zamień miejsce" ${alive('h').length<2?'disabled':''}>${ic('reroll',22,'si')}<span class="sn">Zamień</span></button>${B.exp?`<button data-act="bag" data-b="1" class="swp bagb" aria-label="Torba" ${bagB()&&B.itemT!==B.turnId?'':'disabled'}>${ic('bag',22,'si')}<span class="sn">Torba</span>${bagB()?`<span class="cd">${bagB()}</span>`:''}</button>`:''}</div>${need?`<div class="need">▶ ${need}</div>`:`<button class="btn-main use" data-act="use">✔ Użyj</button>`}</div>`}
 else panel=`<div class="hint wait">${a?`<b class="who">${esc(a.name)}</b> działa… `:''}${SET.auto?'Tryb automatyczny.':'Czekaj na swoją turę.'} <span class="ds">${lpTxt()}: odporności i słabości.</span></div>`;
 document.getElementById('panel').innerHTML=panel;fitPanel()}
function wipe(lbl,sub){const w=document.createElement('div');w.id='wipe';w.innerHTML=`<div class="bars">${Array.from({length:8},(_,i)=>`<i style="top:${i*12.5}%;transform-origin:${i%2?'right':'left'}"></i>`).join('')}</div><div class="lbl"><b>${lbl}</b><span>${sub}</span></div>`;document.body.appendChild(w);setTimeout(()=>w.remove(),T(950))}
const isMeleeE=e=>reachOf(e,'atak')==='m';
function placeEnemies(es){const boss=es.find(e=>e.boss);let rest=es.filter(e=>e!==boss);rest=rest.filter(isMeleeE).concat(rest.filter(e=>!isMeleeE(e)));
 const out=[];if(boss){boss.slot=0;boss.row='f';out.push(boss);rest.slice(0,3).forEach((e,i)=>{e.slot=2+i;e.row='b';out.push(e)})}else rest.slice(0,5).forEach((e,i)=>{e.slot=i;e.row=i<2?'f':'b';out.push(e)});return out}
function startBattle(cfg){cfg=cfg||{};syncForm();const party=S.slots.map((id,i)=>({h:id!=null?getHero(id):null,i})).filter(x=>x.h&&x.h.hp>0);if(!party.length){toast('Brak zdolnych do walki bohaterów!');return}
 const st=cfg.st||S.stage,bio=cfg.bio||biomeOf(st);
 B={round:0,units:[],log:[],sel:'atak',active:null,awaiting:false,resolve:null,over:false,order:[],st,bio,lbl:cfg.lbl||('Etap '+st),exp:!!cfg.exp,elite:!!cfg.elite};
 party.forEach(({h,i})=>{const u=unitFromHero(h);u.slot=i;u.row=i<2?'f':'b';B.units.push(u)});if(cfg.exp&&S.exp&&S.exp.fx)B.units.forEach(u=>buffUnit(u,S.exp.fx));placeEnemies(cfg.list?cfg.list.map((k,i,l)=>makeEnemy(k,cfg.est||st,'e'+i,l.filter(x=>x===k).length>1?' '+'ABCDE'[l.slice(0,i+1).filter(x=>x===k).length-1]:'')):genEnemies(st)).forEach(e=>B.units.push(e));bossSetup();
 const boss=B.units.find(u=>u.side==='e'&&u.boss);
 B.log.push({t:`⚔️ ${B.lbl} (${bio.n}): ${alive('e').map(e=>e.name).join(', ')}`,c:'y'});
 startFx();wipe(boss?'BOSS: '+esc(boss.name):cfg.wl||B.lbl,esc(bio.n));
 setTimeout(()=>{screen='battle';applySpeed();_view='battle';buildBattle();setTimeout(battleLoop,T(450))},T(300))}
function startFx(){const hs=B.units.filter(u=>u.side==='h'),es=B.units.filter(u=>u.side==='e'),L=t=>B.log.push({t,c:'g'});
 hs.forEach(u=>{
  if(RK(u,'woj_sztandar')){hs.forEach(a=>{a.st.rally=Math.max(a.st.rally||0,3);a.st.rallyV=Math.max(a.st.rallyV||0,.3)});L(`🚩 Sztandar (${u.name}): drużyna +30% ataku.`)}
  if(RK(u,'mag_lodowa')){u.st.shield=Math.max(u.st.shield||0,4)}
  if(RK(u,'pal_mur')){u.st.taunt=3;u.st.shield=Math.max(u.st.shield||0,3);L(`🛡 ${u.name} staje na czele (Bastion).`)}
  if(RK(u,'dru_wieczny')){hs.forEach(a=>a.st.regen={t:3,v:Math.round(a.maxHp*.05)});L(`🌳 Wieczny las (${u.name}): drużyna się regeneruje.`)}
  if(RK(u,'bar_cisza')){es.forEach(e=>e.st.weak=Math.max(e.st.weak||0,3));L(`🎻 Pieśń rozpaczy (${u.name}) osłabia wrogów.`)}
  if(RK(u,'bar_inspir')){hs.forEach(a=>{a.st.haste=Math.max(a.st.haste||0,3);a.st.hasteV=Math.max(a.st.hasteV||0,2)});L(`🎺 Uwertura (${u.name}): drużyna +2 SZY.`)}
  if(RK(u,'kap_aura')){hs.forEach(a=>a.resAll=(a.resAll||0)+10);L(`✨ Aura ochronna (${u.name}): +10% odporności.`)}});
 /* cechy specjalizacji (js/data/specs.js) */
 specStart()}
function startTick(u){for(const k in u.cd)if(u.cd[k]>0)u.cd[k]--;const s=u.st;
 ['taunt','shield','evade','sunder','rally','weak','curse','haste','bear','expose'].forEach(k=>{if(s[k]>0){s[k]--;if(!s[k]){delete s[k];delete s[k+'V'];if(k==='curse')delete s.curseSrc}}});
 if(s.regen){const g=s.regen;healQ(u,g.v);g.t--;if(g.t<=0)delete s.regen}
 if(s.bleed){const b=s.bleed;log(`${b.ic} ${u.name} traci ${b.dmg} PŻ.`,u.side==='h'?'r':'');const p=center(u,.5);particles(p,6,b.ic==='🔥'?FXC.fire:b.ic==='🧪'?FXC.poison:b.ic==='🌑'?FXC.dark:['#ff4a3a','#a01a1a'],{up:b.ic==='🩸'?0:24,r0:4,r1:18,d:.6});dmg(u,b.dmg,'dmg',(b.ic==='🩸'?'krwawienie':b.ic==='🔥'?'ogień':b.ic==='🌑'?'gnicie':'trucizna')+' ('+b.by+')');b.t--;if(b.t<=0)delete s.bleed}
 /* regeneracja bossów (troll, golem, leszy…): bossTick w js/battle/bosses.js */
 if(u.alive&&u.boss)bossTick(u);updUnit(u);
 /* regeneracja borowego (nie gdy płonie) */
 if(!u.alive)return;
 if(u.sp==='roots'&&u.hp<u.maxHp){if(burning(u)){if(!u._bm){u._bm=1;log(`🔥 ${u.name} płonie – nie może się odradzać!`,'g')}}else{heal(u,Math.round(u.maxHp*.04))}updUnit(u)}}
async function battleLoop(){
 while(!B.over){B.round++;if(B.round===26)log('😫 Wyczerpanie! Od teraz wszyscy zadają coraz większe obrażenia.','r');B.order=B.units.filter(u=>u.alive&&!u.obj).sort((a,b)=>spdOf(b)-spdOf(a)||Math.random()-.5);
  for(const u of B.order){while(B&&B.paused&&!B.over)await new Promise(r=>setTimeout(r,120));if(!B||B.over)return;if(!u.alive)continue;if(checkEnd())return;
   B.active=u;B.awaiting=false;refreshBattle();startTick(u);
   if(!u.alive){await sleep(600);if(checkEnd())return;continue}
   if(u.st.stun>0){delete u.st.stun;log(`💫 ${u.name} jest ${gf(u,'ogłuszony','ogłuszona')} i traci turę.`,'y');vfx('spark',center(u,.1),2);updUnit(u);await sleep(700);continue}
   if(u.side==='h')await heroTurn(u);else{await sleep(380);await enemyAct(u)}
   refreshBattle();await sleep(560);if(checkEnd())return}}}
function checkEnd(){if(B.over)return true;if(!alive('e').length||!alive('h').length){B.over=true;B.active=null;B.awaiting=false;refreshBattle();setTimeout(finishBattle,T(1000));return true}return false}
function heroTurn(u){return new Promise(res=>{B.turnId=(B.turnId||0)+1;B.resolve=res;B.sel='atak';B.awaiting=true;refreshBattle();if(SET.auto)autoAct(u)})}
async function autoAct(u){await sleep(300);if(!B||!B.awaiting||B.active!==u||!SET.auto)return;const [k,t]=heroAI(u);doAction(u,k,t)}
async function doAction(u,k,target){const sk=SK[k];if(!B.awaiting||(u.cd[k]||0)>0)return;const tt=tOf(u,k);
 if(k==='zamiana'){if(!target||target===u||target.side!=='h'||!target.alive)return;B.awaiting=false;refreshBattle();swapUnits(u,target);await sleep(450);const r=B.resolve;B.resolve=null;r&&r();return}
 if(tt==='enemy'&&target&&!canReach(u,target,k)){const alt=reachable(u,k,'e');if(!alt.length)return;target=alt.sort((a,b)=>a.hp-b.hp)[0]}
 B.curReach=isOff(u,k)?reachOf(u,k):null;
 const tg=tt==='allEnemies'?reachable(u,k,'e'):tt==='allAllies'?alive('h'):tt==='self'?u:target;
 if(tt==='deadAlly'&&(!tg||tg.alive||tg.revived))return;if((tt==='enemy'||tt==='ally')&&(!tg||!tg.alive))return;
 B.awaiting=false;refreshBattle();if(k!=='atak')log(`${sk.icon} ${u.name}: ${sk.name}`,'y');
 const fx=k==='atak'?(u.st.bear>0?'melee':u.fx):sk.fx;await anim(u,Array.isArray(tg)?tg:[tg],fx);B.curFx=fx;B.curDt=!sk.dt||sk.dt==='wep'?u.dt:sk.dt;B.cur={u,k,p:PW(u,k),cb:sk.cb||0};
 try{sk.run(u,tg);specEcho(u,k,tt,tg)}catch(e){console.warn(e)}B.cur=null;B.curFx=null;B.curDt=null;B.curReach=null;if(tt==='self'||fx==='buff'){ring(u,'#ffe36a');vfx('holy',center(u,.4),1.6)}
 if(sk.cd)u.cd[k]=u.cd[k]===-1?0:cdOf(u,k)+1;const r=B.resolve;B.resolve=null;r&&r()}
function heroAI(u){const ready=k=>u.skills.includes(k)&&!(u.cd[k]>0);const al=alive('h'),fo=alive('e');if(!fo.length)return['atak',null];
 /* cel: boss w trakcie zapowiedzi (przerwij!), potem elementy bossa (korzenie, kryształy…), potem najsłabszy */
 const C=k=>{const f=reachable(u,k,'e'),F=f.length?f:fo,bc=F.find(e=>e.boss&&e.chg),ob=F.filter(e=>e.obj).sort((a,b)=>a.hp-b.hp);return {al,fo:F,low:lowest(al),weak:bc||ob[0]||F.slice().sort((a,b)=>a.hp-b.hp)[0],dead:deadAllies(),boss:fo.some(e=>e.boss)}};
 const c0=C('atak');let best=['atak',c0.weak],bs=12;
 for(const k of u.skills){if(k==='atak'||!ready(k))continue;const sk=SK[k],tt=tOf(u,k),c=C(k);if(tt==='deadAlly'&&!c.dead.length)continue;let r=null;
  try{r=sk.ai?sk.ai(u,c):tt==='enemy'?[38+(sk.pw||1)*9,c.weak]:tt==='allEnemies'?aiAoe(u,c,44):null}catch(e){r=null}
  if(r&&r[0]>bs){bs=r[0];best=[k,r[1]]}}
 const tt=tOf(u,best[0]),cb=C(best[0]);if(tt==='enemy'&&(!best[1]||!best[1].alive||!canReach(u,best[1],best[0])))best[1]=cb.weak;if(tt==='ally'&&(!best[1]||!best[1].alive))best[1]=cb.low;return best}
async function enemyAct(u){if(u.obj)return;
 /* bossowie: zapowiadane ciosy i fazy (js/battle/bosses.js) */
 if(u.boss&&BOSS[u.key]&&alive('h').length){try{if(await bossAct(u))return}catch(e){console.warn(e)}}
 /* bestie Velesii: własne zachowania (MAI w js/world/beasts.js) */
 {const ai=MAI[u.sp];if(ai&&!(u.cd.sp>0)&&alive('h').length){try{if(await tryExecute(u))return;const c=aiCtx(u);if(await ai(u,c))return}catch(e){console.warn(e)}}}
 const hs=alive('h');if(!hs.length)return;if(await tryExecute(u))return;const ready=!(u.cd.sp>0);const rh=hs.filter(h=>canReach(u,h,'atak'));
 const target=()=>{const tz=rh.filter(h=>h.st.taunt>0);if(tz.length)return pick(tz);if(Math.random()<.5)return lowest(rh);return pick(rh)};
 const two=()=>{const tz=rh.filter(h=>h.st.taunt>0);if(tz.length)return [tz[0]];return rh.slice().sort(()=>Math.random()-.5).slice(0,2)};
 const sp=(m,cd)=>{log(`${u.name}: ${m}`,'r');u.cd.sp=cd||4;flt(u,m.replace(/!$/,''),'info')};
 const allies=alive('e').filter(e=>e!==u&&!e.obj);
 if(ready){switch(u.sp){
  case 'heal':{const w=lowest(alive('e').filter(e=>e.hp/e.maxHp<.6));if(w){sp('leczy sojusznika!');await anim(u,[w],'heal');heal(w,Math.round(w.maxHp*.3));return}break}
  case 'smash':case 'golem':if(Math.random()<.6){sp('Miażdżący cios!');const t=target();await anim(u,[t],'melee');shake(true);hit(u,t,1.8);return}break;
  case 'troll':if(Math.random()<.45){sp('Miażdżący cios!');const t=target();await anim(u,[t],'melee');shake(true);hit(u,t,1.6);return}break;
  case 'fire':{sp('Ognisty oddech!');await anim(u,hs,'fire');shake(true);hs.forEach(t=>{if(hit(u,t,.7,'fire')>0&&t.alive&&Math.random()<.4)bleed(u,t,2,u.atk*.25,'🔥')});return}
  case 'stun':if(Math.random()<.5){sp('Oplata siecią!');const t=target();await anim(u,[t],'web');if(hit(u,t,.8,'web')>0)stun(t);return}break;
  case 'stunhit':if(Math.random()<.45){sp('Cios pałką w głowę!');const t=target();await anim(u,[t],'melee');if(hit(u,t,1.1)>0&&Math.random()<.6)stun(t);return}break;
  case 'steal':if(Math.random()<.55){sp('Kradzież!',3);const t=target();await anim(u,[t],'melee');if(hit(u,t,.9)>0){const g=Math.min(S.gold,6+S.stage*3);if(g>0){S.gold-=g;u.stolen=(u.stolen||0)+g;flt(u,'+'+g+' zł','gold');log(`💰 ${u.name} kradnie ${g} złota! Pokonaj go, by je odzyskać.`,'r')}if(t.alive&&Math.random()<.4)bleed(u,t,2,u.atk*.3)}return}break;
  case 'volley':{sp('Salwa strzał!',3);const ts=two();await anim(u,ts,'arrow');ts.forEach(t=>{if(hit(u,t,.75,'arrow')>0&&t.alive&&Math.random()<.3)bleed(u,t,2,u.atk*.3)});return}
  case 'drain':{sp('Wysysa życie!',3);const t=target();await anim(u,[t],u.fx==='dark'?'dark':'melee');const d=hit(u,t,1.05,u.fx==='dark'?'dark':'melee');if(d>0){const v=Math.round(d*.6);setTimeout(()=>heal(u,v),T(250))}return}
  case 'acid':{sp('Plucie kwasem!',3);const t=target();await anim(u,[t],'poison');if(hit(u,t,.8,'poison')>0&&t.alive){t.st.sunder=3;flt(t,'Pancerz −50%','info');updUnit(t)}return}
  case 'poison':if(Math.random()<.5){sp('Gnijące pazury!',3);const t=target();await anim(u,[t],'melee');if(hit(u,t,1)>0&&t.alive)bleed(u,t,3,u.atk*.4,'🧪');return}break;
  case 'rally':if(allies.length&&!allies.some(a=>a.st.rally>0)){sp('Mroczne błogosławieństwo!',4);await anim(u,allies,'buff');allies.concat([u]).forEach(a=>{a.st.rally=2;ring(a,'#ff6a5a');updUnit(a)});return}break;
  case 'multi':{sp('Pikowanie!',3);const ts=two();setF(u,'wind');await sleep(160);setF(u,'strike',400);await moveMv(u,-30,10,150,260);ts.forEach((t,i)=>setTimeout(()=>{if(B&&!B.over)hit(u,t,.85)},T(i*120)));await sleep(260);return}
  case 'guard':if(!(u.st.shield>0)){u.st.shield=2;log(`${u.name} unosi gardę!`,'r');ring(u,'#b46cff');flt(u,'Garda','info');updUnit(u);u.cd.sp=4}break;
  case 'herszt':{const minions=allies.length;if(minions<3&&!u.noSum&&summon(u,pick(['bandyta','rzezimieszek','lucznikB']))){u.cd.sp=3;setF(u,'cast',600);flt(u,'Do mnie, chłopcy!','info');await sleep(500);return}
   if(!u.st.rally&&minions){sp('Okrzyk bojowy!',3);await anim(u,allies,'buff');alive('e').forEach(a=>{a.st.rally=2;ring(a,'#ff6a5a');updUnit(a)});return}
   sp('Potężne cięcie!',2);const t=target();await anim(u,[t],'melee');shake(true);hit(u,t,1.4);return}
  case 'necro':{const sk=allies.filter(a=>a.key==='szkielet').length;if(sk<2&&summon(u,'szkielet')){u.cd.sp=3;setF(u,'cast',600);await sleep(500);return}
   sp('Pocisk śmierci!',2);const t=target();await anim(u,[t],'dark');const d=hit(u,t,1.25,'dark');if(d>0)setTimeout(()=>heal(u,Math.round(d*.5)),T(250));return}
 }}
 const t=target();await anim(u,[t],u.fx);const d=hit(u,t,1);if(u.sp==='bleed'&&d>0&&t.alive&&Math.random()<.4){bleed(u,t,3,u.atk*.35);log(`🩸 ${t.name} krwawi!`,'r')}}

function finishBattle(){if(B.exp)return finishExpBattle();const win=alive('e').length===0&&alive('h').length>0;const lines=[],lv=[],loot=[];
 const F=battleFates(win),fallen=F.fallen;S.roster.forEach(h=>{if(h.hq){h.hosp=Math.max(h.hosp||0,h.hq);h.hq=0}h.dd=0});
 const stolen=B.units.reduce((a,u)=>a+(u.stolen||0),0);
 let title,bossName='';
 if(win){const boss=S.stage%5===0;const bu=B.units.find(u=>u.boss);bossName=bu?ENEMIES[bu.key].name:'';const gold=30+S.stage*15+(boss?120:0),xp=25+S.stage*10;S.gold+=gold+stolen+(B.rab||0);S.wins++;title=boss?`${bossName} ${gf({name:bossName},'pokonany','pokonana')}!`:'Zwycięstwo!';
  lines.push(`${ic('gold',18)} +${gold} złota`+(stolen?` (+${stolen} odzyskane)`:'')+(B.rab?` (+${B.rab} skradzione)`:''),`${ic('xp',18)} +${xp} PD dla ocalałych`);
  B.units.filter(u=>u.side==='h'&&u.alive).forEach(u=>{const h=u.hero,l0=h.lvl;h.hp=Math.min(stats(h).maxHp,h.hp+Math.round(stats(h).maxHp*.2));const msgs=gainXp(h,xp);if(h.lvl>l0)lv.push({h,msgs})});
  const luck=Math.min(.3,S.stage*.02)+(boss?.15:0);
  if(boss){loot.push(makeItem(S.stage+1,rollRar(luck,1)),makeItem(S.stage+1,rollRar(luck,1)))}if(bu){const tr=bossTrophy();if(tr)loot.push(tr)}else{if(Math.random()<.6)loot.push(makeItem(S.stage,rollRar(luck)));if(S.stage>3&&Math.random()<.25)loot.push(makeItem(S.stage,rollRar(luck)))}
  S.stage++;genOffers();genShop()}
 else{title='Porażka…';if(stolen)lines.push(`${ic('gold',18)} Złodzieje uciekli z ${stolen} złota.`)}
 const over=S.roster.length===0;const reached=over?S.stage:S.stage-1;
 if(reached>best())try{localStorage.setItem(BEST_KEY,String(reached))}catch(e){}
 if(over){const st=S.stage,w=S.wins,f=S.fallen.length;localStorage.removeItem(SAVE_KEY);S=null;
  modal(`<div class="banner"><h1>Koniec gry</h1></div><div class="res"><p>Cała kompania poległa.</p><p>Dotarłeś do etapu <b>${st}</b>, wygrane walki: <b>${w}</b>, polegli bohaterowie: <b>${f}</b>.</p></div><button class="btn-main" data-act="gameover">Spróbuj ponownie</button>`);return}
 let i=0;const dl=()=>`style="animation-delay:${(0.35+(i++)*0.22).toFixed(2)}s"`;
 let html=`<div class="banner">${win?'<div class="rays"></div>':''}<h1>${win?ic(S.stage-1>0&&(S.stage-1)%5===0?'boss':'xp',26)+' ':''}${esc(title)}</h1></div><div class="res">${lines.map(l=>`<p ${dl()}>${l}</p>`).join('')}`;
 lv.forEach(({h,msgs})=>{const nl=msgs.filter(m=>m.startsWith('⭐')).length;html+=`<div class="lvcard" ${dl()}>${bust(heroSprite(h),h.cls,44,1.5)}<div><b>${esc(h.name)}</b><br>${ic('lvl',14)} Poziom ${h.lvl}! <small>+${3*nl} pkt cech, +${nl} pkt talentu</small>${msgs.filter(m=>!m.startsWith('⭐')).map(m=>`<br><small>${esc(m)}</small>`).join('')}</div></div>`});
 loot.forEach(it=>{if(S.inv.length<INV_MAX||it.uq){S.inv.push(it);html+=`<div class="loot r${it.r}" style="--rc:${rcol(it)};animation-delay:${(0.35+(i++)*0.3).toFixed(2)}s"><div class="ii">${itIc(it,28)}</div><div><b style="color:${rcol(it)};text-shadow:1px 1px 0 #000">${esc(it.n)}</b><br><small>${RAR[it.r].n} · ${statStr(it.st)}</small></div></div>`}else{S.gold+=sellPrice(it);html+=`<p ${dl()}>${ic('bag',16)} Plecak pełny – ${esc(it.n)} sprzedany za ${sellPrice(it)} zł</p>`}});
 if(win)html+=`<p ${dl()}>${ic('sk_leczenie',16)} Ocaleni odzyskują 20% PŻ.</p><p ${dl()}>${ic('tavern',16)}${ic('smith',16)} Nowi ochotnicy w karczmie i nowy towar u kowala.</p>`;
 if(!win)html+=`<p ${dl()}>Ocaleni wycofują się do obozu. Etap pozostaje ten sam.</p>`;
 html+=fateHtml(F,dl);
 save();modal(html+`</div><button class="btn-main" data-act="tocamp">${ic('nav_town',22)} Do obozu</button>`)}
