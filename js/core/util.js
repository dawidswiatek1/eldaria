/* ===== PODSTAWY: klucze zapisu, pomocnicze funkcje, ustawienia ===== */
const SAVE_KEY='kompania_smialkow_v1',SAVE_VER=11,SET_KEY='kompania_ustawienia_v1',BEST_KEY='kompania_rekord_v1';
const TEAM_MAX=5,ROSTER_MAX=10,INV_MAX=30;
const $=s=>document.querySelector(s);
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let SET={speed:1,auto:false};
try{Object.assign(SET,JSON.parse(localStorage.getItem(SET_KEY)||'{}'))}catch(e){}
const sleep=ms=>new Promise(r=>setTimeout(r,ms/SET.speed));
function applySpeed(){document.documentElement.style.setProperty('--sp',(1/SET.speed).toFixed(3))}
