/* ===== DWÓR KRÓLEWSKI I KANTOR „ZŁOTA WAGA” =====
   Wnętrza budynków jako sceny (jak sceny miast): po lewej obraz z postaciami i miejscami do dotknięcia,
   po prawej panel z zakładkami. Zamek królewski z salą tronową jest tylko w Weleszowie (w Kręgoszewie
   zamek to komendantura z samymi kontraktami – castleHtml w js/town/town.js). Kantor: Weleszów i filia w Sanowie.
   Tytuły kompanii (S.tyt 0–3) nadaje król w zadaniu „Na służbie Korony” (QD.krol w js/story/quests.js). */

/* --- tytuły kompanii --- */
const TYT=[{n:'Bez tytułu',d:'Król jeszcze was nie zna.'},
 {n:'Kompania z listem królewskim',d:'+1 kontrakt naraz · pożyczki do 600 zł'},
 {n:'Chorągiew Korony',d:'skarbiec do 2500 zł i 10% odsetek · skrytka na 12 przedmiotów · pożyczki do 1000 zł'},
 {n:'Obrońcy Korony',d:'żołd królewski po każdej wyprawie · +10% nagród od dworu · pożyczki do 1500 zł'}];
function nadaj(n){if((S.tyt||0)<n)S.tyt=n;save();return `<b>Nowy tytuł kompanii: ${TYT[n].n}</b> (${TYT[n].d}).`}
function tytulHtml(){const t=S.tyt||0;return `<div class="tytul">${emb(36)}<div><small>Tytuł kompanii</small><b>${TYT[t].n}</b><span>${t?TYT[t].d:'Tytuły nadaje król Przemysław w sali tronowej Zamku królewskiego w Weleszowie.'}</span>${t<3?`<em>Następny: ${TYT[t+1].n} – ${TYT[t+1].d}</em>`:''}</div></div>`}

/* --- kantor: skarbiec (złoto na procent), skrytka (przedmioty), pożyczki --- */
const vaultCap=()=>S.tyt>=2?2500:1000;
const vaultRate=()=>S.tyt>=2?.1:.08;
const stashCap=()=>S.tyt>=2?12:8;
const loanMax=()=>[300,600,1000,1500][S.tyt||0];
const LOAN_FEE=.15,LOAN_T=4,LOAN_LATE=.1;
/* S.loan={n:do spłaty, t:ile wypraw zostało do terminu} – po terminie (t<0) dług rośnie po każdej wyprawie */
const loanLate=()=>!!(S&&S.loan&&S.loan.t<0);
const zold=()=>S.tyt>=3?30+S.stage*8:0;
/* po każdej wyprawie (expEndTown): odsetki w skarbcu, termin pożyczki, żołd Obrońców Korony */
function bankTick(){const o=[],v=Math.max(0,Math.min(vaultCap()-S.vault,Math.floor(S.vault*vaultRate())));S.vault+=v;if(v)o.push(`${ic('vault',14)} Skarbiec: +${v} zł odsetek`);
 if(S.loan){S.loan.t--;if(S.loan.t<0){const a=Math.max(10,Math.round(S.loan.n*LOAN_LATE));S.loan.n+=a;rep('dwor',-2);o.push(`${ic('vault',14)} Kantor: pożyczka po terminie – dług rośnie o ${a} zł (do spłaty ${S.loan.n} zł)`)}
  else if(S.loan.t===0)o.push(`${ic('vault',14)} Kantor: termin spłaty pożyczki (${S.loan.n} zł) mija przed następną wyprawą`)}
 const z=zold();if(z){S.gold+=z;o.push(`${ic('gold',14)} Żołd królewski: +${z} zł`)}return o}
function vaultHtml(){const cap=vaultCap(),rate=Math.round(vaultRate()*100);
 return `<div class="vault"><div class="vv">${ic('vault',32)}<span><b>${S.vault} / ${cap} zł</b><small>Po każdej wyprawie skarbiec przynosi ${rate}% odsetek (do limitu). Złoto w skarbcu nie przepada w drodze.</small></span></div>
 <div class="row"><button class="btn-small" data-act="vin" data-n="50" ${S.gold<1||S.vault>=cap?'disabled':''}>Wpłać 50</button><button class="btn-small" data-act="vin" data-n="all" ${S.gold<1||S.vault>=cap?'disabled':''}>Wpłać max</button><button class="btn-small" data-act="vout" data-n="50" ${S.vault<1?'disabled':''}>Wypłać 50</button><button class="btn-small" data-act="vout" data-n="all" ${S.vault<1?'disabled':''}>Wypłać wszystko</button></div></div>`}
function stashHtml(){const cap=stashCap(),full=S.stash.length>=cap,inv=S.inv.slice().sort((a,b)=>b.r-a.r);
 let b=`<div class="note">${ic('bag',14)} Skrytka trzyma przedmioty, które nie mieszczą się w plecaku – bezpiecznie i za darmo. Miejsca: <b>${S.stash.length}/${cap}</b> · plecak: ${S.inv.length}/${INV_MAX}</div>`;
 b+=`<h3>${ic('vault',16)} W skrytce</h3>`+(S.stash.length?'<div class="cols">'+S.stash.map(it=>itemHtml(it,`<button class="btn-small" data-act="stout" data-id="${it.id}" ${S.inv.length>=INV_MAX?'disabled':''}>Wyjmij</button>`)).join('')+'</div>':'<div class="empty">Skrytka jest pusta.</div>');
 b+=`<h3>${ic('bag',16)} W plecaku</h3>`+(inv.length?'<div class="cols">'+inv.map(it=>itemHtml(it,`<button class="btn-small" data-act="stin" data-id="${it.id}" ${full?'disabled':''}>Schowaj</button>`)).join('')+'</div>':'<div class="empty">Plecak jest pusty.</div>');return b}
function loanHtml(){const L=S.loan,mx=loanMax();
 if(L){const late=L.t<0;return `<div class="vault loan ${late?'late':''}"><div class="vv">${ic('contract',32)}<span><b>Do spłaty: ${L.n} zł</b><small>${late?`Po terminie! Po każdej wyprawie dług rośnie o ${Math.round(LOAN_LATE*100)}%, a dwór traci do was zaufanie.`:L.t===0?'Termin mija – spłać przed następną wyprawą.':`Termin: jeszcze ${L.t} ${L.t===1?'wyprawa':L.t<5?'wyprawy':'wypraw'}.`}</small></span></div>
  <div class="row"><button class="btn-small" data-act="lpay" data-n="50" ${S.gold<1?'disabled':''}>Spłać 50</button><button class="btn-small btn-gold" data-act="lpay" data-n="all" ${S.gold<1?'disabled':''}>Spłać ${Math.min(S.gold,L.n)===L.n?'całość':'ile się da'}</button></div></div>`}
 const amts=[100,300,mx].filter((v,i,a)=>v<=mx&&a.indexOf(v)===i);
 return `<div class="note">${ic('contract',14)} Pożyczka bez zastawu – poręką jest sława kompanii. Prowizja ${Math.round(LOAN_FEE*100)}%, spłata w ciągu ${LOAN_T} wypraw. Limit: <b>${mx} zł</b>${(S.tyt||0)<3?' (więcej z królewskim tytułem)':''}.</div>
 <div class="loans">${amts.map(a=>`<button data-act="ltake" data-n="${a}">${ic('gold',18)} Pożycz ${a} zł<small>oddasz ${Math.round(a*(1+LOAN_FEE))} zł</small></button>`).join('')}</div>`}

/* --- sceny wnętrz: hotspoty [l,t,w,h, etykieta x,y] w % obrazu 16:9; f – postacie (rozmowy z TALK: p = portret, w = miejsce) --- */
const HALL={
 castle:{img:'h_zamek',n:'Zamek królewski',sub:'sala tronowa',w:'zamek',tabs:[['dwor','Dwór','b_zamek'],['kanc','Kancelaria','contract']],
  hs:[{t:'kanc',r:[43,82,11,12,48.5,84],n:'Kancelaria – kontrakty',ic:'contract'}],
  f:[{p:'krol',s:'krol_s',x:66.6,y:35,h:11},{p:'kaplan',s:'kaplan',x:30,y:33,h:15},{p:'rycerz',s:'rycerz',x:85,y:61,h:14,f:1}]},
 bank:{img:'h_kantor',n:'Kantor „Złota Waga”',sub:'skarbiec · skrytka · pożyczki',w:'bank',tabs:[['skarb','Skarbiec','vault'],['skryt','Skrytka','bag'],['pozy','Pożyczki','contract']],
  hs:[{t:'skarb',r:[74,12,12,24,80,14],n:'Skarbiec',ic:'vault'},{t:'skryt',r:[42,24,26,18,62,25],n:'Lada – skrytki',ic:'bag'},{t:'pozy',r:[13,27,16,21,21,29],n:'Pożyczki',ic:'contract'}],
  f:[{p:'bankier',s:'bankier_s',x:50,y:47,h:10}]},
 bank_s:{img:'h_kantor_s',n:'Filia „Złotej Wagi”',sub:'Sanów, przy porcie',w:'bank',tabs:[['skarb','Skarbiec','vault'],['skryt','Skrytka','bag'],['pozy','Pożyczki','contract']],
  hs:[{t:'skarb',r:[41,25,9,15,45,27],n:'Skarbiec',ic:'vault'},{t:'skryt',r:[54,32,22,36,68,35],n:'Lada – skrytki',ic:'bag'},{t:'pozy',r:[27,38,17,19,34,41],n:'Pożyczki',ic:'contract'}],f:[]}};
let hallTab={castle:'dwor',bank:'skarb'};
const hallGrp=k=>k==='castle'?'castle':'bank';
/* czy widok budynku (townView) ma tu wnętrze-scenę */
function hallKind(v){if(!S||!v)return null;const here=S.loc||'weleszow';if(v==='castle')return here==='weleszow'?'castle':null;if(v==='bank')return hasSvc('bank')?(here==='sanow'?'bank_s':'bank'):null;return null}
const talkAt=(k,p,w)=>(TALK[k]||[]).findIndex(t=>t.p===p&&t.in===w&&(!t.when||t.when()));
function hallScn(k){const D=HALL[k],town=S.loc||'weleszow',g=hallGrp(k);let h=`<img class="px sbg" src="${VART18[D.img]}" alt="" draggable="false">`;
 const al=t=>g==='castle'?(t==='kanc'&&S.con.act.some(c=>c.ok)):(t==='pozy'&&loanLate());
 D.hs.forEach(o=>{const r=o.r;h+=`<button class="shot" data-act="hltab" data-g="${g}" data-t="${o.t}" aria-label="${o.n}" style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%"></button><button class="tlab slab${r[4]>76?' sr':r[4]<16?' sl':''}${hallTab[g]===o.t?' on':''}" data-act="hltab" data-g="${g}" data-t="${o.t}" style="left:${r[4]}%;top:${r[5]}%">${ic(o.ic,12)}<b>${o.n}</b>${al(o.t)?'<em>!</em>':''}</button>`});
 D.f.forEach(o=>{const i=talkAt(town,o.p,D.w);if(i<0)return;const t=TALK[town][i],nw=t.nw&&t.nw();
  h+=`<button class="snpc hnpc" data-act="talk" data-k="${town}" data-i="${i}" style="left:${o.x}%;top:${o.y}%;height:${o.h}%" aria-label="${t.who}">${sprFrame(o.s,o.f)}</button><button class="tlab slab hname" data-act="talk" data-k="${town}" data-i="${i}" style="left:${o.x}%;top:${o.y-o.h}%">${ic('event',11)}<b>${t.who.split(',')[0]}</b>${nw?'<em>!</em>':''}</button>`});
 return `<div class="scn">${h}</div>`}
function hallSide(k){const D=HALL[k],g=hallGrp(k),t=hallTab[g],town=S.loc||'weleszow';
 let b=`<div class="subtabs hltabs">${D.tabs.map(([v,n,i])=>{const al=g==='castle'?(v==='kanc'&&S.con.act.some(c=>c.ok))||(v==='dwor'&&talkNew(town,'zamek')):(v==='pozy'&&loanLate())||(v==='skarb'&&talkNew(town,'bank'));return `<button class="${t===v?'on':''}" data-act="hltab" data-g="${g}" data-t="${v}">${ic(i,16)} ${n}${al?' <em>!</em>':''}</button>`}).join('')}</div>`;
 if(g==='castle'){
  if(t==='kanc')b+=`<p class="nd">Kanclerz Światosław rozdaje zlecenia Korony: bestie, zbóje i leża potworów. Nagrody wypłaca skarbiec zamkowy.</p>`+castleHtml();
  else{b+=tytulHtml();if(qAt('zamek'))b+=`<div class="note ok">${ic('flag',14)} Król czeka na wasz raport – dotknij go w sali tronowej albo poniżej.</div>`;
   b+=talkHtml(town,'zamek').replace(/<h3>.*?<\/h3>/,`<h3>${ic('event',16)} Dwór</h3>`)}}
 else{
  if(t==='skryt')b+=stashHtml();
  else if(t==='pozy')b+=loanHtml();
  else{b+=`<p class="nd">${k==='bank_s'?'Filia przy porcie: flisacy i kupcy wpłacają tu złoto, zanim ruszą w drogę. Wszystko, co wpłacisz, czeka też w kantorze w Weleszowie.':'Bankier Aureliusz liczy szybciej, niż mag rzuca zaklęcia. Złoto w skarbcu pracuje dla kompanii po każdej wyprawie.'}</p>`+vaultHtml();
   if(qAt('bank'))b+=`<div class="note ok">${ic('flag',14)} Bankier Aureliusz ma do was sprawę.</div>`;
   b+=talkHtml(town,'bank')}}
 return b}
const hallIc=k=>k==='castle'?'b_zamek':'vault';
function renderHall(v){townOk();const k=hallKind(v),D=HALL[k],N=NODES[S.loc||'weleszow'],app=document.getElementById('app');
 app.innerHTML=`<div class="townv stown hallv"><div class="ttop"><button class="btn-small" data-act="town" data-v="">${ic('back',18)}<span class="lbl"> ${N.n}</span></button>
 <h2>${ic(hallIc(k),20)} ${D.n} <small class="tsub">${D.sub}</small></h2><button class="btn-small" data-act="journal">${ic('contract',18)}<span class="lbl"> Dziennik</span>${qBadge()}</button><span class="pill gold">${ic('gold',18)} ${S.gold}</span><button class="btn-small" data-act="menu" aria-label="Menu">${ic('gear',18)}</button><button class="btn-main tgo" data-act="map" ${S.team.length?'':'disabled'}>${ic(S.exp?'walk':'map',20)} Mapa</button></div>
 <div class="stbody"><div class="stpano hasscn"><img class="sblur" src="${VART18[D.img]}" alt="" aria-hidden="true">${hallScn(k)}</div><div class="stside">${hallSide(k)}</div></div></div>`}
/* --- obsługa dotyku --- */
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||!S)return;const a=el.dataset.act,iid=el.dataset.id;
 switch(a){
 case 'hltab':hallTab[el.dataset.g]=el.dataset.t;render();break;
 case 'vin':{const n=Math.min(S.gold,vaultCap()-S.vault,el.dataset.n==='all'?1e9:50);if(n<=0)return;S.gold-=n;S.vault+=n;save();render();break}
 case 'vout':{const n=Math.min(S.vault,el.dataset.n==='all'?1e9:50);S.vault-=n;S.gold+=n;save();render();break}
 case 'stin':{const i=S.inv.findIndex(x=>x.id===iid);if(i<0||S.stash.length>=stashCap())return;S.stash.push(S.inv.splice(i,1)[0]);save();render();break}
 case 'stout':{const i=S.stash.findIndex(x=>x.id===iid);if(i<0||S.inv.length>=INV_MAX)return;S.inv.push(S.stash.splice(i,1)[0]);save();render();break}
 case 'ltake':{const n=+el.dataset.n;if(S.loan||!(n>0)||n>loanMax())return;S.loan={n:Math.round(n*(1+LOAN_FEE)),t:LOAN_T};S.gold+=n;save();render();toast(`Pożyczka: +${n} zł. Do spłaty ${S.loan.n} zł w ciągu ${LOAN_T} wypraw.`);break}
 case 'lpay':{const L=S.loan;if(!L)return;const n=Math.min(S.gold,L.n,el.dataset.n==='all'?1e9:50);if(n<=0)return;S.gold-=n;L.n-=n;let t=`Spłacono ${n} zł.`;if(L.n<=0){const ok=L.t>=0;S.loan=null;if(ok)rep('dwor',1);t='Pożyczka spłacona!'+(ok?' Aureliusz kłania się nisko. (Dwór +1)':'')}save();render();toast(t);break}
 }});
