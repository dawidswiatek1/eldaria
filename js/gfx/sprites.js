const RCOL=['#c9c9c9','#4a9dff','#b45cff','#ff9a2a'];
const hexI=c=>parseInt(c.slice(1),16);
let GFX_READY=false;
function loadImg(o){return new Promise(res=>{const im=new Image();const done=()=>{try{const c=document.createElement('canvas');c.width=o.w;c.height=o.h;const x=c.getContext('2d');x.drawImage(im,0,0);o._d=x.getImageData(0,0,o.w,o.h).data}catch(e){o._d=new Uint8ClampedArray(o.w*o.h*4)}o._t=new Set((o.t||[]).map(hexI));res()};im.onload=done;im.onerror=()=>{o._d=new Uint8ClampedArray(o.w*o.h*4);o._t=new Set();res()};im.src=o.u})}
async function loadGfx(){const all=[...Object.values(GFX.L),...Object.values(GFX.S),...(typeof HSPR!=='undefined'?Object.values(HSPR):[]),...Object.values(GFX.F),GFX.I,GFX.town];await Promise.all(all.map(loadImg));GFX_READY=true}
function tintFn(tint){const t=[1,3,5].map(i=>parseInt(tint.slice(i,i+2),16));return (r,g,b)=>{const L=(r*.299+g*.587+b*.114)/255,k=.2+1.15*L;return t.map(v=>Math.max(0,Math.min(255,Math.round(v*k))))}}
/* składanie warstw; fw>0 => odbicie każdej klatki osobno */
function composeData(list,w,h,fw){const out=new ImageData(w,h),D=out.data;
 for(const [o,tint,glow] of list){if(!o||!o._d)continue;const s=o._d,tf=tint?tintFn(tint):null,ow=o.w;
  if(glow&&!fw){const g=[1,3,5].map(i=>parseInt(glow.slice(i,i+2),16));for(let y=0;y<h&&y<o.h;y++)for(let x=0;x<w&&x<ow;x++){if(s[(y*ow+x)*4+3]<128)continue;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X<0||Y<0||X>=w||Y>=h)continue;const p=(Y*w+X)*4;if(D[p+3])continue;if(X<ow&&Y<o.h&&s[(Y*ow+X)*4+3]>=128)continue;D[p]=g[0];D[p+1]=g[1];D[p+2]=g[2];D[p+3]=255}}}
  for(let y=0;y<h&&y<o.h;y++)for(let x=0;x<w&&x<ow;x++){const q=(y*ow+x)*4;if(s[q+3]<128)continue;let r=s[q],g=s[q+1],b=s[q+2];
   if(tf&&o._t.has(r<<16|g<<8|b))[r,g,b]=tf(r,g,b);
   const X=fw?Math.floor(x/fw)*fw+(fw-1-x%fw):x,p=(y*w+X)*4;D[p]=r;D[p+1]=g;D[p+2]=b;D[p+3]=255}}
 return out}
function shadeData(D,w,h){const A=(x,y)=>x<0||y<0||x>=w||y>=h?0:D[(y*w+x)*4+3],L=p=>D[p]*.3+D[p+1]*.59+D[p+2]*.11,M=new Uint8Array(w*h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=(y*w+x)*4;if(!D[p+3])continue;const l=L(p);if(l<48)continue;
  if((A(x,y-1)&&!A(x,y-2))||(A(x-1,y)&&!A(x-2,y))||(!A(x,y-1)&&l>110))M[y*w+x]=1;else if((A(x,y+1)&&!A(x,y+2))||(A(x+1,y)&&!A(x+2,y)))M[y*w+x]=2}
 for(let i=0;i<w*h;i++){const p=i*4;if(!D[p+3])continue;let r=D[p],g=D[p+1],b=D[p+2];
  if(M[i]===1){r+=(255-r)*.24;g+=(240-g)*.2;b+=(205-b)*.14}else if(M[i]===2){r=r*.84+6;g=g*.84+4;b=b*.86+10}
  D[p]=Math.min(255,r*1.03);D[p+1]=g;D[p+2]=b*.97}
 return D}
function dataURL(id,sx,sy,w,h){const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').putImageData(id,-sx,-sy);return c.toDataURL()}
const _sprCache={};
const HERO_CLS=['wojownik','lucznik','mag','kaplan','lotr','paladyn','druid','czarnoksieznik','bard'];
const HM=GFX.HM;
const sprSize=k=>HERO_CLS.includes(k)?{w:HM.cw,h:HM.ch+HM.pt}:{w:GFX.S[k].cw||GFX.S[k].w,h:GFX.S[k].ch||GFX.S[k].h};
const DEF_W={wojownik:'miecz',lucznik:'luk',mag:'kostur',kaplan:'bulawa',lotr:'sztylety',paladyn:'mlot',druid:'galaz',czarnoksieznik:'czaszka',bard:'lutnia'};
const FRAME={i0:0,i1:1,wind:2,strike:3,cast:4,hit:5,die:6};
function helmLayer(k,r){if(k==='helm')return r>=3?'helm_helm3':r>=2?'helm_helm2':'helm_helm0';if(k==='diadem')return r>=2?'helm_diadem2':'helm_diadem0';return r>=3?'helm_kaptur3':'helm_kaptur0'}
/* animacja bohatera: pasek 7 klatek + klatka 0 przycięta do rdzenia */
function heroAnim(cls,eq,skin,g){eq=eq||{};const sk=skin&&typeof SKIN!=='undefined'?SKIN[skin]:null;if(!sk)skin='';g=g==='k'?'k':'m';const ck='H|'+cls+'|'+g+'|'+(skin||'')+'|'+['bron','zbroja','helm','amulet'].map(s=>eq[s]?eq[s].b+eq[s].r:'-').join('|');if(_sprCache[ck])return _sprCache[ck];
 if(sk&&sk.spr&&typeof HSPR!=='undefined'&&HSPR[sk.spr]&&HSPR[sk.spr]._d){const o=HSPR[sk.spr],id=composeData([[o,null]],o.w,o.h,faceOf('H_'+sk.spr)==='L'?HM.fw:0);shadeData(id.data,o.w,o.h);return _sprCache[ck]={url:dataURL(id,0,0,o.w,o.h),f0:dataURL(id,HM.pl,0,HM.cw,HM.ch+HM.pt),fw:HM.fw,fh:HM.fh,n:7,pl:HM.pl,pt:HM.pt,cw:HM.cw,ch:HM.ch}}
 const L=GFX.L,st0=GFX.STYLE[cls],st=g==='k'&&L['body_'+cls+'|'+st0+'_k']?st0+'_k':st0,list=[],add=(n,t)=>{const o=L[n+'|'+st];if(o)list.push([o,t||null])},tf=(it,al)=>it&&(al||it.r>0)?RCOL[it.r]:null;
 const gl=it=>it&&it.r>0?RCOL[it.r]:null,addG=(n,it)=>{const o=L[n+'|'+st];if(o)list.push([o,null,gl(it)])};
 add('back_'+cls);if(sk&&sk.back){const bl=skinLayer(sk.back,cls);if(bl)list.push([bl,null])}const n0=list.length;add('body_'+cls);const a=eq.zbroja;add(a?'arm_'+a.b:(sk&&sk.arm?'arm_'+sk.arm:'defarm_'+cls),tf(a));if(sk&&sk.rc)for(let i=n0;i<list.length;i++)list[i][0]=skinRC(list[i][0],skin);if(!(sk&&sk.noBeard))add('beard_'+cls);
 const m=eq.amulet;if(m)addG('am_'+m.b,m);const h=eq.helm;if(h)addG(helmLayer(h.b,h.r),h);else if(sk&&sk.helm){const n1=list.length;add('helm_'+sk.helm,sk.helmT);if(sk.rcH&&list[n1])list[n1][0]=skinRC(list[n1][0],skin,'rcH')}else add('defhelm_'+cls);
 add('pre_'+cls);const w=eq.bron;addG('w_'+(w?w.b:DEF_W[cls]),w);add('hands');add('post_'+cls);
 const fw=HM.fw,fh=HM.fh,n=7,id=composeData(list,fw*n,fh,0);shadeData(id.data,fw*n,fh);
 return _sprCache[ck]={url:dataURL(id,0,0,fw*n,fh),f0:dataURL(id,HM.pl,0,HM.cw,HM.ch+HM.pt),fw,fh,n,pl:HM.pl,pt:HM.pt,cw:HM.cw,ch:HM.ch}}
function heroLook(cls,eq,skin,g){return heroAnim(cls,eq,skin,g).f0}
/* v20: kierunek – FACE[k] mówi, gdzie patrzy sprite natywnie; faceL=true -> wróg ma patrzeć w LEWO (na drużynę) */
function faceOf(k){return (typeof FACE!=='undefined'&&FACE[k])||'R'}
function enemyAnim(k,faceL){const flip=faceL?faceOf(k)==='R':faceOf(k)==='L';const ck='E|'+k+'|'+(flip?1:0);if(_sprCache[ck])return _sprCache[ck];const o=GFX.S[k];
 if(o.n<2){const id=composeData([[o,null]],o.w,o.h,flip?o.w:0);shadeData(id.data,o.w,o.h);const u=dataURL(id,0,0,o.w,o.h);return _sprCache[ck]={url:u,f0:u,fw:o.w,fh:o.h,n:1,pl:0,pt:0,cw:o.w,ch:o.h}}
 const id=composeData([[o,null]],o.w,o.h,flip?o.fw:0),pl=flip?o.pr:o.pl;shadeData(id.data,o.w,o.h);
 return _sprCache[ck]={url:dataURL(id,0,0,o.w,o.h),f0:dataURL(id,pl,o.pt,o.cw,o.ch),fw:o.fw,fh:o.h,n:o.n,pl,pt:o.pt,cw:o.cw,ch:o.ch}}
function sprite(key,tint,flip){if(HERO_CLS.includes(key))return heroLook(key,{});return enemyAnim(key,flip).f0}
function fxStrip(k){const ck='F|'+k;if(_sprCache[ck])return _sprCache[ck];const o=GFX.F[k];const id=composeData([[o,null]],o.w,o.h,0);return _sprCache[ck]={url:dataURL(id,0,0,o.w,o.h),fw:o.fw,n:o.n}}
let _icAt=null;
function icon(n){const ck='I|'+n;if(_sprCache[ck])return _sprCache[ck];const A=GFX.I,i=A.names.indexOf(n);if(i<0)return '';
 if(!_icAt)_icAt=composeData([[A,null]],A.w,A.h,0);return _sprCache[ck]=dataURL(_icAt,i*14,0,14,14)}
const ic=(n,s,cls)=>`<img class="px ic ${cls||''}" src="${icon(n)}" alt="" style="width:${s||18}px;height:${s||18}px">`;
let _townUrl=null;const townImg=()=>_townUrl||(_townUrl=dataURL(composeData([[GFX.town,null]],GFX.town.w,GFX.town.h,0),0,0,GFX.town.w,GFX.town.h));
