/* Eldaria – style: dwór królewski, kantor „Złota Waga” (wnętrza-sceny, js/town/court.js) */
css`
/* ===== wnętrza budynków: scena po lewej, panel z zakładkami po prawej ===== */
.hallv .stpano{flex:1.45}
.hallv .stside{gap:5px}
.hallv .stside .nd{font-size:.8rem}
.hallv .stside h3{font-size:.95rem}
.hltabs{margin:0;position:sticky;top:0;z-index:3;background:#1c2414}
.hltabs button{min-height:36px;font-size:.84rem}
.hltabs em{font-style:normal;font-weight:bold;color:#2a1408;background:#ffd23a;padding:0 4px;font-size:.7rem}
.slab.on{background:#5a3a14e0;box-shadow:0 0 0 1px #000,inset 0 0 0 1px #ffd870}
.hnpc .sfr{filter:drop-shadow(0 2px 0 #0008) drop-shadow(0 0 4px #ffd87055)}
/* mieszkańcy w scenach miast i wsi (pojedyncza klatka): jasna obwódka, żeby odcinali się od tła */
.snpc .sfr.one{filter:drop-shadow(0 2px 0 #0008) drop-shadow(0 0 1px #fff3d0) drop-shadow(0 0 3px #ffd87066)}
.hname{z-index:6;opacity:.92}
.hname b{color:#fff2c8}
/* tytuł kompanii */
.tytul{display:flex;gap:10px;align-items:center;background:linear-gradient(90deg,#3a1418,#2a1a24);box-shadow:0 0 0 2px #140d12,inset 3px 0 0 #ffd870;padding:6px 10px}
.tytul>div{display:flex;flex-direction:column;min-width:0}
.tytul small{font-size:.66rem;color:var(--dim);text-transform:uppercase;letter-spacing:.05em}
.tytul b{color:var(--gold);font-size:1.02rem}
.tytul span{font-size:.76rem;color:#e8d8b0}
.tytul em{font-size:.7rem;color:var(--dim);font-style:italic;margin-top:2px}
/* pożyczki */
.loans{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:5px}
.loans button{display:flex;flex-direction:column;align-items:center;gap:1px;min-height:52px;font-size:.88rem}
.loans small{font-size:.7rem;opacity:.8}
.vault.loan.late{background:#3a1a1a;box-shadow:0 0 0 2px #140d12,inset 3px 0 0 #ff8a6a}
.vault.loan.late b{color:#ff9a7a}
.hallv .cols{grid-template-columns:1fr}
/* audiencja: sala tronowa nad rozmową */
.dimg{display:block;margin:-2px auto 6px;width:min(420px,100%);aspect-ratio:688/384;image-rendering:pixelated;box-shadow:0 0 0 2px #140d12,0 0 0 4px #6a4a30;background:#140d12}
@media (max-height:500px){.hallv .ttop .tsub{display:none}.dimg{width:auto;height:28vh;max-width:100%}.hltabs button{min-height:30px;font-size:.78rem}.tytul{padding:4px 8px}.tytul b{font-size:.9rem}.tytul span{font-size:.7rem}.tytul em{display:none}.loans button{min-height:42px}}
@media (max-width:640px){.hallv .stpano{flex:0 0 46%}}
`;
