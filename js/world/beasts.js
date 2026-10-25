/* ===== BESTIE VELESII: zachowania i mechaniki bossów =====
   Dane bestii i krain: js/data/enemies.js. Powiązane mechaniki: strzyga – cheatDeath (js/battle/battle.js),
   regeneracja leszego/borowego – startTick i specjalne ruchy (MAI) – enemyAct (js/battle/battle-layout.js),
   wygląd rekrutów – makeHero (js/game/state.js). */
GFX.S.poludnicaK=GFX.S.poludnica;if(typeof FACE!=='undefined')FACE.poludnicaK=FACE.poludnica;
function regFix(s){if(!s.reg)return;while(s.reg.lv.length<BIOMES.length){s.reg.lv.push(0);s.reg.done.push(0)}}
/* --- zachowania --- */
const MAI={};
function aiCtx(u){const hs=alive('h'),rh=hs.filter(h=>canReach(u,h,'atak')),R=rh.length?rh:hs;
 return {hs,rh:R,allies:alive('e').filter(e=>e!==u),tgt:()=>{const tz=R.filter(h=>h.st.taunt>0);if(tz.length)return pick(tz);return Math.random()<.5?lowest(R):pick(R)},
  sp:(m,cd)=>{log(`${u.name}: ${m}`,'r');u.cd.sp=cd||4;flt(u,m.replace(/!$/,''),'info')}}}
const burning=u=>u.st.bleed&&u.st.bleed.ic==='🔥';
function weaken(t,n){t.st.weak=Math.max(t.st.weak||0,n||2);flt(t,'Osłabienie','info');updUnit(t)}
MAI.charge=async(u,c)=>{if(Math.random()<.5){c.sp('Szarża!',3);const t=c.tgt();await anim(u,[t],'melee');shake(true);if(hit(u,t,1.5)>0&&Math.random()<.35)stun(t);return 1}};
MAI.roots=async(u,c)=>{if(Math.random()<.45){c.sp('Oplatające korzenie!',3);const t=c.tgt();await anim(u,[t],'web');if(hit(u,t,.9,'web')>0)stun(t);return 1}};
MAI.bies=async(u,c)=>{c.sp(Math.random()<.5?'Czarci figiel!':'Urok!',3);const t=c.tgt();await anim(u,[t],'melee');if(hit(u,t,1)>0){const g=Math.min(S.gold,5+S.stage*2);if(g>0&&Math.random()<.6){S.gold-=g;u.stolen=(u.stolen||0)+g;flt(t,`-${g} zł`,'info');log(`😈 ${u.name} kradnie ${g} zł!`,'r')}else weaken(t,2)}return 1};
MAI.hex=async(u,c)=>{if(c.allies.length<3&&Math.random()<.35&&summon(u,'nietoperz')){u.cd.sp=3;setF(u,'cast',600);flt(u,'Przybądźcie, dzieci nocy!','info');await sleep(500);return 1}
 c.sp('Klątwa pieczęci!',3);await anim(u,c.hs,'dark');c.hs.forEach(t=>{if(hit(u,t,.55,'dark')>0&&t.alive&&Math.random()<.4)weaken(t,2)});return 1};
MAI.enrage=async(u,c)=>{if(!u.rage&&u.hp<u.maxHp*.5){u.rage=1;u.atk=Math.round(u.atk*1.35);log(`🐺 ${u.name} wpada w szał!`,'r');flt(u,'SZAŁ','info');ring(u,'#ff3a2a');updUnit(u)}
 if(u.rage&&Math.random()<.55){c.sp('Szał – dwa ciosy!',2);const t=c.tgt();await anim(u,[t],'melee');hit(u,t,.8);await sleep(200);if(t.alive){await anim(u,[t],'melee');if(hit(u,t,.8)>0&&t.alive)bleed(u,t,3,u.atk*.3)}return 1}};
MAI.alfa=async(u,c)=>{const w=c.allies.filter(a=>a.key==='wilk').length;if(w<2&&summon(u,'wilk')){u.cd.sp=3;setF(u,'cast',600);flt(u,'AUUUU!','info');log(`🐺 ${u.name} wyje – przybiega wilk!`,'r');await sleep(500);return 1}
 return MAI.enrage(u,c)};
MAI.drown=async(u,c)=>{if(Math.random()<.45){c.sp('Wciąga pod wodę!',4);const t=c.tgt();await anim(u,[t],'melee');if(hit(u,t,.9,'ice')>0&&t.alive){stun(t);bleed(u,t,2,u.atk*.3,'🧪')}return 1}};
MAI.utopS=async(u,c)=>{const n=c.allies.filter(a=>a.key==='utopiec').length;if(n<2&&Math.random()<.5&&summon(u,'utopiec')){u.cd.sp=3;setF(u,'cast',600);flt(u,'Wstańcie z mułu!','info');await sleep(500);return 1}
 c.sp('Lodowata fala!',2);await anim(u,c.hs,'ice');shake(true);c.hs.forEach(t=>hit(u,t,.75,'ice'));return 1};
MAI.leszy=async(u,c)=>{const w=c.allies.filter(a=>a.key==='wilk').length;if(w<2&&Math.random()<.5&&summon(u,'wilk')){u.cd.sp=3;setF(u,'cast',600);flt(u,'Puszcza wzywa!','info');await sleep(500);return 1}
 if(Math.random()<.5){c.sp('Korzenie puszczy!',3);await anim(u,c.hs,'web');c.hs.forEach(t=>{if(hit(u,t,.6,'web')>0&&t.alive&&Math.random()<.3)stun(t)});return 1}};
MAI.charm=async(u,c)=>{if(Math.random()<.5){c.sp('Pieśń rusałki!',3);const t=c.tgt();await anim(u,[t],'magic');if(t.alive){stun(t);flt(t,'Oczarowany','info');heal(u,Math.round(u.maxHp*.15))}return 1}
 const t=c.tgt();await anim(u,[t],'magic');hit(u,t,1.05,'ice');return 1};
MAI.noon=async(u,c)=>{c.sp('Żar południa!',3);await anim(u,c.hs,'fire');c.hs.forEach(t=>{if(hit(u,t,.5,'fire')>0&&t.alive&&Math.random()<.35)weaken(t,2)});return 1};
MAI.noonK=async(u,c)=>{const n=c.allies.filter(a=>a.key==='poludnica').length;if(n<1&&summon(u,'poludnica')){u.cd.sp=3;setF(u,'cast',600);flt(u,'Siostry, do żniw!','info');await sleep(500);return 1}
 c.sp('Słońce w zenicie!',2);await anim(u,c.hs,'fire');shake(true);c.hs.forEach(t=>{if(hit(u,t,.7,'fire')>0&&t.alive){if(Math.random()<.35)bleed(u,t,2,u.atk*.25,'🔥');if(Math.random()<.3)weaken(t,2)}});return 1};
MAI.gaze=async(u,c)=>{if(Math.random()<.45){c.sp('Spojrzenie bazyliszka!',4);const t=c.tgt();await anim(u,[t],'magic');if(t.alive){stun(t);t.st.sunder=2;flt(t,'Skamieniały','info');updUnit(t)}return 1}
 const t=c.tgt();await anim(u,[t],'poison');if(hit(u,t,1)>0&&t.alive&&Math.random()<.5)bleed(u,t,3,u.atk*.35,'🧪');return 1};
MAI.zmij=async(u,c)=>{const ph=u.hp>u.maxHp*.6?1:u.hp>u.maxHp*.3?2:3;
 if(ph>=2&&!u.flown){u.flown=1;log(`🐉 ${u.name} wzbija się w powietrze!`,'r');flt(u,'Lot!','info');u.st.evade=1;updUnit(u)}
 if(ph===3&&!u.rage){u.rage=1;u.atk=Math.round(u.atk*1.3);log(`🐉 ${u.name} wpada we wściekłość!`,'r');ring(u,'#ff6a2a')}
 if(ph>=2&&!(u.cd.br>0)){u.cd.br=2;c.sp('Ognisty oddech!',1);await anim(u,c.hs,'fire');shake(true);c.hs.forEach(t=>{if(hit(u,t,.75,'fire')>0&&t.alive&&Math.random()<.45)bleed(u,t,2,u.atk*.25,'🔥')});return 1}
 if(Math.random()<.5){c.sp('Cios ogonem!',2);const ts=c.rh.slice().sort(()=>Math.random()-.5).slice(0,2);await anim(u,ts,'melee');shake(true);ts.forEach(t=>hit(u,t,.85));return 1}};
MAI.jaga=async(u,c)=>{
 if(!u.fly2&&u.hp<u.maxHp*.5){u.fly2=1;log('🧹 Baba Jaga wzlatuje w moździerzu!','r');flt(u,'Moździerz!','info');ring(u,'#b46cff');u.x.dodge=.3;updUnit(u)}
 u.hut=(u.hut||0)+1;if(u.hut%3===1&&c.allies.length<3&&summon(u,pick(u.fly2?['strzyga','bies']:['nietoperz','bies','wilk']))){u.cd.sp=2;setF(u,'cast',600);flt(u,'Chatko, obróć się!','info');log('🏚️ Chata na kurzej stopce wypuszcza sługę!','r');await sleep(500);return 1}
 if(u.fly2&&Math.random()<.55){c.sp('Tłuczek z nieba!',2);await anim(u,c.hs,'dark');shake(true);c.hs.forEach(t=>{if(hit(u,t,.6,'dark')>0&&t.alive&&Math.random()<.35)weaken(t,2)});return 1}
 if(Math.random()<.5){c.sp('Klątwa starej wiedźmy!',2);const t=c.tgt();await anim(u,[t],'dark');const d=hit(u,t,1.2,'dark');if(d>0){weaken(t,3);setTimeout(()=>heal(u,Math.round(d*.4)),T(250))}return 1}};
