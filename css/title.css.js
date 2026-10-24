/* Eldaria – style: ekran tytułowy */
css`
/* --- ekran tytułowy --- */
.title{display:flex;flex-direction:column;flex:1}
.tscene{position:relative;height:min(calc(58*var(--vh)),440px);margin:0 -10px;overflow:hidden;box-shadow:0 2px 0 #140d12,0 5px 0 #6a4a30,0 7px 0 #140d12}
.tscene .ly{position:absolute;inset:0 -16px;background-repeat:repeat-x;background-size:auto 100%;image-rendering:pixelated}
.logo{position:absolute;left:0;right:0;top:20px;text-align:center;z-index:3;animation:logoA 3s ease-in-out infinite}
.logo b{display:block;font-size:2.35rem;line-height:1;font-weight:600;color:#ffd77a;background:linear-gradient(#fff6c8 0 30%,#ffc24a 50%,#d0702a 85%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(2px 0 0 #3a1a08) drop-shadow(-2px 0 0 #3a1a08) drop-shadow(0 2px 0 #3a1a08) drop-shadow(0 -2px 0 #3a1a08) drop-shadow(0 4px 0 #140d12)}
.logo small{display:inline-block;margin-top:8px;color:#fff3d6;font-size:.95rem;text-shadow:1px 1px 0 #000,0 0 6px #000;background:#140d1288;padding:2px 10px}
@keyframes logoA{50%{transform:translateY(-4px)}}
.tparty{position:absolute;left:18px;right:0;bottom:24px;display:flex;justify-content:flex-start;align-items:flex-end;gap:0;z-index:2}
.tparty .tu{position:relative}
.tparty .tu .spr{position:relative}
.tfoes{position:absolute;right:4px;bottom:30px;display:flex;align-items:flex-end;z-index:1}
@media (max-width:400px){.tfoes .tu:nth-child(2){display:none}}
.feat{display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;font-size:.84rem;margin:8px 2px 0;color:var(--dim)}
.feat span{display:flex;align-items:center;gap:5px}
.howto{font-size:.9rem;line-height:1.45;padding:0 4px;margin-top:8px}
.howto summary{font-weight:600;color:var(--gold);cursor:pointer;padding:4px 0;list-style:none;display:flex;align-items:center;gap:6px}
.howto p{margin:4px 0}
.lvlup{color:#a85a00;font-weight:600}
`;
