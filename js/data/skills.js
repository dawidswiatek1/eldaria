/* ===== UMIEJĘTNOŚCI (pula klas) I DRZEWKA TALENTÓW ===== */
const RK=(x,id)=>(x&&x.tal&&x.tal[id])||0;
const rat=x=>x.hp/x.maxHp;
const curOf=u=>B&&B.cur&&B.cur.u===u?B.cur:null;
function addSt(t,k,n,v){if(!t||!t.alive)return;t.st[k]=Math.max(t.st[k]||0,n);if(v!=null)t.st[k+'V']=Math.max(t.st[k+'V']||0,v);updUnit(t)}
const stunC=(t,ch)=>{if(t&&t.alive&&Math.random()<ch)stun(t)};
const rndFoes=n=>{const f=alive('e');return Array.from({length:n},()=>pick(f)).filter(Boolean)};
/* pomocnicze oceny AI: [wynik, cel] */
const aiHeal=(u,c,lim)=>c.low&&rat(c.low)<(lim||.55)?[60+(1-rat(c.low))*50,c.low]:null;
const aiHealAll=(u,c,n)=>c.al.filter(a=>rat(a)<.65).length>=(n||2)?[78,null]:null;
const aiBuffAll=(u,c,k)=>c.al.some(a=>a.st[k]>0)?null:[54+(c.boss?10:0)+c.fo.length*2,null];
const aiDebuff=(u,c,k,s)=>{const t=c.fo.filter(e=>!(e.st[k]>0)).sort((a,b)=>b.atk*b.hp-a.atk*a.hp)[0];return t?[s||52,t]:null};
const aiCC=(u,c,s)=>{const bc=c.fo.find(e=>e.boss&&e.chg);if(bc)return [(s||50)+40,bc];const t=c.fo.filter(e=>!e.boss&&!(e.st.stun>0)).sort((a,b)=>b.atk-a.atk)[0]||c.weak;return [(s||50)+(t&&!t.boss?6:-12),t]};
const aiAoe=(u,c,b)=>c.fo.length>1?[(b||46)+c.fo.length*6,null]:[28,null];

const SK={
 zamiana:{name:'Zamień miejsce',icon:'⇄',cd:0,t:'ally',desc:'Zamieniasz się miejscem w formacji z sojusznikiem (zużywa turę).',run:()=>{}},
 atak:{dt:'wep',name:'Atak',icon:'⚔️',cd:0,t:'enemy',desc:'Zwykły atak (100% ataku).',run:(u,t)=>{const bear=u.st.bear>0&&RK(u,'dru_pazury');const d=hit(u,t,bear?1.4:1);if(d>0&&bear)bleed(u,t,2,u.atk*.3);if(d>0&&RK(u,'kap_gniew')){const l=lowest(alive('h'));if(l)healBy(u,l,d*.5)}}},
 /* --- Wojownik --- */
 prowokacja:{name:'Prowokacja',icon:'📣',cd:3,t:'self',fx:'buff',desc:'Przez 2 tury wrogowie atakują tylko Ciebie. +60% obrony.',ai:(u,c)=>c.al.length>1&&!(u.st.taunt>0)&&rat(u)>.45?[68,u]:null,
  run:u=>{const r=RK(u,'woj_prowo'),n=r?3:2;addSt(u,'taunt',n);addSt(u,'shield',n);flt(u,'Prowokacja!','info');log(`${u.name} prowokuje wrogów!`,'y');if(r)healBy(u,u,u.maxHp*.1*r)}},
 potezny:{dt:'wep',name:'Potężny cios',icon:'💥',cd:2,t:'enemy',fx:'melee',pw:1.8,desc:'Silny atak (180%).',run:(u,t)=>{if(hit(u,t,1.8)>0&&RK(u,'woj_rozplat'))bleed(u,t,3,u.atk*.4)}},
 uderzenie:{dt:'obuch',name:'Uderzenie tarczą',icon:'🛡️',cd:4,t:'enemy',fx:'melee',desc:'Atak 100% (obuchowy) i ogłuszenie na 1 turę.',ai:(u,c)=>aiCC(u,c,52),run:(u,t)=>{if(hit(u,t,1)>0)stun(t);if(RK(u,'woj_mur'))addSt(u,'shield',2)}},
 wir:{dt:'ciete',name:'Wir ostrzy',icon:'🌀',cd:3,t:'allEnemies',fx:'melee',desc:'Atak 90% we wszystkich wrogów.',run:(u,ts)=>ts.forEach(t=>hit(u,t,.9))},
 okrzyk:{name:'Okrzyk bojowy',icon:'📯',cd:4,t:'allAllies',fx:'buff',desc:'Cała drużyna: +30% ataku na 2 tury.',ai:(u,c)=>aiBuffAll(u,c,'rally'),
  run:(u,ts)=>{const r=RK(u,'woj_okrzyk');ts.forEach(t=>{addSt(t,'rally',2,.3);ring(t,'#ff8a5a');if(r)healBy(u,t,t.maxHp*.05*r)});log(`${u.name} wydaje okrzyk bojowy!`,'y')}},
 rzez:{dt:'wep',name:'Rzeź',icon:'🪓',cd:3,t:'enemy',fx:'melee',pw:2,desc:'Atak 200%. Leczy Cię o 30% zadanych obrażeń.',run:(u,t)=>{const d=hit(u,t,2);if(d>0)healBy(u,u,d*.3)}},
 /* --- Łucznik --- */
 deszcz:{dt:'klute',name:'Deszcz strzał',icon:'🌧️',cd:3,t:'allEnemies',fx:'arrow',desc:'Atak 65% we wszystkich wrogów.',run:(u,ts)=>ts.forEach(t=>hit(u,t,.65))},
 celny:{dt:'klute',name:'Celny strzał',icon:'🎯',cd:2,t:'enemy',fx:'arrow',pw:1.4,desc:'Atak 140% + krwawienie na 3 tury.',run:(u,t)=>{if(hit(u,t,1.4)>0)bleed(u,t,3,u.atk*.4*(1+.5*RK(u,'luc_groty')))}},
 ogluszajacy:{dt:'obuch',name:'Strzał ogłuszający',icon:'💫',cd:4,t:'enemy',fx:'arrow',desc:'Atak 100% i ogłuszenie na 1 turę.',ai:(u,c)=>aiCC(u,c,50),run:(u,t)=>{if(hit(u,t,1)>0)stun(t)}},
 salwa:{dt:'klute',name:'Potrójny strzał',icon:'🏹',cd:3,t:'allEnemies',fx:'arrow',desc:'3 strzały po 70% w losowych wrogów.',ai:(u,c)=>[50+(c.fo.length===1?8:0),null],run:u=>{rndFoes(RK(u,'luc_salwa')?5:3).forEach(t=>hit(u,t,.7))}},
 znak:{dt:'klute',name:'Znak łowcy',icon:'🔻',cd:3,t:'enemy',fx:'arrow',desc:'Atak 80%. Cel przez 3 tury otrzymuje +25% obrażeń.',ai:(u,c)=>aiDebuff(u,c,'curse',53),run:(u,t)=>{if(hit(u,t,.8)>0||t.alive){addSt(t,'curse',3,RK(u,'luc_znak')?.4:.25);t.st.curseSrc=u;flt(t,'Oznaczony','info')}}},
 ognista:{dt:'ogien',name:'Ognista strzała',icon:'🔥',cd:3,t:'enemy',fx:'arrow',pw:1.5,desc:'Atak 150% (ogień) + podpalenie na 3 tury.',run:(u,t)=>{if(hit(u,t,1.5,'fire')>0)bleed(u,t,3,u.atk*.4,'🔥')}},
 /* --- Mag --- */
 kula:{dt:'ogien',name:'Kula ognia',icon:'🔥',cd:3,t:'allEnemies',fx:'fire',desc:'Atak 70% we wszystkich wrogów + podpalenie (2 tury).',run:(u,ts)=>{const p=RK(u,'mag_piro');ts.forEach(t=>{if(hit(u,t,.7)>0)bleed(u,t,p?3:2,u.atk*.3,'🔥')})}},
 lod:{dt:'lod',name:'Lodowa włócznia',icon:'❄️',cd:3,t:'enemy',fx:'ice',desc:'Atak 120% i zamrożenie (ogłuszenie) na 1 turę.',ai:(u,c)=>aiCC(u,c,54),run:(u,t)=>{if(hit(u,t,1.2)>0)stun(t)}},
 pocisk:{dt:'arkana',name:'Magiczny pocisk',icon:'✴️',cd:1,t:'allEnemies',fx:'magic',desc:'3 pociski po 40% w losowych wrogów.',ai:(u,c)=>[47,null],run:u=>rndFoes(3).forEach(t=>hit(u,t,.4))},
 meteor:{dt:'ogien',name:'Meteoryt',icon:'☄️',cd:5,t:'allEnemies',fx:'fire',desc:'Atak 135% we wszystkich wrogów.',ai:(u,c)=>aiAoe(u,c,56),run:(u,ts)=>ts.forEach(t=>{if(hit(u,t,1.35)>0&&RK(u,'mag_meteor'))bleed(u,t,2,u.atk*.3,'🔥')})},
 nova:{dt:'lod',name:'Mroźna nova',icon:'🌨️',cd:4,t:'allEnemies',fx:'ice',desc:'Atak 60% we wszystkich wrogów, 35% szansy na zamrożenie każdego.',run:(u,ts)=>{const ch=RK(u,'mag_nova')?.7:.35;ts.forEach(t=>{if(hit(u,t,.6)>0)stunC(t,ch)})}},
 tarczam:{name:'Tarcza many',icon:'🔷',cd:3,t:'ally',fx:'buff',desc:'Sojusznik: +60% obrony na 3 tury i leczenie 15% jego PŻ.',ai:(u,c)=>{const t=c.al.filter(a=>!(a.st.shield>0)).sort((a,b)=>rat(a)-rat(b))[0];return t&&rat(t)<.7?[60,t]:null},
  run:(u,t)=>{addSt(t,'shield',3);aura(t,'#7fc8ff');flt(t,'Tarcza','info');healBy(u,t,t.maxHp*.15)}},
 /* --- Kapłan --- */
 leczenie:{name:'Leczenie',icon:'💚',cd:1,t:'ally',fx:'heal',desc:'Leczy sojusznika (2,5× atak + 15) i usuwa krwawienie.',ai:(u,c)=>aiHeal(u,c,.6),
  run:(u,t)=>{const a=u.atk*2.5+15;healBy(u,t,a);delete t.st.bleed;updUnit(t);if(RK(u,'kap_cud'))alive('h').filter(x=>x!==t).forEach(x=>healBy(u,x,a*.3))}},
 blog:{name:'Błogosławieństwo',icon:'🙏',cd:3,t:'allAllies',fx:'heal',desc:'Leczy całą drużynę (12% max PŻ + atak), zdejmuje ogłuszenie.',ai:(u,c)=>aiHealAll(u,c,2),
  run:(u,ts)=>{ts.forEach(t=>{healBy(u,t,t.maxHp*.12+u.atk);delete t.st.stun;if(RK(u,'kap_odnowa')>=2)delete t.st.bleed;updUnit(t)});if(RK(u,'kap_slonce'))alive('e').forEach(e=>hit(u,e,.6,'holy'))}},
 sad:{dt:'swiete',name:'Sąd',icon:'⚖️',cd:2,t:'enemy',fx:'holy',pw:1.4,desc:'Atak 140% świętym światłem.',run:(u,t)=>hit(u,t,1.4)},
 tarcza:{name:'Tarcza światła',icon:'🔰',cd:4,t:'allAllies',fx:'buff',desc:'Cała drużyna: +60% obrony na 2 tury.',ai:(u,c)=>c.al.some(a=>a.st.shield>0)?null:[52+(c.boss?12:0)+(c.al.some(a=>rat(a)<.5)?8:0),null],
  run:(u,ts)=>{const r=RK(u,'kap_tarcza');ts.forEach(t=>{addSt(t,'shield',2+(r?1:0));flt(t,'Tarcza','info');aura(t,'#ffe36a');if(r>=2)healBy(u,t,t.maxHp*.1)});log(`${u.name} osłania drużynę światłem.`,'g')}},
 odnowa:{name:'Odnowa',icon:'🌿',cd:2,t:'ally',fx:'heal',desc:'Sojusznik regeneruje 8% max PŻ + 50% ataku co turę przez 3 tury.',ai:(u,c)=>{const t=c.al.filter(a=>!a.st.regen).sort((a,b)=>rat(a)-rat(b))[0];return t&&rat(t)<.8?[56,t]:null},
  run:(u,t)=>regen(u,t,3,t.maxHp*.08+u.atk*.5)},
 wskrzes:{name:'Wskrzeszenie',icon:'🕊️',cd:99,t:'deadAlly',fx:'heal',desc:'Przywraca do życia poległego w tej walce sojusznika z 35% PŻ. Raz na walkę.',ai:(u,c)=>c.dead.length?[95,c.dead[0]]:null,run:(u,t)=>revive(u,t,.35)},
 /* --- Łotr --- */
 trucizna:{dt:'klute',name:'Zatruty sztylet',icon:'🧪',cd:2,t:'enemy',fx:'poison',pw:1.1,desc:'Atak 110% + trucizna na 3 tury.',run:(u,t)=>{if(hit(u,t,1.1)>0)bleed(u,t,3,u.atk*.5*(1+.4*RK(u,'lot_jad')),'🧪')}},
 unik:{name:'Unik',icon:'💨',cd:3,t:'self',fx:'buff',desc:'Unikasz wszystkich ataków do swojej następnej tury.',ai:(u,c)=>rat(u)<.4&&!(u.st.taunt>0)?[72,u]:null,run:u=>{u.st.evade=1;flt(u,'Unik','info');log(`${u.name} szykuje się do uniku.`,'y');if(RK(u,'lot_cien')>=2)healBy(u,u,u.maxHp*.15)}},
 plecy:{dt:'klute',name:'Cios w plecy',icon:'🔪',cd:2,t:'enemy',fx:'melee',pw:1.5,cb:.4,desc:'Atak 150% z +40% szansy na krytyk.',run:(u,t)=>hit(u,t,1.5)},
 zabojczy:{dt:'klute',name:'Zabójczy cios',icon:'☠️',cd:4,t:'enemy',fx:'melee',pw:2.4,desc:'Atak 200%, podwójny jeśli cel ma <50% PŻ.',ai:(u,c)=>{const t=c.fo.filter(e=>rat(e)<.5).sort((a,b)=>b.hp-a.hp)[0];return [t?64:44,t||c.weak]},
  run:(u,t)=>{hit(u,t,rat(t)<.5?4:2);if(!t.alive&&RK(u,'lot_egz')){u.cd.zabojczy=-1;flt(u,'Egzekucja!','info')}}},
 bomba:{dt:'obuch',name:'Bomba dymna',icon:'💣',cd:4,t:'allEnemies',fx:'web',desc:'Atak 40% we wszystkich wrogów i osłabienie (−25% ataku) na 2 tury.',ai:(u,c)=>c.fo.filter(e=>!(e.st.weak>0)).length>1?[55,null]:null,
  run:(u,ts)=>{const s=RK(u,'lot_bomba');ts.forEach(t=>{hit(u,t,.4);addSt(t,'weak',2);if(s)stunC(t,.35)})}},
 wachlarz:{dt:'klute',name:'Wachlarz noży',icon:'🗡️',cd:3,t:'allEnemies',fx:'melee',desc:'Atak 70% we wszystkich wrogów + krwawienie na 2 tury.',run:(u,ts)=>ts.forEach(t=>{if(hit(u,t,.7)>0)bleed(u,t,2,u.atk*.3)})},
 /* --- Paladyn --- */
 swiety:{dt:'swiete',name:'Święty cios',icon:'✝️',cd:2,t:'enemy',fx:'melee',pw:1.3,desc:'Atak 130% (święte). Leczy Cię o 20% zadanych obrażeń.',run:(u,t)=>{const d=hit(u,t,1.3,'holy');if(d>0)healBy(u,u,d*(RK(u,'pal_cios')?.4:.2))}},
 oslona:{name:'Osłona',icon:'🛡️',cd:3,t:'ally',fx:'buff',desc:'Sojusznik: +60% obrony na 2 tury. Paladyn prowokuje wrogów przez 2 tury.',
  ai:(u,c)=>{const t=c.al.filter(a=>a!==u&&!(a.st.shield>0)).sort((a,b)=>rat(a)-rat(b))[0];if(t&&rat(t)<.6)return [64,t];return c.al.length>1&&!(u.st.taunt>0)&&rat(u)>.5?[58,u]:null},
  run:(u,t)=>{const r=RK(u,'pal_oslona'),n=2+(r?1:0);addSt(t,'shield',n);addSt(u,'taunt',n);aura(t,'#ffe36a');flt(u,'Prowokacja!','info');if(r)healBy(u,t,t.maxHp*.08*r);log(`${u.name} osłania: ${t.name}.`,'g')}},
 rece:{name:'Nałożenie rąk',icon:'🤲',cd:3,t:'ally',fx:'heal',desc:'Leczy sojusznika (15% max PŻ paladyna + 150% ataku).',ai:(u,c)=>aiHeal(u,c,.5),run:(u,t)=>{healBy(u,t,u.maxHp*.15+u.atk*1.5);if(RK(u,'pal_rece')>=2){delete t.st.bleed;delete t.st.stun;updUnit(t)}}},
 mlots:{dt:'swiete',name:'Młot sprawiedliwości',icon:'🔨',cd:4,t:'enemy',fx:'holy',pw:1.6,desc:'Atak 160% (święte) i ogłuszenie na 1 turę.',ai:(u,c)=>aiCC(u,c,56),run:(u,t)=>{if(hit(u,t,1.6)>0)stun(t)}},
 aura:{name:'Aura odwagi',icon:'🌟',cd:4,t:'allAllies',fx:'buff',desc:'Cała drużyna regeneruje 5% max PŻ + 30% ataku paladyna co turę przez 3 tury.',ai:(u,c)=>c.al.filter(a=>rat(a)<.85&&!a.st.regen).length>=2?[57,null]:null,
  run:(u,ts)=>ts.forEach(t=>{regen(u,t,3,t.maxHp*.05+u.atk*.3);if(RK(u,'pal_aura'))addSt(t,'rally',2,.3)})},
 konsekracja:{dt:'swiete',name:'Konsekracja',icon:'☀️',cd:3,t:'allEnemies',fx:'holy',desc:'Atak 80% (święte) we wszystkich wrogów.',run:(u,ts)=>ts.forEach(t=>hit(u,t,.8))},
 /* --- Druid --- */
 ciernie:{dt:'trucizna',name:'Ciernie',icon:'🌵',cd:2,t:'enemy',fx:'poison',pw:1.1,desc:'Atak 110% + trucizna na 3 tury.',run:(u,t)=>{if(hit(u,t,1.1)>0)bleed(u,t,3,u.atk*.45*(1+.3*RK(u,'dru_ciernie')),'🧪')}},
 regen:{name:'Odrodzenie natury',icon:'🍃',cd:2,t:'ally',fx:'heal',desc:'Sojusznik regeneruje 8% max PŻ + 60% ataku co turę przez 3 tury.',
  ai:(u,c)=>{if(tOf(u,'regen')==='allAllies')return c.al.filter(a=>rat(a)<.8).length>=2?[62,null]:null;const t=c.al.filter(a=>!a.st.regen).sort((a,b)=>rat(a)-rat(b))[0];return t&&rat(t)<.75?[58+(1-rat(t))*20,t]:null},
  run:(u,t)=>{const n=3+(RK(u,'dru_regen')?1:0);(Array.isArray(t)?t:[t]).forEach(x=>regen(u,x,n,x.maxHp*.08+u.atk*.6))}},
 splatanie:{dt:'obuch',name:'Splątanie',icon:'🌱',cd:4,t:'enemy',fx:'poison',desc:'Pnącza: atak 70% (obuchowy) i unieruchomienie (ogłuszenie) na 1 turę.',ai:(u,c)=>aiCC(u,c,51),run:(u,t)=>{if(hit(u,t,.7)>0)stun(t)}},
 niedzwiedz:{name:'Forma niedźwiedzia',icon:'🐻',cd:5,t:'self',fx:'buff',desc:'Na 3 tury: +30% ataku, +60% obrony i prowokacja. Leczy 20% PŻ.',ai:(u,c)=>!(u.st.bear>0)&&(rat(u)<.6||c.al.length>1&&!c.al.some(a=>a.st.taunt>0))?[60+(rat(u)<.5?12:0),u]:null,
  run:u=>{const r=RK(u,'dru_niedz'),n=3+(r?1:0);addSt(u,'bear',n);addSt(u,'taunt',n);healBy(u,u,u.maxHp*(.2+.1*r));flt(u,'Niedźwiedź!','info');log(`${u.name} przybiera formę niedźwiedzia!`,'y')}},
 roj:{dt:'trucizna',name:'Rój owadów',icon:'🐝',cd:4,t:'allEnemies',fx:'poison',desc:'Atak 50% we wszystkich wrogów + trucizna na 2 tury.',run:(u,ts)=>ts.forEach(t=>{if(hit(u,t,.5)>0)bleed(u,t,2,u.atk*.3,'🧪')})},
 burza:{dt:'lod',name:'Burza gradowa',icon:'🌩️',cd:3,t:'allEnemies',fx:'ice',desc:'Atak 100% (lód) we wszystkich wrogów, 25% szansy na ogłuszenie.',ai:(u,c)=>aiAoe(u,c,50),run:(u,ts)=>ts.forEach(t=>{if(hit(u,t,1)>0)stunC(t,.25)})},
 /* --- Czarnoksiężnik --- */
 wyssanie:{dt:'mrok',name:'Wyssanie życia',icon:'🩸',cd:2,t:'enemy',fx:'dark',pw:1.2,desc:'Atak 120% (mrok). Leczy Cię o 50% zadanych obrażeń.',ai:(u,c)=>[44+(rat(u)<.6?14:0),c.weak],run:(u,t)=>{const d=hit(u,t,1.2);if(d>0)healBy(u,u,d*.5)}},
 klatwa:{dt:'mrok',name:'Klątwa słabości',icon:'🕯️',cd:3,t:'enemy',fx:'dark',desc:'Atak 50%. Cel na 3 tury: −25% ataku i +25% otrzymywanych obrażeń.',ai:(u,c)=>aiDebuff(u,c,'curse',56),
  run:(u,t)=>{hit(u,t,.5);if(t.alive){addSt(t,'weak',3);addSt(t,'curse',3,.25+.1*RK(u,'cz_klatwa'));t.st.curseSrc=u;flt(t,'Przeklęty','info')}}},
 strach:{dt:'mrok',name:'Strach',icon:'😱',cd:4,t:'allEnemies',fx:'dark',desc:'Atak 40% we wszystkich wrogów i osłabienie (−25% ataku) na 2 tury.',ai:(u,c)=>c.fo.filter(e=>!(e.st.weak>0)).length>1?[53,null]:null,
  run:(u,ts)=>{const s=RK(u,'cz_strach');ts.forEach(t=>{hit(u,t,.4);addSt(t,'weak',2);if(s)stunC(t,.4)})}},
 zaraza:{dt:'mrok',name:'Mroczna zaraza',icon:'🦠',cd:4,t:'allEnemies',fx:'dark',desc:'Atak 80% we wszystkich wrogów + gnicie (mrok) na 3 tury.',run:(u,ts)=>ts.forEach(t=>{if(hit(u,t,.8)>0)bleed(u,t,3,u.atk*.35,'🌑')})},
 pakt:{name:'Krwawy pakt',icon:'📜',cd:4,t:'self',fx:'buff',desc:'Poświęcasz 15% PŻ: +40% ataku na 3 tury, odnowienia pozostałych umiejętności −1.',ai:(u,c)=>!(u.st.rally>0)&&(RK(u,'cz_pakt')||rat(u)>.55)?[55,u]:null,
  run:u=>{if(RK(u,'cz_pakt'))healBy(u,u,u.maxHp*.1);else{const l=Math.min(u.hp-1,Math.round(u.maxHp*.15));if(l>0){u.hp-=l;flt(u,'-'+l,'dmg')}}addSt(u,'rally',3,.4);for(const k in u.cd)if(k!=='pakt'&&u.cd[k]>0)u.cd[k]--;log(`${u.name} zawiera krwawy pakt!`,'y')}},
 smierc:{dt:'mrok',name:'Palec śmierci',icon:'👉',cd:4,t:'enemy',fx:'dark',pw:2.5,desc:'Atak 250% (mrok), ×1,6 jeśli cel ma <35% PŻ.',run:(u,t)=>hit(u,t,rat(t)<.35?4:2.5)},
 /* --- Bard --- */
 ballada:{name:'Ballada odwagi',icon:'🎵',cd:3,t:'allAllies',fx:'buff',desc:'Cała drużyna: +30% ataku na 2 tury.',ai:(u,c)=>aiBuffAll(u,c,'rally'),
  run:(u,ts)=>{const v=.3+.1*RK(u,'bar_ballada'),n=2+(RK(u,'bar_epos')?1:0);ts.forEach(t=>{addSt(t,'rally',n,v);ring(t,'#ffb0e0')});log(`${u.name} gra balladę odwagi!`,'y')}},
 dysonans:{dt:'arkana',name:'Dysonans',icon:'🎸',cd:2,t:'enemy',fx:'magic',pw:1.1,desc:'Atak 110% (arkana) i osłabienie celu (−25% ataku) na 2 tury.',run:(u,t)=>{if(hit(u,t,1.1)>0||t.alive)addSt(t,'weak',RK(u,'bar_dys')>=2?3:2)}},
 wiatr:{name:'Pieśń wiatru',icon:'🌬️',cd:4,t:'allAllies',fx:'buff',desc:'Cała drużyna: +2 szybkości na 3 tury.',ai:(u,c)=>aiBuffAll(u,c,'haste'),run:(u,ts)=>{const w=RK(u,'bar_wiatr');ts.forEach(t=>{addSt(t,'haste',w?4:3,w?3:2);ring(t,'#9ae4f6')})}},
 kolysanka:{dt:'arkana',name:'Kołysanka',icon:'🌙',cd:5,t:'allEnemies',fx:'magic',desc:'Atak 30% we wszystkich wrogów, każdy z 50% szansą zasypia (ogłuszenie).',ai:(u,c)=>c.fo.filter(e=>!e.boss).length>1?[60,null]:null,run:(u,ts)=>{const ch=RK(u,'bar_kolys')?.8:.5;ts.forEach(t=>{hit(u,t,.3);stunC(t,ch)})}},
 hymn:{name:'Hymn odnowy',icon:'🎶',cd:3,t:'allAllies',fx:'heal',desc:'Leczy całą drużynę (10% max PŻ + 80% ataku), zdejmuje krwawienie i ogłuszenie.',ai:(u,c)=>aiHealAll(u,c,2),run:(u,ts)=>ts.forEach(t=>{healBy(u,t,t.maxHp*.1+u.atk*.8);delete t.st.bleed;delete t.st.stun;updUnit(t)})},
 crescendo:{dt:'arkana',name:'Crescendo',icon:'🎺',cd:3,t:'allEnemies',fx:'magic',desc:'Atak 110% (arkana) we wszystkich wrogów.',ai:(u,c)=>aiAoe(u,c,48),run:(u,ts)=>ts.forEach(t=>hit(u,t,1.1))}
};
/* pula umiejętności: indeks = próg odblokowania wg SKL (0 = z talentu) */
const SKL=[1,1,3,4,6,0];
const POOL={wojownik:['prowokacja','potezny','uderzenie','wir','okrzyk','rzez'],lucznik:['celny','deszcz','ogluszajacy','salwa','znak','ognista'],mag:['kula','lod','pocisk','meteor','nova','tarczam'],
 kaplan:['leczenie','blog','sad','tarcza','odnowa','wskrzes'],lotr:['trucizna','unik','plecy','zabojczy','bomba','wachlarz'],paladyn:['swiety','oslona','rece','mlots','aura','konsekracja'],
 druid:['ciernie','regen','splatanie','niedzwiedz','roj','burza'],czarnoksieznik:['wyssanie','klatwa','strach','zaraza','pakt','smierc'],bard:['ballada','dysonans','wiatr','kolysanka','hymn','crescendo']};
const LOAD_MAX=4,TREQ=[0,1,3,5];
/* węzeł: [id, nazwa, ikona, maks.ranga, opis ({x} = wartość × ranga), efekty na rangę, ulepszenie {sk,p,cd,cdr}, odblokowanie] */
const N=(id,n,ic,r,d,e,up,un)=>({id,n,ic,r,d,e:e||null,up:up||null,un:un||null});
const TREE={
 wojownik:{b:['Obrońca','Berserker','Dowódca'],bi:['def','atk','st_rally'],n:[
  [N('woj_skora','Żelazna skóra','def',3,'+{6}% PŻ i +{1} OBR',{hpP:.06,def:1}),N('woj_prowo','Mistrz prowokacji','sk_prowokacja',2,'Prowokacja trwa 3 tury i leczy {10}% PŻ'),N('woj_mur','Mur tarcz','sk_uderzenie',1,'Uderzenie tarczą: odnowienie −1 i daje Ci +60% obrony na 2 tury',null,{sk:'uderzenie',cd:-1}),N('woj_nieugiety','Nieugięty','boss',1,'Raz na walkę przeżywasz śmiertelny cios z 1 PŻ i tarczą')],
  [N('woj_sila','Krzepa','atk',3,'+{5}% ATK',{atkP:.05}),N('woj_rozplat','Rozpłatanie','sk_potezny',2,'Potężny cios: +{15}% obrażeń i krwawienie',null,{sk:'potezny',p:.15}),N('woj_rzez','Rzeź','sk_rzez',1,'Odblokowuje umiejętność Rzeź (200%, leczy 30% obrażeń)',null,null,'rzez'),N('woj_szal','Szał bitewny','crit',1,'Poniżej 50% PŻ zadajesz +30% obrażeń')],
  [N('woj_tak','Taktyk','spd',3,'+{0.3} SZY i +{2}% kryt.',{spd:.3,crit:2}),N('woj_okrzyk','Donośny głos','sk_okrzyk',2,'Okrzyk bojowy leczy drużynę o {5}% PŻ'),N('woj_wir','Wirujące ostrza','sk_wir',1,'Wir ostrzy: +30% obrażeń i odnowienie −1',null,{sk:'wir',p:.3,cd:-1}),N('woj_sztandar','Sztandar','st_rally',1,'Na początku walki cała drużyna dostaje +30% ataku na 2 tury')]]},
 lucznik:{b:['Strzelec','Łowca','Zwiadowca'],bi:['crit','atk','spd'],n:[
  [N('luc_oko','Sokole oko','crit',3,'+{4}% szansy na krytyk',{crit:4}),N('luc_groty','Zatrute groty','sk_celny',2,'Celny strzał: +{20}% obrażeń i +{50}% krwawienia',null,{sk:'celny',p:.2}),N('luc_ogn','Ogniste groty','sk_ognista',1,'Odblokowuje umiejętność Ognista strzała',null,null,'ognista'),N('luc_snajper','Strzał w serce','boss',1,'Krytyki zadają ×2,2 zamiast ×1,6',{critM:.6})],
  [N('luc_mysl','Myśliwy','atk',3,'+{5}% ATK',{atkP:.05}),N('luc_grad','Grad strzał','sk_deszcz',2,'Deszcz strzał: +{15}% obrażeń',null,{sk:'deszcz',p:.15}),N('luc_znak','Tropiciel','sk_znak',1,'Znak łowcy: cel otrzymuje +40% obrażeń, odnowienie −1',null,{sk:'znak',cd:-1}),N('luc_salwa','Burza strzał','sk_salwa',1,'Potrójny strzał wypuszcza 5 strzał')],
  [N('luc_krok','Lekki krok','spd',3,'+{0.4} SZY',{spd:.4}),N('luc_unik','Wymykanie się','st_evade',2,'{7}% szansy na unik każdego ataku',{dodge:.07}),N('luc_ogl','Mistrz ogłuszania','sk_ogluszajacy',1,'Strzał ogłuszający: +40% obrażeń, odnowienie −1',null,{sk:'ogluszajacy',p:.4,cd:-1}),N('luc_pierwszy','Zasadzka','sk_atak',1,'W 1. rundzie walki zadajesz +60% obrażeń')]]},
 mag:{b:['Ogień','Lód','Arkana'],bi:['st_burn','sk_lod','rozdzka'],n:[
  [N('mag_zar','Żar','st_burn',3,'+{10}% obrażeń od ognia',{dtP:{ogien:.1}}),N('mag_piro','Piroman','sk_kula',2,'Kula ognia: +{15}% obrażeń, podpalenie 3 tury',null,{sk:'kula',p:.15}),N('mag_meteor','Deszcz meteorów','sk_meteor',1,'Meteoryt: odnowienie −1 i podpala',null,{sk:'meteor',cd:-1}),N('mag_feniks','Pożoga','boss',1,'Twoje podpalenia zadają podwójne obrażenia')],
  [N('mag_chlod','Chłód','sk_lod',3,'+{10}% obrażeń od lodu i +{1} OBR',{dtP:{lod:.1},def:1}),N('mag_mroz','Wieczna zmarzlina','sk_lod',2,'Lodowa włócznia: +{15}% obrażeń; na 2. randze odnowienie −1',null,{sk:'lod',p:.15,cd:-1,cdr:2}),N('mag_nova','Zamieć','sk_nova',1,'Mroźna nova: 70% szansy na zamrożenie',null,{sk:'nova',p:.2}),N('mag_lodowa','Lodowa zbroja','st_shield',1,'Na początku walki +60% obrony na 3 tury; +20% odporności na lód i ogień',{res:{lod:20,ogien:20}})],
  [N('mag_arcy','Arcymag','atk',3,'+{5}% ATK',{atkP:.05}),N('mag_bariera','Bariera','hp',2,'+{10}% PŻ i +{1} OBR',{hpP:.1,def:1}),N('mag_tarcza','Tarcza many','sk_tarczam',1,'Odblokowuje umiejętność Tarcza many',null,null,'tarczam'),N('mag_moc','Przepływ many','xp',1,'Wszystkie umiejętności odnawiają się 1 turę szybciej')]]},
 kaplan:{b:['Uzdrowiciel','Strażnik','Gniew niebios'],bi:['sk_leczenie','def','sk_sad'],n:[
  [N('kap_moc','Święta moc','sk_leczenie',3,'+{10}% siły leczenia',{healP:.1}),N('kap_odnowa','Odnowa','sk_blog',2,'Błogosławieństwo: +{25}% leczenia; na 2. randze usuwa krwawienie',null,{sk:'blog',p:.25}),N('kap_wskrz','Wskrzeszenie','sk_wskrzes',1,'Odblokowuje umiejętność Wskrzeszenie',null,null,'wskrzes'),N('kap_cud','Cud','boss',1,'Leczenie leczy też resztę drużyny za 30%')],
  [N('kap_wiara','Pancerz wiary','def',3,'+{1} OBR i +{4}% PŻ',{def:1,hpP:.04}),N('kap_tarcza','Tarcza światła','sk_tarcza',2,'Tarcza światła trwa o 1 turę dłużej; na 2. randze leczy 10% PŻ'),N('kap_aura','Aura ochronna','st_shield',1,'W walce cała drużyna ma +10% odporności na wszystko'),N('kap_aniol','Anioł stróż','sk_wskrzes',1,'Raz na walkę sojusznik, który miał zginąć, przeżywa z 25% PŻ')],
  [N('kap_zapal','Zapał','atk',3,'+{6}% ATK',{atkP:.06}),N('kap_sad','Sąd ostateczny','sk_sad',2,'Sąd: +{20}% obrażeń',null,{sk:'sad',p:.2}),N('kap_gniew','Gniew niebios','sk_atak',1,'Zwykły atak leczy najsłabszego sojusznika o 50% obrażeń'),N('kap_slonce','Słoneczny rozbłysk','sk_blog',1,'Błogosławieństwo rani też wszystkich wrogów (60%, święte)')]]},
 lotr:{b:['Skrytobójca','Truciciel','Cień'],bi:['crit','st_poison','st_evade'],n:[
  [N('lot_ostrze','Ostrze','crit',3,'+{3}% kryt. i +{3}% ATK',{crit:3,atkP:.03}),N('lot_plecy','Cios w plecy','sk_plecy',2,'Cios w plecy: +{15}% obrażeń',null,{sk:'plecy',p:.15}),N('lot_skryt','Skrytobójca','sk_zabojczy',1,'Krytyki zadają ×2 zamiast ×1,6',{critM:.4}),N('lot_egz','Egzekutor','boss',1,'Zabójczy cios odnawia się natychmiast, gdy zabije cel')],
  [N('lot_toks','Toksyny','st_poison',3,'+{10}% obrażeń od trucizny',{dtP:{trucizna:.1}}),N('lot_jad','Jad','sk_trucizna',2,'Zatruty sztylet: trucizna silniejsza o {40}%'),N('lot_wachlarz','Wachlarz noży','sk_wachlarz',1,'Odblokowuje umiejętność Wachlarz noży',null,null,'wachlarz'),N('lot_zaraza','Zaraza','skull',1,'Gdy zatruty wróg ginie, trucizna przechodzi na innego wroga')],
  [N('lot_akro','Akrobata','spd',3,'+{0.4} SZY i +{4}% PŻ',{spd:.4,hpP:.04}),N('lot_cien','Cień','sk_unik',2,'Unik: odnowienie −1; na 2. randze leczy 15% PŻ',null,{sk:'unik',cd:-1}),N('lot_bomba','Oślepiający dym','sk_bomba',1,'Bomba dymna: 35% szansy na ogłuszenie, odnowienie −1',null,{sk:'bomba',cd:-1}),N('lot_widmo','Widmo','st_evade',1,'20% szansy na unik każdego ataku',{dodge:.2})]]},
 paladyn:{b:['Obrońca wiary','Krzyżowiec','Światłość'],bi:['def','sk_swiety','sk_aura'],n:[
  [N('pal_zbroja','Święta zbroja','def',3,'+{1} OBR i +{5}% PŻ',{def:1,hpP:.05}),N('pal_oslona','Niezłomna opieka','sk_oslona',2,'Osłona trwa 3 tury i leczy sojusznika o {8}% PŻ'),N('pal_odwet','Odwet','st_taunt',1,'Odbijasz 25% otrzymanych obrażeń w atakującego',{thorns:.25}),N('pal_mur','Bastion','boss',1,'Na początku walki prowokujesz wrogów i masz +60% obrony (2 tury)')],
  [N('pal_zapal','Zapał','atk',3,'+{5}% ATK',{atkP:.05}),N('pal_cios','Święty gniew','sk_swiety',2,'Święty cios: +{15}% obrażeń i leczy 40% obrażeń',null,{sk:'swiety',p:.15}),N('pal_konsekr','Konsekracja','sk_konsekracja',1,'Odblokowuje umiejętność Konsekracja',null,null,'konsekracja'),N('pal_mlot','Gniew Pana','sk_mlots',1,'Młot sprawiedliwości: +40% obrażeń, odnowienie −1',null,{sk:'mlots',p:.4,cd:-1})],
  [N('pal_laska','Łaska','sk_leczenie',3,'+{10}% siły leczenia',{healP:.1}),N('pal_rece','Dobre ręce','sk_rece',2,'Nałożenie rąk: +{20}% leczenia; na 2. randze usuwa krwawienie i ogłuszenie',null,{sk:'rece',p:.2}),N('pal_aura','Natchnienie','sk_aura',1,'Aura odwagi daje też +30% ataku na 2 tury'),N('pal_meczen','Ostatnia modlitwa','sk_blog',1,'Raz na walkę, gdy spadniesz poniżej 30% PŻ, leczysz drużynę o 25% PŻ')]]},
 druid:{b:['Strażnik gaju','Zmiennokształtny','Gniew natury'],bi:['st_regen','sk_niedzwiedz','sk_ciernie'],n:[
  [N('dru_zycie','Soki życia','st_regen',3,'+{10}% siły leczenia i +{3}% PŻ',{healP:.1,hpP:.03}),N('dru_regen','Bujny wzrost','sk_regen',2,'Odrodzenie natury: +{20}% leczenia i trwa 4 tury',null,{sk:'regen',p:.2}),N('dru_kwiat','Kwiat życia','sk_regen',1,'Odrodzenie natury działa na całą drużynę'),N('dru_wieczny','Wieczny las','boss',1,'Na początku walki cała drużyna regeneruje 5% PŻ co turę (3 tury)')],
  [N('dru_skora','Kora','def',3,'+{1} OBR i +{5}% PŻ',{def:1,hpP:.05}),N('dru_niedz','Ryk niedźwiedzia','sk_niedzwiedz',2,'Forma niedźwiedzia trwa 4 tury i leczy o {10}% PŻ więcej'),N('dru_pazury','Pazury','sk_atak',1,'W formie niedźwiedzia zwykły atak zadaje 140% i rani do krwi'),N('dru_pierwotny','Pierwotna furia','sk_niedzwiedz',1,'Forma niedźwiedzia odnawia się 2 tury szybciej',null,{sk:'niedzwiedz',cd:-2})],
  [N('dru_jad','Jad natury','st_poison',3,'+{10}% obrażeń od trucizny',{dtP:{trucizna:.1}}),N('dru_ciernie','Kolce','sk_ciernie',2,'Ciernie: +{20}% obrażeń i silniejsza trucizna',null,{sk:'ciernie',p:.2}),N('dru_burza','Burza gradowa','sk_burza',1,'Odblokowuje umiejętność Burza gradowa',null,null,'burza'),N('dru_roj','Plaga','sk_roj',1,'Rój owadów: +30% obrażeń, odnowienie −1',null,{sk:'roj',p:.3,cd:-1})]]},
 czarnoksieznik:{b:['Klątwy','Krew','Otchłań'],bi:['sk_klatwa','sk_wyssanie','skull'],n:[
  [N('cz_mrok','Mroczna moc','skull',3,'+{10}% obrażeń od mroku',{dtP:{mrok:.1}}),N('cz_klatwa','Głęboka klątwa','sk_klatwa',2,'Klątwa słabości: przeklęty cel otrzymuje dodatkowe +{10}% obrażeń'),N('cz_strach','Groza','sk_strach',1,'Strach: 40% szansy na ogłuszenie każdego wroga'),N('cz_zaglada','Zagłada','boss',1,'Gdy przeklęty wróg ginie, klątwa przechodzi na innego wroga')],
  [N('cz_krew','Krwiopijca','st_bleed',3,'Leczysz się o {4}% zadanych obrażeń',{ls:.04}),N('cz_wyss','Głód','sk_wyssanie',2,'Wyssanie życia: +{20}% obrażeń',null,{sk:'wyssanie',p:.2}),N('cz_pakt','Mroczny układ','sk_pakt',1,'Krwawy pakt nie kosztuje PŻ, a leczy 10%'),N('cz_nies','Nieśmiertelny','sk_wskrzes',1,'Raz na walkę przeżywasz śmiertelny cios z 30% PŻ')],
  [N('cz_moc','Moc otchłani','atk',3,'+{5}% ATK',{atkP:.05}),N('cz_zaraza','Zgnilizna','sk_zaraza',2,'Mroczna zaraza: +{15}% obrażeń',null,{sk:'zaraza',p:.15}),N('cz_smierc','Palec śmierci','sk_smierc',1,'Odblokowuje umiejętność Palec śmierci',null,null,'smierc'),N('cz_otchlan','Spojrzenie otchłani','crit',1,'+10% kryt., krytyki zadają ×2,2',{crit:10,critM:.6})]]},
 bard:{b:['Wirtuoz','Szyderca','Trubadur'],bi:['sk_ballada','sk_dysonans','sk_hymn'],n:[
  [N('bar_rytm','Rytm','spd',3,'+{0.3} SZY i +{3}% ATK',{spd:.3,atkP:.03}),N('bar_ballada','Porywająca ballada','sk_ballada',2,'Ballada odwagi daje dodatkowe +{10}% ataku'),N('bar_cresc','Crescendo','sk_crescendo',1,'Odblokowuje umiejętność Crescendo',null,null,'crescendo'),N('bar_epos','Epos','boss',1,'Ballada odwagi trwa 3 tury, odnowienie −1',null,{sk:'ballada',cd:-1})],
  [N('bar_kpina','Kpina','crit',3,'+{4}% szansy na krytyk',{crit:4}),N('bar_dys','Ostry dysonans','sk_dysonans',2,'Dysonans: +{20}% obrażeń; na 2. randze osłabienie trwa 3 tury',null,{sk:'dysonans',p:.2}),N('bar_kolys','Głęboki sen','sk_kolysanka',1,'Kołysanka: 80% szansy na uśpienie',null,{sk:'kolysanka',p:.3}),N('bar_cisza','Pieśń rozpaczy','st_weak',1,'Wrogowie zaczynają walkę osłabieni (−25% ataku, 2 tury)')],
  [N('bar_glos','Czysty głos','sk_hymn',3,'+{10}% siły leczenia i +{4}% PŻ',{healP:.1,hpP:.04}),N('bar_hymn','Hymn','sk_hymn',2,'Hymn odnowy: +{20}% leczenia',null,{sk:'hymn',p:.2}),N('bar_wiatr','Wiatr w żaglach','sk_wiatr',1,'Pieśń wiatru: +3 SZY i trwa 4 tury'),N('bar_inspir','Uwertura','st_haste',1,'Na początku walki cała drużyna ma +2 SZY (2 tury)')]]}
};
const TN={};for(const c in TREE)TREE[c].n.forEach((br,b)=>br.forEach((x,t)=>{x.cls=c;x.b=b;x.t=t;TN[x.id]=x}));
const fmtNum=v=>String(Math.round(v*100)/100).replace('.',',');
const tdesc=(x,r)=>x.d.replace(/\{([\d.]+)\}/g,(_,v)=>fmtNum(+v*Math.max(1,r)));
const tSpent=h=>Object.values(h.tal||{}).reduce((a,v)=>a+v,0);
const tTotal=h=>Math.max(0,(h.lvl||1)-1);
const tFree=h=>Math.max(0,tTotal(h)-tSpent(h));
const brPts=(h,c,b)=>TREE[c].n[b].reduce((a,x)=>a+RK(h,x.id),0);
function tState(h,x){const r=RK(h,x.id);if(r>=x.r)return 'max';const prevOk=x.t===0||RK(h,TREE[h.cls].n[x.b][x.t-1].id)>0,ptsOk=brPts(h,h.cls,x.b)>=TREQ[x.t];
 if(prevOk&&ptsOk)return r?'taken':'avail';return r?'taken':'locked'}
const canTake=(h,x)=>x&&x.cls===h.cls&&tFree(h)>0&&RK(h,x.id)<x.r&&(tState(h,x)==='avail'||tState(h,x)==='taken');
function PW(x,k){let p=1;const c=x.cls||x.hero&&x.hero.cls;if(!TREE[c])return 1;for(const id in x.tal||{}){const n=TN[id];if(n&&n.up&&n.up.sk===k&&n.up.p)p+=n.up.p*x.tal[id]}return p}
function cdOf(x,k){const b=SK[k].cd;if(!b)return 0;if(b>=99)return b;let c=b;for(const id in x.tal||{}){const n=TN[id];if(n&&n.up&&n.up.sk===k&&n.up.cd&&x.tal[id]>=(n.up.cdr||1))c+=n.up.cd}if(RK(x,'mag_moc'))c--;return Math.max(1,c)}
const tOf=(u,k)=>k==='regen'&&RK(u,'dru_kwiat')?'allAllies':SK[k].t;
/* ===== ZASIĘG: wręcz (tylko 1. rząd wroga, dopóki ktoś w nim stoi) / dystans (dowolny cel) ===== */
const MELEE_CLS={wojownik:1,paladyn:1,lotr:1,druid:1};
const RANGED_SK={ciernie:1,splatanie:1,roj:1,bomba:1,wachlarz:1};
function reachOf(u,k){if(u.side==='e')return (u.fly||(u.fx&&u.fx!=='melee'&&u.fx!=='poison'))?'r':'m';
 if(k==='atak')return ((u.st&&u.st.bear>0)||MELEE_CLS[u.cls])?'m':'r';const s=SK[k];if(!s||RANGED_SK[k])return 'r';return s.fx==='melee'||s.fx==='poison'?'m':'r'}
const isOff=(h,k)=>{const t=tOf(h,k);return t==='enemy'||t==='allEnemies'};
const reachChip=r=>r==='m'?`<span class="rs rc m">${ic('miecz',12)}Wręcz</span>`:`<span class="rs rc r">${ic('luk',12)}Dystans</span>`;
const skReachChip=(h,k)=>isOff(h,k)?reachChip(reachOf({cls:h.cls,st:{},side:'h',tal:h.tal},k)):'';

function unlockedSk(h){const p=POOL[h.cls]||[];return p.filter((k,i)=>SKL[i]?h.lvl>=SKL[i]:Object.keys(h.tal||{}).some(id=>h.tal[id]>0&&TN[id]&&TN[id].un===k))}
function skReq(h,k){const i=(POOL[h.cls]||[]).indexOf(k);if(i<0)return '';if(SKL[i])return 'od poziomu '+SKL[i];const n=Object.values(TN).find(x=>x.un===k&&x.cls===h.cls);return n?'talent „'+n.n+'” ('+TREE[h.cls].b[n.b]+')':''}
/* zestaw (loadout): maks. 4 aktywne; nowe umiejętności dokładane automatycznie, jeśli jest miejsce */
function syncLoad(h){const un=unlockedSk(h);h.seen=(h.seen||[]).filter(k=>un.includes(k));if(!Array.isArray(h.load))h.load=[];h.load=h.load.filter((k,i,a)=>un.includes(k)&&a.indexOf(k)===i).slice(0,LOAD_MAX);
 un.forEach(k=>{if(!h.seen.includes(k)){h.seen.push(k);if(h.load.length<LOAD_MAX&&!h.load.includes(k))h.load.push(k)}});return h.load}
