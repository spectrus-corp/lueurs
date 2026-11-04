/* ---- Boutique : catalogue ---- */
const RC=['#b9b4c9','#6be3ff','#c58bff','#ffd36b','#ff6b8a'],RN=['Commun','Rare','Épique','Légendaire','Mythique'],PR=[600,1600,4200,11000,28000],RW=[48,28,14,7,3];
const RB=Array.from({length:12},(_,i)=>new THREE.Color().setHSL(i/12,.9,.6).getHex());
const TN={k:'Skin',t:'Traînée',a:'Accessoire',u:'Amélioration'};
const DEFK={id:'k0',t:'k',n:'Classique',r:0,g:'cone',c:0xffd36b,e:0x553300},DEFT={id:'t0',t:'t',n:'Aucune',r:0,c:[]},DEFA={id:'a0',t:'a',n:'Aucun',r:0};
const CAT=[
DEFK,{id:'k1',t:'k',n:'Braise',r:0,g:'cone',c:0xff6b3d,e:0x661100},{id:'k2',t:'k',n:'Océan',r:0,g:'cone',c:0x4db8ff,e:0x003366},{id:'k3',t:'k',n:'Menthe',r:0,g:'cone',c:0x6bffb8,e:0x0a5530},{id:'k12',t:'k',n:'Sable',r:0,g:'cone',c:0xe8c96a,e:0x5a4010},
{id:'k4',t:'k',n:'Cristal',r:1,g:'ico',c:0xb8f0ff,e:0x2288aa},{id:'k5',t:'k',n:'Rubis',r:1,g:'ico',c:0xff4d6d,e:0x660022},{id:'k13',t:'k',n:'Pervenche',r:1,g:'ico',c:0x9aa6ff,e:0x2a2a88},
{id:'k6',t:'k',n:'Prisme',r:2,g:'oct',c:0xffffff,e:0x8866ff,rb:1},{id:'k7',t:'k',n:'Ambre',r:2,g:'oct',c:0xffc14d,e:0xaa5500},{id:'k8',t:'k',n:'Dragon',r:2,g:'oct',c:0xff3355,e:0x880000},
{id:'k9',t:'k',n:'Nova',r:3,g:'star',c:0xfff0a0,e:0xffaa00},{id:'k10',t:'k',n:'Spectre',r:3,g:'ghost',c:0xc8b8ff,e:0x5533aa},{id:'k11',t:'k',n:'Fantôme',r:4,g:'ghost',c:0xe8ffe8,e:0x44aa88},
DEFT,{id:'t1',t:'t',n:'Étincelles',r:0,c:[0xffd36b,0xffaa33]},{id:'t2',t:'t',n:'Brume',r:0,c:[0xa0c4ff,0xffffff]},{id:'t3',t:'t',n:'Cendres',r:0,c:[0x888888,0x444444]},{id:'t12',t:'t',n:'Pollen',r:0,c:[0xffe066,0xfff5c0]},
{id:'t4',t:'t',n:'Flamme',r:1,c:[0xff3d00,0xffaa00,0xffee55]},{id:'t5',t:'t',n:'Néon',r:1,c:[0xff00aa,0x00ffcc]},{id:'t6',t:'t',n:'Glace',r:1,c:[0xa0e8ff,0xffffff]},
{id:'t7',t:'t',n:'Lucioles',r:2,c:[0xb8ff4d,0xffff88,0x88ffaa]},{id:'t8',t:'t',n:'Galaxie',r:2,c:[0x7744ff,0xff44cc,0x44aaff]},{id:'t9',t:'t',n:'Foudre',r:2,c:[0xffff66,0xffffff,0x88aaff]},
{id:'t10',t:'t',n:'Arc-en-ciel',r:3,c:RB},{id:'t11',t:'t',n:'Comète',r:4,c:[0xffffff,0xffd36b,0xff6b8a,0x6be3ff]},
DEFA,{id:'a1',t:'a',n:'Halo',r:0,kind:'halo'},{id:'a2',t:'a',n:'Anneau',r:0,kind:'ring'},{id:'a3',t:'a',n:'Couronne',r:1,kind:'crown'},{id:'a4',t:'a',n:'Orbe',r:1,kind:'orb'},{id:'a5',t:'a',n:'Aura douce',r:2,kind:'aura'},{id:'a6',t:'a',n:'Ailerons',r:2,kind:'fins'},{id:'a7',t:'a',n:'Satellite',r:3,kind:'sat'},
{id:'u1',t:'u',n:'Aimant +',r:0,tag:'Rayon aimant +20%'},{id:'u2',t:'u',n:'Dash vif',r:0,tag:'Recharge dash -15%'},{id:'u3',t:'u',n:'Pas léger',r:1,tag:'Vitesse +8%'},{id:'u4',t:'u',n:'Combo souple',r:1,tag:'Fenêtre combo +20%'},{id:'u5',t:'u',n:'Bouclier +',r:2,tag:'Durée bouclier +25%'},{id:'u6',t:'u',n:'Gel +',r:2,tag:'Durée gel +25%'},{id:'u7',t:'u',n:'Récolte',r:3,tag:'+1 lueur bonus tous les 8'}
];
function priceOf(it){return it.p!=null?it.p:PR[it.r]||900}
function find(id){return CAT.find(i=>i.id===id)||(id=='t0'?DEFT:id=='a0'?DEFA:DEFK);
