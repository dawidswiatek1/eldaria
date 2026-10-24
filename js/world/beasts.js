/* ===== BESTIE VELESII: nowe potwory (sprite'y gracza), zachowania i mechaniki bossów ===== */
Object.assign(ENEMIES,{
 dzik:{dt:'obuch',res:{ciete:15,trucizna:15,ogien:-20},name:'Dzik',hp:60,atk:12,def:4,spd:6,sp:'charge',d:'Szarżuje na oślep – potężny cios, może ogłuszyć.'},
 borowy:{dt:'obuch',nb:1,res:{trucizna:50,klute:25,ogien:-45},name:'Borowy',hp:118,atk:13,def:6,spd:3,sp:'roots',d:'Leśny duch. Oplata korzeniami (ogłusza) i powoli się odradza. Boi się ognia.'},
 bies:{dt:'klute',res:{ogien:50,mrok:30,swiete:-40},name:'Bies',hp:70,atk:13,def:3,spd:9,sp:'bies',d:'Złośliwy czort z widłami. Kradnie złoto i rzuca uroki osłabienia.'},
 szeptun:{res:{mrok:50,swiete:-35,ogien:-10},name:'Mroczny szeptun',hp:64,atk:13,def:2,spd:7,sp:'hex',fx:'dark',d:'Kultysta starych pieczęci. Klątwa na całą drużynę, przyzywa nietoperze.'},
 wilkolak:{dt:'ciete',res:{ciete:20,klute:20,swiete:-30,ogien:-20},name:'Wilkołak',hp:96,atk:15,def:4,spd:8,sp:'enrage',d:'Ranny wpada w szał: mocniejsze i podwójne ataki, krwawienie.'},
 wilkolakA:{dt:'ciete',res:{ciete:25,klute:25,swiete:-30,ogien:-20},name:'Wilkołak Alfa',hp:300,atk:17,def:6,spd:8,sp:'alfa',boss:true,d:'Przywódca watahy. Wyciem wzywa wilki, w szale tnie dwa razy.'},
 utopiec:{dt:'ciete',res:{lod:50,trucizna:30,ogien:-40},name:'Utopiec',hp:72,atk:12,def:3,spd:5,sp:'drown',d:'Wciąga pod wodę: ogłusza i dusi przez kilka tur. Odporny na lód, boi się ognia.'},
 utopiecS:{dt:'lod',res:{lod:75,trucizna:40,ogien:-35},name:'Utopiec Starszy',hp:340,atk:17,def:6,spd:4,sp:'utopS',boss:true,d:'Pan rozlewisk. Przyzywa utopce, fala lodowatej wody uderza w całą drużynę.'},
 leszy:{dt:'obuch',nb:1,res:{trucizna:60,klute:30,ogien:-50},name:'Leszy',hp:350,atk:17,def:7,spd:4,sp:'leszy',boss:true,d:'Pan puszczy. Regeneruje się, dopóki nie płonie. Wzywa wilki i oplata korzeniami.'},
 rusalka:{res:{lod:50,ogien:-30,mrok:20},name:'Rusałka',hp:60,atk:12,def:2,spd:8,sp:'charm',fx:'magic',d:'Śpiewem czaruje (bohater traci turę) i topi. Czerpie z tego siły.'},
 poludnica:{dt:'ciete',res:{ogien:60,swiete:20,mrok:-35,lod:-15},name:'Południca',hp:92,atk:14,def:3,spd:7,sp:'noon',d:'Zjawa z pól o południu. Żar i obłęd: obrażenia od ognia i osłabienie całej drużyny. Słaba na mrok.'},
 poludnicaK:{dt:'ciete',res:{ogien:70,swiete:20,mrok:-35,lod:-15},name:'Królowa Południc',hp:310,atk:17,def:5,spd:7,sp:'noonK',boss:true,d:'Gdy słońce w zenicie, jej żar pali wszystkich. Przyzywa południce.'},
 strzyga:{dt:'ciete',res:{mrok:40,trucizna:50,ogien:-40,swiete:-50},name:'Strzyga',hp:80,atk:14,def:3,spd:9,sp:'drain',fly:1,d:'Wysysa krew. Powstaje z martwych, chyba że dobije się ją ogniem lub świętością.'},
 bazyliszek:{dt:'trucizna',res:{trucizna:75,klute:20,lod:-30},name:'Bazyliszek',hp:86,atk:13,def:5,spd:6,sp:'gaze',d:'Spojrzenie zamienia w kamień (ogłuszenie i −50% obrony). Jadowite ukąszenie.'},
 zmij:{dt:'ciete',res:{ogien:75,trucizna:30,lod:-35},name:'Żmij',hp:390,atk:19,def:8,spd:6,sp:'zmij',boss:true,fly:0,d:'Smok z Wielkiego Grzbietu. Trzy fazy: kły i ogon, lot z ognistym oddechem, wściekłość.'},
 babajaga:{res:{mrok:40,trucizna:40,ogien:-25,swiete:-25},name:'Baba Jaga',hp:370,atk:17,def:5,spd:7,sp:'jaga',fx:'dark',boss:true,d:'Chata na kurzej stopce przyzywa sługi. Ranna Jaga wzlatuje w moździerzu: nieuchwytna, ciska klątwy.'}});
BEASTS.push('dzik','wilkolak','wilkolakA','bazyliszek','zmij');
GFX.S.poludnicaK=GFX.S.poludnica;if(typeof FACE!=='undefined')FACE.poludnicaK=FACE.poludnica;
/* krainy: stare z nowymi bestiami + nowe miejsca Velesii (sr = poziom trudności) */
BIOMES[0].pool=[[1,'goblin'],[1,'wilk'],[1,'szlam'],[1,'dzik'],[2,'pajak'],[3,'szaman'],[3,'borowy']];BIOMES[0].boss='leszy';
BIOMES[1].pool.push([2,'bies']);
BIOMES[2].pool.push([2,'strzyga'],[3,'szeptun']);
BIOMES[3].pool.push([1,'wilkolak'],[2,'bazyliszek']);
BIOMES[4].pool.push([0,'bazyliszek'],[0,'wilkolak']);BIOMES[4].boss='zmij';
BIOMES.push(
 {k:'bagno',n:'Bagno Czarne',sr:2,pool:[[0,'utopiec'],[0,'szlam'],[0,'nietoperz'],[1,'rusalka'],[2,'bazyliszek']],boss:'utopiecS'},
 {k:'pola',n:'Pola Południcy',sr:1,pool:[[0,'dzik'],[0,'goblin'],[0,'wilk'],[1,'poludnica'],[2,'bies']],boss:'poludnicaK'},
 {k:'chata',n:'Chata na kurzej stopce',sr:3,pool:[[0,'bies'],[0,'nietoperz'],[0,'strzyga'],[1,'szeptun'],[2,'wilkolak']],boss:'babajaga'},
 {k:'las',n:'Wilcze Jary',sr:2,pool:[[0,'wilk'],[0,'dzik'],[1,'wilkolak'],[2,'borowy']],boss:'wilkolakA'});
expStage=(r,L)=>(BIOMES[r]&&BIOMES[r].sr!=null?BIOMES[r].sr:r)*5+Math.min(L,4);
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
const _enemyAct=enemyAct;enemyAct=async function(u){const f=MAI[u.sp];if(f&&!(u.cd.sp>0)&&alive('h').length){try{if(await tryExecute(u))return;const c=aiCtx(u);if(await f(u,c))return}catch(e){console.warn(e)}}if(u.cd.br>0&&u.sp==='zmij')u.cd.br--;return _enemyAct(u)};
/* regeneracja: leszy i borowy (nie gdy płoną) */
const _startTick=startTick;startTick=function(u){_startTick(u);if(!u.alive)return;
 if((u.sp==='leszy'||u.sp==='roots')&&u.hp<u.maxHp){if(burning(u)){if(!u._bm){u._bm=1;log(`🔥 ${u.name} płonie – nie może się odradzać!`,'g')}}else{heal(u,Math.round(u.maxHp*(u.sp==='leszy'?.06:.04)))}updUnit(u)}};
/* strzyga powstaje, jeśli nie dobito jej ogniem lub świętością */
const _cheat=cheatDeath;cheatDeath=function(t){if(t.side==='e'&&t.key==='strzyga'&&!t.rose){const dt=(B.curFx&&FX2DT[B.curFx])||B.curDt||'';if(dt!=='ogien'&&dt!=='swiete'&&!burning(t)){t.rose=1;t.hp=Math.round(t.maxHp*.4);log(`🧛 ${t.name} powstaje z martwych! (dobij ogniem lub świętością)`,'r');setTimeout(()=>{if(B&&t.alive){flt(t,'Powstaje!','info');ring(t,'#b46cff')}},T(300));return true}}return _cheat(t)};
/* wygląd rekrutów: łuczniczki, strażnicy grodu, rycerze Velesii */
const _mkHero=makeHero;makeHero=function(cls,g){const h=_mkHero(cls,g);const fem=h.g==='k';
 if(cls==='lucznik'&&fem&&Math.random()<.5)h.skin='luczniczka';else if(cls==='wojownik'&&!fem&&Math.random()<.3)h.skin='straznik';else if(cls==='paladyn'&&!fem&&Math.random()<.35)h.skin='rycerz';return h};
