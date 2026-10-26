/* Eldaria – style: wyniki walki, przejście do walki */
css`
/* --- wyniki walki --- */
.res p{margin:5px 0;animation:resA calc(.4s * var(--sp)) both}
@keyframes resA{from{opacity:0;transform:translateX(-10px)}}
.banner{position:relative;text-align:center;margin:2px 0 8px}
.banner h1{margin:0;font-size:1.8rem;animation:popIn calc(.5s * var(--sp)) cubic-bezier(.2,1.6,.5,1) both}
.banner .rays{position:absolute;left:50%;top:50%;width:220px;height:220px;margin:-110px 0 0 -110px;background:repeating-conic-gradient(#ffd24a33 0 10deg,#0000 10deg 20deg);border-radius:50%;animation:spin 8s linear infinite;z-index:-1;mask:radial-gradient(#000 30%,#0000 70%);-webkit-mask:radial-gradient(#000 30%,#0000 70%)}
@keyframes spin{to{transform:rotate(360deg)}}
.loot{display:flex;gap:8px;align-items:center;padding:4px 6px;margin:6px 0;background:#3a2414;color:var(--ink);box-shadow:0 0 0 2px #140d12,0 0 0 4px var(--rc);animation:flipIn calc(.6s * var(--sp)) cubic-bezier(.2,1.4,.5,1) both;position:relative;overflow:hidden}
.loot .ii{width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,var(--rc) 0,#0000 70%);flex-shrink:0}
.loot .ii .ic{width:28px;height:28px}
.loot.r3::before,.loot.r2::before{content:'';position:absolute;left:8px;top:-20px;width:30px;height:90px;background:linear-gradient(#0000,var(--rc),#0000);opacity:.5;animation:beamA 1.2s ease-in-out infinite alternate}
@keyframes beamA{to{opacity:.15}}
@keyframes flipIn{0%{transform:perspective(400px) rotateY(90deg);opacity:0}100%{transform:none;opacity:1}}
.lvcard{display:flex;gap:8px;align-items:center;padding:4px 8px;margin:6px 0;background:linear-gradient(#ffe9a0,#e8b84a);color:#3a2414;box-shadow:0 0 0 2px #140d12;animation:lvA calc(.6s * var(--sp)) cubic-bezier(.2,1.6,.5,1) both;position:relative;overflow:hidden}
.lvcard::after{content:'';position:absolute;inset:0;background:linear-gradient(110deg,#0000 35%,#ffffff88 50%,#0000 65%) 0 0/300% 100%;animation:shineA 1.6s linear infinite}
.lvcard .bust{background:#0002;box-shadow:0 0 0 2px #140d12}
@keyframes lvA{0%{transform:scale(.3) rotate(-6deg);opacity:0}100%{transform:none;opacity:1}}
/* --- przejście do walki --- */
#wipe{position:fixed;inset:0;z-index:70;pointer-events:none;display:flex;align-items:center;justify-content:center}
#wipe .bars i{position:absolute;left:0;right:0;height:12.5%;background:#140d12;animation:wipeA calc(.9s * var(--sp)) steps(6) forwards}
#wipe .lbl{position:relative;z-index:2;text-align:center;animation:lblA calc(.9s * var(--sp)) forwards}
#wipe .lbl b{display:block;font-size:2rem;color:var(--gold);text-shadow:2px 2px 0 #000}
#wipe .lbl span{color:#fff3d6;text-shadow:1px 1px 0 #000}
@keyframes wipeA{0%{transform:scaleX(0)}30%,70%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes lblA{0%,15%{opacity:0;transform:scale(1.6)}30%,70%{opacity:1;transform:none}100%{opacity:0}}
.shake{animation:shakeA calc(.32s * var(--sp)) steps(6)}
@keyframes shakeA{0%{transform:translate(0,0)}20%{transform:translate(-4px,2px)}40%{transform:translate(4px,-2px)}60%{transform:translate(-3px,-1px)}80%{transform:translate(2px,2px)}100%{transform:none}}
.loading{margin:auto;text-align:center;color:var(--gold);font-size:1.2rem}
@media (max-height:720px){.log{height:44px;font-size:.72rem}.skills button{min-height:42px;font-size:.84rem}.skills button .si{width:22px;height:22px}.hint{min-height:0;font-size:.76rem;margin-top:3px}.panel .who{margin-bottom:3px}.bt{gap:3px}.bt .top{padding:3px 0 0}.bt .btn-small{min-height:36px}.order{min-height:30px}.order img{width:26px;height:26px}.panel .btn-main{min-height:44px;font-size:1rem}}
@media (max-height:600px){.bt{gap:2px}.bt .top{padding:0}.bt .pill{white-space:nowrap;font-size:.9rem;min-height:34px}.bt .btn-small{min-height:34px}.log{height:32px;font-size:.7rem;line-height:1.2}.skills button{min-height:38px;font-size:.8rem}.skills{gap:3px}.panel .who img,.panel .who canvas,.panel .who .pf{max-height:30px}.hint{font-size:.7rem;line-height:1.15}.order{min-height:26px;padding:1px 2px}.order img{width:22px;height:22px}}
@media (max-width:360px){html,body{font-size:14px}.tabs button{font-size:.8rem}}
@media (prefers-reduced-motion:reduce){.ly-far,.ly-mid,.ly-cl,.amb i,.badge,.hot span,.item.r3::after,.banner .rays{animation:none!important}.spr,.spr.il{animation-duration:2.6s}#app.enter>*{animation:none}}
`;
