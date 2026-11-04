/* ---- Boutique : catalogue ---- */
const RC=['#b9b4c9','#6be3ff','#c58bff','#ffd36b','#ff6b8a'],RN=['Commun','Rare','Épique','Légendaire','Mythique'],PR=[7000,17000,42000,100000,260000],RW=[50,28,14,6,2];
const RB=Array.from({length:12},(_,i)=>new THREE.Color().setHSL(i/12,.9,.6).getHex());
const TN={k:'Skin',t:'Traînée',a:'Accessoire',u:'Amélioration'};
const DEFK={id:'k0',t:'k',n:'Classique',r:0,g:'cone',c:0xffd36b,e:0x553300},DEFT={id:'t0',t:'t',n:'Aucune',r:0,c:[]},DEFA={id:'a0',t:'a',n:'Aucun',r:0,g:'none'};
const CAT=[
{id:'k1',t:'k',n:'Braise',r:0,g:'cone',c:0xff8a3a,e:0x7a2a00},
{id:'k2',t:'k',n:'Océan',r:0,g:'cone',c:0x6be3ff,e:0x0a5a7a},
{id:'k3',t:'k',n:'Menthe',r:0,g:'cyl',c:0x7dffb0,e:0x0a6a3a},
{id:'k12',t:'k',n:'Sable',r:0,g:'cone',c:0xe8c98a,e:0x8a6a30},
{id:'k4',t:'k',n:'Cristal',r:1,g:'oct',c:0xc8f6ff,e:0x2ab8e8},
{id:'k5',t:'k',n:'Rubis',r:1,g:'tet',c:0xff5a7a,e:0x8a0a2a},
{id:'k13',t:'k',n:'Pervenche',r:1,g:'cyl',c:0x9ab8ff,e:0x3a4a9a},
{id:'k6',t:'k',n:'Prisme',r:2,g:'ico',c:0xe6d0ff,e:0x9a4dff},
{id:'k7',t:'k',n:'Ambre',r:2,g:'dod',c:0xffd36b,e:0xb86a00},
{id:'k8',t:'k',n:'Dragon',r:3,g:'knot',c:0x4dff8f,e:0x0a8a3a},
{id:'k9',t:'k',n:'Nova',r:3,g:'dod',c:0xffffff,e:0xffb830,i:2},
{id:'k10',t:'k',n:'Spectre',r:4,g:'knot',c:0xffffff,e:0xffffff,rb:1},
{id:'k11',t:'k',n:'Fantôme',r:4,g:'ico',c:0xffffff,e:0xffffff,i:1.2,rb:1,gh:1,secret:1},
{id:'t1',t:'t',n:'Étincelles',r:0,c:[0xffd36b,0xffb830]},
{id:'t2',t:'t',n:'Brume',r:0,c:[0xb9d4ff,0xe6eeff],s:1.6,l:.8},
{id:'t3',t:'t',n:'Cendres',r:0,c:[0xaaaaaa,0xff8a3a],up:1},
{id:'t12',t:'t',n:'Pollen',r:0,c:[0xffe29a,0x7dffb0],s:1.1,up:.5},
{id:'t4',t:'t',n:'Flamme',r:1,c:[0xff4a1a,0xff9a3a,0xffd36b],up:3},
{id:'t5',t:'t',n:'Néon',r:1,c:[0xff3fc4,0x6be3ff],s:1.2},
{id:'t6',t:'t',n:'Glace',r:2,c:[0xffffff,0x6be3ff,0xc8f6ff],up:-1,l:.9},
{id:'t7',t:'t',n:'Lucioles',r:2,c:[0x4dff8f,0xd8ff6b],j:2,up:1.5},
{id:'t8',t:'t',n:'Galaxie',r:3,c:[0x9a4dff,0xffd36b,0xffffff,0x4d7aff],j:1.5,s:1.3},
{id:'t9',t:'t',n:'Foudre',r:3,c:[0xffffff,0xfff27a],j:3,l:.35},
{id:'t10',t:'t',n:'Arc-en-ciel',r:4,c:RB,s:1.5,l:.9},
{id:'t11',t:'t',n:'Comète',r:4,c:[...RB,0xffffff,0xffffff],s:1.9,j:.9,l:1.1,up:.5,secret:1},
{id:'a1',t:'a',n:'Halo',r:0,p:600,g:'halo',c:0xffd36b,e:0xffb830},
{id:'a2',t:'a',n:'Anneau',r:0,p:800,g:'ring',c:0x6be3ff,e:0x2ab8e8},
{id:'a3',t:'a',n:'Couronne',r:1,p:1400,g:'crown',c:0xffd36b,e:0xb86a00},
{id:'a4',t:'a',n:'Orbe',r:1,p:1200,g:'orb',c:0xc58bff,e:0x9a4dff},
{id:'a5',t:'a',n:'Aura douce',r:2,p:2000,g:'aura',c:0x7dffb0,e:0x4dff8f},
{id:'a6',t:'a',n:'Ailerons',r:2,p:1800,g:'fins',c:0xff6b8a,e:0xff3fc4},
{id:'a7',t:'a',n:'Satellite',r:3,p:3200,g:'sat',c:0xffffff,e:0x6be3ff},
{id:'u1',t:'u',n:'Aimant +',r:0,p:900,desc:'Rayon d’aimant +2'},
{id:'u2',t:'u',n:'Dash vif',r:0,p:1100,desc:'Recharge du dash un peu plus rapide'},
{id:'u3',t:'u',n:'Pas léger',r:1,p:1300,desc:'Vitesse +5 %'},
{id:'u4',t:'u',n:'Combo souple',r:0,p:800,desc:'Fenêtre de combo un peu plus large'},
{id:'u5',t:'u',n:'Bouclier +',r:1,p:1500,desc:'Boucliers +15 % durée'},
{id:'u6',t:'u',n:'Gel +',r:1,p:1400,desc:'Gel +15 % durée'},
{id:'u7',t:'u',n:'Récolte',r:2,p:2200,desc:'+1 lueur bonus toutes les 8 prises'}
];
const find=id=>CAT.find(i=>i.id==id)||(id=='t0'?DEFT:id=='a0'?DEFA:DEFK);
