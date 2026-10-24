/* ===== WROGOWIE I KRAINY ===== */
const ENEMIES={
 goblin:{dt:'klute',name:'Goblin',hp:42,atk:9,def:2,spd:6,d:'Zwykły rabuś z lasu.'},
 wilk:{dt:'ciete',res:{lod:25,ogien:-25},name:'Wilk',hp:38,atk:10,def:1,spd:9,sp:'bleed',d:'Rozszarpuje – krwawienie.'},
 pajak:{dt:'klute',res:{trucizna:50,ogien:-30},name:'Pająk',hp:34,atk:8,def:1,spd:8,sp:'stun',d:'Oplata siecią – ogłusza.'},
 szlam:{dt:'trucizna',nb:1,res:{obuch:50,klute:25,trucizna:75,ogien:-40},name:'Szlam',hp:44,atk:7,def:4,spd:3,sp:'acid',d:'Kwas kruszy pancerz (−50% obrony).'},
 szaman:{res:{mrok:25,ogien:-15},name:'Szaman',hp:40,atk:7,def:2,spd:7,sp:'heal',fx:'magic',d:'Leczy sojuszników.'},
 szkielet:{dt:'ciete',nb:1,res:{klute:50,ciete:25,trucizna:100,obuch:-50,swiete:-50},name:'Szkielet',hp:55,atk:11,def:5,spd:5,d:'Nieumarły wojownik z tarczą.'},
 ork:{dt:'obuch',res:{trucizna:25,arkana:-20},name:'Ork',hp:85,atk:14,def:5,spd:4,sp:'smash',d:'Miażdżące ciosy.'},
 bandyta:{dt:'obuch',name:'Bandyta',hp:48,atk:10,def:3,spd:5,sp:'stunhit',d:'Pałka potrafi ogłuszyć.'},
 rzezimieszek:{dt:'klute',res:{trucizna:20},name:'Rzezimieszek',hp:36,atk:9,def:2,spd:9,sp:'steal',d:'Kradnie złoto i rani nożem.'},
 lucznikB:{res:{klute:-15},name:'Łucznik-bandyta',hp:34,atk:10,def:2,spd:7,sp:'volley',fx:'arrow',d:'Strzela do dwóch celów.'},
 nietoperz:{dt:'ciete',res:{mrok:25,klute:-25,swiete:-20},name:'Nietoperz',hp:26,atk:7,def:1,spd:11,sp:'drain',fly:1,d:'Wysysa życie.'},
 ghul:{dt:'ciete',res:{trucizna:75,mrok:25,swiete:-40,ogien:-25},name:'Ghul',hp:58,atk:11,def:3,spd:4,sp:'poison',d:'Gnijące pazury – trucizna.'},
 upior:{nb:1,res:{ciete:50,klute:50,obuch:50,trucizna:100,mrok:50,swiete:-60,arkana:-20},name:'Upiór',hp:44,atk:11,def:2,spd:7,sp:'drain',fx:'dark',eth:1,d:'Bezcielesny (25% uniku), wysysa życie.'},
 kultysta:{res:{mrok:40,swiete:-25},name:'Kultysta',hp:40,atk:9,def:2,spd:6,sp:'rally',fx:'dark',d:'Mroczne błogosławieństwo: +30% ataku wrogów.'},
 harpia:{dt:'ciete',res:{lod:25,klute:-25},name:'Harpia',hp:46,atk:11,def:2,spd:9,sp:'multi',fly:1,d:'Pikuje na dwa cele.'},
 mroczny:{dt:'ciete',res:{ciete:30,klute:30,mrok:25,obuch:-20,swiete:-25},name:'Mroczny rycerz',hp:80,atk:14,def:8,spd:4,sp:'guard',d:'Ciężka zbroja, unosi gardę.'},
 troll:{dt:'obuch',res:{trucizna:25,ogien:-50},name:'Troll',hp:215,atk:14,def:5,spd:3,sp:'troll',boss:true,d:'Regeneruje się i miażdży.'},
 herszt:{dt:'ciete',res:{ciete:20},name:'Herszt bandytów',hp:240,atk:15,def:6,spd:5,sp:'herszt',boss:true,d:'Wzywa bandytów i dodaje im odwagi.'},
 nekromanta:{res:{mrok:60,trucizna:50,swiete:-40},name:'Nekromanta',hp:230,atk:15,def:5,spd:6,sp:'necro',fx:'dark',boss:true,d:'Przyzywa szkielety, wysysa życie.'},
 golem:{dt:'obuch',nb:1,res:{ciete:40,klute:50,trucizna:100,lod:25,obuch:-30,arkana:-15},name:'Kamienny golem',hp:320,atk:17,def:10,spd:2,sp:'golem',boss:true,d:'Kamienna skóra, regeneracja, miażdżenie.'},
 smok:{dt:'ciete',res:{ogien:75,trucizna:25,lod:-35},name:'Smok',hp:300,atk:19,def:8,spd:6,sp:'fire',boss:true,d:'Ognisty oddech pali całą drużynę.'}
};
const BIOMES=[
 {k:'las',n:'Mroczna Puszcza',pool:[[1,'goblin'],[1,'wilk'],[1,'szlam'],[2,'pajak'],[3,'szaman']],boss:'troll'},
 {k:'trakt',n:'Trakt Bandytów',pool:[[0,'bandyta'],[0,'rzezimieszek'],[0,'lucznikB'],[0,'wilk'],[2,'nietoperz']],boss:'herszt'},
 {k:'krypta',n:'Kurhany Przodków',pool:[[0,'szkielet'],[0,'ghul'],[0,'nietoperz'],[1,'upior'],[2,'kultysta']],boss:'nekromanta'},
 {k:'gory',n:'Wielki Grzbiet',pool:[[0,'ork'],[0,'harpia'],[0,'wilk'],[1,'mroczny'],[2,'kultysta']],boss:'golem'},
 {k:'jama',n:'Smocza Jama',pool:[[0,'ork'],[0,'mroczny'],[0,'kultysta'],[0,'harpia'],[0,'ghul']],boss:'smok'}
];
const DT={ciete:{n:'Cięte',c:'#e8dcc8',i:'miecz'},klute:{n:'Kłute',c:'#e0c890',i:'luk'},obuch:{n:'Obuchowe',c:'#d0a070',i:'bulawa'},ogien:{n:'Ogień',c:'#ff8a3a',i:'st_burn'},lod:{n:'Lód',c:'#8fd8ff',i:'sk_lod'},trucizna:{n:'Trucizna',c:'#a8f05a',i:'st_poison'},mrok:{n:'Mrok',c:'#c08aff',i:'skull'},swiete:{n:'Święte',c:'#ffe36a',i:'sk_blog'},arkana:{n:'Arkana',c:'#e0a0ff',i:'rozdzka'}};
const FX2DT={fire:'ogien',arrow:'klute',dark:'mrok',magic:'arkana',poison:'trucizna',web:'obuch',ice:'lod',holy:'swiete'};
const WDT={mlot:'obuch',galaz:'obuch',czaszka:'mrok',lutnia:'arkana',miecz:'ciete',topor:'ciete',luk:'klute',kusza:'klute',rozdzka:'arkana',kostur:'obuch',bulawa:'obuch',sztylety:'klute'};
const RES_CAP=75;
const resChip=(k,v)=>`<span class="rs ${v<0?'wk':v>=100?'im':''}" style="--dc:${DT[k].c}">${ic(DT[k].i,12)}${DT[k].n} ${v>=100?'odporność całkowita':(v>0?'+':'')+v+'%'}</span>`;
const resStr=r=>r?Object.keys(DT).filter(k=>r[k]).map(k=>resChip(k,r[k])).join(''):'';
const dtChip=k=>`<span class="rs dt" style="--dc:${DT[k].c}">${ic(DT[k].i,12)}${DT[k].n}</span>`;
const biomeOf=st=>BIOMES[Math.floor((st-1)/5)%BIOMES.length];
