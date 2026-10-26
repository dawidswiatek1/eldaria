/* Eldaria – style: ekran tytułowy (obóz kompanii o zmierzchu nad Velesią; js/ui/camp.js titleHtml) */
css`
/* --- scena --- */
.title{position:absolute;inset:0;display:block}
.title .tscene{position:absolute;inset:0;height:auto;overflow:hidden}
.tscene .ly{position:absolute;inset:0 -16px;background-repeat:repeat-x;background-size:auto 100%;image-rendering:pixelated}
.bg-title .ly-far{inset:0!important;background-size:cover!important;background-position:center 55%!important;background-repeat:no-repeat!important;animation:none!important}
/* gwiazdy migoczą, co kilkanaście sekund spada gwiazda (meteor z Aktu II) */
.tstars{position:absolute;inset:0 0 50% 0;pointer-events:none;z-index:1}
.tstars i{position:absolute;width:2px;height:2px;background:#fff6e0;box-shadow:0 0 3px #fff6e0aa;animation:twA 3s steps(2) infinite}
@keyframes twA{50%{opacity:.15}}
.shoot{position:absolute;left:24%;top:7%;width:90px;height:2px;background:linear-gradient(90deg,#fff0,#fff 85%,#ffe6a0);opacity:0;transform:rotate(16deg);transform-origin:right center;animation:shootA 14s linear infinite;animation-delay:3s}
@keyframes shootA{0%{opacity:0;transform:translate(0,0) rotate(16deg)}1%{opacity:1}5%{opacity:0;transform:translate(300px,86px) rotate(16deg)}100%{opacity:0;transform:translate(300px,86px) rotate(16deg)}}
/* --- nazwa gry na ramie z PixelLab (wnętrze ramy: 7–93% szer., 25–86% wys.; zasłona z tarczą zakrywa górny środek) --- */
.logo{position:absolute;left:max(2.5%,env(safe-area-inset-left));top:max(3%,8px);width:clamp(250px,calc(33*var(--vw)),500px);aspect-ratio:476/239;z-index:3}
.logo::before{content:'';position:absolute;left:7%;right:7%;top:25%;bottom:14%;background:linear-gradient(#1a100ce8,#2c1a12f2)}
.logo .plq{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;filter:drop-shadow(0 4px 0 #0007)}
.logo .lgt{position:absolute;left:9%;right:9%;top:35%;bottom:16%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:2px}
.logo b{display:block;font-size:clamp(1.7rem,calc(4.6*var(--vw)),3.5rem);line-height:1;font-weight:600;color:#ffd77a;background:linear-gradient(#fff6c8 0 30%,#ffc24a 50%,#d0702a 85%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(2px 0 0 #3a1a08) drop-shadow(-2px 0 0 #3a1a08) drop-shadow(0 2px 0 #3a1a08) drop-shadow(0 -2px 0 #3a1a08) drop-shadow(0 4px 0 #140d12)}
.logo small{display:block;color:#f3e2bc;font-size:clamp(.66rem,calc(1.2*var(--vw)),.95rem);letter-spacing:.04em;text-shadow:1px 1px 0 #000}
/* --- obóz: sztandar, trzech bohaterów, ognisko, trzech bohaterów (prawa trójka odwrócona do ognia) --- */
.tcamp{position:absolute;left:max(4%,env(safe-area-inset-left));bottom:7%;display:flex;align-items:flex-end;z-index:2;padding-left:3%}
.tgrp{display:flex;align-items:flex-end}
.tgrp .tu{position:relative;margin:0 -12px;z-index:2}
.tgrp .tu.bk{z-index:1;transform:translateY(-7px)}
.tgrp .tu.fl{transform:scaleX(-1)}
.tgrp .tu.fl.bk{transform:scaleX(-1) translateY(-7px)}
.tgrp .tu .spr{position:relative}
.tban{position:absolute;left:-2%;bottom:10px;z-index:1}
.tfire{position:relative;z-index:3;margin:0 6px 2px;display:flex;align-items:flex-end}
.tglow{position:absolute;left:50%;bottom:-18%;width:440%;height:140%;transform:translateX(-50%);background:radial-gradient(ellipse at center,#ffb24a40 0,#ff8a2a22 38%,#ff8a2a00 70%);pointer-events:none;z-index:-1;animation:glowF 1.7s steps(5) infinite}
@keyframes glowF{30%{opacity:.75}60%{opacity:1}80%{opacity:.85}}
.tsp{position:absolute;left:50%;bottom:55%;width:0;height:0}
.tsp i{position:absolute;bottom:0;width:3px;height:3px;background:#ffd27a;box-shadow:0 0 4px #ff9a2a;opacity:0;animation:sparkA 2.4s linear infinite}
@keyframes sparkA{0%{transform:translate(0,0);opacity:0}12%{opacity:1}100%{transform:translate(var(--dx),-130px);opacity:0}}
/* oczy w zaroślach tuż za drużyną */
.teyes{position:absolute;left:calc(100% + 2.5%);bottom:30%;z-index:1;opacity:.92}
/* --- menu: smukła kolumna po prawej, scena prześwituje --- */
.tmenu{position:absolute;right:max(3%,env(safe-area-inset-right));top:auto;bottom:max(6%,8px);height:max-content;width:clamp(214px,calc(25*var(--vw)),300px);display:flex;flex-direction:column;gap:8px;z-index:5;border:10px solid transparent;border-image:var(--fr-panel) 10/10px stretch;background:#140d12c8;background-clip:padding-box;padding:6px;max-height:calc(100% - 16px);overflow-y:auto}
.tmenu .note{margin:0}
.tmenu .btn-main{min-height:56px}.tmenu button{min-height:46px;font-size:.95rem}
.tcont{gap:10px}
.tcont .tc{display:flex;flex-direction:column;align-items:flex-start;line-height:1.15;min-width:0;text-align:left}
.tcont .tc small{font-size:.68rem;line-height:1.2;font-weight:400;opacity:.85;max-width:100%}
.trow{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:5px}
.trow button{flex-direction:column;gap:2px;padding:4px 2px;min-height:52px;min-width:0}
.trow button small{font-size:.66rem;line-height:1.05;white-space:nowrap}
.tmenu .rec{text-align:center;color:var(--gold);font-size:.8rem;display:flex;align-items:center;justify-content:center;gap:4px}
@media (max-width:780px){.teyes{display:none}}
@media (max-width:700px){.tfire+.tgrp .tu:last-child{display:none}}
@media (max-height:360px){.tmenu{gap:5px}.tmenu .btn-main{min-height:46px}.tmenu button{min-height:40px;font-size:.86rem}.trow button{min-height:44px}.tmenu .rec{font-size:.72rem}}
@media (prefers-reduced-motion:reduce){.tstars i,.shoot,.tglow,.tsp i{animation:none}.shoot,.tsp i{display:none}}
/* --- „Jak grać?” i drobne --- */
.howto{font-size:.9rem;line-height:1.45;padding:0 4px;margin-top:8px}
.howto summary{font-weight:600;color:var(--gold);cursor:pointer;padding:4px 0;list-style:none;display:flex;align-items:center;gap:6px}
.howto p{margin:4px 0}
.lvlup{color:#a85a00;font-weight:600}
`;
