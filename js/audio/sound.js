/* ===== DŹWIĘK: proceduralne SFX + muzyka chiptune (WebAudio, offline) ===== */
SET.snd=Object.assign({m:.8,mu:.5,sf:.8,mute:false},SET.snd||{});
const SND=(()=>{let ac=null,master,mus,sfx,nbuf,cur=null,curK='',tmr=null,last={};
 const vol=()=>{if(!ac)return;const s=SET.snd,t=ac.currentTime;master.gain.setTargetAtTime(s.mute?0:s.m,t,.05);mus.gain.setTargetAtTime(s.mu*.55,t,.05);sfx.gain.setTargetAtTime(s.sf,t,.05)};
 function init(){if(ac){if(ac.state==='suspended')ac.resume();return}const C=window.AudioContext||window.webkitAudioContext;if(!C)return;try{ac=new C()}catch(e){return}
  const comp=ac.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(ac.destination);
  master=ac.createGain();master.connect(comp);mus=ac.createGain();mus.connect(master);sfx=ac.createGain();sfx.connect(master);vol();
  nbuf=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const d=nbuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  tmr=setInterval(tick,90);setInterval(pickTrack,700);pickTrack()}
 /* --- prymitywy --- */
 function env(g,t,a,dur,v){g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+dur)}
 function tone(f,dur,o){o=o||{};const t=ac.currentTime+(o.d||0),os=ac.createOscillator(),g=ac.createGain();os.type=o.w||'square';os.frequency.setValueAtTime(f,t);if(o.to)os.frequency.exponentialRampToValueAtTime(o.to,t+dur);
  env(g,t,o.a||.005,dur,o.v||.2);let n=os;if(o.lp){const fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=o.lp;os.connect(fl);n=fl}n.connect(g);g.connect(o.out||sfx);os.start(t);os.stop(t+dur+.05)}
 function noise(dur,o){o=o||{};const t=ac.currentTime+(o.d||0),s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=nbuf;s.loop=true;f.type=o.ft||'bandpass';f.frequency.setValueAtTime(o.f||1500,t);if(o.to)f.frequency.exponentialRampToValueAtTime(o.to,t+dur);f.Q.value=o.q||1;
  env(g,t,o.a||.003,dur,o.v||.25);s.connect(f);f.connect(g);g.connect(o.out||sfx);s.start(t,Math.random()*.5);s.stop(t+dur+.05)}
 const arp=(fs,step,o)=>fs.forEach((f,i)=>tone(f,o.dur||.18,Object.assign({},o,{d:(o.d||0)+i*step})));
 /* --- efekty --- */
 const FX={
  tap:()=>{tone(1100,.04,{w:'triangle',v:.08});tone(1650,.03,{w:'square',v:.03,d:.015})},
  coin:()=>{tone(1320,.07,{v:.1});tone(1980,.18,{v:.1,d:.06});tone(2640,.12,{w:'triangle',v:.05,d:.12})},
  equip:()=>{noise(.08,{f:3000,q:3,v:.25});tone(420,.08,{w:'triangle',v:.15,d:.02,to:300});noise(.12,{f:6000,q:8,v:.12,d:.06})},
  lvl:()=>{arp([523,659,784,1047],.09,{v:.12,dur:.16});arp([784,1047,1319],.0,{v:.07,dur:.6,d:.38,w:'triangle'})},
  ciete:()=>{noise(.16,{f:1800,to:5000,q:1.5,v:.32,ft:'bandpass'});noise(.06,{f:900,q:2,v:.18,d:.08})},
  klute:()=>{noise(.09,{f:3000,to:900,q:4,v:.2});tone(260,.06,{w:'triangle',v:.18,d:.06,to:120})},
  obuch:()=>{tone(140,.18,{w:'sine',v:.45,to:50});noise(.1,{ft:'lowpass',f:700,v:.4})},
  ogien:()=>{noise(.45,{ft:'lowpass',f:400,to:2500,v:.35,a:.04});noise(.3,{f:900,q:.7,v:.15,d:.1})},
  lod:()=>{arp([1760,2349,2093,2794],.035,{w:'triangle',v:.08,dur:.25});noise(.2,{ft:'highpass',f:5000,v:.12})},
  trucizna:()=>{for(let i=0;i<4;i++)tone(300+Math.random()*250,.07,{w:'sine',v:.14,d:i*.06,to:500+Math.random()*300});noise(.25,{ft:'lowpass',f:600,v:.12})},
  mrok:()=>{tone(110,.5,{w:'sawtooth',v:.16,to:55,lp:700});tone(116,.5,{w:'sawtooth',v:.12,to:58,lp:600});noise(.4,{ft:'lowpass',f:300,v:.15,a:.08})},
  swiete:()=>{arp([880,1109,1319],0,{w:'triangle',v:.09,dur:.6,a:.05});tone(1760,.5,{w:'sine',v:.05,d:.05})},
  arkana:()=>{tone(600,.3,{w:'square',v:.07,to:1800,lp:3000});tone(900,.25,{w:'triangle',v:.08,d:.05,to:300})},
  hit:()=>{noise(.07,{ft:'lowpass',f:1200,v:.35});tone(180,.08,{w:'square',v:.12,to:90,lp:1200})},
  crit:()=>{tone(90,.3,{w:'sine',v:.5,to:40});noise(.2,{ft:'lowpass',f:2000,v:.45});tone(1500,.12,{w:'square',v:.06,d:.03})},
  miss:()=>noise(.18,{f:700,to:2500,q:2,v:.14,a:.03}),
  heal:()=>arp([659,880,1175,1319],.06,{w:'sine',v:.1,dur:.3}),
  buff:()=>{tone(392,.35,{w:'triangle',v:.1,to:784});tone(588,.35,{w:'triangle',v:.06,d:.08,to:1175})},
  down:()=>{tone(72,.13,{w:'sine',v:.5,to:44});tone(66,.16,{w:'sine',v:.42,to:40,d:.24});tone(233,.7,{w:'triangle',v:.06,to:196,d:.05,lp:900});noise(.3,{ft:'lowpass',f:500,v:.1,d:.02})},
  death:()=>{tone(300,.6,{w:'square',v:.1,to:60,lp:1500});noise(.5,{ft:'lowpass',f:800,to:150,v:.18,d:.1})},
  win:()=>{const n=[523,659,784,1047,784,1047];n.forEach((f,i)=>tone(f,i===5?.7:.14,{v:.11,d:i*.12}));tone(262,.9,{w:'triangle',v:.12,d:.6})},
  lose:()=>{[392,370,349,262].forEach((f,i)=>tone(f,i===3?1.1:.35,{w:'triangle',v:.13,d:i*.32,lp:1800}))},
  chest:()=>{tone(150,.25,{w:'sawtooth',v:.08,to:220,lp:500});noise(.15,{ft:'lowpass',f:500,v:.2,d:.18});FX.coin()},
  trap:()=>{noise(.06,{f:2500,q:5,v:.3});tone(800,.05,{w:'square',v:.08,d:.02});tone(120,.25,{w:'sine',v:.4,to:45,d:.07});noise(.2,{ft:'lowpass',f:900,v:.3,d:.07})},
  step:()=>{for(let i=0;i<4;i++)noise(.06,{ft:'lowpass',f:380+Math.random()*120,v:.22,d:i*.22})},
  door:()=>{tone(90,.6,{w:'sawtooth',v:.07,to:140,lp:400,a:.05});noise(.5,{ft:'bandpass',f:400,q:6,to:700,v:.12,a:.1});noise(.12,{ft:'lowpass',f:300,v:.35,d:.55})}
 };
 function play(k){if(!ac||SET.snd.mute||!FX[k])return;const now=performance.now();if(last[k]&&now-last[k]<45)return;last[k]=now;try{FX[k]()}catch(e){}}
 /* --- muzyka --- */
 const N=(r,s)=>r*Math.pow(2,s/12);
 const SC={min:[0,2,3,5,7,8,10],dor:[0,2,3,5,7,9,10],mix:[0,2,4,5,7,9,10],hm:[0,2,3,5,7,8,11],phr:[0,1,3,5,7,8,10]};
 const deg=(sc,d)=>{const L=sc.length,o=Math.floor(d/L);return sc[((d%L)+L)%L]+12*o};
 /* mel: stopnie skali (null = pauza), bass: stopnie, dr: k=stopa s=werbel h=hihat */
 const TR={
  town:{bpm:96,r:147,sc:'dor',lead:'triangle',lv:.07,mel:[4,null,3,2,0,null,2,4,5,null,4,2,4,null,null,null,7,null,6,4,5,null,4,3,2,null,0,1,2,null,null,null],bass:[0,0,3,3,4,4,0,0],dr:'k.h.s.h.k.h.s.hh',pad:0},
  battle:{bpm:138,r:110,sc:'min',lead:'square',lv:.05,mel:[0,null,0,2,3,null,2,0,4,null,4,3,2,null,0,null,5,4,3,2,4,null,3,2,1,null,2,null,-1,null,null,null],bass:[0,0,5,5,3,3,4,4],dr:'k.hsk.hsk.hsk.hs',oct8:1},
  boss:{bpm:150,r:98,sc:'hm',lead:'sawtooth',lv:.04,mel:[0,1,0,null,4,null,3,2,6,null,5,4,3,null,2,null,0,1,2,3,4,null,5,null,6,5,4,null,4,null,null,null],bass:[0,0,0,0,5,5,4,4],dr:'kkhskkhskkhsk.ss',oct8:1},
  amb0:{bpm:70,r:110,sc:'min',lead:'sine',lv:.05,mel:[4,null,null,null,2,null,null,null,3,null,null,null,null,null,null,null,7,null,null,null,6,null,4,null,null,null,null,null,null,null,null,null],bass:[0,0,5,5],pad:1,dr:''},
  amb1:{bpm:84,r:147,sc:'mix',lead:'triangle',lv:.05,mel:[0,null,2,null,4,null,null,null,5,null,4,null,2,null,null,null,4,null,null,2,0,null,null,null,-1,null,0,null,null,null,null,null],bass:[0,0,6,6,3,3,0,0],pad:1,dr:'k.......k...h...'},
  amb2:{bpm:60,r:98,sc:'phr',lead:'sine',lv:.05,mel:[7,null,null,null,8,null,null,null,null,null,null,null,4,null,null,null,null,null,null,null,1,null,null,null,0,null,null,null,null,null,null,null],bass:[0,0,1,1],pad:1,dr:''},
  amb3:{bpm:66,r:165,sc:'min',lead:'triangle',lv:.045,mel:[0,null,4,null,7,null,null,null,6,null,null,null,4,null,null,null,2,null,4,null,3,null,null,null,null,null,null,null,null,null,null,null],bass:[0,0,3,3,5,5,4,4],pad:1,dr:''},
  amb4:{bpm:76,r:82,sc:'hm',lead:'sawtooth',lv:.03,mel:[0,null,null,1,0,null,null,null,4,null,null,5,4,null,null,null,null,null,null,null,6,null,7,null,null,null,null,null,null,null,null,null],bass:[0,0,0,0,1,1,0,0],pad:1,dr:'k.......k.k.....'}
 };
 function startTrack(k){if(k===curK||!ac)return;curK=k;const t=ac.currentTime;if(cur){const g=cur.g;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);g.gain.linearRampToValueAtTime(0,t+1.4);setTimeout(()=>g.disconnect(),1600)}
  const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+1.6);g.connect(mus);cur={k,T:TR[k],g,step:0,next:t+.1}}
 function tick(){if(!cur||!ac||ac.state!=='running')return;const T=cur.T,sp=60/T.bpm/2,sc=SC[T.sc],end=ac.currentTime+.35;
  while(cur.next<end){const i=cur.step,t0=cur.next-ac.currentTime,o={out:cur.g,d:Math.max(0,t0)};
   const m=T.mel[i%T.mel.length];if(m!=null){let L=1;while(T.mel[(i+L)%T.mel.length]==null&&L<4)L++;tone(N(T.r*2,deg(sc,m)),sp*L*.95,Object.assign({},o,{w:T.lead,v:T.lv,a:T.pad?.06:.01,lp:2400}))}
   if(i%4===0||(T.oct8&&i%2===0)){const b=T.bass[Math.floor(i/4)%T.bass.length];tone(N(T.r/2,deg(sc,b)+(T.oct8&&i%4===2?12:0)),T.oct8?sp*1.6:sp*3.8,Object.assign({},o,{w:'triangle',v:.12}))}
   if(T.pad&&i%16===0){const b=T.bass[Math.floor(i/4)%T.bass.length];[0,2,4].forEach(x=>tone(N(T.r,deg(sc,b+x)),sp*15,Object.assign({},o,{w:'sine',v:.035,a:sp*4})))}
   const dc=T.dr&&T.dr[i%T.dr.length];if(dc==='k')tone(110,.12,Object.assign({},o,{w:'sine',v:.3,to:40}));else if(dc==='s')noise(.1,Object.assign({},o,{f:1800,q:.8,v:.12}));else if(dc==='h')noise(.03,Object.assign({},o,{ft:'highpass',f:7000,v:.06}));
   cur.step++;cur.next+=sp}}
 function pickTrack(){if(!ac)return;let k='town';try{if(screen==='battle'&&B)k=B.units.some(u=>u.side==='e'&&u.boss)?'boss':'battle';else if(screen==='exp'&&S&&S.exp)k='amb'+(S.exp.r||0)}catch(e){}startTrack(k)}
 document.addEventListener('visibilitychange',()=>{if(!ac)return;document.hidden?ac.suspend():ac.resume()});
 ['pointerdown','keydown','touchend'].forEach(e=>document.addEventListener(e,init,{capture:true,passive:true}));
 return {play,vol,init,get ac(){return ac},get track(){return curK}}})();
/* --- ustawienia --- */
function sndHtml(){const s=SET.snd,r=(k,n)=>`<label class="sndr"><span>${n}</span><input type="range" min="0" max="100" value="${Math.round(s[k]*100)}" data-snd="${k}"><b>${Math.round(s[k]*100)}%</b></label>`;
 return `<h2>${ic('sk_ballada',20)} Dźwięk i muzyka</h2><div class="sndbox">${r('m','Głośność ogólna')}${r('mu','Muzyka')}${r('sf','Efekty')}</div><div class="actions"><button data-act="sndmute" class="${s.mute?'btn-red':''}">${s.mute?'🔇 Wyciszone – włącz dźwięk':'🔊 Wycisz wszystko'}</button><button data-act="close">Zamknij</button></div>`}
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.snd;if(!k)return;SET.snd[k]=e.target.value/100;e.target.nextElementSibling.textContent=e.target.value+'%';SND.vol();saveSet()});
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.snd==='sf')SND.play('coin')});
/* --- podpięcie pod grę (opakowanie funkcji globalnych) --- */
(()=>{const W=(n,f)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){return f(o,this,arguments)}};
 const ACT={buy:'coin',sell:'coin',armsellok:'coin',supbuy:'coin',alchbuy:'coin',trosell:'coin',recruit:'coin',bup:'coin',tbld:'coin',conclaim:'coin',equip:'equip',unequip:'equip',armequip:'equip',armunequip:'equip',zup:'lvl',zadd:'buff',rest:'heal',injheal:'heal',heal:'heal',expwalk:null,exroom:null,chopen:null,unit:null,modal:null,snd:null,sndmute:null,skill:'tap'};
 document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.disabled)return;const a=el.dataset.act;if(a==='snd'){modal(sndHtml());return}if(a==='sndmute'){SET.snd.mute=!SET.snd.mute;saveSet();SND.vol();modal(sndHtml());return}
  if(a in ACT){if(ACT[a])setTimeout(()=>SND.play(ACT[a]),0)}else SND.play('tap')},true);
 W('impact',(o,t,a)=>{const [tg,fx,crit,u]=a;try{const dt=(fx&&fx!=='melee'&&FX2DT[fx])||(B&&B.curDt)||(u&&u.dt)||'ciete';SND.play(dt);setTimeout(()=>SND.play(crit?'crit':'hit'),40)}catch(e){}return o.apply(t,a)});
 W('flt',(o,t,a)=>{const c=a[2]||'';if(/miss/.test(c)&&!/res/.test(c))SND.play('miss');else if(c==='heal')SND.play('heal');return o.apply(t,a)});
 W('aura',(o,t,a)=>{SND.play('buff');return o.apply(t,a)});
 W('die',(o,t,a)=>{SND.play('death');return o.apply(t,a)});
 W('checkEnd',(o,t,a)=>{const was=B&&B.over,r=o.apply(t,a);if(B&&B.over&&!was)setTimeout(()=>SND.play(alive('h').length?'win':'lose'),300);return r});
 W('gainXp',(o,t,a)=>{const r=o.apply(t,a);if(Array.isArray(r)&&r.length)setTimeout(()=>SND.play('lvl'),700);return r});
 W('toast',(o,t,a)=>{const s=String(a[0]||'');if(/zakłada|Zdjęto/.test(s))SND.play('equip');else if(/Sprzedano|Kupiono|kupion|zł\b/.test(s))SND.play('coin');return o.apply(t,a)});
 W('enterRoom',(o,t,a)=>{SND.play('door');return o.apply(t,a)});
 W('expWalk',(o,t,a)=>{SND.play('step');return o.apply(t,a)});
 W('chestModal',(o,t,a)=>{SND.play(/Pułapka/.test(a[0]||'')?'trap':'chest');return o.apply(t,a)});
 W('hurtAll',(o,t,a)=>{SND.play('trap');return o.apply(t,a)});
})();
