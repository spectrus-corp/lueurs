/* Player body + accessories — must load after p1 (find, CAT, DEFK) */
function geoOf(g){
  switch(g){
    case 'cone': return new THREE.ConeGeometry(.55,1.2,14);
    case 'cyl': return new THREE.CylinderGeometry(.42,.42,1.15,14);
    case 'oct': return new THREE.OctahedronGeometry(.72);
    case 'tet': return new THREE.TetrahedronGeometry(.9);
    case 'ico': return new THREE.IcosahedronGeometry(.72,0);
    case 'dod': return new THREE.DodecahedronGeometry(.68);
    case 'knot': return new THREE.TorusKnotGeometry(.42,.14,96,12);
    default: return new THREE.ConeGeometry(.55,1.2,14);
  }
}
function setSkin(id){
  const it=(typeof find==='function'?find(id):null)||DEFK;
  curSkin=it;
  try{if(typeof bd!=='undefined'&&bd){P.remove(bd);if(bd.geometry)bd.geometry.dispose();if(bd.material)bd.material.dispose()}}catch(e){}
  const mat=new THREE.MeshStandardMaterial({
    color:it.c!=null?it.c:0xffd36b,
    emissive:it.e!=null?it.e:0x553300,
    emissiveIntensity:it.i!=null?it.i:1.35,
    roughness:.38,metalness:.22
  });
  bd=new THREE.Mesh(geoOf(it.g||'cone'),mat);
  bd.position.y=.65;
  if((it.g||'cone')==='cone')bd.rotation.x=Math.PI;
  P.add(bd);
  P.visible=true;
}
function setAcc(id){
  const it=(typeof find==='function'?find(id):null)||DEFA;
  try{if(accM){P.remove(accM);accM.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()});accM=null}}catch(e){}
  if(!it||it.g==='none'||id==='a0')return;
  accM=new THREE.Group();
  const col=it.c!=null?it.c:0xffd36b, em=it.e!=null?it.e:0xffb830;
  const mat=new THREE.MeshStandardMaterial({color:col,emissive:em,emissiveIntensity:1.2,roughness:.4,metalness:.25,transparent:true,opacity:.95});
  if(it.g==='halo'||it.g==='ring'){
    const r=new THREE.Mesh(new THREE.TorusGeometry(.85,.06,10,32),mat);
    r.rotation.x=Math.PI/2;r.position.y=it.g==='halo'?1.55:.35;accM.add(r);
  }else if(it.g==='crown'){
    for(let i=0;i<5;i++){
      const a=i/5*Math.PI*2;
      const spike=new THREE.Mesh(new THREE.ConeGeometry(.12,.35,6),mat);
      spike.position.set(Math.cos(a)*.45,1.45,Math.sin(a)*.45);accM.add(spike);
    }
    const band=new THREE.Mesh(new THREE.TorusGeometry(.42,.05,8,24),mat);
    band.rotation.x=Math.PI/2;band.position.y=1.25;accM.add(band);
  }else if(it.g==='orb'){
    const o=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),mat);
    o.position.set(.9,.9,0);o.userData.orbit=true;accM.add(o);
  }else if(it.g==='aura'){
    const a=new THREE.Mesh(new THREE.SphereGeometry(1.1,16,12),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.18}));
    a.position.y=.6;accM.add(a);
  }else if(it.g==='fins'){
    const f1=new THREE.Mesh(new THREE.ConeGeometry(.18,.7,6),mat);f1.position.set(.7,.6,0);f1.rotation.z=-.6;accM.add(f1);
    const f2=f1.clone();f2.position.x=-.7;f2.rotation.z=.6;accM.add(f2);
  }else if(it.g==='sat'){
    const c=new THREE.Mesh(new THREE.BoxGeometry(.28,.28,.28),mat);
    c.position.set(1.1,.8,0);c.userData.spin=true;accM.add(c);
  }
  P.add(accM);
}
function setCoat(id){try{eq.v=id||'v0'}catch(e){}}
window.setSkin=setSkin;window.setAcc=setAcc;window.setCoat=setCoat;
try{setSkin((eq&&eq.k)||'k0');setAcc((eq&&eq.a)||'a0')}catch(e){try{setSkin('k0')}catch(err){}}
