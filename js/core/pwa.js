/* ===== APLIKACJA NA TELEFON (PWA) =====
   Na stronie (https, np. GitHub Pages) gra dołącza manifest i service worker (sw.js): można ją
   zainstalować na telefonie („Dodaj do ekranu głównego”) i grać bez internetu.
   Otwarta z dysku (file://) albo w aplikacji na Androida (android/) nic tu nie robi. */
(function(){if(!/^https?:$/.test(location.protocol))return;
 const add=(t,a)=>{const e=document.createElement(t);for(const k in a)e.setAttribute(k,a[k]);document.head.appendChild(e)};
 add('link',{rel:'manifest',href:'manifest.webmanifest'});add('link',{rel:'icon',href:'assets/icons/icon-192.png'});add('link',{rel:'apple-touch-icon',href:'assets/icons/apple-touch-icon.png'});
 if(!('serviceWorker' in navigator))return;
 const had=!!navigator.serviceWorker.controller;navigator.serviceWorker.register('sw.js').catch(()=>{});
 /* nowa wersja pobrana w tle: zadziała przy następnym uruchomieniu (nie przeładowujemy w trakcie gry) */
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had&&typeof toast==='function')toast('Pobrano nową wersję gry – uruchom ją ponownie.')})})();
