/* ---- Boutique : catalogue ---- */
const RC=['#b9b4c9','#6be3ff','#c58bff','#ffd36b','#ff6b8a'],RN=['Commun','Rare','Épique','Légendaire','Mythique'],PR=[700,1800,5000,14000,36000],RW=[48,28,14,7,3];
const RB=Array.from({length:12},(_,i)=>new THREE.Color().setHSL(i/12,.9,.6).getHex());
const TN={k:'Skin',t:'Traînée',a:'Accessoire',u:'Amélioration'};
const DEFK={id:'k0',t:'k',n:'Classique',r:0,g:'cone',c:0xffd36b,e:0x553300},DEFT={id:'t0',t:'t',n:'Aucune',r:0,c:[]},DEFA={id:'a0',t:'a',n:'Aucun',r:0,g:'none'};
const CAT=[
{id:'k1',t:'k',n:'Braise',r:0,g:'cone',c:0xff8a3a,e:0x7a2a00},
{id:'k2',t:'k',n:'Océan',r:0,g:'cone',c:0x6be3ff,e:0x0a5a7a},
{id:'k3',t:'k',n:'Menthe',r:0,g:'cyl',c:0x7dffb0,e:0x0a6a3a},
{id:'k4',t:'k',n:'Cristal',r:1,g:'oct',c:0xc8f6ff,e:0x2ab8e8},
{id:'k5',t:'k',n:'Rubis',r:1,g:'tet',c:0xff5a7a,e:0x8a0a2a},
{id:'k6',t:'k',n:'Prisme',r:2,g:'ico',c:0xe6d0ff,e:0x9a4dff},
{id:'k7',t:'k',n:'Ambre',r:2,g:'dod',c:0xffd36b,e:0xb86a00},
{id:'k8',t:'k',n:'Dragon',r:3,g:'knot',c:0x4dff8f,e:0x0a8a3a},
{id:'k9',t:'k',n:'Nova',r:3,g:'dod',c:0xffffff,e:0xffb830,i:2},
{id:'k10',t:'k',n:'Spectre',r:4,g:'knot',c:0xffffff,e:0xffffff,rb:1},
{id:'t1',t:'t',n:'Étincelles',r:0,c:[0xffd36b,0xffb830],style:'dots'},
{id:'t2',t:'t',n:'Brume',r:0,c:[0xb9d4ff,0xe6eeff],s:1.6,l:.8,style:'dots'},
{id:'t4',t:'t',n:'Flamme',r:1,c:[0xff4a1a,0xff9a3a,0xffd36b],up:3,style:'streak'},
{id:'t5',t:'t',n:'Néon',r:1,c:[0xff3fc4,0x6be3ff],s:1.2,style:'streak'},
{id:'t8',t:'t',n:'Galaxie',r:2,c:[0x9a4dff,0x6be3ff,0xffd36b],style:'dots'},
{id:'t10',t:'t',n:'Arc-en-ciel',r:3,c:[0xff6b8a,0xffd36b,0x7dffb0,0x6be3ff,0xc58bff],style:'streak'},
{id:'a1',t:'a',n:'Halo',r:0,p:450,g:'halo',c:0xffd36b,e:0xffb830},
{id:'a2',t:'a',n:'Anneau',r:0,p:550,g:'ring',c:0x6be3ff,e:0x2ab8e8},
{id:'a3',t:'a',n:'Couronne',r:1,p:1200,g:'crown',c:0xffd36b,e:0xb86a00},
{id:'a6',t:'a',n:'Ailerons',r:2,p:1700,g:'fins',c:0xff6b8a,e:0xff3fc4},
{id:'u1',t:'u',n:'Aimant +',r:1,p:800},
{id:'u2',t:'u',n:'Stamina +',r:1,p:900},
{id:'u3',t:'u',n:'Vitesse +',r:2,p:1500},
{id:'u7',t:'u',n:'Récolte',r:1,p:1000},
{id:'u8',t:'u',n:'Endurance',r:2,p:1800}
];
const find=id=>CAT.find(i=>i.id==id)||(id=='t0'?DEFT:id=='a0'?DEFA:DEFK);
