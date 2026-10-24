/* ===== FORMACJA: 2 miejsca z przodu (0,1) + 3 z tyłu (2,3,4) ===== */
let formSel=null;
function syncForm(){if(!S)return;const ok=id=>S.roster.some(h=>h.id===id&&!h.tr&&!h.hosp);if(!Array.isArray(S.team))S.team=[];
 if(!Array.isArray(S.slots)||S.slots.length!==5)S.slots=[null,null,null,null,null];
 S.slots=S.slots.map((id,i,a)=>id!=null&&ok(id)&&S.team.includes(id)&&a.indexOf(id)===i?id:null);
 S.team.filter(ok).forEach(id=>{if(S.slots.includes(id))return;const h=getHero(id),order=MELEE_CLS[h.cls]?[0,1,2,3,4]:[2,3,4,0,1];const i=order.find(j=>S.slots[j]==null);if(i!=null)S.slots[i]=id});
 S.team=S.slots.filter(id=>id!=null)}
function formHtml(){syncForm();const slot=i=>{const id=S.slots[i],h=id!=null?getHero(id):null,r=h&&MELEE_CLS[h.cls];
  return `<button class="fslot ${formSel===i?'sel':''} ${h?'':'empty'} ${h&&h.hp<=0?'ko':''}" data-act="fslot" data-i="${i}" aria-label="Miejsce ${i+1}">${h?`<div class="fspr">${animBox(heroA(h),1,'','margin:0 auto')}</div><span class="fn">${esc(h.name.split(' ')[0])}</span><span class="frc ${r?'m':'r'}">${ic(r?'miecz':'luk',12)}${r?'wręcz':'dystans'}</span><i class="fhp"><i style="width:${Math.round(h.hp/stats(h).maxHp*100)}%"></i></i>`:`<span class="fe">puste</span>`}</button>`};
 return `<div class="form"><div class="frow"><div class="fgrp"><div class="fl">2. rząd</div><div class="fsl">${[4,3,2].map(slot).join('')}</div></div><div class="fgrp front"><div class="fl">1. rząd</div><div class="fsl">${[1,0].map(slot).join('')}</div></div><div class="fen">${ic('fight',18)}<small>wróg</small></div></div>
 <div class="sub fnote">${formSel!=null?`<b class="gold">Wybrano miejsce – dotknij drugiego, aby zamienić.</b> `:'Dotknij dwóch miejsc, aby je zamienić. '}${ic('miecz',12)} Wręcz trafia tylko 1. rząd wroga, dopóki ktoś w nim stoi. ${ic('luk',12)} Dystans – dowolny cel. 1. rząd: +15% obrony, 2. rząd: +10% obrażeń z dystansu.</div></div>`}
function formModal(){return `<h2>${ic('nav_team',20)} Formacja</h2>${formHtml()}<button class="btn-main" data-act="close" style="margin-top:6px">Gotowe</button>`}
function refreshForm(){const m=document.getElementById('modal');if(!m.classList.contains('hidden')&&m.querySelector('.form'))modal(formModal());else render()}
