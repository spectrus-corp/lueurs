/* Player body + accessories — after p1. Re-applies after eq loads (p2). */
function geoOf(g){
  switch(g){
    case 'cone': return new THREE.ConeGeometry(.55,1.2,12);
    case 'cyl': return new THREE.CylinderGeometry(.4,.4,1.1,12);
    case 'oct': return new THREE.OctahedronGeometry(.68);
    case 'tet': return new THREE.TetrahedronGeometry(.85);
    case 'ico': return new THREE.IcosahedronGeometry(.68,0);
    case 'dod': return new THREE.DodecahedronGeometry(.64);
    case 'knot': return new THREE.TorusKnotGeometry(.4,.12,64,8);
    default: return new THREE.ConeGeometry(.55,1.2,12);
  }
}
function setSkin(id){
  const it=(typeof find==='function'?find(id):null)||(typeof DEFK!=='undefined'?DEFK:{g:'cone',c:0xffd36b,e:0x553300});
  try{curSkin=it}catch(e){}
  try{if(typeof bd!=='undefined'&&bd){P.remove(bd);if(bd.geometry)bd.geometry.dispose();if(bd.material)bd.material.dispose()}}catch(e){}
  const mat=new THREE.MeshStandardMaterial({
    color:it.c!=null?it.c:0xffd36b,
    emissive:it.e!=null?it.e:0x553300,
    emissiveIntensity:it.i!=null?it.i:1.2,
    roughness:.4,metalness:.2
  });
  bd=new THREE.Mesh(geoOf(it.g||'cone'),mat);
  bd.position.y=.65;
  if((it.g||'cone')==='cone')bd.rotation.x=Math.PI;
  P.add(bd);
  P.visible=true;
}
function setAcc(id){
  const it=(typeof find==='function'?find(id):null)||(typeof DEFA!=='undefined'?DEFA:{g:'none'});
  try{if(accM){P.remove(accM);accM.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()});accM=null}}catch(e){}
  if(!it||it.g==='none'||id==='a0'||!id)return;
  accM=new THREE.Group();
  const col=it.c!=null?it.c:0xffd36b, em=it.e!=null?it.e:0xffb830;
  const mat=new THREE.MeshStandardMaterial({color:col,emissive:em,emissiveIntensity:1.1,roughness:.45,metalness:.2,transparent:true,opacity:.95});
  if(it.g==='halo'||it.g==='ring'){
    const r=new THREE.Mesh(new THREE.TorusGeometry(.85,.05,8,24),mat);
    r.rotation.x=Math.PI/2;r.position.y=it.g==='halo'?1.55:.35;accM.add(r);
  }else if(it.g==='crown'){
    for(let i=0;i<5;i++){
      const a=i/5*Math.PI*2;
      const spike=new THREE.Mesh(new THREE.ConeGeometry(.1,.3,5),mat);
      spike.position.set(Math.cos(a)*.42,1.4,Math.sin(a)*.42);accM.add(spike);
    }
    const band=new THREE.Mesh(new THREE.TorusGeometry(.4,.04,6,16),mat);
    band.rotation.x=Math.PI/2;band.position.y=1.2;accM.add(band);
  }else if(it.g==='orb'){
    const o=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),mat);
    o.position.set(.9,.9,0);o.userData.orbit=true;accM.add(o);
  }else if(it.g==='aura'){
    const a=new THREE.Mesh(new THREE.SphereGeometry(1.05,12,10),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.15}));
    a.position.y=.6;accM.add(a);
  }else if(it.g==='fins'){
    const f1=new THREE.Mesh(new THREE.ConeGeometry(.16,.65,5),mat);f1.position.set(.7,.6,0);f1.rotation.z=-.6;accM.add(f1);
    const f2=f1.clone();f2.position.x=-.7;f2.rotation.z=.6;accM.add(f2);
  }else if(it.g==='sat'){
    const c=new THREE.Mesh(new THREE.BoxGeometry(.25,.25,.25),mat);
    c.position.set(1.05,.8,0);c.userData.spin=true;accM.add(c);
  }
  P.add(accM);
}
function setCoat(id){try{eq.v=id||'v0'}catch(e){}}
function applySavedLook(){
  try{
    if(typeof eq==='undefined')return false;
    setSkin(eq.k||'k0');
    if(typeof find==='function')curTrail=find(eq.t||'t0');
    setAcc(eq.a||'a0');
    setCoat(eq.v||'v0');
    return true;
  }catch(e){return false}
}
window.setSkin=setSkin;window.setAcc=setAcc;window.setCoat=setCoat;window.applySavedLook=applySavedLook;
try{setSkin('k0')}catch(e){}
(function(){
  let n=0;
  const t=setInterval(function(){
    n++;
    if(typeof eq!=='undefined'&&eq){applySavedLook();if(n>8)clearInterval(t)}
    if(n>40)clearInterval(t);
  },100);
})();
