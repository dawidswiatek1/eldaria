/* Eldaria – style: przyciski pikselowe */
css`
/* --- przyciski pikselowe --- */
button{font:inherit;color:var(--ink);border:8px solid transparent;border-image:var(--fr-btn) 8 fill/8px stretch;background:none;padding:4px 8px;min-height:46px;cursor:pointer;touch-action:manipulation;text-shadow:1px 1px 0 #140d12;border-radius:0;display:inline-flex;align-items:center;justify-content:center;gap:6px;line-height:1.15}
button:active:not(:disabled){border-image-source:var(--fr-btnp);transform:translateY(1px)}
button:disabled{filter:grayscale(.8) brightness(.7);opacity:.75}
.btn-main{border-image-source:var(--fr-gold);color:#2a1408;text-shadow:1px 1px 0 #ffe9a088;font-weight:600;font-size:1.12rem;width:100%;min-height:58px;letter-spacing:.3px}
.btn-main:active:not(:disabled){border-image-source:var(--fr-goldp)}
.btn-gold{border-image-source:var(--fr-gold);color:#2a1408;text-shadow:none;font-weight:600}
.btn-gold:active:not(:disabled){border-image-source:var(--fr-goldp)}
.btn-green{border-image-source:var(--fr-green);font-weight:600}
.btn-green:active:not(:disabled){border-image-source:var(--fr-greenp)}
.btn-red{border-image-source:var(--fr-red)}
.btn-small{min-height:40px;padding:2px 6px;font-size:.9rem}
.btn-main .ic,.btn-gold .ic{filter:drop-shadow(1px 1px 0 #0006)}
h1{font-size:1.6rem;margin:.3em 0;text-align:center;color:var(--gold);text-shadow:2px 2px 0 #140d12}
h2{font-size:1.05rem;margin:14px 0 6px;color:var(--gold);text-shadow:2px 2px 0 #140d12;display:flex;align-items:center;gap:6px}
.top{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 0}
.pill{border:8px solid transparent;border-image:var(--fr-slot) 8 fill/8px;padding:0 6px;font-weight:600;display:inline-flex;align-items:center;gap:6px;min-height:40px;font-size:1.05rem;text-shadow:1px 1px 0 #000}
.pill.gold{color:var(--gold)}
.tabs{display:flex;gap:4px;margin-bottom:6px}
.tabs button{flex:1;padding:2px 2px;font-size:.9rem;min-height:48px}
.tabs button.on{border-image-source:var(--fr-on);color:#fff6d8}
.tabs button .ic{width:22px;height:22px}
`;
