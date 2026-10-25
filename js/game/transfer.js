/* ===== PRZENOSZENIE ZAPISU MIĘDZY URZĄDZENIAMI =====
   Zapis gry siedzi w localStorage – osobno w każdej przeglądarce, aplikacji i urządzeniu.
   Tu można go wysłać (plik albo kod do skopiowania) i wczytać na innym urządzeniu.
   Kod: „ELDARIA1:” + base64(gzip(JSON zapisu)); bez CompressionStream – „ELDARIA0:” + base64(JSON).
   Przed wczytaniem cudzego zapisu obecny trafia do kopii (SAVE_KEY+'_kopia') – można go przywrócić. */
const BAK_KEY=SAVE_KEY+'_kopia';
const b64e=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)};
const b64d=t=>{const s=atob(t),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u};
async function zipStream(u8,kind){const cs=kind==='c'?new CompressionStream('gzip'):new DecompressionStream('gzip');return new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(cs)).arrayBuffer())}
async function saveCode(raw){const u8=new TextEncoder().encode(raw);
 if(typeof CompressionStream!=='undefined'){try{return 'ELDARIA1:'+b64e(await zipStream(u8,'c'))}catch(e){}}
 return 'ELDARIA0:'+b64e(u8)}
/* kod/plik → tekst JSON zapisu (albo wyjątek z polskim komunikatem) */
async function codeToRaw(txt){const t=(txt||'').trim();if(!t)throw new Error('Pusty kod.');
 if(t[0]==='{')return t;
 const m=/^ELDARIA([01]):([\s\S]+)$/.exec(t.replace(/\s+/g,''));if(!m)throw new Error('To nie wygląda na zapis Eldarii.');
 let u8;try{u8=b64d(m[2])}catch(e){throw new Error('Kod jest uszkodzony albo niepełny.')}
 if(m[1]==='1'){if(typeof DecompressionStream==='undefined')throw new Error('Ta przeglądarka nie umie odczytać tego kodu – zaktualizuj ją.');try{u8=await zipStream(u8,'d')}catch(e){throw new Error('Kod jest uszkodzony albo niepełny.')}}
 return new TextDecoder().decode(u8)}
/* krótki opis zapisu do okna potwierdzenia */
function saveInfo(s){const h=(s.roster||[]).find(x=>x.main)||(s.roster||[])[0];const q=s.q?Object.keys(s.q).filter(k=>s.q[k].done).length:0;
 return h?`<b>${esc(h.name)}</b> – ${CLASSES[h.cls]?CLASSES[h.cls].name:''}, poziom ${h.lvl||1} · kompania: ${s.roster.length} · dzień ${s.day||1} · ${s.gold||0} zł · ukończone zadania: ${q}`:'(pusta kompania)'}
function checkSave(raw){let s;try{s=JSON.parse(raw)}catch(e){throw new Error('Kod jest uszkodzony albo niepełny.')}
 if(!s||!Array.isArray(s.roster)||!s.roster.length)throw new Error('W tym kodzie nie ma zapisu gry.');
 if((s.v||0)>SAVE_VER)throw new Error('Ten zapis pochodzi z nowszej wersji gry – najpierw zaktualizuj grę na tym urządzeniu.');
 return s}
const dateTag=()=>new Date().toISOString().slice(0,10);
let _xfRaw=null,_xfCode=null;
function xferModal(msg){const has=hasSave(),bak=localStorage.getItem(BAK_KEY);let cur=null;try{cur=has?JSON.parse(localStorage.getItem(SAVE_KEY)):null}catch(e){}
 /* kod liczymy od razu, żeby „Udostępnij” i „Kopiuj” działały w tym samym dotknięciu (telefony tego wymagają) */
 _xfCode=null;if(has)saveCode(localStorage.getItem(SAVE_KEY)).then(c=>{_xfCode=c});
 const canShare=!!(navigator.canShare&&typeof File!=='undefined'&&navigator.canShare({files:[new File(['x'],'a.txt',{type:'text/plain'})]}));
 modal(`<div class="xfer"><h2>${ic('contract',20)} Przenieś zapis</h2><p class="sub">Każde urządzenie (komputer, telefon, aplikacja) ma własny zapis. Tu przeniesiesz grę z jednego na drugie.</p>${msg||''}
 <h3>${ic('bag',16)} Wyślij ten zapis</h3>${cur?`<p class="xfi">${saveInfo(cur)}</p><div class="row"><button data-act="xffile">${ic('contract',16)} Zapisz do pliku</button>${canShare?`<button data-act="xfshare">${ic('walk',16)} Udostępnij…</button>`:''}<button data-act="xfcopy">${ic('bag',16)} Kopiuj kod</button></div>`:'<p class="sub">Na tym urządzeniu nie ma jeszcze zapisu.</p>'}
 <h3>${ic('flag',16)} Wczytaj zapis z innego urządzenia</h3><input type="file" id="xf-file" accept=".txt,.json,text/plain,application/json" hidden><div class="row"><button data-act="xfpick">${ic('contract',16)} Wybierz plik</button><button data-act="xfpaste">${ic('bag',16)} Wklej kod</button></div>
 ${bak?`<div class="row"><button data-act="xfundo">${ic('back',16)} Przywróć poprzedni zapis z tego urządzenia</button></div>`:''}
 <div class="row"><button data-act="close">Zamknij</button></div></div>`);
 const f=document.getElementById('xf-file');if(f)f.addEventListener('change',async()=>{const fl=f.files&&f.files[0];if(!fl)return;try{xfAsk(await codeToRaw(await fl.text()))}catch(e){xferModal(`<p class="note bad">${esc(e.message)}</p>`)}})}
/* potwierdzenie przed zastąpieniem gry */
function xfAsk(raw){let s;try{s=checkSave(raw)}catch(e){xferModal(`<p class="note bad">${esc(e.message)}</p>`);return}_xfRaw=raw;
 let cur=null;try{cur=hasSave()?JSON.parse(localStorage.getItem(SAVE_KEY)):null}catch(e){}
 modal(`<h2>${ic('flag',20)} Wczytać ten zapis?</h2><p class="xfi">${saveInfo(s)}</p>${cur?`<p class="sub">Zastąpi grę na tym urządzeniu (${saveInfo(cur)}). Obecna gra zostanie zachowana jako kopia – możesz ją przywrócić w „Przenieś zapis”.</p>`:''}
 <div class="actions"><button class="btn-main" data-act="xfok">${ic('flag',18)} Wczytaj i graj</button><button data-act="xfer">Anuluj</button></div>`)}
function xfApply(raw){const cur=localStorage.getItem(SAVE_KEY);try{if(cur)localStorage.setItem(BAK_KEY,cur);localStorage.setItem(SAVE_KEY,raw)}catch(e){xferModal(`<p class="note bad">Nie udało się zapisać – brak miejsca w pamięci przeglądarki.</p>`);return}
 const s=load();if(!s){if(cur)localStorage.setItem(SAVE_KEY,cur);xferModal(`<p class="note bad">Tego zapisu nie da się wczytać.</p>`);return}
 S=s;save();closeModal();screen=S.exp?'exp':'camp';tab='team';render();
 if(loadMsg){modal(`<h2>${ic('xp',20)} Aktualizacja gry</h2><p>${esc(loadMsg)}</p><button class="btn-main" data-act="close">Dobrze!</button>`);loadMsg=''}
 else toast('Zapis wczytany – miłej gry!')}
document.addEventListener('click',async e=>{const el=e.target.closest('[data-act]');if(!el)return;const a=el.dataset.act;if(!a.startsWith('xf'))return;
 if(S&&screen!=='title')save();
 const raw=localStorage.getItem(SAVE_KEY);
 switch(a){
 case 'xfer':xferModal();break;
 case 'xfpick':{const f=document.getElementById('xf-file');if(f)f.click();break}
 case 'xffile':{if(!raw)return;const code=_xfCode||await saveCode(raw),u=URL.createObjectURL(new Blob([code],{type:'text/plain'})),l=document.createElement('a');l.href=u;l.download=`eldaria-zapis-${dateTag()}.txt`;document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);
  xferModal(`<p class="note ok">Plik zapisu pobrany (eldaria-zapis-${dateTag()}.txt). Przenieś go na drugie urządzenie i wybierz tam „Wybierz plik”.</p>`);break}
 case 'xfshare':{if(!raw)return;const code=_xfCode||await saveCode(raw);try{await navigator.share({files:[new File([code],`eldaria-zapis-${dateTag()}.txt`,{type:'text/plain'})],title:'Zapis Eldarii'})}catch(err){}break}
 case 'xfcopy':{if(!raw)return;const code=_xfCode||await saveCode(raw);let ok=false;try{await navigator.clipboard.writeText(code);ok=true}catch(err){}
  xferModal(ok?`<p class="note ok">Kod skopiowany. Wklej go na drugim urządzeniu („Wklej kod”) – np. wyślij go sobie wiadomością.</p>`:`<p class="note">Skopiuj cały kod poniżej (przytrzymaj, „Zaznacz wszystko”, „Kopiuj”):</p><textarea class="xfta" readonly>${code}</textarea>`);
  const ta=document.querySelector('.xfta');if(ta){ta.focus();ta.select()}break}
 case 'xfpaste':modal(`<h2>${ic('bag',20)} Wklej kod zapisu</h2><p class="sub">Wklej tu cały kod skopiowany na innym urządzeniu (zaczyna się od „ELDARIA”).</p><textarea class="xfta" id="xf-code" placeholder="ELDARIA1:…"></textarea><div class="actions"><button class="btn-main" data-act="xfread">${ic('flag',18)} Dalej</button><button data-act="xfer">Wróć</button></div>`);setTimeout(()=>{const t=document.getElementById('xf-code');if(t)t.focus()},50);break;
 case 'xfread':{const t=document.getElementById('xf-code');try{xfAsk(await codeToRaw(t?t.value:''))}catch(err){xferModal(`<p class="note bad">${esc(err.message)}</p>`)}break}
 case 'xfok':if(_xfRaw){const r=_xfRaw;_xfRaw=null;xfApply(r)}break;
 case 'xfundo':{const b=localStorage.getItem(BAK_KEY);if(b){let s=null;try{s=checkSave(b)}catch(err){}if(s){_xfRaw=b;modal(`<h2>${ic('back',20)} Przywrócić poprzedni zapis?</h2><p class="xfi">${saveInfo(s)}</p><div class="actions"><button class="btn-main" data-act="xfok">${ic('flag',18)} Przywróć</button><button data-act="xfer">Anuluj</button></div>`)}}break}
 }});
