/* ===== v18: sceny miast, tablice ogłoszeń, plotki, sklepy lokalne, nowe zadania i zdarzenia ===== */
/* --- portret z mapy sprite'ów (straż) --- */
const sprFrame=key=>{const o=(typeof HSPR!=='undefined'&&HSPR[key])||GFX.S[key];if(!o)return '';const n=o.n||7,fw=o.fw||o.w/n;return `<i class="sfr" style="aspect-ratio:${fw}/${o.h};background-image:url(${o.u});background-size:${n*100}% 100%"></i>`};
/* --- sceny: hotspoty w % obrazu 16:9 (l,t,w,h, etykieta x,y) --- */
const SCN={
 weleszow:{img:'t_weleszow',b:{zamek:[34,0,32,16,50,13],cmentarz:[4,10,16,16,12,25],karczma:[14,28,16,20,22,45],lecznica:[33,28,12,15,39,41],gildia:[60,20,16,17,68,35],swiatynia:[73,14,15,34,80,47],zaklinacz:[88,30,12,32,93,60],targ:[38,40,22,18,47,57],koszary:[0,44,15,26,8,67],kowal:[12,64,20,24,22,86],alchemik:[28,55,13,17,34,70]},
  x:[{v:'tablica',r:[56,54,12,16,62,67]}],g:[{s:'straznik',x:44,y:30,h:12},{s:'rycerz',x:57,y:30,h:13},{s:'straznik',x:70,y:76,h:12}]},
 dabrowa:{img:'t_dabrowa',b:{karczma:[10,6,20,24,22,30],alchemik:[68,22,22,26,79,47],szept:[70,58,22,30,80,86]},x:[{v:'tablica',r:[36,64,12,18,42,82]}],g:[{s:'straznik',x:56,y:62,h:14}]},
 kregoszew:{img:'t_kregoszew',b:{zamek:[38,2,24,28,50,27],kowal:[8,26,20,22,18,45],koszary:[68,16,24,28,80,42],karczma:[14,48,20,24,24,70]},x:[{v:'tablica',r:[51,56,9,12,56,69]}],g:[{s:'straznik',x:44,y:86,h:13},{s:'straznik',x:62,y:86,h:13},{s:'rycerz',x:38,y:44,h:13}]},
 sanow:{img:'t_sanow',b:{karczma:[2,12,28,36,16,46],gildia:[38,0,24,28,50,25],targ:[50,30,24,28,62,56]},x:[{v:'osobl',r:[82,18,18,34,90,50]},{v:'tablica',r:[38,46,11,16,44,62]}],g:[{s:'straznik',x:30,y:44,h:12},{s:'luczniczka',x:70,y:80,h:12}]},
 kurhanow:{img:'t_kurhanow',b:{karczma:[4,32,18,24,13,56],cmentarz:[50,4,46,50,68,42],starszy:[34,48,18,24,44,70]},x:[{v:'tablica',r:[27,34,11,15,33,50]}],g:[{s:'straznik',x:22,y:74,h:12}]}};
const XNAME={tablica:['Tablica ogłoszeń','contract'],osobl:['Kupiec osobliwości','bag']};
function scnHtml(k,inner){const D=SCN[k];if(!D)return '';const T=TOWNS[k]||{};let h=`<img class="px sbg" src="${VART18[D.img]}" alt="" draggable="false">`;
 const box=(v,r,lab,i,al,act,dk)=>`<button class="shot" data-act="${act||'town'}" ${dk?`data-k="${dk}"`:`data-v="${v}"`} aria-label="${lab}" style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%"></button><button class="tlab slab${r[4]>76?' sr':r[4]<16?' sl':''}" data-act="${act||'town'}" ${dk?`data-k="${dk}"`:`data-v="${v}"`} style="left:${r[4]}%;top:${r[5]}%">${ic(i,12)}<b>${lab}</b>${al?'<em>!</em>':''}</button>`;
 for(const b in D.b){if(k!=='weleszow'&&!(T.svc||[]).includes(b))continue;const B=BUILD[b]||XB[b];h+=box(B.v||b,D.b[b],bName(b),B.ic,BUILD[b]&&bldAlert(b))}
 (D.x||[]).forEach(o=>{const X=XNAME[o.v];h+=box(o.v,o.r,X[0],X[1],o.v==='tablica'&&tabAlert())});
 (D.g||[]).forEach((g,i)=>{h+=`<button class="snpc" data-act="rumor" data-i="${i}" style="left:${g.x}%;top:${g.y}%;height:${g.h}%" aria-label="Strażnik">${sprFrame(g.s)}<span>${ic('event',10)}</span></button>`});
 return `<div class="scn">${h}</div>`}
const _rstL=renderSmallTown;renderSmallTown=function(){_rstL();const k=S.loc;if(!NODES[k]||NODES[k].ty!=='town')return;
 const sv=document.querySelector('.stside .svcs');if(sv&&!SCN[k])sv.insertAdjacentHTML('beforeend',`<button class="svc" data-act="town" data-v="tablica">${ic('contract',28)}<span><b>Tablica ogłoszeń</b><small>zlecenia na bestie</small></span>${tabAlert()?'<em>!</em>':''}</button>`);
 if(sv&&k==='sanow')sv.insertAdjacentHTML('beforeend',`<button class="svc" data-act="town" data-v="osobl">${ic('bag',28)}<span><b>Kupiec osobliwości</b><small>rzadkie przedmioty</small></span></button>`);
 if(sv&&SCN[k])sv.insertAdjacentHTML('beforeend',`<button class="svc" data-act="town" data-v="tablica">${ic('contract',28)}<span><b>Tablica ogłoszeń</b><small>zlecenia na bestie</small></span>${tabAlert()?'<em>!</em>':''}</button>`);
 const p=document.querySelector('.stpano');if(p&&SCN[k]){p.classList.add('hasscn');p.style.backgroundImage='none';p.insertAdjacentHTML('afterbegin',`<img class="sblur" src="${VART18[SCN[k].img]}" alt="" aria-hidden="true">`+scnHtml(k))}};
/* Weleszów: nowa mapa miasta (przewijana poziomo) */
layoutTown=function(){const sc=document.getElementById('tscroll'),m=document.getElementById('tmap');if(!sc||!m)return;const H=sc.clientHeight,W=Math.round(H*16/9);
 m.style.width=W+'px';m.style.height=H+'px';const D=SCN.weleszow;let h=`<img class="px tbase" src="${VART18.t_weleszow}" style="width:${W}px;height:${H}px" alt="" draggable="false">`;
 for(const k in D.b){const B=BUILD[k],r=D.b[k],hot=bldAlert(k);h+=`<button class="thit" data-act="tbld" data-k="${k}" aria-label="${B.n}" style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%;z-index:${400+r[5]}"></button>`;
  h+=`<button class="tlab" data-act="tbld" data-k="${k}" style="left:${r[4]}%;top:${r[5]}%;z-index:${600+r[5]}">${ic(B.ic,11)}<b>${B.n}</b><span>${B.t}</span>${hot?'<em>!</em>':''}</button>`}
 D.x.forEach(o=>{const X=XNAME[o.v],r=o.r;h+=`<button class="tlab tx" data-act="town" data-v="${o.v}" style="left:${r[4]}%;top:${r[5]}%;z-index:${600+r[5]}">${ic(X[1],11)}<b>${X[0]}</b><span>zlecenia</span>${tabAlert()?'<em>!</em>':''}</button>`});
 D.g.forEach((g,i)=>{h+=`<button class="snpc" data-act="rumor" data-i="${i}" style="left:${g.x}%;top:${g.y}%;height:${g.h}%;z-index:${500+g.y}" aria-label="Strażnik">${sprFrame(g.s)}<span>${ic('event',10)}</span></button>`});
 m.innerHTML=h;{let bl=sc.querySelector('.sblur');if(W<sc.clientWidth-2){if(!bl)sc.insertAdjacentHTML('afterbegin',`<img class="sblur" src="${VART18.t_weleszow}" alt="" aria-hidden="true">`)}else if(bl)bl.remove()}
 if(_tScroll==null)_tScroll=Math.max(0,W*.5-sc.clientWidth/2);sc.scrollLeft=_tScroll;
 const ls=[...m.querySelectorAll('.tlab')].sort((a,b)=>a.offsetTop-b.offsetTop),R=[];ls.forEach(e=>{let r=e.getBoundingClientRect();for(let n=0;n<4;n++){const o=R.find(q=>r.left<q.right&&q.left<r.right&&r.top<q.bottom&&q.top<r.bottom);if(!o)break;e.style.top=(e.offsetTop+(o.bottom-r.top)/UIZ+1)+'px';r=e.getBoundingClientRect()}R.push(r)})};
/* --- plotki od strażników --- */
const RUMOR={
 weleszow:[{t:'Na zamku gadają, że w Mglistych Dolinach na wschodzie ktoś widział strzygę. Kobieta o dwóch sercach – jedno ludzkie, drugie… nie.',fx:()=>{S.found.doliny=1}},{t:'Rotmistrz Zawisza z Kręgoszewa szuka śmiałków do chorągwi skrzydlatych. Ale bierze tylko najlepszych.'},{t:'Kupcy z Sanowa przywożą rzeczy, jakich nie zobaczysz u kowala. Za odpowiednią cenę.'}],
 dabrowa:[{t:'W Wilczych Jarach na północy wyje coś większego niż wilk. Pełnia za trzy dni…',fx:()=>{S.found.jary=1;regOk();if(!S.reg.lv[8])S.reg.lv[8]=1}},{t:'Nie zbieraj grzybów koło starego młyna po zmroku. Wodnik nie lubi gości.',fx:()=>{S.found.mlyn=1}},{t:'Wila wie więcej, niż mówi. Zapytaj ją o chatę na kurzej stopce, jeśli się odważysz.'}],
 kregoszew:[{t:'Ze strażnicy na wschodzie widać pół królestwa. I Smoczą Jamę też.',fx:()=>{S.found.straznica=1}},{t:'Biesy na rozstajach proponują układy. Kto przyjmie – traci więcej, niż zyskuje.'},{t:'Bazyliszek w górach zamienia w kamień spojrzeniem. Weźcie lustro. Albo kapłana.'}],
 sanow:[{t:'Córka rybaka Mirosza zniknęła nad Rozlewiskami. Rusałki, mówię wam – śpiewały całą noc.',fx:()=>{S.found.rozlewiska=1}},{t:'W samo południe nie wychodź w pole. Południca pyta, a kto nie odpowie – temu kręci głową.',fx:()=>{S.found.pola=1;regOk();if(!S.reg.lv[6])S.reg.lv[6]=1}},{t:'Łowczyni przy porcie mówi, że w Olszynowie płacą za każdą zabitą bestię.',fx:()=>{S.found.olszynow=1}}],
 kurhanow:[{t:'Za kurhanami, w Ruinach Asterionu, runy świecą nocą. Starszy każe trzymać się z daleka.',fx:()=>{S.found.ruiny=1}},{t:'Nie zostawiaj zmarłego bez kamienia na piersi. Inaczej wstanie jako strzyga.'}]};
function rumor(i){const k=S.loc,L=RUMOR[k]||[];if(!L.length)return;const r=L[(S.day+i)%L.length];const g=(SCN[k]&&SCN[k].g[i])||{s:'straznik'};const before=JSON.stringify(S.found);if(r.fx)r.fx();routeFix();save();const nw=JSON.stringify(S.found)!==before;
 modal(`<div class="dlg"><div class="dpor"><img class="px" src="${VART['n_'+g.s]||VART.n_straznik}" alt=""></div><div class="dtx"><h2>${g.s==='rycerz'?'Rycerz z gwardii':g.s==='luczniczka'?'Łowczyni z portu':'Strażnik miejski'}</h2><p>„${r.t}”</p>${nw?`<p class="note ok">${ic('map',14)} Nowe miejsce na mapie Velesii.</p>`:''}</div></div><button class="btn-main" data-act="dclose">Dzięki</button>`)}
/* --- tablica ogłoszeń: powtarzalne zlecenia na bestie --- */
const TABM={weleszow:['bies','wilkolak','strzyga','szeptun','bazyliszek'],dabrowa:['wilk','dzik','goblin','borowy','pajak'],kregoszew:['goblin','bies','wilkolak','nietoperz','bazyliszek'],sanow:['rusalka','utopiec','poludnica','szlam','pajak'],kurhanow:['strzyga','szeptun','nietoperz','pajak','szlam'],brzezina:['wilk','dzik','goblin'],olszynow:['poludnica','strzyga','wilkolak','dzik'],mokradla:['utopiec','rusalka','szlam','nietoperz']};
const TABR={weleszow:'dwor',kregoszew:'dwor',dabrowa:'lud',sanow:'lud',brzezina:'lud',olszynow:'lud',mokradla:'lud',kurhanow:'duchy'};
const TAB_MAX=3;
function tabOk(){if(!S.tab)S.tab={act:[],av:{},id:1}}
function tabGen(k){tabOk();const L=(TABM[k]||TABM.dabrowa).filter(e=>ENEMIES[e]);const used=(S.tab.av[k]||[]).map(c=>c.e);const pool=L.filter(e=>!used.includes(e));const e=pick(pool.length?pool:L);const n=e==='wilkolak'||e==='bazyliszek'||e==='strzyga'?2+Math.floor(Math.random()*2):3+Math.floor(Math.random()*4);
 const hp=ENEMIES[e].hp||40;return {id:S.tab.id++,t:k,e,n,g:Math.round(n*(8+S.stage*3)*(1+Math.min(1.5,hp/120))),rp:TABR[k]||'lud'}}
function tabAv(k){tabOk();const a=S.tab.av[k]||(S.tab.av[k]=[]);while(a.length<3)a.push(tabGen(k));return a}
const tabProg=c=>Math.min(c.n,(S.kills[c.e]||0)-c.b);
const tabAlert=()=>!!(S&&S.tab&&S.tab.act.some(c=>tabProg(c)>=c.n));
const whereE=e=>{const n=BIOMES.filter((B,r)=>B.pool.some(p=>p[1]===e)&&(r<5||S.found[SITE_OF_R[r]])).map(B=>B.n);return n.length?n.slice(0,2).join(', '):'w drodze i w dziczy'};
function tabHtml(){const k=S.loc,N=NODES[k];tabOk();const av=tabAv(k);
 let b=`<div class="bhead"><div class="bimg">${ic('contract',44)}</div><div class="binf"><div class="row1"><button class="btn-small" data-act="town" data-v="">${ic('back',16)}<span class="lbl"> ${N.n}</span></button><h2>${ic('contract',20)} Tablica ogłoszeń</h2></div><div class="sub">Zlecenia mieszkańców na bestie z okolicy. Zabicia liczą się na wyprawach i w drodze. Zapłatę odbierzesz przy dowolnej tablicy (maks. ${TAB_MAX} zlecenia naraz).</div></div></div>`;
 const row=(c,act)=>{const E=ENEMIES[c.e],p=act?tabProg(c):0,ok=act&&p>=c.n;return `<div class="item tabc ${ok?'ok':''}"><div class="ii">${eImg(c.e,40)}</div><div class="inf"><div class="inm">${E.name||E.n||c.e} ×${c.n}${act?` <span class="cnt">${p}/${c.n}</span>`:''}</div><div class="sub">${NODES[c.t]?NODES[c.t].n:''} · ${whereE(c.e)} · ${c.g} zł, ${REPN[c.rp].n} +3</div></div>${act?(ok?`<button class="btn-small btn-gold" data-act="tabclaim" data-id="${c.id}">Odbierz</button>`:`<button class="btn-small" data-act="tabdrop" data-id="${c.id}" aria-label="Porzuć">${ic('back',14)}</button>`):`<button class="btn-small" data-act="tabtake" data-id="${c.id}" ${S.tab.act.length>=TAB_MAX?'disabled':''}>Przyjmij</button>`}</div>`};
 b+=`<h2>${ic('flag',18)} Przyjęte (${S.tab.act.length}/${TAB_MAX})</h2>`+(S.tab.act.length?'<div class="cols">'+S.tab.act.map(c=>row(c,1)).join('')+'</div>':'<div class="empty">Brak przyjętych zleceń.</div>');
 b+=`<h2>${ic('contract',18)} Ogłoszenia: ${N.n}</h2><div class="cols">`+av.map(c=>row(c,0)).join('')+'</div>';return b}
/* --- kupiec osobliwości (Sanów) --- */
function osoblOk(){if(!S.osob||S.osob.st!==S.stage||S.day-S.osob.d>=6){S.osob={st:S.stage,d:S.day||1,it:Array.from({length:4},()=>{const it=makeItem(S.stage+1,rollRar(.3,2));it.price=Math.round(it.price*1.45);return it})}}}
function osoblHtml(){osoblOk();const N=NODES[S.loc];let b=`<div class="bhead"><div class="bimg">${prtImg('kupiec')}</div><div class="binf"><div class="row1"><button class="btn-small" data-act="town" data-v="">${ic('back',16)}<span class="lbl"> ${N.n}</span></button><h2>${ic('bag',20)} Kupiec osobliwości</h2></div><div class="sub">Rzeczy z Meredii, Avarii i zza morza – tylko rzadkie i lepsze. Towar zmienia się co kilka dni.</div></div></div>`;
 b+=S.osob.it.length?'<div class="cols">'+S.osob.it.map((it,i)=>itemHtml(it,`<button class="btn-small btn-gold" data-act="osbuy" data-i="${i}" ${S.gold<it.price||S.inv.length>=INV_MAX?'disabled':''}>${it.price} ${ic('gold',14)}</button>`)).join('')+'</div>':'<div class="empty">Wszystko wyprzedane. Wróć za kilka dni.</div>';return b}
const XVIEW={tablica:()=>S.loc&&NODES[S.loc]&&NODES[S.loc].ty==='town'?tabHtml():'',osobl:()=>S.loc==='sanow'?osoblHtml():''};
/* --- kowal: towar zależny od miasta --- */
function shopLocal(){const k=S.loc;if(S.shopLoc===k)return;const L=tl('kowal'),luck=Math.min(.25,S.stage*.02)+(L-1)*.05;S.shop=[];
 if(k==='kregoszew'){const B=BASES.filter(b=>b.s==='bron'||b.s==='zbroja'||b.s==='helm');for(let i=0;i<8;i++){const it=makeItem(S.stage,rollRar(luck),pick(B).k);it.price=Math.round(it.price*1.05);S.shop.push(it)}}
 else{for(let i=0;i<6+2*L;i++){const it=makeItem(S.stage+(i<2?1:0),rollRar(luck+.1,i<2?1:0),i<2?pick(BASES.filter(b=>b.s==='bron')).k:null);it.price=Math.round(it.price*1.2);S.shop.push(it)}}
 S.shopLoc=k;save()}
const _genShopL=genShop;genShop=function(){_genShopL();if(S)S.shopLoc=null};
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||!S)return;const a=el.dataset.act;
 if((a==='town'&&el.dataset.v==='smith')||(a==='tbld'&&el.dataset.k==='kowal'))shopLocal();
 if(a==='rumor'){rumor(+el.dataset.i);e.stopImmediatePropagation();return}
 if(a==='tabtake'){tabOk();const id=+el.dataset.id,k=S.loc,av=tabAv(k),i=av.findIndex(c=>c.id===id);if(i<0||S.tab.act.length>=TAB_MAX)return;const c=av.splice(i,1)[0];c.b=S.kills[c.e]||0;S.tab.act.push(c);av.push(tabGen(k));save();render();toast('Zlecenie przyjęte');e.stopImmediatePropagation();return}
 if(a==='tabdrop'){const id=+el.dataset.id;S.tab.act=S.tab.act.filter(c=>c.id!==id);save();render();e.stopImmediatePropagation();return}
 if(a==='tabclaim'){const id=+el.dataset.id,c=S.tab.act.find(x=>x.id===id);if(!c||tabProg(c)<c.n)return;S.tab.act=S.tab.act.filter(x=>x!==c);S.gold+=c.g;rep(c.rp,3);S.tabDone=(S.tabDone||0)+1;save();render();toast(`Zlecenie wykonane: +${c.g} zł, ${REPN[c.rp].n} +3`);e.stopImmediatePropagation();return}
 if(a==='osbuy'){osoblOk();const i=+el.dataset.i,it=S.osob.it[i];if(!it||S.gold<it.price||S.inv.length>=INV_MAX)return;S.gold-=it.price;S.osob.it.splice(i,1);S.inv.push(it);save();render();toast('Kupiono: '+it.n);e.stopImmediatePropagation();return}
},true);
/* --- Jaromir: grafika husarza na koniu przy dołączeniu --- */
const _addUniqL=addUniq;addUniq=function(k){const r=_addUniqL(k);return k==='husarz'&&/dołącza/.test(r)?`<img class="px evart" src="${VART.e_husarz}" alt="Husarz na koniu"><br>`+r:r};
/* --- nowe krainy: odkrycie = dostęp --- */
const OPEN_ON_FIND=[5,6,8];
const _wOkL=wOk;wOk=function(){_wOkL();if(!S||!S.reg)return;OPEN_ON_FIND.forEach(r=>{const k=SITE_OF_R[r];if(k&&S.found[k]&&!S.reg.lv[r])S.reg.lv[r]=1})};
/* --- obóz w ciekawym miejscu: przyciski zadań --- */
const _rFieldL=renderField;renderField=function(){_rFieldL();const k=S.loc,s=document.querySelector('.stside');if(!s)return;const b=[];
 for(const id of qActive()){const st=qSt(id);if(st&&st.obj&&st.obj.go===k&&st.obj.dlg)b.push(`<button class="btn-main" data-act="qdlg" data-d="${st.obj.dlg}">${ic('contract',20)} ${QD[id].n}</button>`)}
 if(b.length)s.insertAdjacentHTML('beforeend',b.join(''))};
/* ===== NOWE ZADANIA ===== */
Object.assign(QD,{
 rusalki:{n:'Rusałki nad Veleską',loc:'sanow',p:'kupiec',st:{
  szukaj:{j:'Dobrawa, córka rybaka Mirosza z Sanowa, poszła nad Rozlewiska Utopców i nie wróciła. Idź na Rozlewiska (na zachód od Sanowa, za Polami).',obj:{go:'rozlewiska',dlg:'rus_meet'}},
  wianek:{j:'Rusałka odda Dobrawę za wianek ze Świętego Dębu. Poproś Wilę w Dąbrowie o wianek.',obj:{go:'dabrowa',dlg:'rus_wila'}},
  wianek2:{j:'Zanieś wianek ze Świętego Dębu nad Rozlewiska.',obj:{go:'rozlewiska',dlg:'rus_wreath'}},
  wroc:{j:'Odprowadź Dobrawę do ojca w Sanowie.',obj:{go:'sanow',dlg:'rus_end'}}}},
 poludnica:{n:'Południca w polu',loc:'olszynow',p:'starszy',st:{
  pole:{j:'Południca kręci głowy żniwiarzom z Olszynowa. Wyrusz na Pola Południcy i pokonaj ją (dowolna wyprawa na Pola).',obj:{exp:{r:6,L:1}},next:'pwroc'},
  krag:{j:'Sołtys mówi, że Południcę można ułagodzić obrzędem przy Kręgu Kamiennym. Udaj się do Kręgu (na zachód od Brzeziny).',obj:{go:'krag',dlg:'pol_krag'}},
  pwroc:{j:'Wróć do Olszynowa i opowiedz sołtysowi, co zaszło na polach.',obj:{go:'olszynow',dlg:'pol_end'}}}},
 jaga:{n:'Chata na kurzej stopce',loc:'mokradla',p:'dziewczyna',st:{
  wila:{j:'Baba Jaga porwała małego Jasia z Mokradeł. Tylko Wila z Dąbrowy wie, gdzie stoi chata na kurzej stopce. Porozmawiaj z nią.',obj:{go:'dabrowa',dlg:'jaga_wila'}},
  chata:{j:'Wyrusz do Chaty na kurzej stopce (na zachodnich bagnach) i pokonaj Babę Jagę.',obj:{exp:{r:7,L:1}},next:'jwroc'},
  jwroc:{j:'Wróć z Jasiem do Mokradeł.',obj:{go:'mokradla',dlg:'jaga_end'}}}}});
Object.assign(DLG,{
 rus_start:{p:'kupiec',who:'Mirosz, rybak z Sanowa',t:'Moja Dobrawa… Poszła prać na Rozlewiska trzy dni temu. Sąsiedzi słyszeli śpiew nad wodą, a rano tylko wianek pływał przy brzegu.\nLudzie mówią: rusałki. Ja nie mam już siły w to nie wierzyć. Pomożecie?',
  o:[{t:'Odnajdziemy ją.',fx:()=>{S.found.rozlewiska=1;routeFix();qSet('rusalki','szukaj');rep('lud',2);return {txt:'Mirosz ściska wam dłonie. Rozlewiska Utopców pojawiają się na mapie.'}}},{t:'Nie teraz.'}]},
 rus_idle:{p:'kupiec',who:'Mirosz, rybak z Sanowa',t:()=>qS('rusalki')==='done'?(S.fl.rus==='walka'?'Dobrawa wróciła, ale po nocach płacze za „siostrami”. Dziękuję – i proszę, nie mówcie jej, co tam zrobiliście.':'Dobrawa wróciła. Mówi, że rusałka pocałowała ją w czoło na pożegnanie. Niech wam Weles błogosławi.'):'Wieści? Błagam, pospieszcie się.',o:[{t:'Bywaj.'}]},
 rus_meet:{p:'rusalka',who:'Rusałka znad Veleski',t:'Ciii… Dobrawa jest teraz nasza. Tańczy z nami w świetle księżyca i nie czuje już zimna.\nChcecie ją z powrotem? Ludzie zawsze czegoś chcą. A co dacie nam?',
  o:[{t:'Oddaj ją albo zginiesz!',fx:()=>{S.fl.rus='walka';qSet('rusalki','wroc');closeModal();roadFight(['rusalka','utopiec','rusalka'],'Rusałki nad Veleską',{bk:5,st:Math.max(6,S.stage)});return {fight:1}}},
   {t:'Czego chcesz w zamian?',fx:()=>{qSet('rusalki','wianek');return {txt:'„Wianka. Ze Świętego Dębu w Dąbrowie, uplecionego rękami szeptuchy. Ja też kiedyś miałam taki… zanim utonęłam.” Rusałka zanurza się bez plusku.'}}},
   {c:['bard','druid'],t:'Zaśpiewaj z nią pieśń o Kupale',fx:()=>{S.fl.rus='piesn';qSet('rusalki','wroc');rep('duchy',6);return {txt:'Wasze głosy splatają się nad wodą. Rusałka płacze – i wypuszcza Dobrawę z objęć mgły. Dziewczyna jest przemarznięta, ale żywa.'}}},
   {t:'Wrócimy później.'}]},
 rus_wila:{p:'szeptucha',who:'Wila, szeptucha',t:'Wianek dla rusałki? Mądrze. Topielica, która dostanie wianek, przypomina sobie, że była kiedyś dziewczyną. Uplotę go z ziół z dębu – ale zioła kosztują.',
  o:[{t:'Zapłać 40 zł',req:()=>S.gold>=40,rq:'40 zł',fx:()=>{S.gold-=40;qSet('rusalki','wianek2');rep('duchy',2);return {txt:'Wila splata wianek z ruty, bylicy i dębowych liści, szepcząc nad każdym źdźbłem.'}}},
   {c:['druid','kaplan'],t:'Pomóż jej przy obrzędzie',fx:()=>{qSet('rusalki','wianek2');rep('duchy',4);return {txt:'Razem z Wilą odmawiacie stare słowa. Wianek pachnie latem.'}}},{t:'Później.'}]},
 rus_wreath:{p:'rusalka',who:'Rusałka znad Veleski',t:'Wianek… ze Świętego Dębu. Pamiętam zapach ruty. Pamiętam imię… Miłosława. Tak się nazywałam.',
  o:[{t:'Oddaj wianek',fx:()=>{S.fl.rus='wianek';qSet('rusalki','wroc');rep('duchy',8);return {txt:'Rusałka wkłada wianek i rozpływa się w porannej mgle. Na brzegu leży Dobrawa – śpiąca, ciepła, żywa. Obok niej perła z dna Veleski.'}}}]},
 rus_end:{p:'kupiec',who:'Mirosz, rybak z Sanowa',t:'Dobrawa! Córuchno! …Nie wiem, jak wam dziękować. Weźcie wszystko, co odłożyłem – i niech cały Sanów wie, kto ją uratował.',
  o:[{t:'Przyjmij nagrodę',fx:()=>{const t=reward(120+S.stage*10,S.fl.rus==='walka'?null:1);rep('lud',10);qEnd('rusalki',(S.fl.rus==='walka'?'Pokonaliście rusałki i odbiliście Dobrawę siłą. ':'Dobrawa wróciła bez rozlewu krwi – rusałka odnalazła spokój. ')+t);return {txt:'Nagroda: '+t+'. Lud +10'}}},
   {t:'Zatrzymaj złoto dla siebie, Miroszu.',fx:()=>{rep('lud',16);rep('duchy',2);qEnd('rusalki','Odmówiliście zapłaty od biednego rybaka. Sanów długo będzie o tym mówił.');return {txt:'Mirosz ma łzy w oczach. Po porcie szybko rozchodzi się wieść o waszej szczodrości. Lud +16'}}}]},
 pol_start:{p:'starszy',who:'Sołtys Bogumił z Olszynowa',t:'Żniwa stoją. W samo południe na polach pojawia się wysoka biała pani z sierpem i pyta żniwiarzy o rzeczy, których żaden chłop nie wie. Kto nie odpowie – temu kręci głowę.\nTrzech już pochowaliśmy. Pomóżcie!',
  o:[{t:'Wyruszymy na pola i ją pokonamy.',fx:()=>{S.found.pola=1;routeFix();qSet('poludnica','pole');rep('lud',2);return {txt:'Pola Południcy są otwarte na mapie (na południowy zachód od Sanowa).'}}},
   {t:'Może da się ją ułagodzić?',fx:()=>{S.found.krag=1;routeFix();qSet('poludnica','krag');return {txt:'„Babka mówiła, że Południca to dusza dziewczyny zmarłej w dzień ślubu. Przy Kręgu Kamiennym palono dla niej ognie…” Krąg Kamienny widać na mapie.'}}},{t:'Nie teraz.'}]},
 pol_idle:{p:'starszy',who:'Sołtys Bogumił',t:()=>qS('poludnica')==='done'?'Żniwa skończone! W Olszynowie zawsze znajdzie się dla was chleb.':'Czekamy, aż będzie można wyjść w pole.',o:[{t:'Bywaj.'}]},
 pol_krag:{p:'poludnica',who:'Południca',t:'Kto pali ognie przy kamieniach w samo południe? …Pytanie za pytanie, wędrowcze. Co rośnie bez korzenia, biegnie bez nóg i zabiera bez rąk?',
  o:[{t:'Czas.',fx:()=>{S.fl.pol='zagadka';qSet('poludnica','pwroc');rep('duchy',6);return {txt:'Południca uśmiecha się po raz pierwszy od stu lat. „Dobrze… Niech żną. Ale niech zostawią mi ostatni snop.” Znika w drżącym powietrzu.'}}},
   {t:'Woda.',fx:()=>{S.fl.pol='zla';closeModal();qSet('poludnica','pwroc');roadFight(['poludnica','nietoperz'],'Gniew Południcy',{bk:6,st:Math.max(6,S.stage)});return {fight:1}}},
   {c:['bard','mag'],t:'Odpowiedz jej zagadką',fx:()=>{S.fl.pol='zagadka';qSet('poludnica','pwroc');rep('duchy',8);partyHeroes().forEach(h=>gainXp(h,30+S.stage*6));return {txt:'Południca nie zna odpowiedzi na waszą zagadkę i śmieje się jak dziewczyna. „Dawno nikt mnie nie przechytrzył.” (Doświadczenie dla drużyny)'}}}]},
 pol_end:{p:'starszy',who:'Sołtys Bogumił',t:()=>S.fl.pol==='zagadka'?'Ludzie mówią, że w południe na miedzy siedzi biała pani i patrzy na żniwa – ale nikogo nie rusza. Zostawimy jej ostatni snop, jak każe obyczaj.':'Południca przepadła! Wracamy w pole. Oto co zebraliśmy dla was, cała wieś się złożyła.',
  o:[{t:'Dziękujemy.',fx:()=>{const t=reward(100+S.stage*8,1);rep('lud',8);if(S.fl.pol==='zagadka')rep('duchy',4);qEnd('poludnica',(S.fl.pol==='zagadka'?'Ułagodziliście Południcę obyczajem i rozumem. ':'Pokonaliście Południcę. ')+t);return {txt:'Nagroda: '+t}}}]},
 jaga_start:{p:'dziewczyna',who:'Marysia z Mokradeł',t:'Jasio… mój braciszek… Poszedł zbierać chrust na bagna i usłyszałam, jak ktoś go woła słodkim głosem. Potem zatrzeszczało, jakby wielka kura szła przez las.\nTo Baba Jaga! Wszyscy wiedzą, że ona porywa dzieci! Proszę…',
  o:[{t:'Znajdziemy Jasia.',fx:()=>{qSet('jaga','wila');rep('lud',3);return {txt:'„Tylko Wila z Dąbrowy wie, gdzie stoi chata. Babka mówiła, że one się znają.”'}}},{t:'Nie teraz.'}]},
 jaga_idle:{p:'dziewczyna',who:'Marysia z Mokradeł',t:()=>qS('jaga')==='done'?'Jasio już nie chodzi sam na bagna. Dziękujemy wam!':'Proszę, pospieszcie się…',o:[{t:'Bywaj.'}]},
 jaga_wila:{p:'szeptucha',who:'Wila, szeptucha',t:'Jaga… Znam ją. Kiedyś była taka jak ja. Potem zbyt długo rozmawiała z tym, co mieszka pod bagnem.\nChata stoi tam, gdzie bagno styka się z puszczą. Obraca się do wędrowca tyłem – trzeba powiedzieć: „Chatko, chatko, stań do lasu tyłem, a do mnie przodem”.',
  o:[{t:'Pokaż nam drogę.',fx:()=>{S.found.chata=1;regOk();S.reg.lv[7]=1;routeFix();qSet('jaga','chata');rep('duchy',2);return {txt:'Chata na kurzej stopce pojawia się na mapie, na zachodnim skraju bagien. Wyprawa: Chata Baby Jagi.'}}},
   {c:['druid','kaplan','czarnoksieznik'],t:'Daj nam coś przeciw jej czarom.',fx:()=>{S.found.chata=1;regOk();S.reg.lv[7]=1;routeFix();S.bless={name:'Amulet Wili',fx:{defP:.12,heal:.1}};qSet('jaga','chata');return {txt:'Wila zawiesza wam na szyjach woreczki z czosnkiem, solą i jarzębiną. (Amulet Wili: +12% obrony na następną wyprawę). Chata pojawia się na mapie.'}}}]},
 jaga_end:{p:'dziewczyna',who:'Marysia z Mokradeł',t:'Jasio! Żywy! …Co tam było? Nie, nie mówcie. Babka zawsze mówiła, że z chaty Jagi nikt nie wraca. A wy wróciliście.',
  o:[{t:'Weź kufer z chaty dla wsi.',fx:()=>{const t=reward(60+S.stage*6);rep('lud',12);qEnd('jaga','Pokonaliście Babę Jagę i oddaliście jej skarby Mokradłom. '+t);return {txt:'Mokradła będą o was śpiewać. '+t+', Lud +12'}}},
   {t:'Zatrzymaj księgę zaklęć Jagi.',fx:()=>{const t=reward(40,2);rep('duchy',-6);unlockLore('asterion');qEnd('jaga','Księga Baby Jagi jest w waszym plecaku. Niektóre strony szepczą po nocach. '+t);return {txt:'Księga parzy w dłonie. '+t+', Duchy −6'}}}]}});
TALK.sanow.push({p:'kupiec',who:'Mirosz',s:'rybak z Sanowa',nw:()=>!S.q.rusalki||qS('rusalki')==='wroc',dlg:()=>!S.q.rusalki?'rus_start':qS('rusalki')==='wroc'?'rus_end':'rus_idle'});
if(TALK.olszynow)TALK.olszynow.unshift({p:'starszy',who:'Bogumił',s:'sołtys Olszynowa',nw:()=>!S.q.poludnica||qS('poludnica')==='pwroc',dlg:()=>!S.q.poludnica?'pol_start':qS('poludnica')==='pwroc'?'pol_end':'pol_idle'});
if(TALK.mokradla)TALK.mokradla.unshift({p:'dziewczyna',who:'Marysia',s:'siostra porwanego',nw:()=>!S.q.jaga||qS('jaga')==='jwroc',dlg:()=>!S.q.jaga?'jaga_start':qS('jaga')==='jwroc'?'jaga_end':'jaga_idle'});
/* --- nowe zdarzenia drogowe --- */
Object.assign(ROADEV,{
 brod:{n:'Bród na Velesce',ic:'event',p:'rusalka',t:()=>'Przy brodzie siedzą na kamieniach blade dziewczęta z mokrymi włosami. „Chodźcie się wykąpać, wędrowcy… woda taka ciepła…”',
  o:[{t:'Do broni!',r:()=>({fight:['rusalka','utopiec'],bk:5,lbl:'Rusałki przy brodzie'})},{c:['bard'],t:'Zaśpiewaj im pieśń',r:()=>{rep('duchy',2);return {txt:'Rusałki słuchają zasłuchane i pozwalają wam przejść. Jedna rzuca wam srebrną łuskę. '+reward(25+S.stage*3)}}},{t:'Nadłóż drogi przez groblę (+1 dzień)',r:()=>{passDays(1);return {txt:'Dzień marszu w błocie, ale wszyscy cali.'}}}]},
 poludnie:{n:'Południe w polu',ic:'event',p:'poludnica',t:()=>'Słońce w zenicie. Między łanami zboża stoi wysoka biała postać z sierpem. „Odpowiedz, wędrowcze: co jest cięższe – snop czy sierp?”',
  o:[{t:'„Snop – bo sierp wraca do domu, a snop zostaje w polu.”',r:()=>{rep('duchy',2);return {txt:'Południca kiwa głową i rozpływa się w drżącym powietrzu.'}}},{t:'Zaatakuj ją!',r:()=>({fight:['poludnica'],bk:6,lbl:'Południca'})},{t:'Schowaj się w cieniu i przeczekaj',r:()=>{S.roster.forEach(h=>h.hp=Math.max(1,h.hp-Math.round(stats(h).maxHp*.1)));return {txt:'Upał daje się we znaki. (−10% zdrowia)'}}}]},
 dzik:{n:'Rozjuszony dzik',ic:'fight',p:null,t:()=>'Z zarośli wypada ogromny odyniec z kłami jak noże. Za nim drugi.',
  o:[{t:'Stawić czoła',r:()=>({fight:['dzik','dzik'],bk:0,lbl:'Dziki na drodze'})},{c:['lucznik','lotr'],t:'Zapoluj z ukrycia',r:()=>{S.sup.prowiant=(S.sup.prowiant||0)+1;return {txt:'Celny strzał. Dziczyzna na wieczór i skóra na sprzedaż. (+1 prowiant) '+reward(15)}}},{t:'Wejdź na drzewa i przeczekaj',r:()=>({txt:'Dziki ryją jeszcze godzinę, potem odchodzą.'})}]},
 rozstaje:{n:'Rozstaje dróg',ic:'event',p:null,t:()=>'Na rozstajach, przy przydrożnym krzyżu, siedzi elegancki jegomość z kopytem zamiast stopy. „Mam dla was interes. Sakwa złota za… drobiazg. Nic, czego byście potrzebowali.”',
  o:[{t:()=>`Przyjmij sakwę (+${60+S.stage*8} zł, Duchy −8)`,r:()=>{S.gold+=60+S.stage*8;rep('duchy',-8);return {txt:'Bies chichocze i znika. Złoto jest prawdziwe. Na razie.'}}},{c:['kaplan','paladyn'],t:'Przegoń go modlitwą',r:()=>{rep('duchy',4);rep('lud',2);return {txt:'Bies syczy i zapada się pod ziemię, zostawiając swąd siarki.'}}},{t:'Zaatakuj biesa',r:()=>({fight:['bies','bies'],bk:1,lbl:'Biesy z rozstajów'})}]}});
/* roadResolve: walki z listą wrogów i tłem krainy */
const _roadResolveL=roadResolve;roadResolve=function(i){const k=S.pend&&S.pend.ev,E=k&&ROADEV[k],o=E&&E.o[i];if(o&&!(o.c&&!RCLS(o.c))&&['brod','poludnie','dzik','rozstaje'].includes(k)){const r=o.r();save();
 if(r.fight){closeModal();roadFight(r.fight,r.lbl,{bk:r.bk});return}modal(`<h2>${E.n}</h2><p>${r.txt}</p><button class="btn-main" data-act="revok">${ic('walk',20)} Dalej</button>`);return}_roadResolveL(i)};
/* panoramy wiosek */
Object.assign(VART,{p_brzezina:VART.p_dabrowa,p_olszynow:VART.p_kurhanow,p_mokradla:VART.p_mglista});
