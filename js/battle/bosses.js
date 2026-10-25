/* ===== BOSSOWIE: zapowiadane ciosy, fazy, elementy do zniszczenia, trofea =====
   BOSS[klucz bossa]:
     big  – wielki cios: boss zapowiada go turę wcześniej (u.chg), a drużyna może go przerwać, zadając
            CHG_NEED jego PŻ obrażeń albo ogłuszając go (bossowie są odporni na ogłuszenie – poza zapowiedzią).
            Przerwany boss jest „odsłonięty” (+25% obrażeń, st.expose). mark – cios w oznaczonego bohatera.
     el   – elementy do zniszczenia (ENEMIES z obj:1, rysunki: js/data/sprites-boss.js); elDie – gdy padną.
     ph   – fazy (próg PŻ, nazwa, efekt), regen – leczenie na początku tury, taken – mnożnik otrzymywanych obrażeń,
     tip  – czytelna podpowiedź w pasku bossa, tro – trofeum za pierwsze zwycięstwo (S.bk).
   Między wielkimi ciosami boss walczy po staremu (MAI w js/world/beasts.js, enemyAct w js/battle/battle-layout.js).
   Wywołania: bossSetup (startBattle), bossAct (enemyAct), bossTick (startTick), bossDmg i bossDown (dmg),
   bossTaken (hit), bossInterrupt (stun), bossBar (refreshBattle, updUnit), bossTrophy (koniec walki). */
const CHG_NEED=.12;
const objs=()=>alive('e').filter(e=>e.obj);
const objN=k=>objs().filter(e=>e.key===k).length;
const bossU=()=>B&&B.units.find(u=>u.side==='e'&&u.boss&&BOSS[u.key]);
const markT=c=>c&&c.tgt&&c.tgt.alive?c.tgt:lowest(alive('h'));
/* prowokacja chroni oznaczonego: cios trafia w prowokującego */
function taunted(t){const tz=alive('h').filter(h=>h.st.taunt>0);if(t&&tz.length&&!tz.includes(t)){const n=pick(tz);log(`🛡 ${n.name} przyjmuje cios za: ${t.name}!`,'g');return n}return t}
async function bigAoe(u,mult,fx,on){const hs=alive('h');if(!hs.length)return;await anim(u,hs,fx);shake(true);hs.forEach(t=>{if(hit(u,t,mult,fx)>0&&t.alive&&on)on(t)})}
const BOSS={
 leszy:{el:{k:'korzen',n:2},
  big:{n:'Gniew Puszczy',d:'cała drużyna, może ogłuszyć',cd:3,ann:'wbija dłonie w ziemię – puszcza drży…',run:async u=>bigAoe(u,.9,'web',t=>{if(Math.random()<.4)stun(t)})},
  ph:[{at:.5,n:'Puszcza się budzi',run:u=>{let n=0;while(n<2&&objN('korzen')<2&&summon(u,'korzen'))n++;if(n)log('🌳 Z ziemi wyrastają nowe święte korzenie!','r')}}],
  regen:u=>burning(u)?0:.02+.04*objN('korzen'),
  tip:u=>{const n=objN('korzen');return burning(u)?'Leszy płonie – nie może się leczyć.':n?`Święte korzenie (${n}) leczą Leszego o ${Math.round((.02+.04*n)*100)}% PŻ co turę – zetnij je albo podpal go.`:'Bez korzeni Leszy leczy się słabo (2%). Ogień zatrzyma to zupełnie.'},
  elDie:(u,t)=>log(`🪓 ${t.name} usycha – Leszy słabnie!`,'g'),
  tro:{b:'amulet',n:'Wieniec Leszego',res:{trucizna:20,mrok:10},d:'Trofeum: pan Mrocznej Puszczy.'}},
 herszt:{el:{k:'sztandar',n:1},
  setup:u=>{if(objN('sztandar'))B.eAtkP=.25},
  big:{n:'Egzekucja',d:'potężny cios w oznaczonego bohatera',cd:3,mark:1,ann:'wskazuje ofiarę toporem…',run:async(u,c)=>{const t=taunted(markT(c));if(!t)return;await anim(u,[t],'melee');shake(true);hit(u,t,2.4)}},
  ph:[{at:.4,n:'Ostatnia stawka',run:u=>{u.atk=Math.round(u.atk*1.3);log(`🗡️ ${u.name} rzuca wszystko na jedną kartę (+30% ataku)!`,'r')}}],
  tip:u=>objN('sztandar')?'Sztandar zbójów: banda +25% ataku i posiłki – powal go!':'Sztandar leży – zbóje osłabieni, posiłków nie będzie.',
  elDie:(u,t)=>{B.eAtkP=0;u.noSum=1;alive('e').filter(e=>!e.obj).forEach(e=>{e.st.weak=Math.max(e.st.weak||0,2);updUnit(e)});log('🚩 Sztandar pada! Zbóje tracą ducha.','g')},
  tro:{b:'kaptur',n:'Przepaska Herszta',res:{klute:15,ciete:10},d:'Trofeum: herszt z Traktu Bandytów.'}},
 nekromanta:{el:{k:'urna',n:1},
  taken:(u,t)=>objN('urna')?.5:1,
  big:{n:'Żniwo dusz',d:'pochłania szkielety: cios w całą drużynę i leczenie',cd:3,ann:'unosi kostur – szkielety drżą…',
   run:async u=>{const sk=alive('e').filter(e=>e.key==='szkielet');sk.forEach(s=>{s.alive=false;s.hp=0;log(`💀 ${s.name} rozsypuje się w proch.`,'r');die(s)});const n=sk.length;
    await bigAoe(u,.5+.35*n,'dark',t=>{if(n&&Math.random()<.4)weaken(t,2)});if(n)setTimeout(()=>{if(B&&u.alive)heal(u,Math.round(u.maxHp*.08*n))},T(300))}},
  bigTip:u=>{const n=alive('e').filter(e=>e.key==='szkielet').length;return n?`zabij szkielety (${n}), zanim je pochłonie`:''},
  ph:[{at:.5,n:'Nieumarły gniew',run:u=>{let n=0;while(n<2&&summon(u,'szkielet'))n++}}],
  tip:u=>objN('urna')?'Urna dusz: nekromanta otrzymuje o połowę mniej obrażeń – rozbij ją (święte i obuch działają najlepiej).':'Urna rozbita – nekromanta stracił barierę dusz.',
  elDie:(u,t)=>log('⚱️ Urna pęka – bariera dusz znika!','g'),
  tro:{b:'pierscien',n:'Pierścień Nekromanty',res:{mrok:25},d:'Trofeum: nekromanta z Kurhanów Przodków.'}},
 golem:{el:{k:'krysztal',n:2},
  taken:(u,t)=>objN('krysztal')?.6:u.cracked?1.2:1,
  regen:u=>objN('krysztal')?.05:0,
  big:{n:'Lawina',d:'cała drużyna, pierwszy rząd może zostać ogłuszony',cd:3,ann:'unosi kamienne pięści nad głowę…',run:async u=>bigAoe(u,1,'melee',t=>{if(t.row==='f'&&Math.random()<.35)stun(t)})},
  tip:u=>{const n=objN('krysztal');return n?`Kryształy runiczne (${n}): kamienna skóra (−40% obrażeń) i leczenie 5% co turę – rozbij je (obuch najlepszy).`:'Golem pęknięty – bierze więcej obrażeń i już się nie leczy.'},
  elDie:(u,t)=>{if(!objN('krysztal')&&!u.cracked){u.cracked=1;u.def=Math.round(u.def*.6);ring(u,'#ff9a3a');flt(u,'Pęka!','info');log('💥 Ostatni kryształ pęka – golem traci kamienną skórę!','g');updUnit(u)}else log(`💎 ${t.name} pęka!`,'g')},
  tro:{b:'amulet',n:'Serce Golema',st:{def:4},res:{obuch:20,ciete:10},d:'Trofeum: kamienny golem z Wielkiego Grzbietu.'}},
 zmij:{
  can:u=>!!u.flown,
  taken:(u,t)=>u.flown&&!(u.ground>0)&&B.curReach==='m'?.5:1,
  big:{n:'Ognisty oddech',d:'ogień na całą drużynę, podpala',cd:2,ann:'nabiera powietrza – w paszczy żarzy się ogień…',run:async u=>bigAoe(u,.95,'fire',t=>{if(Math.random()<.5)bleed(u,t,2,u.atk*.25,'🔥')})},
  onInt:u=>{if(u.flown){u.ground=2;log(`🐉 ${u.name} spada na ziemię!`,'g');setTimeout(()=>{if(B&&u.alive)flt(u,'Strącony!','info')},T(400))}},
  ph:[{at:.6,n:'Lot'},{at:.3,n:'Wściekłość'}],
  tip:u=>!u.flown?'Kły i ogon. Pod 60% PŻ wzleci w powietrze i zacznie ziać ogniem.':u.ground>0?'Strącony! Teraz bij czym się da.':'W powietrzu: ciosy wręcz zadają o połowę mniej. Przerwij oddech, a spadnie. Eliksir ognioodporności łagodzi ogień.',
  tro:{b:'kaftan',n:'Łuska Żmija',res:{ogien:30},d:'Trofeum: Żmij ze Smoczej Jamy.'}},
 troll:{
  regen:u=>burning(u)?0:.05,
  big:{n:'Wyrwane drzewo',d:'zamach w pierwszy rząd, może ogłuszyć',cd:3,ann:'wyrywa drzewo z korzeniami…',
   run:async u=>{const f=alive('h').filter(h=>h.row==='f'),ts=f.length?f:alive('h').slice(0,2);if(!ts.length)return;await anim(u,ts,'melee');shake(true);ts.forEach(t=>{if(hit(u,t,1.4)>0&&t.alive&&Math.random()<.4)stun(t)})}},
  tip:u=>burning(u)?'Troll płonie – nie regeneruje się.':'Troll regeneruje 5% PŻ co turę – podpal go (ogień to jego słabość).'},
 utopiecS:{
  big:{n:'Topiel',d:'wciąga oznaczonego bohatera pod wodę',cd:3,mark:1,ann:'wyciąga szpony po ofiarę…',run:async(u,c)=>{const t=taunted(markT(c));if(!t)return;await anim(u,[t],'melee');if(hit(u,t,1.7,'ice')>0&&t.alive){stun(t);bleed(u,t,2,u.atk*.3,'🧪')}}},
  tip:u=>'Wzywa utopce i zalewa drużynę lodowatą falą. Przy Topieli osłoń oznaczonego (prowokacja, tarcza) albo przerwij.',
  tro:{b:'talizman',n:'Perła Topielca',res:{lod:25},d:'Trofeum: Utopiec Starszy z Bagna Czarnego.'}},
 poludnicaK:{
  big:{n:'Zenit',d:'żar na całą drużynę, podpala',cd:3,ann:'unosi sierp ku słońcu – robi się nieznośnie gorąco…',run:async u=>bigAoe(u,1.05,'fire',t=>{if(Math.random()<.45)bleed(u,t,2,u.atk*.25,'🔥')})},
  tip:u=>'Przyzywa południce. Zenit pali całą drużynę – przerwij go albo wypij eliksir ognioodporności.',
  tro:{b:'oko',n:'Oko Południcy',res:{ogien:20},d:'Trofeum: Królowa Południc z Pól.'}},
 babajaga:{
  big:{n:'Klątwa chaty',d:'przeklina całą drużynę (+25% otrzymywanych obrażeń)',cd:3,ann:'mamrocze nad kociołkiem…',
   run:async u=>bigAoe(u,.4,'dark',t=>{t.st.curse=Math.max(t.st.curse||0,3);t.st.curseV=.25;weaken(t,2)})},
  tip:u=>u.fly2?'W moździerzu trudno ją trafić. Klątwa chaty osłabia całą drużynę – przerwij ją.':'Chata wypuszcza sługi co kilka tur. Ranna Jaga wzleci w moździerzu.',
  tro:{b:'kaptur',n:'Chusta Baby Jagi',res:{mrok:25},d:'Trofeum: Baba Jaga z chaty na kurzej stopce.'}},
 wilkolakA:{
  big:{n:'Krwawa pełnia',d:'trzy ciosy w oznaczonego bohatera',cd:3,mark:1,ann:'wyje do księżyca i patrzy na ofiarę…',
   run:async(u,c)=>{const t=taunted(markT(c));for(let i=0;i<3&&t&&t.alive&&u.alive;i++){await anim(u,[t],'melee');if(hit(u,t,.8)>0&&t.alive&&i===2)bleed(u,t,3,u.atk*.3);await sleep(150)}}},
  tip:u=>'Wyciem wzywa wilki, ranny wpada w szał. Przy Krwawej pełni osłoń oznaczonego albo przerwij.',
  tro:{b:'oko',n:'Kieł Alfy',st:{crit:6},res:{ciete:15},d:'Trofeum: Wilkołak Alfa z Wilczych Jarów.'}}};
/* --- początek walki: elementy na tylnych polach (najsłabsi pomocnicy ustępują im miejsca) --- */
function bossSetup(){const u=B.units.find(x=>x.side==='e'&&x.boss&&BOSS[x.key]);B.eAtkP=0;B.mk=null;if(!u)return;const D=BOSS[u.key];u.bc=1;u.phs=0;
 if(D.el){const occ=i=>B.units.some(e=>e.side==='e'&&e.slot===i);let free=[2,3,4].filter(i=>!occ(i));
  for(const i of [4,3,2]){if(free.length>=D.el.n)break;const m=B.units.find(e=>e.side==='e'&&e.slot===i&&!e.boss);if(m){B.units.splice(B.units.indexOf(m),1);free.push(i)}}
  free.sort().slice(0,D.el.n).forEach((i,n)=>{const e=makeEnemy(D.el.k,B.st||S.stage,'o'+n);e.slot=i;e.row='b';B.units.push(e)})}
 if(D.setup)D.setup(u);if(D.tip)B.log.push({t:`⚠️ ${u.name}: ${D.tip(u)}`,c:'y'})}
/* --- tura bossa: fazy, wielki cios albo jego zapowiedź; false = zwykły ruch --- */
async function bossAct(u){const D=BOSS[u.key];if(!D)return false;
 (D.ph||[]).forEach((p,i)=>{if(u.hp<=u.maxHp*p.at&&(u.phs||0)<=i){u.phs=i+1;if(p.run){log(`⚡ ${u.name}: ${p.n}!`,'r');flt(u,p.n,'info');ring(u,'#ff6a2a');p.run(u)}}});
 if(!D.big)return false;
 if(u.chg){const c=u.chg;u.chg=null;B.mk=null;log(`💥 ${u.name}: ${D.big.n}!`,'r');flt(u,D.big.n,'info');bossBar();await D.big.run(u,c);u.bc=D.big.cd;bossBar();return true}
 if((u.bc||0)>0){u.bc--;return false}
 if(D.can&&!D.can(u))return false;
 const c=u.chg={need:Math.max(10,Math.round(u.maxHp*CHG_NEED)),dmg:0};if(D.big.mark){c.tgt=lowest(alive('h'));B.mk=c.tgt}
 log(`⚠️ ${u.name} ${D.big.ann} ${D.big.n} w następnej turze!${c.tgt?' Cel: '+c.tgt.name+'.':''} Przerwij: ${c.need} obrażeń albo ogłuszenie.`,'r');
 flt(u,D.big.n+'!','info');setF(u,'cast',900);ring(u,'#ff4a2a');B.units.forEach(updUnit);bossBar();await sleep(700);return true}
function bossTick(u){const D=BOSS[u.key];if(!D)return;if(u.ground>0)u.ground--;if(!D.regen||u.hp>=u.maxHp)return;const r=D.regen(u);
 if(r>0)heal(u,Math.round(u.maxHp*r));else if(burning(u)&&!u._bm){u._bm=1;log(`🔥 ${u.name} płonie – nie może się odradzać!`,'g')}}
/* obrażenia w czasie zapowiedzi: po CHG_NEED PŻ boss traci wielki cios */
function bossDmg(t,d){if(!t.chg||!t.alive)return;t.chg.dmg+=d;if(t.chg.dmg>=t.chg.need)bossInterrupt(t,'dmg');else bossBar()}
function bossInterrupt(t,how){const D=BOSS[t.key];if(!t.chg||!D)return;t.chg=null;B.mk=null;t.bc=2;t.st.expose=Math.max(t.st.expose||0,2);
 log(`✋ Przerwano: ${D.big.n}${how==='stun'?' (ogłuszenie)':''}! ${t.name} jest ${gf(t,'odsłonięty','odsłonięta')} (+25% obrażeń).`,'g');
 setTimeout(()=>{if(B&&t.alive){flt(t,'Przerwane!','info');vfx('spark',center(t,.1),2.4);ring(t,'#ffd870')}},T(150));if(D.onInt)D.onInt(t);B.units.forEach(updUnit);bossBar()}
const bossTaken=(u,t)=>(t.st.expose>0?1.25:1)*(t.boss&&BOSS[t.key]&&BOSS[t.key].taken?BOSS[t.key].taken(t,u):1);
/* śmierć: element – efekt u bossa; boss – jego elementy rozpadają się razem z nim */
function bossDown(t){const b=bossU();if(t.obj){if(b&&b.alive&&BOSS[b.key].elDie)BOSS[b.key].elDie(b,t)}
 else if(t.boss){B.mk=null;B.eAtkP=0;objs().forEach(e=>{e.alive=false;e.hp=0;log(`${e.name} rozpada się.`,'g');die(e)})}bossBar()}
/* --- pasek bossa: PŻ, fazy, zamiar (zapowiedziany cios) i podpowiedź --- */
function bossBar(){const el=document.getElementById('bossbar');if(!el)return;const u=bossU();if(!u||!u.alive){el.hidden=true;return}const D=BOSS[u.key],phs=D.ph||[];el.hidden=false;
 let h=`<div class="bbh">${ic('boss',14)}<b>${esc(u.name)}</b>${phs.length?`<span class="bph">Faza ${(u.phs||0)+1}/${phs.length+1}${u.phs?' · '+phs[u.phs-1].n:''}</span>`:''}<span class="bhp">${u.hp}/${u.maxHp}</span></div><div class="bbar"><i style="width:${u.hp/u.maxHp*100}%"></i>${phs.map(p=>`<s style="left:${p.at*100}%"></s>`).join('')}</div>`;
 if(u.chg){const c=u.chg,bt=D.bigTip&&D.bigTip(u);h+=`<div class="bint">${ic('skull',12)} <b>${D.big.n}</b> w następnej turze${c.tgt&&c.tgt.alive?` – cel: <b>${esc(c.tgt.name)}</b>`:` – ${D.big.d}`}. Przerwij: <b>${Math.min(c.dmg,c.need)}/${c.need}</b> obrażeń albo ogłusz${bt?'; '+bt:''}!<i class="bprog" style="width:${Math.min(1,c.dmg/c.need)*100}%"></i></div>`}
 else if(D.big&&(!D.can||D.can(u)))h+=`<div class="bnext">${ic('event',12)} <b>${D.big.n}</b>: ${D.big.d} – zapowie go turę wcześniej.</div>`;
 if(D.tip)h+=`<div class="btip">${ic('flag',12)} ${D.tip(u)}</div>`;
 el.innerHTML=h}
/* --- trofeum za pierwsze zwycięstwo nad bossem (legendarny przedmiot z nazwą) --- */
function bossTrophy(){const u=B&&B.units.find(x=>x.side==='e'&&x.boss&&BOSS[x.key]&&BOSS[x.key].tro);if(!u||!S)return null;S.bk=S.bk||{};if(S.bk[u.key])return null;
 const T=BOSS[u.key].tro,it=makeItem(Math.max(2,(B.st||S.stage)+1),3,T.b);it.n=T.n;it.uq=u.key;it.d=T.d;
 if(T.st)for(const k in T.st)it.st[k]=rs(k,(it.st[k]||0)+T.st[k]);if(T.res){it.res=Object.assign({},it.res||{});for(const k in T.res)it.res[k]=(it.res[k]||0)+T.res[k]}
 it.price=Math.round(it.price*1.5);S.bk[u.key]=1;return it}
