/* ===== v18: sceny miast, tablice ogłoszeń, plotki, sklepy lokalne =====
   (zadania v18 są w js/story/quests.js, zdarzenia drogowe w js/world/world-map.js) */
/* --- postać ze sprite'ów (straż, mieszczanie, dworzanie): pierwsza klatka paska; flip = odbicie w poziomie --- */
const sprFrame=(key,flip)=>{const o=(typeof HSPR!=='undefined'&&HSPR[key])||(typeof CSPR!=='undefined'&&CSPR[key])||GFX.S[key];if(!o)return '';const n=o.n||7,fw=o.fw||o.w/n;return `<i class="sfr${n===1?' one':''}" style="aspect-ratio:${fw}/${o.h};background-image:url(${o.u});background-size:${n*100}% 100%${flip?';transform:scaleX(-1)':''}"></i>`};
/* imiona postaci w scenach (g.s bez końcówki _l/_s; g.n nadpisuje) */
const RNAME={straznik:'Strażnik miejski',rycerz:'Rycerz z gwardii',luczniczka:'Łowczyni z portu',mieszczanin:'Mieszczanin',mieszczka:'Mieszczka',zielarka:'Stara zielarka'};
const npcBase=s=>s.replace(/_[ls]$/,'');
const npcName=g=>g.n||RNAME[npcBase(g.s)]||'Mieszkaniec';
/* --- sceny: hotspoty w % obrazu 16:9 (l,t,w,h, etykieta x,y) --- */
const SCN={
 weleszow:{img:'t_weleszow',b:{zamek:[34,0,32,16,50,13],cmentarz:[4,10,16,16,12,25],karczma:[14,28,16,20,22,45],lecznica:[33,28,12,15,39,41],gildia:[60,20,16,17,68,35],bank:[52,31,13,17,58,45],swiatynia:[73,14,15,34,80,47],zaklinacz:[88,30,12,32,93,60],targ:[38,40,22,18,47,57],koszary:[0,44,15,26,8,67],kowal:[12,64,20,24,22,86],alchemik:[28,55,13,17,34,70]},
  x:[{v:'tablica',r:[56,54,12,16,62,67]}],g:[{s:'straznik',x:44,y:30,h:12},{s:'rycerz',x:57,y:30,h:13},{s:'straznik',x:70,y:76,h:12},{s:'mieszczka',x:46,y:67,h:8}]},
 dabrowa:{img:'t_dabrowa',b:{karczma:[10,6,20,24,22,30],alchemik:[68,22,22,26,79,47],szept:[70,58,22,30,80,86]},x:[{v:'tablica',r:[36,64,12,18,42,82]}],g:[{s:'straznik',x:56,y:62,h:14}]},
 kregoszew:{img:'t_kregoszew',b:{zamek:[38,2,24,28,50,27],kowal:[8,26,20,22,18,45],koszary:[68,16,24,28,80,42],karczma:[14,48,20,24,24,70]},x:[{v:'tablica',r:[51,56,9,12,56,69]}],g:[{s:'straznik',x:44,y:86,h:13},{s:'straznik',x:62,y:86,h:13},{s:'rycerz',x:38,y:44,h:13}]},
 sanow:{img:'t_sanow',b:{karczma:[2,12,28,36,16,46],gildia:[38,0,24,28,50,25],targ:[50,30,24,28,62,56],bank:[84,22,16,32,92,50]},x:[{v:'osobl',r:[80,0,20,19,90,16]},{v:'tablica',r:[38,46,11,16,44,62]}],g:[{s:'straznik',x:30,y:44,h:12},{s:'luczniczka',x:70,y:80,h:12},{s:'mieszczanin_l',x:36,y:79,h:9}]},
 kurhanow:{img:'t_kurhanow',b:{karczma:[4,32,18,24,13,56],cmentarz:[50,4,46,50,68,42],starszy:[34,48,18,24,44,70]},x:[{v:'tablica',r:[27,34,11,15,33,50]}],g:[{s:'straznik',x:22,y:74,h:12}]},
 /* wsie */
 brzezina:{img:'t_brzezina',b:{karczma:[32,24,26,22,46,30]},x:[{v:'tablica',r:[24,52,8,18,28,58]}],g:[{s:'zielarka',x:57,y:57,h:10},{s:'mieszczanin_l',x:40,y:68,h:10,n:'Drwal'}]},
 olszynow:{img:'t_olszynow',b:{karczma:[24,30,12,15,30,40],targ:[36,44,24,22,46,52]},x:[{v:'tablica',r:[60,58,8,10,64,64]}],g:[{s:'mieszczka',x:40,y:65,h:9,n:'Gospodyni'},{s:'mieszczanin_l',x:68,y:77,h:9,n:'Oracz'}]}};
const XNAME={tablica:['Tablica ogłoszeń','contract'],osobl:['Kupiec osobliwości','bag']};
function scnHtml(k,inner){const D=SCN[k];if(!D)return '';const T=TOWNS[k]||{};let h=`<img class="px sbg" src="${VART18[D.img]}" alt="" draggable="false">`;
 const box=(v,r,lab,i,al,act,dk)=>`<button class="shot" data-act="${act||'town'}" ${dk?`data-k="${dk}"`:`data-v="${v}"`} aria-label="${lab}" style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%"></button><button class="tlab slab${r[4]>76?' sr':r[4]<16?' sl':''}" data-act="${act||'town'}" ${dk?`data-k="${dk}"`:`data-v="${v}"`} style="left:${r[4]}%;top:${r[5]}%">${ic(i,12)}<b>${lab}</b>${al?'<em>!</em>':''}</button>`;
 for(const b in D.b){if(k!=='weleszow'&&!(T.svc||[]).includes(b))continue;const B=BUILD[b]||XB[b];h+=box(B.v||b,D.b[b],bName(b),B.ic,BUILD[b]&&bldAlert(b))}
 (D.x||[]).forEach(o=>{const X=XNAME[o.v];h+=box(o.v,o.r,X[0],X[1],o.v==='tablica'&&tabAlert())});
 (D.g||[]).forEach((g,i)=>{h+=`<button class="snpc" data-act="rumor" data-i="${i}" style="left:${g.x}%;top:${g.y}%;height:${g.h}%" aria-label="${npcName(g)}">${sprFrame(g.s,g.f)}<span>${ic('event',10)}</span></button>`});
 return `<div class="scn">${h}</div>`}
/* --- plotki od strażników i mieszkańców --- */
const RUMOR={
 weleszow:[{t:'Na zamku gadają, że w Mglistych Dolinach, na północny zachód od stolicy, ktoś widział strzygę. Kobieta o dwóch sercach – jedno ludzkie, drugie… nie.',fx:()=>{S.found.doliny=1}},{t:'Rotmistrz Zawisza z Kręgoszewa szuka śmiałków do chorągwi skrzydlatych. Ale bierze tylko najlepszych.'},{t:'Kupcy z Sanowa przywożą rzeczy, jakich nie zobaczysz u kowala. Za odpowiednią cenę.'},
  {t:'W kantorze „Złota Waga” trzymają podobno więcej złota niż w królewskim skarbcu. A bankier Aureliusz liczy szybciej, niż mag rzuca zaklęcia.'},{t:'Król Przemysław przyjmuje w sali tronowej każdego, kto ma sprawę. Tylko kanclerz pilnuje, żeby nie każdy wychodził zadowolony.'}],
 dabrowa:[{t:'W Wilczych Jarach na północy wyje coś większego niż wilk. Pełnia za trzy dni…',fx:()=>{S.found.jary=1;regOk();if(!S.reg.lv[8])S.reg.lv[8]=1}},{t:'Nie zbieraj grzybów koło starego młyna po zmroku. Wodnik nie lubi gości.',fx:()=>{S.found.mlyn=1}},{t:'Wila wie więcej, niż mówi. Zapytaj ją o chatę na kurzej stopce, jeśli się odważysz.'}],
 kregoszew:[{t:'Ze starej strażnicy pod górami, daleko na wschodzie, widać pół królestwa. I Smoczą Jamę też.',fx:()=>{S.found.straznica=1}},{t:'Kasztelan od tygodnia chodzi struty. Mówią, że to przez syna – i przez szeptunkę z lasu.'},{t:'Biesy na rozstajach proponują układy. Kto przyjmie – traci więcej, niż zyskuje.'},{t:'Bazyliszek w górach zamienia w kamień spojrzeniem. Weźcie lustro. Albo kapłana.'}],
 sanow:[{t:'Córka rybaka Mirosza zniknęła nad Rozlewiskami. Rusałki, mówię wam – śpiewały całą noc.',fx:()=>{S.found.rozlewiska=1}},{t:'W samo południe nie wychodź w pole. Południca pyta, a kto nie odpowie – temu kręci głową.',fx:()=>{S.found.pola=1;regOk();if(!S.reg.lv[6])S.reg.lv[6]=1}},{t:'Łowczyni przy porcie mówi, że w Olszynowie płacą za każdą zabitą bestię.',fx:()=>{S.found.olszynow=1}},{t:'Filia „Złotej Wagi” przy porcie przyjmuje złoto na procent. Flisacy wolą to niż chować sakiewkę pod siennikiem.'}],
 kurhanow:[{t:'Za kurhanami, w Ruinach Asterionu, runy świecą nocą. Starszy każe trzymać się z daleka.',fx:()=>{S.found.ruiny=1}},{t:'Nie zostawiaj zmarłego bez kamienia na piersi. Inaczej wstanie jako strzyga.'},{t:'W Olszynowie pług odsłonił kurhan, o którym nie mówią nawet nasze pieśni. Prawie żadne.',fx:()=>{S.found.olszynow=1}}],
 brzezina:[{t:'Dziurawiec zbiera się w noc Kupały, nie dzień później. A najlepszy rośnie w Mglistych Dolinach – tylko nie odpowiadaj, jak cię mgła zawoła po imieniu.',fx:()=>{S.found.doliny=1}},{t:'Na Kamiennym moście znowu ktoś przepadł. Stary przewoźnik Bolko mówi, że wie gdzie – ale gada tylko za pieniądze.'},
  {t:'W tym roku zboże zgniło na pniu. Sołtys Zdzich chodzi od chaty do chaty i liczy worki. Starczy może do Godów.'},{t:'Nela, córka leśnika, trafia wiewiórkę z sześćdziesięciu kroków. Dzika – z zamkniętymi oczami.'}],
 olszynow:[{t:'W samo południe nikt u nas nie pracuje w polu. Kto został – temu Południca pokręciła głową. Dosłownie.',fx:()=>{S.found.pola=1;regOk();if(!S.reg.lv[6])S.reg.lv[6]=1}},{t:'Wojsław zaorał kurhan i od tej pory nie śpi. Mówi, że ktoś woła go spod ziemi po imieniu.'},
  {t:'Jarmark w Olszynowie najlepszy w Velesii! Ser, miód, len – a plotki za darmo.'},{t:'Gród na wzgórzu stoi od czasów pierwszych królów. Podobno król Przemysław polował tu jako chłopiec.'}]};
function rumor(i){const k=S.loc,L=RUMOR[k]||[];if(!L.length)return;const r=L[(S.day+i)%L.length];const g=(SCN[k]&&SCN[k].g[i])||{s:'straznik'};const before=JSON.stringify(S.found);if(r.fx)r.fx();routeFix();save();const nw=JSON.stringify(S.found)!==before;
 modal(`<div class="dlg"><div class="dpor"><img class="px" src="${VART['n_'+npcBase(g.s)]||VART.n_straznik}" alt=""></div><div class="dtx"><h2>${npcName(g)}</h2><p>„${r.t}”</p>${nw?`<p class="note ok">${ic('map',14)} Nowe miejsce na mapie Velesii.</p>`:''}</div></div><button class="btn-main" data-act="dclose">Dzięki</button>`)}
/* --- tablica ogłoszeń: powtarzalne zlecenia na bestie --- */
const TABM={weleszow:['bies','wilkolak','strzyga','szeptun','bazyliszek'],dabrowa:['wilk','dzik','goblin','borowy','pajak'],kregoszew:['goblin','bies','wilkolak','nietoperz','bazyliszek'],sanow:['rusalka','utopiec','poludnica','szlam','pajak'],kurhanow:['strzyga','szeptun','nietoperz','pajak','szlam'],brzezina:['wilk','dzik','goblin'],olszynow:['poludnica','strzyga','wilkolak','dzik'],mokradla:['utopiec','rusalka','szlam','nietoperz'],ustronie:['upior','strzyga','wilk'],wschodnia:['wilkolak','harpia','ork','bazyliszek']};
const TABR={weleszow:'dwor',kregoszew:'dwor',dabrowa:'lud',sanow:'lud',brzezina:'lud',olszynow:'lud',mokradla:'lud',ustronie:'lud',wschodnia:'lud',kurhanow:'duchy'};
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
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||!S)return;const a=el.dataset.act;
 if((a==='town'&&el.dataset.v==='smith')||(a==='tbld'&&el.dataset.k==='kowal'))shopLocal();
 if(a==='rumor'){rumor(+el.dataset.i);e.stopImmediatePropagation();return}
 if(a==='tabtake'){tabOk();const id=+el.dataset.id,k=S.loc,av=tabAv(k),i=av.findIndex(c=>c.id===id);if(i<0||S.tab.act.length>=TAB_MAX)return;const c=av.splice(i,1)[0];c.b=S.kills[c.e]||0;S.tab.act.push(c);av.push(tabGen(k));save();render();toast('Zlecenie przyjęte');e.stopImmediatePropagation();return}
 if(a==='tabdrop'){const id=+el.dataset.id;S.tab.act=S.tab.act.filter(c=>c.id!==id);save();render();e.stopImmediatePropagation();return}
 if(a==='tabclaim'){const id=+el.dataset.id,c=S.tab.act.find(x=>x.id===id);if(!c||tabProg(c)<c.n)return;S.tab.act=S.tab.act.filter(x=>x!==c);S.gold+=c.g;rep(c.rp,3);S.tabDone=(S.tabDone||0)+1;save();render();toast(`Zlecenie wykonane: +${c.g} zł, ${REPN[c.rp].n} +3`);e.stopImmediatePropagation();return}
 if(a==='osbuy'){osoblOk();const i=+el.dataset.i,it=S.osob.it[i];if(!it||S.gold<it.price||S.inv.length>=INV_MAX)return;S.gold-=it.price;S.osob.it.splice(i,1);S.inv.push(it);save();render();toast('Kupiono: '+it.n);e.stopImmediatePropagation();return}
},true);
