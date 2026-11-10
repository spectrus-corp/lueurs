/* Performance: trails + particle caps */
(function(){
  window.TRAIL_MAX=36;
  window.BITS_MAX=40;
  function trailMat(col){
    return new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.75,depthWrite:false});
  }
  window.mkTrail=function(it){
    try{
      if(!it||!it.c||!it.c.length)return;
      if(typeof trl==='undefined')return;
      while(trl.length>=TRAIL_MAX){const o=trl.shift();try{S.remove(o)}catch(e){}}
      const cols=it.c;
      const col=cols[Math.floor(Math.random()*cols.length)];
      const style=it.style||'dots';
      let geo,mesh;
      if(style==='streak'){
        geo=new THREE.BoxGeometry(.12,.12,.55);
        mesh=new THREE.Mesh(geo,trailMat(col));
      }else{
        const s=(it.s||1)*.18;
        geo=new THREE.SphereGeometry(s,6,6);
        mesh=new THREE.Mesh(geo,trailMat(col));
      }
      mesh.position.set(P.position.x+(Math.random()-.5)*.2,.35+Math.random()*.2,P.position.z+(Math.random()-.5)*.2);
      const L=(it.l||.55);
      mesh.userData={life:L,L:L,up:it.up||0,s0:1,style:style};
      S.add(mesh);trl.push(mesh);
    }catch(e){}
  };
  window.clearFluid=function(){};
  window.updateFluidTrail=function(){};
  if(typeof burst==='function'){
    const _b=burst;
    window.burst=burst=function(p,k,n){
      n=Math.min(n||8,8);
      try{if(typeof bits!=='undefined'&&bits.length>BITS_MAX){
        const drop=bits.length-BITS_MAX+n;
        for(let i=0;i<drop;i++){const b=bits.shift();try{S.remove(b)}catch(e){}}
      }}catch(e){}
      return _b(p,k,n);
    };
  }
  try{
    if(typeof R!=='undefined'){
      const pr=Math.min(devicePixelRatio||1, /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)?1.25:1.5);
      R.setPixelRatio(pr);
      R.setSize(innerWidth,innerHeight);
    }
  }catch(e){}
})();
