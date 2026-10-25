/* ===== MIASTO – FAZA 2: Alchemik, Zaklinacz, Cmentarz, Gildia łowców, trofea, materiały, efekty wypraw ===== */
const alchPrice=k=>Math.round(SUP[k].p*(S&&S.loc==='dabrowa'?.8:1));
/* --- efekty wyprawy (eliksiry, duchy) --- */
function expAddFx(E,fx,name){const F=E.fx=E.fx||{atkP:0,defP:0,crit:0,heal:0,gold:0,res:{},l:[]};for(const k in fx){if(k==='res'){for(const r in fx.res)F.res[r]=(F.res[r]||0)+fx.res[r]}else F[k]=(F[k]||0)+fx[k]}F.l.push(name)}
function buffUnit(u,fx){if(!fx||u.side!=='h')return;if(fx.atkP)u.atk=Math.round(u.atk*(1+fx.atkP));if(fx.defP)u.def=Math.round(u.def*(1+fx.defP));if(fx.crit)u.crit+=fx.crit/100;
 if(fx.res&&Object.keys(fx.res).length){u.res=Object.assign({},u.res);for(const k in fx.res)u.res[k]=Math.min(RES_CAP,(u.res[k]||0)+fx.res[k])}}
const fxChips=E=>E&&E.fx&&E.fx.l.length?`<button class="btn-small xfx" data-act="fxinfo" title="Aktywne efekty">${ic('xp',14)}<span>${E.fx.l.length}</span></button>`:'';
function fxDesc(F){const o=[];if(F.atkP)o.push(`+${Math.round(F.atkP*100)}% ataku`);if(F.defP)o.push(`+${Math.round(F.defP*100)}% obrony`);if(F.crit)o.push(`+${F.crit}% kryt.`);if(F.heal)o.push(`po walce +${Math.round(F.heal*100)}% PŻ`);if(F.gold)o.push(`+${Math.round(F.gold*100)}% złota z walk`);for(const k in F.res)o.push(`${DT[k].n}: +${F.res[k]}%`);return o.join(' · ')}
function expStartTown(E){if(S.spirit){expAddFx(E,S.spirit.fx,'Duch: '+S.spirit.name);S.spirit=null}
 /* błogosławieństwo (droga, obrzędy) i efekty unikalnych towarzyszy */
 if(S.bless){expAddFx(E,S.bless.fx,S.bless.name);S.bless=null}partyHeroes().forEach(h=>{const U=h.uniq&&UNIQ[h.uniq];if(U)expAddFx(E,U.fx,U.fxn)})}
/* --- łupy z walk: trofea, materiały --- */
function expDrops(boss){const E=S.exp,tro={},o=[];let odl=(Math.random()<.6?1:0)+(B.elite?1:0)+(boss?3:0),esc=(Math.random()<(B.elite?.5:.15)?1:0)+(boss?2:0),n=0;
 B.units.filter(u=>u.side==='e'&&!u.obj).forEach(u=>{S.kills[u.key]=(S.kills[u.key]||0)+1;if(Math.random()<(u.boss?1:B.elite?.35:.22)){S.tro[u.key]=(S.tro[u.key]||0)+1;tro[u.key]=(tro[u.key]||0)+1;n++}});
 S.mat.odl+=odl;S.mat.esc+=esc;if(n)conEv('tro',n);
 if(n)o.push(`${ic('b_gildia',16)} Trofea: ${Object.keys(tro).map(k=>ENEMIES[k].name+' ×'+tro[k]).join(', ')}`);
 if(odl||esc)o.push(`${ic('b_zaklinacz',16)} Materiały: ${odl?`+${odl} odłamki`:''}${odl&&esc?', ':''}${esc?`+${esc} esencji`:''}`);
 const F=E&&E.fx;if(F&&F.heal){let v=0;B.units.filter(u=>u.side==='h'&&u.alive).forEach(u=>{const h=u.hero,m=stats(h).maxHp,d=Math.min(m-h.hp,Math.round(m*F.heal));h.hp+=d;v+=d});if(v)o.push(`${ic('b_cmentarz',16)} Duch opiekuńczy leczy drużynę: +${v} PŻ`)}
 return o}
/* --- ALCHEMIK --- */
function alchHtml(){const L=tl('alchemik');let b=`<div class="note">${ic('bag',14)} Mikstury i eliksiry trafiają do torby (${bagN()}/${bagCap()}). Eliksir wypity na wyprawie lub w walce działa na całą drużynę <b>do końca wyprawy</b>. Esencja: <b>${S.mat.esc}</b>.</div><div class="cols">`;
 for(const k in SUP){const s=SUP[k];if(s.src!=='alch')continue;const ok=L>=s.lv;b+=`<div class="item sup ${ok?'':'lk'}"><div class="ii">${ic(s.ic,32)}</div><div class="inf"><div class="inm">${s.n} <span class="cnt">×${S.sup[k]||0}</span></div><div class="sub">${s.d}</div></div>${ok?`<button class="btn-small btn-gold" data-act="alchbuy" data-k="${k}" ${S.gold<alchPrice(k)||bagN()>=bagCap()||(s.esc&&S.mat.esc<s.esc)?'disabled':''}>${alchPrice(k)} ${ic('gold',14)}${s.esc?` +${s.esc} es.`:''}</button>`:`<button class="btn-small" disabled>${ic('lock',14)} poz. ${s.lv}</button>`}</div>`}
 return b+'</div>'}
/* --- ZAKLINACZ --- */
let zSel=null;
const findIt=id=>allItems().find(x=>x.it.id===id);
const EXS={atk:2,def:1.5,hp:8,spd:.3,crit:3};
function itRecalc(it){if(!it.b0){it.b0=Object.assign({},it.st);it.n0=it.n;it.p0=it.price}const up=it.up||0,st={};for(const k in it.b0)st[k]=rs(k,it.b0[k]*(1+.1*up)+(k==='spd'?0:0));
 if(it.ex)st[it.ex.k]=rs(it.ex.k,(st[it.ex.k]||0)+it.ex.v);it.st=st;it.n=it.n0+(up?` +${up}`:'')+(it.ex?' ✦':'');it.price=Math.round(it.p0*(1+.25*up+(it.ex?.3:0)))}
const zDisc=()=>1,maxUp=()=>5;
const upCost=it=>{const u=it.up||0;return {g:Math.round((15+(it.L||1)*6+it.r*12)*(u+1)*zDisc()),o:u+1,e:u>=2?u-1:0}};
const exCost=(it,add)=>({g:Math.round((add?40:25)+(it.L||1)*(add?8:5))*zDisc()|0,o:0,e:add?2:1});
const canPay=c=>S.gold>=c.g&&S.mat.odl>=c.o&&S.mat.esc>=c.e;
const payStr=c=>`${c.g} ${ic('gold',12)}${c.o?` · ${c.o} odł.`:''}${c.e?` · ${c.e} es.`:''}`;
function pay(c){S.gold-=c.g;S.mat.odl-=c.o;S.mat.esc-=c.e}
function rollEx(it){const k=pick(Object.keys(EXS).filter(x=>!it.ex||x!==it.ex.k)),sc=1+.22*((it.L||1)-1);return {k,v:rs(k,EXS[k]*sc*rnd(1,1.6)*(1+.3*it.r))}}
const dismVal=it=>({o:1+it.r+Math.floor((it.L||1)/4)+(it.up||0),e:(it.r>=2?it.r-1:0)+(it.ex?1:0)});
function enchHtml(){const L=tl('zaklinacz');let b=`<div class="mats"><span class="pill">${ic('smith',16)} Odłamki: <b>${S.mat.odl}</b></span><span class="pill">${ic('b_zaklinacz',16)} Esencja: <b>${S.mat.esc}</b></span><span class="sub">Materiały wypadają w walkach na wyprawach albo z rozłożonych przedmiotów.</span></div>`;
 const sel=zSel&&findIt(zSel);
 if(sel){const it=sel.it,u=it.up||0,uc=upCost(it),ac=exCost(it,1),rc=exCost(it,0);
  b+=`<h2>${ic('b_zaklinacz',20)} Przy stole zaklinacza</h2><div class="zsel">${itemHtml(it,`<button class="btn-small" data-act="zsel" data-id="">✕</button>`,sel.h?`<div class="sub">Nosi: ${esc(sel.h.name)}</div>`:'')}
  <div class="zact"><button class="btn-gold" data-act="zup" ${u>=maxUp()||!canPay(uc)?'disabled':''}>${ic('lvl',16)} ${u>=5?'Maks. +5':`Ulepsz do +${u+1} (+10% cech)<small>${payStr(uc)}</small>`}</button>
  <button data-act="zadd" ${it.ex||L<2||!canPay(ac)?'disabled':''}>${ic('xp',16)} ${it.ex?'Ma już właściwość ✦':L<2?'Dodaj właściwość (poz. 2)':`Dodaj właściwość<small>${payStr(ac)}</small>`}</button>
  <button data-act="zrer" ${!it.ex||!canPay(rc)?'disabled':''}>${ic('reroll',16)} ${it.ex?`Przekuj ✦ ${fmtStat(it.ex.k,it.ex.v)}<small>${payStr(rc)}</small>`:'Przekuj właściwość (brak ✦)'}</button>
  ${sel.h?'':`<button class="btn-red" data-act="zdis">${ic('smith',16)} Rozłóż<small>+${dismVal(it).o} odł.${dismVal(it).e?` +${dismVal(it).e} es.`:''}</small></button>`}</div></div>`}
 b+=`<h2>${ic('bag',20)} Wybierz przedmiot</h2>`;const list=allItems().sort((a,b)=>b.it.r-a.it.r||(b.it.up||0)-(a.it.up||0));
 b+=list.length?'<div class="cols">'+list.map(({it,h})=>itemHtml(it,`<button class="btn-small ${zSel===it.id?'btn-gold':''}" data-act="zsel" data-id="${it.id}">${zSel===it.id?'✔':'Wybierz'}</button>`,h?`<div class="sub">${ic('nav_team',12)} ${esc(h.name.split(' ')[0])}</div>`:'')).join('')+'</div>':`<div class="empty">Brak przedmiotów.</div>`;return b}
/* --- CMENTARZ --- */
const SPIRIT={wojownik:{atkP:.1},paladyn:{defP:.15},kaplan:{heal:.1},druid:{heal:.1},lucznik:{crit:8},lotr:{crit:8},mag:{atkP:.1},czarnoksieznik:{res:{mrok:25}},bard:{gold:.2}};
function spiritFx(cls){const m=[0,1,1.5,2][tl('cmentarz')],f=SPIRIT[cls]||{atkP:.1},o={};for(const k in f){if(k==='res'){o.res={};for(const r in f.res)o.res[r]=Math.round(f.res[r]*m)}else o[k]=k==='crit'?Math.round(f[k]*m):Math.round(f[k]*m*100)/100}return o}
const sumCost=f=>Math.round(40+f.lvl*15);
const EPI_T=['Odszedł, nie cofnąwszy się ani o krok.','Niech ziemia lekką mu będzie.','Jego pieśń wciąż niesie się po traktach.','Spoczywa wśród przyjaciół z kompanii.','Do końca osłaniał towarzyszy.','Pamięć o nim nie zgaśnie przy ognisku.'];
const hsh=s=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))|0,7);
function graveHtml(){let b=S.spirit?`<div class="note ok">${ic('b_cmentarz',14)} Na następną wyprawę pójdzie z wami <b>duch: ${esc(S.spirit.name)}</b> (${fxDesc(Object.assign({res:{}},S.spirit.fx))}).</div>`:`<div class="note">${ic('b_cmentarz',14)} Za opłatą kapłan przyzwie ducha poległego bohatera. Duch towarzyszy drużynie przez <b>jedną wyprawę</b> i daje premię zależną od jego klasy.</div>`;
 b+=S.fallen.length?'<div class="cols">'+S.fallen.map((f,i)=>{const fx=spiritFx(f.cls),c=sumCost(f);return `<div class="card grave"><div class="av" style="background:#222;filter:grayscale(1)">${bust(sprite(f.cls),f.cls,56,1.75)}</div><div class="info"><div class="nm">✝ ${esc(f.name)}</div><div class="sub">${CLASSES[f.cls].name} · poz. ${f.lvl} · ${ic('skull',12)} ${f.kills||0} pokonanych${f.exps?` · ${f.exps} wypraw`:''}</div>
  <div class="story">${gf(f,'Poległ','Poległa')} ${f.reg?'w krainie '+esc(f.reg):'na etapie '+f.stage}, ${gf(f,'zabity','zabita')} przez: <b>${esc(f.by||'nieznany')}</b>.${f.items&&f.items.length?` Pochowany z: ${esc(f.items.join(', '))}.`:''} <i>„${EPI_T[Math.abs(hsh(f.name))%EPI_T.length]}”</i></div>
  <div class="row sp"><small>${ic('xp',12)} Duch: ${fxDesc(Object.assign({res:{}},fx))}</small><button class="btn-small btn-gold" data-act="gsum" data-i="${i}" ${S.gold<c||(S.spirit&&S.spirit.i===i)?'disabled':''}>${S.spirit&&S.spirit.i===i?'Przyzwany':`Przyzwij ${c} ${ic('gold',12)}`}</button></div></div></div>`}).join('')+'</div>':`<div class="empty">Na cmentarzu nie ma jeszcze grobów kompanii. Oby tak zostało.</div>`;return b}
/* --- GILDIA ŁOWCÓW --- */
const troVal=k=>Math.round((6+ENEMIES[k].hp/8)*(ENEMIES[k].boss?3:1)*[1,1,1.25,1.5][tl('gildia')]);
const bestTh=()=>[99,10,6,3][tl('gildia')];
const bestKnown=k=>tl('gildia')>0&&(S.kills[k]||0)>=bestTh();
function rollBnt(){regOk();const pool=[];S.reg.lv.forEach((l,r)=>{if(l)BIOMES[r].pool.forEach(p=>{if(Math.min(3,l)+1>=p[0]&&!pool.includes(p[1]))pool.push(p[1])})});
 S.bnt=[];const n=Math.max(2,[0,2,3,3][tl('gildia')]);for(let i=0;i<n&&pool.length;i++){const k=pool.splice(Math.floor(Math.random()*pool.length),1)[0],c=2+Math.floor(Math.random()*3);S.bnt.push({k,n:c,g:Math.round(troVal(k)*c*2.2/5)*5,e:1})}}
/* v20: ikony wrogów w jednej skali (rozmiar względny zachowany: goblin mały, smok duży); tylko największe są dopasowane do ramki */
const eImg=(k,s)=>{const o=GFX.S[k]||{},w=o.cw||o.w||s,h=o.ch||o.h||s;let q=s/88;q=Math.min(q,s*1.4/h,s*1.6/w);return `<img class="px eim" src="${sprite(k)}" style="width:${Math.round(w*q)}px;height:${Math.round(h*q)}px" alt="">`};
function guildHtml(){const L=tl('gildia'),tk=Object.keys(S.tro).filter(k=>S.tro[k]>0);
 let b=`<h2>${ic('b_gildia',20)} Trofea <small class="sub">(skup ×${[1,1,1.25,1.5][L]})</small></h2>`;
 b+=tk.length?'<div class="cols">'+tk.map(k=>`<div class="item tro"><div class="ii">${eImg(k,34)}</div><div class="inf"><div class="inm">${ENEMIES[k].name} <span class="cnt">×${S.tro[k]}</span></div><div class="sub">trofeum · ${troVal(k)} zł/szt.</div></div><div class="trob"><button class="btn-small btn-gold" data-act="trosell" data-k="${k}">Sprzedaj 1</button><button class="btn-small" data-act="trosell" data-k="${k}" data-all="1">Wszystkie</button></div></div>`).join('')+'</div>':`<div class="empty">Brak trofeów. Wypadają z potworów pokonanych na wyprawach.</div>`;
 b+=`<h2>${ic('contract',20)} Łowy <small class="sub">(nowe po każdej wyprawie)</small></h2><div class="cols">`+S.bnt.slice(0,Math.max(2,[0,2,3,3][L])).map((t,i)=>{const have=S.tro[t.k]||0;return `<div class="con ${have>=t.n?'ok':''}"><div class="ci">${eImg(t.k,30)}</div><div class="cinf"><b>Przynieś ${t.n}× trofeum: ${ENEMIES[t.k].name}</b><small>Masz: ${have}/${t.n}</small><small class="rw">${ic('gold',12)} ${t.g} + ${t.e} esencji</small></div><button class="btn-small btn-gold" data-act="bnt" data-i="${i}" ${have<t.n?'disabled':''}>Oddaj</button></div>`}).join('')+'</div>';
 b+=`<h2>${ic('map',20)} Bestiariusz <small class="sub">(wpis po ${bestTh()} pokonanych${L>=3?' · +10% obrażeń przeciw znanym':''})</small></h2><div class="best">`;
 for(const k in ENEMIES){const e=ENEMIES[k],kn=bestKnown(k),c=S.kills[k]||0;if(e.obj)continue;b+=`<div class="bent ${kn?'kn':c?'':'unk'}"><div class="bimg2">${eImg(k,40)}</div><div class="binf2"><b>${c||kn?e.name:'???'}</b><small>${ic('skull',10)} ${c}${kn?'':' / '+bestTh()}</small>${kn?`<small>${esc(e.d||'')}</small><div class="bres">${resStr(e.res)||'<small>bez odporności</small>'}</div>`:`<small>${ic('lock',10)} pokonaj więcej, by poznać słabości</small>`}</div></div>`}
 return b+'</div>'}
/* --- obsługa dotyku --- */
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||!S)return;const a=el.dataset.act;
 switch(a){
 case 'alchbuy':{const k=el.dataset.k,s=SUP[k];if(tl('alchemik')<s.lv||S.gold<alchPrice(k)||bagN()>=bagCap()||(s.esc&&S.mat.esc<s.esc))return;S.gold-=alchPrice(k);if(s.esc)S.mat.esc-=s.esc;S.sup[k]=(S.sup[k]||0)+1;save();render();toast(`Uwarzono: ${s.n}`);break}
 case 'zsel':zSel=el.dataset.id||null;render();if(zSel){const m=document.querySelector('.main');if(m)m.scrollTop=0}break;
 case 'zup':{const x=findIt(zSel);if(!x)return;const it=x.it,c=upCost(it);if((it.up||0)>=maxUp()||!canPay(c))return;pay(c);it.up=(it.up||0)+1;itRecalc(it);save();render();toast(`${it.n0}: ulepszono do +${it.up}!`);break}
 case 'zadd':case 'zrer':{const x=findIt(zSel);if(!x)return;const it=x.it,add=a==='zadd',c=exCost(it,add);if(add?(it.ex||tl('zaklinacz')<2):!it.ex)return;if(!canPay(c))return;pay(c);if(!it.b0)itRecalc(it);it.ex=rollEx(it);itRecalc(it);save();render();toast('Przedmiot zyskał nową właściwość ✦');break}
 case 'zdis':{const x=findIt(zSel);if(!x||x.h)return;const v=dismVal(x.it);S.inv=S.inv.filter(i=>i!==x.it);S.mat.odl+=v.o;S.mat.esc+=v.e;zSel=null;save();render();toast(`Rozłożono: +${v.o} odłamków${v.e?`, +${v.e} esencji`:''}`);break}
 case 'gsum':{const i=+el.dataset.i,f=S.fallen[i];if(!f)return;const c=sumCost(f);if(S.gold<c)return;S.gold-=c;S.spirit={i,name:f.name.split(' ')[0],cls:f.cls,fx:spiritFx(f.cls)};save();render();toast(`Duch ${f.name.split(' ')[0]} wyruszy z wami na następną wyprawę.`);break}
 case 'trosell':{const k=el.dataset.k,n=el.dataset.all?S.tro[k]:1;if(!(S.tro[k]>0))return;S.tro[k]-=n;S.gold+=troVal(k)*n;save();render();break}
 case 'bnt':{const t=S.bnt[+el.dataset.i];if(!t||(S.tro[t.k]||0)<t.n)return;S.tro[t.k]-=t.n;S.gold+=t.g;S.mat.esc+=t.e;S.bnt.splice(+el.dataset.i,1);save();render();toast(`Łowy zakończone: +${t.g} zł, +${t.e} esencji`);break}
 case 'fxinfo':{const E=S.exp;if(!E||!E.fx)return;modal(`<h2>${ic('xp',20)} Aktywne efekty wyprawy</h2><p>${E.fx.l.map(esc).join('<br>')}</p><p class="sub">${fxDesc(E.fx)}</p><button class="btn-main" data-act="close">OK</button>`);break}
 }});
