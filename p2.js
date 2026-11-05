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
function upMagnetR(){return 14+(hasU('u1')?2:0)+(hasU('u9')?2:0)}
function upDashCd(){return hasU('u8')?1.2:hasU('u2')?1.35:1.6}
function upSpeed(){return hasU('u3')?1.05:1}
function upComboWin(){return hasU('u10')?2.35:hasU('u4')?2.0:1.6}
function upShieldMul(){return hasU('u5')?1.15:1}
function upFreezeMul(){return hasU('u6')?1.15:1}

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
else if(it.g=='aura'){const m=new THREE.Mesh(new THREE.SphereGeometry(1.35,16,12),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.18,depthWrite:false}));m.position.y=.8;accM.add(m)}
else if(it.g=='fins'){for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.ConeGeometry(.2,.7,4),mat);m.rotation.z=s*.9;m.position.set(s*.7,.9,0);accM.add(m)}}
else if(it.g=='sat'){const m=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,.18),mat);m.position.set(1.1,1.1,0);m.userData.orbit=1;accM.add(m)}
P.add(accM)
}
/* ---- Tra\u00een\u00e9es : points + fluide ---- */
let fluidHist=[],fluidMesh=null,fluidGeo=null,fluidMat=null;
function clearFluid(){
  fluidHist.length=0;
  if(fluidMesh){S.remove(fluidMesh);if(fluidGeo)fluidGeo.dispose();fluidMesh=null;fluidGeo=null}
}
function rebuildFluid(tr){
  const n=fluidHist.length;
  if(n<2){if(fluidMesh)fluidMesh.visible=false;return}
  const w=tr.fw||.42, half=w/2;
  const pos=new Float32Array(n*2*3);
  const col=new Float32Array(n*2*3);
  const idx=[];
  const cols=tr.c&&tr.c.length?tr.c:[0x6be3ff];
  for(let i=0;i<n;i++){
    const p=fluidHist[i];
    let tx=0,tz=1;
    if(i<n-1){tx=fluidHist[i].x-fluidHist[i+1].x;tz=fluidHist[i].z-fluidHist[i+1].z}
    else if(i>0){tx=fluidHist[i-1].x-fluidHist[i].x;tz=fluidHist[i-1].z-fluidHist[i].z}
    const len=Math.hypot(tx,tz)||1;tx/=len;tz/=len;
    const px=-tz,pz=tx;
    const fade=1-i/(n-1);
    const wi=half*(.55+.45*fade);
    const base=i*6;
    pos[base]=p.x+px*wi; pos[base+1]=p.y; pos[base+2]=p.z+pz*wi;
    pos[base+3]=p.x-px*wi; pos[base+4]=p.y; pos[base+5]=p.z-pz*wi;
    const hc=cols[i%cols.length];
    const r=((hc>>16)&255)/255,g=((hc>>8)&255)/255,b=(hc&255)/255;
    const a=fade;
    col[base]=r*a;col[base+1]=g*a;col[base+2]=b*a;
    col[base+3]=r*a;col[base+4]=g*a;col[base+5]=b*a;
  }
  for(let i=0;i<n-1;i++){
    const a=i*2,b=i*2+1,c=i*2+2,d=i*2+3;
    idx.push(a,b,c, b,d,c);
  }
  if(fluidGeo)fluidGeo.dispose();
  fluidGeo=new THREE.BufferGeometry();
  fluidGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  fluidGeo.setAttribute('color',new THREE.BufferAttribute(col,3));
  fluidGeo.setIndex(idx);
  if(!fluidMesh){
    fluidMat=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.9,depthWrite:false,side:THREE.DoubleSide});
    fluidMesh=new THREE.Mesh(fluidGeo,fluidMat);
    S.add(fluidMesh);
  }else{
    fluidMesh.geometry=fluidGeo;
    fluidMesh.visible=true;
  }
}
function mkTrail(tr){
  if(!tr||!tr.c||!tr.c.length)return;
  const st=tr.style||'dots';
  if(st==='fluid')return;
  const c=tr.c[Math.floor(Math.random()*tr.c.length)];
  let mt=tcache.get(c+(st==='streak'?'s':''));
  if(!mt){mt=pc(c);if(st==='streak')mt=mt.clone();tcache.set(c+(st==='streak'?'s':''),mt)}
  const m=new THREE.Mesh(pg,mt),j=tr.j||.3,s0=tr.s||1,L=tr.l||.6;
  m.position.set(P.position.x-vel.x*.05+(Math.random()-.5)*j,.5+Math.random()*.5,P.position.z-vel.z*.05+(Math.random()-.5)*j);
  if(st==='streak'&&vel.length()>0.5){
    const d=vel.clone().normalize();
    m.scale.set(s0*.45,s0*.45,s0*(1.8+Math.random()));
    m.lookAt(m.position.x+d.x,m.position.y,m.position.z+d.z);
  }else m.scale.setScalar(s0);
  m.userData={life:L,L,up:tr.up||0,s0,style:st};
  S.add(m);trl.push(m);
}
function updateFluidTrail(dt){
  const tr=curTrail;
  if(!tr||tr.style!=='fluid'||!tr.c||!tr.c.length){if(fluidHist.length)clearFluid();return}
  if(run&&!paused&&vel.length()>1.2){
    const p=P.position;
    const last=fluidHist[0];
    if(!last||Math.hypot(p.x-last.x,p.z-last.z)>0.12){
      fluidHist.unshift({x:p.x,y:.35+Math.min(.25,vel.length()*0.01),z:p.z});
      const maxN=tr.flen||36;
      while(fluidHist.length>maxN)fluidHist.pop();
    }
  }else if(fluidHist.length){
    if(Math.random()<dt*8)fluidHist.pop();
  }
  rebuildFluid(tr);
}
window.updateFluidTrail=updateFluidTrail;
window.clearFluid=clearFluid;
