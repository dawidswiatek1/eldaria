/* ===== WIDOK: skalowanie na komputerze (zoom całego UI), kadr (letterbox), obsługa myszy i klawiatury ===== */
let UIZ=1,_mqDone=false,_css0=null;
/* reguły @media odnoszą się do rzeczywistego okna – przeliczamy progi na rozmiar logiczny (po zoomie) */
function scaleMQ(z){const st=document.getElementById('eldaria-css');if(!st)return;if(_css0==null)_css0=st.textContent;_mqDone=true;
 st.textContent=z===1?_css0:_css0.replace(/\((max|min)-(width|height):\s*(\d+(?:\.\d+)?)px\)/g,(m,a,b,v)=>`(${a}-${b}:${Math.round(v*z)}px)`)}
const IS_TOUCH=matchMedia('(pointer:coarse)').matches,HAS_HOVER=matchMedia('(hover:hover) and (pointer:fine)').matches;
function applyScale(){const W=innerWidth,H=innerHeight,de=document.documentElement,app=document.getElementById('app');
 /* bazowa rozdzielczość logiczna ok. 1120×630; skok co 0,25 – ostre piksele i czytelny tekst */
 let z=Math.max(1,Math.round(Math.min(W/1120,H/630)*4)/4);while(z>1&&H/z<560)z-=.25;if(IS_TOUCH&&Math.min(W,H)<600)z=1;
 if(z!==UIZ||!_mqDone)scaleMQ(z);UIZ=z;de.style.zoom=z===1?'':String(z);
 const lw=W/z,lh=H/z;let w=Math.min(lw,lh*2.4),h=Math.min(lh,w/1.3);if(IS_TOUCH&&H>W){w=lw;h=lh}
 const lb=w<lw-2||h<lh-2;de.classList.toggle('lbox',lb);
 if(app)Object.assign(app.style,lb?{left:Math.round((lw-w)/2)+'px',top:Math.round((lh-h)/2)+'px',width:Math.round(w)+'px',height:Math.round(h)+'px',right:'auto',bottom:'auto'}:{left:'',top:'',width:'',height:'',right:'',bottom:''});
 de.style.setProperty('--vw',(w/100).toFixed(2)+'px');de.style.setProperty('--vh',(h/100).toFixed(2)+'px')}
const LW=()=>{const a=document.getElementById('app');return a&&a.clientWidth||innerWidth/UIZ};
const LH=()=>{const a=document.getElementById('app');return a&&a.clientHeight||innerHeight/UIZ};
applyScale();addEventListener('resize',applyScale);
if(HAS_HOVER)document.documentElement.classList.add('mouse');
const lpTxt=()=>HAS_HOVER?'Prawy klik na postaci':'Przytrzymaj postać';
/* kółko myszy: listy poziome (mapa miasta, krainy) przewijają się w bok */
addEventListener('wheel',e=>{if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;let el=e.target;
 while(el&&el!==document.body){if(el.scrollWidth>el.clientWidth+2&&el.scrollHeight<=el.clientHeight+2){const ox=getComputedStyle(el).overflowX;if(ox==='auto'||ox==='scroll'){el.scrollLeft+=e.deltaY;e.preventDefault();return}}
  if(el.scrollHeight>el.clientHeight+2&&/auto|scroll/.test(getComputedStyle(el).overflowY))return;el=el.parentElement}},{passive:false});
/* przeciąganie mapy miasta myszą */
let _drag=null,_dragMoved=false;
document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;const sc=e.target.closest('#tscroll');if(!sc)return;_drag={sc,x:e.clientX,l:sc.scrollLeft};_dragMoved=false});
document.addEventListener('pointermove',e=>{if(!_drag)return;const dx=e.clientX-_drag.x;if(Math.abs(dx)>5)_dragMoved=true;if(_dragMoved){_drag.sc.scrollLeft=_drag.l-dx;_drag.sc.classList.add('drag')}});
addEventListener('pointerup',()=>{if(_drag)_drag.sc.classList.remove('drag');_drag=null});
document.addEventListener('click',e=>{if(_dragMoved){_dragMoved=false;e.stopPropagation();e.preventDefault()}},true);
/* prawy klik na postaci w walce = karta informacji */
document.addEventListener('contextmenu',e=>{const el=e.target.closest('.unit');if(!el||typeof B==='undefined'||!B)return;e.preventDefault();const u=B.units.find(x=>x.uid===el.dataset.uid);if(u)unitInfo(u)});
/* klawiatura: 1–9 umiejętności, Enter/Spacja – użyj/dalej, Esc – zamknij/wróć, A – auto */
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.altKey||e.metaKey)return;const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;
 const md=document.getElementById('modal'),open=md&&!md.classList.contains('hidden'),k=e.key,q=s=>document.querySelector(s),press=el=>{if(el&&!el.disabled){el.click();e.preventDefault();return true}return false};
 if(k==='Escape'){if(open){press(md.querySelector('[data-act=close],[data-act=evskip],[data-act=dclose],[data-act=introok]'))||(modalLocked()?0:(closeModal(),e.preventDefault()));return}
  {const de=q('[data-esc]');if(de){press(de);return}}
  if(screen==='hero'||screen==='map'){press(q('[data-act=back]'));return}if(screen==='camp'&&townView){press(q('[data-act=town][data-v=""]'));return}return}
 if(open){if(k==='Enter'||k===' '){press(md.querySelector('.btn-main:not([disabled])'))}return}
 if(screen==='battle'&&typeof B!=='undefined'&&B){
  if(/^[1-9]$/.test(k)){press(document.querySelectorAll('.pbar .skills button')[+k-1]);return}
  if(k==='Enter'||k===' '){press(q('.pbar .use'));return}
  if(k==='a'||k==='A'){press(q('#b-auto'));return}return}
 if(screen==='exp'&&(k==='Enter'||k===' '||k==='ArrowRight')){press(q('.xbot .btn-main'));return}});
