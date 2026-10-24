/* ===== PRZEDMIOTY ===== */
const SLOTS={bron:'Broń',zbroja:'Zbroja',helm:'Hełm',amulet:'Amulet'};
const SLOT_IC={bron:'miecz',zbroja:'kaftan',helm:'helm',amulet:'amulet'};
const RAR=[{n:'Zwykły',c:'#c9c9c9',m:1,x:0},{n:'Rzadki',c:'#4a9dff',m:1.4,x:1},{n:'Epicki',c:'#b45cff',m:1.9,x:2},{n:'Legendarny',c:'#ff9a2a',m:2.6,x:3}];
const SUF=[[],['Wilka','Bystrości','Mocy','Strażnika'],['Bohatera','Burzy','Cienia','Króla'],['Smoka','Bogów','Wieczności','Przeznaczenia']];
const BASES=[
 {k:'miecz',n:'Miecz',s:'bron',ic:'🗡️',cls:['wojownik','lotr','paladyn'],st:{atk:4}},
 {k:'mlot',n:'Młot bojowy',s:'bron',ic:'🔨',cls:['paladyn','wojownik'],st:{atk:5,def:1}},
 {k:'topor',n:'Topór',s:'bron',ic:'🪓',cls:['wojownik'],st:{atk:5,crit:2}},
 {k:'luk',n:'Łuk',s:'bron',ic:'🏹',cls:['lucznik'],st:{atk:4,spd:.3}},
 {k:'kusza',n:'Kusza',s:'bron',ic:'🎯',cls:['lucznik'],st:{atk:6}},
 {k:'rozdzka',n:'Różdżka',s:'bron',ic:'🪄',cls:['mag','czarnoksieznik'],st:{atk:5}},
 {k:'kostur',n:'Kostur',s:'bron',ic:'🦯',cls:['mag','kaplan','druid','czarnoksieznik'],st:{atk:3,hp:10}},
 {k:'galaz',n:'Laska druida',s:'bron',ic:'🌿',cls:['druid'],st:{atk:3,hp:14}},
 {k:'czaszka',n:'Kostur czaszki',s:'bron',ic:'💀',cls:['czarnoksieznik'],st:{atk:5,crit:2}},
 {k:'lutnia',n:'Lutnia',s:'bron',ic:'🪕',cls:['bard'],st:{atk:3,spd:.4}},
 {k:'bulawa',n:'Buława',s:'bron',ic:'🔨',cls:['kaplan','wojownik','paladyn'],st:{atk:4,def:1}},
 {k:'sztylety',n:'Sztylety',s:'bron',ic:'🔪',cls:['lotr','bard'],st:{atk:3,crit:4}},
 {k:'kaftan',rs:{obuch:10},n:'Skórzany kaftan',s:'zbroja',ic:'🦺',cls:null,st:{def:2,spd:.2}},
 {k:'kolczuga',rs:{ciete:15},n:'Kolczuga',s:'zbroja',ic:'🥋',cls:['wojownik','kaplan','lucznik','paladyn'],st:{def:4}},
 {k:'plyty',rs:{ciete:15,klute:10},n:'Zbroja płytowa',s:'zbroja',ic:'🛡️',cls:['wojownik','paladyn'],st:{def:6,hp:12}},
 {k:'szata',rs:{arkana:10,mrok:10},n:'Szata',s:'zbroja',ic:'👘',cls:['mag','kaplan','druid','czarnoksieznik'],st:{def:1,hp:10,atk:1}},
 {k:'kaptur',rs:{trucizna:10},n:'Kaptur',s:'helm',ic:'🧢',cls:null,st:{def:1,crit:2}},
 {k:'helm',rs:{obuch:10},n:'Hełm',s:'helm',ic:'⛑️',cls:['wojownik','kaplan','lucznik','paladyn'],st:{def:2,hp:8}},
 {k:'diadem',rs:{mrok:10},n:'Diadem',s:'helm',ic:'👑',cls:['mag','kaplan','druid','czarnoksieznik','bard'],st:{atk:2,hp:4}},
 {k:'pierscien',n:'Pierścień siły',s:'amulet',ic:'💍',cls:null,st:{atk:2}},
 {k:'amulet',rs:{trucizna:10},n:'Amulet życia',s:'amulet',ic:'📿',cls:null,st:{hp:15}},
 {k:'talizman',rs:{lod:10},n:'Talizman wiatru',s:'amulet',ic:'🪶',cls:null,st:{spd:.6}},
 {k:'oko',n:'Oko sokoła',s:'amulet',ic:'🧿',cls:null,st:{crit:5}}
];
const STL={atk:'🗡',def:'🛡',hp:'❤️',spd:'👟',crit:'🎯'};
const STN={atk:'Atak',def:'Obrona',hp:'Zdrowie',spd:'Szybkość',crit:'Krytyk'};
const fmtStat=(k,v)=>`<span class="st">${ic(k,14)}${v>0?'+':''}${k==='spd'?(+v).toFixed(1):v}${k==='crit'?'%':''}</span>`;
const statStr=st=>Object.keys(STL).filter(k=>st[k]).map(k=>fmtStat(k,st[k])).join(' ');
const rs=(k,v)=>k==='spd'?Math.max(.1,Math.round(v*10)/10):Math.max(1,Math.round(v));
function rollRar(luck,min){const r=Math.random();let x=r<.02+luck*.25?3:r<.12+luck*.7?2:r<.42+luck?1:0;return Math.max(x,min||0)}
function makeItem(L,ri,bk){const b=bk?BASES.find(x=>x.k===bk):pick(BASES);const R=RAR[ri],sc=1+.22*(L-1),st={};
 for(const k in b.st)st[k]=rs(k,b.st[k]*sc*R.m);
 const EX={atk:2,def:1.5,hp:8,spd:.3,crit:3};for(let i=0;i<R.x;i++){const k=pick(Object.keys(EX));st[k]=rs(k,(st[k]||0)+EX[k]*sc*rnd(.8,1.4))}
 let res=null;if(b.rs){res={};for(const k in b.rs)res[k]=Math.round(b.rs[k]*(1+.25*ri))}
 if(ri>=1&&b.s!=='bron'&&Math.random()<.35+.15*ri){res=res||{};const k=pick(Object.keys(DT));res[k]=(res[k]||0)+Math.round(rnd(6,10)+ri*4)}
 const score=(st.atk||0)*3+(st.def||0)*3+(st.hp||0)*.6+(st.spd||0)*15+(st.crit||0)*2+(res?Object.values(res).reduce((a,v)=>a+v,0)*.6:0);
 const it={id:'i'+(S.nextItem++),b:b.k,n:b.n+(ri?' '+pick(SUF[ri]):''),s:b.s,ic:b.ic,r:ri,L,st,cls:b.cls,price:Math.round(score*4+10)};if(res)it.res=res;return it}
const sellPrice=it=>Math.max(1,Math.floor(it.price*.4));
const canEquip=(h,it)=>!it.cls||it.cls.includes(h.cls);
