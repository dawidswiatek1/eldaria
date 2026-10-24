/* Eldaria – style: miasto */
css`
/* --- miasto --- */
.town{position:relative;overflow:hidden;margin:4px 4px 10px;line-height:0;box-shadow:0 0 0 2px #140d12,0 0 0 5px #6a4a30,0 0 0 7px #140d12}
.town>img{width:100%;display:block}
.hot{position:absolute;border:2px dashed transparent;border-image:none;padding:0;min-height:0;display:flex;align-items:flex-start;justify-content:center}
.hot:active:not(:disabled){border-color:#ffe38a;background:#ffe38a22;transform:none}
.hot span{margin-top:-6px;border:6px solid transparent;border-image:var(--fr-parch) 10/6px;background:#ecdcae;background-clip:padding-box;color:#3a2414;padding:0 3px;font-size:.78rem;font-weight:600;line-height:1.3;white-space:nowrap;text-shadow:none;animation:signB 2.4s ease-in-out infinite;display:inline-flex;align-items:center;gap:3px}
@keyframes signB{50%{transform:translateY(-2px)}}
.smoke{position:absolute;width:8px;height:8px;background:#e8e8ec;opacity:0;animation:smokeA 3.2s linear infinite;pointer-events:none}
@keyframes smokeA{0%{opacity:0;transform:translate(0,0) scale(.6)}15%{opacity:.85}100%{opacity:0;transform:translate(10px,-34px) scale(1.8)}}
.townbtns{display:grid;grid-template-columns:1fr;gap:6px}
.townbtns button{justify-content:flex-start;text-align:left;padding:2px 6px}
.townbtns button b{display:block;font-size:1rem}.townbtns button small{color:var(--dim)}
`;
