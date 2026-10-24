/* ===== ZBROJOWNIA: wszystkie przedmioty kompanii ===== */
function allItems(){return S.inv.map(it=>({it,h:null})).concat(...S.roster.map(h=>Object.values(h.eq).filter(Boolean).map(it=>({it,h}))))}
function findItem(id){return allItems().find(x=>x.it.id===id)}
function armoryHtml(){const all=allItems(),SO=Object.keys(SLOTS);
 let L=all.filter(({it})=>(!AF.s||it.s===AF.s)&&it.r>=AF.r&&(!AF.c||!it.cls||it.cls.includes(AF.c)));
 const so={r:(a,b)=>b.it.r-a.it.r||b.it.price-a.it.price,s:(a,b)=>SO.indexOf(a.it.s)-SO.indexOf(b.it.s)||b.it.r-a.it.r,v:(a,b)=>b.it.price-a.it.price,h:(a,b)=>(a.h?a.h.name:'~').localeCompare(b.h?b.h.name:'~')||b.it.r-a.it.r}[AF.o];L.sort(so);
 const chip=(k,v,lab)=>`<button class="chip ${AF[k]===v?'on':''}" data-act="af" data-k="${k}" data-v="${v}">${lab}</button>`;
 const worn=all.filter(x=>x.h).length,val=S.inv.reduce((a,it)=>a+sellPrice(it),0);
 let o=`<div class="sub" style="margin:2px 0 6px">${ic('bag',14)} Plecak ${S.inv.length}/${INV_MAX} · założone ${worn} · plecak wart ${val} ${ic('gold',12)}</div>`;
 o+=`<div class="filters"><div>${chip('s','','Wszystko')}${SO.map(k=>chip('s',k,ic(SLOT_IC[k],14)+SLOTS[k])).join('')}</div>
 <div>${chip('r',0,'Każda')}${[1,2,3].map(r=>chip('r',r,`<i style="color:${RAR[r].c}">◆</i>${['','Rzadkie+','Epickie+','Legend.'][r]}`)).join('')}</div>
 <div><button class="chip ${AF.c?'on':''}" data-act="af" data-k="c">Klasa: ${AF.c?CLASSES[AF.c].name:'każda'} ▸</button><button class="chip" data-act="af" data-k="o">Sortuj: ${{r:'rzadkość',s:'miejsce',v:'wartość',h:'właściciel'}[AF.o]} ▸</button></div></div>`;
 o+=L.length?'<div class="cols">'+L.map(({it,h})=>`<div class="armit" data-act="armitem" data-id="${it.id}">${itemHtml(it,h?`<span class="owner">${bust(heroSprite(h),h.cls,30,1,-6)}<small>${esc(h.name.split(' ')[0])}</small></span>`:`<span class="owner bag">${ic('bag',18)}<small>Plecak</small></span>`)}</div>`).join('')+'</div>':`<div class="empty">Brak przedmiotów pasujących do filtrów.</div>`;
 return o}
function armDetail(id){const x=findItem(id);if(!x){closeModal();return}const {it,h}=x,R=RAR[it.r];armSel=id;
 let o=`<div class="armdet r${it.r}" style="--rc:${R.c}"><div class="ii big">${itIc(it,48)}</div><div><div class="inm" style="color:${R.c};font-size:1.15rem">${esc(it.n)}</div><div class="sub">${R.n} · ${SLOTS[it.s]} · poziom ${it.L||1}</div></div></div>
 <div style="margin:6px 0">${statStr(it.st)}</div>${it.res?`<div class="resrow"><span class="sub">Odporności:</span>${resStr(it.res)}</div>`:''}
 <div class="sub">${it.cls?'Tylko dla: '+it.cls.map(c=>CLASSES[c].name).join(', '):'Dla wszystkich klas'}${it.s==='bron'?' · obrażenia: '+DT[WDT[it.b]].n:''} · wartość ${sellPrice(it)} ${ic('gold',12)}</div>
 <div class="sub" style="margin-top:4px">${h?`${ic('nav_team',14)} Nosi: <b>${esc(h.name)}</b>`:`${ic('bag',14)} W plecaku`}</div>`;
 const cand=S.roster.filter(r=>r!==h);
 o+=`<h2 style="margin-top:10px">${h?'Przekaż innemu bohaterowi':'Załóż bohaterowi'}</h2>`+(cand.length?`<div class="eqlist">${cand.map(r=>{const ok=canEquip(r,it),cur=r.eq[it.s];return `<button class="eqh" data-act="armequip" data-id="${it.id}" data-h="${r.id}" ${ok?'':'disabled'}>${bust(heroSprite(r),r.cls,34,1,-6)}<span><b>${esc(r.name)}</b><small>${CLASSES[r.cls].name}${ok?(cur?' · zamieni: '+esc(cur.n):' · wolne miejsce'):' · nie może nosić'}</small>${ok?cmpHtml(it,cur):''}</span></button>`}).join('')}</div>`:`<div class="empty">Brak innych bohaterów.</div>`);
 o+=`<div class="row" style="margin-top:10px">`+(h?`<button data-act="armunequip" data-id="${it.id}">${ic('bag',16)} Zdejmij do plecaka</button>`:(armConfirm?`<button class="btn-red" data-act="armsellok" data-id="${it.id}">Tak, sprzedaj za ${sellPrice(it)} ${ic('gold',14)}</button><button data-act="armdet" data-id="${it.id}">Anuluj</button>`:`<button class="btn-gold" data-act="armsell" data-id="${it.id}">Sprzedaj +${sellPrice(it)} ${ic('gold',14)}</button>`))+`<button data-act="close">Zamknij</button></div>`;
 if(armConfirm)o=`<div class="note">${ic('skull',14)} To ${R.n.toLowerCase()} przedmiot. Na pewno sprzedać?</div>`+o;
 modal(o)}
function moveItem(it,from,to){/* from: bohater lub null (plecak), to: bohater lub null */
 const cur=to?to.eq[it.s]:null;const need=(to?(cur?1:0):1)-(from?0:1);if(S.inv.length+need>INV_MAX){toast('Plecak jest pełny!');return false}
 if(from)changeHero(from,()=>{from.eq[it.s]=null});else S.inv.splice(S.inv.findIndex(x=>x.id===it.id),1);
 if(to){changeHero(to,()=>{if(cur)S.inv.push(cur);to.eq[it.s]=it})}else S.inv.push(it);save();return true}
