/* ===== LOS BOHATERÓW: bohater główny, skraj śmierci, szpital, trwałe urazy ===== */
const DD={second:.25,exec:.15,execKill:.35,wipe:.6,injCap:4};
const injIc=k=>INJ[k].ic||(INJ[k].m?'mind':'injury');
const injKind=k=>INJ[k].p?'trwały':'tymczasowy';
/* korona bohatera głównego – mały pixel-art rysowany w locie */
let _crownU=null;
function crownUrl(){if(_crownU)return _crownU;const M=['g...g...g','gg.ggg.gg','ggggggggg','grgggggbg','ggggggggg'],w=11,h=7,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
 const on=(X,Y)=>Y>=1&&Y<=5&&X>=1&&X<=9&&M[Y-1][X-1]!=='.';
 for(let Y=0;Y<h;Y++)for(let X=0;X<w;X++){if(on(X,Y)){const ch=M[Y-1][X-1];x.fillStyle=ch==='r'?'#d83a3a':ch==='b'?'#4a9dff':Y<=2?'#ffe9a0':Y===5?'#c08a1a':'#ffc83a';x.fillRect(X,Y,1,1)}
  else if(on(X-1,Y)||on(X+1,Y)||on(X,Y-1)||on(X,Y+1)){x.fillStyle='#1a0e08';x.fillRect(X,Y,1,1)}}
 return _crownU=c.toDataURL()}
const crown=(s)=>`<img class="px crown" src="${crownUrl()}" alt="Bohater główny" title="Bohater główny – nigdy nie ginie" style="width:${Math.round(11*(s||1.4))}px;height:${Math.round(7*(s||1.4))}px">`;
const mainOf=()=>S&&S.roster.find(h=>h.main);
/* każda kompania ma dokładnie jednego bohatera głównego */
function ensureMain(){if(!S||!S.roster.length)return;const ms=S.roster.filter(h=>h.main);if(ms.length===1)return;
 if(ms.length>1){ms.slice(1).forEach(h=>delete h.main);return}
 const b=S.roster.slice().sort((a,c)=>c.lvl-a.lvl||c.xp-a.xp||a.id-c.id)[0];b.main=true}
function fateOk(h){if(!h.inj)h.inj=[];if(h.hosp==null)h.hosp=0;if(!h.injT)h.injT={}}
/* --- urazy --- */
function addInj(h,perm){fateOk(h);if(h.inj.length>=DD.injCap)return null;const ks=Object.keys(INJ).filter(k=>!h.inj.includes(k)&&(!!INJ[k].p===!!perm));if(!ks.length)return null;const k=pick(ks);h.inj.push(k);return k}
/* --- walka: powalenie, dobicie, śmierć --- */
function sndDown(){try{SND.play('down')}catch(e){}}
function downUnit(t,by){const h=t.hero;t.alive=false;t.down=1;t.st={};t.killedBy=by;h.dd=(h.dd||0)+1;
 if(!h.main&&h.dd>=2&&Math.random()<DD.second){killUnit(t,by,'serce nie wytrzymało');return}
 log(h.main?`⚠ ${t.name} pada ${gf(h,'pokonany','pokonana')} – nie może walczyć, ale nie zginie.`:`☠ ${t.name} jest na skraju śmierci!${h.dd>=2?' Znowu…':''}`,'r');
 flt(t,h.main?'Pokonany':'Na skraju!','info');setF(t,'die');updUnit(t);sndDown()}
function killUnit(t,by,why){if(t.hero&&t.hero.main){downUnit(t,by);return}t.alive=false;t.down=0;t.dead=1;t.killedBy=by;log(`💀 ${t.name} ginie${why?' – '+why:''}!`,'r');flt(t,'Śmierć','info');die(t)}
/* wróg może spróbować dobić towarzysza leżącego na skraju śmierci */
async function tryExecute(u){if(!B||u.side!=='e')return false;const dd=B.units.filter(x=>x.side==='h'&&x.down&&!x.dead&&!x.hero.main&&canReach(u,x,'atak'));if(!dd.length||Math.random()>=DD.exec)return false;
 const t=pick(dd);log(`${u.name} próbuje dobić: ${t.name}!`,'r');flt(u,'Dobija!','info');await anim(u,[t],u.fx);impact(t,u.fx,false,u);
 if(Math.random()<DD.execKill+(t.hero.dd>=2?.2:0))killUnit(t,u.name,'dobity');else{flt(t,'Przeżywa!','info');log(`${t.name} cudem przeżywa cios!`,'g');updUnit(t)}return true}
/* --- po walce --- */
function bury(h,u){const items=Object.values(h.eq).filter(Boolean),E=S.exp;S.fallen.unshift({name:h.name,g:h.g,cls:h.cls,lvl:h.lvl,kills:h.kills,stage:B.st||S.stage,reg:E?BIOMES[E.r].n:'',exps:h.exps||0,by:u.killedBy||'nieznany',items:items.map(i=>i.n)});
 S.roster=S.roster.filter(x=>x.id!==h.id);S.team=S.team.filter(id=>id!==h.id);return {h,items}}
function battleFates(win){const fallen=[],saved=[];
 B.units.filter(u=>u.side==='h').forEach(u=>{const h=u.hero;fateOk(h);
  if(u.alive){h.hp=Math.max(1,Math.min(u.hp,stats(h).maxHp));return}
  if(h.main){u.dead=0}
  else if(!u.dead&&!win&&Math.random()<Math.min(.9,DD.wipe+(h.dd>=2?.2:0))){u.dead=1;u.killedBy=u.killedBy||'rany'}
  if(u.dead){fallen.push(bury(h,u));return}
  h.hp=1;saved.push(downAfter(h,win))});
 return {fallen,saved}}
function downAfter(h,win){const main=!!h.main,ch=main?(win?.25:.5):(.4+(h.dd>=2?.25:0)+(win?0:.2));let k=null;
 if(Math.random()<ch)k=addInj(h,Math.random()<(main?.2:.35)+(win?0:.2)+(h.dd>=2?.15:0));
 let hq=0;if(!main||!win)hq=main?1:Math.min(3,(h.dd||1)+(win?0:1));if(hq)h.hq=Math.max(h.hq||0,hq);return {h,k,hq,main}}
function fateHtml(F,dl){let o='';
 F.saved.forEach(({h,k,hq,main})=>o+=`<p ${dl()} class="injp">${main?crown(1.2):ic('skull',16)} ${esc(h.name.split(' ')[0])}: ${main?gf(h,'pokonany, ale żyje','pokonana, ale żyje'):gf(h,'ocalony z progu śmierci','ocalona z progu śmierci')}${k?` – <b>${INJ[k].n}</b> (${INJ[k].d}${INJ[k].p?', trwały':''})`:''}${hq?` · po powrocie: szpital (${hq} ${hq>1?'wyprawy':'wyprawa'})`:''}.</p>`);
 F.fallen.forEach(({h,items})=>o+=`<p ${dl()} style="color:#9a2a1a">✝ ${esc(h.name)} (${CLASSES[h.cls].name}, poz. ${h.lvl}) ${gf(h,'poległ','poległa')} na zawsze.${items.length?' Przepadł ekwipunek: '+esc(items.map(i=>i.n).join(', '))+'.':''}</p>`);return o}
/* --- szpital: odliczanie po każdej wyprawie --- */
function hospTick(){const o=[];S.roster.forEach(h=>{fateOk(h);if(h.hosp>0){h.hosp--;if(!h.hosp)o.push(discharge(h))}});return o}
function discharge(h){h.hosp=0;h.hp=stats(h).maxHp;if(!h.tr&&S.team.length<TEAM_MAX&&!S.team.includes(h.id))S.team.push(h.id);const t=h.inj.filter(k=>!INJ[k].p);let s=`${h.name.split(' ')[0]} wychodzi ze szpitala w pełni sił`;if(t.length){const k=t[0];h.inj=h.inj.filter(x=>x!==k);s+=` (wyleczono: ${INJ[k].n})`}return s}
function hospApply(){const o=hospTick().map(t=>`${ic('b_lecznica',14)} ${t}`);
 S.roster.forEach(h=>{if(h.hq>0){h.hosp=Math.max(h.hosp||0,h.hq);o.push(`${ic('b_lecznica',14)} ${esc(h.name.split(' ')[0])} trafia do szpitala na ${h.hosp} ${h.hosp>1?'wyprawy':'wyprawę'}.`);S.team=S.team.filter(id=>id!==h.id)}h.hq=0;h.dd=0});return o}
const hospCost=h=>Math.round((20+h.lvl*8)*h.hosp);
const injCost=(h,k)=>Math.round((35+h.lvl*12)*(INJ[k].m?1.3:1)*.75);
const permCost=(h,k)=>Math.round(110+h.lvl*25);
const canFight=()=>S.roster.some(h=>!h.hosp&&!h.tr);
const waitCost=()=>canFight()?15+5*S.roster.length:0;
function infirmaryHtml(){const pat=S.roster.filter(h=>h.hosp>0),list=S.roster.filter(h=>h.inj&&h.inj.length);
 let b=`<div class="note">${ic('b_lecznica',14)} Towarzysz, który spadnie do 0 PŻ, leży <b>na skraju śmierci</b>. Jeśli drużyna wygra albo się wycofa – przeżyje, ale trafi tu na kilka wypraw i może odnieść uraz. ${crown(1.2)} Bohater główny nigdy nie ginie.</div>`;
 b+=`<h2>${ic('b_lecznica',20)} Pacjenci (${pat.length})</h2>`+(pat.length?'<div class="cols">'+pat.map(h=>`<div class="card injc"><div class="av c-${h.cls}">${bust(heroSprite(h),h.cls,48,1.5)}</div><div class="info"><div class="nm">${h.main?crown(1.2):''}${esc(h.name)}</div><div class="sub">${CLASSES[h.cls].name} · poz. ${h.lvl}</div><div class="trn hosp">${ic('b_lecznica',12)} Jeszcze ${h.hosp} ${h.hosp>1?'wyprawy':'wyprawa'} w łóżku</div><div class="ir"><small>Lepsza opieka: wyjdzie od razu, w pełni sił.</small><button class="btn-small btn-gold" data-act="hospbuy" data-id="${h.id}" ${S.gold<hospCost(h)?'disabled':''}>Wypisz ${hospCost(h)} ${ic('gold',12)}</button></div></div></div>`).join('')+'</div>'
  +`<button style="width:100%;margin-top:4px" data-act="hospwait" ${S.gold<waitCost()?'disabled':''}>${ic('camp',18)} Przeczekaj w mieście – pacjentom ubywa 1 wyprawa (${waitCost()?waitCost()+' '+ic('gold',14)+' utrzymania':'za darmo'})</button>`:`<div class="empty">Łóżka są puste.</div>`);
 b+=`<h2>${ic('injury',20)} Urazy</h2>`+(list.length?'<div class="cols">'+list.map(h=>`<div class="card injc"><div class="av c-${h.cls}">${bust(heroSprite(h),h.cls,48,1.5)}</div><div class="info"><div class="nm">${h.main?crown(1.2):''}${esc(h.name)}</div><div class="sub">${CLASSES[h.cls].name} · poz. ${h.lvl}</div><div class="injl">${h.inj.map(k=>{const I=INJ[k],tr=h.injT&&h.injT[k];
   const btn=I.p?(tr?`<button class="btn-small" disabled>✔ ${I.tr}</button>`:`<button class="btn-small btn-gold" data-act="injtreat" data-id="${h.id}" data-k="${k}" ${S.gold<permCost(h,k)?'disabled':''}>${I.tr} ${permCost(h,k)} ${ic('gold',12)}</button>`):`<button class="btn-small btn-green" data-act="injheal" data-id="${h.id}" data-k="${k}" ${S.gold<injCost(h,k)?'disabled':''}>Wylecz ${injCost(h,k)} ${ic('gold',12)}</button>`;
   return `<div class="ir"><span class="inj ${I.m?'m':''} ${I.p?'p':''}">${ic(injIc(k),12)}${I.n}</span><small>${I.d}${I.p?(tr?' – złagodzone o połowę':' – trwały, można złagodzić'):''}</small>${btn}</div>`}).join('')}</div></div></div>`).join('')+'</div>':`<div class="empty">Nikt nie ma urazów. Oby tak zostało!</div>`);
 return b}
/* --- kreator bohatera głównego (nowa gra) --- */
let _cr={cls:'wojownik',name:'',g:'m'};
function creatorHtml(){if(!_cr.name)_cr.name=pick(_cr.g==='k'?NAMES_K:NAMES_M);const C=CLASSES[_cr.cls];
 return `<h2>${crown(1.6)} Twój bohater</h2><div class="sub">Bohater główny prowadzi kompanię i <b>nigdy nie ginie</b> – w najgorszym razie przegrywa walkę i wraca do sił. Towarzyszy zwerbujesz w Karczmie.</div>
 <div class="crw"><div class="crg">${Object.keys(CLASSES).map(k=>`<button class="crc ${k===_cr.cls?'on':''}" data-act="crcls" data-k="${k}">${bust(heroLook(k,{},null,_cr.g),k,40,1,-6)}<small>${CLASSES[k].name}</small></button>`).join('')}</div>
 <div class="crd"><div class="crsex" role="radiogroup" aria-label="Płeć"><span>Płeć:</span><button class="${_cr.g==='m'?'on':''}" data-act="crsex" data-g="m" aria-pressed="${_cr.g==='m'}">♂ Mężczyzna</button><button class="${_cr.g==='k'?'on':''}" data-act="crsex" data-g="k" aria-pressed="${_cr.g==='k'}">♀ Kobieta</button></div><label class="crn"><span>Imię:</span><input id="crname" maxlength="16" value="${esc(_cr.name)}" autocomplete="off"></label><div class="nm">${C.name}</div><div class="sub">${C.role?`<b>${C.role}</b><br>`:''}${C.desc}</div></div></div>
 <div class="row" style="margin-top:6px"><button class="btn-main" data-act="crgo">${ic('flag',18)} Rozpocznij przygodę</button><button data-act="close">Anuluj</button></div>`}
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el)return;const a=el.dataset.act;
 if(a==='crsex'){const i=document.getElementById('crname');const old=i?i.value.trim():_cr.name;_cr.g=el.dataset.g;_cr.name=(!old||genderOf(old)!==_cr.g)?pick(_cr.g==='k'?NAMES_K:NAMES_M):old;modal(creatorHtml());return}
 if(a==='crcls'){const i=document.getElementById('crname');if(i)_cr.name=i.value;_cr.cls=el.dataset.k;modal(creatorHtml());return}
 if(a==='crgo'){const i=document.getElementById('crname');const n=((i&&i.value)||'').replace(/\s+/g,' ').trim().slice(0,16)||pick(_cr.g==='k'?NAMES_K:NAMES_M);closeModal();loadMsg='';newGame(_cr.cls,n,_cr.g);_cr={cls:'wojownik',name:'',g:'m'};return}
 if(!S)return;const id=+el.dataset.id;
 switch(a){
 case 'hospbuy':{const h=getHero(id);if(!h||!h.hosp||S.gold<hospCost(h))return;S.gold-=hospCost(h);toast(discharge(h)+'!');save();render();break}
 case 'hospwait':{const c=waitCost();if(S.gold<c||!S.roster.some(h=>h.hosp>0))return;S.gold-=c;const o=hospTick();save();render();toast(o.length?o.join(' · '):'Mija trochę czasu – pacjenci powoli dochodzą do siebie.');break}
 case 'injtreat':{const h=getHero(id),k=el.dataset.k;if(!h||!h.inj.includes(k)||!INJ[k].p||(h.injT&&h.injT[k]))return;const c=permCost(h,k);if(S.gold<c)return;S.gold-=c;fateOk(h);changeHero(h,()=>{h.injT[k]=1});save();render();toast(`${h.name.split(' ')[0]}: ${INJ[k].tr} – kara złagodzona.`);break}
 }});
