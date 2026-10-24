/* Eldaria – style: podstawy: zmienne, body, #app */
css`

:root{--sp:1;--ink:#f3e6c8;--gold:#ffd77a;--dim:#b8a890;--fw:0px}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
b,strong,th{font-weight:600}
html,body{margin:0;min-height:100%;color:var(--ink);font-family:'Pix',system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:15px;touch-action:manipulation;-webkit-user-select:none;user-select:none;overflow-x:hidden}
html{background:#140d12}
body{background:radial-gradient(ellipse at 50% 30%,#0000 40%,#000a 100%),var(--tx-stone) 0 0/320px 320px;image-rendering:pixelated;min-height:calc(100*var(--vh))}
#app{max-width:520px;margin:0 auto;min-height:calc(100*var(--vh));min-height:calc(100*var(--vh));display:flex;flex-direction:column;padding:env(safe-area-inset-top) 10px calc(env(safe-area-inset-bottom) + 10px);image-rendering:auto}
#app.enter>*{animation:enterA calc(.28s * var(--sp)) ease-out both}
@keyframes enterA{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.px,.ic{image-rendering:pixelated;image-rendering:crisp-edges}
.ic{vertical-align:-3px;display:inline-block}
.st{white-space:nowrap;display:inline-flex;align-items:center;gap:1px;margin-right:6px}
.st .ic{vertical-align:middle}
`;
