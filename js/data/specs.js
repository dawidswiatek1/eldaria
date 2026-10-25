/* ===== SPECJALIZACJE (od 10. poziomu) =====
   Każda klasa ma dwie ścieżki. Specjalizacja daje:
   e  – premie do cech (jak efekty talentów; liczone w talFx w js/game/state.js),
   sk – własną umiejętność (wpis w SK w js/data/skills.js, z polem spec:1),
   p  – cechę pasywną (haki spec* niżej, wołane z walki: js/battle/battle.js, battle-layout.js).
   Wybór: zakładka Talenty (specHtml w js/ui/camp.js), reset razem z talentami w Świątyni. Zapis: h.spec.
   n/nk – nazwa dla bohatera / bohaterki, b – opis premii, d – krótki opis ścieżki. */
const SPEC_LVL=10;
const SPEC={
 mistrz:{c:'wojownik',n:'Mistrz miecza',nk:'Mistrzyni miecza',sk:'taniec',e:{crit:5,atkP:.05},b:'+5% kryt. · +5% ATK',d:'Szermierka doprowadzona do mistrzostwa.',
  p:'Riposta: gdy wróg trafi Cię wręcz, 30% szansy na kontratak (70%).'},
 straznik:{c:'wojownik',n:'Strażnik',nk:'Strażniczka',sk:'mur',e:{hpP:.1,def:2},b:'+10% PŻ · +2 OBR',d:'Żywa tarcza kompanii.',
  p:'Raz na rundę przyjmujesz cios wymierzony w sojusznika, który ma mniej niż 40% PŻ.'},
 snajper:{c:'lucznik',n:'Snajper',nk:'Snajperka',sk:'serce',e:{critM:.2},b:'+20% siły krytyków',d:'Jeden strzał, jeden trup.',
  p:'Pierwszy strzał w każdego wroga jest zawsze krytyczny.'},
 lowca:{c:'lucznik',n:'Łowca bestii',nk:'Łowczyni bestii',sk:'sidla',e:{atkP:.05},b:'+5% ATK',d:'Tropi potwory i zastawia na nie sidła.',
  p:'+25% obrażeń przeciw bestiom i bossom.'},
 piromanta:{c:'mag',n:'Piromanta',nk:'Piromantka',sk:'slup',e:{dtP:{ogien:.15}},b:'+15% obrażeń od ognia',d:'Wszystko, czego dotknie, płonie.',
  p:'Każde Twoje trafienie podpala cel na 2 tury (chyba że już krwawi, płonie albo jest zatruty).'},
 runmistrz:{c:'mag',n:'Mistrz runów',nk:'Mistrzyni runów',sk:'runy',e:{atkP:.05},b:'+5% ATK',d:'Zaklęcia wyryte w runach odbijają się echem.',
  p:'Echo runów: 25% szansy, że umiejętność ofensywna zadziała drugi raz z połową mocy.'},
 inkwizytor:{c:'kaplan',n:'Inkwizytor',nk:'Inkwizytorka',sk:'stos',e:{dtP:{swiete:.1}},b:'+10% obrażeń od świętości',d:'Ogień i wiara przeciw sługom ciemności.',
  p:'+35% obrażeń przeciw nieumarłym i istotom mroku. Twoje trafienia zdzierają z wrogów tarcze, wzmocnienia i uniki.'},
 cudotworca:{c:'kaplan',n:'Cudotwórca',nk:'Cudotwórczyni',sk:'cud',e:{healP:.15},b:'+15% siły leczenia',d:'Modlitwy, które zostają wysłuchane.',
  p:'Każde Twoje leczenie daje celowi +60% obrony do jego następnej tury.'},
 cien:{c:'lotr',n:'Cień nocy',nk:'Cień nocy',sk:'ostrze',e:{dodge:.08},b:'+8% uniku',d:'Cios pada, zanim ktokolwiek go zobaczy.',
  p:'Zaczynasz walkę w cieniu: pierwszy atak na Ciebie chybia, a cios z cienia jest zawsze krytyczny. Zabicie wroga znów kryje Cię w cieniu.'},
 rabus:{c:'lotr',n:'Szelma',nk:'Szelma',sk:'sztuczka',e:{spd:.5,crit:3},b:'+0,5 SZY · +3% kryt.',d:'Walka bez zasad – i zawsze z zyskiem.',
  p:'Każde Twoje trafienie: 25% szansy na kradzież złota (zabierasz je po wygranej walce).'},
 templariusz:{c:'paladyn',n:'Templariusz',nk:'Templariuszka',sk:'sadboz',e:{hpP:.08,def:1},b:'+8% PŻ · +1 OBR',d:'Zakonny rycerz na czele szyku.',
  p:'Na początku walki cała drużyna: +10% obrony i +15% odporności na mrok.'},
 msciciel:{c:'paladyn',n:'Mściciel',nk:'Mścicielka',sk:'wyrok',e:{atkP:.05},b:'+5% ATK',d:'Żadna krzywda nie zostaje bez odpowiedzi.',
  p:'+15% obrażeń przeciw bossom. Gdy sojusznik padnie: leczysz 25% PŻ i zadajesz +40% obrażeń przez 3 rundy.'},
 panzwierz:{c:'druid',n:'Pan zwierząt',nk:'Pani zwierząt',sk:'wilki',e:{hpP:.08},b:'+8% PŻ',d:'Puszcza staje do walki u Twojego boku.',
  p:'Forma niedźwiedzia trwa o 2 tury dłużej, a ciosy niedźwiedzia leczą Cię o 15% zadanych obrażeń.'},
 szeptucha:{c:'druid',n:'Szeptun',nk:'Szeptucha',sk:'krag',e:{healP:.25},b:'+25% siły leczenia',d:'Zioła, zamawianie chorób i dawne uroki.',
  p:'Na początku walki cała drużyna: +10% odporności na mrok i truciznę.'},
 zniwiarz:{c:'czarnoksieznik',n:'Żniwiarz dusz',nk:'Żniwiarka dusz',sk:'dusze',e:{ls:.03},b:'Leczysz się o 3% zadanych obrażeń',d:'Każda śmierć na polu bitwy dodaje sił.',
  p:'Zabicie wroga: leczysz 15% PŻ i zadajesz +10% obrażeń do końca walki (maks. +30%).'},
 demonolog:{c:'czarnoksieznik',n:'Demonolog',nk:'Demonolożka',sk:'piekl',e:{atkP:.05,res:{ogien:10}},b:'+5% ATK · +10% odp. na ogień',d:'Pakt z piekłem ma swoją cenę.',
  p:'Im mniej masz PŻ, tym mocniej bijesz: do +50% obrażeń.'},
 skald:{c:'bard',n:'Skald',nk:'Skaldka',sk:'wojenna',e:{spd:.3},b:'+0,3 SZY',d:'Pieśń, która prowadzi do boju.',
  p:'Na początku walki cała drużyna: +10% szansy na krytyk. Ballada odwagi trwa o 1 turę dłużej.'},
 iluzjonista:{c:'bard',n:'Iluzjonista',nk:'Iluzjonistka',sk:'zwierciadlo',e:{dodge:.15},b:'+15% uniku',d:'Wróg nigdy nie wie, co jest prawdą.',
  p:'Gdy unikniesz ataku, atakujący zostaje osłabiony (−25% ataku) na 2 tury.'}
};
/* klasa → [dwie specjalizacje] */
const SPECS={};for(const k in SPEC)(SPECS[SPEC[k].c]=SPECS[SPEC[k].c]||[]).push(k);
const specOf=h=>{const s=h&&h.spec&&SPEC[h.spec];return s&&s.c===h.cls&&h.lvl>=SPEC_LVL?s:null};
const specNm=(h,k)=>{const s=SPEC[k||h.spec];return s?(h.g==='k'&&s.nk||s.n):''};
const clsNm=h=>CLASSES[h.cls].name+(specOf(h)?' · '+specNm(h):'');
const specPend=h=>!!(h.lvl>=SPEC_LVL&&!specOf(h)&&SPECS[h.cls]);
/* bohater ma coś do rozdania: punkty cech, talentów albo wybór specjalizacji (znaczek na przyciskach) */
const devPend=h=>!!(h.free||tFree(h)||specPend(h));
/* umiejętności klasy + umiejętność specjalizacji */
const poolOf=h=>(POOL[h.cls]||[]).concat(specOf(h)?[specOf(h).sk]:[]);
const specOfSk=k=>Object.keys(SPEC).find(x=>SPEC[x].sk===k);
/* ikona umiejętności: umiejętności specjalizacji używają ikon z pola ico i mają złotą poświatę (.spk) */
const skIc=(k,s,c)=>{const x=SK[k];return ic(x&&x.ico||'sk_'+k,s,(c||'')+(x&&x.spec?' spk':''))};

/* ===== haki walki ===== */
const UNDEAD=['szkielet','ghul','upior','strzyga','utopiec','utopiecS','nekromanta'];
const darkFoe=t=>UNDEAD.includes(t.key)||!!(t.res&&t.res.mrok>0);
function addRes(a,k,v){a.res=Object.assign({},a.res);a.res[k]=Math.min(RES_CAP,(a.res[k]||0)+v)}
/* początek walki (startFx) */
function specStart(){const hs=B.units.filter(u=>u.side==='h'),L=t=>B.log.push({t,c:'g'});
 hs.forEach(u=>{const s=u.spec;
  if(s==='cien')u.st.hid=1;
  else if(s==='templariusz'){hs.forEach(a=>{a.def=Math.round(a.def*1.1);addRes(a,'mrok',15)});L(`⚜️ ${u.name} prowadzi szyk: drużyna +10% obrony i +15% odporności na mrok.`)}
  else if(s==='szeptucha'){hs.forEach(a=>{addRes(a,'mrok',10);addRes(a,'trucizna',10)});L(`🌿 ${u.name} zamawia uroki: drużyna +10% odporności na mrok i truciznę.`)}
  else if(s==='skald'){hs.forEach(a=>a.crit+=.1);L(`🎶 ${u.name} intonuje pieśń: drużyna +10% szansy na krytyk.`)}})}
/* strażnik przejmuje cios wymierzony w słabego sojusznika (raz na rundę) */
function specGuard(u,t){if(!B||u.side!=='e'||t.side!=='h'||t.hp>=t.maxHp*.4)return t;
 const g=B.units.find(x=>x.side==='h'&&x.alive&&x!==t&&x.spec==='straznik'&&x._gr!==B.round&&x.hp>x.maxHp*.3);if(!g)return t;
 g._gr=B.round;flt(g,'Osłania!','info');ring(g,'#c8d8ff');log(`🛡 ${g.name} przyjmuje cios za: ${t.name}!`,'g');return g}
/* cień nocy: pierwszy atak na ukrytego chybia */
function specMiss(u,t){if(!t.st.hid)return false;delete t.st.hid;flt(t,'W cieniu!','miss');log(`${t.name} wymyka się z cienia – ${u.name} chybia.`);updUnit(t);return true}
/* po uniku (iluzjonista osłabia atakującego); zwraca 0 jak chybiony hit() */
function specDodged(t,u){if(t.spec==='iluzjonista'&&u&&u.alive&&u!==t){addSt(u,'weak',2);flt(u,'Złudzenie','info');log(`👁️ ${u.name} daje się zwieść złudzeniu (${t.name}).`,'g')}return 0}
/* dodatkowa szansa na krytyk: cios z cienia, pierwszy strzał snajpera */
function specCrit(u,t){if(u.side!=='h')return 0;if(u.st.hid){delete u.st.hid;updUnit(u);return 1}
 if(u.spec==='snajper'&&t.side==='e'){const m=t._sn||(t._sn={});if(!m[u.uid]){m[u.uid]=1;return 1}}return 0}
/* mnożnik obrażeń bohatera */
function specAm(u,t){const s=u.spec;if(!s||t.side!=='e')return 1;
 if(s==='lowca')return t.claw||t.boss?1.25:1;
 if(s==='inkwizytor')return darkFoe(t)?1.35:1;
 if(s==='msciciel')return (t.boss?1.15:1)*(u._zem>=B.round?1.4:1);
 if(s==='demonolog')return 1+.5*(1-rat(u));
 if(s==='zniwiarz')return 1+(u._zn||0);
 return 1}
/* po trafieniu (d > 0): podpalenie, oczyszczenie, kradzież, leczenie niedźwiedzia, riposta */
function specAfter(u,t,d){const s=u.spec;
 if(u.side==='h'&&s){
  if(s==='piromanta'){if(t.alive&&!t.st.bleed&&resOf(t,'ogien')<100)bleed(u,t,2,u.atk*.25,'🔥')}
  else if(s==='inkwizytor'){const k=t.alive?['shield','rally','evade'].filter(x=>t.st[x]>0):[];if(k.length){k.forEach(x=>{delete t.st[x];delete t.st[x+'V']});flt(t,'Oczyszczony','info');updUnit(t)}}
  else if(s==='rabus'){if(!t.obj&&Math.random()<.25){const g=Math.round(3+(B.st||1)*1.5);B.rab=(B.rab||0)+g;flt(t,'+'+g+' zł','gold');log(`💰 ${u.name} kradnie ${g} złota (${t.name}).`,'g')}}
  else if(s==='panzwierz'){if(u.st.bear>0&&u.alive)healQ(u,Math.round(d*.15))}}
 if(t.side==='h'&&t.spec==='mistrz'&&t.alive&&u.alive&&!u.obj&&u.fx==='melee'&&!B._rip&&Math.random()<.3){
  const o=[B.curDt,B.curFx];B._rip=1;B.curDt=t.dt;B.curFx='melee';flt(t,'Riposta!','info');log(`⚔ ${t.name} odpowiada ripostą!`,'g');
  try{hit(t,u,.7)}finally{B._rip=0;B.curDt=o[0];B.curFx=o[1]}}}
/* bohater zabija wroga */
function specKill(u,t){if(!u||u.side!=='h'||!u.alive||t.obj)return;
 if(u.spec==='zniwiarz'){u._zn=Math.min(.3,(u._zn||0)+.1);healQ(u,Math.round(u.maxHp*.15));flt(u,'Dusza!','info')}
 else if(u.spec==='cien'&&!u.st.hid){u.st.hid=1;flt(u,'W cień','info');updUnit(u)}}
/* sojusznik pada: mściciel */
function specDown(t){if(!B)return;B.units.filter(m=>m.side==='h'&&m.alive&&m!==t&&m.spec==='msciciel').forEach(m=>{m._zem=B.round+2;healQ(m,Math.round(m.maxHp*.25));flt(m,'Zemsta!','info');ring(m,'#ff6a4a');log(`⚔ ${m.name} poprzysięga zemstę za: ${t.name}!`,'y');updUnit(m)})}
/* leczenie: cudotwórca daje osłonę do następnej tury celu */
function specHeal(u,t){if(u&&u.spec==='cudotworca'&&t.alive&&t.side==='h')addSt(t,'shield',1)}
/* mistrz runów: echo umiejętności ofensywnej (po sk.run w doAction) */
function specEcho(u,k,tt,tg){if(u.spec!=='runmistrz'||k==='atak'||!B.cur||!isOff(u,k)||!alive('e').length||Math.random()>=.25)return;
 let t2=tg;if(tt==='allEnemies')t2=reachable(u,k,'e');else if(!tg||!tg.alive)t2=reachable(u,k,'e').sort((a,b)=>a.hp-b.hp)[0];
 if(!t2||(Array.isArray(t2)&&!t2.length))return;B.cur.p*=.5;glow(center(u,.3),'#c58aff',64);flt(u,'Echo runów!','info');log(`🔯 Echo runów (${u.name}): ${SK[k].name} raz jeszcze!`,'y');SK[k].run(u,t2)}
