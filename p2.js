function priceOf(it){return it.p!=null?it.p:PR[it.r]}
let wallet=0,owned=[],eq={k:'k0',t:'t0',a:'a0'},bd=null,accM=null,curSkin=DEFK,curTrail=DEFT,tE=0,shownSlot=-1,shopTab='all',previewing=null;
try{wallet=+localStorage.getItem('lueursW')||0;owned=JSON.parse(localStorage.getItem('lueursO')||'[]');eq=Object.assign(eq,JSON.parse(localStorage.getItem('lueursE')||'{}'));muted=localStorage.getItem('lueursM')=='1'}catch(e){}
if(!eq.a)eq.a='a0';
function save(){try{localStorage.setItem('lueursW',wallet);localStorage.setItem('lueursO',JSON.stringify(owned));localStorage.setItem('lueursE',JSON.stringify(eq))}catch(e){}
try{fetch('/api/wallet',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({wallet,owned,eq})}).catch(()=>{})}catch(e){}}
async function syncWallet(){try{const r=await fetch('/api/wallet',{cache:'no-store'});if(!r.ok)throw 0;const d=await r.json();
if(typeof d.wallet==='number'&&d.wallet>wallet)wallet=d.wallet;
if(Array.isArray(d.owned)){for(const id of d.owned){if(typeof id==='string'&&!owned.includes(id))owned.push(id)}}
if(d.eq&&typeof d.eq==='object'){if(d.eq.k)eq.k=d.eq.k;if(d.eq.t)eq.t=d.eq.t;if(d.eq.a)eq.a=d.eq.a}}catch(e){}
try{if(!localStorage.getItem('lueursGrant10k')){wallet=Math.max(wallet,10000);localStorage.setItem('lueursGrant10k','1')}}catch(e){wallet=Math.max(wallet,10000)}
save();try{$('wl').textContent='◈ '+fmt(wallet)}catch(e){}
try{setSkin(eq.k);curTrail=find(eq.t);setAcc(eq.a||'a0')}catch(e){}}
syncWallet();
function hasU(id){return owned.includes(id)}
function upMagnetR(){return 14+(hasU('u1')?2:0)}
function upDashCd(){return hasU('u2')?1.35:1.6}
function upSpeed(){return hasU('u3')?1.05:1}
function upComboWin(){return hasU('u4')?2.0:1.6}
function upShieldMul(){return hasU('u5')?1.15:1}
function upFreezeMul(){return hasU('u6')?1.15:1}

function setSkin(id){const s=find(id);curSkin=s;if(bd){P.remove(bd);bd.geometry.dispose()}
const G={cone:()=>{const q=new THREE.ConeGeometry(.7,1.7,6);q.rotateX(Math.PI/2);return q},cyl:()=>{const q=new THREE.CylinderGeometry(.35,.6,1.7,8);q.rotateX(Math.PI/2);return q},oct:()=>new THREE.OctahedronGeometry(.95),tet:()=>new THREE.TetrahedronGeometry(1.05),ico:()=>new THREE.IcosahedronGeometry(.85),dod:()=>new THREE.DodecahedronGeometry(.85),knot:()=>new THREE.TorusKnotGeometry(.55,.2,48,8)};
bd=new THREE.Mesh(G[s.g](),mk(s.c,s.e,s.i||1));if(s.gh){bd.material.transparent=true;bd.material.opacity=.6}bd.position.y=.8;P.add(bd);setAcc(previewing&&find(previewing).t=='a'?previewing:(eq.a||'a0'))}
function setAcc(id){
if(accM){P.remove(accM);accM.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose&&m.dispose())}});accM=null}
const it=find(id);if(!it||it.t!='a'||!it.g||it.g=='none'||it.id=='a0')return;
accM=new THREE.Group();const col=it.c||0xffd36b,em=it.e||col,mat=mk(col,em,1.2);
if(it.g=='halo'){const m=new THREE.Mesh(new THREE.TorusGeometry(.85,.06,8,24),mat);m.rotation.x=Math.PI/2;m.position.y=1.85;accM.add(m)}
else if(it.g=='ring'){const m=new THREE.Mesh(new THREE.TorusGeometry(1.05,.05,8,28),mat);m.rotation.x=Math.PI/2;m.position.y=.8;accM.add(m)}
else if(it.g=='crown'){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const m=new THREE.Mesh(new THREE.ConeGeometry(.12,.35,5),mat);m.position.set(Math.cos(a)*.45,1.95,Math.sin(a)*.45);accM.add(m)}const base=new THREE.Mesh(new THREE.TorusGeometry(.42,.05,6,16),mat);base.rotation.x=Math.PI/2;base.position.y=1.75;accM.add(base)}
else if(it.g=='orb'){const m=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),mat);m.position.set(.9,1.2,0);m.userData.spin=1;accM.add(m)}
else if(it.g=='aura'){const m=new THREE.Mesh(new THREE.SphereGeometry(1.35,16,12),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.18,depthWrite:false}));m.position.y=.8;accM.add(m)}
else if(it.g=='fins'){for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.ConeGeometry(.2,.7,4),mat);m.rotation.z=s*.9;m.position.set(s*.7,.9,0);accM.add(m)}}
else if(it.g=='sat'){const m=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,.18),mat);m.position.set(1.1,1.1,0);m.userData.orbit=1;accM.add(m)}
P.add(accM)
}
function mkTrail(tr){if(!tr||!tr.c||!tr.c.length)return;const c=tr.c[Math.floor(Math.random()*tr.c.length)];let mt=tcache.get(c);if(!mt){mt=pc(c);tcache.set(c,mt)}
const m=new THREE.Mesh(pg,mt),j=tr.j||.3,s0=tr.s||1,L=tr.l||.6;
const back=previewing?1.1:.05;
m.position.set(P.position.x-Math.sin(P.rotation.y)*back+(Math.random()-.5)*j,.5+Math.random()*.5,P.position.z-Math.cos(P.rotation.y)*back+(Math.random()-.5)*j);
m.userData={life:L,L,up:tr.up||0,s0};m.scale.setScalar(s0);S.add(m);trl.push(m)}
const hx=c=>'#'+c.toString(16).padStart(6,'0');
