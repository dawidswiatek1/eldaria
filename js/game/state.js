/* ===== STAN I ZAPIS ===== */
let S=null,B=null,screen='title',tab='team',teamView='heroes',AF={s:'',r:0,c:'',o:'r'},armSel=null,armConfirm=false,townView=null,curHero=null,htab='eq',selSlot=null,loadMsg='';
function save(){try{syncForm();S.v=SAVE_VER;localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}}
function saveSet(){try{localStorage.setItem(SET_KEY,JSON.stringify(SET))}catch(e){}}
function upHero(h){if(!h.base){h.base={hp:h.maxHp||100,atk:h.atk||10,def:h.def||3,spd:h.spd||5};h.free=Math.max(0,(h.lvl||1)-1)*2;['maxHp','atk','def','spd'].forEach(k=>delete h[k])}
 h.pts=h.pts||{hp:0,atk:0,def:0,spd:0};if(h.g!=='m'&&h.g!=='k')h.g=heroG(h);h.tal=h.tal||{};if(h.perks){delete h.perks;h.tal={}}syncLoad(h);h.eq=Object.assign({bron:null,zbroja:null,helm:null,amulet:null},h.eq||{});h.free=h.free||0;h.kills=h.kills||0;h.lvl=h.lvl||1;h.xp=h.xp||0;
 if(!CLASSES[h.cls])throw new Error('klasa');const m=stats(h).maxHp;if(!(h.hp>0))h.hp=m;h.hp=Math.min(h.hp,m)}
function migrate(s){if(!s||!Array.isArray(s.roster))return null;
 if(s.v===SAVE_VER)return s;
 if(!s.v||s.v===1){S=s;s.nextItem=s.nextItem||1;s.inv=s.inv||[];s.fallen=s.fallen||[];s.team=(s.team||[]).filter(id=>s.roster.some(h=>h.id===id));s.roster.forEach(upHero);genOffers();genShop();s.v=2;loadMsg='Zapis z poprzedniej wersji został zaktualizowany. Bohaterowie dostali punkty rozwoju za swoje poziomy.'}
 if(s.v===2){S=s;const had=s.roster.some(h=>h.perks&&Object.keys(h.perks).length);s.roster.forEach(h=>{delete h.perks;h.tal={};delete h.load;delete h.seen;upHero(h)});(s.offers||[]).forEach(o=>{delete o.hero.perks;o.hero.tal={};syncLoad(o.hero)});s.v=3;
  loadMsg=(loadMsg?loadMsg+' ':'')+'Nowe drzewka talentów! '+(had?'Dawne talenty zamieniono na punkty – ':'')+'każdy bohater ma 1 punkt talentu za każdy poziom od 2. Rozdaj je w zakładce Talenty.'}
 if(s.v===3){S=s;regFromStage(s);s.slots=null;s.exp=null;s.v=4;loadMsg=(loadMsg?loadMsg+' ':'')+'Nowość: wyprawy! Zamiast pojedynczych walk wyruszasz do krainy i idziesz korytarzem przez komnaty: walki, skrzynie, wydarzenia, obozowiska, a na końcu elita albo boss. Rany nie goją się po drodze. Formacja: 2 bohaterów z przodu, 3 z tyłu – walczący wręcz najpierw muszą pokonać pierwszy rząd wroga. Twój postęp (etap '+(s.stage||1)+') odblokował odpowiednie krainy.'}
 if(s.v===4){S=s;townOk();s.v=5;loadMsg=(loadMsg?loadMsg+' ':'')+'Miasto się rozrasta! Nowa mapa miasta, Zamek z kontraktami i skarbcem, Koszary, Lecznica (urazy z wypraw) i Targ z zapasami na wyprawę. Na start dostajesz pochodnię, 2 bandaże i prowiant.'}
 if(s.v===5){S=s;delete s.town;s.roster.forEach(h=>{fateOk(h);h.dd=0;h.hq=0});ensureMain();const m=s.roster.find(h=>h.main);s.v=6;
  loadMsg=(loadMsg?loadMsg+' ':'')+'Nowe zasady! Budynki w mieście nie mają już poziomów – wszystkie usługi działają od razu (Lecznica to teraz Szpital).'+(m?' '+m.name+' '+gf(m,'został','została')+' Twoim bohaterem głównym (korona) – nigdy nie zginie.':'')+' Towarzysz przy 0 PŻ leży na skraju śmierci: wygrana walka albo odwrót go ratuje, ale grozi mu szpital i trwałe urazy. Przegrana walka może go kosztować życie.'}
 if(s.v===6){S=s;s.v=7;loadMsg=(loadMsg?loadMsg+' ':'')+'Witaj w Eldarii! Królestwo Velesii, mapa krainy, zadania i towarzysze.'}
 if(s.v===7){S=s;regFix(s);s.found=s.found||{};SITE_OF_R.forEach((k,r)=>{if(s.reg.lv[r])s.found[k]=1});s.day=s.day||1;s.poi=s.poi||{};s.v=8;loadMsg=(loadMsg?loadMsg+' ':'')+'Velesia urosła! Większa mapa (przeciągaj i przybliżaj), wioski, ciekawe miejsca i mgła wojny – podróże trwają dni i odkrywają nowe miejsca. W lasach i na bagnach czają się nowe bestie: leszy, utopce, rusałki, południce, strzygi… a gdzieś stoi chata na kurzej stopce.'}
 if(s.v===8){S=s;s.roster.forEach(h=>{if(h.g!=='m'&&h.g!=='k')h.g=heroG(h)});(s.offers||[]).forEach(o=>{if(o.hero&&o.hero.g!=='m'&&o.hero.g!=='k')o.hero.g=heroG(o.hero)});(s.fallen||[]).forEach(f=>{if(!f.g)f.g=genderOf(f.name)});s.v=9;
  loadMsg=(loadMsg?loadMsg+' ':'')+'Bohaterowie i bohaterki! Każda postać ma teraz płeć (przypisaną według imienia) – kobiety mają własny wygląd, a dziennik walki odmienia słowa (zadała, padła…).'}
 if(s.v===9){S=s;s.v=10;loadMsg=(loadMsg?loadMsg+' ':'')+'Nowość: rozgałęzione wyprawy! Mapa wyprawy ma kilka ścieżek – na rozstajach sam wybierasz drogę. Widzisz tylko najbliższe komnaty, a pochodnia oświetla 2 kolejne kroki na wszystkich ścieżkach. Elity po drodze są opcjonalne: ryzyko za lepsze łupy.'+(s.exp&&!s.exp.road?' Wyprawę, która trwa, dokończysz jeszcze po staremu.':'')}
 if(s.v===SAVE_VER)return s;
 return null}
function load(){const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;try{const s=migrate(JSON.parse(raw));if(s){s.roster.forEach(upHero);return s}}catch(e){console.warn('zapis',e)}
 localStorage.removeItem(SAVE_KEY);loadMsg='Nie udało się wczytać starego zapisu – zaczynasz od nowa.';return null}
function hasSave(){return !!localStorage.getItem(SAVE_KEY)}
function best(){return +(localStorage.getItem(BEST_KEY)||0)}
function newGame(cls,name,g){S={v:SAVE_VER,gold:230,stage:1,roster:[],team:[],slots:null,exp:null,reg:{lv:[1,0,0,0,0],done:[0,0,0,0,0]},fallen:[],offers:[],inv:[],shop:[],nextId:1,nextItem:1,wins:0,loc:'weleszow',intro:0};wOk();genOffers();genShop();
 const hero=makeHero(CLASSES[cls]?cls:'wojownik',g);if(name)hero.name=name;hero.main=true;S.roster.push(hero);S.team.push(hero.id);
 S.inv.push(makeItem(1,0,'kaftan'),makeItem(1,0,'pierscien'));townOk();save();screen='camp';tab='town';townView='tavern';render()}
function makeHero(cls,g){const c=CLASSES[cls],v=()=>rnd(.9,1.1);g=g==='k'||g==='m'?g:(Math.random()<.5?'k':'m');const fn=pick(g==='k'?NAMES_K:NAMES_M);let ep=pick(EPI);if(g==='k'&&!/^z /.test(ep))ep=ep.replace(/[yi]$/,'a');
 const h={id:S.nextId++,name:fn+' '+ep,g,cls,lvl:1,xp:0,base:{hp:Math.round(c.hp*v()),atk:Math.round(c.atk*v()),def:Math.round(c.def*v()),spd:Math.round(c.spd*v()*10)/10},pts:{hp:0,atk:0,def:0,spd:0},free:0,tal:{},eq:{bron:null,zbroja:null,helm:null,amulet:null},kills:0};syncLoad(h);h.hp=stats(h).maxHp;
 return h}
/* v20: płeć bohaterów (g:'m'|'k') i imiona dopasowane do płci */
const NAMES_M=['Bogdan','Mieszko','Jarek','Zbyszko','Bolko','Radek','Witold','Leszek','Ziemowit','Przemko','Kazko','Bronek','Stach','Wojmir','Dobromir','Gniewko','Sambor','Racibor','Lech','Mirosław','Sobiesław','Borzywoj','Wszebor','Dobek'];
const NAMES_K=['Wanda','Jadwiga','Dobrawa','Kasia','Sława','Gosia','Mirka','Bożena','Ludmiła','Hela','Ola','Danuta','Bogna','Rada','Jagna','Mila','Zofia','Wiesława','Dobromiła','Lubomira','Marzanna','Świętosława','Gorzysława','Milena'];
const NAMES=NAMES_M.concat(NAMES_K),MALE_A=['Kuba','Barnaba','Bonawentura','Kosma','Zawisza','Jarema','Jaksa','Saba'];
/* płeć z imienia (pierwsze słowo): polskie imiona żeńskie kończą się na -a (wyjątki męskie w MALE_A) */
function genderOf(n){const f=String(n||'').trim().split(/\s+/)[0];return /a$/i.test(f)&&!MALE_A.includes(f)?'k':'m'}
function heroG(h){return (h.skin&&typeof SKIN!=='undefined'&&SKIN[h.skin]&&SKIN[h.skin].g)||(h.uniq&&typeof UNIQ!=='undefined'&&UNIQ[h.uniq]&&UNIQ[h.uniq].g)||genderOf(h.name)}
/* forma gramatyczna: gf(postać,'męska','żeńska'); działa dla bohatera, jednostki w walce (u.hero) i wroga (po nazwie) */
function gf(x,m,k){const g=x?(x.hero&&x.hero.g)||x.g||(x.hero?heroG(x.hero):genderOf(x.name)):'m';return g==='k'?k:m}
const EPI=['Śmiały','Ponury','Szybki','z Sanowa','Żelazny','Mądry','Cichy','Rudy','Krzepki','Bezlitosny','z Gór','Wesoły','Stary','Młody'];
function genOffers(){const keys=Object.keys(CLASSES);S.offers=[];const sh=keys.slice().sort(()=>Math.random()-.5);const L=tl('karczma');for(let i=0;i<8;i++){const h=makeHero(i<3?sh[i]:pick(keys));let x=0;if(L>=2&&Math.random()<.5)x=xpNeed(1)*(L>=3?2.2:1);if(x)gainXp(h,Math.round(x));h.hp=stats(h).maxHp;S.offers.push({hero:h,cost:Math.round(55+rnd(0,20)+(S.stage-1)*8+(h.lvl-1)*25)})}
 /* reputacja u ludu zmienia ceny werbunku */
 const m=repMul('lud',1);if(m!==1)S.offers.forEach(o=>o.cost=Math.round(o.cost*m))}
function genShop(){S.shop=[];const L=tl('kowal'),luck=Math.min(.25,S.stage*.02)+(L-1)*.05;for(let i=0;i<4+2*L;i++){const it=makeItem(S.stage,rollRar(luck),i<2?pick(BASES.filter(b=>b.s==='bron')).k:null);it.price=Math.round(it.price*1.15);S.shop.push(it)}
 S.shopLoc=null}/* shopLoc: towar kowala w innych miastach – shopLocal() w js/world/velesia-towns.js */
const getHero=id=>S.roster.find(h=>h.id===id);
const xpNeed=l=>50+l*30;
const heroSkills=h=>['atak',...syncLoad(h)];
const restCost=()=>Math.round((15+S.stage*8)*[1,1,.75,.5][tl('swiatynia')]);
const talReset=h=>Math.round((20+h.lvl*12)*(tl('swiatynia')>=3?.5:1));
function talFx(h){const o={hpP:0,atkP:0,def:0,spd:0,crit:0,critM:0,healP:0,ls:0,dodge:0,thorns:0,dtP:{},res:{}};for(const id in h.tal||{}){const n=TN[id],r=h.tal[id];if(!n||!n.e||!r)continue;for(const k in n.e){const v=n.e[k];if(typeof v==='object'){for(const q in v)o[k][q]=(o[k][q]||0)+v[q]*r}else o[k]+=v*r}}return o}
function stats(h){const b=h.base,p=h.pts;let hp=b.hp+p.hp*10,atk=b.atk+p.atk*2,def=b.def+p.def*2,spd=b.spd+p.spd*.4,crit=CLASSES[h.cls].crit*100+p.spd;
 for(const s in h.eq){const it=h.eq[s];if(it){const t=it.st;hp+=t.hp||0;atk+=t.atk||0;def+=t.def||0;spd+=t.spd||0;crit+=t.crit||0}}
 const X=talFx(h),J=injFx(h);let hpP=X.hpP+J.hpP,atkP=X.atkP+J.atkP;def+=X.def;def*=1+J.defP;spd+=X.spd+J.spd;crit+=X.crit+J.crit;spd=Math.max(1,spd);
 crit=Math.round(crit);const critOver=Math.max(0,crit-100);atkP+=critOver/100;const atk0=Math.round(atk*(1+atkP-critOver/100));
 const res=Object.assign({},CLASSES[h.cls].res||{});for(const k in X.res)res[k]=(res[k]||0)+X.res[k];for(const s in h.eq){const it=h.eq[s];if(it&&it.res)for(const k in it.res)res[k]=(res[k]||0)+it.res[k]}for(const k in res){res[k]=Math.min(RES_CAP,res[k]);if(!res[k])delete res[k]}
 const A=Math.round(atk*(1+atkP));return {maxHp:Math.round(hp*(1+hpP)),atk:A,def:Math.round(def),spd:Math.round(spd*10)/10,crit:Math.min(100,crit),critOver,critAtk:A-atk0,res,x:X,miss:J.miss}}
const heroDt=h=>CLASSES[h.cls].dt||WDT[h.eq.bron?h.eq.bron.b:DEF_W[h.cls]]||'ciete';
function changeHero(h,fn){const o=stats(h).maxHp;fn();const n=stats(h).maxHp;h.hp=Math.max(1,Math.min(n,h.hp+Math.max(0,n-o)))}
function gainXp(h,x){const out=[];h.xp+=x;while(h.xp>=xpNeed(h.lvl)){h.xp-=xpNeed(h.lvl);h.lvl++;const g=CLASSES[h.cls].grow;
 h.base.hp+=g.hp;h.base.atk+=g.atk;h.base.def+=g.def;h.base.spd=Math.round((h.base.spd+g.spd)*10)/10;h.free+=3;h.hp=stats(h).maxHp;
 out.push(`⭐ ${h.name} – poziom ${h.lvl}! +3 punkty cech, +1 punkt talentu`);const i=SKL.indexOf(h.lvl);if(i>0){const u=SK[POOL[h.cls][i]];out.push(`🔓 ${h.name} odblokowuje: ${u.icon} ${u.name}`)}}syncLoad(h);return out}
/* własny wygląd mają tylko unikalni towarzysze; dawne wyglądy rekrutów (łuczniczka, strażnik, rycerz – h.skin
   w starych zapisach) ustąpiły sprite'om klas z js/data/sprites-classes.js */
const heroSkin=h=>h.uniq?h.skin:null;
const heroSprite=h=>heroLook(h.cls,h.eq,heroSkin(h),h.g);
const heroA=h=>heroAnim(h.cls,h.eq,heroSkin(h),h.g);
/* portret całej postaci dopasowany do ramki (w całych pikselach ekranu, bez ucinania głowy i broni) */
function heroPortrait(h){const big=LH()>=520,bw=big?124:92,bh=big?196:150,d=DPR(),s=Math.max(1,Math.floor(Math.min(2.5,(bh-8)/88,bw/58)*d*2))/(2*d);
 return `<div class="big c-${h.cls}" style="width:${bw}px;height:${bh}px">${animBox(heroA(h),s,'',`position:absolute;left:${Math.round(bw/2-28*s)}px;bottom:4px`)}</div>`}
/* animowany sprite (pasek klatek jako tło) w kontenerze o rozmiarze rdzenia */
function sprDiv(A,sc,extra){return `<div class="spr" style="width:${A.fw*sc}px;height:${A.fh*sc}px;background-image:url(${A.url});background-size:${A.fw*A.n*sc}px ${A.fh*sc}px;--fw:${A.fw*sc}px;left:${-A.pl*sc}px;top:${-A.pt*sc}px;animation-delay:-${(Math.random()*1.3).toFixed(2)}s;${A.n<2?'animation:none;':''}${extra||''}"></div>`}
function animBox(A,sc,cls,style){return `<div class="${cls||''}" style="position:relative;width:${A.cw*sc}px;height:${A.ch*sc}px;${style||''}">${sprDiv(A,sc)}</div>`}
const itIc=(it,s)=>ic(it.b,s||32);
const rcol=it=>RAR[it.r].c;
const sprImg=(src,cls)=>`<img class="px ${cls||''}" src="${src}" alt="">`;
function bust(src,key,box,sc,top){const z=sprSize(key);return `<div class="bust" style="width:${box}px;height:${box}px"><img class="px" src="${src}" alt="" style="width:${z.w*sc}px;height:${z.h*sc}px;top:${top==null?-5*sc:top}px"></div>`}
