/* ===== WALKA ===== */
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const BEASTS=['wilk','ghul','harpia','nietoperz','pajak','troll','smok','szlam','dzik','wilkolak','wilkolakA','bazyliszek','zmij'];
function unitFromHero(h){const c=CLASSES[h.cls],s=stats(h),A=heroA(h);return {uid:'h'+h.id,side:'h',hero:h,key:h.cls,name:h.name.split(' ')[0],cls:h.cls,A,img:A.f0,hp:Math.min(h.hp,s.maxHp),maxHp:s.maxHp,atk:s.atk,def:s.def,spd:s.spd,crit:s.crit/100,critM:1.6+s.x.critM,tal:h.tal||{},x:s.x,fx:c.fx,dt:heroDt(h),res:s.res,miss:s.miss||0,cd:{},st:{},alive:true,skills:heroSkills(h)}}
function makeEnemy(k,st,uid,suffix,hpMul){const e=ENEMIES[k],hm=1+.22*(st-1)+.08*Math.max(0,st-5),am=1+.14*(st-1)+.04*Math.max(0,st-5),hp=Math.round(e.hp*hm*(hpMul||1)),A=enemyAnim(k,true);
 return {uid,side:'e',key:k,name:e.name+(suffix||''),A,img:A.f0,hp,maxHp:hp,atk:Math.round(e.atk*am),def:Math.round(e.def+st*.5),spd:Math.round((e.spd+rnd(0,1))*10)/10,crit:.05,critM:1.6,tal:{},x:{},sp:e.sp,fx:e.fx||'melee',dt:e.dt||FX2DT[e.fx]||'ciete',res:e.res||{},nb:e.nb,boss:e.boss,obj:e.obj,g:e.g,fly:e.fly,eth:e.eth,claw:BEASTS.includes(k),cd:{},st:{},alive:true}}
function genEnemies(st){const bio=biomeOf(st),loc=(st-1)%5+1,pool=bio.pool.filter(p=>loc>=p[0]).map(p=>p[1]);const list=[];
 if(st%5===0){list.push(bio.boss);for(let i=0;i<Math.min(3,Math.floor(st/5));i++)list.push(pick(pool))}else{const n=Math.min(5,2+Math.floor(st/3));for(let i=0;i<n;i++)list.push(pick(pool))}
 const cnt={};return list.map((k,i)=>{cnt[k]=(cnt[k]||0)+1;const dup=list.filter(x=>x===k).length>1;return makeEnemy(k,st,'e'+i,dup?' '+'ABCD'[cnt[k]-1]:'')})}
const alive=side=>B.units.filter(u=>u.side===side&&u.alive);
const uel=u=>document.getElementById('u-'+u.uid);
const eAtk=u=>u.atk*(u.st.rally>0?1+(u.st.rallyV||.3):1)*(u.st.weak>0?.75:1)*(u.st.bear>0?1.3:1)*(RK(u,'woj_szal')&&u.hp<u.maxHp*.5?1.3:1)*(RK(u,'luc_pierwszy')&&B&&B.round===1?1.6:1)*(u.side==='e'&&!u.obj&&B&&B.eAtkP?1+B.eAtkP:1);
const eDef=t=>t.def*((t.st.shield>0||t.st.bear>0)?1.6:1)*(t.st.sunder>0?.5:1)*(t.row==='f'?1.15:1);
const spdOf=u=>u.spd+(u.st.haste>0?(u.st.hasteV||2):0);
function resOf(t,dt){const b=(t.res&&t.res[dt])||0;if(b>=100)return b;return Math.min(RES_CAP,b+(t.resAll||0))}
function log(t,c){B.log.push({t,c});if(B.log.length>60)B.log.shift();const el=document.getElementById('log');if(el){const d=document.createElement('div');if(c)d.className=c;d.textContent=t;el.appendChild(d);el.scrollTop=el.scrollHeight}}
function center(u,dy){const sc=document.getElementById('scene'),el=uel(u);if(!sc||!el)return {x:0,y:0};const a=sc.getBoundingClientRect(),r=el.querySelector('.mv').getBoundingClientRect();return {x:(r.left-a.left+r.width/2)/UIZ,y:(r.top-a.top+r.height*(dy==null?.5:dy))/UIZ}}
function addFx(cls,p,html){const sc=document.getElementById('scene');if(!sc)return null;const d=document.createElement('div');d.className=cls;d.style.left=p.x+'px';d.style.top=p.y+'px';if(html)d.innerHTML=html;sc.appendChild(d);return d}
const T=ms=>ms/SET.speed;
/* --- klatki animacji --- */
function setF(u,f,ms){const el=uel(u);if(!el)return;const s=el.querySelector('.spr');if(!s)return;const tok=u._ft=(u._ft||0)+1;
 if(f==null)delete s.dataset.f;else s.dataset.f=FRAME[f];
 if(ms)setTimeout(()=>{if(u._ft!==tok)return;if(u.alive)delete s.dataset.f;else s.dataset.f=6},T(ms))}
function moveMv(u,dx,dy,ms,back){const el=uel(u);if(!el)return Promise.resolve();const mv=el.querySelector('.mv');
 const a=mv.animate([{transform:'translate(0,0)'},{transform:`translate(${dx}px,${dy}px)`}],{duration:T(ms),easing:'cubic-bezier(.5,0,.8,.6)',fill:'forwards'});
 return a.finished.then(()=>{if(back!==false){const b=mv.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],{duration:T(back||260),easing:'ease-out',fill:'forwards'});b.finished.then(()=>{try{b.cancel();a.cancel()}catch(e){}})}}).catch(()=>{})}
function shake(big){if(RM)return;const sc=document.getElementById('scene');if(!sc)return;sc.classList.remove('shake');void sc.offsetWidth;sc.classList.add('shake');if(big)navigator.vibrate&&navigator.vibrate(30)}
/* --- efekty --- */
function vfx(k,p,sc,o){o=o||{};const F=fxStrip(k);const s=sc||2,w=F.fw*s;const d=addFx('vfx',p);if(!d)return;
 d.style.cssText+=`;width:${w}px;height:${w}px;background-image:url(${F.url});background-size:${w*F.n}px ${w}px;transform:translate(-50%,-50%) rotate(${o.rot||0}deg) scaleX(${o.flip?-1:1})`;
 const a=d.animate([{backgroundPosition:'0 0'},{backgroundPosition:`${-w*F.n}px 0`}],{duration:T(o.dur||320),easing:`steps(${F.n})`,fill:'forwards'});a.finished.then(()=>d.remove()).catch(()=>d.remove())}
function particles(p,n,cols,o){o=o||{};if(RM)n=Math.ceil(n/2);for(let i=0;i<n;i++){const d=addFx('pt',p);if(!d)return;const a=o.ang!=null?o.ang+rnd(-o.cone||-.5,o.cone||.5):rnd(0,6.283),r=rnd(o.r0||10,o.r1||34);
 d.style.setProperty('--dx',(Math.cos(a)*r+(o.vx||0)).toFixed(1)+'px');d.style.setProperty('--dy',(Math.sin(a)*r+(o.up?-rnd(10,o.up):0)).toFixed(1)+'px');d.style.setProperty('--d',(o.d||.6)*rnd(.7,1.3)+'s');
 d.style.background=pick(cols);if(o.s){d.style.width=d.style.height=o.s+'px'}if(o.glow)d.style.boxShadow=`0 0 4px ${cols[0]}`;d.style.animationDelay=T(rnd(0,o.delay||0))+'ms';setTimeout(()=>d.remove(),T(1400))}}
function glow(p,col,sz){const d=addFx('glow',p);if(!d)return;d.style.cssText+=`;width:${sz||70}px;height:${sz||70}px;background:radial-gradient(${col},transparent 65%)`;setTimeout(()=>d.remove(),T(800))}
function pillar(u,col){const p=center(u,0);const el=uel(u);const h=el?el.querySelector('.mv').offsetHeight:80;const d=addFx('pillar',{x:p.x,y:p.y-20});if(!d)return;d.style.height=(h+28)+'px';d.style.background=`linear-gradient(90deg,transparent,${col}aa 40%,#fff8 50%,${col}aa 60%,transparent)`;setTimeout(()=>d.remove(),T(850))}
function ring(u,col){const d=addFx('ring',center(u,.98));if(d){d.style.borderColor=col||'#7fc8ff';setTimeout(()=>d.remove(),T(820))}}
function aura(u,col){ring(u,col);glow(center(u,.5),(col||'#7fc8ff')+'88',90)}
function sparkle(u,col){const sk=col==='#9cff9c'||!col?'sparkG':'spark';for(let i=0;i<4;i++)setTimeout(()=>{const p=center(u,rnd(.15,.85));p.x+=rnd(-18,18);vfx(sk,p,2,{dur:380})},T(i*90));particles(center(u,.6),8,[col||'#9cff9c','#ffffff'],{up:46,r0:2,r1:14,d:.9,s:3,glow:1})}
const FXC={fire:['#ffd24a','#ff7a1a','#fff4b0','#c0301a'],ice:['#bff4ff','#ffffff','#5ab8e8'],magic:['#c58aff','#f4e0ff','#7a3ad0'],dark:['#b46cff','#2a1040','#f4e0ff'],holy:['#fff2a0','#ffd24a','#ffffff'],poison:['#a8f05a','#4cb02a','#f0ffd0'],arrow:['#ffffff','#e8e0d0'],web:['#ffffff','#d8d8e0']};
function impact(t,fx,crit,u){if(!t)return;const p=center(t,.45);
 if(fx==='melee'){const k=crit?'slashG':u&&u.claw?'claw':'slash';vfx(k,p,2.2,{rot:u&&u.side==='e'?0:0,flip:u&&u.side==='e'});if(u&&u.cls==='lotr')setTimeout(()=>vfx('slash',{x:p.x+6,y:p.y+6},1.8,{flip:true}),T(90));particles(p,6,['#ffffff','#ffe9a0'],{r0:6,r1:22,d:.35,s:3})}
 else if(fx==='poison'){vfx('slashP',p,2.2);vfx('poison',p,1.6);particles(p,8,FXC.poison,{up:30,d:.8})}
 else if(fx==='arrow'){vfx('hitS',p,1.6,{dur:260})}
 else if(fx==='fire'){vfx('fire',p,2.2,{dur:420});particles(p,12,FXC.fire,{r0:8,r1:40,up:18,d:.7,glow:1});if(crit)shake()}
 else if(fx==='ice'){vfx('ice',p,2,{dur:380});particles(p,8,FXC.ice,{r0:6,r1:28,d:.6})}
 else if(fx==='magic'||fx==='dark'){vfx('dark',p,2,{dur:380});particles(p,8,FXC.dark,{r0:6,r1:30,d:.6,glow:1})}
 else if(fx==='holy'){vfx('holy',p,2,{dur:380});particles(p,8,FXC.holy,{r0:6,r1:30,d:.6,glow:1})}
 else if(fx==='web'){vfx('smoke',p,2,{dur:400})}}
function projectile(u,t,fx){return new Promise(res=>{const a=center(u,.4),b=center(t,.45);if(u.side==='e'&&u.key==='smok'){a.x-=20;a.y-=14}
 const html=fx==='arrow'?sprImg(sprite('strzala'),'p-arrow'):'';const d=addFx('proj p-'+fx,a,html);if(!d)return res();
 const dur=T(fx==='arrow'?300:fx==='ice'?320:380),t0=performance.now(),arc=fx==='arrow'?-26:fx==='magic'||fx==='dark'?-12:-6,col=FXC[fx]||FXC.arrow;let last=0,lx=a.x,ly=a.y;
 const step=now=>{let k=Math.min(1,(now-t0)/dur);const x=a.x+(b.x-a.x)*k,y=a.y+(b.y-a.y)*k+arc*Math.sin(Math.PI*k);const ang=Math.atan2(y-ly,x-lx)*180/Math.PI;
  d.style.left=x+'px';d.style.top=y+'px';d.style.transform=`translate(-50%,-50%) rotate(${ang}deg)`;lx=x;ly=y;
  if(now-last>28&&!RM){last=now;const tr=addFx('trail',{x,y});if(tr){tr.style.background=pick(col);tr.style.transform='translate(-50%,-50%)';if(fx!=='arrow')tr.style.boxShadow=`0 0 4px ${col[0]}`;setTimeout(()=>tr.remove(),T(400))}}
  if(k<1)requestAnimationFrame(step);else{d.remove();res()}};requestAnimationFrame(step)})}
function breath(u,ts){/* smoczy oddech: stożek cząsteczek */const a=center(u,.25);a.x-=26;return new Promise(res=>{let n=0;const iv=setInterval(()=>{ts.forEach(t=>{const b=center(t,.45);const ang=Math.atan2(b.y-a.y,b.x-a.x),dist=Math.hypot(b.x-a.x,b.y-a.y);particles(a,3,FXC.fire,{ang,cone:.18,r0:dist*.6,r1:dist*1.05,d:.45,s:5,glow:1})});if(++n>=8){clearInterval(iv);setTimeout(res,T(220))}},T(45))})}
async function anim(u,ts,fx){const el=uel(u);if(!el)return;ts=ts.filter(Boolean);const t0=ts[0];
 if(fx==='melee'||fx==='poison'){setF(u,'wind');await sleep(170);setF(u,'strike',420);
  if(t0&&ts.length===1){const a=center(u),b=center(t0);const dx=(b.x-a.x)*.62,dy=(b.y-a.y)*.5;await moveMv(u,dx,dy,150,280)}else{await moveMv(u,u.side==='h'?24:-24,0,150,260)}
  return}
 if(fx==='arrow'){setF(u,'wind');await sleep(240);setF(u,'strike',360);await Promise.all(ts.map((t,i)=>sleep(i*70).then(()=>projectile(u,t,fx))));return}
 if(fx==='heal'||fx==='buff'){setF(u,'cast',560);glow(center(u,.3),fx==='heal'?'#9cff9c':'#ffe36a',60);await sleep(300);return}
 if(fx==='fire'&&u.key==='smok'){setF(u,'wind');await sleep(260);setF(u,'cast',900);await breath(u,ts);return}
 setF(u,'cast',620);const p=center(u,.2);glow(p,(FXC[fx]||FXC.magic)[0],56);particles(p,6,FXC[fx]||FXC.magic,{r0:14,r1:4,d:.4,s:3,glow:1});await sleep(260);
 await Promise.all(ts.map((t,i)=>sleep(i*80).then(()=>projectile(u,t,fx))))}
function flt(u,text,cls,sub){const el=uel(u);if(!el)return;const big=/dmg|crit|heal/.test(cls);const p=center(u,big?.05:.34);const k=u._fn=(u._fn||0)+1;setTimeout(()=>{u._fn=Math.max(0,(u._fn||1)-1)},T(650));
 if(big){const n=document.querySelectorAll('.float').length;p.x+=(n%3-1)*14;p.y-= (k-1)*16}else p.y+=(k-1)*15;p.y=Math.max(p.y,26);const d=addFx('float '+cls,p);if(!d)return;d.textContent=text;if(sub){const s=document.createElement('small');s.textContent=sub;d.appendChild(s)}setTimeout(()=>d.remove(),T(big?1050:900));
 if(cls==='dmg'||cls==='crit'){const f=el.querySelector('.fxw');f.classList.remove('hit');void f.offsetWidth;f.classList.add('hit');if(u.alive){setF(u,'hit',300);moveMv(u,u.side==='h'?-7:7,0,70,180)}}updUnit(u)}
function hit(u,t,mult,fx){if(!t||!t.alive)return 0;if(u.side==='h'&&u.row==='b'&&B&&B.curReach==='r')mult*=1.1;const dt=(fx&&FX2DT[fx])||B.curDt||u.dt||'ciete',rv=resOf(t,dt),cur=curOf(u);
 if(t.st.evade>0){flt(t,'Unik!','miss');log(`${t.name} unika ataku (${u.name}).`);return 0}
 if(t.eth&&Math.random()<.25){flt(t,'Przenika!','miss');log(`${u.name} przenika przez ${t.name}!`);return 0}
 if(u.miss&&Math.random()<u.miss){flt(t,'Pudło!','miss');log(`${u.name} pudłuje – utrata oka daje się we znaki.`);return 0}
 if(t.x&&t.x.dodge&&Math.random()<t.x.dodge){flt(t,'Unik!','miss');log(`${t.name} zwinnie unika (${u.name}).`);return 0}
 if(rv>=100){impact(t,fx||B.curFx||u.fx,false,u);flt(t,'Niewrażliwy','miss res');log(`${t.name} jest ${gf(t,'niewrażliwy','niewrażliwa')} na: ${DT[dt].n}.`);return 0}
 if(cur)mult*=cur.p;if(u.side==='h'&&t.side==='e'&&tl('gildia')>=3&&bestKnown(t.key))mult*=1.1;let d=Math.max(1,eAtk(u)*mult*rnd(.9,1.1)-eDef(t)*.5);const crit=Math.random()<u.crit+(cur&&cur.cb||0);if(crit)d*=u.critM;
 d*=1+((u.x&&u.x.dtP&&u.x.dtP[dt])||0);if(B.round>25)d*=1+(B.round-25)*.1;if(t.st.curse>0)d*=1+(t.st.curseV||.25);if(t.side==='e')d*=bossTaken(u,t);d=Math.max(1,Math.round(d*(1-rv/100)));
 impact(t,fx||B.curFx||u.fx,crit,u);if(crit)shake(true);const tag=rv<0?'Słabość!':rv>0?'Odporny':'';
 log(`${u.name} ➜ ${t.name}: ${d} ${DT[dt].n.toLowerCase()}${crit?' (KRYTYK!)':''}${tag?' – '+tag:''}`,u.side==='h'?'':'r');dmg(t,d,(crit?'crit':'dmg')+(rv<0?' weak':rv>0?' res':''),u.name,u,tag);if(t.side==='h'){if(crit)t._crit=1;if(t.alive&&t.hp<t.maxHp*.25)t._low=1}
 if(u.x&&u.x.ls&&u.alive)healQ(u,Math.round(d*u.x.ls));
 if(t.x&&t.x.thorns&&t.alive&&u.alive&&u!==t){const r=Math.max(1,Math.round(d*t.x.thorns));log(`↩ ${t.name} odbija ${r} obrażeń.`,'');dmg(u,r,'dmg',t.name+' (odwet)',t)}
 return d}
function cheatDeath(t){
 /* strzyga powstaje, jeśli nie dobito jej ogniem lub świętością */
 if(t.side==='e'&&t.key==='strzyga'&&!t.rose){const dt=(B.curFx&&FX2DT[B.curFx])||B.curDt||'';if(dt!=='ogien'&&dt!=='swiete'&&!burning(t)){t.rose=1;t.hp=Math.round(t.maxHp*.4);log(`🧛 ${t.name} powstaje z martwych! (dobij ogniem lub świętością)`,'r');setTimeout(()=>{if(B&&t.alive){flt(t,'Powstaje!','info');ring(t,'#b46cff')}},T(300));return true}}
 if(t.side!=='h')return false;
 if(!t.cheat&&RK(t,'woj_nieugiety')){t.cheat=1;t.hp=1;t.st.shield=2;flt(t,'Nieugięty!','info');log(`🛡 ${t.name} nie daje się powalić!`,'g');return true}
 if(!t.cheat&&RK(t,'cz_nies')){t.cheat=1;t.hp=Math.round(t.maxHp*.3);flt(t,'Nieśmiertelny!','info');log(`🩸 ${t.name} wraca z progu śmierci!`,'g');return true}
 if(!B.aniol){const a=B.units.find(x=>x.side==='h'&&x.alive&&x!==t&&RK(x,'kap_aniol'));if(a){B.aniol=1;t.hp=Math.round(t.maxHp*.25);pillar(t,'#fff2a0');flt(t,'Anioł stróż!','info');log(`🕊️ Anioł stróż (${a.name}) ratuje: ${t.name}!`,'g');return true}}
 return false}
function dmg(t,d,cls,by,src,sub){t.hp=Math.max(0,t.hp-d);if(t.chg&&t.hp>0)bossDmg(t,d);if(t.hp<=0&&t.alive&&cheatDeath(t)){flt(t,'-'+d,cls,sub);updUnit(t);return}flt(t,'-'+d,cls,sub);
 if(t.hp<=0&&t.alive&&t.side==='h'){downUnit(t,by);return}
 if(t.hp<=0&&t.alive){t.alive=false;t.killedBy=by;log(`💀 ${t.name} ${t.side==='h'?gf(t,'poległ!','poległa!'):'ginie.'}`,t.side==='h'?'r':'g');if(src&&src.hero&&!t.obj)src.hero.kills++;spreadOnDeath(t);die(t);if(t.obj||t.boss)bossDown(t)}
 else if(t.alive&&t.side==='h'&&!t.mecz&&RK(t,'pal_meczen')&&t.hp<t.maxHp*.3){t.mecz=1;log(`🙏 ${t.name}: ostatnia modlitwa!`,'g');setTimeout(()=>{if(B&&!B.over)alive('h').forEach(a=>heal(a,Math.round(a.maxHp*.25)))},T(200))}}
function spreadOnDeath(t){if(t.side!=='e')return;const o=alive('e').filter(e=>e!==t);if(!o.length)return;const b=t.st.bleed;
 if(b&&b.ic==='🧪'&&b.src&&RK(b.src,'lot_zaraza')){const n=pick(o);n.st.bleed=Object.assign({},b,{t:3});flt(n,'Zaraza','info');log(`🧪 Trucizna przechodzi na: ${n.name}!`,'g');updUnit(n)}
 if(t.st.curse>0&&t.st.curseSrc&&RK(t.st.curseSrc,'cz_zaglada')){const n=o.find(e=>!(e.st.curse>0))||pick(o);n.st.curse=3;n.st.curseV=t.st.curseV;n.st.weak=Math.max(n.st.weak||0,3);n.st.curseSrc=t.st.curseSrc;flt(n,'Przeklęty','info');log(`🕯️ Klątwa przechodzi na: ${n.name}!`,'g');updUnit(n)}}
function die(t){setF(t,'die');updUnit(t);const p=center(t,.75);setTimeout(()=>{if(t.side==='e'){vfx(t.key==='upior'||t.key==='nekromanta'?'smokeD':'smoke',p,2.4,{dur:520});particles(p,8,['#d8d0c8','#9a9088'],{up:20,d:.7})}
 if(t.stolen>0){S.gold+=t.stolen;flt(t,'+'+t.stolen+' zł','gold');log(`💰 Odzyskano ${t.stolen} złota!`,'g');t.stolen=0}},T(350))}
function healBy(u,t,a){const c=curOf(u);heal(t,Math.round(a*(1+((u.x&&u.x.healP)||0))*(c?c.p:1)))}
function healQ(t,a){if(!t.alive||a<1)return;const v=Math.min(a,t.maxHp-t.hp);if(v<=0)return;t.hp+=v;flt(t,'+'+v,'heal')}
function regen(u,t,n,v){if(!t||!t.alive)return;const c=curOf(u);t.st.regen={t:n,v:Math.max(1,Math.round(v*(1+((u.x&&u.x.healP)||0))*(c?c.p:1)))};sparkle(t,'#9cff9c');flt(t,'Regeneracja','info');updUnit(t)}
function revive(u,t,f){if(!t||t.alive||t.dead)return;t.alive=true;t.down=0;t.revived=1;t.st={};t.hp=Math.max(1,Math.round(t.maxHp*f));const el=uel(t);if(el){const s=el.querySelector('.spr');if(s)delete s.dataset.f}pillar(t,'#fff2a0');sparkle(t,'#fff2a0');flt(t,'Powstaje!','heal');log(`🕊️ ${t.name} powraca do walki!`,'g');updUnit(t)}
function heal(t,a){if(!t.alive)return;a=Math.round(a);const v=Math.min(a,t.maxHp-t.hp);if(v<=0)return;t.hp+=v;flt(t,'+'+v,'heal');pillar(t,'#7dff8a');sparkle(t);log(`💚 ${t.name} odzyskuje ${v} PŻ.`,'g')}
function bleed(u,t,turns,amt,ic0){if(!t.alive)return;ic0=ic0||'🩸';if(ic0==='🩸'&&t.nb){flt(t,'Nie krwawi','miss');return}const bdt=ic0==='🔥'?'ogien':ic0==='🧪'?'trucizna':ic0==='🌑'?'mrok':'ciete',rv=ic0==='🩸'?0:resOf(t,bdt);if(rv>=100){flt(t,'Niewrażliwy','miss');return}
 const c=curOf(u);amt=amt*(1-rv/100)*(c?c.p:1)*(1+((u.x&&u.x.dtP&&u.x.dtP[bdt])||0))*(ic0==='🔥'&&RK(u,'mag_feniks')?2:1);t.st.bleed={t:turns,dmg:Math.max(2,Math.round(amt)),by:u.name,ic:ic0,src:u};updUnit(t)}
function stun(t){if(!t.alive)return;if(t.boss&&t.chg){bossInterrupt(t,'stun');return}if(t.boss||t.obj){flt(t,'Odporny','miss');return}t.st.stun=1;flt(t,'Ogłuszony','info');vfx('spark',center(t,.1),2);log(`💫 ${t.name} jest ${gf(t,'ogłuszony','ogłuszona')}!`,'y')}
const BLD={'🩸':'st_bleed','🔥':'st_burn','🧪':'st_poison','🌑':'st_dark'};
function stsHtml(u){const s=u.st,o=[],q=(k,n)=>o.push(`<span>${ic(k,12)}${n||''}</span>`);if(s.taunt>0)q('st_taunt',s.taunt);if(s.shield>0)q('st_shield',s.shield);if(s.evade>0)q('st_evade');if(s.stun>0)q('st_stun');if(s.sunder>0)q('st_sunder',s.sunder);if(s.rally>0)q('st_rally',s.rally);if(s.bear>0)q('st_bear',s.bear);if(s.weak>0)q('st_weak',s.weak);if(s.curse>0)q('st_curse',s.curse);if(s.haste>0)q('st_haste',s.haste);if(s.expose>0)q('crit',s.expose);if(s.regen)q('st_regen',s.regen.t);if(s.bleed)q(BLD[s.bleed.ic]||'st_bleed',s.bleed.t);return o.join('')}
function unitHtml(u,style,sc,extra){const A=u.A;return `<div class="unit ${u.side}${u.boss?' boss':''}${u.obj?' obj':''}${u.fly?' fly':''}${extra||''}" id="u-${u.uid}" data-act="unit" data-uid="${u.uid}" style="${style}"><div class="sts"></div><div class="mv" style="width:${A.cw*sc}px;height:${A.ch*sc}px;--dy:${Math.round(((A.ch-A.cw)/2+A.cw*.28)*sc)}px"><div class="shadow"></div><div class="fxw">${sprDiv(A,sc)}</div></div><div class="ddm">${ic('skull',14)}</div><div class="un">${u.hero&&u.hero.main?crown(1):''}${esc(u.name)}</div><div class="bar"><i class="lag"></i><i class="hpf"></i></div><div class="hpt"></div><div class="blk">${ic('lock',12)}<span>1. rząd!</span></div></div>`}
/* forma niedźwiedzia: druid na czas stanu „bear” dostaje sprite niedźwiedzia (CSPR.niedzwiedz, klatka 112 px) */
let _bearA=null;
function bearA(){if(_bearA)return _bearA;const o=typeof CSPR!=='undefined'&&CSPR.niedzwiedz;if(!o||!o._d)return null;
 const fw=o.fw||112,id=composeData([[o,null]],o.w,o.h,0),pl=Math.round(fw/2-HM.cw/2)-12;/* niedźwiedź wysunięty do przodu, by nie zasłaniał drugiego rzędu */
 return _bearA={url:dataURL(id,0,0,o.w,o.h),f0:dataURL(id,pl,0,HM.cw,HM.ch+HM.pt),fw,fh:o.h,n:7,pl,pt:HM.pt,cw:HM.cw,ch:HM.ch}}
function unitLook(u,el){const want=u.side==='h'&&u.alive&&u.st.bear>0&&bearA()?'bear':'';if((el.dataset.look||'')===want)return;el.dataset.look=want;
 const w=el.querySelector('.fxw');if(w)w.innerHTML=sprDiv(want?bearA():u.A,u._s||B.lay.sc)}
function updUnit(u){const el=uel(u);if(!el)return;const r=u.hp/u.maxHp;const b=el.querySelector('.bar');b.className='bar '+(r<.35?'low':'');b.querySelector('.hpf').style.width=r*100+'%';b.querySelector('.lag').style.width=r*100+'%';const dn=!u.alive&&u.down&&!u.dead;el.querySelector('.hpt').textContent=dn?(u.hero.main?'Pokonany':'Na skraju śmierci'):u.dead&&u.side==='h'?'Nie żyje':u.hp+'/'+u.maxHp;el.classList.toggle('down',!!dn);el.querySelector('.sts').innerHTML=stsHtml(u);el.classList.toggle('dead',!u.alive);el.classList.toggle('bear',u.st.bear>0);el.classList.toggle('chg',!!(u.chg&&u.alive));el.classList.toggle('marked',!!(B&&B.mk===u&&u.alive));unitLook(u,el);if(u.boss)bossBar()}
function isTarget(u){if(!B.awaiting||!B.active)return false;const t=tOf(B.active,B.sel);if(t==='deadAlly')return u.side==='h'&&!u.alive&&!u.revived&&!u.dead;if(!u.alive)return false;if(B.sel==='zamiana')return u.side==='h'&&u!==B.active;return (t==='enemy'&&u.side==='e'&&canReach(B.active,u,B.sel))||(t==='ally'&&u.side==='h')}
const noReach=u=>B&&B.awaiting&&B.active&&u.side==='e'&&u.alive&&isOff(B.active,B.sel)&&!canReach(B.active,u,B.sel);
const deadAllies=()=>B.units.filter(u=>u.side==='h'&&!u.alive&&!u.revived&&!u.dead);
