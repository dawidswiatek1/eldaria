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
 smok:{dt:'ciete',res:{ogien:75,trucizna:25,lod:-35},name:'Smok',hp:300,atk:19,def:8,spd:6,sp:'fire',boss:true,d:'Ognisty oddech pali całą drużynę.'},
 /* bestie Velesii */
 dzik:{dt:'obuch',res:{ciete:15,trucizna:15,ogien:-20},name:'Dzik',hp:60,atk:12,def:4,spd:6,sp:'charge',d:'Szarżuje na oślep – potężny cios, może ogłuszyć.'},
 borowy:{dt:'obuch',nb:1,res:{trucizna:50,klute:25,ogien:-45},name:'Borowy',hp:118,atk:13,def:6,spd:3,sp:'roots',d:'Leśny duch. Oplata korzeniami (ogłusza) i powoli się odradza. Boi się ognia.'},
 bies:{dt:'klute',res:{ogien:50,mrok:30,swiete:-40},name:'Bies',hp:70,atk:13,def:3,spd:9,sp:'bies',d:'Złośliwy czort z widłami. Kradnie złoto i rzuca uroki osłabienia.'},
 szeptun:{res:{mrok:50,swiete:-35,ogien:-10},name:'Mroczny szeptun',hp:64,atk:13,def:2,spd:7,sp:'hex',fx:'dark',d:'Kultysta starych pieczęci. Klątwa na całą drużynę, przyzywa nietoperze.'},
 wilkolak:{dt:'ciete',res:{ciete:20,klute:20,swiete:-30,ogien:-20},name:'Wilkołak',hp:96,atk:15,def:4,spd:8,sp:'enrage',d:'Ranny wpada w szał: mocniejsze i podwójne ataki, krwawienie.'},
 wilkolakA:{dt:'ciete',res:{ciete:25,klute:25,swiete:-30,ogien:-20},name:'Wilkołak Alfa',hp:300,atk:17,def:6,spd:8,sp:'alfa',boss:true,d:'Przywódca watahy. Wyciem wzywa wilki, w szale tnie dwa razy.'},
 utopiec:{dt:'ciete',res:{lod:50,trucizna:30,ogien:-40},name:'Utopiec',hp:72,atk:12,def:3,spd:5,sp:'drown',d:'Wciąga pod wodę: ogłusza i dusi przez kilka tur. Odporny na lód, boi się ognia.'},
 utopiecS:{dt:'lod',res:{lod:75,trucizna:40,ogien:-35},name:'Utopiec Starszy',hp:340,atk:17,def:6,spd:4,sp:'utopS',boss:true,d:'Pan rozlewisk. Przyzywa utopce, fala lodowatej wody uderza w całą drużynę.'},
 leszy:{dt:'obuch',nb:1,res:{trucizna:60,klute:30,ogien:-50},name:'Leszy',hp:350,atk:17,def:7,spd:4,sp:'leszy',boss:true,d:'Pan puszczy. Regeneruje się, dopóki nie płonie. Wzywa wilki i oplata korzeniami.'},
 rusalka:{res:{lod:50,ogien:-30,mrok:20},name:'Rusałka',hp:60,atk:12,def:2,spd:8,sp:'charm',fx:'magic',d:'Śpiewem czaruje (bohater traci turę) i topi. Czerpie z tego siły.'},
 poludnica:{dt:'ciete',res:{ogien:60,swiete:20,mrok:-35,lod:-15},name:'Południca',hp:92,atk:14,def:3,spd:7,sp:'noon',d:'Zjawa z pól o południu. Żar i obłęd: obrażenia od ognia i osłabienie całej drużyny. Słaba na mrok.'},
 poludnicaK:{dt:'ciete',res:{ogien:70,swiete:20,mrok:-35,lod:-15},name:'Królowa Południc',hp:310,atk:17,def:5,spd:7,sp:'noonK',boss:true,d:'Gdy słońce w zenicie, jej żar pali wszystkich. Przyzywa południce.'},
 strzyga:{dt:'ciete',res:{mrok:40,trucizna:50,ogien:-40,swiete:-50},name:'Strzyga',hp:80,atk:14,def:3,spd:9,sp:'drain',fly:1,d:'Wysysa krew. Powstaje z martwych, chyba że dobije się ją ogniem lub świętością.'},
 bazyliszek:{dt:'trucizna',res:{trucizna:75,klute:20,lod:-30},name:'Bazyliszek',hp:86,atk:13,def:5,spd:6,sp:'gaze',d:'Spojrzenie zamienia w kamień (ogłuszenie i −50% obrony). Jadowite ukąszenie.'},
 zmij:{dt:'ciete',res:{ogien:75,trucizna:30,lod:-35},name:'Żmij',hp:390,atk:19,def:8,spd:6,sp:'zmij',boss:true,fly:0,d:'Smok z Wielkiego Grzbietu. Trzy fazy: kły i ogon, lot z ognistym oddechem, wściekłość.'},
 babajaga:{res:{mrok:40,trucizna:40,ogien:-25,swiete:-25},name:'Baba Jaga',hp:370,atk:17,def:5,spd:7,sp:'jaga',fx:'dark',boss:true,d:'Chata na kurzej stopce przyzywa sługi. Ranna Jaga wzlatuje w moździerzu: nieuchwytna, ciska klątwy.'}
};
const BIOMES=[
 {k:'las',n:'Mroczna Puszcza',pool:[[1,'goblin'],[1,'wilk'],[1,'szlam'],[1,'dzik'],[2,'pajak'],[3,'szaman'],[3,'borowy']],boss:'leszy'},
 {k:'trakt',n:'Trakt Bandytów',pool:[[0,'bandyta'],[0,'rzezimieszek'],[0,'lucznikB'],[0,'wilk'],[2,'nietoperz'],[2,'bies']],boss:'herszt'},
 {k:'krypta',n:'Kurhany Przodków',pool:[[0,'szkielet'],[0,'ghul'],[0,'nietoperz'],[1,'upior'],[2,'kultysta'],[2,'strzyga'],[3,'szeptun']],boss:'nekromanta'},
 {k:'gory',n:'Wielki Grzbiet',pool:[[0,'ork'],[0,'harpia'],[0,'wilk'],[1,'mroczny'],[2,'kultysta'],[1,'wilkolak'],[2,'bazyliszek']],boss:'golem'},
 {k:'jama',n:'Smocza Jama',pool:[[0,'ork'],[0,'mroczny'],[0,'kultysta'],[0,'harpia'],[0,'ghul'],[0,'bazyliszek'],[0,'wilkolak']],boss:'zmij'},
 /* nowe krainy Velesii (sr = poziom trudności, zob. expStage) */
 {k:'bagno',n:'Bagno Czarne',sr:2,pool:[[0,'utopiec'],[0,'szlam'],[0,'nietoperz'],[1,'rusalka'],[2,'bazyliszek']],boss:'utopiecS'},
 {k:'pola',n:'Pola Południcy',sr:1,pool:[[0,'dzik'],[0,'goblin'],[0,'wilk'],[1,'poludnica'],[2,'bies']],boss:'poludnicaK'},
 {k:'chata',n:'Chata na kurzej stopce',sr:3,pool:[[0,'bies'],[0,'nietoperz'],[0,'strzyga'],[1,'szeptun'],[2,'wilkolak']],boss:'babajaga'},
 {k:'las',n:'Wilcze Jary',sr:2,pool:[[0,'wilk'],[0,'dzik'],[1,'wilkolak'],[2,'borowy']],boss:'wilkolakA'}
];
const DT={ciete:{n:'Cięte',c:'#e8dcc8',i:'miecz'},klute:{n:'Kłute',c:'#e0c890',i:'luk'},obuch:{n:'Obuchowe',c:'#d0a070',i:'bulawa'},ogien:{n:'Ogień',c:'#ff8a3a',i:'st_burn'},lod:{n:'Lód',c:'#8fd8ff',i:'sk_lod'},trucizna:{n:'Trucizna',c:'#a8f05a',i:'st_poison'},mrok:{n:'Mrok',c:'#c08aff',i:'skull'},swiete:{n:'Święte',c:'#ffe36a',i:'sk_blog'},arkana:{n:'Arkana',c:'#e0a0ff',i:'rozdzka'}};
const FX2DT={fire:'ogien',arrow:'klute',dark:'mrok',magic:'arkana',poison:'trucizna',web:'obuch',ice:'lod',holy:'swiete'};
const WDT={mlot:'obuch',galaz:'obuch',czaszka:'mrok',lutnia:'arkana',miecz:'ciete',topor:'ciete',luk:'klute',kusza:'klute',rozdzka:'arkana',kostur:'obuch',bulawa:'obuch',sztylety:'klute'};
const RES_CAP=75;
const resChip=(k,v)=>`<span class="rs ${v<0?'wk':v>=100?'im':''}" style="--dc:${DT[k].c}">${ic(DT[k].i,12)}${DT[k].n} ${v>=100?'odporność całkowita':(v>0?'+':'')+v+'%'}</span>`;
const resStr=r=>r?Object.keys(DT).filter(k=>r[k]).map(k=>resChip(k,r[k])).join(''):'';
const dtChip=k=>`<span class="rs dt" style="--dc:${DT[k].c}">${ic(DT[k].i,12)}${DT[k].n}</span>`;
const biomeOf=st=>BIOMES[Math.floor((st-1)/5)%BIOMES.length];
