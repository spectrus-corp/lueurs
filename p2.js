function priceOf(it){return it.p!=null?it.p:PR[it.r]}
let owned=['k0','t0','a0'],eq={k:'k0',t:'t0',a:'a0'},wallet=0,shopTab='k';
try{const s=JSON.parse(localStorage.getItem('lueursInv')||'null');if(s){owned=s.o||owned;eq=Object.assign(eq,s.e||{});wallet=+s.w||0}}catch(e){}
if(!owned.includes('k0'))owned.push('k0');if(!owned.includes('t0'))owned.push('t0');if(!owned.includes('a0'))owned.push('a0');
function save(){try{localStorage.setItem('lueursInv',JSON.stringify({o:owned,e:eq,w:wallet}))}catch(e){}}
async function syncWallet(){try{const r=await fetch('/api/wallet');if(!r.ok)throw 0;const j=await r.json();if(typeof j.wallet==='number'){wallet=Math.max(wallet,j.wallet);if(wallet<10000)wallet=10000;save();$('wl').textContent='◈ '+fmt(wallet)}}catch(e){if(wallet<10000){wallet=10000;save()}}}$('wl').textContent='◈ '+fmt(wallet);syncWallet();
function hasU(id){return owned.includes(id)}
function upMagnetR(){return 14+(hasU('u1')?2:0)+(hasU('u9')?2:0)}
function upDashCd(){return hasU('u8')?1.2:hasU('u2')?1.35:1.6}
function upSpeed(){return hasU('u3')?1.05:1}
function upComboWin(){return hasU('u10')?2.35:hasU('u4')?2.0:1.6}
function upShieldMul(){return hasU('u5')?1.15:1}
function upFreezeMul(){return hasU('u6')?1.15:1}
let curSkin=DEFK,curTrail=DEFT,bd=null,accM=null,tE=0;
function mk(c,e,i=1){return new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:i,roughness:.35,metalness:.25})}
function setSkin(id){const s=find(id);curSkin=s;if(bd){P.remove(bd);bd.geometry.dispose()}
const G={cone:()=>{const q=new THREE.ConeGeometry(.7,1.7,6);q.rotateX(Math.PI/2);return q},cyl:()=>{const q=new THREE.CylinderGeometry(.35,.6,1.7,8);q.rotateX(Math.PI/2);return q},oct:()=>new THREE.OctahedronGeometry(.95),tet:()=>new THREE.TetrahedronGeometry(1.05),ico:()=>new THREE.IcosahedronGeometry(.85),dod:()=>new THREE.DodecahedronGeometry(.85),knot:()=>new THREE.TorusKnotGeometry(.55,.2,48,8)};
bd=new THREE.Mesh(G[s.g](),mk(s.c,s.e,s.i||1));if(s.gh){bd.material.transparent=true;bd.material.opacity=.6}bd.position.y=.8;P.add(bd);setAcc(eq.a||'a0')}
function setAcc(id){
if(accM){P.remove(accM);accM.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose&&m.dispose())}});accM=null}
const it=find(id);if(!it||it.t!='a'||!it.g||it.g=='none'||it.id=='a0')return;
accM=new THREE.Group();const col=it.c||0xffd36b,em=it.e||col,mat=mk(col,em,1.2);
if(it.g=='halo'){const m=new THREE.Mesh(new THREE.TorusGeometry(.85,.06,8,24),mat);m.rotation.x=Math.PI/2;m.position.y=1.85;accM.add(m)}
else if(it.g=='ring'){const m=new THREE.Mesh(new THREE.TorusGeometry(1.05,.05,8,28),mat);m.rotation.x=Math.PI/2;m.position.y=.8;accM.add(m)}
else if(it.g=='crown'){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const m=new THREE.Mesh(new THREE.ConeGeometry(.12,.35,5),mat);m.position.set(Math.cos(a)*.45,1.95,Math.sin(a)*.45);accM.add(m)}const base=new THREE.Mesh(new THREE.TorusGeometry(.42,.05,6,16),mat);base.rotation.x=Math.PI/2;base.position.y=1.75;accM.add(base)}
else if(it.g=='orb'){const m=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),mat);m.position.set(.9,1.2,0);m.userData.spin=1;accM.add(m)}
else if(it.g=='aura'){const m=new THREE.Mesh(new THREE.SphereGeometry(1.35,16,12),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.18}));m.position.y=.8;accM.add(m)}
else if(it.g=='fins'){for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.ConeGeometry(.2,.8,5),mat);m.rotation.z=s*.7;m.position.set(s*.7,.9,0);accM.add(m)}}
else if(it.g=='sat'){const m=new THREE.Mesh(new THREE.BoxGeometry(.25,.25,.25),mat);m.position.set(1.1,1.1,0);m.userData.orbit=1;accM.add(m)}
P.add(accM)}
const trl=[];function mkTrail(tr){if(!tr||!tr.c||!tr.c.length)return;const c=tr.c[Math.floor(Math.random()*tr.c.length)],s0=(tr.s||1)*(0.12+Math.random()*0.18),m=new THREE.Mesh(new THREE.SphereGeometry(1,6,6),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:tr.l||.75}));m.position.copy(P.position);m.position.y=.4;m.scale.setScalar(s0);m.userData={life:tr.L||.55,L:tr.L||.55,s0,up:(tr.up||0)*(0.5+Math.random()),vx:(Math.random()-.5)*(tr.j||0),vz:(Math.random()-.5)*(tr.j||0)};S.add(m);trl.push(m)}
