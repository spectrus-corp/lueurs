/* ---- Boutique : catalogue ---- */
const RC=['#b9b4c9','#6be3ff','#c58bff','#ffd36b','#ff6b8a'],RN=['Commun','Rare','Épique','Légendaire','Mythique'],PR=[600,1600,4200,11000,28000],RW=[48,28,14,7,3];
const RB=Array.from({length:12},(_,i)=>new THREE.Color().setHSL(i/12,.9,.6).getHex());
const TN={k:'Skin',t:'Traînée',a:'Accessoire',u:'Amélioration'};
const DEFK={id:'k0',t:'k',n:'Classique',r:0,g:'cone',c:0xffd36b,e:0x553300},DEFT={id:'t0',t:'t',n:'Aucune',r:0,c:[]},DEFA={id:'a0',t:'a',n:'Aucun',r:0,g:'none'};
const CAT=[
{id:'k1',t:'k',n:'Braise',r:0,g:'cone',c:0xff8a3a,e:0x7a2a00,desc:'Forme cône, orange feu'},
{id:'k2',t:'k',n:'Océan',r:0,g:'cone',c:0x6be3ff,e:0x0a5a7a,desc:'Forme cône, bleu clair'},
{id:'k3',t:'k',n:'Menthe',r:0,g:'cyl',c:0x7dffb0,e:0x0a6a3a,desc:'Cylindre vert menthe'},
{id:'k12',t:'k',n:'Sable',r:0,g:'cone',c:0xe8c98a,e:0x8a6a30,desc:'Cône beige désert'},
{id:'k4',t:'k',n:'Cristal',r:1,g:'oct',c:0xc8f6ff,e:0x2ab8e8,desc:'Octaèdre cristal cyan'},
{id:'k5',t:'k',n:'Rubis',r:1,g:'tet',c:0xff5a7a,e:0x8a0a2a,desc:'Tétraèdre rouge vif'},
{id:'k13',t:'k',n:'Pervenche',r:1,g:'cyl',c:0x9ab8ff,e:0x3a4a9a,desc:'Cylindre bleu lavande'},
{id:'k6',t:'k',n:'Prisme',r:2,g:'ico',c:0xe6d0ff,e:0x9a4dff,desc:'Icosaèdre violet'},
{id:'k7',t:'k',n:'Ambre',r:2,g:'dod',c:0xffd36b,e:0xb86a00,desc:'Dodécaèdre doré'},
{id:'k8',t:'k',n:'Dragon',r:3,g:'knot',c:0x4dff8f,e:0x0a8a3a,desc:'Nœud torique vert'},
{id:'k9',t:'k',n:'Nova',r:3,g:'dod',c:0xffffff,e:0xffb830,i:2,desc:'Dodécaèdre blanc brillant'},
{id:'k10',t:'k',n:'Spectre',r:4,g:'knot',c:0xffffff,e:0xffffff,rb:1,desc:'Nœud arc-en-ciel animé'},
{id:'k11',t:'k',n:'Fantôme',r:4,g:'ico',c:0xffffff,e:0xffffff,i:1.2,rb:1,gh:1,secret:1,desc:'Icosaèdre fantôme'},
{id:'t1',t:'t',n:'Étincelles',r:0,c:[0xffd36b,0xffb830],desc:'Particules dorées'},
{id:'t2',t:'t',n:'Brume',r:0,c:[0xb9d4ff,0xe6eeff],s:1.6,l:.8,desc:'Nuage bleu pâle'},
{id:'t3',t:'t',n:'Cendres',r:0,c:[0xaaaaaa,0xff8a3a],up:1,desc:'Gris + braises montantes'},
{id:'t12',t:'t',n:'Pollen',r:0,c:[0xffe29a,0x7dffb0],s:1.1,up:.5,desc:'Jaune et vert doux'},
{id:'t4',t:'t',n:'Flamme',r:1,c:[0xff4a1a,0xff9a3a,0xffd36b],up:3,desc:'Flammes montantes'},
{id:'t5',t:'t',n:'Néon',r:1,c:[0xff3fc4,0x6be3ff],s:1.2,desc:'Rose et cyan néon'},
{id:'t6',t:'t',n:'Glace',r:2,c:[0xffffff,0x6be3ff,0xc8f6ff],up:-1,l:.9,desc:'Cristaux de glace'},
{id:'t7',t:'t',n:'Lucioles',r:2,c:[0x4dff8f,0xd8ff6b],j:2,up:1.5,desc:'Points verts qui s’élèvent'},
{id:'t8',t:'t',n:'Galaxie',r:3,c:[0x9a4dff,0xffd36b,0xffffff,0x4d7aff],j:1.5,s:1.3,desc:'Violet, or, bleu spatial'},
{id:'t9',t:'t',n:'Foudre',r:3,c:[0xffffff,0xfff27a],j:3,l:.35,desc:'Éclairs blanc-jaune'},
{id:'t10',t:'t',n:'Arc-en-ciel',r:4,c:RB,s:1.5,l:.9,desc:'Spectre complet'},
{id:'t11',t:'t',n:'Comète',r:4,c:[...RB,0xffffff,0xffffff],s:1.9,j:.9,l:1.1,up:.5,secret:1,desc:'Queue de comète'},
{id:'a1',t:'a',n:'Halo',r:0,p:450,g:'halo',c:0xffd36b,e:0xffb830,desc:'Anneau doré au-dessus'},
{id:'a2',t:'a',n:'Anneau',r:0,p:550,g:'ring',c:0x6be3ff,e:0x2ab8e8,desc:'Cercle cyan autour'},
{id:'a3',t:'a',n:'Couronne',r:1,p:1100,g:'crown',c:0xffd36b,e:0xb86a00,desc:'Couronne à pointes'},
{id:'a4',t:'a',n:'Orbe',r:1,p:950,g:'orb',c:0xc58bff,e:0x9a4dff,desc:'Sphère qui orbite'},
{id:'a5',t:'a',n:'Aura douce',r:2,p:1600,g:'aura',c:0x7dffb0,e:0x4dff8f,desc:'Halo vert transparent'},
{id:'a6',t:'a',n:'Ailerons',r:2,p:1500,g:'fins',c:0xff6b8a,e:0xff3fc4,desc:'Deux ailerons latéraux'},
{id:'a7',t:'a',n:'Satellite',r:3,p:2800,g:'sat',c:0xffffff,e:0x6be3ff,desc:'Cube en orbite'},
{id:'u1',t:'u',n:'Aimant +',r:0,p:700,desc:'Rayon d’aimant +2'},
{id:'u2',t:'u',n:'Dash vif',r:0,p:850,desc:'Dash se recharge plus vite'},
{id:'u3',t:'u',n:'Pas léger',r:1,p:1100,desc:'Vitesse de course +5 %'},
{id:'u4',t:'u',n:'Combo souple',r:0,p:650,desc:'Fenêtre de combo plus large'},
{id:'u5',t:'u',n:'Bouclier +',r:1,p:1200,desc:'Boucliers durent +15 %'},
{id:'u6',t:'u',n:'Gel +',r:1,p:1100,desc:'Gel dure +15 %'},
{id:'u7',t:'u',n:'Récolte',r:2,p:1800,desc:'+1 lueur toutes les 8 prises'}
];
const find=id=>CAT.find(i=>i.id==id)||(id=='t0'?DEFT:id=='a0'?DEFA:DEFK);
