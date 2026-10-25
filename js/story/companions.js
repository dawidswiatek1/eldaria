/* ===== WYGLĄD UNIKALNYCH TOWARZYSZY (warstwy na papierowej lalce) ===== */
const cl=v=>Math.max(0,Math.min(255,Math.round(v)));
const SKIN={husarz:{spr:'jaromir',g:'m'},szeptunka:{spr:'szeptunka',g:'k'},luczniczka:{spr:'luczniczka',g:'k'},rycerz:{spr:'rycerz',g:'m'},straznik:{spr:'straznik',g:'m'},
 /* nowi unikalni towarzysze i husarz Jaromir – paski w js/data/sprites-classes.js (CSPR) */
 ignacy:{spr:'ignacy',g:'m'},tymek:{spr:'tymek',g:'m'},nela:{spr:'nela',g:'k'},karolina:{spr:'karolina',g:'k'}};
const _skinRC={};
function skinRC(o,skin,fk){fk=fk||'rc';if(!o||!o._d)return o;const key=skin+fk+'|'+(o.u||o.src||'')+o.w+'x'+o.h+(o._id||(o._id=Math.random().toString(36).slice(2)));if(_skinRC[key])return _skinRC[key];const f=SKIN[skin][fk],D=new Uint8ClampedArray(o._d);
 for(let i=0;i<D.length;i+=4){if(D[i+3]<20)continue;const c=f(D[i],D[i+1],D[i+2]);if(c){D[i]=c[0];D[i+1]=c[1];D[i+2]=c[2]}}
 return _skinRC[key]=Object.assign({},o,{_d:D,_t:new Set()})}
const _skinL={};
function skinLayer(n,cls){const ck=n+'|'+cls;if(_skinL[ck])return _skinL[ck];const body=GFX.L['body_'+cls+'|'+GFX.STYLE[cls]];if(!body||!body._d)return null;
 const W=body.w,H=body.h,fw=HM.fw,D=new Uint8ClampedArray(W*H*4),A=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&body._d[(y*W+x)*4+3]>=128;
 const px=(x,y,c,f)=>{if(x<f*fw||x>=f*fw+fw||y<0||y>=H)return;const p=(y*W+x)*4;D[p]=c[0];D[p+1]=c[1];D[p+2]=c[2];D[p+3]=255};
 const WH=[242,242,246],GR=[176,182,194],DK=[96,100,116],GO=[214,168,64],BR=[110,58,26];
 for(let f=0;f<6;f++){let top=-1,lx=1e9,rx=-1;for(let y=0;y<H&&top<0;y++)for(let x=f*fw;x<f*fw+fw;x++)if(A(x,y)){top=y;break}if(top<0)continue;const sy=top+24;
  for(let x=f*fw;x<f*fw+fw;x++)if(A(x,sy)){lx=Math.min(lx,x);rx=Math.max(rx,x)}if(rx<0)continue;
  const hgt=Math.max(20,sy-1);
  [[5,1,GR,DK],[0,0,WH,GR]].forEach(([ox,oy,c1,c2])=>{const ax=lx+4+ox,ay=sy+oy,N=Math.round(hgt*1.2),X=t=>Math.round(ax-9*t+13*t*t*t),Y=t=>Math.round(ay-hgt*t);
   for(let j=0;j<=N;j++){const t=j/N,x=X(t),y=Y(t),len=3+Math.round(Math.sin(t*Math.PI*.85)*8);
    for(let s=1;s<=len;s++){const fx=Math.round(x-s*.95),fy=Math.round(y+s*.25-s*t*.6);px(fx,fy,s>=len-1?c2:c1,f);px(fx,fy+1,(j%2)?c1:c2,f)}}
   for(let j=0;j<=N;j++){const t=j/N;px(X(t),Y(t),j%4?GO:BR,f);px(X(t)+1,Y(t),BR,f)}})}
 return _skinL[ck]={w:W,h:H,_d:D,_t:new Set()}}
