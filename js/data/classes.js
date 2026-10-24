/* ===== KLASY, UMIEJĘTNOŚCI, TALENTY ===== */
const CLASSES={
 wojownik:{name:'Wojownik',icon:'🛡️',hp:130,atk:12,def:8,spd:4,crit:.08,fx:'melee',res:{ciete:10,klute:10},grow:{hp:10,atk:1,def:1,spd:0},desc:'Twardy obrońca, ściąga na siebie ataki.'},
 lucznik:{name:'Łucznik',icon:'🏹',hp:85,atk:15,def:3,spd:8,crit:.15,fx:'arrow',res:{trucizna:15,lod:10},grow:{hp:6,atk:2,def:0,spd:.2},desc:'Szybki strzelec, rani wielu wrogów.'},
 mag:{name:'Mag',icon:'🔮',hp:70,atk:18,def:2,spd:6,crit:.1,fx:'magic',dt:'arkana',res:{arkana:30,ogien:10,lod:10,obuch:-10},grow:{hp:5,atk:2,def:0,spd:.1},desc:'Potężna magia, ale kruche ciało.'},
 kaplan:{name:'Kapłan',icon:'✨',hp:90,atk:9,def:5,spd:5,crit:.05,fx:'holy',dt:'swiete',res:{swiete:50,mrok:25},grow:{hp:7,atk:1,def:1,spd:.1},desc:'Leczy i chroni drużynę.'},
 lotr:{name:'Łotr',icon:'🗡️',hp:80,atk:16,def:3,spd:9,crit:.25,fx:'melee',res:{trucizna:30},grow:{hp:6,atk:2,def:0,spd:.2},desc:'Zwinny zabójca, często trafia krytycznie.'},
 paladyn:{name:'Paladyn',icon:'⚜️',hp:120,atk:11,def:7,spd:4,crit:.06,fx:'melee',res:{swiete:30,mrok:20,ciete:5},grow:{hp:9,atk:1,def:1,spd:0},desc:'Święty rycerz: osłania sojuszników, leczy i miażdży młotem.'},
 druid:{name:'Druid',icon:'🌿',hp:95,atk:14,def:4,spd:6,crit:.08,fx:'poison',res:{trucizna:30,lod:15,ogien:-10},grow:{hp:7,atk:1.5,def:.5,spd:.1},desc:'Strażnik natury: trucizny, regeneracja i forma niedźwiedzia.'},
 czarnoksieznik:{name:'Czarnoksiężnik',icon:'💀',hp:75,atk:17,def:2,spd:6,crit:.1,fx:'dark',dt:'mrok',res:{mrok:40,trucizna:15,swiete:-20},grow:{hp:5,atk:2,def:0,spd:.1},desc:'Mroczny mag: klątwy, wysysanie życia i zaraza.'},
 bard:{name:'Bard',icon:'🎻',hp:92,atk:12,def:4,spd:8,crit:.1,fx:'magic',dt:'arkana',res:{arkana:20,mrok:10},grow:{hp:6,atk:1,def:.5,spd:.2},desc:'Muzyk-wsparcie: wzmacnia drużynę, osłabia i usypia wrogów.'}
};
const ROLE={wojownik:'Tank / walka wręcz',lucznik:'Obrażenia z dystansu',mag:'Magia obszarowa',kaplan:'Leczenie / wsparcie',lotr:'Zabójca / krytyki',paladyn:'Tank / wsparcie (święte)',druid:'Leczenie / trucizny / niedźwiedź',czarnoksieznik:'Klątwy / drenaż życia (mrok)',bard:'Wzmocnienia / kontrola'};
for(const k in CLASSES)CLASSES[k].role=ROLE[k];
const lowest=l=>l.slice().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
const ATTRS={atk:{n:'Siła',ic:'atk',d:'+2 ATK',v:2},hp:{n:'Wytrzymałość',ic:'hp',d:'+10 PŻ',v:10},def:{n:'Obrona',ic:'def',d:'+2 OBR',v:2},spd:{n:'Zręczność',ic:'spd',d:'+0,4 SZY i +1% kryt.',v:.4}};
