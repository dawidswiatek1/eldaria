/* ===== START GRY =====
   Ten plik musi być wczytany OSTATNI. W oryginale cały kod był jednym skryptem, więc gra
   ruszała dopiero, gdy wszystko było zdefiniowane – tutaj czekamy na to samo:
   wszystkie pliki js/ wczytane + sprite'y (GAME_BOOT z js/ui/input.js) + czcionka + obrazki
   z assets/ (wczytane z góry, żeby nic nie „doskakiwało” po pierwszym wyświetleniu). */
(function(){
 const urls=new Set();
 const walk=o=>{if(typeof o==='string'){if(o.startsWith('assets/'))urls.add(o)}else if(o&&typeof o==='object')for(const k in o)walk(o[k])};
 walk(VART);walk(VART18);walk(GFX.BLD);walk(GFX.P);
 const st=document.getElementById('eldaria-css');
 if(st)(st.textContent.match(/url\((assets\/[^)]+)\)/g)||[]).forEach(u=>urls.add(u.slice(4,-1)));
 const keep=window.ELD_PRELOAD=[];
 const img=u=>new Promise(res=>{const im=new Image();keep.push(im);im.onload=im.onerror=()=>res();im.src=u});
 const font=document.fonts&&document.fonts.load?document.fonts.load('16px Pix').catch(()=>{}):null;
 Promise.all([GAME_BOOT,font,...[...urls].map(img)]).then(()=>render());
})();
