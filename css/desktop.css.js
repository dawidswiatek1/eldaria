/* Eldaria – style: v16: komputer – kadr, najechanie myszą, formacja */
css`
/* ===== v16: komputer – kadr, najechanie myszą ===== */
:root{--vw:1vw;--vh:1vh}
html.lbox body{background:radial-gradient(ellipse at 50% 50%,#2a1c26 0,#0c080b 75%),#0c080b}
html.lbox body::before{content:'';position:fixed;inset:0;background:var(--tx-stone) 0 0/320px 320px;opacity:.25;pointer-events:none}
html.lbox #app{box-shadow:0 0 0 2px #140d12,0 0 0 5px #8a6a2a,0 0 0 7px #140d12,0 10px 40px #000c;overflow:hidden}
html.mouse [data-act]{cursor:pointer}
html.mouse button:not(:disabled):hover{filter:brightness(1.14) saturate(1.05)}
html.mouse button:not(:disabled):active{filter:brightness(.92)}
html.mouse .card[data-act]:hover,html.mouse .item[data-act]:hover,html.mouse .armit:hover .item{filter:brightness(1.08);box-shadow:0 0 0 2px #ffd77a88}
html.mouse .unit:hover .mv{filter:drop-shadow(0 0 3px #ffe38a)}
html.mouse .unit.target:hover .mv{filter:drop-shadow(0 0 4px #7dff8a) brightness(1.15)}
html.mouse .tlab:hover{opacity:1;filter:brightness(1.25)}
html.mouse .thit:hover~.tlab{opacity:1}
#tscroll.drag{cursor:grabbing}
html.mouse #tscroll{cursor:grab}

/* v16: formacja – pełne postacie w kartach */
.fslot,.fslot{width:66px;height:138px}
.fspr{overflow:visible;flex:1 1 auto;min-height:98px}
.fspr>div{flex:0 0 auto}
.fnote{white-space:normal;overflow-wrap:anywhere;max-width:100%;text-align:left}
@media (max-width:760px){.fslot{width:60px;height:136px}}
`;
